import { X, Send, Bot, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { chatAboutVerse } from '../services/api';
import { RELIGIONS } from '../types';
import { formatAIResponse } from '../utils/markdown';

export function ChatDrawer() {
  const { activeVerseChat, setActiveVerseChat, addChatMessage, incrementChatUsage, usage, readingPreferences } = useStore();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeVerseChat?.messages]);

  if (!activeVerseChat) return null;

  const religionInfo = RELIGIONS.find((r) => r.id === activeVerseChat.religion);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check chat limit
    if (!incrementChatUsage()) {
      alert('You have reached your free chat limit. Please upgrade to Premium for unlimited chat.');
      return;
    }

    const userMessage = input.trim();
    setInput('');

    // Add user message
    addChatMessage({ role: 'user', content: userMessage });
    setIsLoading(true);

    try {
      const response = await chatAboutVerse(
        activeVerseChat.religion,
        activeVerseChat.verseReference,
        activeVerseChat.verseText,
        userMessage,
        activeVerseChat.messages
      );

      addChatMessage({ role: 'assistant', content: response });
    } catch (error) {
      console.error('Chat error:', error);
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-sage-900/20 backdrop-blur-sm z-40"
        onClick={() => setActiveVerseChat(null)}
      ></div>

      {/* Drawer - Bottom sheet on mobile, side drawer on desktop */}
      <div className="fixed bottom-0 left-0 right-0 sm:inset-y-0 sm:left-auto sm:right-0 w-full sm:w-[480px] lg:w-[520px] bg-white dark:bg-gray-800 sepia:bg-amber-50 shadow-soft-2xl flex flex-col z-50 animate-slide-in rounded-t-3xl sm:rounded-none max-h-[85vh] sm:max-h-none">
        {/* Mobile drag handle */}
        <div className="sm:hidden pt-2 pb-1 flex justify-center bg-white dark:bg-gray-800 sepia:bg-amber-50 rounded-t-3xl">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div
          className="relative px-6 py-5 text-white overflow-hidden"
          style={{ backgroundColor: religionInfo?.color || '#6366f1' }}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>
          
          <div className="relative flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-lg truncate">{religionInfo?.name}</h3>
              </div>
              <p className="text-sm opacity-90 font-medium mb-2">{activeVerseChat.verseReference}</p>
              <p className="text-sm opacity-80 line-clamp-2 font-serif italic">
                "{activeVerseChat.verseText}"
              </p>
            </div>
            <button
              onClick={() => setActiveVerseChat(null)}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-sage-50 dark:bg-gray-900 sepia:bg-amber-100">
          {activeVerseChat.messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 sepia:bg-primary-100 rounded-2xl flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary-600 dark:text-primary-400 sepia:text-primary-600" />
              </div>
              <h4 className="text-lg font-bold text-sage-900 dark:text-gray-100 sepia:text-amber-900 mb-2">
                Ask About This Verse
              </h4>
              <p className="text-sm text-sage-600 dark:text-gray-400 sepia:text-amber-700 max-w-sm">
                I can help explain the meaning, context, and significance of this passage. What would you like to know?
              </p>
            </div>
          )}

          {activeVerseChat.messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${
                message.role === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-white dark:bg-gray-700 sepia:bg-amber-100 border-2 border-sage-200 dark:border-gray-600 sepia:border-amber-300 text-primary-600 dark:text-primary-400 sepia:text-primary-600'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message */}
              <div
                className={`flex-1 max-w-[80%] rounded-2xl p-4 ${
                  message.role === 'user'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-700 sepia:bg-amber-100 border border-sage-200 dark:border-gray-600 sepia:border-amber-300 text-sage-800 dark:text-gray-200 sepia:text-amber-800 shadow-soft'
                }`}
              >
                {message.role === 'user' ? (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                ) : (
                  <div
                    className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-strong:font-semibold prose-strong:text-sage-900 dark:prose-strong:text-gray-100 sepia:prose-strong:text-amber-900 prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: formatAIResponse(message.content) }}
                  />
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white dark:bg-gray-700 sepia:bg-amber-100 border-2 border-sage-200 dark:border-gray-600 sepia:border-amber-300 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-600 dark:text-primary-400 sepia:text-primary-600" />
              </div>
              <div className="bg-white dark:bg-gray-700 sepia:bg-amber-100 border border-sage-200 dark:border-gray-600 sepia:border-amber-300 rounded-2xl p-4 shadow-soft">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-sage-200 dark:border-gray-700 sepia:border-amber-200 bg-white dark:bg-gray-800 sepia:bg-amber-50 p-4 sm:p-6">
          {!usage.isPremium && (
            <div className="mb-3 text-xs text-sage-600 dark:text-gray-400 sepia:text-amber-700 font-medium">
              {usage.chatLimit - usage.chatMessagesUsed} messages remaining
            </div>
          )}
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask a question about this verse..."
              className="flex-1 px-4 py-3 bg-sage-50 dark:bg-gray-700 sepia:bg-amber-100 border-2 border-transparent rounded-xl focus:bg-white dark:focus:bg-gray-600 sepia:focus:bg-amber-50 focus:border-primary-500 focus:ring-4 focus:ring-primary-50 text-sm placeholder-sage-400 dark:placeholder-gray-400 sepia:placeholder-amber-600 text-sage-900 dark:text-gray-100 sepia:text-amber-900 transition-all duration-200"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-soft-lg transition-all duration-200 flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
