import { useState, useRef, useEffect, useMemo } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

// Simple markdown renderer - handles bold, italic, headers, bullets, code
const MarkdownText = ({ text }) => {
  const rendered = useMemo(() => {
    if (!text) return [];

    const lines = text.split('\n');
    const elements = [];
    let listItems = [];
    let listKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="my-1.5 space-y-1 pl-4">
            {listItems.map((item, i) => (
              <li key={i} className="list-disc text-slate-300 marker:text-primary/60">
                <InlineMarkdown text={item} />
              </li>
            ))}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, idx) => {
      const trimmed = line.trim();

      // Headers
      if (trimmed.startsWith('### ')) {
        flushList();
        elements.push(
          <h4 key={idx} className="mt-3 mb-1 text-sm font-bold text-white">
            <InlineMarkdown text={trimmed.slice(4)} />
          </h4>
        );
        return;
      }
      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h3 key={idx} className="mt-3 mb-1 text-sm font-bold text-white">
            <InlineMarkdown text={trimmed.slice(3)} />
          </h3>
        );
        return;
      }

      // Bullet points (-, *, numbered)
      const bulletMatch = trimmed.match(/^[-*•]\s+(.+)/);
      const numberedMatch = trimmed.match(/^\d+\.\s+(.+)/);
      if (bulletMatch) {
        listItems.push(bulletMatch[1]);
        return;
      }
      if (numberedMatch) {
        listItems.push(numberedMatch[1]);
        return;
      }

      flushList();

      // Empty lines
      if (trimmed === '') {
        elements.push(<div key={idx} className="h-1.5" />);
        return;
      }

      // Code blocks (single backtick lines)
      if (trimmed.startsWith('`') && trimmed.endsWith('`') && trimmed.length > 2) {
        elements.push(
          <code key={idx} className="block my-1 rounded bg-white/10 px-2 py-1 text-xs text-slate-300 font-mono">
            {trimmed.slice(1, -1)}
          </code>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={idx} className="text-slate-200 leading-relaxed">
          <InlineMarkdown text={trimmed} />
        </p>
      );
    });

    flushList();
    return elements;
  }, [text]);

  return <div className="space-y-0.5 text-sm">{rendered}</div>;
};

// Inline markdown: **bold**, *italic*, `code`, [type] badges
const InlineMarkdown = ({ text }) => {
  const parts = useMemo(() => {
    if (!text) return [text];

    const result = [];
    // Match **bold**, *italic*, `code`, [TYPE] badges
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(MN|MI|QI|QAN|VA|PCA)\])/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', value: text.slice(lastIndex, match.index) });
      }
      if (match[2]) {
        result.push({ type: 'bold', value: match[2] });
      } else if (match[3]) {
        result.push({ type: 'italic', value: match[3] });
      } else if (match[4]) {
        result.push({ type: 'code', value: match[4] });
      } else if (match[5]) {
        result.push({ type: 'badge', value: match[5] });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      result.push({ type: 'text', value: text.slice(lastIndex) });
    }
    return result;
  }, [text]);

  const badgeColors = {
    MN: 'bg-white/10 text-slate-300 border-white/20',
    MI: 'bg-white/10 text-slate-300 border-white/20',
    QI: 'bg-white/10 text-slate-300 border-white/20',
    QAN: 'bg-white/10 text-slate-300 border-white/20',
    VA: 'bg-white/10 text-slate-300 border-white/20',
    PCA: 'bg-white/10 text-slate-300 border-white/20'
  };

  return (
    <>
      {parts.map((part, i) => {
        switch (part.type) {
          case 'bold':
            return <strong key={i} className="font-semibold text-white">{part.value}</strong>;
          case 'italic':
            return <em key={i} className="italic text-slate-300">{part.value}</em>;
          case 'code':
            return <code key={i} className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-slate-300 font-mono">{part.value}</code>;
          case 'badge':
            return <span key={i} className={`inline-flex rounded-md border px-1.5 py-0 text-2xs font-bold ${badgeColors[part.value] || ''}`}>{part.value}</span>;
          default:
            return <span key={i}>{part.value}</span>;
        }
      })}
    </>
  );
};

// Document reference chips shown below AI responses
const DocumentChips = ({ documents }) => {
  if (!documents || documents.length === 0) return null;

  const badgeColors = {
    MN: 'border-white/20 text-slate-300',
    MI: 'border-white/20 text-slate-300',
    QI: 'border-white/20 text-slate-300',
    QAN: 'border-white/20 text-slate-300',
    VA: 'border-white/20 text-slate-300',
    PCA: 'border-white/20 text-slate-300'
  };

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {documents.slice(0, 4).map((doc) => (
        <span
          key={doc.id}
          className={`inline-flex items-center gap-1 rounded-lg border bg-white/5 px-2 py-0.5 text-2xs ${badgeColors[doc.type] || 'border-white/10 text-slate-400'}`}
        >
          <span className="font-semibold">{doc.type}</span>
          <span className="truncate max-w-[120px] text-slate-400">{doc.title}</span>
        </span>
      ))}
    </div>
  );
};

