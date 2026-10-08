@echo off
REM ==============================================================================
REM Acme Proof • One-Click Localhost Environment Setup Script for Windows
REM ==============================================================================

echo ==================================================
echo Setting up Acme Proof Localhost Environment...
echo ==================================================

node -v >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js and npm verified.

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
)

if not exist "data" (
    mkdir data
)

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo.
echo ==================================================
echo Setup completed successfully!
echo Starting development server on http://localhost:3000 ...
echo ==================================================
call npm run dev
