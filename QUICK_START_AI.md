# AI Chatbot - Quick Start Guide

## 🚀 Get Started in 2 Minutes

### Step 1: Install Dependencies (if not already done)

```bash
# Backend
cd backend
npm install @google/generative-ai

# Frontend (usually already installed)
cd ../client
npm install
```

### Step 2: Start the Application

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend (in a new terminal)
cd client
npm run dev
```

### Step 3: Login and Test

1. Open http://localhost:5173 in your browser
2. Login with:
   - **Email**: demo.admin@tesla.com
   - **Password**: DemoPass123!
3. Look for the **🤖 button** in the bottom-right corner
4. Click it to open the AI Assistant

### Step 4: Try These Questions

- "How do I upload documents?"
- "How do I search for documents?"
- "What document types are supported?"
- "How do I preview a document?"
- "How do I manage document categories?"

## ✨ What's New

### Frontend Features
✅ Professional AI chatbot UI  
✅ Real-time responses from Google Gemini  
✅ Conversation history  
✅ Suggested questions for new users  
✅ Clear chat button  
✅ Smooth animations  
✅ Responsive design  
✅ Keyboard shortcuts (Enter to send)  

### Backend Features
✅ Enhanced system prompt  
✅ Context-aware responses  
✅ System statistics integration  
✅ Conversation history support  
✅ Graceful error handling  
✅ Rate limiting ready  

## 🎯 Key Features

### 1. Smart Suggestions
When you first open the chat, you'll see suggested questions to get started quickly.

### 2. Conversation Context
The AI remembers your conversation and provides relevant follow-up responses.

### 3. System Awareness
The AI knows about:
- Total number of documents
- Document types and counts
- Your user role
- Available features

### 4. Professional Responses
Responses are formatted with:
- Bullet points
- Sections
- Emojis for clarity
- Step-by-step guidance

## 🔧 Configuration

### Change API Key (Optional)

If you want to use your own Gemini API key:

1. Get a free key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `backend/.env`:
   ```env
   GEMINI_API_KEY=your_new_key_here
   ```
3. Restart the backend

### Customize Suggested Questions

Edit `client/src/components/common/AIHelper.jsx`:

```javascript
const suggestedQuestions = [
  'Your question 1?',
  'Your question 2?',
  'Your question 3?',
  'Your question 4?'
];
```

## 🐛 Troubleshooting

### Chatbot not appearing?
- Make sure you're logged in
- Check browser console for errors
- Restart both frontend and backend

### Getting generic responses?
- Check that `GEMINI_API_KEY` is set in `backend/.env`
- Verify the API key is valid
- Check backend logs for errors

### Slow responses?
- Check your internet connection
- Verify Gemini API quota hasn't been exceeded
- Try asking a simpler question

## 📚 Learn More

See `AI_CHATBOT_SETUP.md` for:
- Detailed setup instructions
- Architecture overview
- Customization options
- Advanced features
- Performance tips
- Security considerations

## 💡 Tips

1. **Be Specific**: Ask specific questions for better answers
2. **Follow Up**: The AI remembers context, so you can ask follow-up questions
3. **Use Suggestions**: Click suggested questions to get started
4. **Clear Chat**: Use the 🗑️ button to start a fresh conversation
5. **Keyboard**: Press Enter to send, Shift+Enter for new line

## 🎉 You're All Set!

The AI Chatbot is now fully functional and ready to help users navigate the Document Finder system. Enjoy! 🚀

---

**Questions?** Check the troubleshooting section or review the detailed setup guide.
