@echo off
cd /d "C:\Users\shais\OneDrive\Desktop\Babita's Kitchen\Babitas-Kitchen\Babitas-Kitchen"
vercel link --yes
vercel env add VITE_SUPABASE_URL production
echo https://kicqbtlhslyovbkmagtp.supabase.co
vercel env add VITE_SUPABASE_ANON_KEY production
echo eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpY3FidGxoc2x5b3Zia21hZ3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDgxNTIsImV4cCI6MjA4ODM4NDE1Mn0.4RwwWCk4B2oFbeOlBpwltu81pZUHLeDmHb40iR3OzH8
pause

