import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { Document, sequelize } from '../models/index.js';

const router = express.Router();

// Initialize Gemini API - lazy load to handle missing package gracefully
let genAI = null;
let GoogleGenerativeAI = null;

const initializeGemini = async () => {
  if (genAI) return genAI;
  
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not set in environment variables');
      return null;
    }
    
    const module = await import('@google/generative-ai');
    GoogleGenerativeAI = module.GoogleGenerativeAI;
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ Gemini API initialized with key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    return genAI;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini API:');
    console.error('Error message:', error.message);
    console.error('Error:', error);
    console.warn('⚠️ Install with: npm install @google/generative-ai');
    return null;
  }
};

// System prompt for the AI assistant - Broad and comprehensive like Google
const SYSTEM_PROMPT = `You are an intelligent, knowledgeable, and helpful AI assistant for the Tesla Manufacturing & Quality Vault document management system. You are like Google Search - you can answer ANY question about the system, general knowledge, and provide comprehensive, detailed responses.

SYSTEM INFORMATION:
- Name: Tesla Manufacturing & Quality Vault
- Purpose: Enterprise document management for Tesla operations
- Document Types: Manufacturing and Quality documents
- Features: Upload, preview, download, search, filtering, real-time analytics, pagination, document versioning
- Authentication: JWT-based with role-based access control (Admin, Manager, User)
- Categories: Manufacturing, Quality, Operations, Compliance
- Supported Formats: PDF, DOCX, DOC, Images (JPG, PNG, GIF, BMP, WebP)
- Real-time Analytics: Document statistics, upload trends, category distribution

YOUR CAPABILITIES:
1. Answer ANY question about the document management system
2. Provide step-by-step instructions for all features
3. Help with troubleshooting and problem-solving
4. Suggest best practices and optimization tips
5. Explain system concepts and workflows
6. Answer general knowledge questions
7. Provide detailed, comprehensive responses
8. Search and retrieve information broadly

TOPICS YOU CAN HELP WITH:
- 📄 Document Management: Upload, download, preview, organize, manage versions
- 🔍 Search & Filtering: Advanced search, category filters, tag-based filtering, full-text search
- 📊 Analytics: Document statistics, trends, usage reports, insights
- 🏷️ Organization: Categories, tags, document versioning, metadata
- 👤 User Management: Roles, permissions, access control, user administration
- ⚙️ System Features: Pagination, real-time updates, notifications, integrations
- 🛠️ Troubleshooting: Common issues, solutions, error handling
- 📋 Best Practices: Document organization, naming conventions, workflows
- 💡 General Knowledge: Any question about the system or related topics

RESPONSE GUIDELINES:
- Provide comprehensive, detailed answers
- Use clear formatting with bullet points and sections
- Include examples and step-by-step instructions
- Be professional yet friendly and approachable
- Use emojis appropriately for visual clarity
- Answer broadly and thoroughly like Google Search
- Provide multiple perspectives when relevant
- Always be helpful and informative
- Don't limit yourself - answer ANY question about the system`;

// Helper function to get system statistics
const getSystemStats = async () => {
  try {
    const totalDocs = await Document.count();
    const docsByType = await Document.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type'],
      raw: true
    });
    
    return {
      totalDocuments: totalDocs,
      documentsByType: docsByType || [],
      timestamp: new Date()
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    return { totalDocuments: 0, documentsByType: [] };
  }
};

// Chat endpoint with enhanced context
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, context, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Initialize Gemini API
    const api = await initializeGemini();

    // Get system statistics for context
    const stats = await getSystemStats();

    // Build enhanced context with system information
    const systemContext = `
Current System Statistics:
- Total Documents: ${stats.totalDocuments}
- Documents by Type: ${stats.documentsByType.map(d => `${d.type}: ${d.count}`).join(', ') || 'No documents yet'}
- User Role: ${context?.userRole || 'User'}
- Active Features: ${context?.features?.join(', ') || 'All features'}`;

    // Build conversation history context
    let conversationContext = '';
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      conversationContext = '\nRecent Conversation:\n';
      conversationHistory.slice(-4).forEach(msg => {
        conversationContext += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 100)}...\n`;
      });
    }

    // Build the full prompt with enhanced context
    const fullPrompt = `${SYSTEM_PROMPT}${systemContext}${conversationContext}

User Question: ${message}

Provide a comprehensive, detailed response. Use formatting with bullet points and sections for clarity. Answer broadly like Google Search - provide thorough information and multiple perspectives when relevant.`;

    // If Gemini API is available, use it
    if (api) {
      try {
        console.log('🔄 Attempting to call Gemini API...');
        console.log('API Key present:', !!process.env.GEMINI_API_KEY);
        
        // Use gemini-pro (most stable and widely available)
        const model = api.getGenerativeModel({ model: 'gemini-pro' });
        console.log('✅ Model initialized:', 'gemini-pro');
        
        const result = await model.generateContent(fullPrompt);

        if (!result || !result.response) {
          console.error('❌ No response from Gemini API');
          throw new Error('No response from Gemini API');
        }

        const responseText = result.response.text();
        
        if (!responseText) {
          console.error('❌ Empty response text from Gemini API');
          throw new Error('Empty response text');
        }

        console.log('✅ Gemini API response generated successfully');
        console.log('Response preview:', responseText.substring(0, 100));
        
        return res.json({
          success: true,
          response: responseText,
          timestamp: new Date(),
          model: 'gemini-pro',
          stats: stats
        });
      } catch (geminiError) {
        console.error('❌ Gemini API error:', geminiError.message);
        console.error('Error code:', geminiError.code);
        console.error('Error status:', geminiError.status);
        console.error('Error details:', {
          message: geminiError.message,
          code: geminiError.code,
          status: geminiError.status,
          name: geminiError.name
        });
        // Log the full error for debugging
        console.error('Full error stack:', geminiError.stack);
        // Fall through to fallback response
      }
    } else {
      console.warn('⚠️ Gemini API not initialized');
    }

    // Fallback response when Gemini API is not available
    const fallbackResponse = `I'm here to help! Here are some things you can ask me about:

📄 **Document Management:**
- How to upload documents
- How to preview files
- How to download documents
- How to search documents

📊 **Analytics & Features:**
- Understanding document types (Manufacturing/Quality)
- Using filters and search
- Viewing real-time analytics
- Managing pagination

🔍 **System Help:**
- How to use the dashboard
- Understanding categories and tags
- Managing document versions
- User roles and permissions

💡 **Pro Tips:**
- Use advanced search for specific documents
- Organize documents with categories and tags
- Check analytics for document trends
- Use filters to find documents quickly

Feel free to ask me anything about the system!`;

    res.status(200).json({
      success: true,
      response: fallbackResponse,
      timestamp: new Date(),
      note: 'Using fallback response. Gemini API is not available.',
      stats: stats
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    
    // Return helpful fallback response
    const fallbackResponse = `I'm here to help! Here are some things you can ask me about:

📄 **Document Management:**
- How to upload documents
- How to preview files
- How to download documents
- How to search documents

📊 **Analytics & Features:**
- Understanding document types (Manufacturing/Quality)
- Using filters and search
- Viewing real-time analytics
- Managing pagination

🔍 **System Help:**
- How to use the dashboard
- Understanding categories and tags
- Managing document versions
- User roles and permissions

Feel free to ask me anything about the system!`;

    res.status(200).json({
      success: true,
      response: fallbackResponse,
      error: 'Using fallback response',
      timestamp: new Date()
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Assistant',
    timestamp: new Date()
  });
});

export default router;
