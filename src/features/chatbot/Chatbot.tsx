// src/features/chatbot/Chatbot.tsx
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import DOMPurify from 'dompurify';
import { useCarbonStore } from '../../store/useCarbonStore';

export const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user'|'bot', text: string}[]>([
    { role: 'bot', text: 'Hi! I am your Carbon Assistant. Ask me how to reduce your footprint, what your streak is, or how the calculations work!' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const logs = useCarbonStore(state => state.logs);
  const streak = useCarbonStore(state => state.currentStreak);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const getBotResponse = (query: string): string => {
    const q = query.toLowerCase();
    
    // Problem Statement Alignment & Assistance
    if (q.includes('reduce') || q.includes('how to save') || q.includes('lower')) {
      return 'You can reduce your footprint by switching to a plant-based diet, using public transit, or reducing your home electricity usage. Check out the Daily Actions list for specific tasks!';
    }
    if (q.includes('streak')) {
      return `Your current streak is ${streak} days! Keep logging daily actions to build it up.`;
    }
    if (q.includes('calculate') || q.includes('formula') || q.includes('how does it work')) {
      return 'We calculate your footprint using scientifically backed emission factors. For example, we estimate 0.727 kg CO2e per kWh of electricity, and multiply it by your usage.';
    }
    if (q.includes('total') || q.includes('saved')) {
      const totalSaved = logs.reduce((sum, log) => sum + log.co2Saved, 0);
      return `You have saved a total of ${totalSaved.toFixed(2)} kg of CO2e across ${logs.length} logged actions.`;
    }
    
    // Advanced Client-Side Agent Analysis
    if (q.includes('analyze') || q.includes('insights') || q.includes('trend')) {
      if (logs.length === 0) return "I can't analyze your footprint yet! Start logging some actions first.";
      
      const totalSaved = logs.reduce((sum, log) => sum + log.co2Saved, 0);
      const avgSaved = totalSaved / logs.length;
      
      const categories = logs.reduce((acc, log) => {
        acc[log.title] = (acc[log.title] || 0) + log.co2Saved;
        return acc;
      }, {} as Record<string, number>);
      
      const bestAction = Object.entries(categories).sort((a, b) => b[1] - a[1])[0][0];

      return `Based on my analysis of your ${logs.length} logged actions, you're saving an average of ${avgSaved.toFixed(2)} kg CO₂e per action! Your most impactful habit is "${bestAction}". Keep focusing on that to maximize your impact!`;
    }
    
    return 'I am your Carbon AI Agent! I can tell you about your "streak", how to "reduce" your footprint, or you can ask me to "analyze" your historical data for insights.';
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const rawInput = input.trim();
    const userMsg = DOMPurify.sanitize(rawInput); // Sanitize user input against XSS
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulate network delay for chatbot feel
    setTimeout(() => {
      const botResponse = getBotResponse(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
    }, 600);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white dark:bg-slate-800 w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 flex flex-col h-[500px] overflow-hidden transition-all">
          {/* Header */}
          <div className="bg-teal-600 dark:bg-teal-700 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><MessageCircle size={20} /> EcoBot</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:bg-teal-500 dark:hover:bg-teal-600 p-1 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900" aria-live="polite">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.role === 'user' 
                    ? 'bg-teal-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-700 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-slate-600 rounded-bl-none shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-gray-100 dark:bg-slate-900 dark:text-white border-transparent focus:bg-white dark:focus:bg-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500 rounded-xl px-4 py-2 text-sm transition-all outline-none"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-teal-600 hover:bg-teal-500 disabled:bg-gray-300 dark:disabled:bg-slate-600 text-white rounded-xl p-2 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500"
              aria-label="Send message"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-2xl hover:shadow-teal-500/50 transition-all transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-teal-300"
          aria-label="Open chat assistant"
        >
          <MessageCircle size={28} />
        </button>
      )}
    </div>
  );
};
