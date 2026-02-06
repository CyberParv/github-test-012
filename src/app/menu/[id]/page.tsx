"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MenuItemDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [item, setItem] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch(`/api/menu/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load item");
        const data = await res.json();
        if (active) setItem(data || null);
      } catch (e: any) {
        if (active) setError(e.message || "Unexpected error");
      } finally {
        if (active) setLoading(false);
      }
    }
    if (id) load();
    return () => {
      active = false;
    };
  }, [id]);

  async function addToCart() {
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, quantity })
      });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 16 }}>
        <a href="/menu">Back to Menu</a>
      </header>
      {loading && <p>Loading item...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && item && (
        <article>
          <h1>{item.name || "Menu Item"}</h1>
          <p>{item.description || ""}</p>
          <div style={{ margin: "12px 0" }}>
            <span>{item.price ? `$${item.price}` : ""}</span>
          </div>
          <section aria-label="Options" style={{ margin: "16px 0" }}>
            <label>
              Quantity
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ marginLeft: 8, padding: 4 }}
              />
            </label>
          </section>
          <button onClick={addToCart} style={{ padding: 10, border: "1px solid #000" }}>
            Add to Cart
          </button>
        </article>
      )}
      {!loading && !error && !item && <p>Item not found.</p>}
    </main>
  );
}
