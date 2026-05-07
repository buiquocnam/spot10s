@echo off
echo Dang khoi dong Cafe Discovery Platform...

:: Mo terminal cho Backend
start "Cafe-Backend" cmd /k "cd backend && npm run dev"

:: Mo terminal cho Frontend
start "Cafe-Frontend" cmd /k "cd frontend && npm run dev"

echo Da kich hoat lenh chay. Vui loi kiem tra cac cua so terminal moi.
pause
