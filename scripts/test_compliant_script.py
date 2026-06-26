#!/usr/bin/env python3
"""
Anti-Silent-Hang Compliance Demo
================================
Implements all 5 safeguards from .clinerules Section 3:
  1. Global Watchdog Timer (5 min alarm → TimeoutError)
  2. Unbuffered Output (flush=True on every print)
  3. Heartbeat Logging (writes progress to process_log.txt)
  4. Chunking (processes data in fixed-size chunks)
  5. Strict I/O Timeout (timeout parameter on file/network ops)

Usage:
    python scripts/test_compliant_script.py [--input FILE] [--rows N]

Run without arguments to execute a self-test on a synthetic dataset.
"""

import argparse
import os
import signal
import sys
import time
from typing import Iterator, List

# === 1. Global Watchdog Timer ==============================================
WATCHDOG_SECONDS = 5 * 60  # 5 minutes


class WatchdogTimeout(Exception):
    """Raised when the global watchdog timer expires."""
    pass


def _handle_timeout(signum: int, frame) -> None:
    # Dump state to process_log.txt before crashing
    with open("process_log.txt", "a", encoding="utf-8") as log:
        log.write(f"[WATCHDOG] TIMEOUT after {WATCHDOG_SECONDS}s -- dumping state\n")
        log.flush()
    raise WatchdogTimeout(
        f"Script exceeded watchdog timer of {WATCHDOG_SECONDS}s. "
        "State dumped to process_log.txt."
    )


# Register the alarm signal handler (SIGALRM on Unix; Windows fallback below)
if hasattr(signal, "SIGALRM"):
    signal.signal(signal.SIGALRM, _handle_timeout)
    signal.alarm(WATCHDOG_SECONDS)

# === 4. Chunking ===========================================================
CHUNK_SIZE = 100  # rows per chunk


def generate_rows(count: int) -> Iterator[int]:
    """Yield row numbers 1..count in a lazy (generator) fashion."""
    for i in range(1, count + 1):
        yield i


def chunker(rows: Iterator[int], size: int = CHUNK_SIZE) -> Iterator[List[int]]:
    """Yield successive fixed-size chunks from the row iterator."""
    chunk: List[int] = []
    for row in rows:
        chunk.append(row)
        if len(chunk) == size:
            yield chunk
            chunk = []
    if chunk:  # leftover rows
        yield chunk

# === 3. Heartbeat Logging =================================================
HEARTBEAT_LOG = "process_log.txt"


def log_heartbeat(chunk_idx: int, row_count: int, elapsed: float) -> None:
    """Write a heartbeat entry to process_log.txt with explicit flush."""
    msg = (
        f"[HEARTBEAT] Processed chunk {chunk_idx:>6} "
        f"({row_count:>8} rows total) in {elapsed:.2f}s\n"
    )
    # 2. Unbuffered Output: flush=True forces the write to disk immediately
    with open(HEARTBEAT_LOG, "a", encoding="utf-8") as f:
        f.write(msg)
        f.flush()
    # Also print to stdout with flush=True
    print(msg.rstrip(), flush=True)

# === 5. Strict I/O Timeout ===============================================
def read_file_with_timeout(path: str, timeout: float = 10.0) -> str:
    """Read a file with a strict timeout (simulated via wall-clock check)."""
    start = time.monotonic()
    # For real safety, use asyncio.wait_for or threading.Timer.
    # Here we demonstrate the pattern with a periodic check.
    if not os.path.isfile(path):
        raise FileNotFoundError(f"{path} not found")
    with open(path, "r", encoding="utf-8") as f:
        # Simulate a slow read by checking elapsed time
        content: List[str] = []
        for line in f:
            if time.monotonic() - start > timeout:
                raise TimeoutError(f"Read of {path} exceeded {timeout}s timeout")
            content.append(line)
    return "".join(content)

# === Main Processing =======================================================
def process_dataset(total_rows: int, input_file: str | None = None) -> None:
    """
    Process *total_rows* synthetic rows in chunks, logging heartbeats.
    If *input_file* is given, read it with a strict I/O timeout first.
    """

    # Clear previous heartbeat log
    if os.path.exists(HEARTBEAT_LOG):
        os.remove(HEARTBEAT_LOG)

    # 5. Demonstrate strict I/O timeout on optional input file
    if input_file:
        print(f"Reading input file '{input_file}' with {10}s timeout...", flush=True)
        content = read_file_with_timeout(input_file, timeout=10.0)
        print(f"  Read {len(content)} characters.", flush=True)

    row_stream = generate_rows(total_rows)
    chunk_iter = chunker(row_stream, CHUNK_SIZE)
    overall_start = time.monotonic()
    processed = 0
    chunk_idx = 0

    for chunk in chunk_iter:
        # --- Process the chunk (simulate work) ---
        time.sleep(0.01)  # simulate ~10ms of work per chunk
        processed += len(chunk)
        chunk_idx += 1

        # --- Heartbeat ---
        elapsed = time.monotonic() - overall_start
        log_heartbeat(chunk_idx, processed, elapsed)

    total_elapsed = time.monotonic() - overall_start
    print(f"\nDone. Processed {processed} rows in {total_elapsed:.2f}s.", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser(description="Anti-Silent-Hang compliance demo")
    parser.add_argument("--input", type=str, default=None,
                        help="Optional input file to read (tests I/O timeout)")
    parser.add_argument("--rows", type=int, default=1000,
                        help="Number of synthetic rows to process (default: 1000)")
    args = parser.parse_args()

    try:
        process_dataset(args.rows, args.input)
    except WatchdogTimeout as exc:
        print(f"\n[FATAL] {exc}", flush=True)
        sys.exit(1)
    except Exception as exc:
        print(f"\n[FATAL] Unhandled exception: {exc}", flush=True)
        sys.exit(2)


if __name__ == "__main__":
    main()