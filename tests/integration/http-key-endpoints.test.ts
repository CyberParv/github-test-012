import { describe, it, expect } from 'vitest';

const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';

/**
 * Key endpoint integration tests.
 *
 * Configure via env:
 * - KEY_ENDPOINTS: comma-separated list of "METHOD /path" (e.g. "GET /api/me,GET /api/posts")
 * - API_AUTH_HEADER / API_AUTH_VALUE optional
 */

const raw = process.env.KEY_ENDPOINTS || 'GET /';
const endpoints = raw
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(s => {
    const [method, ...rest] = s.split(' ');
    return { method: method.toUpperCase(), path: rest.join(' ').trim() };
  });

function headers() {
  const h: Record<string, string> = { accept: 'application/json,text/html;q=0.9,*/*;q=0.8' };
  if (process.env.API_AUTH_HEADER && process.env.API_AUTH_VALUE) {
    h[process.env.API_AUTH_HEADER] = process.env.API_AUTH_VALUE;
  }
  return h;
}

describe('Key endpoints (integration)', () => {
  for (const ep of endpoints) {
    it(`${ep.method} ${ep.path} responds`, async () => {
      const res = await fetch(`${baseURL}${ep.path}`, {
        method: ep.method,
        headers: headers()
      });

      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(500);
    });
  }
});
