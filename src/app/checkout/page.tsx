"use client";

import { useEffect, useState } from "react";

export default function CheckoutPage() {
  const [summary, setSummary] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load order summary");
        const data = await res.json();
        if (active) setSummary(data || null);
      } catch (e: any) {
        if (active) setError(e.message || "Unexpected error");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/checkout", { method: "POST" });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Checkout</h1>
      {loading && <p>Loading order summary...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <form onSubmit={submitOrder} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
          <fieldset>
            <legend>Contact</legend>
            <label>
              Full Name
              <input type="text" required style={{ display: "block", width: "100%", padding: 6 }} />
            </label>
            <label>
              Email
              <input type="email" required style={{ display: "block", width: "100%", padding: 6 }} />
            </label>
          </fieldset>
          <fieldset>
            <legend>Fulfillment</legend>
            <label>
              Method
              <select required style={{ display: "block", width: "100%", padding: 6 }}>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
              </select>
            </label>
            <label>
              Instructions
              <textarea rows={3} style={{ display: "block", width: "100%", padding: 6 }} />
            </label>
          </fieldset>
          <fieldset>
            <legend>Payment</legend>
            <label>
              Card Number
              <input type="text" inputMode="numeric" required style={{ display: "block", width: "100%", padding: 6 }} />
            </label>
            <label>
              Expiration
              <input type="text" required style={{ display: "block", width: "100%", padding: 6 }} />
            </label>
          </fieldset>
          <section>
            <strong>Order Total: {summary?.total ? `$${summary.total}` : "$0.00"}</strong>
          </section>
          <button type="submit" style={{ padding: 10, border: "1px solid #000" }}>
            Confirm Order
          </button>
        </form>
      )}
    </main>
  );
}
