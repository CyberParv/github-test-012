"use client";

import { useEffect, useMemo, useState } from "react";

export default function MenuPage() {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/menu", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load menu");
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

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesQuery = item.name?.toLowerCase().includes(query.toLowerCase()) || !query;
      const matchesFilter = filter === "all" || item.category === filter;
      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <header style={{ marginBottom: 20 }}>
        <h1>Menu</h1>
        <p>Browse categories, search and filter our offerings.</p>
      </header>

      <section aria-label="Menu controls" style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          type="search"
          aria-label="Search menu"
          placeholder="Search items"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ padding: 8, flex: 1 }}
        />
        <select
          aria-label="Filter category"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ padding: 8 }}
        >
          <option value="all">All</option>
          <option value="coffee">Coffee</option>
          <option value="tea">Tea</option>
          <option value="food">Food</option>
        </select>
      </section>

      {loading && <p>Loading menu...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {filtered.map((item, idx) => (
            <li key={item.id || idx} style={{ border: "1px solid #ddd", padding: 12 }}>
              <a href={`/menu/${item.id}`} style={{ fontWeight: 600 }}>
                {item.name || "Menu Item"}
              </a>
              <p>{item.description || ""}</p>
              <span>{item.price ? `$${item.price}` : ""}</span>
            </li>
          ))}
          {filtered.length === 0 && <li>No items match your search.</li>}
        </ul>
      )}
    </main>
  );
}
