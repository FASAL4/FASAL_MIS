"""
FASAL Multi-Agent Real-Time Telemetry Daemon
=============================================
Provides per-second telemetry, live activity tracking, and peer-agent coordination
for all IDE agents on the computer working on the FASAL project.

Outputs:
1. File: .agents/LIVE_TELEMETRY.json (Atomic real-time JSON updated every second)
2. File: .agents/LIVE_ACTIVITY.md (Instant-read Markdown status board for IDE LLMs)
3. File: .agents/telemetry_events.jsonl (Append-only event stream of state transitions)
4. HTTP Server: http://127.0.0.1:9999 (REST API + Server-Sent Events stream for peer agents)
   - GET / or /status -> JSON telemetry
   - GET /live -> Markdown status board
   - GET /locks -> Active write locks & file reservations
   - GET /stream -> Real-time Server-Sent Events (SSE) feed
   - POST /notify -> Peer agent broadcast endpoint
"""

import os
import sys
import time
import json
import socket
import threading
from datetime import datetime, timezone
from pathlib import Path
from http.server import HTTPServer, BaseHTTPRequestHandler
import urllib.parse

# Configuration
WORKSPACE_ROOT = Path(r"C:\Users\bentn\OneDrive\Desktop\FASAL Information").resolve()
AGENTS_DIR = WORKSPACE_ROOT / ".agents"
TEAMWORK_DIR = AGENTS_DIR / "teamwork"
BRAIN_DIR = Path(r"C:\Users\bentn\.gemini\antigravity\brain").resolve()
DASHBOARD_DIR = WORKSPACE_ROOT / "dashboard"

TELEMETRY_JSON = AGENTS_DIR / "LIVE_TELEMETRY.json"
LIVE_STATUS_MD = AGENTS_DIR / "LIVE_STATUS.md"
EVENT_LOG_FILE = AGENTS_DIR / "telemetry_events.jsonl"
PID_FILE = AGENTS_DIR / "daemon.pid"

HTTP_HOST = "127.0.0.1"
HTTP_PORT = 9999

# Global In-Memory State
latest_state = {
    "status": "initializing",
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "uptime_seconds": 0,
    "active_subagents": [],
    "recent_subagents": [],
    "file_locks": {},
    "recently_modified_files": [],
    "last_actions": [],
    "current_milestone": "Unknown",
    "services": {
        "vite_dev_server": {"running": False, "port": 5173, "url": "http://localhost:5173"},
        "telemetry_http_server": {"running": True, "port": HTTP_PORT, "url": f"http://{HTTP_HOST}:{HTTP_PORT}"}
    }
}
state_lock = threading.Lock()
sse_clients = []
sse_lock = threading.Lock()


def is_port_open(port: int, host: str = "127.0.0.1") -> bool:
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.settimeout(0.2)
            return s.connect_ex((host, port)) == 0
    except Exception:
        return False


def get_tail_lines(file_path: Path, max_lines: int = 20) -> list[str]:
    """Efficiently read the last N lines of a file without loading the entire file."""
    if not file_path.exists() or file_path.stat().st_size == 0:
        return []
    try:
        with open(file_path, "rb") as f:
            f.seek(0, os.SEEK_END)
            size = f.tell()
            buffer_size = min(size, 65536)
            f.seek(max(0, size - buffer_size))
            data = f.read().decode("utf-8", errors="ignore")
            lines = data.splitlines()
            return lines[-max_lines:]
    except Exception:
        return []


