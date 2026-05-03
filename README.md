# 🌲 Woodlands at Echo Farms — Neighborhood Directory

A private, password-protected neighborhood directory hosted on Vercel with a Supabase database.

---

## Setup (one-time, ~15 minutes)

### Step 1 — Supabase (your database)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Click **New Project** — name it `woodlands-directory`, pick a region close to you
3. Once created, go to **SQL Editor → New Query**
4. Paste the contents of `supabase-schema.sql` and click **Run**
5. Go to **Project Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon / public** key

### Step 2 — Deploy to Vercel

1. Push this folder to a GitHub repo (can be private)
2. Go to [vercel.com](https://vercel.com), sign in, click **Add New Project**
3. Import your GitHub repo
4. Under **Environment Variables**, add these three:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Your Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_EDIT_PASSWORD` | A password you choose for neighbors (e.g. `Woodlands2024!`) |

5. Click **Deploy** — Vercel builds and gives you a live URL like `woodlands-directory.vercel.app`

### Step 3 — Share with neighbors

Send neighbors the Vercel URL and the password you set. That's it!

---

## Local development

```bash
# Install dependencies
npm install

# Copy env template and fill in your values
cp .env.example .env.local

# Start dev server
npm run dev
```

---

## Changing the password

Go to Vercel → your project → Settings → Environment Variables → update `VITE_EDIT_PASSWORD` → Redeploy.

---

## Custom domain (optional)

In Vercel → your project → Settings → Domains, you can add a custom domain like `directory.woodlandsatechofarms.com`.
