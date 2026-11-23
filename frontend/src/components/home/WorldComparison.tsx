import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { getExoplanets } from '../../services/exoplanetService';
import type { Exoplanet } from '../../types/exoplanet';

interface WorldComparisonProps {
  onCompare: (firstPlanetId: string, secondPlanetId: string) => void;
}

export const WorldComparison: React.FC<WorldComparisonProps> = ({ onCompare }) => {
  const [firstPlanetId, setFirstPlanetId] = useState('');
  const [secondPlanetId, setSecondPlanetId] = useState('');
  const [planets, setPlanets] = useState<Exoplanet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getExoplanets()
      .then((records) => {
        if (active) setPlanets(records);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load the catalogue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const renderSelector = (
    label: string,
    value: string,
    onChange: (planetId: string) => void
  ) => (
    <label className="relative block w-full max-w-sm text-left">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading || Boolean(error)}
        className="h-14 w-full appearance-none rounded-md border border-[#536075] bg-[#11151d] px-4 pr-12 font-sans text-sm text-white outline-none transition-colors hover:border-[#738198] focus:border-[#dfb15b] disabled:cursor-wait disabled:text-[#bbc4d0]"
      >
        <option value="" disabled className="bg-[#0D1014] text-[#8c94a0]">
          {loading ? 'Loading planets...' : error ? 'Catalogue unavailable' : label}
        </option>
        {planets.map((planet) => (
          <option key={planet.id} value={planet.id} className="bg-[#0D1014] text-[#e8eaed]">
            {planet.name}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#dfb15b]/80"
      />
    </label>
  );

  const canCompare = Boolean(firstPlanetId && secondPlanetId);

  return (
    <section className="w-full px-4 pb-12 pt-2 text-center sm:pb-16 sm:pt-4">
      <div className="mx-auto max-w-5xl rounded-lg border border-[#64748b]/30 bg-[#07090d]/80 px-5 py-7 shadow-[0_18px_60px_rgba(0,0,0,0.3)] sm:px-10 sm:py-9">
        <h2 className="font-['Cinzel',sans-serif] text-sm tracking-[0.24em] text-[#e8eaed]">
          COMPARE WORLDS
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs font-light tracking-wide text-[#c2c8d0]/85">
          Place two exoplanets side by side and see how they measure up.
        </p>

        {loading && (
          <p className="mt-4 text-xs text-[#d0d7df]" role="status">Loading catalogue planets...</p>
        )}
        {error && (
          <p className="mt-4 text-xs text-[#f0b7a8]" role="alert">Catalogue unavailable: {error}</p>
        )}

        <div className="mx-auto mt-7 flex max-w-4xl flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7">
          {renderSelector('Select Planet 1', firstPlanetId, setFirstPlanetId)}
          <span className="shrink-0 font-mono text-[9px] tracking-[0.2em] text-[#e8eaed]/70">VS</span>
          {renderSelector('Select Planet 2', secondPlanetId, setSecondPlanetId)}
        </div>

        <button
          type="button"
          disabled={!canCompare}
          onClick={() => onCompare(firstPlanetId, secondPlanetId)}
          className="mt-6 border-b border-[#dfb15b]/50 px-1 py-2 font-mono text-[9px] tracking-[0.2em] text-[#e8eaed]/80 transition-colors hover:border-[#dfb15b] hover:text-[#f3e1b6] disabled:cursor-not-allowed disabled:border-white/15 disabled:text-white/35"
        >
          COMPARE PLANETS
        </button>
      </div>
    </section>
  );
};