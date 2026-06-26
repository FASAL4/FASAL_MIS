#!/usr/bin/env python3
"""
Build Master Context Database and Index
=========================================
Reads all files in the workspace (c:/Users/bentn/antigravity/Untitled),
chunks large CSVs/Excel files, extracts text from PDFs/Markdown/TXT,
and writes everything into master_context.db + master_index.json.
"""

import os
import re
import json
import sqlite3
import traceback
from pathlib import Path

import pandas as pd
import pdfplumber

WORKSPACE = Path(r"c:/Users/bentn/antigravity/Untitled")
DB_PATH = WORKSPACE / "master_context.db"
INDEX_PATH = WORKSPACE / "master_index.json"

IGNORE_DIRS = {".git", "node_modules", ".vscode", "assets"}
IGNORE_FILES = {"test_sales_data.csv"}

# ---------------------------------------------------------------------------
# helpers
# ---------------------------------------------------------------------------


def normalize_headers(df: pd.DataFrame) -> pd.DataFrame:
    """Lower-case, strip whitespace, replace spaces/special chars with underscores.
    Handles non-string column types by converting them to strings first.
    Deduplicates column names to avoid SQLite duplicate column errors.
    """
    cols = [str(c) for c in df.columns]
    cols = [c.lower().strip() for c in cols]
    cols = [re.sub(r"[^a-z0-9_]", "_", c) for c in cols]
    cols = [re.sub(r"_+", "_", c) for c in cols]
    cols = [c.strip("_") for c in cols]
    # Ensure no column name is empty after normalization
    cols = [c if c else "col" for c in cols]
    # Deduplicate
    seen: set[str] = set()
    deduped: list[str] = []
    for c in cols:
        if not c:
            c = "unnamed"
        while c in seen:
            parts = c.rsplit("_", 1)
            if len(parts) == 2 and parts[1].isdigit():
                c = f"{parts[0]}_{int(parts[1]) + 1}"
            else:
                c = f"{c}_1"
        seen.add(c)
        deduped.append(c)
    df.columns = deduped
    return df


def clean_table_name(path: Path) -> str:
    """Derive a safe SQL table name from a file path."""
    name = path.stem.replace(" ", "_").replace("-", "_").replace(",", "")
    while "__" in name:
        name = name.replace("__", "_")
    if name and name[0].isdigit():
        name = "t_" + name
    if not name:
        name = "unnamed"
    return name.lower()


def _store_schema(schema_dict: dict, table: str, df: pd.DataFrame):
    """Capture schema (column names & dtypes) for a table."""
    schema_dict[table] = [
        {"name": col, "dtype": str(dtype)}
        for col, dtype in zip(df.columns, df.dtypes)
    ]


def _too_many_columns(df: pd.DataFrame) -> bool:
    """SQLite has a limit of ~2000 columns; we use 1900 as safety margin."""
    return len(df.columns) > 1900


def _write_df_to_sql(
    df: pd.DataFrame,
    base_table: str,
    conn: sqlite3.Connection,
    schema_dict: dict,
    row_counts: dict,
    if_exists: str = "replace",
):
    """Write a DataFrame to SQLite, splitting into multiple tables if too many columns."""
    df = normalize_headers(df)
    df = df.where(pd.notna(df), None)

    if _too_many_columns(df):
        max_cols = 1900
        n_tables = (len(df.columns) + max_cols - 1) // max_cols
        for i in range(n_tables):
            sub_table = f"{base_table}_part{i+1}"
            start = i * max_cols
            end = min((i + 1) * max_cols, len(df.columns))
            sub_df = df.iloc[:, start:end]
            _store_schema(schema_dict, sub_table, sub_df)
            sub_df.to_sql(sub_table, conn, if_exists=if_exists, index=False)
            row_counts[sub_table] = len(sub_df)
    else:
        _store_schema(schema_dict, base_table, df)
        df.to_sql(base_table, conn, if_exists=if_exists, index=False)
        row_counts[base_table] = len(df)


# ---------------------------------------------------------------------------
# processors
# ---------------------------------------------------------------------------


