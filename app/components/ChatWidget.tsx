// app/components/ChatWidget.tsx
// app/components/ChatWidget.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: any[];
  cartContext?: {
    actionType?: string;
    items?: any[];
    totalAmount?: number;
  };
}

export default function ChatWidget({ userId }: { userId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0); // Tracks item badge counter
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize and fetch actual cart balance from database on initial load
  useEffect(() => {
    if (!userId || userId === "guest") return;

    const fetchInitialCart = async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: "View my cart",
            history: [],
            userId: userId
          })
        });
        const data = await res.json();
        if (data.success) {
          const rawCart = data.cart || data.payload || data.cartData || data;
          const itemsList = rawCart?.items || rawCart?.cartItems || data.items || [];
          if (Array.isArray(itemsList)) {
            const totalQuantity = itemsList.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
            setCartCount(totalQuantity);
          }
        }
      } catch (err) {
        console.error("Error sync-fetching live database basket:", err);
      }
    };

    fetchInitialCart();
  }, [userId]);

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
        const rawCart = data.cart || data.payload || data.cartData || data;
        const itemsList = rawCart?.items || rawCart?.cartItems || data.items || [];
        const cleanText = textToSend.toLowerCase();
        const aiReply = (data.reply || "").toLowerCase();

        // 🧠 Check if the AI's reply confirms an out-of-stock or failure scenario
        const isOutOfStock = aiReply.includes("out of stock") || 
                            aiReply.includes("sorry") || 
                            aiReply.includes("not available") || 
                            aiReply.includes("could not add");

        // 🔄 STABLE CART COUNT LOGIC WITH OUT-OF-STOCK & CHECKOUT HANDLING
        if (
          cleanText.includes("clear") || 
          cleanText.includes("empty") || 
          cleanText.includes("remove all") ||
          data.action === "checkout_cart" || 
          (data.payload && data.payload.forceResetCartCount)
        ) {
          // 💡 CRUCIAL FIX: Force counter down to 0 instantly if a checkout action is triggered or requested
          setCartCount(0);
        } else if (itemsList && Array.isArray(itemsList) && itemsList.length > 0) {
          // Absolute source of truth: use the database array if provided
          const totalQuantity = itemsList.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(totalQuantity);
        } else if ((cleanText.includes("add") || data.action === "modify_cart") && !isOutOfStock) {
          // ONLY increment if the item was successfully available and added!
          setCartCount(prev => prev + 1);
        }

        // Hide visual layout maps if data collections are empty
        const hasItems = itemsList && itemsList.length > 0;

        setMessages(prev => [
          ...prev, 
          { 
            role: "assistant", 
            content: data.reply, 
            products: data.products,
            cartContext: hasItems ? {
              actionType: data.action || rawCart?.action,
              items: itemsList,
              totalAmount: rawCart?.totalPrice || rawCart?.total || 0
            } : undefined 
          }
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

  const handleSendMessage = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    
    const textToProcess = customText || input;
    if (!textToProcess.trim() || loading) return;

    if (!customText) setInput("");
    
    const updatedMessages: Message[] = [...messages, { role: "user", content: textToProcess }];
    setMessages(updatedMessages);
    await sendMessageToAPI(textToProcess, updatedMessages);
  };

  const handleQuickAdd = async (productName: string, size: string) => {
    if (loading) return;
    const contextCommand = `Add the ${productName} in size ${size} to my cart`;
    await handleSendMessage(undefined, contextCommand);
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
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
            
            {msg.cartContext && msg.cartContext.items && msg.cartContext.items.length > 0 && (
              <div style={{ marginTop: "12px", background: "#fff", border: "1px solid #ddd", borderRadius: "6px", padding: "12px", color: "#333" }}>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "6px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
                  🛒 Secure Shopping Cart
                </div>
                
                <div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    {msg.cartContext.items.map((item: any, itemIdx: number) => (
                      <div key={itemIdx} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", paddingBottom: "4px", borderBottom: "1px dashed #f0f0f0" }}>
                        <span>
                          {item.name || item.productName || "Product"} <strong style={{ color: "#666" }}>(Size: {item.size})</strong>
                        </span>
                        <span style={{ fontWeight: "bold" }}>
                          x{item.quantity || 1}
                        </span>
                      </div>
                    ))}
                  </div>

                  {msg.cartContext.totalAmount ? (
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", paddingTop: "6px", borderTop: "1px solid #eee", fontSize: "13px", fontWeight: "bold" }}>
                      <span>Total Balance:</span>
                      <span style={{ color: "#28a745" }}>${msg.cartContext.totalAmount}</span>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleSendMessage(undefined, "Proceed to checkout")}
                    style={{ marginTop: "10px", width: "100%", padding: "8px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", cursor: loading ? "not-allowed" : "pointer" }}
                  >
                    💳 Complete Checkout
                  </button>
                </div>
              </div>
            )}

            {msg.products && msg.products.length > 0 && (
              <div style={{ marginTop: "10px", borderTop: "1px solid #ccc", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {msg.products.map((p: any) => (
                  <div key={p.id || p._id} style={{ fontSize: "13px", background: "#fff", color: "#333", padding: "10px", borderRadius: "6px", border: "1px solid #ddd" }}>
                    
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

      <form onSubmit={(e) => handleSendMessage(e)} style={{ display: "flex", borderTop: "1px solid #ddd", alignItems: "center", background: "#fff" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me anything..." 
          style={{ flex: 1, padding: "12px 10px", border: "none", outline: "none", color: "black" }}
          disabled={loading}
        />
        
        <div 
          onClick={() => !loading && handleSendMessage(undefined, "View my cart")}
          style={{ 
            padding: "0 12px", 
            color: "#333", 
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            userSelect: "none",
            height: "100%",
            borderLeft: "1px solid #eee",
            alignSelf: "stretch",
            background: "#fafafa"
          }}
          title="Click to view cart"
        >
          <span>🛒</span>
          <span style={{ 
            background: cartCount > 0 ? "#28a745" : "#6c757d", 
            color: "white", 
            borderRadius: "10px", 
            padding: "2px 6px", 
            fontSize: "11px", 
            fontWeight: "bold",
            minWidth: "12px",
            textAlign: "center"
          }}>
            {cartCount}
          </span>
        </div>

        <button 
          type="submit" 
          disabled={loading} 
          style={{ 
            padding: "12px 20px", 
            background: "#0070f3", 
            color: "white", 
            border: "none", 
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "bold",
            alignSelf: "stretch"
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}