def inspect_brain_transcripts() -> list[dict]:
    """Find active conversation transcripts in the brain directory and extract latest step."""
    if not BRAIN_DIR.exists():
        return []
    
    transcripts = []
    now = time.time()
    try:
        # Check directories modified in the last 2 hours
        subdirs = [d for d in BRAIN_DIR.iterdir() if d.is_dir()]
        subdirs.sort(key=lambda d: d.stat().st_mtime, reverse=True)
        
        for d in subdirs[:15]:
            log_path = d / ".system_generated" / "logs" / "transcript.jsonl"
            if not log_path.exists():
                continue
            
            mtime = log_path.stat().st_mtime
            age_sec = now - mtime
            if age_sec > 7200:
                continue
            
            tail = get_tail_lines(log_path, max_lines=15)
            last_entry = None
            for line in reversed(tail):
                try:
                    obj = json.loads(line)
                    last_entry = obj
                    break
                except Exception:
                    continue
            
            if last_entry:
                step_idx = last_entry.get("step_index", 0)
                source = last_entry.get("source", "UNKNOWN")
                entry_type = last_entry.get("type", "UNKNOWN")
                tool_calls = last_entry.get("tool_calls", [])
                
                tool_summary = None
                if tool_calls:
                    tc = tool_calls[0]
                    tool_name = tc.get("name", "tool")
                    args = tc.get("args", {})
                    path = args.get("Path", "") or args.get("path", "")
                    cmd = args.get("CommandLine", "")
                    tool_summary = f"{tool_name}: {Path(path).name if path else (cmd[:60] if cmd else '')}"
                
                transcripts.append({
                    "conversation_id": d.name,
                    "age_seconds": round(age_sec, 1),
                    "step_index": step_idx,
                    "source": source,
                    "entry_type": entry_type,
                    "last_tool": tool_summary,
                    "created_at": last_entry.get("created_at", "")
                })
    except Exception as e:
        pass
    
    return transcripts


def scan_teamwork_subagents() -> tuple[list[dict], list[dict], dict, str]:
    """Inspect .agents/teamwork/ state directories to detect active workers, locks, and progress."""
    if not TEAMWORK_DIR.exists():
        return [], [], {}, "Unknown"
    
    now = time.time()
    active_workers = []
    recent_workers = []
    file_locks = {}
    current_milestone = "Unknown"
    
    # Check PROJECT.md for current milestone
    project_md = TEAMWORK_DIR / "PROJECT.md"
    if project_md.exists():
        try:
            content = project_md.read_text(encoding="utf-8", errors="ignore")
            for line in content.splitlines():
                if "Current Milestone:" in line or "Active Milestone:" in line or "## Milestone" in line:
                    current_milestone = line.strip().lstrip("#").strip()
                    break
        except Exception:
            pass

    try:
        subdirs = [d for d in TEAMWORK_DIR.iterdir() if d.is_dir()]
        subdirs.sort(key=lambda d: d.stat().st_mtime, reverse=True)
        
        for d in subdirs:
            name = d.name
            files = list(d.glob("*.md")) + list(d.glob("*.mjs")) + list(d.glob("*.py"))
            if not files:
                continue
            
            mtimes = [f.stat().st_mtime for f in files]
            max_mtime = max(mtimes) if mtimes else d.stat().st_mtime
            age_sec = now - max_mtime
            
            # Read DISPATCH.md for role & write ownership
            dispatch_file = d / "DISPATCH.md"
            role = name
            write_ownership = []
            if dispatch_file.exists():
                try:
                    txt = dispatch_file.read_text(encoding="utf-8", errors="ignore")
                    for line in txt.splitlines():
                        if "You are " in line:
                            role = line.split("You are ")[-1].rstrip(".").strip()
                        if line.strip().startswith("- `dashboard/") or line.strip().startswith("- `src/"):
                            clean_path = line.strip().lstrip("- `").rstrip("`*").strip()
                            write_ownership.append(clean_path)
                except Exception:
                    pass
            
            # Read latest progress log line
            progress_file = d / "progress.md"
            last_progress = ""
            if progress_file.exists():
                tail = get_tail_lines(progress_file, max_lines=4)
                for line in reversed(tail):
                    clean = line.strip().lstrip("- *#").strip()
                    if clean and not clean.startswith("Last visited"):
                        last_progress = clean
                        break
            
            # Determine status
            status = "ACTIVE" if age_sec < 180 else ("RECENT" if age_sec < 1200 else "COMPLETED")
            
            worker_data = {
                "name": name,
                "role": role,
                "status": status,
                "age_seconds": round(age_sec, 1),
                "write_ownership": write_ownership,
                "last_progress": last_progress[:120] if last_progress else "Idle / Completed",
                "folder": str(d)
            }
            
            if status == "ACTIVE":
                active_workers.append(worker_data)
                # Register locks
                for owned in write_ownership:
                    file_locks[owned] = {
                        "locked_by": name,
                        "role": role,
                        "since_seconds_ago": round(age_sec, 1)
                    }
            elif status == "RECENT":
                recent_workers.append(worker_data)
    except Exception as e:
        pass
    
    return active_workers, recent_workers, file_locks, current_milestone


