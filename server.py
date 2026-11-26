# Локальный сервер для демонстрации исправленной версии.
# Статика — из этой папки, а /api/* проксируется на живой сайт, чтобы расписание подгружалось как на боевом.
import http.server, urllib.request, urllib.error, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            try:
                req=urllib.request.Request('https://poker-clubkk.ru'+self.path, headers={'User-Agent':'Mozilla/5.0'})
                with urllib.request.urlopen(req, timeout=15) as r:
                    body=r.read()
                    self.send_response(r.status)
                    self.send_header('Content-Type', r.headers.get('Content-Type','application/json'))
                    self.end_headers()
                    self.wfile.write(body)
            except Exception as e:
                self.send_response(502); self.end_headers(); self.wfile.write(b'{"error":"proxy failed"}')
            return
        super().do_GET()
    def log_message(self, *a): pass
http.server.ThreadingHTTPServer(('0.0.0.0',8000), H).serve_forever()
