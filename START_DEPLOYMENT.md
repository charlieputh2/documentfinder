# 🚀 START HERE - Deployment Guide

## What You're About to Do

You're going to deploy your application to the cloud in 3 simple steps:

1. **Backend** → Railway (Node.js server)
2. **Frontend** → Vercel (React app)
3. **Connect** them together

**Total time**: ~20 minutes

---

## Prerequisites (Do These First!)

### ✅ Step 1: Prepare Your Code
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### ✅ Step 2: Create Accounts (Free)
- Railway: https://railway.app (sign up with GitHub)
- Vercel: https://vercel.com (sign up with GitHub)

### ✅ Step 3: Verify Locally (Optional but Recommended)
```bash
# Test backend
cd backend
npm install
npm run start
# Should see: "🚀 Server listening on port 5000"

# Test frontend (in another terminal)
cd client
npm install
npm run dev
# Should see: "Local: http://localhost:5173"
```

---

## Deployment Steps

### 🔵 STEP 1: Deploy Backend to Railway (5 minutes)

#### 1.1 Create Railway Project
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose your repository
5. Click "Deploy"

#### 1.2 Add Environment Variables
In Railway dashboard:
1. Click "Variables" tab
2. Add these variables (copy-paste the values):

| Variable | Value |
|----------|-------|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://your-frontend.vercel.app` |
| `FRONTEND_URLS` | `https://your-frontend.vercel.app,http://localhost:5173` |
| `EXTRA_ALLOWED_ORIGINS` | `http://localhost:5173` |
| `JWT_SECRET` | `change_me_to_random_value_12345` |
| `DATABASE_URL` | `postgresql://neondb_owner:npg_F7l4chvSKpgD@ep-plain-mode-a4ig67kc-pooler.us-east-1.aws.neon.tech/neondb` |
| `CLOUDINARY_CLOUD_NAME` | `dtr1tnutd` |
| `CLOUDINARY_API_KEY` | `552711811534446` |
| `CLOUDINARY_API_SECRET` | `5TmhmETtNnAsQmWiJipsEs9AAiE` |
| `MAILER_USER` | `capstonee2@gmail.com` |
| `MAILER_PASS` | `qtfsgsycatrxythj` |
| `MAILER_FROM` | `Tesla Ops <capstonee2@gmail.com>` |
| `GEMINI_API_KEY` | `AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM` |

#### 1.3 Wait for Deployment
- Railway builds and deploys automatically
- Takes 5-10 minutes
- Check logs for any errors
- When done, you'll see a URL like: `https://app-xyz.up.railway.app`

#### 1.4 Copy Your Railway URL
**Important**: Save this URL, you'll need it for Vercel!
```
https://app-xyz.up.railway.app
```

#### 1.5 Test Backend
Open in browser:
```
https://app-xyz.up.railway.app
```

Should show:
```json
{
  "status": "ok",
  "message": "Manufacturing & Quality Instruction Document Finder API",
  "version": "1.0.0"
}
```

✅ **Backend is live!**

---

### 🟢 STEP 2: Deploy Frontend to Vercel (5 minutes)

#### 2.1 Create Vercel Project
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Click "Import"

#### 2.2 Configure Build Settings
When prompted, set:
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Root Directory**: `./client` (if monorepo)

#### 2.3 Add Environment Variable
1. Click "Environment Variables"
2. Add:
   ```
   Name:  VITE_API_URL
   Value: https://app-xyz.up.railway.app/api
   ```
   (Replace `app-xyz` with your Railway URL from Step 1)

#### 2.4 Deploy
- Click "Deploy"
- Takes 3-5 minutes
- When done, you'll see a URL like: `https://app-abc.vercel.app`

#### 2.5 Copy Your Vercel URL
**Important**: Save this URL!
```
https://app-abc.vercel.app
```

✅ **Frontend is live!**

---

### 🟡 STEP 3: Update Backend CORS (2 minutes)

