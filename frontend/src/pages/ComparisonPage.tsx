import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Search, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../components/home/TopNavigation';
import { getExoplanets } from '../services/exoplanetService';
import type { Exoplanet } from '../types/exoplanet';

interface ComparisonPageProps {
  onReplayIntro: () => void;
}

const value = (number: number | null | undefined, unit = '', digits = 3) =>
  number === null || number === undefined
    ? 'Not available'
    : `${Number.isInteger(number) ? number.toString() : number.toFixed(digits)}${unit ? ` ${unit}` : ''}`;

const comparisonRows: Array<{
  label: string;
  get: (planet: Exoplanet) => string;
}> = [
  { label: 'Catalogue disposition', get: (p) => p.disposition ?? 'Not available' },
  { label: 'Planet type', get: (p) => p.planetType.replace('-', ' ') },
  { label: 'Planet radius', get: (p) => value(p.radiusEarth, 'R⊕', 3) },
  { label: 'Estimated mass', get: (p) => value(p.massEarth, 'M⊕', 3) },
  { label: 'Equilibrium temperature', get: (p) => value(p.equilibriumTempK, 'K', 1) },
  { label: 'Stellar insolation', get: (p) => value(p.stellarFluxEarth, 'S⊕', 3) },
  { label: 'Orbital period', get: (p) => value(p.orbitalPeriodDays, 'days', 4) },
  { label: 'Semi-major axis', get: (p) => value(p.semiMajorAxisAU, 'AU', 5) },
  { label: 'Screening score', get: (p) => value(p.candidateScore, '/ 100', 2) },
  { label: 'Screening priority', get: (p) => p.priority ?? 'Not available' },
  { label: 'ESI', get: (p) => value(p.esi, '', 4) },
  { label: 'Conservative HZ', get: (p) => p.hzClassificationFull ?? 'Not available' },
  { label: 'Optimistic HZ', get: (p) => p.hzClassificationOptimistic ?? 'Not available' },
  { label: 'HITE H', get: (p) => value(p.hiteScore, '', 5) },
  { label: 'HITE H′', get: (p) => value(p.hiteScorePrime, '', 5) },
  { label: 'Rocky probability', get: (p) => value(p.hiteRockyProbability, '', 4) },
  { label: 'Stellar temperature', get: (p) => value(p.stellarTempK, 'K', 1) },
  { label: 'Stellar radius', get: (p) => value(p.stellarRadiusSolar, 'R☉', 3) },
  { label: 'Stellar spectral class', get: (p) => p.stellarSpectralClass ?? 'Not available' },
  { label: 'ML predicted disposition', get: (p) => p.mlPredictedClass ?? 'Not available' },
];

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ onReplayIntro }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [catalog, setCatalog] = useState<Exoplanet[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getExoplanets()
      .then((records) => {
        setCatalog(records);
        const requested = (searchParams.get('ids') ?? '')
          .split(',')
          .map((id) => id.trim())
          .filter((id) => id && records.some((planet) => planet.id === id))
          .slice(0, 3);
        if (requested.length === 1) {
          const fallback = records.find((planet) => planet.id !== requested[0]);
          setSelectedIds(fallback ? [requested[0], fallback.id] : requested);
        } else {
          setSelectedIds(requested.length > 1 ? requested : records.slice(0, 2).map((planet) => planet.id));
        }
      })
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Catalogue unavailable'))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedIds.length > 0) setSearchParams({ ids: selectedIds.join(',') }, { replace: true });
  }, [selectedIds, setSearchParams]);

  const selected = useMemo(
    () => selectedIds.map((id) => catalog.find((planet) => planet.id === id)).filter((planet): planet is Exoplanet => Boolean(planet)),
    [catalog, selectedIds],
  );

  const matches = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) return catalog.slice(0, 18);
    return catalog
      .filter((planet) => planet.name.toLowerCase().includes(normalized) || planet.hostStar.toLowerCase().includes(normalized))
      .slice(0, 18);
  }, [catalog, search]);

  const addPlanet = (id: string) => {
    if (selectedIds.includes(id) || selectedIds.length >= 3) return;
    setSelectedIds((ids) => [...ids, id]);
  };

  const removePlanet = (id: string) => {
    setSelectedIds((ids) => ids.filter((current) => current !== id));
  };

  const handleNavigate = (view: 'home' | 'explore' | 'rankings' | 'compare' | 'visualizations') => {
    navigate(view === 'home' ? '/' : `/${view}`);
  };

  return (
    <div
      className="h-screen overflow-x-hidden overflow-y-auto text-[#e8eaed]"
      style={{
        background:
          'radial-gradient(ellipse at 78% 0%, rgba(25,57,82,0.28), transparent 44%), radial-gradient(ellipse at 8% 36%, rgba(150,117,61,0.07), transparent 34%), #050608',
      }}
    >
      <TopNavigation activeView="compare" onNavigate={handleNavigate} onReplayIntro={onReplayIntro} />
      <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8 lg:px-12">
        <header className="flex flex-col gap-5 border-b border-white/[0.07] pb-7 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
          <div>
            <p className="mb-2 font-mono text-[9px] tracking-[0.22em] text-[#dfb15b]/85">EXO-AI / WORLD COMPARISON</p>
            <h1 className="font-['Cinzel',sans-serif] text-2xl font-light tracking-[0.12em] sm:text-3xl">COMPARE WORLDS</h1>
            <p className="mt-3 max-w-xl text-sm text-[#93a0ad]">Compare real catalogue measurements and scientific screening outputs.</p>
          </div>
          <button type="button" onClick={() => navigate(-1)} className="flex w-fit items-center gap-2 font-mono text-[8px] uppercase tracking-wider text-[#93a0ad]">
            <ArrowLeft className="h-3 w-3" /> Back
          </button>
        </header>

        {isLoading ? (
          <p className="py-16 text-center font-mono text-[10px] tracking-[0.18em] text-[#38bdf8]">LOADING CATALOGUE...</p>
        ) : error ? (
          <div className="mt-8 rounded-md border border-red-500/25 bg-red-950/15 p-8 text-center text-sm text-red-300">{error}</div>
        ) : (
          <>
            <section className="mt-6 grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <label className="flex h-12 items-center gap-3 rounded-md border border-[#34414f]/75 bg-[#070b11]/85 px-4">
                <Search className="h-4 w-4 text-[#8bbbd4]" />
                <span className="sr-only">Search planets</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search planet name or host star..."
                  className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#64748b]"
                />
              </label>
              <p className="flex items-center justify-center font-mono text-[8px] uppercase tracking-wider text-[#71808e]">
                {selectedIds.length} / 3 selected
              </p>
            </section>

            {search && (
              <div className="mt-2 max-h-56 overflow-y-auto rounded-md border border-[#34414f] bg-[#070d16] p-1">
                {matches.map((planet) => (
                  <button
                    key={planet.id}
                    type="button"
                    disabled={selectedIds.includes(planet.id) || selectedIds.length >= 3}
                    onClick={() => addPlanet(planet.id)}
                    className="flex w-full items-center justify-between rounded px-3 py-2 text-left font-mono text-[10px] text-[#dbe2e8] hover:bg-[#101923] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <span>{planet.name}</span>
                    <span className="text-[8px] text-[#71808e]">{planet.hostStar}</span>
                  </button>
                ))}
              </div>
            )}

            {selected.length > 0 ? (
              <div className="mt-7 overflow-x-auto rounded-md border border-[#27323e]/80 bg-[#070b11]/85">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr>
                      <th className="w-52 border-b border-white/[0.07] px-4 py-4 text-left font-mono text-[8px] uppercase tracking-[0.16em] text-[#71808e]">Property</th>
                      {selected.map((planet) => (
                        <th key={planet.id} className="min-w-[220px] border-b border-l border-white/[0.07] px-4 py-4 text-left">
                          <div className="flex items-start justify-between gap-3">
                            <button type="button" onClick={() => navigate(`/planet/${planet.id}`)} className="text-left">
                              <span className="block font-['Cinzel',sans-serif] text-sm text-[#e8eaed]">{planet.name}</span>
                              <span className="mt-1 block font-mono text-[8px] uppercase text-[#71808e]">{planet.hostStar}</span>
                            </button>
                            {selectedIds.length > 2 && (
                              <button type="button" aria-label={`Remove ${planet.name}`} onClick={() => removePlanet(planet.id)} className="text-[#71808e] hover:text-[#e8eaed]">
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.label} className="border-b border-white/[0.05] last:border-0">
                        <th className="px-4 py-3 text-left font-mono text-[8px] uppercase tracking-[0.12em] text-[#71808e]">{row.label}</th>
                        {selected.map((planet) => (
                          <td key={planet.id} className="border-l border-white/[0.05] px-4 py-3 text-xs text-[#d5dde4]">{row.get(planet)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-8 rounded-md border border-white/[0.08] p-8 text-center text-sm text-[#93a0ad]">
                Select at least two planets to compare.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
};
