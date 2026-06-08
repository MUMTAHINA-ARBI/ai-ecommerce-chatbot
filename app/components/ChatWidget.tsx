//app/components/ChatWidget.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: any[];
}

export default function ChatWidget({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        { role: "assistant", content: "👋 Hi! I'm your AI personal shopper. Looking for t-shirts or pants today?" }
      ]);
    }
  }, [messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const sendMessageToAPI = async (textToSend: string, currentHistory: Message[]) => {
    setLoading(true);
    try {
      const historyPayload = currentHistory.map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload,
          userId: userId
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [
          ...prev, 
          { role: "assistant", content: data.reply, products: data.products }
        ]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: "System error: " + (data.reply || "Unknown error") }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: "assistant", content: "Failed to connect to backend server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userText = input;
    setInput("");
    const updatedMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(updatedMessages);
    await sendMessageToAPI(userText, updatedMessages);
  };

  const handleQuickAdd = async (productName: string, size: string) => {
    if (loading) return;
    const contextCommand = `Add the ${productName} in size ${size} to my cart`;
    const updatedMessages: Message[] = [...messages, { role: "user", content: contextCommand }];
    setMessages(updatedMessages);
    await sendMessageToAPI(contextCommand, updatedMessages);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        style={{ padding: "12px 24px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "24px", cursor: "pointer", fontWeight: "bold", marginTop: "15px" }}
      >
        💬 Launch AI Chatbot
      </button>
    );
  }

  return (
    <div style={{ width: "100%", height: "450px", display: "flex", flexDirection: "column", border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "#fff", marginTop: "15px" }}>
      <div style={{ padding: "10px 15px", background: "#0070f3", color: "white", fontWeight: "bold", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Store Assistant</span>
        <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "white", cursor: "pointer", marginLeft: "auto" }}>✕</button>
      </div>

      <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "80%", padding: "10px", borderRadius: "8px", background: msg.role === "user" ? "#0070f3" : "#eee", color: msg.role === "user" ? "white" : "#333", fontSize: "14px" }}>
            <p style={{ margin: 0 }}>{msg.content}</p>
            
            {msg.products && msg.products.length > 0 && (
              <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {msg.products.map((p: any) => (
                  <div key={p.id || p._id} style={{ fontSize: "13px", background: "#fff", color: "#333", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    
                    {/* Render Product Image */}
                    {p.image && (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "4px", marginBottom: "8px" }} 
                      />
                    )}

                    <div style={{ fontWeight: "bold", marginBottom: "4px" }}>{p.name} - ${p.price}</div>
                    
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", marginTop: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "11px", color: "#666", marginRight: "4px" }}>Select Size:</span>
                      {(p.sizes && p.sizes.length > 0 ? p.sizes : ["S", "M", "L", "XL", "XXL"]).map((sz: string) => (
                        <button
                          key={sz}
                          type="button"
                          disabled={loading}
                          onClick={() => handleQuickAdd(p.name, sz)}
                          style={{ padding: "2px 6px", fontSize: "11px", background: loading ? "#f5f5f5" : "#f0f0f0", border: "1px solid #ccc", borderRadius: "3px", cursor: loading ? "not-allowed" : "pointer" }}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div style={{ fontSize: "12px", color: "#888", fontStyle: "italic" }}>Assistant is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={{ display: "flex", borderTop: "1px solid #ddd" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me anything..." 
          style={{ flex: 1, padding: "10px", border: "none", outline: "none", color: "black" }}
          disabled={loading}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px 20px", background: "#0070f3", color: "white", border: "none", cursor: loading ? "not-allowed" : "pointer" }}>Send</button>
      </form>
    </div>
  );
}