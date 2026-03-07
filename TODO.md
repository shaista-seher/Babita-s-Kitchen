# Babita's Kitchen - Update Implementation Plan

## Tasks

### Phase 1: Authentication (Supabase)
- [x] 1.1 Install Supabase client library
- [x] 1.2 Create supabaseClient.ts
- [x] 1.3 Create auth context provider
- [x] 1.4 Update use-auth hook (deprecated - using new auth-context)
- [x] 1.5 Create login page with Supabase Auth
- [x] 1.6 Create signup page
- [x] 1.7 Add password reset functionality
- [x] 1.8 Create protected route component
- [x] 1.9 Update App.tsx with new routes and auth
- [x] 1.10 Add session persistence

### Phase 2: Location Services
- [x] 2.1 Create location context
- [x] 2.2 Implement browser geolocation detection
- [x] 2.3 Add Nominatim geocoding (free alternative)
- [x] 2.4 Create user_addresses table schema
- [ ] 2.5 Update storage for addresses with lat/lng
- [x] 2.6 Add location indicator to navbar

### Phase 3: Logo & Design Fixes
- [x] 3.1 Update navbar with new logo styling
- [x] 3.2 Add "true taste of home" tagline to home page
- [x] 3.3 Fix login page design
- [x] 3.4 Update footer logo

### Phase 4: Protected Routes & Middleware
- [x] 4.1 Add route protection middleware
- [x] 4.2 Redirect unauthenticated users to /login
- [x] 4.3 Auto-redirect logged-in users away from /login

### Phase 5: Cleanup & Organization
- [ ] 5.1 Organize folder structure
- [ ] 5.2 Create proper auth pages directory
- [ ] 5.3 Test all auth flows

## NEXT STEPS (Required to run the app)

1. Add Supabase credentials to environment:
   Create a `.env` file in the project root with:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

