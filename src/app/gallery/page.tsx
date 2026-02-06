"use client";

import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load gallery");
        const data = await res.json();
        if (active) setImages(Array.isArray(data) ? data : []);
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
      <h1>Gallery</h1>
      {loading && <p>Loading gallery...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <section style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))" }}>
          {images.map((img, idx) => (
            <figure key={img.id || idx} style={{ border: "1px solid #ddd", padding: 8 }}>
              <div style={{ background: "#f0f0f0", height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span>{img.caption || "Image"}</span>
              </div>
              <figcaption>{img.caption || ""}</figcaption>
            </figure>
          ))}
          {images.length === 0 && <p>No gallery images available.</p>}
        </section>
      )}
    </main>
  );
}
