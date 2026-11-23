import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getExoplanets } from '../../services/exoplanetService';
import type { Exoplanet } from '../../types/exoplanet';

export const AICommandBox: React.FC = () => {
  const navigate = useNavigate();
  const [catalogue, setCatalogue] = useState<Exoplanet[]>([]);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getExoplanets()
      .then((records) => {
        if (active) setCatalogue(records);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load the exoplanet catalogue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const matches = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return catalogue
      .filter((planet) => `${planet.name} ${planet.hostStar}`.toLowerCase().includes(normalized))
      .slice(0, 8);
  }, [catalogue, query]);

  useEffect(() => {
    setActiveIndex(matches.length ? 0 : -1);
  }, [matches.length, query]);

  const selectPlanet = (planet: Exoplanet) => {
    navigate(`/planet/${encodeURIComponent(planet.id)}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!matches.length) {
      if (event.key === 'Escape') setQuery('');
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % matches.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? matches.length - 1 : index - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectPlanet(matches[Math.max(activeIndex, 0)]);
    } else if (event.key === 'Escape') {
      setQuery('');
    }
  };

  return (
    <div className="relative mx-auto w-full max-w-[620px] text-left">
      <div className="rounded-xl border border-[#354052] bg-[#090c12]/95 p-3 shadow-[0_16px_50px_rgba(0,0,0,0.62)] sm:p-4">
        <label htmlFor="planet-search" className="mb-2 block font-mono text-[9px] tracking-[0.18em] text-[#c8d0da]">
          SEARCH PLANETS
        </label>
        <div className="relative">
          <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#dfb15b]" />
          <input
            id="planet-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={loading ? 'Loading catalogue...' : 'Search planet or host star'}
            disabled={loading}
            autoComplete="off"
            role="combobox"
            aria-expanded={Boolean(query.trim())}
            aria-controls="planet-search-results"
            aria-activedescendant={activeIndex >= 0 ? `planet-result-${activeIndex}` : undefined}
            className="h-12 w-full rounded-lg border border-[#455268] bg-[#11151d] pl-10 pr-3 font-sans text-sm text-white outline-none placeholder:text-[#aab3bf] focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20"
          />
        </div>

        {loading && (
          <p className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-wide text-[#c8d0da]" role="status">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#38bdf8]" aria-hidden="true" />
            Loading exoplanet catalogue...
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs text-[#f0b7a8]" role="alert">
            Catalogue unavailable: {error}
          </p>
        )}

        {query.trim() && !error && (
          <div id="planet-search-results" role="listbox" className="mt-2 max-h-72 overflow-y-auto rounded-lg border border-[#293243] bg-[#090c12]">
            {!loading && matches.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[#c8d0da]">No matching exoplanets found.</p>
            ) : (
              matches.map((planet, index) => (
                <button
                  id={`planet-result-${index}`}
                  role="option"
                  aria-selected={index === activeIndex}
                  type="button"
                  key={planet.id}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => selectPlanet(planet)}
                  className={`flex w-full items-center justify-between gap-3 border-b border-[#202735] px-3 py-3 text-left transition-colors last:border-b-0 ${
                    index === activeIndex ? 'bg-[#18202b] text-white' : 'bg-transparent text-[#e4e8ed] hover:bg-[#151a23]'
                  }`}
                >
                  <span>
                    <span className="block text-sm font-medium">{planet.name}</span>
                    <span className="mt-0.5 block text-[11px] text-[#aab6c4]">Host star: {planet.hostStar}</span>
                  </span>
                  <span className="shrink-0 font-mono text-[9px] uppercase tracking-wider text-[#dfb15b]">
                    {planet.planetType.replace('-', ' ')}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
