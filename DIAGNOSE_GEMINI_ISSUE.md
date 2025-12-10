# Diagnose Gemini API Issue - Getting Fallback Responses

## Problem
Chatbot is returning the same generic fallback response every time instead of real Gemini API responses.

## Root Cause
The Gemini API call is failing silently and falling back to the generic response. This can be caused by:
1. Missing or invalid API key
2. Package not installed
3. API quota exceeded
4. Network issues

## How to Diagnose

### Step 1: Check Backend Console Logs

When you send a message, look for these logs in the backend terminal:

**Success Indicators:**
```
🔄 Attempting to call Gemini API...
API Key present: true
✅ Model initialized: gemini-pro
✅ Gemini API response generated successfully
Response preview: [actual response text]
```

**Error Indicators:**
```
❌ GEMINI_API_KEY not set in environment variables
❌ Failed to initialize Gemini API
❌ Gemini API error: [error message]
❌ No response from Gemini API
❌ Empty response text from Gemini API
```

### Step 2: Verify API Key

Check `backend/.env`:
```env
GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

If missing or empty:
1. Get a free key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `backend/.env`
3. Restart backend

### Step 3: Verify Package is Installed

```bash
cd backend
npm list @google/generative-ai
```

If not installed:
```bash
npm install @google/generative-ai
npm run dev
```

### Step 4: Check API Key Validity

Visit [Google AI Studio](https://makersuite.google.com/app/apikey) and verify:
- API key is active (not disabled)
- API key has not expired
- API quota is available
- Billing is set up (if needed)

### Step 5: Test API Directly

Create a test file `backend/test-gemini.js`:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini API...');
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Hello, how are you?');
    const response = result.response.text();
    console.log('✅ Success:', response);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGemini();
```

Run it:
```bash
node backend/test-gemini.js
```

## Common Issues & Solutions

### Issue 1: "GEMINI_API_KEY not set"
**Cause**: API key missing from `.env`  
**Solution**:
1. Add to `backend/.env`:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
2. Restart backend

### Issue 2: "Failed to initialize Gemini API"
**Cause**: Package not installed  
**Solution**:
```bash
cd backend
npm install @google/generative-ai
npm run dev
```

### Issue 3: "API error: 403"
**Cause**: API key invalid or quota exceeded  
**Solution**:
1. Get new key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Verify key is active
3. Check quota usage

### Issue 4: "API error: 429"
**Cause**: Rate limit exceeded  
**Solution**: Wait a few minutes and try again

### Issue 5: "No response from Gemini API"
**Cause**: API returned empty response  
**Solution**:
1. Check API key validity
2. Try simpler question
3. Check internet connection

## What to Check

### Backend Console
```bash
# Terminal where backend is running
# Should see when you send a message:

🔄 Attempting to call Gemini API...
API Key present: true
✅ Model initialized: gemini-pro
✅ Gemini API response generated successfully
Response preview: [your response]
```

### Browser Console (F12)
```
📤 Sending message to AI: [your question]
📥 Response status: 200
✅ AI Response received: [response]
```

### Chatbot Response
- **Real Response**: Different each time, specific to question, detailed
- **Fallback Response**: Same generic message, lists topics, not specific

## Step-by-Step Debugging

### 1. Restart Backend
```bash
cd backend
npm run dev
```

Watch console for initialization messages.

### 2. Send a Test Message
Click 🤖 → Type "Hello" → Press Enter

### 3. Check Backend Console
Look for error messages like:
- `❌ GEMINI_API_KEY not set`
- `❌ Failed to initialize Gemini API`
- `❌ Gemini API error`

### 4. Check Browser Console (F12)
Look for:
- `📤 Sending message`
- `📥 Response status: 200`
- `✅ AI Response received`

### 5. Verify Response
- Is it the same generic message?
- Or is it a real, specific response?

## If Still Getting Fallback

### Check 1: API Key
```bash
# In backend/.env, verify:
GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

### Check 2: Package
```bash
cd backend
npm list @google/generative-ai
```

Should show version number, not "not installed"

### Check 3: Logs
Restart backend and watch console for errors:
```bash
cd backend
npm run dev
```

### Check 4: Test Directly
Create and run `backend/test-gemini.js` (see above)

### Check 5: Network
Ensure you have internet connection to reach Google API

## Success Indicators

✅ **Backend Console:**
```
✅ Gemini API initialized with key: AIzaSyBvNg...
🔄 Attempting to call Gemini API...
API Key present: true
✅ Model initialized: gemini-pro
✅ Gemini API response generated successfully
Response preview: Here's how to upload documents...
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

## Getting Help

If you're still stuck:

1. **Check all logs** - Backend console AND browser console
2. **Verify API key** - Make sure it's correct and active
3. **Restart servers** - Sometimes helps
4. **Clear cache** - Browser cache and localStorage
5. **Try test file** - Run `test-gemini.js` to verify API works

## Quick Checklist

- [ ] Backend running: `npm run dev` in backend folder
- [ ] API key in `backend/.env`
- [ ] Package installed: `npm list @google/generative-ai`
- [ ] Backend console shows "✅ Gemini API initialized"
- [ ] Send test message
- [ ] Backend console shows "✅ Gemini API response generated successfully"
- [ ] Browser console shows "✅ AI Response received"
- [ ] Chatbot shows real response (not fallback)

---

**Last Updated**: January 2024  
**Status**: Diagnostic Guide