const AIHelper = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m the **Document Search Assistant** for the Tesla Vault. I can help you find and understand documents in your system.\n\n### What I can do:\n- **Search documents** by type, category, keywords, or content\n- **Summarize** what specific documents contain\n- **Find related** documents across [MN] [MI] [QI] [QAN] [VA] [PCA] types\n\nTry asking me about specific topics, document types, or keywords.',
      documents: [],
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const callGeminiAPI = async (userMessage) => {
    try {
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory: messages.slice(-6).map(m => ({
          type: m.type,
          content: m.content
        })),
        context: {
          userRole: user?.role || 'User'
        }
      });

      return {
        text: response.data?.response || 'I couldn\'t generate a response. Please try again.',
        documents: response.data?.documents || []
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return { text: 'AI endpoint not available. Please ensure the backend server is running.', documents: [] };
      }
      if (error.response?.status === 429) {
        return { text: 'Too many requests. Please wait a moment and try again.', documents: [] };
      }
      return { text: 'I\'m experiencing technical difficulties. Please try your question again.', documents: [] };
    }
  };

  const handleSendMessage = async (overrideMessage) => {
    const messageText = overrideMessage || input.trim();
    if (!messageText) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { text, documents } = await callGeminiAPI(messageText);

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'assistant',
        content: text,
        documents,
        timestamp: new Date()
      }]);
    } catch {
      toast.error('Failed to get AI response');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'Show all manufacturing notices',
    'Find quality alert documents',
    'What documents are about battery assembly?',
    'List all visual aide documents',
    'Show process change approvals',
    'Find documents about welding procedures'
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/40 transition-all hover:shadow-xl hover:shadow-primary/50 hover:scale-110 active:scale-95 sm:bottom-6 sm:right-6 sm:h-14 sm:w-14 touch-manipulation"
        aria-label="Open AI Assistant"
      >
        <svg className="h-6 w-6 sm:h-7 sm:w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
        </svg>
      </button>

      {/* Modal */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-end sm:items-center sm:justify-center sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-8 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="flex w-full flex-col border-t border-white/10 bg-gradient-to-b from-[#0e0f13] to-[#1a1b1f] text-white shadow-[0_-10px_40px_rgba(0,0,0,0.5)] sm:max-w-2xl sm:rounded-2xl sm:border sm:shadow-[0_25px_90px_rgba(0,0,0,0.65)] h-[85vh] max-h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl">
                {/* Header */}
                <div className="flex-shrink-0 border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-primary/10 to-transparent rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 ring-1 ring-primary/20">
                        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title className="font-heading text-base text-white sm:text-lg font-bold">
                          Document Search AI
                        </Dialog.Title>
                        <p className="text-[0.65rem] text-slate-400 sm:text-xs">Search and ask questions about your vault documents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {messages.length > 1 && (
                        <button
                          onClick={() => setMessages([messages[0]])}
                          disabled={loading}
                          className="rounded-lg px-2.5 py-1.5 text-2xs text-slate-400 transition hover:text-white hover:bg-white/10 disabled:opacity-50 touch-manipulation"
                        >
                          Clear
                        </button>
                      )}
                      <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-2 text-slate-400 transition hover:text-white hover:bg-white/10 touch-manipulation"
                        aria-label="Close assistant"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:space-y-4 sm:p-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white/[0.06] text-slate-200 border border-white/5 rounded-bl-md'
                        }`}
                      >
                        {message.type === 'assistant' ? (
                          <MarkdownText text={message.content} />
                        ) : (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        )}
                        {message.type === 'assistant' && <DocumentChips documents={message.documents} />}
                        <p className={`mt-1.5 text-[0.6rem] ${message.type === 'user' ? 'text-white/50' : 'text-slate-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {/* Suggested Questions */}
                  {messages.length === 1 && !loading && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs text-slate-500 px-1">Try asking:</p>
                      <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                        {suggestedQuestions.map((question, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(question)}
                            className="text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition text-xs border border-white/5 hover:border-white/15 touch-manipulation active:scale-[0.98] sm:text-sm"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
                          </div>
                          <span className="text-2xs text-slate-500">Searching & thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="flex-shrink-0 border-t border-white/5 px-3 py-3 sm:px-5 sm:py-4 safe-area-bottom">
                  <div className="flex gap-2">
                    <textarea
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask about your documents..."
                      rows={1}
                      disabled={loading}
                      className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 focus:outline-none disabled:opacity-50 resize-none transition sm:px-4 sm:py-3"
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={loading || !input.trim()}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 sm:h-11 sm:w-11 touch-manipulation"
                      aria-label="Send message"
                    >
                      {loading ? (
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="mt-2 text-[0.6rem] text-slate-500 sm:text-xs">
                    Enter to send · Shift+Enter for new line
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AIHelper;
