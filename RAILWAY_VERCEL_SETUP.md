# Railway & Vercel Setup - Visual Guide

## Part 1: Railway Backend Setup

### 1.1 Create Railway Account
- Go to https://railway.app
- Click "Start Free" or "Sign Up"
- Use GitHub to sign up (recommended)
- Authorize Railway to access your GitHub

### 1.2 Create New Project
- Click "New Project" button
- Select "Deploy from GitHub"
- Click "Configure GitHub App"
- Select your repository
- Click "Install & Authorize"

### 1.3 Select Repository
- Choose your documentfinder repository
- Click "Deploy"
- Railway will auto-detect Node.js ✅

### 1.4 Add Environment Variables
After deployment starts:
1. Click "Variables" tab
2. Click "Add Variable"
3. Add each variable from below:

**Copy-Paste These Variables:**

```
PORT
5000

NODE_ENV
production

FRONTEND_URL
https://your-frontend.vercel.app

FRONTEND_URLS
https://your-frontend.vercel.app,http://localhost:5173

EXTRA_ALLOWED_ORIGINS
http://localhost:5173

JWT_SECRET
your_super_secret_jwt_key_change_this_12345

DATABASE_URL
postgresql://neondb_owner:npg_F7l4chvSKpgD@ep-plain-mode-a4ig67kc-pooler.us-east-1.aws.neon.tech/neondb

CLOUDINARY_CLOUD_NAME
dtr1tnutd

CLOUDINARY_API_KEY
552711811534446

CLOUDINARY_API_SECRET
5TmhmETtNnAsQmWiJipsEs9AAiE

MAILER_USER
capstonee2@gmail.com

MAILER_PASS
qtfsgsycatrxythj

MAILER_FROM
Tesla Ops <capstonee2@gmail.com>

GEMINI_API_KEY
AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

### 1.5 Deploy
- Click "Deploy" button
- Wait 5-10 minutes for build
- Check logs for any errors
- When done, you'll see a URL like: `https://documentfinder-prod-xyz.up.railway.app`
- **Copy this URL** - you'll need it for Vercel!

### 1.6 Verify Backend
Open in browser:
```
https://your-railway-url.up.railway.app
```

Should show:
```json
{
  "status": "ok",
  "message": "Manufacturing & Quality Instruction Document Finder API",
  "version": "1.0.0"
}
```

---

## Part 2: Vercel Frontend Setup

### 2.1 Create Vercel Account
- Go to https://vercel.com
- Click "Sign Up"
- Use GitHub to sign up (recommended)
- Authorize Vercel to access your GitHub

### 2.2 Import Project
- Click "Add New..." → "Project"
- Click "Continue with GitHub"
- Select your documentfinder repository
- Click "Import"

### 2.3 Configure Project
When prompted:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `./client` (if monorepo) or leave blank

### 2.4 Add Environment Variable
1. Click "Environment Variables"
2. Add new variable:
   ```
   Name: VITE_API_URL
   Value: https://your-railway-url.up.railway.app/api
   ```
   (Replace with your actual Railway URL from Part 1)

3. Click "Add"

### 2.5 Deploy
- Click "Deploy"
- Wait 3-5 minutes for build
- When done, you'll see a URL like: `https://documentfinder-app.vercel.app`
- **Copy this URL** - you'll need it for Railway!

### 2.6 Verify Frontend
Open in browser:
```
https://your-vercel-url.vercel.app
```

Should show login page with Tesla logo

---

## Part 3: Update Railway CORS

Now that you have both URLs, update Railway to allow your Vercel frontend:

### 3.1 Go Back to Railway
- Open https://railway.app/dashboard
- Click on your project
- Click "Variables" tab

### 3.2 Update Variables
Find and update these variables:

**FRONTEND_URL**
```
Old: https://your-frontend.vercel.app
New: https://your-vercel-url.vercel.app
```

**FRONTEND_URLS**
```
Old: https://your-frontend.vercel.app,http://localhost:5173
New: https://your-vercel-url.vercel.app,http://localhost:5173
```

### 3.3 Save
- Click "Save"
- Railway will auto-redeploy (takes 1-2 minutes)
- Check logs to confirm deployment succeeded

