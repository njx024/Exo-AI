import React from 'react';
import {
  Activity,
  Atom,
  CircleDot,
  FlaskConical,
  Orbit,
  Sun,
  Trophy,
} from 'lucide-react';
import type { Exoplanet } from '../../types/exoplanet';
import type { ModelInfo } from '../../services/exoplanetService';

const formatNumber = (
  value: number | null | undefined,
  digits = 2,
  unit = '',
) => value === null || value === undefined
  ? 'Not available'
  : `${Number.isInteger(value) ? value.toString() : value.toFixed(digits)}${unit ? ` ${unit}` : ''}`;

const Metric: React.FC<{ label: string; value: React.ReactNode; accent?: boolean }> = ({
  label,
  value,
  accent = false,
}) => (
  <div className="border-b border-white/[0.06] pb-3 last:border-0 last:pb-0">
    <dt className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#71808e]">{label}</dt>
    <dd className={`mt-1.5 text-sm ${accent ? 'text-[#dfb15b]' : 'text-[#dfe5eb]'}`}>{value}</dd>
  </div>
);

const Card: React.FC<{ title: string; eyebrow: string; icon: React.ReactNode; children: React.ReactNode }> = ({
  title,
  eyebrow,
  icon,
  children,
}) => (
  <section className="rounded-md border border-[#27323e]/80 bg-[#070b11]/85 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.025)] sm:p-5">
    <div className="mb-4 flex items-start justify-between border-b border-white/[0.06] pb-3">
      <div>
        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-[#8c94a0]">{eyebrow}</p>
        <h2 className="mt-1 font-['Cinzel',sans-serif] text-sm tracking-[0.08em] text-[#e8eaed]">{title}</h2>
      </div>
      <span className="text-[#70b4d4]">{icon}</span>
    </div>
    {children}
  </section>
);

export const PlanetOverviewCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="Planetary Profile" eyebrow="Catalogue telemetry" icon={<Orbit className="h-4 w-4" />}>
    <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3">
      <Metric label="Planet radius" value={formatNumber(planet.radiusEarth, 3, 'R⊕')} accent />
      <Metric label="Equilibrium temperature" value={formatNumber(planet.equilibriumTempK, 1, 'K')} />
      <Metric label="Stellar insolation" value={formatNumber(planet.stellarFluxEarth, 3, 'S⊕')} />
      <Metric label="Orbital period" value={formatNumber(planet.orbitalPeriodDays, 4, 'days')} />
      <Metric label="Semi-major axis" value={formatNumber(planet.semiMajorAxisAU, 5, 'AU')} />
      <Metric label="Estimated mass" value={formatNumber(planet.massEarth, 3, 'M⊕')} />
      <Metric label="Transit depth" value={formatNumber(planet.transitDepthPpm, 2, 'ppm')} />
      <Metric label="Transit duration" value={formatNumber(planet.transitDurationHours, 3, 'hours')} />
      <Metric label="Impact parameter" value={formatNumber(planet.impactParameter, 4)} />
    </dl>
  </Card>
);

export const ScreeningCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="Candidate Screening" eyebrow="Rule-based priority" icon={<Trophy className="h-4 w-4" />}>
    <div className="mb-4 flex items-end justify-between">
      <div>
        <p className="font-mono text-[8px] uppercase tracking-wider text-[#71808e]">Screening score</p>
        <p className="mt-1 font-mono text-3xl text-[#dfb15b]">
          {planet.candidateScore === null || planet.candidateScore === undefined
            ? 'N/A'
            : planet.candidateScore.toFixed(2)}
        </p>
      </div>
      <span className="rounded border border-[#dfb15b]/30 bg-[#dfb15b]/10 px-2 py-1 font-mono text-[8px] uppercase tracking-wider text-[#dfb15b]">
        {planet.priority ?? 'Unscored'}
      </span>
    </div>
    <dl className="grid grid-cols-3 gap-2 border-t border-white/[0.06] pt-4">
      <Metric label="Radius weight" value="40%" />
      <Metric label="Temperature weight" value="30%" />
      <Metric label="Insolation weight" value="30%" />
    </dl>
    <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">
      A prioritization heuristic for observational follow-up. It is not an artificial-intelligence
      habitability prediction or proof that life is present.
    </p>
  </Card>
);

