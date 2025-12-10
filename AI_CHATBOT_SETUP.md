# AI Chatbot Setup Guide

## Overview
The Document Finder application now includes a fully functional AI Assistant powered by Google Gemini. The chatbot is intelligent, responsive, dynamic, and fully integrated with the system.

## Features

### 🤖 AI Assistant Capabilities
- **Real-time Responses**: Powered by Google Gemini API
- **Context Awareness**: Understands system statistics and user role
- **Conversation History**: Maintains context from previous messages
- **Smart Suggestions**: Provides quick-start questions for new users
- **Professional UI**: Modern, responsive design with smooth animations
- **Error Handling**: Graceful fallback responses if API is unavailable

### 💬 Chat Features
- **Suggested Questions**: Quick-start prompts for common tasks
- **Message History**: View all messages in the conversation
- **Clear Chat**: Reset conversation with one click
- **Typing Indicators**: Visual feedback while AI is thinking
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: Press Enter to send, Shift+Enter for new line

### 📊 System Integration
- **Document Statistics**: AI knows total documents and types
- **User Role Context**: Personalized responses based on user role
- **Feature Awareness**: AI knows about all system features
- **Real-time Updates**: Statistics update with each conversation

## Setup Instructions

### 1. Backend Configuration

The backend is already configured with Gemini API support. Verify the setup:

```bash
# Navigate to backend directory
cd backend

# Check that @google/generative-ai is installed
npm list @google/generative-ai

# If not installed, run:
npm install @google/generative-ai
```

### 2. Environment Variables

Ensure your `.env` file in the backend contains:

```env
# Google Gemini API - AI Assistant
GEMINI_API_KEY=AIzaSyBvNgRG-S6kD4pVJJ-isI48vs5XfnGJIQM
```

**Note**: The API key is already configured. If you want to use your own key:
1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Replace the value in `.env`

### 3. Frontend Configuration

The frontend is already configured. Verify:

```bash
# Navigate to client directory
cd client

# Check that required packages are installed
npm list react-hot-toast @headlessui/react
```

### 4. Start the Application

```bash
# Terminal 1: Start Backend
cd backend
npm run dev

# Terminal 2: Start Frontend
cd client
npm run dev
```

### 5. Test the Chatbot

