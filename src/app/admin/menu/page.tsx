"use client";

import { useEffect, useState } from "react";

export default function AdminMenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/menu", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load menu management");
        const data = await res.json();
        if (active) setItems(Array.isArray(data) ? data : []);
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

  async function createItem(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/admin/menu", { method: "POST" });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Menu Management</h1>
      <form onSubmit={createItem} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Name
          <input type="text" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <label>
          Category
          <input type="text" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <label>
          Price
          <input type="number" step="0.01" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <button type="submit" style={{ padding: 10, border: "1px solid #000" }}>
          Add Item
        </button>
      </form>
      <section aria-labelledby="menu-items" style={{ marginTop: 24 }}>
        <h2 id="menu-items">Existing Items</h2>
        {loading && <p>Loading items...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {items.map((item, idx) => (
              <li key={item.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
                <strong>{item.name || "Item"}</strong>
                <div>{item.category || ""}</div>
                <div>{item.price ? `$${item.price}` : ""}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <button style={{ padding: 6, border: "1px solid #000" }}>Edit</button>
                  <button style={{ padding: 6, border: "1px solid #000" }}>Delete</button>
                </div>
              </li>
            ))}
            {items.length === 0 && <li>No menu items available.</li>}
          </ul>
        )}
      </section>
    </main>
  );
}
