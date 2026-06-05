@echo off
echo Starting Resume Builder Project...

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node server.js"

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================================
echo The servers are starting in separate windows.
echo Once the frontend window says "Vite ready",
echo Open your browser and go to: http://localhost:5173
echo ========================================================
echo.
pause