1. Open the application in your browser (usually http://localhost:5173)
2. Login with demo credentials:
   - Email: `demo.admin@tesla.com`
   - Password: `DemoPass123!`
3. Look for the 🤖 button in the bottom-right corner
4. Click to open the AI Assistant
5. Try asking questions like:
   - "How do I upload documents?"
   - "How do I search for documents?"
   - "What document types are supported?"

## Architecture

### Backend (`backend/routes/ai.js`)

**Endpoints:**
- `POST /api/ai/chat` - Send message and get AI response
- `GET /api/ai/health` - Health check

**Features:**
- Lazy-loads Gemini API
- Provides system statistics context
- Maintains conversation history
- Graceful fallback responses
- Enhanced system prompt with detailed instructions

**System Prompt Includes:**
- System information and features
- User responsibilities and capabilities
- Communication style guidelines
- Available topics for assistance

### Frontend (`client/src/components/common/AIHelper.jsx`)

**Components:**
- Floating action button with pulse animation
- Modal dialog with chat interface
- Message display with timestamps
- Suggested questions for new users
- Input textarea with keyboard shortcuts
- Clear chat button
- Statistics toggle

**Features:**
- Conversation history management
- Auto-scroll to latest message
- Loading indicators
- Error handling with fallback messages
- Responsive design for all screen sizes
- Smooth animations and transitions

## API Integration

### Request Format

```json
{
  "message": "How do I upload documents?",
  "conversationHistory": [
    {
      "id": 1,
      "type": "assistant",
      "content": "...",
      "timestamp": "2024-01-01T12:00:00Z"
    }
  ],
  "context": {
    "system": "Tesla Manufacturing & Quality Vault",
    "userRole": "admin",
    "features": ["Upload", "Preview", "Download", ...],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

### Response Format

```json
{
  "success": true,
  "response": "Here's how to upload documents...",
  "timestamp": "2024-01-01T12:00:00Z",
  "model": "gemini-pro",
  "stats": {
    "totalDocuments": 42,
    "documentsByType": [
      { "type": "Manufacturing", "count": 25 },
      { "type": "Quality", "count": 17 }
    ]
  }
}
```

## Customization

### Change System Prompt

Edit `backend/routes/ai.js` and modify the `SYSTEM_PROMPT` constant:

```javascript
const SYSTEM_PROMPT = `Your custom system prompt here...`;
```

### Change Suggested Questions

Edit `client/src/components/common/AIHelper.jsx` and modify the `suggestedQuestions` array:

```javascript
const suggestedQuestions = [
  'Your custom question 1?',
  'Your custom question 2?',
  // ...
];
```

### Change UI Colors

Modify the Tailwind CSS classes in the component. The primary color is used for:
- Floating button background
- User message bubbles
- Send button
- Focus states

### Change Model

Edit `backend/routes/ai.js` and change the model name:

```javascript
const model = api.getGenerativeModel({ model: 'gemini-1.5-pro' }); // or other models
```

## Troubleshooting

### Chatbot Returns Generic Responses

**Cause**: Gemini API is not initialized
**Solution**: 
1. Check that `GEMINI_API_KEY` is set in `.env`
2. Verify the API key is valid
3. Check backend logs for errors
4. Restart the backend server

### "Cannot find module '@google/generative-ai'"

**Solution**:
```bash
cd backend
npm install @google/generative-ai
npm run dev
```

### Chatbot Not Appearing

**Cause**: AIHelper component not imported
**Solution**: Verify `AIHelper` is imported in your main layout component

### API Returns 401 Unauthorized

**Cause**: User not authenticated
**Solution**: 
1. Ensure user is logged in
2. Check that JWT token is valid
3. Verify authentication middleware is working

### Slow Responses

**Cause**: Network latency or API rate limiting
**Solution**:
1. Check internet connection
2. Verify Gemini API quota
3. Consider using a faster model

## Performance Tips

1. **Limit Conversation History**: Only send last 6 messages to reduce token usage
2. **Cache Responses**: Consider caching common questions
3. **Optimize Prompts**: Keep system prompt concise
4. **Rate Limiting**: Implement rate limiting for API calls
5. **Lazy Loading**: Load AI component only when needed

## Security Considerations

1. **API Key**: Keep `GEMINI_API_KEY` secure in environment variables
2. **Authentication**: All AI endpoints require authentication
3. **Input Validation**: Validate user messages before sending to API
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Data Privacy**: Don't send sensitive data in chat messages

## Advanced Features

### Add Document Search to AI

Modify the `getSystemStats` function to include document search:

```javascript
const getSystemStats = async () => {
  // ... existing code ...
  
  // Add document search
  const recentDocs = await Document.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']]
  });
  
  return {
    totalDocuments: totalDocs,
    documentsByType: docsByType || [],
    recentDocuments: recentDocs,
    timestamp: new Date()
  };
};
```

### Add Multi-language Support

Modify the system prompt to include language preferences:

```javascript
const SYSTEM_PROMPT = `You are an AI assistant...
Respond in the user's preferred language: ${context?.language || 'English'}`;
```

### Add Sentiment Analysis

Track user satisfaction with responses and improve over time.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs: `npm run dev`
3. Check browser console for errors
4. Verify all environment variables are set
5. Ensure all dependencies are installed

## Version History

- **v1.0.0** (Current)
  - Initial release with Gemini API integration
  - Conversation history support
  - System statistics context
  - Professional UI with animations
  - Suggested questions
  - Clear chat functionality

## Future Enhancements

- [ ] Multi-language support
- [ ] Document-specific Q&A
- [ ] User feedback collection
- [ ] Response caching
- [ ] Advanced analytics
- [ ] Custom AI models
- [ ] Voice input/output
- [ ] Sentiment analysis
- [ ] Response rating system
- [ ] Admin dashboard for AI management

---

**Last Updated**: January 2024
**Status**: ✅ Production Ready