def scan_recent_file_modifications(limit_seconds: int = 120) -> list[dict]:
    """Scan the workspace for recently modified code and asset files."""
    recent_files = []
    now = time.time()
    
    scan_targets = [
        DASHBOARD_DIR / "src",
        DASHBOARD_DIR / "scripts",
        AGENTS_DIR / "teamwork",
        WORKSPACE_ROOT / "verification"
    ]
    
    for base in scan_targets:
        if not base.exists():
            continue
        try:
            for root, _, files in os.walk(base):
                # Skip node_modules and .git
                if "node_modules" in root or ".git" in root or ".cache" in root:
                    continue
                for f in files:
                    if f.endswith((".ts", ".tsx", ".css", ".json", ".py", ".md", ".mjs")):
                        p = Path(root) / f
                        try:
                            mtime = p.stat().st_mtime
                            age = now - mtime
                            if age <= limit_seconds:
                                rel_path = str(p.relative_to(WORKSPACE_ROOT))
                                recent_files.append({
                                    "path": rel_path,
                                    "age_seconds": round(age, 1),
                                    "size_bytes": p.stat().st_size
                                })
                        except Exception:
                            continue
        except Exception:
            continue
            
    recent_files.sort(key=lambda x: x["age_seconds"])
    return recent_files[:20]


def build_live_markdown(state: dict) -> str:
    """Generate high-density, instant-read Markdown status board for peer IDE LLMs."""
    now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    active_subs = state["active_subagents"]
    recent_subs = state["recent_subagents"]
    locks = state["file_locks"]
    recent_files = state["recently_modified_files"]
    vite_status = "ONLINE (http://localhost:5173)" if state["services"]["vite_dev_server"]["running"] else "OFFLINE"
    
    md = [
        "# FASAL Project — Real-Time Multi-Agent Live Telemetry Board",
        f"**Last Heartbeat:** `{now_str}` | **Uptime:** `{state['uptime_seconds']}s` | **Phase:** `{state['current_milestone']}` | **Vite Server:** `{vite_status}`",
        f"**HTTP Telemetry API:** `http://127.0.0.1:9999` (`GET /status` | `GET /locks` | `GET /stream`)",
        "",
        "---",
        "",
        "## 1. Active Working Agents (Current Second Activity)",
        ""
    ]
    
    if active_subs:
        md.append("| Subagent Name | Role / Assignment | Last Active | Latest Action / Progress | Write Ownership |")
        md.append("| :--- | :--- | :---: | :--- | :--- |")
        for sub in active_subs:
            ownership_str = ", ".join(f"`{w}`" for w in sub["write_ownership"][:3]) or "*None (Read-Only)*"
            md.append(f"| **`{sub['name']}`** | {sub['role']} | **{sub['age_seconds']}s ago** | {sub['last_progress']} | {ownership_str} |")
    else:
        md.append("> *No active subagents currently executing tools (all idle or awaiting next milestone dispatch).*")
    
    md.extend([
        "",
        "## 2. File Ownership & Active Write Locks (Peer Coordination)",
        "> **Notice to Peer IDE Agents:** Do NOT write to locked paths to prevent race conditions or merge conflicts."
    ])
    
    if locks:
        md.append("| Locked File / Directory Pattern | Locked By Subagent | Role | Lock Duration |")
        md.append("| :--- | :--- | :--- | :---: |")
        for path, info in locks.items():
            md.append(f"| `dashboard/{path}` | **`{info['locked_by']}`** | {info['role']} | {info['since_seconds_ago']}s |")
    else:
        md.append("> *Zero active write locks. All files are currently safe for reading and editing.*")
        
    md.extend([
        "",
        "## 3. Recently Modified Code & Assets (Last 120 Seconds)",
        ""
    ])
    
    if recent_files:
        md.append("| Modified File Path | Modified Time | Size (Bytes) |")
        md.append("| :--- | :---: | :---: |")
        for rf in recent_files[:12]:
            md.append(f"| `{rf['path']}` | **{rf['age_seconds']}s ago** | {rf['size_bytes']:,} B |")
    else:
        md.append("> *No files modified in the last 120 seconds.*")
        
    md.extend([
        "",
        "## 4. Recently Concluded Workers (Last 20 Minutes)",
        ""
    ])
    
    if recent_subs:
        md.append("| Subagent Name | Role | Finished Ago | Final Result Summary |")
        md.append("| :--- | :--- | :---: | :--- |")
        for sub in recent_subs[:8]:
            md.append(f"| `{sub['name']}` | {sub['role']} | {sub['age_seconds']}s ago | {sub['last_progress']} |")
    else:
        md.append("> *None.*")
        
    md.append("")
    return "\n".join(md)


