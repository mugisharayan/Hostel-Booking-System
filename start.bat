@echo off
echo Starting Hostel Booking System...
echo.

echo Installing dependencies...
call npm install
echo.

echo Starting servers...
start "Backend Server" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul
start "Frontend Server" cmd /k "cd client && npm run dev"

echo.
echo Servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause