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
      content: 'Hello! 👋 I\'m your AI Assistant powered by Google Gemini. I\'m here to help you with the Tesla Manufacturing & Quality Vault document management system. I can assist you with:\n\n📄 Document management and operations\n🔍 Search and filtering\n📊 Analytics and reports\n🏷️ Organization and tagging\n👤 User roles and permissions\n⚙️ System features\n🛠️ Troubleshooting\n\nWhat can I help you with today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callGeminiAPI = async (userMessage) => {
    try {
      console.log('📤 Sending message to AI:', userMessage);
      
      // Use axios API instance with proper base URL
      const response = await api.post('/ai/chat', {
        message: userMessage,
        conversationHistory: messages.slice(-6), // Send last 6 messages for context
        context: {
          system: 'Tesla Manufacturing & Quality Vault',
          userRole: user?.role || 'User',
          features: ['Upload', 'Preview', 'Download', 'Analytics', 'Search', 'Filtering', 'Text Preview', 'Real-time Analytics'],
          timestamp: new Date().toISOString()
        }
      });

      console.log('📥 Response status:', response.status);
      console.log('✅ AI Response received:', response.data?.response?.substring(0, 100));
      
      if (!response.data?.response) {
        console.warn('⚠️ No response in data:', response.data);
        return 'I couldn\'t generate a response. Please try again.';
      }
      
      return response.data.response;
    } catch (error) {
      console.error('❌ AI API error:', error);
      console.error('Error details:', error.response?.status, error.response?.data);
      
      if (error.response?.status === 404) {
        toast.error('AI endpoint not found. Make sure backend is running on port 5000');
        return `Backend API not found. Please ensure:
1. Backend is running: npm run dev (in backend folder)
2. Backend is on port 5000
3. Frontend is on port 5173

Try again after starting the backend.`;
      }
      
      toast.error('Failed to get AI response');
      
      // Return helpful fallback message
      return `I'm currently experiencing technical difficulties, but I'm still here to help! 

You can ask me about:
- 📄 Document upload, preview, and download
- 🔍 Searching and filtering documents
- 📊 Understanding analytics and reports
- 🏷️ Working with categories and tags
- 👤 User roles and permissions

Please try your question again, or check the documentation for more details.`;
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const assistantResponse = await callGeminiAPI(input);
      
      const assistantMessage = {
        id: messages.length + 2,
        type: 'assistant',
        content: assistantResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    'How do I upload documents?',
    'How do I search for documents?',
    'How do I preview a document?',
    'What document types are supported?'
  ];

  const handleSuggestedQuestion = (question) => {
    setInput(question);
  };

  return (
    <>
      {/* Floating Button with Pulse Animation */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/50 transition hover:shadow-xl hover:shadow-primary/60 hover:scale-110 sm:h-16 sm:w-16 animate-pulse"
        title="AI Assistant"
      >
        <span className="text-2xl sm:text-3xl">🤖</span>
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

          <div className="fixed inset-0 overflow-y-auto p-4">
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-150"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl rounded-2xl border border-white/10 bg-gradient-to-b from-[#0e0f13] to-[#1a1b1f] text-white shadow-[0_25px_90px_rgba(0,0,0,0.65)] sm:rounded-3xl flex flex-col max-h-[80vh]">
                  {/* Header */}
                  <div className="border-b border-white/5 px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-r from-primary/10 to-transparent">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl animate-bounce">🤖</span>
                        <div>
                          <Dialog.Title className="font-heading text-lg text-white sm:text-xl font-bold">
                            AI Assistant
                          </Dialog.Title>
                          <p className="text-xs text-slate-400">Powered by Google Gemini • Always Learning</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowStats(!showStats)}
                          className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white"
                          title="Toggle statistics"
                        >
                          📊
                        </button>
                        <button
                          onClick={() => setIsOpen(false)}
                          className="text-slate-400 transition hover:text-white hover:bg-white/10 p-2 rounded-lg"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto space-y-4 p-4 sm:p-6">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md rounded-lg px-4 py-3 sm:px-5 sm:py-4 ${
                            message.type === 'user'
                              ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-lg shadow-primary/30'
                              : 'bg-white/10 text-slate-200 border border-white/5'
                          }`}
                        >
                          <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                          <p className="mt-2 text-xs text-slate-400 opacity-70">
                            {message.timestamp.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {/* Suggested Questions - Show when only initial message */}
                    {messages.length === 1 && !loading && (
                      <div className="space-y-2 mt-6">
                        <p className="text-xs text-slate-500 px-2">💡 Try asking:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {suggestedQuestions.map((question, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSuggestedQuestion(question)}
                              className="text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition text-sm border border-white/5 hover:border-white/20"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {loading && (
                      <div className="flex justify-start">
                        <div className="bg-white/10 text-slate-200 rounded-lg px-4 py-3 sm:px-5 sm:py-4 border border-white/5">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }} />
                            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.4s' }} />
                          </div>
                          <p className="text-xs text-slate-400 mt-2">Thinking...</p>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="border-t border-white/5 px-4 py-4 sm:px-6 sm:py-5 bg-gradient-to-t from-black/20 to-transparent">
                    <div className="flex gap-2 sm:gap-3">
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about the system..."
                        rows={2}
                        disabled={loading}
                        className="flex-1 rounded-lg border border-white/10 bg-black/30 px-3 py-2 sm:px-4 sm:py-3 text-sm text-white placeholder:text-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/50 disabled:opacity-50 resize-none transition"
                      />
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={handleSendMessage}
                          disabled={loading || !input.trim()}
                          className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-white transition hover:shadow-lg hover:shadow-primary/50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
                          title="Send message (Enter)"
                        >
                          <span className="text-lg sm:text-xl">→</span>
                        </button>
                        {messages.length > 1 && (
                          <button
                            onClick={() => setMessages([messages[0]])}
                            disabled={loading}
                            className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20 disabled:opacity-50 text-xs"
                            title="Clear chat"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                      💡 Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default AIHelper;
