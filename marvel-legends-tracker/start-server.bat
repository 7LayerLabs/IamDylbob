@echo off
echo Starting Marvel Legends Tracker Server...
echo.
echo After server starts, open your browser and go to:
echo http://localhost:8000
echo.
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
pause