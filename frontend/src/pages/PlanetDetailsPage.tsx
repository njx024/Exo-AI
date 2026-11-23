import React, { useEffect, useState } from 'react';
import { ArrowLeft, AlertTriangle, Loader2, RefreshCw, GitCompareArrows } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopNavigation } from '../components/home/TopNavigation';
import { PlanetThumbnail } from '../components/explorer/PlanetThumbnail';
import {
  EsiCard,
  HabitableZoneCard,
  HiteCard,
  PlanetOverviewCard,
  RandomForestCard,
  ScreeningCard,
  StellarCard,
} from '../components/planet/ScientificCards';
import {
  getModelInfo,
  getPlanet,
  PlanetApiError,
  type ModelInfo,
} from '../services/exoplanetService';
import type { Exoplanet } from '../types/exoplanet';

interface PlanetDetailsPageProps {
  onReplayIntro: () => void;
}

export const PlanetDetailsPage: React.FC<PlanetDetailsPageProps> = ({ onReplayIntro }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState<Exoplanet | null>(null);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadPlanet = () => {
    if (!id) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setNotFound(false);
    setErrorMessage('');
    setPlanet(null);

    Promise.allSettled([getPlanet(id), getModelInfo()])
      .then(([planetResult, modelResult]) => {
        if (planetResult.status === 'rejected') {
          if (planetResult.reason instanceof PlanetApiError && planetResult.reason.status === 404) {
            setNotFound(true);
          } else {
            setErrorMessage(
              planetResult.reason instanceof Error
                ? planetResult.reason.message
                : 'The planet record could not be loaded.',
            );
          }
          return;
        }

        setPlanet(planetResult.value);
        if (modelResult.status === 'fulfilled') {
          setModelInfo(modelResult.value);
        } else {
          setModelInfo(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadPlanet();
  }, [id]);

  const handleNavigate = (view: 'home' | 'explore' | 'rankings' | 'compare' | 'visualizations') => {
    navigate(view === 'home' ? '/' : `/${view}`);
  };

  return (
    <div
      className="h-screen overflow-x-hidden overflow-y-auto text-[#e8eaed]"
      style={{
        background:
          'radial-gradient(ellipse at 78% 0%, rgba(25, 57, 82, 0.28), transparent 44%), radial-gradient(ellipse at 8% 36%, rgba(150, 117, 61, 0.07), transparent 34%), #050608',
      }}
    >
      <TopNavigation
        activeView="planet"
        onNavigate={handleNavigate}
        onReplayIntro={onReplayIntro}
      />

      <main className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-8 lg:px-12">
        {isLoading ? (
          <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#38bdf8]" />
            <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[#a3afbb]">
              ANALYZING PLANET TELEMETRY
            </p>
            <p className="mt-2 font-mono text-[8px] tracking-wider text-[#64748b]">{id}</p>
          </div>
        ) : notFound ? (
          <div className="mx-auto mt-16 max-w-xl rounded-md border border-[#27323e]/80 bg-[#070b11]/85 p-8 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-400" />
            <p className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400">Planet not found</p>
            <h1 className="mt-3 font-['Cinzel',sans-serif] text-xl text-[#e8eaed]">{id}</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#93a0ad]">
              This identifier is not present in the loaded Kepler catalogue.
            </p>
            <button
              type="button"
              onClick={() => navigate('/explore')}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 px-5 py-2.5 font-mono text-[9px] tracking-[0.16em] text-[#38bdf8] hover:border-[#38bdf8]/80"
            >
              <ArrowLeft className="h-3 w-3" />
              RETURN TO EXPLORER
            </button>
          </div>
        ) : errorMessage ? (
          <div className="mx-auto mt-16 max-w-xl rounded-md border border-red-500/25 bg-red-950/15 p-8 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-400" />
            <h1 className="mt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-red-300">
              Planet record unavailable
            </h1>
            <p className="mt-3 text-sm text-[#93a0ad]">{errorMessage}</p>
            <button
              type="button"
              onClick={loadPlanet}
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#38bdf8]/40 px-5 py-2.5 font-mono text-[9px] tracking-[0.16em] text-[#38bdf8]"
            >
              <RefreshCw className="h-3 w-3" />
              RETRY
            </button>
          </div>
        ) : planet ? (
          <>
            <header className="flex flex-col gap-5 border-b border-white/[0.07] pb-7 pt-8 sm:flex-row sm:items-end sm:justify-between sm:pt-12">
              <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                <PlanetThumbnail planetId={planet.id} />
                <div className="min-w-0">
                  <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.22em] text-[#dfb15b]/85">
                    Planet Intelligence / {planet.disposition ?? 'Disposition unavailable'}
                  </p>
                  <h1 className="truncate font-['Cinzel',sans-serif] text-2xl font-light tracking-[0.12em] text-[#e8eaed] sm:text-4xl">
                    {planet.name}
                  </h1>
                  <p className="mt-2 text-xs text-[#93a0ad]">
                    Host star: {planet.hostStar} · Planet type: {planet.planetType.replace('-', ' ')}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/compare?ids=${encodeURIComponent(planet.id)}`)}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfb15b]/30 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#dfb15b] hover:border-[#dfb15b]/70"
                >
                  <GitCompareArrows className="h-3 w-3" />
                  Compare
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-4 py-2 font-mono text-[8px] uppercase tracking-[0.16em] text-[#93a0ad] hover:border-[#38bdf8]/40 hover:text-[#e8eaed]"
                >
                  <ArrowLeft className="h-3 w-3" />
                  Back
                </button>
              </div>
            </header>

            <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <PlanetOverviewCard planet={planet} />
              </div>
              <div className="lg:col-span-4">
                <ScreeningCard planet={planet} />
              </div>
              <div className="lg:col-span-7">
                <HabitableZoneCard planet={planet} />
              </div>
              <div className="lg:col-span-5">
                <EsiCard planet={planet} />
              </div>
              <div className="lg:col-span-6">
                <HiteCard planet={planet} />
              </div>
              <div className="lg:col-span-6">
                <StellarCard planet={planet} />
              </div>
              <div className="lg:col-span-12">
                <RandomForestCard planet={planet} model={modelInfo} />
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
};