export const HabitableZoneCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="Kopparapu Habitable Zone" eyebrow="Conservative & optimistic boundaries" icon={<CircleDot className="h-4 w-4" />}>
    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Metric label="Conservative classification" value={planet.hzClassificationFull ?? 'Not available'} accent />
      <Metric label="Optimistic classification" value={planet.hzClassificationOptimistic ?? 'Not available'} />
      <Metric label="Conservative HZ" value={planet.inConservativeHz ? 'Inside' : 'Outside'} />
      <Metric label="Optimistic HZ" value={planet.inOptimisticHz ? 'Inside' : 'Outside'} />
      <Metric label="Inner boundary" value={formatNumber(planet.hzInnerAU, 4, 'AU')} />
      <Metric label="Outer boundary" value={formatNumber(planet.hzOuterAU, 4, 'AU')} />
    </dl>
    <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">
      Kopparapu et al. model classification based on stellar temperature and insolation.
      Missing boundaries indicate that the star is outside the model range or required data are unavailable.
      HZ membership does not establish habitability or an atmosphere.
    </p>
  </Card>
);

export const EsiCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="Earth Similarity Index" eyebrow="Physical similarity to Earth" icon={<FlaskConical className="h-4 w-4" />}>
    <div className="mb-4">
      <p className="font-mono text-[8px] uppercase tracking-wider text-[#71808e]">ESI</p>
      <p className="mt-1 font-mono text-3xl text-[#38bdf8]">
        {planet.esi === null || planet.esi === undefined ? 'N/A' : planet.esi.toFixed(4)}
      </p>
    </div>
    <dl className="grid grid-cols-2 gap-4">
      <Metric label="Radius similarity" value={planet.esiRadius === null || planet.esiRadius === undefined ? 'Not available' : planet.esiRadius.toFixed(4)} />
      <Metric label="Density similarity" value={planet.esiDensity === null || planet.esiDensity === undefined ? 'Not available' : planet.esiDensity.toFixed(4)} />
      <Metric label="Escape velocity" value={planet.esiEscapeVelocity === null || planet.esiEscapeVelocity === undefined ? 'Not available' : planet.esiEscapeVelocity.toFixed(4)} />
      <Metric label="Temperature" value={planet.esiTemperature === null || planet.esiTemperature === undefined ? 'Not available' : planet.esiTemperature.toFixed(4)} />
    </dl>
    {planet.esiMissingInputs && planet.esiMissingInputs.length > 0 && (
      <p className="mt-3 font-mono text-[9px] text-amber-300">
        Missing inputs: {planet.esiMissingInputs.join(', ')}
      </p>
    )}
    <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">
      {planet.esiInterpretation ?? 'ESI measures physical similarity to Earth. It does not measure habitability or the probability of life.'}
    </p>
  </Card>
);

