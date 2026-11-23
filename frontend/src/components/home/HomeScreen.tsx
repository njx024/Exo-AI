import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CraterBackground } from './CraterBackground';
import { TopNavigation } from './TopNavigation';
import { AICommandBox } from './AICommandBox';
import { WorldComparison } from './WorldComparison';

interface HomeScreenProps {
  onReplayIntro: () => void;
}

/**
 * HomeScreen — Refined:
 * Visual Ratio: 80% Vast Cosmic Sky, 20% Distant Alien Horizon
 * - Hero sits in open cosmic space with generous breathing room
 * - Restrained, editorial typography (not giant marketing text)
 * - Understated AI command box (floating dark instrument panel)
 * - Quieter secondary quick actions
 * - Zero decorative dashboard telemetry clutter on Home
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ onReplayIntro }) => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<'home' | 'explore' | 'rankings' | 'compare' | 'visualizations'>('home');

  const handleNavigate = (view: 'home' | 'explore' | 'rankings' | 'compare' | 'visualizations') => {
    setActiveView(view);
    navigate(view === 'home' ? '/' : `/${view}`);
  };

  return (
    <div className="relative h-screen w-screen overflow-x-hidden overflow-y-auto bg-[#050608] font-sans text-[#e8eaed] select-none">
      <CraterBackground />

      <div className="relative z-30 flex min-h-full flex-col">
        <TopNavigation
          activeView={activeView}
          onNavigate={handleNavigate}
          onReplayIntro={onReplayIntro}
        />

        <section className="flex min-h-[54svh] flex-col items-center justify-center px-4 text-center sm:px-6">
          <div className="rounded-md bg-[#050608]/55 px-3 py-2 backdrop-blur-[2px]">
            <div className="mb-3 flex items-center justify-center space-x-2 font-mono text-[10px] uppercase leading-5 tracking-[0.22em] text-[#79c7e6] sm:text-[11px]">
            <span className="text-[#dfb15b]">✦</span>
            <span>INTELLIGENCE FOR THE SEARCH BEYOND EARTH</span>
            </div>

            <h1 className="mb-2 pl-[0.24em] font-['Cinzel',sans-serif] text-[26px] font-light leading-tight tracking-[0.18em] text-[#f5f7f9] drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] sm:mb-2.5 sm:text-4xl sm:tracking-[0.24em] md:text-5xl">
            EXPLORE THE UNKNOWN.
            </h1>

            <p className="mx-auto mb-7 max-w-md font-sans text-xs font-normal leading-6 tracking-wide text-[#d3dbe3] sm:mb-8 sm:text-[13px]">
            AI-powered exploration and prioritization of potentially habitable exoplanets.
            </p>
          </div>
        </section>

        <section className="w-full px-4 pb-14 text-center sm:pb-16">
          <div className="mb-5">
            <h2 className="font-['Cinzel',sans-serif] text-sm tracking-[0.24em] text-[#f1f4f7]">
              SEARCH PLANETS
            </h2>
            <p className="mt-2 text-xs font-light tracking-wide text-[#c4ccd6]">
              Find a planet or host star in the Kepler catalogue.
            </p>
          </div>
          <AICommandBox />
          <Link
            to="/explore"
            className="mt-4 inline-block border-b border-[#38bdf8]/50 px-1 py-1 font-mono text-[9px] tracking-[0.18em] text-[#dfe7ef] transition-colors hover:border-[#38bdf8] hover:text-white"
          >
            OPEN FULL EXPLORER
          </Link>
        </section>

        <WorldComparison
          onCompare={(firstPlanetId, secondPlanetId) => {
            if (firstPlanetId && secondPlanetId) {
              navigate(`/compare?ids=${encodeURIComponent(firstPlanetId)},${encodeURIComponent(secondPlanetId)}`);
            }
          }}
        />

        <section className="flex justify-center px-4 pb-10 pt-2 text-center">
          <button
            type="button"
            onClick={() => navigate('/explore')}
            className="rounded-full border border-[#38bdf8]/35 bg-[#050608]/20 px-6 py-2.5 font-mono text-[10px] tracking-[0.2em] text-[#e8eaed]/85 transition-colors hover:border-[#38bdf8]/65 hover:text-white"
          >
            EXPLORE EXOPLANETS
          </button>
        </section>

        <div className="h-10 shrink-0 sm:h-14" aria-hidden="true" />
      </div>
    </div>
  );
};
