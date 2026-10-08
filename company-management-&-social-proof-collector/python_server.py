"""
Standalone Python 3 REST API Server for Testimonial & Social Proof Collector
Zero external pip dependencies (Uses built-in http.server, sqlite3, json, urllib)
Run locally:
    python3 python_server.py
Access at:
    http://localhost:8000
"""

import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from python_testimonial_system import TestimonialCollectorDB, verify_jwt

PORT = 8000
db = TestimonialCollectorDB()

class TestimonialAPIHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def _send_json(self, data, status=200, cookies=None):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self._send_cors_headers()
        if cookies:
            for k, v in cookies.items():
                self.send_header("Set-Cookie", f"{k}={v}; HttpOnly; Path=/; Max-Age=604800; SameSite=Lax")
        self.end_headers()
        self.wfile.write(json.dumps(data).encode("utf-8"))

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _parse_body(self):
        length = int(self.headers.get("Content-Length", 0))
        if length > 0:
            raw = self.rfile.read(length).decode("utf-8")
            try:
                return json.loads(raw)
            except Exception:
                return {}
        return {}

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        params = urllib.parse.parse_qs(parsed.query)

        # 1. API Health
        if path == "/api/health":
            return self._send_json({"status": "ok", "service": "Python Testimonial Engine (Zero-pip)"})

        # 2. Spaces list
        if path == "/api/spaces":
            spaces = db.list_spaces()
            return self._send_json(spaces)

        # 3. Space by slug
        if path.startswith("/api/spaces/"):
            slug = path.split("/api/spaces/")[1]
            space = db.get_space(slug)
            if not space:
                return self._send_json({"error": "Space not found"}, 404)
            return self._send_json(space)

        # 4. Moderation Inbox: /api/testimonials/owner
        if path == "/api/testimonials/owner":
            space_slug = params.get("spaceSlug", ["all"])[0]
            status = params.get("status", ["all"])[0]
            q = params.get("q", [""])[0]
            rating = params.get("rating", ["all"])[0]
            reviews = db.list_testimonials_inbox(space_slug, status, q, rating)
            return self._send_json(reviews)

        # 5. Wall of Love: /api/testimonials/wall/<slug>
        if path.startswith("/api/testimonials/wall/"):
            slug = path.split("/api/testimonials/wall/")[1]
            wall = db.get_wall_of_love(slug)
            return self._send_json(wall)

        # 6. Embed snippet generator: /api/embed/<slug>
        if path.startswith("/api/embed/"):
            slug = path.split("/api/embed/")[1]
            layout = params.get("layout", ["grid"])[0]
            theme = params.get("theme", ["light"])[0]
            embed = db.generate_embed_snippet(slug, layout, theme)
            return self._send_json(embed)

        # 7. Rating Metrics: /api/analytics/<slug>
        if path.startswith("/api/analytics/"):
            slug = path.split("/api/analytics/")[1]
            metrics = db.get_rating_metrics(slug)
            return self._send_json(metrics)

        # Fallback 404
        self._send_json({"error": f"Route '{path}' not found on Python backend"}, 404)

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._parse_body()

        # 1. Auth: Register
        if path == "/api/auth/register":
            name = body.get("name", "")
            email = body.get("email", "")
            password = body.get("password", "")
            company = body.get("companyName", "")
            resp, code = db.register_user(name, email, password, company)
            cookies = {"refreshToken": resp["refreshToken"]} if "refreshToken" in resp else None
            return self._send_json(resp, code, cookies=cookies)

        # 2. Auth: Login
        if path == "/api/auth/login":
            email = body.get("email", "")
            password = body.get("password", "")
            resp, code = db.login_user(email, password)
            cookies = {"refreshToken": resp["refreshToken"]} if "refreshToken" in resp else None
            return self._send_json(resp, code, cookies=cookies)

        # 3. Auth: Refresh token rotation
        if path == "/api/auth/refresh":
            refresh_token = body.get("refreshToken", "")
            resp, code = db.refresh_access_token(refresh_token)
            cookies = {"refreshToken": resp["refreshToken"]} if "refreshToken" in resp else None
            return self._send_json(resp, code, cookies=cookies)

        # 4. Auth: Verify email simulation
        if path == "/api/auth/verify-email":
            return self._send_json({"success": True, "message": "Email verified successfully!"})

        # 5. Auth: Forgot password
        if path == "/api/auth/forgot-password":
            email = body.get("email", "your email")
            return self._send_json({"success": True, "message": f"Password reset instructions sent to {email}"})

        # 6. Spaces: Create space
        if path == "/api/spaces":
            owner_id = body.get("ownerId", "usr_owner_01")
            name = body.get("name", "")
            slug = body.get("slug", "")
            headline = body.get("headline", "")
            prompt = body.get("customPrompt", "")
            logo = body.get("logoUrl", "")
            color = body.get("brandColor", "#4f46e5")
            settings = body.get("settings", {})
            resp, code = db.create_space(owner_id, name, slug, headline, prompt, logo, color, settings)
            return self._send_json(resp, code)

        # 7. Frictionless Public submission: /api/testimonials/public/<slug>
        if path.startswith("/api/testimonials/public/"):
            slug = path.split("/api/testimonials/public/")[1]
            client_name = body.get("clientName", "")
            client_email = body.get("clientEmail", "")
            company_role = body.get("companyRole", "Client")
            company_name = body.get("companyName", "")
            rating = int(body.get("rating", 5))
            review_text = body.get("reviewText", "")
            avatar_url = body.get("avatarUrl", "")
            answers = body.get("answers", [])
            resp, code = db.submit_testimonial(slug, client_name, client_email, company_role, company_name, rating, review_text, avatar_url, answers)
            return self._send_json(resp, code)

        self._send_json({"error": f"POST {path} not found"}, 404)

    def do_PATCH(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._parse_body()

        # Update testimonial status: /api/testimonials/<id>/status
        if path.startswith("/api/testimonials/") and path.endswith("/status"):
            t_id = path.split("/api/testimonials/")[1].split("/status")[0]
            status = body.get("status", "pending")
            resp, code = db.update_status(t_id, status)
            return self._send_json(resp, code)

        # Toggle feature: /api/testimonials/<id>/toggle-feature
        if path.startswith("/api/testimonials/") and path.endswith("/toggle-feature"):
            t_id = path.split("/api/testimonials/")[1].split("/toggle-feature")[0]
            resp, code = db.toggle_featured(t_id)
            return self._send_json(resp, code)

        # Toggle like: /api/testimonials/<id>/toggle-like
        if path.startswith("/api/testimonials/") and path.endswith("/toggle-like"):
            t_id = path.split("/api/testimonials/")[1].split("/toggle-like")[0]
            resp, code = db.toggle_liked(t_id)
            return self._send_json(resp, code)

        self._send_json({"error": f"PATCH {path} not found"}, 404)

def run_server(port=PORT):
    server = HTTPServer(("0.0.0.0", port), TestimonialAPIHandler)
    print(f" Python Testimonial Server listening on http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n Server stopped.")
        server.server_close()

if __name__ == "__main__":
    run_server()
