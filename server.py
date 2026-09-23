#!/usr/bin/env python3
"""Local static server for the Auronima prototype.
ES modules (and later fetch() of JSON) need HTTP, so file:// will not work.
Run: python3 server.py  then open http://localhost:8000
"""
import http.server
import socketserver
import os

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving {ROOT} at http://localhost:{PORT}")
    httpd.serve_forever()