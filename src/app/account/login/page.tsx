"use client";

import { useState } from "react";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "signup" | "reset">("login");

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : mode === "reset" ? "/api/auth/reset" : "/api/auth/login";
      await fetch(endpoint, { method: "POST" });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>{mode === "signup" ? "Create Account" : mode === "reset" ? "Reset Password" : "Login"}</h1>
      <form onSubmit={submitAuth} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        {mode !== "reset" && (
          <label>
            Email
            <input type="email" required style={{ display: "block", width: "100%", padding: 6 }} />
          </label>
        )}
        {mode !== "reset" && (
          <label>
            Password
            <input type="password" required style={{ display: "block", width: "100%", padding: 6 }} />
          </label>
        )}
        {mode === "reset" && (
          <label>
            Account Email
            <input type="email" required style={{ display: "block", width: "100%", padding: 6 }} />
          </label>
        )}
        <button type="submit" style={{ padding: 10, border: "1px solid #000" }}>
          {mode === "signup" ? "Sign Up" : mode === "reset" ? "Send Reset Link" : "Login"}
        </button>
      </form>
      <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
        <button onClick={() => setMode("login")} style={{ padding: 6, border: "1px solid #000" }}>
          Login
        </button>
        <button onClick={() => setMode("signup")} style={{ padding: 6, border: "1px solid #000" }}>
          Sign Up
        </button>
        <button onClick={() => setMode("reset")} style={{ padding: 6, border: "1px solid #000" }}>
          Reset Password
        </button>
      </div>
    </main>
  );
}
