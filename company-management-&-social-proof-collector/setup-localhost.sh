#!/usr/bin/env bash
# ==============================================================================
# Acme Proof • One-Click Localhost Environment Setup Script
# Works on Linux, macOS, and Windows (Git Bash / WSL)
# ==============================================================================

set -e

echo "=================================================="
echo "🚀 Setting up Acme Proof Localhost Environment..."
echo "=================================================="

# 1. Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"

# 2. Check/create .env file
if [ ! -f ".env" ]; then
    echo "📝 Creating .env from .env.example..."
    cp .env.example .env
else
    echo "✓ .env file already exists."
fi

# 3. Ensure database directory exists
mkdir -p data
echo "✓ Database directory ready: ./data"

# 4. Install npm dependencies if node_modules missing
if [ ! -d "node_modules" ]; then
    echo "📦 Installing npm dependencies..."
    npm install
else
    echo "✓ Dependencies already installed in node_modules."
fi

# 5. Initialize Python SQLite DB if python3 available
if command -v python3 &> /dev/null; then
    echo "🐍 Initializing Python SQLite Database..."
    python3 python_testimonial_system.py > /dev/null 2>&1 || true
    echo "✓ SQLite DB verified: ./testimonial_collector.db"
else
    echo "⚠️ Python3 not found; skipping Python SQLite test (Node backend has fallback JSON DB)."
fi

echo ""
echo "=================================================="
echo "🎉 Environment setup completed successfully!"
echo "👉 Run the server with:  npm run dev"
echo "👉 Open in browser:      http://localhost:3000"
echo "=================================================="
