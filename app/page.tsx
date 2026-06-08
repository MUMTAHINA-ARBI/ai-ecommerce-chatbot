// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
// 🔌 IMPORT YOUR CHAT INTERFACE HERE:
import ChatWidget from "@/app/components/ChatWidget";

// 1. This component safely manages the chat dashboard layout and user state
function ChatBotDashboard() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || status === "loading") {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif", color: "#666" }}>
        Connecting to shopping assistant...
      </div>
    );
  }

  // ✨ EXTRACT REALSYS USER ID: Safely fetch the custom database ID added by NextAuth
  // If your next-auth configuration places the ID under session.user.id, fallback to email if necessary
  const activeUserId = (session as any)?.user?.id || session?.user?.email || "guest";

  return (
    <div style={{ fontFamily: "sans-serif", minHeight: "100vh", padding: "40px", backgroundColor: "#fdfdfd" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "20px", borderBottom: "1px solid #eee" }}>
        <div>
          <h1 style={{ fontSize: "24px", margin: 0, color: "#222" }}>AI E-Commerce Suite</h1>
          <p style={{ margin: "5px 0 0 0", color: "#28a745", fontWeight: "bold" }}>
            ● Welcome back, {session?.user?.name || "Sam"}!
          </p>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{ 
            padding: "10px 20px", 
            background: "#dc3545", 
            color: "white", 
            border: "none", 
            borderRadius: "5px", 
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          Log Out
        </button>
      </header>

      <main style={{ marginTop: "40px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* 🤖 CHANGED: Transformed placeholder into an interactive workspace wrapper */}
        <div style={{ width: "100%", maxWidth: "500px", padding: "20px", background: "#fafafa", borderRadius: "12px", border: "1px solid #eaeaea" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>🤖 Conversational Personal Shopper</h3>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Ask me to search for shirts or pants, add items to your cart, or check out when ready!
          </p>
          
          {/* ✨ MOVED CHAT INTERFACE HERE INLINE */}
          <ChatWidget userId={activeUserId} />
        </div>
      </main>
    </div>
  );
}

// 2. This is the main page wrapper that supplies the required authentication context
export default function Home() {
  return (
    <SessionProvider>
      <ChatBotDashboard />
    </SessionProvider>
  );
}