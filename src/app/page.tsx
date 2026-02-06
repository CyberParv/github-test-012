"use client";

import { useEffect, useState } from "react";

export default function HomePage() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [featuredRes, promoRes] = await Promise.all([
          fetch("/api/featured", { cache: "no-store" }),
          fetch("/api/promotions", { cache: "no-store" })
        ]);
        if (!featuredRes.ok || !promoRes.ok) {
          throw new Error("Failed to load home content");
        }
        const featuredData = await featuredRes.json();
        const promoData = await promoRes.json();
        if (active) {
          setFeatured(Array.isArray(featuredData) ? featuredData : []);
          setPromotions(Array.isArray(promoData) ? promoData : []);
        }
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
      <header style={{ marginBottom: 24 }}>
        <h1>Welcome</h1>
        <p>Discover our latest menu items, promotions, and ways to order.</p>
        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <a href="/menu" style={{ padding: 10, border: "1px solid #000" }}>Order Now</a>
          <a href="/reservations" style={{ padding: 10, border: "1px solid #000" }}>Reserve a Table</a>
        </div>
      </header>

      <section aria-labelledby="featured-title" style={{ marginBottom: 32 }}>
        <h2 id="featured-title">Featured Items</h2>
        {loading && <p>Loading featured items...</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {featured.map((item, idx) => (
              <li key={item.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
                <strong>{item.name || "Item"}</strong>
                <p>{item.description || ""}</p>
              </li>
            ))}
            {featured.length === 0 && <li>No featured items available.</li>}
          </ul>
        )}
      </section>

      <section aria-labelledby="promo-title">
        <h2 id="promo-title">Promotions</h2>
        {loading && <p>Loading promotions...</p>}
        {!loading && !error && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
            {promotions.map((promo, idx) => (
              <li key={promo.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
                <strong>{promo.title || "Promotion"}</strong>
                <p>{promo.details || ""}</p>
              </li>
            ))}
            {promotions.length === 0 && <li>No promotions available.</li>}
          </ul>
        )}
      </section>
    </main>
  );
}
