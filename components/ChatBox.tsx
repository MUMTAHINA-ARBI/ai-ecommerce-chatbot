"use client";

import { useState } from "react";

// Structure our messages cleanly for the Conversational Memory system
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface CartItem {
  productId: string;
  name: string;
  size: string;
  price: number;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. Instantly display user's input on screen
    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: input }
    ];
    setMessages(updatedMessages);
    const userQuery = input;
    setInput("");

    try {
      // 2. Single unified API post containing our current message and context memory history
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userQuery,
          history: messages // 🧠 Memory link passed here!
        }),
      });

      const data = await res.json();
      let dynamicBotReply = data.reply;

      if (data.success) {
        // --- UPGRADE: DYNAMIC PRODUCT RENDER ---
        // If the backend tool 'browse_products' returned documents from the database
        if (data.products && data.products.length > 0) {
          const productListText = data.products
            .map((p: any) => `🛍️ ${p.name} - $${p.price} (Sizes: ${p.sizes.join(", ")})\n   👉 Copy ID to add: ${p._id}`)
            .join("\n\n");
          
          dynamicBotReply = `${data.reply}\n\n${productListText}`;
        }

        // --- UPGRADE: STATEFUL CART ACTIONS ---
        // If the backend AI executed a 'modify_cart' instruction
        if (data.action === "modify_cart" && data.payload) {
          const { actionType, productId, size } = data.payload;

          if (actionType === "ADD" && productId) {
            // Find product details from returned payload or use a placeholder
            const newItem: CartItem = {
              productId,
              name: "Product (" + size + ")",
              size: size || "M",
              price: 25 // Fallback item pricing context
            };
            setCart((prev) => [...prev, newItem]);
          } 
          else if (actionType === "CLEAR") {
            setCart([]);
          }
        }
      }

      // 3. Append the bot's dynamic markdown response to state
      setMessages((prev) => [...prev, { role: "assistant", content: dynamicBotReply }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev, 
        { role: "assistant", content: "⚠️ Sorry, I ran into an error connecting to the server." }
      ]);
    }
  };

  // Quick Client Helper: View client-side cart items manually anytime
  const showCartStatus = () => {
    if (cart.length === 0) {
      setMessages((prev) => [...prev, { role: "assistant", content: "🛒 Your cart is completely empty." }]);
      return;
    }
    const cartItems = cart.map((item) => `- ${item.name} [Size: ${item.size}]`).join("\n");
    setMessages((prev) => [...prev, { role: "assistant", content: `🛒 Current Cart:\n${cartItems}` }]);
  };

  return (
    <div style={{ maxWidth: "650px", margin: "auto", fontFamily: "sans-serif" }}>
      {/* Dynamic Chat Dialog Display Window */}
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          minHeight: "400px",
          maxHeight: "500px",
          overflowY: "auto",
          padding: "15px",
          whiteSpace: "pre-wrap",
          background: "#f9f9f9",
          textAlign: "left"
        }}
      >
        {messages.map((msg, i) => (
          <div 
            key={i} 
            style={{ 
              marginBottom: "12px", 
              padding: "8px 12px", 
              borderRadius: "6px",
              background: msg.role === "user" ? "#e3f2fd" : "#f1f8e9",
              marginLeft: msg.role === "user" ? "40px" : "0",
              marginRight: msg.role === "user" ? "0" : "40px"
            }}
          >
            <strong>{msg.role === "user" ? "You" : "Personal Shopper"}:</strong>
            <p style={{ margin: "4px 0 0 0" }}>{msg.content}</p>
          </div>
        ))}
      </div>

      {/* Input Action Controls Footer Row */}
      <div style={{ marginTop: "12px", display: "flex", gap: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask for cheap nike tshirts, pants under $50, or add to cart..."
          style={{ flexGrow: 1, padding: "10px", borderRadius: "4px", border: "1px solid #bbb" }}
        />
        <button onClick={sendMessage} style={{ padding: "10px 20px", background: "#0070f3", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Send
        </button>
        <button onClick={showCartStatus} style={{ padding: "10px 12px", background: "#333", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          🛒 View Cart ({cart.length})
        </button>
      </div>
    </div>
  );
}