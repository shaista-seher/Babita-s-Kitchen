@echo off
cd /d "C:\Users\shais\OneDrive\Desktop\Babita's Kitchen\Babitas-Kitchen\Babitas-Kitchen"
set "DATABASE_URL=postgresql://postgres:password@localhost:5432/babitas_kitchen"
set "SESSION_SECRET=dev-secret-key"
set PORT=5000
npm run dev
pause

