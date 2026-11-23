import React from 'react';
import type { Exoplanet } from '../../types/exoplanet';

interface HabitableZoneVisualProps {
  selectedPlanet: Exoplanet | null;
}

export const HabitableZoneVisual: React.FC<HabitableZoneVisualProps> = ({ selectedPlanet }) => {
  const flux = selectedPlanet?.stellarFluxEarth ?? null;
  const hzClassification = selectedPlanet?.hzClassification ?? 'Not Classified';
  const logMin = Math.log10(0.01);
  const logMax = Math.log10(1000000);
  const getPositionPercent = (value: number) => {
    const clamped = Math.max(0.01, Math.min(1000000, value));
    return 100 - ((Math.log10(clamped) - logMin) / (logMax - logMin)) * 100;
  };
  const planetPositionPct = flux !== null && flux > 0 ? getPositionPercent(flux) : null;
  const conservativeInner = selectedPlanet?.hzInnerFluxConservative;
  const conservativeOuter = selectedPlanet?.hzOuterFluxConservative;
  const optimisticInner = selectedPlanet?.hzInnerFluxOptimistic;
  const optimisticOuter = selectedPlanet?.hzOuterFluxOptimistic;

  return (
    <div className="rounded-md border border-[#27323e]/80 bg-[#070b11]/85 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[#38bdf8]">
              ASTROPHYSICAL MODEL
            </span>
            <span className="text-[#455468]">·</span>
            <span className="font-mono text-[8px] text-[#788898]">
              BACKEND-DERIVED CLASSIFICATION
            </span>
          </div>
          <h3 className="font-['Cinzel',sans-serif] text-sm tracking-wide text-[#e8eaed]">
            STELLAR INSOLATION FLUX &amp; HZ CLASSIFICATION
          </h3>
        </div>

        {selectedPlanet && (
          <div className="flex items-center gap-2 font-mono text-[9px]">
            <span className="text-[#788898]">TARGET:</span>
            <span className="text-[#dfb15b] font-semibold">{selectedPlanet.name}</span>
            <span
              className={`rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider border ${
                hzClassification.includes('Within')
                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                  : hzClassification.includes('Inside inner')
                  ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                  : 'border-[#38bdf8]/40 text-[#38bdf8] bg-[#38bdf8]/10'
              }`}
            >
              {hzClassification}
            </span>
          </div>
        )}
      </div>

      <div className="mt-5 rounded-md border border-white/[0.04] bg-[#04070d]/90 p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[8px] uppercase tracking-wider text-[#788898]">Selected target</p>
            <p className="mt-1 break-words font-mono text-[10px] text-[#dfb15b]">{selectedPlanet?.name ?? 'None selected'}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-[8px] text-[#788898]">Host star</p>
            <p className="mt-1 max-w-36 break-words font-mono text-[9px] text-[#b9c5d0]">{selectedPlanet?.hostStar ?? 'Not available'}</p>
          </div>
        </div>

        <p className="mb-2 font-mono text-[8px] text-[#788898]">
          Stellar flux axis: lower insolation to the right, higher insolation to the left (F⊕).
        </p>
        <div className="relative h-16">
          <div className="absolute inset-x-0 top-8 h-2 rounded-full bg-gradient-to-r from-amber-500/60 via-emerald-500/45 to-sky-400/50" />
          {planetPositionPct !== null && (
            <div
              className="absolute top-6 z-10 -translate-x-1/2"
              style={{ left: `${planetPositionPct}%` }}
              aria-label={`${selectedPlanet?.name}: ${flux?.toFixed(2)} Earth flux`}
            >
              <span className="block h-5 w-5 rounded-full border-2 border-[#f5dfa8] bg-[#dfb15b] shadow-[0_0_14px_rgba(223,177,91,0.65)]" />
            </div>
          )}
        </div>
        <div className="flex justify-between gap-2 font-mono text-[8px] text-[#788898]">
          <span>Higher F⊕</span>
          <span className="text-center">Stellar insolation (F⊕)</span>
          <span className="text-right">Lower F⊕</span>
        </div>
        {planetPositionPct !== null && (
          <p className="mt-3 text-center font-mono text-[9px] text-[#dfb15b]">
            {selectedPlanet?.name}: {flux?.toFixed(3)} F⊕
          </p>
        )}
        {planetPositionPct === null && (
          <p className="mt-3 rounded border border-white/[0.08] px-3 py-2 text-center text-xs text-[#9ba5b1]">
            Stellar insolation unavailable for this target.
          </p>
        )}
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        <div className="rounded border border-white/[0.06] bg-[#070d16] p-3">
          <p className="font-mono text-[8px] uppercase text-[#788898]">Conservative HZ flux</p>
          <p className="mt-1 text-xs text-[#dce3e9]">
            {conservativeInner != null && conservativeOuter != null
              ? `${conservativeInner.toFixed(3)}–${conservativeOuter.toFixed(3)} F⊕`
              : 'Not available'}
          </p>
        </div>
        <div className="rounded border border-white/[0.06] bg-[#070d16] p-3">
          <p className="font-mono text-[8px] uppercase text-[#788898]">Optimistic HZ flux</p>
          <p className="mt-1 text-xs text-[#dce3e9]">
            {optimisticInner != null && optimisticOuter != null
              ? `${optimisticInner.toFixed(3)}–${optimisticOuter.toFixed(3)} F⊕`
              : 'Not available'}
          </p>
        </div>
      </div>

      {/* Astrophysical Interpretation & Caveat Notice */}
      <div className="mt-4 rounded border border-white/[0.06] bg-[#070d16] p-3 text-xs leading-relaxed text-[#9ba5b1]">
        <div className="flex items-center gap-2 mb-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-[#dfb15b]">
          <span>⚠ SCIENTIFIC PROTOCOL &amp; INTERPRETATION NOTICE</span>
        </div>
        <p className="text-[11px] text-[#a4b1be] font-light">
          This visualization plots the backend-provided stellar flux and displays its backend-derived HZ classification when available.
          HZ membership is an observational screening parameter and does <strong>not</strong> establish that an exoplanet has an atmosphere, water, or conditions supporting life.
        </p>
      </div>
    </div>
  );
};
