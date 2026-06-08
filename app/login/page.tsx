// app/login/page.tsx
"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Communicates directly with app/api/auth/[...nextauth]/route.ts
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password.");
    } else {
      // Login successful! Redirect directly to the chatbot homepage
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "15px" }}>Sign In</h2>
      {error && <p style={{ color: "red", background: "#ffebee", padding: "8px", borderRadius: "4px", marginBottom: "15px" }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px", background: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "#28a745", textDecoration: "none" }}>Register here</a>
      </p>
    </div>
  );
}