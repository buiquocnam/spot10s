@echo off
echo Dang dong cac cong ket noi (8080, 3000, 3001)...

:: Kill process tren cong 8080 (Backend)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8080') do taskkill /f /pid %%a >nul 2>&1

:: Kill process tren cong 3000 (Frontend mac dinh)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %%a >nul 2>&1

:: Kill process tren cong 3001 (Frontend du phong)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3001') do taskkill /f /pid %%a >nul 2>&1

echo Da giai phong cac cong. Ban co the khoi dong lai du an ngay bay gio.
pause
