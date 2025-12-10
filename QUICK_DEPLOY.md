# Quick Deploy Guide (5 Minutes)

## What You Need
1. GitHub account with your code pushed
2. Railway account (https://railway.app)
3. Vercel account (https://vercel.com)

## Deploy Backend to Railway (3 minutes)

1. Go to https://railway.app/dashboard
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Node.js ✅
5. Click "Variables" and add these:

```
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend.vercel.app
FRONTEND_URLS=https://your-frontend.vercel.app,http://localhost:5173
EXTRA_ALLOWED_ORIGINS=http://localhost:5173
JWT_SECRET=change_me_to_random_string_123456
DATABASE_URL=postgresql://neondb_owner:npg_F7l4chvSKpgD@ep-plain-mode-a4ig67kc-pooler.us-east-1.aws.neon.tech/neondb
CLOUDINARY_CLOUD_NAME=dtr1tnutd
CLOUDINARY_API_KEY=552711811534446
CLOUDINARY_API_SECRET=5TmhmETtNnAsQmWiJipsEs9AAiE
MAILER_USER=capstonee2@gmail.com
MAILER_PASS=qtfsgsycatrxythj
MAILER_FROM="Tesla Ops <capstonee2@gmail.com>"
GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

6. Click "Deploy" and wait 5-10 minutes
7. Copy your Railway URL (e.g., `https://app-xyz.up.railway.app`)

## Deploy Frontend to Vercel (2 minutes)

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Set Root Directory to `./client`
5. Click "Environment Variables" and add:

```
VITE_API_URL=https://app-xyz.up.railway.app/api
```
(Replace with your Railway URL from above)

6. Click "Deploy" and wait 3-5 minutes
7. Copy your Vercel URL (e.g., `https://app-abc.vercel.app`)

## Update Backend CORS (1 minute)

1. Go back to Railway dashboard
2. Click "Variables"
3. Update `FRONTEND_URL` with your Vercel URL:
```
FRONTEND_URL=https://app-abc.vercel.app
FRONTEND_URLS=https://app-abc.vercel.app,http://localhost:5173
```
4. Railway auto-redeploys ✅

## Test It Works! (1 minute)

1. Open https://app-abc.vercel.app
2. Login: `demo.admin@tesla.com` / `DemoPass123!`
3. Try document search
4. Try AI chatbot (🤖 button)
5. Check browser console (F12) for errors

## Done! 🚀

Your app is now live on:
- **Backend**: https://app-xyz.up.railway.app
- **Frontend**: https://app-abc.vercel.app

Any code changes you push to GitHub will auto-deploy!

---

## Troubleshooting

**"Cannot GET /" error?**
- Backend not running. Check Railway logs.

**"Cannot find module" error?**
- Dependencies not installed. Check Railway logs.

**Login fails?**
- Check Railway logs for database errors.
- Verify DATABASE_URL is correct.

**CORS error in console?**
- Update FRONTEND_URL in Railway to match your Vercel URL.
- Wait 1 minute for Railway to redeploy.

**API calls fail?**
- Check VITE_API_URL in Vercel matches Railway URL.
- Verify no trailing slashes.

**Still stuck?**
- Read full guide: `DEPLOYMENT_GUIDE.md`
- Check Railway logs: Dashboard → Logs tab
- Check Vercel logs: Dashboard → Deployments
