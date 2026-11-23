import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('catalogue service caching', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('fetches the catalogue once and reuses the in-memory promise', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [{ id: 'K1', name: 'K1', hostStar: 'Star', planetType: 'unknown', radiusEarth: null, equilibriumTempK: null, stellarFluxEarth: null }],
    }));

    const service = await import('../services/exoplanetService');
    const first = await service.getExoplanets();
    const second = await service.getExoplanets();

    expect(first).toEqual(second);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
