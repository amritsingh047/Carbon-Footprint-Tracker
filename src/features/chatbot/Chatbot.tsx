// src/features/chatbot/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Key } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useCarbonStore } from '../../store/useCarbonStore';
import { GoogleGenAI } from '@google/genai';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I am your AI Carbon Analyst. I can deeply analyze your footprint data using Gemini AI!' }
  ]);
  const [input, setInput] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const logs = useCarbonStore(state => state.logs);
  const baselineCo2 = useCarbonStore(state => state.baselineCo2);
  const geminiApiKey = useCarbonStore(state => state.geminiApiKey);
  const setApiKey = useCarbonStore(state => state.setApiKey);
  const clearApiKey = useCarbonStore(state => state.clearApiKey);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKeyInput.trim()) {
      setApiKey(apiKeyInput.trim());
      setApiKeyInput('');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !geminiApiKey) return;

    const rawInput = input.trim();
    const userMsg = DOMPurify.sanitize(rawInput); // Sanitize user input against XSS
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: geminiApiKey });
      const promptContext = `You are an expert, highly personalized Carbon Footprint Data Analyst. 
The user has a baseline annual CO2 emission of ${baselineCo2.toFixed(2)} kg.
They have logged the following specific actions recently: ${JSON.stringify(logs)}. 
Please provide actionable insights, analyze their historical trends based on their logged actions, and respond to their specific query: "${userMsg}". 
Keep the response incredibly helpful, encouraging, scientifically accurate, and perfectly formatted using plain text (no markdown, as the UI doesn't parse it yet). Limit to 2-3 short paragraphs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
      });

      setMessages(prev => [...prev, { role: 'bot', text: response.text || "I couldn't generate an insight right now." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'bot', text: 'Error connecting to Gemini AI. Please check if your API key is valid.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col h-[500px] overflow-hidden transition-all">
          {/* Header */}
          <div className="bg-teal-600 dark:bg-teal-700 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
              <MessageCircle size={20} /> AI Analyst
            </h3>
            <div className="flex items-center gap-2">
              {geminiApiKey && (
                <button 
                  onClick={clearApiKey}
                  className="text-xs bg-teal-800 hover:bg-teal-900 px-2 py-1 rounded transition-colors"
                  aria-label="Clear API Key"
                >
                  Clear Key
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-teal-500 dark:hover:bg-teal-600 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>
          
          {!geminiApiKey ? (
            /* API Key BYOK Form */
            <div className="flex-1 p-6 flex flex-col justify-center items-center bg-gray-50 dark:bg-slate-900 text-center">
              <div className="bg-teal-100 dark:bg-teal-900/30 p-4 rounded-full mb-4">
                <Key size={32} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h4 className="font-bold text-lg text-teal-900 dark:text-teal-100 mb-2">Unlock AI Intelligence</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Enter your Google Gemini API Key to enable automated, privacy-first EDA analysis of your footprint matrices. Your key stays strictly in your local browser storage.
              </p>
              <form onSubmit={handleSaveKey} className="w-full flex flex-col gap-3">
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="AIzaSy..."
                  required
                  className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 rounded-xl px-4 py-2 text-sm transition-all outline-none dark:text-white"
                  aria-label="Gemini API Key"
                />
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-md"
                >
                  Securely Save Key
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900" aria-live="polite">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-teal-600 text-white rounded-br-none shadow-md' 
                        : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-bl-none shadow-sm'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask for an insight..."
                  disabled={isTyping}
                  className="flex-1 bg-gray-100 dark:bg-slate-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 rounded-xl px-4 py-2 text-sm transition-all outline-none disabled:opacity-50"
                  aria-label="Chat input"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="bg-teal-600 hover:bg-teal-500 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
                  aria-label="Send message"
                >
                  <Send size={20} />
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300 flex items-center justify-center group"
          aria-label="Open AI Analyst"
        >
          <MessageCircle size={28} className="group-hover:animate-pulse" />
        </button>
      )}
    </div>
  );
};
