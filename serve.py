#!/usr/bin/env python3
"""Local preview server.

python3 -m http.server sends no cache headers, so browsers apply heuristic
caching and keep serving an edited CSS/JS file from cache without asking.
This one tells the browser never to store anything, so a plain reload always
shows the current files.

    python3 serve.py [port]
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print("Serving on http://localhost:%d — Ctrl-C to stop" % port)
    ThreadingHTTPServer(("", port), NoCacheHandler).serve_forever()
