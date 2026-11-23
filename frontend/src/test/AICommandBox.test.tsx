import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AICommandBox } from '../components/home/AICommandBox';
import type { Exoplanet } from '../types/exoplanet';

vi.mock('../services/exoplanetService', () => ({
  getExoplanets: vi.fn(),
}));

import { getExoplanets } from '../services/exoplanetService';

const planet: Exoplanet = {
  id: 'K00001.01',
  name: 'K00001.01',
  hostStar: 'KIC 11446443',
  planetType: 'gas-giant',
  radiusEarth: 12.85,
  equilibriumTempK: 1344,
  stellarFluxEarth: 772.22,
  distanceLightYears: null,
};

describe('homepage planet search', () => {
  beforeEach(() => {
    vi.mocked(getExoplanets).mockReset();
    vi.mocked(getExoplanets).mockResolvedValue([planet]);
  });

  it('searches by planet or host star and navigates with Enter', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<AICommandBox />} />
          <Route path="/planet/:id" element={<div>Planet details route</div>} />
        </Routes>
      </MemoryRouter>,
    );

    const input = await screen.findByRole('combobox', { name: 'SEARCH PLANETS' });
    await user.type(input, '11446443');
    expect(await screen.findByText('K00001.01')).toBeInTheDocument();

    await user.keyboard('{Enter}');
    expect(await screen.findByText('Planet details route')).toBeInTheDocument();
  });

  it('shows a clear no-results state', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><AICommandBox /></MemoryRouter>);
    const input = await screen.findByRole('combobox', { name: 'SEARCH PLANETS' });
    await user.type(input, 'not-a-real-world');
    expect(await screen.findByText('No matching exoplanets found.')).toBeInTheDocument();
  });
});
