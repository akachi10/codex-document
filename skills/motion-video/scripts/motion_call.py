#!/usr/bin/env python3
"""Single JSON-RPC call to the motion.so MCP server. Usage: motion_call.py <tool> '<json-args>'
Key is read from ~/.claude.json (mcpServers.motion.headers.Authorization) or env MOTION_API_KEY."""
import json, os, subprocess, sys

MCP = "https://mcp.motion.so/mcp"

def api_key():
    k = os.environ.get("MOTION_API_KEY")
    if k:
        return k if k.startswith("Bearer ") else f"Bearer {k}"
    cfg = json.load(open(os.path.expanduser("~/.claude.json")))
    return cfg["mcpServers"]["motion"]["headers"]["Authorization"]

def call(name, args):
    body = {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": args}}
    r = subprocess.run(["curl", "-s", "-X", "POST", MCP, "-H", f"Authorization: {api_key()}",
                        "-H", "Content-Type: application/json", "-H", "Accept: application/json, text/event-stream",
                        "-d", json.dumps(body)], capture_output=True, text=True)
    for line in r.stdout.splitlines():
        if line.startswith("data: "):
            msg = json.loads(line[6:])
            if "error" in msg:
                return {"_error": msg["error"]}
            res = msg["result"]
            sc = res.get("structuredContent")
            if sc is None:
                txt = res.get("content", [{}])[0].get("text", "")
                try:
                    sc = json.loads(txt)
                except Exception:
                    sc = {"_text": txt}
            return sc
    return {"_raw": r.stdout[:500], "_stderr": r.stderr[:200]}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    print(json.dumps(call(sys.argv[1], json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}), indent=1, ensure_ascii=False))
