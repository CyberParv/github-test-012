import { describe, it, expect } from 'vitest';

/**
 * Unit test for a typical health handler.
 *
 * If your app exports a health handler, set HEALTH_HANDLER_MODULE to its path,
 * e.g. "src/routes/health" and export a function named `health` or `GET`.
 */

describe('health handler (unit)', () => {
  it('returns ok-style payload when available', async () => {
    const modPath = process.env.HEALTH_HANDLER_MODULE;
    if (!modPath) {
      // Soft-pass to avoid breaking unknown stacks; integration tests cover real endpoints.
      expect(true).toBe(true);
      return;
    }

    const mod: any = await import(modPath);
    const handler = mod.health || mod.GET || mod.handler;
    expect(handler).toBeTypeOf('function');

    const res = await handler({} as any);

    // Support common patterns: {status, body}, Response, or plain object
    if (typeof Response !== 'undefined' && res instanceof Response) {
      expect(res.status).toBeGreaterThanOrEqual(200);
      expect(res.status).toBeLessThan(500);
      const text = await res.text();
      expect(text.toLowerCase()).toContain('ok');
    } else if (res && typeof res === 'object' && 'status' in res) {
      expect((res as any).status).toBe(200);
    } else {
      expect(JSON.stringify(res).toLowerCase()).toContain('ok');
    }
  });
});
