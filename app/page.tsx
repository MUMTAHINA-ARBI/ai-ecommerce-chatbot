// app/page.tsx
// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// 🔌 Connecting directly to your primary conversational module
import ChatWidget from "./components/ChatWidget"; 

function ChatBotDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🛡️ Guard: Force unauthenticated traffic to /login
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      router.push("/login");
    }
  }, [mounted, status, router]);

  if (!mounted || status === "loading") {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif", color: "#666" }}>
        Connecting to shopping assistant...
      </div>
    );
  }

  if (!session) {
    return (
      <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif", color: "#666" }}>
        Redirecting to secure login...
      </div>
    );
  }

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
        <div style={{ width: "100%", maxWidth: "600px", padding: "20px", background: "#fafafa", borderRadius: "12px", border: "1px solid #eaeaea" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>🤖 Conversational Personal Shopper</h3>
          <p style={{ color: "#666", fontSize: "14px", marginBottom: "20px" }}>
            Ask me to search for shirts or pants, add items to your cart, or check out when ready!
          </p>
          
          {/* Passes the secure tracking ID into your core feature component */}
          <ChatWidget userId={activeUserId} />
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <SessionProvider>
      <ChatBotDashboard />
    </SessionProvider>
  );
}