import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RankingsPage } from '../pages/RankingsPage';
import type { Exoplanet } from '../types/exoplanet';

vi.mock('../services/exoplanetService', () => ({
  getRankings: vi.fn(),
}));

import { getRankings } from '../services/exoplanetService';

const planets: Exoplanet[] = [
  { id: 'C1', name: 'C1', hostStar: 'S1', planetType: 'terrestrial', disposition: 'CONFIRMED', radiusEarth: 1, equilibriumTempK: 300, stellarFluxEarth: 1, distanceLightYears: null, candidateScore: 80, inConservativeHz: true, inOptimisticHz: true },
  { id: 'O1', name: 'O1', hostStar: 'S2', planetType: 'unknown', disposition: 'CANDIDATE', radiusEarth: 2, equilibriumTempK: 600, stellarFluxEarth: 2, distanceLightYears: null, candidateScore: 70, inConservativeHz: false, inOptimisticHz: true },
  { id: 'X1', name: 'X1', hostStar: 'S3', planetType: 'gas-giant', disposition: 'FALSE POSITIVE', radiusEarth: 12, equilibriumTempK: 2200, stellarFluxEarth: 200, distanceLightYears: null, candidateScore: 20, inConservativeHz: false, inOptimisticHz: false },
];

describe('Rankings filters', () => {
  beforeEach(() => {
    vi.mocked(getRankings).mockReset();
    vi.mocked(getRankings).mockResolvedValue(planets);
  });

  it('combines temperature, HZ, and disposition filters and resets', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/rankings']}>
        <Routes><Route path="/rankings" element={<RankingsPage onReplayIntro={vi.fn()} />} /></Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('C1')).toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox', { name: 'Temperature' }), 'under-500');
    await waitFor(() => expect(screen.queryByText('O1')).not.toBeInTheDocument());
    expect(screen.getByText('C1')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Kepler disposition' }), 'CONFIRMED');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Habitable zone filter' }), 'conservative');
    expect(await screen.findByText('C1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'RESET' }));
    expect(await screen.findByText('O1')).toBeInTheDocument();
    expect(screen.getByText('X1')).toBeInTheDocument();
  });

  it('initializes disposition from the URL', async () => {
    render(
      <MemoryRouter initialEntries={['/rankings?disposition=CANDIDATE']}>
        <Routes><Route path="/rankings" element={<RankingsPage onReplayIntro={vi.fn()} />} /></Routes>
      </MemoryRouter>,
    );
    expect(await screen.findByText('O1')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Kepler disposition' })).toHaveValue('CANDIDATE');
  });
});
