"use client";

import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        if (active) setOrders(Array.isArray(data) ? data : []);
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

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>My Orders</h1>
      {loading && <p>Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {orders.map((order, idx) => (
            <li key={order.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
              <strong>Order #{order.id || idx + 1}</strong>
              <div>Status: {order.status || ""}</div>
              <div>Total: {order.total ? `$${order.total}` : ""}</div>
              <button style={{ marginTop: 8, padding: 6, border: "1px solid #000" }}>
                Reorder
              </button>
            </li>
          ))}
          {orders.length === 0 && <li>No orders found.</li>}
        </ul>
      )}
    </main>
  );
}
