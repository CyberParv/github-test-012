import { describe, it, expect } from 'vitest';

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
const healthPath = process.env.HEALTH_PATH || '/health';

async function fetchJson(url: string) {
  const res = await fetch(url, {
    headers: { accept: 'application/json' }
  });
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // not json
  }
  return { res, text, json };
}

describe('Health endpoint (integration)', () => {
  it(`GET ${healthPath} returns 200`, async () => {
    const { res, text, json } = await fetchJson(`${baseURL}${healthPath}`);
    expect(res.status).toBe(200);

    // Accept either JSON { ok: true } or text containing ok
    if (json) {
      const s = JSON.stringify(json).toLowerCase();
      expect(s).toContain('ok');
    } else {
      expect(text.toLowerCase()).toContain('ok');
    }
  });
});
