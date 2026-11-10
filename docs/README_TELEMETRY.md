# FASAL Multi-Agent Live Telemetry & Peer Coordination Guide
### For IDE Agents (Antigravity, Cursor, Windsurf, Copilot, Cline, CLI agents)

This workspace is actively coordinated by a multi-agent team (Teamwork Coordinator + specialized workers). 
To enable any external or co-working IDE agent on this machine to work **side-by-side** without conflicts or blind spots, an active real-time daemon runs continuously in the background.

---

## 1. Quick Access for IDE Agents

### Option A: Read Single File (Instant 1-Shot Status)
Any IDE agent with a `read_file` tool can inspect:
- [**`.agents/LIVE_STATUS.md`**](file:///c:/Users/bentn/OneDrive/Desktop/FASAL%20Information/.agents/LIVE_STATUS.md): Clean, formatted Markdown table updated every second. Contains:
  * Currently active subagents and their current action
  * Write ownership and active file locks
  * Files modified in the last 120 seconds
  * Milestone progression
- [**`.agents/LIVE_TELEMETRY.json`**](file:///c:/Users/bentn/OneDrive/Desktop/FASAL%20Information/.agents/LIVE_TELEMETRY.json): Complete machine-readable JSON object updated atomically every second.

### Option B: Local HTTP Telemetry API (Port 9999)
The daemon hosts a local REST API and Server-Sent Events (SSE) stream on `http://127.0.0.1:9999`:

| Method & Endpoint | Description | Output Format |
|---|---|---|
| `GET http://127.0.0.1:9999/status` | Complete live telemetry state | `application/json` |
| `GET http://127.0.0.1:9999/live` | Live Markdown status board | `text/markdown` |
| `GET http://127.0.0.1:9999/locks` | Active write locks & file reservations | `application/json` |
| `GET http://127.0.0.1:9999/stream` | Real-time Server-Sent Events (push updates every 1s) | `text/event-stream` |
| `POST http://127.0.0.1:9999/notify` | Broadcast custom peer agent notification | `application/json` |

---

## 2. Peer Agent Coordination Rules (Avoiding Collisions)

1. **Check Locks Before Writing:**
   Before editing any file under `dashboard/`, check `.agents/LIVE_TELEMETRY.json` or query `curl http://127.0.0.1:9999/locks`.
   If a file pattern is listed under `active_locks`, the assigned worker currently has exclusive write ownership.
2. **Safe Reading:**
   All files are always safe for reading.
3. **Notify Peer Agents:**
   Peer agents can broadcast actions into the team log:
   ```bash
   curl -X POST http://127.0.0.1:9999/notify -H "Content-Type: application/json" -d '{"agent": "Cursor", "action": "inspecting_components"}'
   ```
4. **Daemon Control:**
   - Process PID is recorded in `.agents/daemon.pid`.
   - Script source: `scripts/teamwork_live_telemetry_daemon.py`.

