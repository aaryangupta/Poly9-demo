import React, { useState } from 'react';
import { X, Sparkles, Send, Bot, User, CornerDownLeft } from 'lucide-react';

const PRESET_QUESTIONS = [
  "What is the typical MOQ for aluminium vases?",
  "Can you customize powder-coated finishes on planters?",
  "What are the FOB sea freight ports from Moradabad?",
  "How long is sample development and production lead time?"
];

export default function AIAssistantModal({ onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Namaste & Welcome! I am SAG New Look's AI Sales Assistant. You can ask me in English, Hindi, or Hinglish about our 664+ Moradabad handcrafted products, finishes, FOB terms, MOQs, or packaging specifications. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Generate intelligent contextual response
    setTimeout(() => {
      let reply = "";
      const lower = query.toLowerCase();

      if (lower.includes('moq') || lower.includes('minimum')) {
        reply = "Our standard MOQ starts from 10 to 50 pieces per SKU for made-to-order catalog items. For full container load (FCL) orders (20ft / 40ft HQ), we offer flexible mixed-item container assortments across our 664 products.";
      } else if (lower.includes('port') || lower.includes('shipping') || lower.includes('fob') || lower.includes('freight')) {
        reply = "We export on FOB terms from major Indian gateway ports: Nhava Sheva (JNPT, Mumbai) and Mundra Port (Gujarat). Factory dispatches originate from our Moradabad facility with direct ICD container transport.";
      } else if (lower.includes('lead time') || lower.includes('delivery') || lower.includes('sample')) {
        reply = "Sample turnaround is typically 7 to 10 days. Full production orders take 30 to 45 days after order confirmation and deposit. Urgent trade show air freight samples can be expedited upon request.";
      } else if (lower.includes('finish') || lower.includes('color') || lower.includes('custom') || lower.includes('material')) {
        reply = "We offer bespoke finishes on Aluminium, Iron, Brass, and Mango/Acacia Wood: Antique Brass, Brushed Nickel, Matte Black, Powder Coated Colors, Gold Leafing, and Natural Wood Oiled finishes. Custom buyer specifications are welcome!";
      } else if (lower.includes('hindi') || lower.includes('kya') || lower.includes('kaise')) {
        reply = "Aap humse Hindi mein bhi baat kar sakte hain. Hum Moradabad mein aluminium, iron, aur wood ke export décor banate hain. Kisi bhi product ka price, MOQ ya sample jaanne ke liye pooch sakte hain!";
      } else {
        reply = `Thank you for your question regarding "${query}". SAG New Look manufactures export-quality home accessories from Moradabad with over 15 years of global shipping experience. You can add items to your Line Sheet or submit an RFQ to get instant FOB pricing!`;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl flex flex-col h-[540px] z-10 overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold">SAG AI Sales Assistant</h3>
              <p className="text-[11px] text-zinc-400">Trained on 664 Moradabad décor products</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-zinc-50 custom-scrollbar">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'bot' && (
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-zinc-900 text-white rounded-br-none'
                    : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-2 bg-white border-t border-zinc-100 flex gap-1.5 overflow-x-auto custom-scrollbar">
          {PRESET_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-[10px] whitespace-nowrap bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-2.5 py-1 rounded-full transition"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask in English, Hindi, or Hinglish..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim()}
            className="p-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white rounded-xl transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