class Processor:
    def __init__(self):
        self.conn = sqlite3.connect(str(DB_PATH))
        self.cursor = self.conn.cursor()
        self.schema: dict[str, list] = {}
        self.row_counts: dict[str, int] = {}
        self.processed_files: list[str] = []

    def close(self):
        self.conn.close()

    # -- tabular data -------------------------------------------------------

    def process_csv(self, path: Path):
        """Stream a CSV file into a SQLite table using chunks."""
        table = clean_table_name(path)
        print(f"  [CSV] {path.name} -> table `{table}`")
        first = True
        total_rows = 0
        for chunk in pd.read_csv(path, chunksize=10000, dtype_backend="numpy_nullable", low_memory=False):
            chunk = normalize_headers(chunk)
            chunk = chunk.where(pd.notna(chunk), None)

            if _too_many_columns(chunk):
                max_cols = 1900
                n_tables = (len(chunk.columns) + max_cols - 1) // max_cols
                for i in range(n_tables):
                    sub_table = f"{table}_part{i+1}"
                    start = i * max_cols
                    end = min((i + 1) * max_cols, len(chunk.columns))
                    sub_df = chunk.iloc[:, start:end]
                    if first:
                        _store_schema(self.schema, sub_table, sub_df)
                    sub_df.to_sql(
                        sub_table, self.conn,
                        if_exists="replace" if first else "append",
                        index=False,
                    )
            else:
                if first:
                    _store_schema(self.schema, table, chunk)
                chunk.to_sql(
                    table, self.conn,
                    if_exists="replace" if first else "append",
                    index=False,
                )

            total_rows += len(chunk)
            first = False
            print(f"    chunk -> {len(chunk)} rows (cumulative {total_rows})")

        self.row_counts[table] = total_rows
        self.processed_files.append(str(path))

    def process_excel(self, path: Path):
        """Read an Excel file sheet-by-sheet, each sheet gets its own table."""
        xl = pd.ExcelFile(path, engine="openpyxl")
        for sheet in xl.sheet_names:
            safe_sheet = sheet.strip().replace(" ", "_").replace("-", "_")
            safe_sheet = "".join(c for c in safe_sheet if c.isalnum() or c == "_")
            if safe_sheet and safe_sheet[0].isdigit():
                safe_sheet = "s_" + safe_sheet
            if not safe_sheet:
                safe_sheet = "sheet_0"
            base_table = f"{clean_table_name(path)}_{safe_sheet}"
            print(f"  [XLSX] {path.name} / sheet `{sheet}` -> table `{base_table}`")

            df = pd.read_excel(
                path, sheet_name=sheet, engine="openpyxl", dtype_backend="numpy_nullable"
            )
            df = normalize_headers(df)
            df = df.where(pd.notna(df), None)

            if _too_many_columns(df):
                max_cols = 1900
                n_tables = (len(df.columns) + max_cols - 1) // max_cols
                for i in range(n_tables):
                    sub_table = f"{base_table}_part{i+1}"
                    start = i * max_cols
                    end = min((i + 1) * max_cols, len(df.columns))
                    sub_df = df.iloc[:, start:end]
                    _store_schema(self.schema, sub_table, sub_df)
                    sub_df.to_sql(sub_table, self.conn, if_exists="replace", index=False)
                    self.row_counts[sub_table] = len(sub_df)
                    print(f"    part {i+1}/{n_tables} -> {len(sub_df)} rows, {len(sub_df.columns)} cols")
            else:
                _store_schema(self.schema, base_table, df)
                df.to_sql(base_table, self.conn, if_exists="replace", index=False)
                self.row_counts[base_table] = len(df)
                print(f"    -> {len(df)} rows, {len(df.columns)} cols")

        self.processed_files.append(str(path))

    # -- document data ------------------------------------------------------

    def _ensure_documents_table(self):
        self.cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                filename TEXT NOT NULL,
                content TEXT,
                type TEXT NOT NULL
            )
            """
        )
        self.conn.commit()

    def process_text_file(self, path: Path, file_type: str):
        """Insert a plain-text file (md, txt, etc.) into the documents table."""
        print(f"  [TEXT] {path.name} ({file_type})")
        self._ensure_documents_table()
        try:
            content = path.read_text(encoding="utf-8", errors="replace")
        except Exception:
            content = path.read_text(encoding="latin-1", errors="replace")
        self.cursor.execute(
            "INSERT INTO documents (filename, content, type) VALUES (?, ?, ?)",
            (path.name, content, file_type),
        )
        self.conn.commit()
        self.processed_files.append(str(path))

    def process_pdf(self, path: Path):
        """Extract text from a PDF page-by-page and insert into documents table."""
        print(f"  [PDF] {path.name}")
        self._ensure_documents_table()
        full_text_parts = []
        try:
            with pdfplumber.open(str(path)) as pdf:
                for i, page in enumerate(pdf.pages, 1):
                    text = page.extract_text() or ""
                    full_text_parts.append(text)
                    if i % 10 == 0:
                        print(f"    page {i}/{len(pdf.pages)}")
            content = "\n\n".join(full_text_parts)
        except Exception:
            content = f"[PDF EXTRACTION FAILED: {traceback.format_exc()}]"
        self.cursor.execute(
            "INSERT INTO documents (filename, content, type) VALUES (?, ?, ?)",
            (path.name, content, "pdf"),
        )
        self.conn.commit()
        self.processed_files.append(str(path))

    # -- traversal ----------------------------------------------------------

    TABULAR_EXTENSIONS = {".csv", ".xlsx", ".xls"}
    TEXT_EXTENSIONS = {
        ".md", ".txt", ".json", ".xml", ".html",
        ".yaml", ".yml", ".toml", ".cfg", ".ini", ".log",
    }
    PDF_EXTENSIONS = {".pdf"}

    def run(self):
        print("Building master context database...")
        print(f"Workspace: {WORKSPACE}")
        print()

        for root_str, dirs, files in os.walk(str(WORKSPACE)):
            root = Path(root_str)
            # Skip ignored directories
            rel_parts = root.relative_to(WORKSPACE).parts
            if any(p in IGNORE_DIRS for p in rel_parts):
                dirs[:] = []
                continue
            # Prune ignored child dirs
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

            for fname in files:
                if fname in IGNORE_FILES:
                    print(f"  [SKIP] {fname} (excluded)")
                    continue
                fpath = root / fname
                ext = fpath.suffix.lower()

                try:
                    if ext in self.TABULAR_EXTENSIONS:
                        if ext == ".csv":
                            self.process_csv(fpath)
                        else:
                            self.process_excel(fpath)
                    elif ext in self.TEXT_EXTENSIONS:
                        self.process_text_file(fpath, ext.lstrip("."))
                    elif ext in self.PDF_EXTENSIONS:
                        self.process_pdf(fpath)
                    else:
                        pass  # skip unknown / binary
                except Exception:
                    print(f"  [!] ERROR processing {fpath.name}: {traceback.format_exc()}")

        # Capture documents table schema if it was created
        self.cursor.execute(
            "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
        )
        tables = [row[0] for row in self.cursor.fetchall()]
        if "documents" in tables:
            self.cursor.execute("PRAGMA table_info(documents)")
            cols = [{"name": row[1], "dtype": row[2]} for row in self.cursor.fetchall()]
            self.schema["documents"] = cols
            self.cursor.execute("SELECT COUNT(*) FROM documents")
            self.row_counts["documents"] = self.cursor.fetchone()[0]

        print()
        print("Generating master_index.json ...")

        index = {
            "database": str(DB_PATH),
            "workspace": str(WORKSPACE),
            "tables": {},
            "processed_files": self.processed_files,
            "total_files_processed": len(self.processed_files),
        }

        for table in tables:
            index["tables"][table] = {
                "schema": self.schema.get(table, []),
                "row_count": self.row_counts.get(table, 0),
            }

        with open(INDEX_PATH, "w", encoding="utf-8") as f:
            json.dump(index, f, indent=2, default=str)

        print(f"Written: {INDEX_PATH}")
        print(f"Database: {DB_PATH}")
        print("Done.")


# ---------------------------------------------------------------------------
# entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    proc = Processor()
    try:
        proc.run()
    finally:
        proc.close()