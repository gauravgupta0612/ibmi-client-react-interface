@echo off
REM IBM i Client React Interface - Full Stack Startup Script
REM This script starts both frontend and backend servers in separate terminal windows

echo.
echo ========================================
echo IBM i Green Screen Interface
echo Full Stack Startup
echo ========================================
echo.

REM Get the script directory
set SCRIPT_DIR=%~dp0

REM Check if we're using real iTookit connections
set USE_REAL_CONNECTION=false

REM Ask user if they want to use real connections
echo.
echo Select connection mode:
echo 1) Demo Mode (no IBM i required, instant testing)
echo 2) Real Mode (with iTookit, requires setup)
echo.
set /p MODE="Enter choice (1 or 2) [default: 1]: "
if "%MODE%"=="" set MODE=1

if "%MODE%"=="2" (
    set USE_REAL_CONNECTION=true
    echo.
    echo Using REAL MODE with iTookit
    echo Make sure:
    echo - USE_REAL_CONNECTION is set in .env
    echo - iTookit dependencies are installed
    echo - IBM i system credentials are configured
    echo.
) else (
    echo.
    echo Using DEMO MODE
    echo Connection will work without real IBM i system
    echo.
)

REM Start Frontend
echo Starting Frontend (React + Vite)...
start "IBM i Frontend - React" cmd /k "cd /d "%SCRIPT_DIR%" && npm run dev"
echo Frontend started on http://localhost:5173

REM Wait a moment for frontend to start
timeout /t 2 /nobreak

REM Start Backend
echo.
echo Starting Backend (Express API Server)...

if "%USE_REAL_CONNECTION%"=="true" (
    start "IBM i Backend - Express (Real Mode)" cmd /k "cd /d "%SCRIPT_DIR%\ibmi-backend-api" && set USE_REAL_CONNECTION=true && npm start"
) else (
    start "IBM i Backend - Express (Demo Mode)" cmd /k "cd /d "%SCRIPT_DIR%\ibmi-backend-api" && npm start"
)
echo Backend started on http://localhost:3001

echo.
echo ========================================
echo Servers Starting...
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3001
echo.
echo Open your browser to http://localhost:5173 to access the application
echo.
echo To stop servers: Close the terminal windows or press Ctrl+C
echo.
echo ========================================
echo.

REM Wait for user to close terminal
pause
