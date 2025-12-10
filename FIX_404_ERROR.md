# Fix 404 Error - AI Chatbot Not Connecting to Backend

## Problem
Getting 404 error when trying to use the chatbot:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
POST http://localhost:5173/api/ai/chat 404
```

## Root Cause
The frontend was using raw `fetch()` which was calling `/api/ai/chat` on the **frontend's localhost:5173** instead of the **backend's localhost:5000**.

## Solution ✅

I've fixed the issue by:
1. Importing the proper `api` instance from `lib/api.js`
2. Using `api.post('/ai/chat', ...)` instead of `fetch('/api/ai/chat', ...)`
3. This ensures the request goes to the correct backend URL

## What Changed

**File**: `client/src/components/common/AIHelper.jsx`

**Before** (Wrong):
```javascript
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({...})
});
```

**After** (Correct):
```javascript
import api from '../../lib/api';

const response = await api.post('/ai/chat', {
  message: userMessage,
  conversationHistory: messages.slice(-6),
  context: {...}
});
```

## How to Fix

### Step 1: Restart Both Servers

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

### Step 2: Verify Backend is Running

You should see in backend console:
```
✅ Database connection established
🚀 Server listening on port 5000
✅ Gemini API initialized
```

### Step 3: Verify Frontend is Running

You should see in browser:
```
VITE v4.x.x ready in xxx ms
```

### Step 4: Test the Chatbot

1. Open http://localhost:5173
2. Login with demo.admin@tesla.com / DemoPass123!
3. Click 🤖 button
4. Ask a question
5. Open DevTools (F12) → Console
6. You should see:
   ```
   📤 Sending message to AI: [your question]
   📥 Response status: 200
   ✅ AI Response received: [response]
   ```

## Verification Checklist

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 5173
- [ ] Browser console shows "📤 Sending message"
- [ ] Browser console shows "📥 Response status: 200"
- [ ] Browser console shows "✅ AI Response received"
- [ ] Chatbot shows real response (not fallback)
- [ ] Response is different each time
- [ ] Response answers your specific question

## If Still Getting 404

### Check 1: Is Backend Running?
```bash
# Should see:
🚀 Server listening on port 5000
```

If not, start it:
```bash
cd backend
npm run dev
```

### Check 2: Check Backend Port
Make sure backend is on port 5000, not a different port.

### Check 3: Check Frontend API Config
Open `client/src/lib/api.js` - should have:
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

### Check 4: Check Browser Console
Should show:
```
📤 Sending message to AI: [message]
📥 Response status: 200
```

If you see 404, backend is not running or on wrong port.

## Common Issues

### Issue: "Backend API not found"
**Cause**: Backend not running  
**Fix**: Start backend with `npm run dev` in backend folder

### Issue: "Cannot find module 'api'"
**Cause**: Import path wrong  
**Fix**: Make sure import is: `import api from '../../lib/api';`

### Issue: Still getting generic response
**Cause**: API call succeeded but Gemini API not initialized  
**Fix**: Check backend console for "✅ Gemini API initialized"

## Success Indicators

✅ **Backend Console:**
```
✅ Database connection established
🚀 Server listening on port 5000
✅ Gemini API initialized
✅ Gemini API response generated successfully
```

✅ **Browser Console:**
```
📤 Sending message to AI: How do I upload documents?
📥 Response status: 200
✅ AI Response received: Here's how to upload documents...
```

✅ **Chatbot:**
- Real response (not generic fallback)
- Specific to your question
- Different each time
- Detailed and comprehensive

---

**Status**: ✅ Fixed  
**Last Updated**: January 2024
