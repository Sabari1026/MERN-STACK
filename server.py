import http.server
import socketserver
import os
import sys
import mimetypes
import webbrowser
import threading

PORT = 3000
HOST = "localhost"

# Ensure common MIME types are properly recognized
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("application/json", ".json")
mimetypes.add_type("image/x-icon", ".ico")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/jpeg", ".jpeg")

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True

class HireConnectRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT_DIR, **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Clean path from query parameters
        clean_path = self.path.split("?")[0]

        # Handle requests without trailing slash for directory pages
        candidate_dir = os.path.join(ROOT_DIR, clean_path.lstrip("/"))
        if os.path.isdir(candidate_dir) and not clean_path.endswith("/"):
            self.send_response(301)
            new_path = clean_path + "/"
            if "?" in self.path:
                new_path += "?" + self.path.split("?", 1)[1]
            self.send_header("Location", new_path)
            self.end_headers()
            return

        super().do_GET()

def run_server():
    port = PORT
    server = None
    for p in range(PORT, PORT + 20):
        try:
            server = ThreadedHTTPServer(("", p), HireConnectRequestHandler)
            port = p
            break
        except OSError:
            continue

    if not server:
        print(f"Error: Could not bind to any port from {PORT} to {PORT + 20}")
        sys.exit(1)

    url = f"http://{HOST}:{port}"
    print("=" * 60)
    print("  HireConnect Website Server Running")
    print(f"  URL: {url}")
    print("  Press Ctrl+C to stop the server")
    print("=" * 60)

    # Open browser automatically after 0.5 seconds
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        server.server_close()

if __name__ == "__main__":
    run_server()
