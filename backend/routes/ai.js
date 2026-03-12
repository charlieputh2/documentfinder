import express from 'express';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/auth.js';
import { Document, sequelize } from '../models/index.js';

const router = express.Router();

let genAI = null;

const initializeGemini = async () => {
  if (genAI) return genAI;
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('GEMINI_API_KEY not set');
      return null;
    }
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('Gemini API initialized');
    return genAI;
  } catch (error) {
    console.error('Gemini init failed:', error.message);
    return null;
  }
};

const SYSTEM_PROMPT = `You are the AI assistant for Tesla Manufacturing & Quality Vault — a document management system for manufacturing and quality control documents.

DOCUMENT TYPES:
- MN (Manufacturing Notice) — Notices about manufacturing process changes
- MI (Manufacturing Instructions) — Step-by-step manufacturing procedures
- QI (Quality Instructions) — Quality control and inspection procedures
- QAN (Quality Alert Notice) — Urgent quality alerts and corrective actions
- VA (Visual Aide) — Visual reference guides for assembly/inspection
- PCA (Process Change Approval) — Formal process change requests and approvals

SYSTEM FEATURES:
- Upload documents (PDF, DOCX, DOC, images)
- Preview, download, and search documents
- Filter by type, category, tags
- Real-time analytics dashboard
- Role-based access (Admin, Manager, User)
- Admins can seed sample data and manage users

RESPONSE FORMAT:
- Use **bold** for emphasis and key terms
- Use bullet points for lists
- Use ### for section headers when needed
- Keep answers concise but thorough
- Reference specific document types by their codes (MN, MI, etc.)
- When referencing documents from search results, mention their title and type`;

// Search documents relevant to the user's question
const searchDocuments = async (query) => {
  try {
    const keywords = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['the', 'and', 'for', 'how', 'what', 'can', 'you', 'about', 'this', 'that', 'with', 'are', 'from', 'have', 'does'].includes(w));

    if (keywords.length === 0) return [];

    const typeMap = {
      manufacturing: ['MN', 'MI'],
      quality: ['QI', 'QAN'],
      notice: ['MN', 'QAN'],
      instruction: ['MI', 'QI'],
      instructions: ['MI', 'QI'],
      visual: ['VA'],
      aide: ['VA'],
      process: ['PCA'],
      change: ['PCA'],
      approval: ['PCA']
    };

    // Check if query mentions specific document types
    const matchedTypes = [];
    for (const kw of keywords) {
      if (typeMap[kw]) matchedTypes.push(...typeMap[kw]);
      if (['mn', 'mi', 'qi', 'qan', 'va', 'pca'].includes(kw)) matchedTypes.push(kw.toUpperCase());
    }

    const where = { isActive: true };
    const orConditions = [];

    // Search by title and description
    for (const kw of keywords.slice(0, 5)) {
      orConditions.push(
        { title: { [Op.iLike]: `%${kw}%` } },
        { description: { [Op.iLike]: `%${kw}%` } },
        { category: { [Op.iLike]: `%${kw}%` } }
      );
    }

    if (matchedTypes.length > 0) {
      orConditions.push({ documentType: { [Op.in]: [...new Set(matchedTypes)] } });
    }

    if (orConditions.length > 0) {
      where[Op.or] = orConditions;
    }

    const docs = await Document.findAll({
      where,
      attributes: ['id', 'title', 'documentType', 'category', 'description', 'tags', 'version', 'fileType', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: 8,
      raw: true
    });

    return docs;
  } catch (error) {
    console.error('Document search error:', error.message);
    return [];
  }
};

