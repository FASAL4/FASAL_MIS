# Project Context: Master Data Unification

## Goal
Consolidate all unstructured and semi-structured data across the workspace (CSVs, Excel files, PDFs, Markdown) into a unified, queryable system.

## Architecture
Due to large file sizes preventing native context loading:
- **`master_context.db` (SQLite)**: Stores all tabular data (CSVs, Excel files) and textual extracts (Markdown, PDFs).
- **`master_index.json`**: Acts as the semantic index, mapping files to tables, defining schemas, and providing query templates.

## Agent Hand-off Protocol Active
- **Orchestrator**: Defines schemas and strategy (recorded here).
- **Worker (Cline)**: Executes Python/Node scripts to perform chunked reading and SQLite insertion. Monitors `.agent_memory/cline_inbox.md`.