Now that you have both URLs, tell Railway about your Vercel frontend:

#### 3.1 Go Back to Railway
1. Open https://railway.app/dashboard
2. Click on your project
3. Click "Variables" tab

#### 3.2 Update These Variables
Find and change:

**FRONTEND_URL**
```
Old: https://your-frontend.vercel.app
New: https://app-abc.vercel.app
```

**FRONTEND_URLS**
```
Old: https://your-frontend.vercel.app,http://localhost:5173
New: https://app-abc.vercel.app,http://localhost:5173
```

#### 3.3 Save
- Click "Save"
- Railway auto-redeploys (1-2 minutes)

✅ **Everything is connected!**

---

## Test Your Deployment

### Test 1: Open Frontend
1. Go to: https://app-abc.vercel.app
2. You should see the login page with Tesla logo

### Test 2: Login
1. Email: `demo.admin@tesla.com`
2. Password: `DemoPass123!`
3. Click "Login"
4. Should see dashboard

### Test 3: Check Console
1. Press F12 (DevTools)
2. Go to "Console" tab
3. Look for any red errors
4. Should see no CORS errors

### Test 4: Test Features
- [ ] Dashboard loads
- [ ] Document search works
- [ ] Can click documents
- [ ] AI chatbot (🤖) responds
- [ ] No errors in console

✅ **Everything works!**

---

## What Happens Next

### Automatic Updates
Every time you push code to GitHub:
1. Railway auto-deploys backend
2. Vercel auto-deploys frontend
3. No manual steps needed!

### Example:
```bash
# Make a change
echo "// Updated" >> client/src/App.jsx

# Commit and push
git add .
git commit -m "Updated app"
git push origin main

# That's it! Both will auto-deploy in 2-3 minutes
```

---

## Your Live URLs

After deployment, share these:

**Frontend**: https://app-abc.vercel.app
**Backend API**: https://app-xyz.up.railway.app/api

---

## Troubleshooting

### ❌ Backend shows error
- Check Railway logs: Dashboard → Logs tab
- Verify all environment variables are set
- Check database connection

### ❌ Frontend shows blank page
- Check browser console (F12)
- Verify `VITE_API_URL` is correct in Vercel
- Check network requests in DevTools

### ❌ Login fails
- Check Railway logs for auth errors
- Verify database is connected
- Check JWT_SECRET is set

### ❌ CORS error in console
- Update `FRONTEND_URL` in Railway to match Vercel URL
- Wait 1-2 minutes for redeploy
- Refresh browser

### ❌ API calls fail
- Check `VITE_API_URL` in Vercel
- Should be: `https://app-xyz.up.railway.app/api`
- No trailing slash!

---

## Full Documentation

For more details, see:
- `QUICK_DEPLOY.md` - 5-minute quick start
- `DEPLOYMENT_GUIDE.md` - Complete step-by-step
- `RAILWAY_VERCEL_SETUP.md` - Visual guide with all details
- `DEPLOYMENT_CHECKLIST.md` - Verification checklist

---

## Security Reminders

⚠️ **Important**:
1. Change `JWT_SECRET` to a strong random value
2. Never commit `.env` files
3. Use Railway/Vercel's environment variable management
4. Rotate API keys periodically
5. Monitor logs for suspicious activity

---

## Success! 🎉

Your application is now:
- ✅ Deployed to Railway (backend)
- ✅ Deployed to Vercel (frontend)
- ✅ Connected and working
- ✅ Auto-updating with every GitHub push
- ✅ Ready for production!

**Next**: Share your app with the world!

---

## Quick Links

- **Railway Dashboard**: https://railway.app/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Database (Neon)**: https://console.neon.tech
- **Storage (Cloudinary)**: https://cloudinary.com/console

---

## Need Help?

1. Check the relevant documentation file
2. Look at Railway/Vercel logs
3. Check browser console (F12)
4. Check network requests (F12 → Network)
5. Read error messages carefully

**You've got this! 🚀**
