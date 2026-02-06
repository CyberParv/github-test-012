"use client";

import { useEffect, useState } from "react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/orders", { cache: "no-store" });
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

  const filtered = orders.filter((order) => filter === "all" || order.status === filter);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Order Queue</h1>
      <label style={{ display: "block", marginBottom: 12 }}>
        Status Filter
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ marginLeft: 8, padding: 6 }}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      {loading && <p>Loading orders...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {filtered.map((order, idx) => (
            <li key={order.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
              <strong>Order #{order.id || idx + 1}</strong>
              <div>Status: {order.status || ""}</div>
              <div>Total: {order.total ? `$${order.total}` : ""}</div>
              <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                <button style={{ padding: 6, border: "1px solid #000" }}>Update Status</button>
                <button style={{ padding: 6, border: "1px solid #000" }}>View Details</button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <li>No orders found.</li>}
        </ul>
      )}
    </main>
  );
}
