#!/usr/bin/env python3
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


class Server(socketserver.TCPServer):
    # Lets us restart right after a stop instead of hitting:
    # OSError: [Errno 98] Address already in use (leftover TIME-WAIT socket)
    allow_reuse_address = True


with Server(("", PORT), Handler) as httpd:
    httpd.serve_forever()