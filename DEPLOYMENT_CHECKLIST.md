# Deployment Checklist ✅

## Pre-Deployment (Local Testing)

- [ ] Backend runs locally: `npm run dev` in `/backend`
- [ ] Frontend runs locally: `npm run dev` in `/client`
- [ ] Login works with demo.admin@tesla.com / DemoPass123!
- [ ] Document search works
- [ ] AI chatbot (🤖) responds correctly
- [ ] No console errors in browser (F12)
- [ ] All environment variables are set in `.env`

## Backend Deployment to Railway

### Step 1: Prepare Repository
- [ ] All code committed to GitHub
- [ ] No uncommitted changes
- [ ] `.env` file is in `.gitignore` (don't commit secrets)
- [ ] `backend/railway.json` exists and is correct

### Step 2: Create Railway Project
- [ ] Railway account created (https://railway.app)
- [ ] New project created
- [ ] GitHub repository connected
- [ ] Backend folder selected (if monorepo)

### Step 3: Set Environment Variables in Railway
Copy all variables from `.env.railway`:
- [ ] `PORT=5000`
- [ ] `NODE_ENV=production`
- [ ] `FRONTEND_URL=https://your-vercel-url.vercel.app`
- [ ] `FRONTEND_URLS=https://your-vercel-url.vercel.app,http://localhost:5173`
- [ ] `EXTRA_ALLOWED_ORIGINS=http://localhost:5173`
- [ ] `JWT_SECRET=<strong-random-value>`
- [ ] `DATABASE_URL=<your-neon-postgres-url>`
- [ ] `CLOUDINARY_CLOUD_NAME=dtr1tnutd`
- [ ] `CLOUDINARY_API_KEY=552711811534446`
- [ ] `CLOUDINARY_API_SECRET=5TmhmETtNnAsQmWiJipsEs9AAiE`
- [ ] `MAILER_USER=capstonee2@gmail.com`
- [ ] `MAILER_PASS=qtfsgsycatrxythj`
- [ ] `MAILER_FROM="Tesla Ops <capstonee2@gmail.com>"`
- [ ] `GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM`

### Step 4: Deploy Backend
- [ ] Click "Deploy" in Railway
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Check deployment logs for errors
- [ ] Copy Railway URL (e.g., `https://your-app.up.railway.app`)
- [ ] Test: `curl https://your-app.up.railway.app`

### Step 5: Verify Backend
- [ ] Returns JSON response
- [ ] No 500 errors in logs
- [ ] Database connection successful
- [ ] All environment variables loaded

## Frontend Deployment to Vercel

### Step 1: Connect to Vercel
- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub connected to Vercel
- [ ] Repository authorized

### Step 2: Import Project
- [ ] Click "Add New Project" in Vercel
- [ ] Select your GitHub repository
- [ ] Select `/client` as root directory (if monorepo)
- [ ] Click "Import"

### Step 3: Configure Build Settings
- [ ] Framework: Vite
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

### Step 4: Set Environment Variables in Vercel
- [ ] `VITE_API_URL=https://your-railway-url.up.railway.app/api`
  (Replace with actual Railway URL from Step 4 above)

### Step 5: Deploy Frontend
- [ ] Click "Deploy"
- [ ] Wait for build to complete (3-5 minutes)
- [ ] Check build logs for errors
- [ ] Copy Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 6: Verify Frontend
- [ ] Page loads without errors
- [ ] No CORS errors in console
- [ ] Login page displays correctly
- [ ] Can login with demo credentials

## Post-Deployment Testing

### Backend Testing
```bash
# Test API is running
curl https://your-railway-url.up.railway.app

# Should return:
# {"status":"ok","message":"Manufacturing & Quality Instruction Document Finder API","version":"1.0.0"}
```

### Frontend Testing
1. Open https://your-vercel-url.vercel.app
2. Open DevTools (F12)
3. Go to Console tab
4. Try to login with: `demo.admin@tesla.com` / `DemoPass123!`
5. Check for errors:
   - [ ] No CORS errors
   - [ ] No 404 errors
   - [ ] No authentication errors
6. Test features:
   - [ ] Dashboard loads
   - [ ] Document search works
   - [ ] AI chatbot responds
   - [ ] File upload works

### Network Testing
1. Open DevTools → Network tab
2. Perform an action (login, search, etc.)
3. Check API calls:
   - [ ] Requests go to correct backend URL
   - [ ] Responses are 200 OK
   - [ ] No CORS errors
   - [ ] Response times are reasonable

## Troubleshooting

### Backend won't deploy
- [ ] Check Railway logs for build errors
- [ ] Verify all dependencies in `package.json`
- [ ] Check Node version compatibility
- [ ] Ensure `npm run start` works locally

### Frontend won't deploy
- [ ] Check Vercel build logs
- [ ] Verify `npm run build` works locally
- [ ] Check for TypeScript errors
- [ ] Ensure all imports are correct

### Login fails after deployment
- [ ] Check backend logs for auth errors
- [ ] Verify `JWT_SECRET` is set in Railway
- [ ] Check database connection in Railway logs
- [ ] Verify admin user exists in database

### API calls fail (CORS error)
- [ ] Check `FRONTEND_URL` in Railway matches Vercel URL
- [ ] Check `VITE_API_URL` in Vercel matches Railway URL
- [ ] Verify no trailing slashes in URLs
- [ ] Check Railway logs for CORS rejections

### AI Chatbot not working
- [ ] Verify `GEMINI_API_KEY` is set in Railway
- [ ] Check backend logs for API errors
- [ ] Test API key is valid
- [ ] Check rate limiting isn't blocking requests

## Final Checklist

- [ ] Backend deployed and running on Railway
- [ ] Frontend deployed and running on Vercel
- [ ] Both URLs are accessible from browser
- [ ] Login works
- [ ] Document search works
- [ ] AI chatbot works
- [ ] No console errors
- [ ] No network errors
- [ ] Database is connected
- [ ] All APIs are responding
- [ ] Ready for production! 🚀

## Continuous Deployment

After initial deployment:
1. Make code changes locally
2. Commit and push to GitHub
3. Railway will auto-deploy backend
4. Vercel will auto-deploy frontend
5. No manual deployment needed!

## Support Resources

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Neon Database: https://neon.tech
- Cloudinary: https://cloudinary.com/documentation
