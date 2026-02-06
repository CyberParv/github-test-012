"use client";

import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load dashboard");
        const data = await res.json();
        if (active) setOverview(data || null);
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
      <h1>Admin Dashboard</h1>
      {loading && <p>Loading dashboard...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && overview && (
        <section style={{ display: "grid", gap: 12 }}>
          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            <strong>Total Orders</strong>
            <div>{overview.totalOrders || 0}</div>
          </div>
          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            <strong>Revenue</strong>
            <div>{overview.revenue ? `$${overview.revenue}` : "$0"}</div>
          </div>
          <div style={{ border: "1px solid #ddd", padding: 12 }}>
            <strong>Active Reservations</strong>
            <div>{overview.activeReservations || 0}</div>
          </div>
        </section>
      )}
      {!loading && !error && !overview && <p>No overview data available.</p>}
      <nav style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/admin/menu" style={{ padding: 8, border: "1px solid #000" }}>
          Manage Menu
        </a>
        <a href="/admin/orders" style={{ padding: 8, border: "1px solid #000" }}>
          Manage Orders
        </a>
      </nav>
    </main>
  );
}