def telemetry_collector_loop():
    """Main daemon sampling loop running at 1.0 Hz (every second)."""
    global latest_state
    start_time = time.time()
    
    # Write PID file
    try:
        PID_FILE.write_text(str(os.getpid()), encoding="utf-8")
    except Exception:
        pass
        
    last_event_hash = ""

    while True:
        try:
            uptime = int(time.time() - start_time)
            
            # 1. Check services
            vite_online = is_port_open(5173)
            
            # 2. Scan teamwork subagents & locks
            active_workers, recent_workers, file_locks, milestone = scan_teamwork_subagents()
            
            # 3. Scan recent file changes
            recent_files = scan_recent_file_modifications(limit_seconds=120)
            
            # 4. Scan brain transcripts for micro-level actions
            brain_activity = inspect_brain_transcripts()
            
            # Compile new state
            new_state = {
                "status": "active",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "uptime_seconds": uptime,
                "current_milestone": milestone,
                "active_subagents": active_workers,
                "recent_subagents": recent_workers,
                "file_locks": file_locks,
                "recently_modified_files": recent_files,
                "brain_activity": brain_activity,
                "services": {
                    "vite_dev_server": {"running": vite_online, "port": 5173, "url": "http://localhost:5173"},
                    "telemetry_http_server": {"running": True, "port": HTTP_PORT, "url": f"http://{HTTP_HOST}:{HTTP_PORT}"}
                }
            }
            
            with state_lock:
                latest_state = new_state
            
            # 5. Atomic write of LIVE_TELEMETRY.json
            tmp_json = TELEMETRY_JSON.with_suffix(".tmp")
            try:
                tmp_json.write_text(json.dumps(new_state, indent=2), encoding="utf-8")
                tmp_json.replace(TELEMETRY_JSON)
            except Exception:
                pass
            
            # 6. Atomic write of LIVE_STATUS.md
            md_content = build_live_markdown(new_state)
            tmp_md = LIVE_STATUS_MD.with_suffix(".tmp")
            try:
                tmp_md.write_text(md_content, encoding="utf-8")
                tmp_md.replace(LIVE_STATUS_MD)
            except Exception:
                pass
            
            # 7. Check for state transition event logging
            event_repr = f"{milestone}|{len(active_workers)}|{[w['name'] for w in active_workers]}|{len(recent_files)}"
            if event_repr != last_event_hash:
                last_event_hash = event_repr
                event_entry = {
                    "timestamp": new_state["timestamp"],
                    "milestone": milestone,
                    "active_subagents_count": len(active_workers),
                    "active_subagents": [w["name"] for w in active_workers],
                    "locked_paths": list(file_locks.keys()),
                    "recently_modified_count": len(recent_files)
                }
                try:
                    with open(EVENT_LOG_FILE, "a", encoding="utf-8") as ef:
                        ef.write(json.dumps(event_entry) + "\n")
                except Exception:
                    pass
            
            # 8. Broadcast to SSE clients if any
            with sse_lock:
                if sse_clients:
                    payload = f"data: {json.dumps(new_state)}\n\n"
                    dead_clients = []
                    for client_wfile in sse_clients:
                        try:
                            client_wfile.write(payload.encode("utf-8"))
                            client_wfile.flush()
                        except Exception:
                            dead_clients.append(client_wfile)
                    for dead in dead_clients:
                        sse_clients.remove(dead)

        except Exception as e:
            pass
            
        time.sleep(1.0)


