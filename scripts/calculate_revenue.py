import os
import sys
import time
import signal
import csv
import threading

os.environ['PYTHONUNBUFFERED'] = '1'
LOG_FILE = 'process_log.txt'

def write_log(msg):
    with open(LOG_FILE, 'a') as f:
        f.write(msg + '\n')
        f.flush()

def timeout_handler(signum, frame):
    write_log("[ERROR] Timeout reached. Dumping state.")
    raise TimeoutError("60-second watchdog timer expired.")

def start_watchdog(timeout=60):
    try:
        signal.signal(signal.SIGBREAK, timeout_handler)
    except AttributeError:
        # Fallback if SIGBREAK is not available
        signal.signal(signal.SIGTERM, timeout_handler)
        
    def trigger_timeout():
        try:
            os.kill(os.getpid(), getattr(signal, 'SIGBREAK', signal.SIGTERM))
        except Exception as e:
            write_log(f"[ERROR] Failed to send signal: {e}")
            os._exit(1)
            
    timer = threading.Timer(timeout, trigger_timeout)
    timer.daemon = True
    timer.start()
    return timer

def main():
    timer = start_watchdog(60)
    
    csv_file = 'c:/Users/bentn/antigravity/Untitled/test_sales_data.csv'
    
    start_time = time.monotonic()
    
    try:
        f = open(csv_file, 'r', newline='')
    except Exception as e:
        raise
    
    if time.monotonic() - start_time > 60:
        raise TimeoutError("File open took more than 60 seconds")
        
    try:
        reader = csv.DictReader(f)
        total_north_revenue = 0.0
        rows_processed = 0
        chunk_size = 1000
        
        while True:
            chunk_rows = 0
            for _ in range(chunk_size):
                try:
                    row = next(reader)
                    if row['region'] == 'North':
                        total_north_revenue += float(row['total_revenue'])
                    rows_processed += 1
                    chunk_rows += 1
                    
                    if rows_processed % 5000 == 0:
                        msg = f"[HEARTBEAT] Processed row {rows_processed}..."
                        write_log(msg)
                        print(msg, flush=True)
                except StopIteration:
                    break
                    
            if chunk_rows == 0:
                break
                
        print(f"Total revenue for North region: ${total_north_revenue:.2f}", flush=True)
        
    finally:
        f.close()
        timer.cancel()

if __name__ == '__main__':
    main()
