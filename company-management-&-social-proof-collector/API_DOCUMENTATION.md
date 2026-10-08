# Testimonial & Social Proof Collector • API Documentation
**Senja / Testimonial.to Alternative**  
Conforming to **MERN Stack Evaluation • Project Brief 05** and Python standard library implementation.

---

## 🔒 1. Universal Security & Architecture Requirements

### Pair Token Authentication
- **Access Token**: Short-lived JWT (`15m` expiry) returned in authorization header / response JSON.
- **Refresh Token**: Long-lived token (`7d` expiry) stored in `httpOnly` secure cookies with automatic token rotation.
- **Signup Flow**: Simulated email verification with 6-digit confirmation code (`492810`).
- **Reset Flow**: Forgot/reset password request with 15-minute expiring link.

---

## 2. API Endpoints Reference

### A. Authentication Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new owner account with email verification simulation | No |
| `POST` | `/api/auth/verify-email` | Confirm 6-digit code or link | No |
| `POST` | `/api/auth/login` | Login with credentials; returns 15m Access Token & sets 7d Refresh Cookie | No |
| `POST` | `/api/auth/refresh` | Token rotation endpoint; exchanges refresh token for fresh pair | Cookie / Body |
| `POST` | `/api/auth/forgot-password`| Dispatches password reset instructions | No |
| `POST` | `/api/auth/logout` | Clears refresh token cookie and ends session | Yes |

### B. Space Management & Configuration (Spec A)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/spaces` | List all spaces owned by the current account | Yes / Public demo |
| `GET` | `/api/spaces/:slug` | Retrieve single space configuration by unique slug | No |
| `POST` | `/api/spaces` | Create new branded space with custom prompts and settings | Yes |
| `PUT` | `/api/spaces/:id` | Update settings (mandatory avatar, star rating toggle, questions) | Yes |

**Space Request Body Example:**
```json
{
  "name": "Acme Cloud Platform",
  "slug": "acme-corp",
  "logoUrl": "https://images.unsplash.com/...",
  "brandColor": "#4f46e5",
  "headline": "Loved by 12,000+ teams worldwide",
  "customPrompt": "How has Acme helped accelerate your team's software delivery?",
  "settings": {
    "isAvatarMandatory": false,
    "isStarRatingEnabled": true,
    "customQuestions": [
      "What was your biggest problem before choosing Acme?",
      "What specific measurable result did you achieve?"
    ],
    "thankYouTitle": "Thank you for your feedback! ❤️",
    "thankYouMessage": "Your review means the world to our team."
  }
}
```

### C. Frictionless Public Collection Form (Spec B)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/testimonials/public/:spaceSlug` | Open public submission endpoint (no login required) | **No (Public)** |

**Public Submission Payload:**
```json
{
  "spaceSlug": "acme-corp",
  "clientName": "Sarah Connor",
  "clientEmail": "sarah@cyberdyne.io",
  "companyRole": "Chief Operations Officer",
  "companyName": "Cyberdyne Systems",
  "rating": 5,
  "reviewText": "Flawless developer experience and 99.99% uptime.",
  "avatarUrl": "data:image/png;base64,...",
  "answers": [
    { "question": "What was your biggest problem before choosing Acme?", "answer": "Frequent deployment rollbacks." }
  ]
}
```

### D. Review Moderation & Tagging Inbox (Spec C)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/testimonials/owner` | Tabbed inbox filter (`status=all/pending/approved/archived`, search `q`, star `rating`) | Yes |
| `PATCH` | `/api/testimonials/:id/status` | One-click moderation: approve, reject, archive | Yes |
| `PATCH` | `/api/testimonials/:id/toggle-feature` | Tag/untag featured testimonial | Yes |
| `PATCH` | `/api/testimonials/:id/toggle-like` | Toggle internal favorite/heart | Yes |

### E. "Wall of Love" Showcase & Embed Generator (Spec D)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/testimonials/wall/:slug` | Retrieve approved testimonials for masonry grid | No (Public) |
| `GET` | `/api/embed/:slug` | Get HTML & `<iframe>` embed snippet for Grid, Carousel, Badge | No (Public) |

### F. Rating Metrics & Summary Stats (Spec E)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/analytics/:slug` | Returns average star rating, total review count, and star-distribution | No |

**Response Example:**
```json
{
  "averageRating": 4.8,
  "totalReviews": 42,
  "approvedCount": 38,
  "pendingCount": 4,
  "approvalRate": 90,
  "distribution": {
    "5": 32,
    "4": 6,
    "3": 2,
    "2": 1,
    "1": 1
  }
}
```

---

## 3. Python 3 Implementation Commands

All Python components require **zero external pip packages** and run natively on Python 3:

```bash
# 1. Run the Python Testimonial & Social Proof Core Engine Test:
python3 python_testimonial_system.py

# 2. Start the Standalone Python REST API Server (Port 8000):
python3 python_server.py

# 3. Launch Desktop GUI Application (Tkinter):
python3 python_gui_app.py
```
