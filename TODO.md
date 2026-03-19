# Supabase Database Migration TODO

## Approved Plan Steps (Database Change to kicqbtlhslyovbkmagtp)

**✅ 1. Create .env.new template** - Done.  
   Copy contents to `.env` (backup first!), `.env.production`, `.env.example`.

**✅ 2. Migrate schema** - Run in new terminal:  
   ```
   cd "Babitas-Kitchen/Babitas-Kitchen"
   copy .env.new .env
   npm run db:push
   ```
   Confirms: Tables pushed to new Supabase.

**⏳ 3. Test local dev** - Run:  
   `start-dev.bat` (uses .env)  
   Check terminal: "serving on port 5000", no DB errors.  
   Browser: http://localhost:5000 → Home page loads products from Supabase (check Network/Console, no "demo" fallback).

**⏳ 4. Supabase Dashboard** (https://supabase.com/dashboard/project/kicqbtlhslyovbkmagtp):  
   - Database → Tables: Verify schema (products, categories, etc.).  
   - Authentication → RLS: Enable public read on products/categories (for client queries).  
   - Table Editor: Insert demo data if empty (copy from client/src/hooks/use-supabase.ts DEMO_PRODUCTS/CATEGORIES).

**⏳ 5. Production Deploy** (Vercel):  
   - copy .env.new → .env.production  
   - vercel-setup.bat or Vercel dashboard: Add env vars.

**⏳ 6. Verify Production** - Test deployed site APIs/client.

## Next Action
Copy .env.new → .env then run `npm run db:push` and share terminal output. Mark steps ✅ here after.