// Get system statistics
const getSystemStats = async () => {
  try {
    const totalDocs = await Document.count({ where: { isActive: true } });
    const docsByType = await Document.findAll({
      attributes: ['documentType', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      where: { isActive: true },
      group: ['documentType'],
      raw: true
    });
    return { totalDocuments: totalDocs, documentsByType: docsByType || [] };
  } catch (error) {
    return { totalDocuments: 0, documentsByType: [] };
  }
};

router.post('/chat', authenticate, async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const api = await initializeGemini();

    // Search for relevant documents and get stats in parallel
    const [relevantDocs, stats] = await Promise.all([
      searchDocuments(message),
      getSystemStats()
    ]);

    // Build context with real data
    let contextBlock = `\n\nCURRENT SYSTEM STATE:
- Total Documents: ${stats.totalDocuments}
- By Type: ${stats.documentsByType.map(d => `${d.documentType}: ${d.count}`).join(', ') || 'None'}`;

    if (relevantDocs.length > 0) {
      contextBlock += `\n\nRELEVANT DOCUMENTS FOUND (${relevantDocs.length}):`;
      relevantDocs.forEach((doc, i) => {
        contextBlock += `\n${i + 1}. "${doc.title}" [${doc.documentType}] — Category: ${doc.category}${doc.description ? `, Description: ${doc.description.substring(0, 100)}` : ''}${doc.tags?.length ? `, Tags: ${doc.tags.join(', ')}` : ''}`;
      });
      contextBlock += '\n\nUse these documents in your response when relevant. Reference them by title and type.';
    }

    // Build conversation for Gemini
    const fullPrompt = `${SYSTEM_PROMPT}${contextBlock}

User: ${message}`;

    if (api) {
      try {
        const model = api.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1024
          }
        });

        // Build chat history for multi-turn conversation
        const history = [];
        if (conversationHistory && Array.isArray(conversationHistory)) {
          const recent = conversationHistory.slice(-6);
          for (const msg of recent) {
            if (msg.type === 'user' && msg.content) {
              history.push({ role: 'user', parts: [{ text: msg.content }] });
            } else if (msg.type === 'assistant' && msg.content) {
              history.push({ role: 'model', parts: [{ text: msg.content }] });
            }
          }
        }

        let responseText;

        if (history.length >= 2) {
          // Use chat mode for multi-turn conversations
          const chat = model.startChat({
            history,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT + contextBlock }] }
          });
          const result = await chat.sendMessage(message);
          responseText = result.response.text();
        } else {
          // Single-turn for first message
          const result = await model.generateContent(fullPrompt);
          responseText = result.response.text();
        }

        if (!responseText) throw new Error('Empty response');

        return res.json({
          success: true,
          response: responseText,
          documents: relevantDocs.map(d => ({ id: d.id, title: d.title, type: d.documentType, category: d.category })),
          stats,
          model: 'gemini-1.5-flash'
        });
      } catch (geminiError) {
        console.error('Gemini error:', geminiError.message);
        // Fall through to fallback
      }
    }

    // Fallback response with actual document data
    let fallback = `I'm having trouble connecting to the AI service right now, but I can still help!\n\n`;

    if (stats.totalDocuments > 0) {
      fallback += `**Your Vault Overview:**\n- **${stats.totalDocuments}** total documents\n`;
      stats.documentsByType.forEach(d => {
        fallback += `- **${d.documentType}**: ${d.count} documents\n`;
      });
    } else {
      fallback += `Your vault is currently empty. Click **"Load Sample Data"** on the dashboard to get started with 30 sample documents.\n`;
    }

    if (relevantDocs.length > 0) {
      fallback += `\n**Documents matching your query:**\n`;
      relevantDocs.slice(0, 5).forEach(doc => {
        fallback += `- **${doc.title}** [${doc.documentType}] — ${doc.category}\n`;
      });
    }

    fallback += `\n**Quick Help:**\n- Upload documents via the sidebar upload panel\n- Use filters to narrow down by type, category, or tags\n- Click any document to preview or download\n- Check Analytics for real-time insights`;

    res.json({
      success: true,
      response: fallback,
      documents: relevantDocs.map(d => ({ id: d.id, title: d.title, type: d.documentType, category: d.category })),
      stats,
      fallback: true
    });
  } catch (error) {
    console.error('AI Chat error:', error.message);
    res.status(500).json({
      success: false,
      response: 'Something went wrong. Please try again.',
      error: error.message
    });
  }
});

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'AI Assistant' });
});

export default router;
