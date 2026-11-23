import React from 'react';
import type { Exoplanet } from '../../types/exoplanet';

interface HitePlanetProfileProps {
  planet: Exoplanet | null;
}

const fmt = (value: number | null | undefined, digits = 4, unit = '') =>
  value === null || value === undefined ? 'Not available' : `${value.toFixed(digits)}${unit ? ` ${unit}` : ''}`;

export const HitePlanetProfile: React.FC<HitePlanetProfileProps> = ({ planet }) => {
  if (!planet) {
    return (
      <div className="rounded-md border border-[#27323e]/80 bg-[#070b11]/85 p-6 text-center">
        <p className="font-mono text-[9px] uppercase tracking-widest text-[#788898]">No target selected</p>
      </div>
    );
  }

  const calculated = planet.hiteStatus === 'calculated';
  const largeRockyModel = planet.radiusEarth !== null && planet.radiusEarth !== undefined && planet.radiusEarth >= 2.5;

  return (
    <div className="rounded-md border border-[#27323e]/80 bg-[#070b11]/85 p-4 sm:p-5">
      <header className="border-b border-white/[0.06] pb-4">
        <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#dfb15b]">HITE profile</p>
        <h3 className="mt-1 font-['Cinzel',sans-serif] text-lg text-[#edf1f4]">{planet.name}</h3>
        <p className="mt-1 text-sm text-[#9daaba]">Host star: {planet.hostStar}</p>
      </header>

      <div className="mt-4 rounded-md border border-[#38bdf8]/15 bg-[#080e16] p-4">
        <p className="text-sm leading-7 text-[#c4ced8]">
          HITE evaluates whether a planet's estimated flux range could be compatible with simple rocky-planet, albedo, and eccentricity assumptions. It is a prioritization indicator, not a habitability or life result.
        </p>
        {largeRockyModel && (
          <p className="mt-3 text-xs leading-6 text-amber-300">
            For {fmt(planet.radiusEarth, 3, 'R⊕')}, the implemented rocky probability is zero because the radius is at or above 2.5 R⊕. This assigns zero rocky weight to HITE H and H′.
          </p>
        )}
        {planet.hiteScore === 0 && planet.hiteScorePrime === 0 && (
          <p className="mt-2 text-xs leading-6 text-[#b3bec8]">
            A zero HITE score does not prove the planet cannot support life. The result follows from the implemented score and derived inputs. The estimated mass for this large planet is uncertain under the extrapolated mass-radius relation.
          </p>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded border border-[#38bdf8]/20 p-4">
          <p className="font-mono text-[8px] uppercase tracking-widest text-[#38bdf8]">HITE H</p>
          <p className="mt-2 font-mono text-3xl text-[#edf1f4]">
            {calculated && planet.hiteScore != null ? planet.hiteScore.toFixed(5) : 'Not available'}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#82909d]">Eccentricity-constrained score using derived minimum eccentricity.</p>
        </div>
        <div className="rounded border border-[#dfb15b]/20 p-4">
          <p className="font-mono text-[8px] uppercase tracking-widest text-[#dfb15b]">HITE H′</p>
          <p className="mt-2 font-mono text-3xl text-[#edf1f4]">
            {calculated && planet.hiteScorePrime != null ? planet.hiteScorePrime.toFixed(5) : 'Not available'}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#82909d]">Unconstrained score with minimum eccentricity set to zero.</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded border border-white/[0.07] p-3">
          <dt className="text-[9px] text-[#7f8d99]">Rocky probability</dt>
          <dd className="mt-1 text-sm text-emerald-300">{fmt(planet.hiteRockyProbability, 4)}</dd>
        </div>
        <div className="rounded border border-white/[0.07] p-3">
          <dt className="text-[9px] text-[#7f8d99]">Planetary radius</dt>
          <dd className="mt-1 text-sm text-[#dfe5eb]">{fmt(planet.radiusEarth, 3, 'R⊕')}</dd>
        </div>
        <div className="rounded border border-white/[0.07] p-3">
          <dt className="text-[9px] text-[#7f8d99]">Estimated mass</dt>
          <dd className="mt-1 text-sm text-[#dfe5eb]">{fmt(planet.massEarth, 3, 'M⊕')}</dd>
        </div>
        <div className="rounded border border-white/[0.07] p-3">
          <dt className="text-[9px] text-[#7f8d99]">Data completeness</dt>
          <dd className="mt-1 text-sm text-[#dfe5eb]">{planet.hiteDataCompleteness == null ? 'Not available' : `${planet.hiteDataCompleteness.toFixed(1)}%`}</dd>
        </div>
      </dl>

      <details className="mt-4 border-t border-white/[0.07] pt-4">
        <summary className="cursor-pointer font-mono text-[9px] uppercase tracking-[0.16em] text-[#82bdd4]">
          Scientific details
        </summary>
        <dl className="mt-3 grid gap-2 text-xs">
          {[
            ['Rocky probability', planet.hiteRockyProbability == null ? 'Not available' : planet.hiteRockyProbability.toFixed(4), '1 for Rp ≤ 1.5 R⊕; linear decrease from 1 to 0 for 1.5–2.5 R⊕; 0 for Rp ≥ 2.5 R⊕.'],
            ['e_min', fmt(planet.hiteEMin, 5), 'Minimum eccentricity derived from transit-duration anomaly.'],
            ['F_min', fmt(planet.hiteFMin, 1, 'W/m²'), 'Constant minimum outgoing longwave threshold of 67 W/m².'],
            ['F_max', fmt(planet.hiteFMax, 1, 'W/m²'), 'Maximum OLR threshold derived from surface gravity; planets with F_max ≤ F_min yield zero HITE.'],
            ['Semi-major axis', fmt(planet.semiMajorAxisAU, 4, 'AU'), 'Catalogue semi-major axis or a Kepler-third-law estimate where unavailable.'],
            ['Luminosity', fmt(planet.stellarLuminositySolar, 4, 'L☉'), 'L/L☉ = (R★/R☉)² × (T★/5778)⁴.'],
            ['Calculation type', planet.hiteCalcType ?? 'Not available', 'H uses constrained eccentricity; H_prime assumes e_min = 0.'],
          ].map(([label, value, explanation]) => (
            <div key={label} className="grid gap-1 border-b border-white/[0.05] py-2 sm:grid-cols-[150px_180px_1fr]">
              <dt className="font-mono text-[8px] uppercase text-[#788898]">{label}</dt>
              <dd className="text-[#dce3e9]">{value}</dd>
              <dd className="leading-5 text-[#8794a0]">{explanation}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-xs leading-6 text-[#8794a0]">
          Estimated mass follows the implemented Rp^3.268 rule for Rp ≤ 1 R⊕ and Rp^3.65 for larger radii. Extrapolation to large gas giants is uncertain and should not be treated as a confirmed mass.
        </p>
      </details>

      <p className="mt-4 rounded border border-white/[0.07] bg-[#070d16] px-3 py-3 text-xs leading-6 text-[#8794a0]">
        HITE is based on orbital mechanics and simple flux thresholds. It does not account for atmospheric composition, geological activity, magnetic field, tidal locking, or direct evidence of life.
      </p>
    </div>
  );
};
