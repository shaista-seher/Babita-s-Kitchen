# Deployment Guide for Babita's Kitchen

## Prerequisites
- Supabase account (already set up)
- GitHub account (already have)
- Railway account (free tier)

---

## Step 1: Prepare Your Supabase Database Connection

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `orekiwsuftjlancvmavq`
3. Go to **Settings** → **Database**
4. Find the **Connection String** section
5. Copy the **URI** format:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.orekiwsuftjlancvmavq.supabase.co:5432/postgres
   ```
6. Replace `[YOUR-PASSWORD]` with your actual database password

---

## Step 2: Deploy to Railway

### Option A: Deploy via GitHub (Recommended)

1. **Push your code to GitHub**
   - Create a new repository on GitHub
   - Initialize git and push your code:
   ```bash
   cd "Babitas-Kitchen/Babitas-Kitchen"
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/babitas-kitchen.git
   git push -u origin main
   ```

2. **Deploy on Railway**
   - Go to [Railway.app](https://railway.app)
   - Sign up with your GitHub account
   - Click **New Project** → **Deploy from GitHub repo**
   - Select your repository
   - Click **Configure** and add these environment variables:

   | Variable | Value |
   |----------|-------|
   | `DATABASE_URL` | `postgresql://postgres:[YOUR-PASSWORD]@db.orekiwsuftjlancvmavq.supabase.co:5432/postgres` |
   | `SESSION_SECRET` | `random-string-at-least-32-characters` |
   | `PORT` | `5000` |
   | `NODE_ENV` | `production` |
   | `VITE_SUPABASE_URL` | `https://orekiwsuftjlancvmavq.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9yZWtpd3N1ZnRqbGFuY3ZtYXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0NTU1NDMsImV4cCI6MjA4ODAzMTU0M30.UOpPdGPv_UR0pNOM77j__EADUccVy6m81jBs6C_OGtc` |

   - Click **Deploy**

3. **Wait for deployment** (2-5 minutes)

4. **Get your URL** - Railway will provide a URL like `https://babitas-kitchen.up.railway.app`

---

## Step 3: Update Supabase Settings

1. Go to **Settings** → **API**
2. Under **Site URL**, add your Railway URL
3. Under **Redirect URLs**, add: `https://babitas-kitchen.up.railway.app/auth/callback`

---

## Step 4: Test Your Deployed App

Open your Railway URL in a browser:
```
https://your-app-name.up.railway.app
```

---

## Step 5: Access API from Mobile App

Your API will be available at:
```
https://your-app-name.up.railway.app/api/products
```

---

## Troubleshooting

### Database Connection Error
- Make sure DATABASE_URL is correct
- Check that your Supabase project is not paused

### CORS Errors
- The server is already configured for CORS
- If issues persist, check Railway logs

### Session Errors
- Generate a new SESSION_SECRET: use a random string generator

---

## For Future Updates

After making changes to your code:
```bash
git add .
git commit -m "Update description"
git push
```

Railway will automatically deploy on push to main branch.

