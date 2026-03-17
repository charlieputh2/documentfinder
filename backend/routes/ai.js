import express from 'express';
import { Op } from 'sequelize';
import { authenticate } from '../middleware/auth.js';
import { Document, User, sequelize } from '../models/index.js';

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

const SYSTEM_PROMPT = `You are the Document Search Assistant for Tesla Manufacturing & Quality Vault. Your ONLY job is to help users find and understand documents stored in this system.

IMPORTANT RULES:
- You can ONLY answer questions about documents in the vault
- If the user asks something unrelated to documents, politely redirect them: "I can only help with document searches. Try asking about specific documents, types, or topics in the vault."
- Always base your answers on the ACTUAL documents provided in the context below
- Never make up or guess document contents — only reference documents that appear in your search results
- If no documents match, say so clearly

DOCUMENT TYPES IN THE SYSTEM:
- [MN] Manufacturing Notice — Process change notices
- [MI] Manufacturing Instructions — Step-by-step procedures
- [QI] Quality Instructions — Quality control procedures
- [QAN] Quality Alert Notice — Urgent quality alerts
- [VA] Visual Aid — Visual reference guides
- [PCA] Process Change Approval — Change request approvals

HOW TO RESPOND:
- List matching documents with their title, type, and category
- Summarize what each document is about using its description and content
- If documents have text content, use it to answer specific questions
- Use **bold** for document titles and types
- Use bullet points for document lists
- Keep responses focused and concise
- Always mention how many documents were found`;