class TelemetryHTTPHandler(BaseHTTPRequestHandler):
    """Zero-dependency HTTP request handler for peer IDE agents."""
    
    def log_message(self, format, *args):
        # Silence default terminal access logs
        return

    def do_GET(self):
        url = urllib.parse.urlparse(self.path)
        path = url.path.rstrip("/")
        
        if path == "" or path == "/status" or path == "/telemetry.json":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            with state_lock:
                data = json.dumps(latest_state, indent=2).encode("utf-8")
            self.wfile.write(data)
            
        elif path == "/live" or path == "/status.md":
            self.send_response(200)
            self.send_header("Content-Type", "text/markdown; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            with state_lock:
                md = build_live_markdown(latest_state).encode("utf-8")
            self.wfile.write(md)
            
        elif path == "/locks":
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            with state_lock:
                locks = json.dumps({
                    "timestamp": latest_state["timestamp"],
                    "active_locks": latest_state["file_locks"]
                }, indent=2).encode("utf-8")
            self.wfile.write(locks)
            
        elif path == "/stream":
            self.send_response(200)
            self.send_header("Content-Type", "text/event-stream")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("Connection", "keep-alive")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            
            with sse_lock:
                sse_clients.append(self.wfile)
            
            # Send initial event
            with state_lock:
                init_payload = f"data: {json.dumps(latest_state)}\n\n"
            try:
                self.wfile.write(init_payload.encode("utf-8"))
                self.wfile.flush()
                # Keep thread alive while client connected
                while True:
                    time.sleep(10)
            except Exception:
                with sse_lock:
                    if self.wfile in sse_clients:
                        sse_clients.remove(self.wfile)
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"Endpoint not found. Use /status, /live, /locks, or /stream.")

    def do_POST(self):
        url = urllib.parse.urlparse(self.path)
        if url.path == "/notify":
            try:
                content_length = int(self.headers.get("Content-Length", 0))
                body = self.rfile.read(content_length).decode("utf-8")
                data = json.loads(body)
                
                # Append to event log
                notify_entry = {
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                    "type": "PEER_NOTIFICATION",
                    "data": data
                }
                with open(EVENT_LOG_FILE, "a", encoding="utf-8") as ef:
                    ef.write(json.dumps(notify_entry) + "\n")
                    
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(json.dumps({"status": "received", "entry": notify_entry}).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(str(e).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()


def start_server():
    server = HTTPServer((HTTP_HOST, HTTP_PORT), TelemetryHTTPHandler)
    server.serve_forever()


if __name__ == "__main__":
    print(f"[*] Starting FASAL Multi-Agent Live Telemetry Daemon...")
    print(f"[*] Workspace Root: {WORKSPACE_ROOT}")
    print(f"[*] Live JSON Status: {TELEMETRY_JSON}")
    print(f"[*] Live Markdown: {LIVE_STATUS_MD}")
    print(f"[*] HTTP Server: http://{HTTP_HOST}:{HTTP_PORT}")
    
    # Start background collector thread
    collector_thread = threading.Thread(target=telemetry_collector_loop, daemon=True)
    collector_thread.start()
    
    # Start HTTP server in main thread
    try:
        start_server()
    except KeyboardInterrupt:
        print("\n[!] Telemetry daemon shutting down.")

