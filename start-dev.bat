@echo off
cd /d "C:\Users\shais\OneDrive\Desktop\Babita's Kitchen\Babitas-Kitchen\Babitas-Kitchen"
set "VITE_SUPABASE_URL=https://kicqbtlhslyovbkmagtp.supabase.co"
set "VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY3FidGxoc2x5b3Zia21hZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDgxNTIsImV4cCI6MjA4ODM4NDE1Mn0.4RwwWCk4B2oFbeOlBpwltu81pZUHLeDmHb40iR3OzH8"
set "DATABASE_URL=postgresql://postgres:password@localhost:5432/babitas_kitchen"
set "SESSION_SECRET=dev-secret-key"
set PORT=5000
npm run dev
pause

