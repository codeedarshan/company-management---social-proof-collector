# Acme Proof • Testimonial & Social Proof Collector (Senja / Testimonial.to Alternative)

Enterprise social proof collection, moderation inbox, responsive Wall of Love, company structure manager, and SQLite/Python integration engine.

---

## 🚀 How to Run on Localhost (`http://localhost:3000`)

### 📋 Prerequisites
- **Node.js**: v18.0.0 or later ([Download Node.js](https://nodejs.org/))
- **npm** (comes with Node.js) or **bun**
- **Python 3**: (Optional, only needed if you want to run the standalone Python server or Tkinter desktop GUI)

---

### ⚡ Quick Start (Recommended)

1. **Clone or download the project repository** to your local computer:
   ```bash
   git clone <repository-url>
   cd <project-folder>
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   ```
   http://localhost:3000
   ```
   *The Express server and Vite React frontend start together on port `3000`.*

---

## 🛠️ Available Scripts & Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the Express + Vite unified server on `http://localhost:3000` using `tsx`. |
| `npm run build` | Builds client static assets and bundles `server.ts` into `dist/server.cjs`. |
| `npm start` | Runs the compiled production server (`node dist/server.cjs`) on `http://localhost:3000`. |
| `npm run lint` | Type-checks the entire TypeScript codebase (`tsc --noEmit`). |

---

## 🐍 Standalone Python 3 Backends & Desktop GUI

The repository also includes a zero-dependency Python 3 standard library implementation:

1. **Python Database Engine Test (SQLite)**:
   ```bash
   python3 python_testimonial_system.py
   ```
   *Initializes `testimonial_collector.db`, creates tables, generates short-lived JWTs (15-min expiry), tests token rotation, and verifies SQL metrics.*

2. **Standalone Python HTTP REST API Server** (Port `8000`):
   ```bash
   python3 python_server.py
   ```
   *Starts Python HTTP server on `http://localhost:8000`.*

3. **Standalone Python Desktop GUI (Tkinter)**:
   ```bash
   python3 python_gui_app.py
   ```
   *Launches desktop moderation window.*

---

## 🌐 Localhost URL Routes

Once the app is running on `http://localhost:3000`, you can access:

- **Dashboard & Moderation Inbox**: `http://localhost:3000`
- **Wall of Love**: `http://localhost:3000/wall/acme-corp`
- **Public Customer Feedback Form**: `http://localhost:3000/collect/acme-corp`
- **Analytics & Rating Metrics**: `http://localhost:3000/metrics`
- **Company & Employee Management**: `http://localhost:3000/company`
- **Interactive Python Playground**: `http://localhost:3000/python`
- **Standalone Embed Script**: `http://localhost:3000/embed.js`

---

## 💡 Troubleshooting Localhost Setup

- **Port 3000 is already in use?**
  - Make sure no other service is occupying port 3000, or terminate the existing process:
    - On Linux/macOS: `lsof -ti:3000 | xargs kill -9`
    - On Windows: `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
- **Data persistence on localhost**:
  - Reviews and spaces are stored locally in `./data/db.json` and `./testimonial_collector.db`. They automatically persist across server restarts.
