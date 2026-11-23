import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { HitePlanetProfile } from '../components/visualizations/HitePlanetProfile';
import type { Exoplanet } from '../types/exoplanet';

describe('HITE profile', () => {
  it('explains zero scores for a large radius and keeps details expandable', async () => {
    const planet: Exoplanet = {
      id: 'K00001.01',
      name: 'K00001.01',
      hostStar: 'KIC 11446443',
      planetType: 'gas-giant',
      disposition: 'CONFIRMED',
      radiusEarth: 12.85,
      equilibriumTempK: 1344,
      stellarFluxEarth: 772.22,
      distanceLightYears: null,
      hiteStatus: 'calculated',
      hiteScore: 0,
      hiteScorePrime: 0,
      hiteRockyProbability: 0,
      massEarth: 11155.689,
    };
    const user = userEvent.setup();
    render(<HitePlanetProfile planet={planet} />);
    expect(screen.getByText(/implemented rocky probability is zero/i)).toBeInTheDocument();
    expect(screen.getByText(/does not prove the planet cannot support life/i)).toBeInTheDocument();
    await user.click(screen.getByText('Scientific details'));
    expect(screen.getByText(/Extrapolation to large gas giants/i)).toBeInTheDocument();
  });
});
