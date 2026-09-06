#!/usr/bin/env python3
"""motion.so pipeline helper.
  upload <file>...                         -> prints attachments JSON (save to att.json)
  create <brief.txt> [--ratio 9:16] [--duration 10-30s] [--design apple] [--attachments att.json]
  wait <job_id> [--out video.mp4] [--since <completed_at>] [--max-min 9]
  followup <job_id> <prompt.txt>
"""
import argparse, json, mimetypes, os, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from motion_call import call

def gen(sc):
    if "_error" in sc or "_text" in sc:
        sys.exit(f"motion error: {sc}")
    return sc["generation"]

def upload(files):
    out = []
    for p in files:
        ct = mimetypes.guess_type(p)[0] or "application/octet-stream"
        sc = call("upload_asset", {"filename": os.path.basename(p), "content_type": ct})
        if "upload_url" not in sc:
            sys.exit(f"upload_asset failed: {sc}")
        cmd = ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}"]
        for k, v in sc["upload_fields"].items():
            cmd += ["-F", f"{k}={v}"]
        cmd += ["-F", f"file=@{p}", sc["upload_url"]]
        code = subprocess.run(cmd, capture_output=True, text=True).stdout
        print(f"{p} -> HTTP {code}", file=sys.stderr)
        out.append({"url": sc["attachment_url"], "name": os.path.basename(p), "type": "video" if ct.startswith("video") else "image"})
    print(json.dumps(out))

def create(a):
    args = {"prompt": open(a.brief).read(), "aspect_ratio": a.ratio, "duration": a.duration}
    if a.design: args["design_system_id"] = a.design
    if a.attachments: args["attachments"] = json.load(open(a.attachments))
    g = gen(call("create_video", args))
    print(json.dumps({"job_id": g["id"], "status": g["status"], "chat_url": g["chat_url"]}))

def wait(a):
    deadline = time.time() + a.max_min * 60
    while time.time() < deadline:
        g = gen(call("get_session_status", {"job_id": a.job_id}))
        fresh = g["status"] == "completed" and (g.get("completed_at") or "") > (a.since or "")
        print(f"{time.strftime('%H:%M')} {g['status']} {g.get('progress_percent')} pending={g.get('pending_user_input')} completed_at={g.get('completed_at')} {(g.get('status_message') or '')[:70]}", file=sys.stderr, flush=True)
        if g.get("pending_user_input"):
            print(json.dumps({"needs_input": g.get("status_message")})); return
        if g["status"] in ("failed", "error", "cancelled"):
            print(json.dumps({"failed": g.get("error")})); return
        if fresh:
            url = g["output"]["download_url"]
            if a.out:
                subprocess.run(["curl", "-sL", url, "-o", a.out])
                print(json.dumps({"completed_at": g["completed_at"], "file": a.out, "bytes": os.path.getsize(a.out)}))
            else:
                print(json.dumps({"completed_at": g["completed_at"], "download_url": url}))
            return
        time.sleep(60)
    print(json.dumps({"timeout": True, "hint": "re-run wait with same --since"}))

def followup(a):
    g = gen(call("create_followup", {"job_id": a.job_id, "prompt": open(a.prompt).read()}))
    print(json.dumps({"job_id": g["id"], "status": g["status"]}))

p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sp = p.add_subparsers(dest="cmd", required=True)
u = sp.add_parser("upload"); u.add_argument("files", nargs="+")
c = sp.add_parser("create"); c.add_argument("brief"); c.add_argument("--ratio", default="9:16"); c.add_argument("--duration", default="10-30s"); c.add_argument("--design", default="apple"); c.add_argument("--attachments")
w = sp.add_parser("wait"); w.add_argument("job_id"); w.add_argument("--out"); w.add_argument("--since"); w.add_argument("--max-min", type=int, default=9)
f = sp.add_parser("followup"); f.add_argument("job_id"); f.add_argument("prompt")
a = p.parse_args()
{"upload": lambda: upload(a.files), "create": lambda: create(a), "wait": lambda: wait(a), "followup": lambda: followup(a)}[a.cmd]()