export const HiteCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="HITE Assessment" eyebrow="Barnes, Meadows & Evans 2015" icon={<Atom className="h-4 w-4" />}>
    <dl className="grid grid-cols-2 gap-4">
      <Metric label="HITE H" value={planet.hiteScore === null || planet.hiteScore === undefined ? 'Not available' : planet.hiteScore.toFixed(5)} accent />
      <Metric label="HITE H′" value={planet.hiteScorePrime === null || planet.hiteScorePrime === undefined ? 'Not available' : planet.hiteScorePrime.toFixed(5)} />
      <Metric label="Rocky probability" value={planet.hiteRockyProbability === null || planet.hiteRockyProbability === undefined ? 'Not available' : planet.hiteRockyProbability.toFixed(4)} />
      <Metric label="Data completeness" value={planet.hiteDataCompleteness === null || planet.hiteDataCompleteness === undefined ? 'Not available' : `${planet.hiteDataCompleteness.toFixed(1)}%`} />
      <Metric label="Minimum eccentricity" value={formatNumber(planet.hiteEMin, 5)} />
      <Metric label="Calculation status" value={planet.hiteStatus ?? 'Not available'} />
    </dl>
    <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">
      HITE integrates habitable flux configurations across albedo and eccentricity space.
      It is a prioritization metric, not confirmation of atmosphere, water, or life.
    </p>
  </Card>
);

export const StellarCard: React.FC<{ planet: Exoplanet }> = ({ planet }) => (
  <Card title="Host Star" eyebrow="Stellar properties" icon={<Sun className="h-4 w-4" />}>
    <dl className="grid grid-cols-2 gap-4">
      <Metric label="Host catalogue" value={planet.hostStar} accent />
      <Metric label="Spectral class" value={planet.stellarSpectralClass ?? 'Not available'} />
      <Metric label="Effective temperature" value={formatNumber(planet.stellarTempK, 1, 'K')} />
      <Metric label="Stellar radius" value={formatNumber(planet.stellarRadiusSolar, 3, 'R☉')} />
      <Metric label="Stellar mass" value={formatNumber(planet.stellarMassSolar, 3, 'M☉')} />
      <Metric label="Surface gravity" value={formatNumber(planet.stellarLogg, 3, 'log g')} />
      <Metric label="Luminosity" value={formatNumber(planet.stellarLuminositySolar, 4, 'L☉')} />
      <Metric label="Kepler magnitude" value={formatNumber(planet.keplerMagnitude, 3)} />
    </dl>
    {planet.stellarSpectralDesc && (
      <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">{planet.stellarSpectralDesc}</p>
    )}
  </Card>
);

export const RandomForestCard: React.FC<{ planet: Exoplanet; model: ModelInfo | null }> = ({ planet, model }) => {
  const probabilities = planet.mlClassProbabilities ?? null;
  const isUnavailable = !planet.mlPredictedClass && (!probabilities || Object.keys(probabilities).length === 0);

  return (
    <Card title="Disposition Classification" eyebrow="Random Forest — catalogue disposition" icon={<Activity className="h-4 w-4" />}>
      {isUnavailable ? (
        <div className="rounded border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="font-mono text-[9px] uppercase tracking-wider text-amber-300">Model unavailable</p>
          <p className="mt-2 text-xs leading-relaxed text-[#93a0ad]">
            No ML disposition prediction is available for this planet.
          </p>
        </div>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-4">
            <Metric label="Predicted disposition" value={planet.mlPredictedClass ?? 'Not available'} accent />
            <Metric
              label="Held-out test accuracy"
              value={model?.test_accuracy === null || model?.test_accuracy === undefined
                ? 'Not available'
                : `${(model.test_accuracy * 100).toFixed(2)}%`}
            />
          </dl>
          {probabilities && (
            <div className="mt-5 space-y-3">
              {Object.entries(probabilities)
                .sort(([, left], [, right]) => right - left)
                .map(([label, probability]) => (
                  <div key={label}>
                    <div className="mb-1 flex justify-between font-mono text-[9px]">
                      <span className="text-[#9aa6b3]">{label}</span>
                      <span className="text-[#dfe5eb]">{(probability * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#111923]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#38bdf8] to-[#dfb15b]"
                        style={{ width: `${Math.max(0, Math.min(100, probability * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}
      <p className="mt-4 text-xs leading-relaxed text-[#93a0ad]">
        {planet.mlLimitations ?? model?.note ?? 'This model predicts catalogue disposition, not habitability or the presence of life.'}
      </p>
    </Card>
  );
};