// Search documents relevant to the user's question
const searchDocuments = async (query) => {
  try {
    const keywords = query
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['the', 'and', 'for', 'how', 'what', 'can', 'you', 'about', 'this', 'that', 'with', 'are', 'from', 'have', 'does', 'show', 'find', 'search', 'look', 'get', 'list', 'all', 'any', 'give', 'tell'].includes(w));

    const typeMap = {
      manufacturing: ['MN', 'MI'],
      quality: ['QI', 'QAN'],
      notice: ['MN', 'QAN'],
      notices: ['MN', 'QAN'],
      instruction: ['MI', 'QI'],
      instructions: ['MI', 'QI'],
      visual: ['VA'],
      aide: ['VA'],
      process: ['PCA'],
      change: ['PCA'],
      approval: ['PCA'],
      alert: ['QAN'],
      alerts: ['QAN'],
      inspection: ['QI'],
      procedure: ['MI', 'QI'],
      procedures: ['MI', 'QI'],
      assembly: ['MI', 'VA'],
      safety: ['QAN', 'QI'],
      battery: ['MN', 'MI', 'QI'],
      weld: ['MI', 'QI'],
      welding: ['MI', 'QI'],
      torque: ['MI', 'QI'],
      paint: ['MI', 'QI'],
      stamping: ['MI', 'QI']
    };

    // Check if query mentions specific document types
    const matchedTypes = [];
    for (const kw of (keywords.length > 0 ? keywords : query.toLowerCase().split(/\s+/))) {
      if (typeMap[kw]) matchedTypes.push(...typeMap[kw]);
      if (['mn', 'mi', 'qi', 'qan', 'va', 'pca'].includes(kw)) matchedTypes.push(kw.toUpperCase());
    }

    const where = { isActive: true };
    const orConditions = [];

    // Search by title, description, textContent, category, and tags
    const searchKeywords = keywords.length > 0 ? keywords.slice(0, 6) : [];
    for (const kw of searchKeywords) {
      orConditions.push(
        { title: { [Op.iLike]: `%${kw}%` } },
        { description: { [Op.iLike]: `%${kw}%` } },
        { category: { [Op.iLike]: `%${kw}%` } },
        { textContent: { [Op.iLike]: `%${kw}%` } },
        { tags: { [Op.overlap]: [kw] } }
      );
    }

    if (matchedTypes.length > 0) {
      orConditions.push({ documentType: { [Op.in]: [...new Set(matchedTypes)] } });
    }

    // If no keywords and no types, return recent documents
    if (orConditions.length === 0) {
      const docs = await Document.findAll({
        where: { isActive: true },
        attributes: ['id', 'title', 'documentType', 'category', 'description', 'tags', 'version', 'fileType', 'textContent', 'createdAt'],
        include: [{ model: User, as: 'author', attributes: ['name'] }],
        order: [['createdAt', 'DESC']],
        limit: 10
      });
      return docs.map(d => d.get({ plain: true }));
    }

    where[Op.or] = orConditions;

    const docs = await Document.findAll({
      where,
      attributes: ['id', 'title', 'documentType', 'category', 'description', 'tags', 'version', 'fileType', 'textContent', 'createdAt'],
      include: [{ model: User, as: 'author', attributes: ['name'] }],
      order: [['createdAt', 'DESC']],
      limit: 15
    });

    return docs.map(d => d.get({ plain: true }));
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
    const categories = await Document.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      where: { isActive: true },
      raw: true
    });
    return {
      totalDocuments: totalDocs,
      documentsByType: docsByType || [],
      categories: categories.map(c => c.category).filter(Boolean)
    };
  } catch (error) {
    return { totalDocuments: 0, documentsByType: [], categories: [] };
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

    // Build context with real document data
    let contextBlock = `\n\nVAULT STATISTICS:
- Total Documents: ${stats.totalDocuments}
- By Type: ${stats.documentsByType.map(d => `${d.documentType}: ${d.count}`).join(', ') || 'None'}
- Categories: ${stats.categories.join(', ') || 'None'}`;

    if (relevantDocs.length > 0) {
      contextBlock += `\n\nSEARCH RESULTS — ${relevantDocs.length} document(s) found:`;
      relevantDocs.forEach((doc, i) => {
        contextBlock += `\n\n--- Document ${i + 1} ---`;
        contextBlock += `\nTitle: ${doc.title}`;
        contextBlock += `\nType: ${doc.documentType}`;
        contextBlock += `\nCategory: ${doc.category}`;
        if (doc.description) contextBlock += `\nDescription: ${doc.description}`;
        if (doc.tags?.length) contextBlock += `\nTags: ${doc.tags.join(', ')}`;
        contextBlock += `\nVersion: ${doc.version || '1.0.0'}`;
        if (doc.author?.name) contextBlock += `\nAuthor: ${doc.author.name}`;
        contextBlock += `\nDate: ${doc.createdAt}`;
        if (doc.textContent) {
          contextBlock += `\nContent: ${doc.textContent.substring(0, 500)}`;
        }
      });
      contextBlock += '\n\nAnswer the user\'s question using ONLY these documents. Reference documents by their exact title and type code.';
    } else {
      contextBlock += '\n\nNo documents matched the search query. Tell the user no matching documents were found and suggest they try different keywords or check what document types are available.';
    }

    // Build conversation for Gemini
    const fullPrompt = `${SYSTEM_PROMPT}${contextBlock}\n\nUser question: ${message}`;

    if (api) {
      try {
        const model = api.getGenerativeModel({
          model: 'gemini-1.5-flash',
          generationConfig: {
            temperature: 0.3,
            topP: 0.85,
            maxOutputTokens: 1500
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
          const chat = model.startChat({
            history,
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT + contextBlock }] }
          });
          const result = await chat.sendMessage(message);
          responseText = result.response.text();
        } else {
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
      }
    }

    // Fallback response without Gemini
    let fallback = '';

    if (relevantDocs.length > 0) {
      fallback += `**Found ${relevantDocs.length} document(s) matching your query:**\n\n`;
      relevantDocs.slice(0, 8).forEach((doc, i) => {
        fallback += `${i + 1}. **${doc.title}** [${doc.documentType}] — ${doc.category}`;
        if (doc.description) fallback += `\n   ${doc.description.substring(0, 120)}`;
        fallback += '\n\n';
      });
    } else {
      fallback += `**No documents found matching your query.**\n\n`;
      fallback += `Try searching by:\n- Document type: MN, MI, QI, QAN, VA, PCA\n- Category or topic keywords\n- Specific document titles\n\n`;
      if (stats.totalDocuments > 0) {
        fallback += `**Your vault has ${stats.totalDocuments} documents:**\n`;
        stats.documentsByType.forEach(d => {
          fallback += `- **${d.documentType}**: ${d.count} documents\n`;
        });
      }
    }

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
  res.json({ status: 'ok', service: 'AI Document Search' });
});

export default router;
