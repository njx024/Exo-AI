import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PlanetDetailsPage } from '../pages/PlanetDetailsPage';
import { PlanetApiError } from '../services/exoplanetService';
import type { Exoplanet } from '../types/exoplanet';

vi.mock('../services/exoplanetService', () => ({
  getPlanet: vi.fn(),
  getModelInfo: vi.fn(),
  PlanetApiError: class PlanetApiError extends Error { status: number; constructor(status: number, message: string) { super(message); this.status = status; } },
}));

import { getModelInfo, getPlanet } from '../services/exoplanetService';

const planet: Exoplanet = {
  id: 'K1',
  name: 'Missing Data Planet',
  hostStar: 'Missing Star',
  planetType: 'unknown',
  disposition: null,
  radiusEarth: null,
  equilibriumTempK: null,
  stellarFluxEarth: null,
  mlPredictedClass: null,
  distanceLightYears: null,
};

describe('Planet Details', () => {
  beforeEach(() => {
    vi.mocked(getPlanet).mockReset();
    vi.mocked(getModelInfo).mockReset();
  });

  it('renders unavailable values instead of zero and reports unavailable ML', async () => {
    vi.mocked(getPlanet).mockResolvedValue(planet);
    vi.mocked(getModelInfo).mockResolvedValue({ trained: false, error: 'model unavailable' });
    render(
      <MemoryRouter initialEntries={['/planet/K1']}>
        <Routes>
          <Route path="/planet/:id" element={<PlanetDetailsPage onReplayIntro={vi.fn()} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('Missing Data Planet')).toBeInTheDocument();
    expect(screen.getAllByText('Not available').length).toBeGreaterThan(0);
  });

  it('shows not-found for a 404 planet ID', async () => {
    vi.mocked(getPlanet).mockRejectedValue(new PlanetApiError(404, 'Planet not found'));
    vi.mocked(getModelInfo).mockResolvedValue({ trained: false });
    render(
      <MemoryRouter initialEntries={['/planet/invalid']}>
        <Routes>
          <Route path="/planet/:id" element={<PlanetDetailsPage onReplayIntro={vi.fn()} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('Planet not found')).toBeInTheDocument();
  });

  it('shows an API failure instead of fabricated data', async () => {
    vi.mocked(getPlanet).mockRejectedValue(new Error('FastAPI catalogue unavailable'));
    vi.mocked(getModelInfo).mockResolvedValue({ trained: false });
    render(
      <MemoryRouter initialEntries={['/planet/K1']}>
        <Routes>
          <Route path="/planet/:id" element={<PlanetDetailsPage onReplayIntro={vi.fn()} />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('FastAPI catalogue unavailable')).toBeInTheDocument();
  });
});
