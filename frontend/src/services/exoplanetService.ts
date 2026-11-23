import { demoExoplanets } from '../data/demoExoplanets';
import type { Exoplanet } from '../types/exoplanet';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';
let catalogCache: Promise<Exoplanet[]> | null = null;
let rankingsCache: Promise<Exoplanet[]> | null = null;
let modelInfoCache: Promise<ModelInfo> | null = null;

export interface GetExoplanetsOptions {
  useDemo?: boolean;
}

// ─────────────────────────────────────────────
// HITE types (Barnes, Meadows & Evans 2015)
// ─────────────────────────────────────────────

export interface HitePlanetRecord {
  id: string;
  name: string;
  disposition: string | null;
  hiteScore: number | null;
  hiteScorePrime: number | null;
  hiteCalcType: string | null;
  hiteRockyProbability: number | null;
  hiteStatus: string | null;
  hiteDataCompleteness: number | null;
  hiteEMin: number | null;
  hiteFMin: number | null;
  hiteFMax: number | null;
  radiusEarth: number | null;
  massEarth: number | null;
  stellarLuminositySolar: number | null;
  semiMajorAxisAU: number | null;
  transitDepthPpm: number | null;
  transitDurationHours: number | null;
  impactParameter: number | null;
  stellarRadiusSolar: number | null;
  stellarTempK: number | null;
  orbitalPeriodDays: number | null;
}

export interface HiteDistribution {
  buckets: number[];
  labels: string[];
}

export interface HiteStats {
  totalPlanets: number;
  calculated: number;
  withHScore: number;
  positiveHScore: number;
  insufficientData: number;
  averageHiteH: number | null;
  averageHiteHPrime: number | null;
  averageRockyProbability: number | null;
  averageDataCompleteness: number | null;
  hScoreDistribution: HiteDistribution;
  rockyProbabilityDistribution: HiteDistribution;
  completenessDistribution: HiteDistribution;
  topCandidates: HitePlanetRecord[];
  reference: string;
}

export interface ModelInfo {
  trained: boolean;
  algorithm?: string;
  n_estimators?: number;
  features?: string[];
  feature_labels?: Record<string, string>;
  classes?: string[];
  test_accuracy?: number | null;
  n_train_samples?: number;
  n_test_samples?: number;
  feature_importances?: Record<string, number>;
  classification_report?: Record<string, unknown>;
  explanation_method?: string;
  note?: string;
  reference?: string;
  error?: string;
}

export class PlanetApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'PlanetApiError';
    this.status = status;
  }
}

/**
 * Fetch Kepler catalog records from the FastAPI backend.
 * Explicitly falls back to demoExoplanets only when options.useDemo is true.
 * Throws on network/API failure so callers can display the error state.
 */
export async function getExoplanets(options?: GetExoplanetsOptions): Promise<Exoplanet[]> {
  if (options?.useDemo) {
    return demoExoplanets;
  }
  if (!catalogCache) {
    catalogCache = fetch(`${API_BASE_URL}/api/v1/planets`).then(async (response) => {
      if (!response.ok) {
        catalogCache = null;
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<Exoplanet[]>;
    });
  }
  return catalogCache;
}

/**
 * Fetch Kepler candidates sorted by candidate screening score descending.
 * Explicitly falls back to demoExoplanets only when options.useDemo is true.
 */
export async function getRankings(options?: GetExoplanetsOptions): Promise<Exoplanet[]> {
  if (options?.useDemo) {
    return demoExoplanets;
  }
  if (!rankingsCache) {
    rankingsCache = fetch(`${API_BASE_URL}/api/v1/rankings`).then(async (response) => {
      if (!response.ok) {
        rankingsCache = null;
        throw new Error(`API error ${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<Exoplanet[]>;
    });
  }
  return rankingsCache;
}

export async function getPlanet(planetId: string): Promise<Exoplanet> {
  const response = await fetch(`${API_BASE_URL}/api/v1/planet/${encodeURIComponent(planetId)}`);
  if (!response.ok) {
    let message = `Planet API error ${response.status}: ${response.statusText}`;
    try {
      const body = await response.json();
      if (typeof body.detail === 'string') message = body.detail;
    } catch {
      // Preserve the HTTP status-based message for non-JSON responses.
    }
    throw new PlanetApiError(response.status, message);
  }
  return response.json();
}

export async function getModelInfo(): Promise<ModelInfo> {
  if (!modelInfoCache) {
    modelInfoCache = fetch(`${API_BASE_URL}/api/v1/model/info`).then(async (response) => {
      if (!response.ok) {
        modelInfoCache = null;
        throw new Error(`Model info API error ${response.status}: ${response.statusText}`);
      }
      return response.json() as Promise<ModelInfo>;
    });
  }
  return modelInfoCache;
}

/**
 * Fetch HITE results for all planets.
 * Returns lightweight records with HITE scores, status, and key inputs.
 */
export async function getHiteAll(): Promise<{ count: number; planets: HitePlanetRecord[]; reference: string }> {
  const response = await fetch(`${API_BASE_URL}/api/v1/hite`);
  if (!response.ok) {
    throw new Error(`HITE API error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch HITE dataset-level statistics and distribution data.
 */
export async function getHiteStats(): Promise<HiteStats> {
  const response = await fetch(`${API_BASE_URL}/api/v1/hite/stats`);
  if (!response.ok) {
    throw new Error(`HITE stats API error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Fetch the full HITE record for a single planet by its kepoi_name.
 */
export async function getHitePlanet(planetName: string): Promise<HitePlanetRecord> {
  const response = await fetch(`${API_BASE_URL}/api/v1/hite/${encodeURIComponent(planetName)}`);
  if (!response.ok) {
    throw new Error(`HITE planet API error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}
