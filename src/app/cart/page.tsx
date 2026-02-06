"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<any | null>(null);
  const [promo, setPromo] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/cart", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load cart");
        const data = await res.json();
        if (active) setCart(data || null);
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

  async function applyPromo() {
    try {
      await fetch("/api/cart/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promo })
      });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Cart</h1>
      {loading && <p>Loading cart...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && cart && (
        <section>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {(cart.items || []).map((item: any, idx: number) => (
              <li key={item.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
                <strong>{item.name || "Item"}</strong>
                <div>Qty: {item.quantity}</div>
                <div>{item.price ? `$${item.price}` : ""}</div>
              </li>
            ))}
            {(cart.items || []).length === 0 && <li>Your cart is empty.</li>}
          </ul>
          <div style={{ marginTop: 16 }}>
            <label>
              Promo Code
              <input
                type="text"
                value={promo}
                onChange={(e) => setPromo(e.target.value)}
                style={{ marginLeft: 8, padding: 6 }}
              />
            </label>
            <button onClick={applyPromo} style={{ marginLeft: 8, padding: 8, border: "1px solid #000" }}>
              Apply
            </button>
          </div>
          <div style={{ marginTop: 16 }}>
            <strong>Total: {cart.total ? `$${cart.total}` : "$0.00"}</strong>
          </div>
          <div style={{ marginTop: 16 }}>
            <a href="/checkout" style={{ padding: 10, border: "1px solid #000" }}>
              Proceed to Checkout
            </a>
          </div>
        </section>
      )}
      {!loading && !error && !cart && <p>Unable to load cart.</p>}
    </main>
  );
}
