// app/register/page.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${window.location.origin}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "100px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px", fontFamily: "sans-serif" }}>
      <h2 style={{ marginBottom: "15px" }}>Create an Account</h2>
      {error && <p style={{ color: "red", background: "#ffebee", padding: "8px", borderRadius: "4px", marginBottom: "15px" }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
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
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" disabled={loading} style={{ padding: "10px", background: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      
      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#0070f3", textDecoration: "none" }}>Log in here</a>
      </p>
    </div>
  );
}