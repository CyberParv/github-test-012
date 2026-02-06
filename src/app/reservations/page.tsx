"use client";

import { useEffect, useState } from "react";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/reservations", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load reservations");
        const data = await res.json();
        if (active) setReservations(Array.isArray(data) ? data : []);
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

  async function submitReservation(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/reservations", { method: "POST" });
    } catch (e) {
      // silent
    }
  }

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Reservations</h1>
      <form onSubmit={submitReservation} style={{ display: "grid", gap: 12, maxWidth: 420 }}>
        <label>
          Name
          <input type="text" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <label>
          Date
          <input type="date" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <label>
          Time
          <input type="time" required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <label>
          Party Size
          <input type="number" min={1} required style={{ display: "block", width: "100%", padding: 6 }} />
        </label>
        <button type="submit" style={{ padding: 10, border: "1px solid #000" }}>
          Reserve
        </button>
      </form>
      <section aria-labelledby="your-reservations" style={{ marginTop: 24 }}>
        <h2 id="your-reservations">Your Reservations</h2>
        {loading && <p>Loading reservations...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {reservations.map((r, idx) => (
              <li key={r.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
                <strong>{r.name || "Reservation"}</strong>
                <div>{r.date || ""} {r.time || ""}</div>
                <div>Party: {r.partySize || ""}</div>
              </li>
            ))}
            {reservations.length === 0 && <li>No reservations yet.</li>}
          </ul>
        )}
      </section>
    </main>
  );
}
