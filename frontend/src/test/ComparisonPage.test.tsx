import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComparisonPage } from '../pages/ComparisonPage';
import type { Exoplanet } from '../types/exoplanet';

vi.mock('../services/exoplanetService', () => ({
  getExoplanets: vi.fn(),
}));

import { getExoplanets } from '../services/exoplanetService';

const planets: Exoplanet[] = [
  { id: 'A', name: 'Planet A', hostStar: 'Star A', planetType: 'terrestrial', radiusEarth: 1, equilibriumTempK: 280, stellarFluxEarth: 1, distanceLightYears: null },
  { id: 'B', name: 'Planet B', hostStar: 'Star B', planetType: 'unknown', radiusEarth: null, equilibriumTempK: null, stellarFluxEarth: null, distanceLightYears: null },
  { id: 'C', name: 'Planet C', hostStar: 'Star C', planetType: 'gas-giant', radiusEarth: 12, equilibriumTempK: 1200, stellarFluxEarth: 30, distanceLightYears: null },
];

describe('comparison page', () => {
  beforeEach(() => {
    vi.mocked(getExoplanets).mockReset();
    vi.mocked(getExoplanets).mockResolvedValue(planets);
  });

  it('preserves URL selections and supports a third planet within the limit', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/compare?ids=A,B']}>
        <Routes>
          <Route path="/compare" element={<ComparisonPage onReplayIntro={vi.fn()} />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByText('2 / 3 selected')).toBeInTheDocument();
    await user.type(screen.getByRole('textbox', { name: 'Search planets' }), 'Planet C');
    await user.click(await screen.findByRole('button', { name: 'Planet C Star C' }));
    expect(await screen.findByText('3 / 3 selected')).toBeInTheDocument();
  });
});
