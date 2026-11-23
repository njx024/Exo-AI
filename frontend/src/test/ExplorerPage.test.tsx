import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ExplorerPage } from '../pages/ExplorerPage';
import type { Exoplanet } from '../types/exoplanet';

vi.mock('../services/exoplanetService', () => ({
  getExoplanets: vi.fn(),
}));

import { getExoplanets } from '../services/exoplanetService';

const planets: Exoplanet[] = [
  { id: 'COOL', name: 'Cool One', hostStar: 'Star A', planetType: 'terrestrial', radiusEarth: 1, equilibriumTempK: 300, stellarFluxEarth: 0.5, distanceLightYears: 20 },
  { id: 'HOT', name: 'Hot One', hostStar: 'Star B', planetType: 'gas-giant', radiusEarth: 12, equilibriumTempK: 2200, stellarFluxEarth: 120, distanceLightYears: 600 },
];

describe('Explorer filters', () => {
  beforeEach(() => {
    vi.mocked(getExoplanets).mockReset();
    vi.mocked(getExoplanets).mockResolvedValue(planets);
  });

  it('combines temperature and stellar flux filters and reset restores the catalogue', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter><ExplorerPage onReplayIntro={vi.fn()} /></MemoryRouter>);

    expect(await screen.findByText('Cool One')).toBeInTheDocument();
    expect(screen.getByText('Hot One')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Temperature' }), '1500-3000');
    await waitFor(() => expect(screen.queryByText('Cool One')).not.toBeInTheDocument());
    expect(screen.queryByText('Hot One')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Stellar flux' }), 'over-hundred');
    await waitFor(() => expect(screen.queryByText('Cool One')).not.toBeInTheDocument());

    await user.click(screen.getByRole('button', { name: 'RESET' }));
    expect(await screen.findByText('Cool One')).toBeInTheDocument();
    expect(screen.getByText('Hot One')).toBeInTheDocument();

    await user.selectOptions(screen.getByRole('combobox', { name: 'Sort by' }), 'temperature');
    await waitFor(() => {
      const cardNames = screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent);
      expect(cardNames.slice(0, 2)).toEqual(['Cool One', 'Hot One']);
    });
  });
});
