import { X, Send, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { chatAboutVerse } from '../services/api';
import { RELIGIONS } from '../types';

export function ChatDrawer() {
  const { activeVerseChat, setActiveVerseChat, addChatMessage, incrementChatUsage, usage } = useStore();
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
    <div className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl border-l border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold">{religionInfo?.name}</span>
            <span className="text-primary-200">•</span>
            <span className="text-sm text-primary-100">{activeVerseChat.verseReference}</span>
          </div>
          <p className="text-sm text-primary-100 line-clamp-2">{activeVerseChat.verseText}</p>
        </div>
        <button
          onClick={() => setActiveVerseChat(null)}
          className="p-1 hover:bg-primary-700 rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeVerseChat.messages.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            <p className="mb-2">Ask questions about this verse</p>
            <p className="text-sm">I'll help you understand its meaning and context</p>
          </div>
        )}

        {activeVerseChat.messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3">
              <Loader2 className="w-5 h-5 text-gray-600 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        {!usage.isPremium && (
          <div className="text-xs text-gray-600 mb-2">
            {usage.chatLimit - usage.chatMessagesUsed} messages remaining
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about this verse..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
