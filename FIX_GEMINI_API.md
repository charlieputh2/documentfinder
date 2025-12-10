# Fix Gemini API - Troubleshooting Guide

## Problem
The chatbot is returning generic fallback responses instead of real Gemini API responses.

## Solution

### Step 1: Verify Gemini Package is Installed

```bash
cd backend
npm list @google/generative-ai
```

If not installed, install it:
```bash
npm install @google/generative-ai
```

### Step 2: Verify API Key is Set

Check `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

If the key is missing or invalid:
1. Get a free key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `backend/.env` with your key
3. Restart the backend

### Step 3: Check Backend Logs

When you send a message, check the backend console for:

**Success:**
```
✅ Gemini API initialized
✅ Gemini API response generated successfully
```

**Error:**
```
❌ Gemini API error: [error message]
⚠️ Gemini API not available
```

### Step 4: Check Browser Console

Open browser DevTools (F12) and check the console for:

**Success:**
```
📤 Sending message to AI: [your message]
📥 Response status: 200
✅ AI Response received: [first 100 chars]
```

**Error:**
```
❌ AI API error: [error details]
```

### Step 5: Test the API Directly

Open a terminal and test the API:

```bash
# Get your JWT token first (check localStorage in browser)
# Then run:

curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "message": "How do I upload documents?",
    "context": {
      "system": "Tesla Manufacturing & Quality Vault",
      "userRole": "admin",
      "features": ["Upload", "Preview", "Download"]
    }
  }'
```

You should get a real response from Gemini, not the fallback.

## What Changed

### Backend Improvements
- ✅ Better system prompt (like Google Search)
- ✅ Upgraded to gemini-1.5-pro model
- ✅ Increased token limit to 2000
- ✅ Better error logging
- ✅ Fallback to gemini-pro if needed

### Frontend Improvements
- ✅ Added detailed console logging
- ✅ Better error handling
- ✅ Shows when API is called and responds
- ✅ Toast notifications for errors

## Common Issues & Fixes

### Issue: "Gemini API not available"
**Cause**: Package not installed  
**Fix**:
```bash
cd backend
npm install @google/generative-ai
npm run dev
```

### Issue: "API error: 401"
**Cause**: Invalid or missing API key  
**Fix**:
1. Get new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `backend/.env`
3. Restart backend

### Issue: "API error: 429"
**Cause**: Rate limit exceeded  
**Fix**: Wait a few minutes and try again

### Issue: "API error: 500"
**Cause**: Server error  
**Fix**:
1. Check backend logs for details
2. Restart backend
3. Try again

### Issue: Still getting fallback responses
**Fix**:
1. Check backend console for errors
2. Check browser console (F12)
3. Verify API key is valid
4. Restart both servers
5. Clear browser cache

## Verification Steps

### 1. Backend is Running
```bash
# Should see:
✅ Gemini API initialized
🚀 Server listening on port 5000
```

### 2. Frontend is Running
```bash
# Should see in browser:
# VITE v4.x.x ready in xxx ms
```

### 3. API is Working
1. Open browser DevTools (F12)
2. Go to Console tab
3. Send a message in chatbot
4. Should see:
   ```
   📤 Sending message to AI: [your message]
   📥 Response status: 200
   ✅ AI Response received: [response]
   ```

### 4. Response is Real
- Response should be different each time
- Response should answer your specific question
- Response should be detailed and comprehensive
- NOT the generic fallback message

## How to Know It's Working

✅ **Real API Response:**
- Different answer for each question
- Specific to your question
- Detailed and comprehensive
- Uses formatting with bullet points
- Includes examples and step-by-step guidance

❌ **Fallback Response:**
- Same generic message every time
- Doesn't answer your specific question
- Lists generic topics
- "I'm here to help! Here are some things..."

## Testing Checklist

- [ ] Backend is running: `npm run dev` in backend folder
- [ ] Frontend is running: `npm run dev` in client folder
- [ ] Logged in with demo credentials
- [ ] Opened browser DevTools (F12)
- [ ] Clicked 🤖 button to open chatbot
- [ ] Typed a question
- [ ] Pressed Enter to send
- [ ] Check console shows "📤 Sending message"
- [ ] Check console shows "📥 Response status: 200"
- [ ] Check console shows "✅ AI Response received"
- [ ] Check chatbot shows real response (not fallback)
- [ ] Response is specific to your question
- [ ] Response is detailed and comprehensive

## Advanced Debugging

### Enable Verbose Logging

Edit `backend/routes/ai.js` and add more console logs:

```javascript
console.log('Full prompt:', fullPrompt);
console.log('API initialized:', !!api);
console.log('Model:', model);
```

### Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Send a message
4. Click on the `/api/ai/chat` request
5. Check Response tab for the actual response

### Check API Status

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) to:
- Verify API key is active
- Check usage and quota
- Ensure billing is set up (if needed)

## Still Not Working?

1. **Check all logs** - Backend console AND browser console
2. **Verify API key** - Make sure it's correct and active
3. **Restart servers** - Sometimes helps
4. **Clear cache** - Browser cache and localStorage
5. **Check internet** - Verify connection to Google API
6. **Try different question** - Some questions work better than others

## Success Indicators

When working correctly, you'll see:

**Backend Console:**
```
✅ Gemini API initialized
✅ Gemini API response generated successfully
```

**Browser Console:**
```
📤 Sending message to AI: How do I upload documents?
📥 Response status: 200
✅ AI Response received: Here's how to upload documents...
```

**Chatbot:**
- Real, detailed response
- Specific to your question
- Different each time
- Formatted with bullet points

---

**Last Updated**: January 2024  
**Status**: Fixed and Improved
