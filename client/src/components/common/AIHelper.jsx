import { useState, useRef, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

const AIHelper = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m your AI Assistant powered by Google Gemini. I can help you with:\n\n- Document management and operations\n- Search and filtering\n- Analytics and reports\n- Organization and tagging\n- User roles and permissions\n- Troubleshooting\n\nWhat can I help you with today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGeminiAPI = async (userMessage) => {
    try {
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory: messages.slice(-6),
        context: {
          system: 'Tesla Manufacturing & Quality Vault',
          userRole: user?.role || 'User',
          features: ['Upload', 'Preview', 'Download', 'Analytics', 'Search', 'Filtering', 'Text Preview', 'Real-time Analytics'],
          timestamp: new Date().toISOString()
        }
      });

      if (!response.data?.response) {
        return 'I couldn\'t generate a response. Please try again.';
      }

      return response.data.response;
    } catch (error) {
      if (error.response?.status === 404) {
        return 'AI endpoint not available. Please ensure the backend server is running.';
      }

      return 'I\'m experiencing technical difficulties. Please try your question again in a moment.';
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const assistantResponse = await callGeminiAPI(currentInput);

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
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
    'How do I upload documents?',
    'How do I search for documents?',
    'What document types are supported?',
    'How do I export documents?'
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
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
            <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
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
                <div className="flex-shrink-0 border-b border-white/5 px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-primary/10 to-transparent rounded-t-2xl sm:rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20">
                        <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div>
                        <Dialog.Title className="font-heading text-base text-white sm:text-lg font-bold">
                          AI Assistant
                        </Dialog.Title>
                        <p className="text-[0.65rem] text-slate-400 sm:text-xs">Powered by Google Gemini</p>
                      </div>
                    </div>
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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 p-3 sm:space-y-4 sm:p-5">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-3.5 py-2.5 sm:px-4 sm:py-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-white rounded-br-md'
                            : 'bg-white/8 text-slate-200 border border-white/5 rounded-bl-md'
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
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
                            onClick={() => setInput(question)}
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
                      <div className="bg-white/8 rounded-2xl rounded-bl-md px-4 py-3 border border-white/5">
                        <div className="flex items-center gap-1.5">
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.15s' }} />
                          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.3s' }} />
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
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything..."
                      rows={1}
                      disabled={loading}
                      className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none disabled:opacity-50 resize-none transition sm:px-4 sm:py-3"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={loading || !input.trim()}
                      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40 active:scale-95 sm:h-11 sm:w-11 touch-manipulation"
                      aria-label="Send message"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-[0.6rem] text-slate-500 sm:text-xs">
                      Enter to send · Shift+Enter for new line
                    </p>
                    {messages.length > 1 && (
                      <button
                        onClick={() => setMessages([messages[0]])}
                        disabled={loading}
                        className="text-[0.6rem] text-slate-500 hover:text-slate-300 transition disabled:opacity-50 sm:text-xs touch-manipulation"
                      >
                        Clear chat
                      </button>
                    )}
                  </div>
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