---

## Part 4: Test Everything

### 4.1 Test Frontend
1. Open https://your-vercel-url.vercel.app
2. You should see the login page
3. Open browser DevTools: Press F12
4. Go to "Console" tab
5. Look for any red errors

### 4.2 Test Login
1. Enter email: `demo.admin@tesla.com`
2. Enter password: `DemoPass123!`
3. Click "Login"
4. Should see dashboard with documents

### 4.3 Test API Connection
In browser console (F12 → Console):
```javascript
fetch('https://your-railway-url.up.railway.app/api/documents', {
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
}).then(r => r.json()).then(console.log)
```

Should return documents without CORS errors.

### 4.4 Test Features
- [ ] Login works
- [ ] Dashboard loads
- [ ] Document search works
- [ ] Can click on documents
- [ ] AI chatbot (🤖) responds
- [ ] No red errors in console
- [ ] No CORS errors

---

## Part 5: Continuous Deployment

After initial setup, deployments are automatic:

### To Deploy New Changes:
1. Make code changes locally
2. Commit: `git commit -m "Your message"`
3. Push: `git push origin main`
4. Railway auto-deploys backend (1-2 minutes)
5. Vercel auto-deploys frontend (1-2 minutes)
6. Done! No manual steps needed.

---

## Troubleshooting

### Issue: "Cannot GET /"
**Solution**: Backend not running
- Check Railway logs: Dashboard → Logs tab
- Look for error messages
- Verify all environment variables are set

### Issue: "Cannot find module"
**Solution**: Dependencies not installed
- Check Railway build logs
- Verify `package.json` has all dependencies
- Try rebuilding in Railway

### Issue: Login fails
**Solution**: Database or auth issue
- Check Railway logs for database errors
- Verify `DATABASE_URL` is correct
- Check admin user exists in database

### Issue: CORS error in console
**Solution**: Frontend URL not allowed
- Go to Railway dashboard
- Update `FRONTEND_URL` to match your Vercel URL
- Wait 1-2 minutes for redeploy
- Refresh browser

### Issue: API calls fail
**Solution**: Wrong API URL
- Check `VITE_API_URL` in Vercel
- Should be: `https://your-railway-url.up.railway.app/api`
- No trailing slash!
- Redeploy Vercel after fixing

### Issue: AI Chatbot doesn't respond
**Solution**: Gemini API issue
- Check Railway logs for API errors
- Verify `GEMINI_API_KEY` is set
- Check API key is valid
- Check rate limiting

### Issue: File uploads fail
**Solution**: Cloudinary issue
- Verify `CLOUDINARY_*` variables in Railway
- Check Cloudinary account is active
- Check file size limits

---

## Quick Reference

### Your URLs (after deployment)
```
Backend:  https://your-railway-url.up.railway.app
Frontend: https://your-vercel-url.vercel.app
```

### Test Credentials
```
Email:    demo.admin@tesla.com
Password: DemoPass123!
```

### Important Endpoints
```
GET  /                    - API status
POST /api/auth/login      - Login
GET  /api/documents       - List documents
POST /api/documents       - Upload document
GET  /api/ai/chat         - AI chatbot
```

### Dashboard Links
```
Railway:  https://railway.app/dashboard
Vercel:   https://vercel.com/dashboard
Neon DB:  https://console.neon.tech
Cloudinary: https://cloudinary.com/console
```

---

## Success Checklist ✅

- [ ] Railway project created
- [ ] All environment variables added to Railway
- [ ] Backend deployed successfully
- [ ] Vercel project created
- [ ] VITE_API_URL added to Vercel
- [ ] Frontend deployed successfully
- [ ] FRONTEND_URL updated in Railway
- [ ] Login works
- [ ] Dashboard loads
- [ ] Document search works
- [ ] AI chatbot works
- [ ] No console errors
- [ ] No CORS errors
- [ ] Ready for production! 🚀

---

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Deploy frontend to Vercel
3. ✅ Update CORS in Railway
4. ✅ Test everything works
5. 🚀 Share your app with the world!

**Your app is now live and will auto-update with every GitHub push!**
