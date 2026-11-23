import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavigation } from '../components/home/TopNavigation';

interface MethodologyProps {
  onReplayIntro: () => void;
}

const concepts = [
  {
    title: 'Planetary radius',
    definition: 'A planet’s size expressed in Earth radii (R⊕).',
    uses: 'Screening, planet-type labels, density/ESI inputs, HITE rocky probability.',
    means: 'The displayed value is available catalogue or derived information.',
    notMean: 'A radius alone does not establish composition or habitability.',
  },
  {
    title: 'Equilibrium temperature',
    definition: 'An estimated planetary temperature inferred from stellar heating and orbital context.',
    uses: 'Screening score and Random Forest inputs.',
    means: 'A reference temperature used for comparison.',
    notMean: 'It is not a measured surface temperature or weather prediction.',
  },
  {
    title: 'Stellar insolation',
    definition: 'The flux received by a planet relative to Earth (F⊕ or S⊕).',
    uses: 'Candidate screening and Kopparapu habitable-zone classification.',
    means: 'How much stellar energy reaches the planet compared with Earth.',
    notMean: 'It is not a planet’s orbital distance.',
  },
  {
    title: 'Kopparapu habitable zone',
    definition: 'A stellar-flux model boundary for conservative and optimistic habitable-zone regions.',
    uses: 'Host-star temperature and luminosity, with planetary flux placement.',
    means: 'The planet falls relative to calculated flux boundaries.',
    notMean: 'HZ membership does not prove water, an atmosphere, or life.',
  },
  {
    title: 'Earth Similarity Index',
    definition: 'A 0–1 style similarity measure comparing available planetary properties with Earth.',
    uses: 'Radius and, where available, density, escape velocity, and temperature.',
    means: 'How Earth-like listed physical properties appear.',
    notMean: 'It is not a probability of habitability or life.',
  },
  {
    title: 'HITE H and H′',
    definition: 'Prioritization outputs from the implemented HITE integration.',
    uses: 'Orbital, stellar, flux, eccentricity, and rocky-probability inputs.',
    means: 'Fraction-style model compatibility under stated assumptions.',
    notMean: 'A high or low score does not establish atmosphere, surface water, or life.',
  },
  {
    title: 'Candidate screening score',
    definition: 'A custom 0–100 follow-up heuristic.',
    uses: '40% radius, 30% equilibrium temperature, 30% stellar insolation.',
    means: 'Which catalogue candidates receive greater observational attention.',
    notMean: 'It is not a scientifically validated life or habitability probability.',
  },
  {
    title: 'Kepler disposition',
    definition: 'A catalogue classification: CONFIRMED, CANDIDATE, FALSE POSITIVE, or NOT DISPOSITIONED.',
    uses: 'The Random Forest predicts these labels from eight numerical inputs.',
    means: 'The ML classifier’s best catalogue-disposition estimate.',
    notMean: 'It is not a ML prediction of habitability or extraterrestrial life.',
  },
];

export const Methodology: React.FC<MethodologyProps> = ({ onReplayIntro }) => {
  const navigate = useNavigate();
  const handleNavigate = (view: 'home' | 'explore' | 'rankings' | 'compare' | 'visualizations') => {
    navigate(view === 'home' ? '/' : `/${view}`);
  };

  const architecture = ['Kepler catalogue', 'Data processing', 'Scientific analysis', 'Screening / ML', 'FastAPI', 'React application'];

  return (
    <div
      className="h-screen overflow-x-hidden overflow-y-auto text-[#e8eaed]"
      style={{ background: 'radial-gradient(ellipse at 78% 0%, rgba(25,57,82,.28), transparent 44%), radial-gradient(ellipse at 8% 36%, rgba(150,117,61,.07), transparent 34%), #050608' }}
    >
      <TopNavigation activeView="methodology" onNavigate={handleNavigate} onReplayIntro={onReplayIntro} />
      <main className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8 lg:px-12">
        <header className="pb-10 pt-10 sm:pb-14 sm:pt-14">
          <p className="mb-3 font-mono text-[9px] tracking-[0.26em] text-[#dfb15b]">EXO-AI / LEARNING GUIDE</p>
          <h1 className="font-['Cinzel',sans-serif] text-2xl font-light tracking-[0.12em] text-[#f3f5f7] sm:text-3xl">HOW EXO-AI WORKS</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#bbc5cf]">
            A beginner-friendly guide to the catalogue, scientific indicators, screening tools, and machine-learning output.
          </p>
        </header>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="intro-heading">
          <h2 id="intro-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">What is EXO AI?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {[
              ['What is an exoplanet?', 'An exoplanet is a planet orbiting a star outside our Solar System. Kepler records candidate worlds by detecting recurring dips in stellar brightness.'],
              ['Why thousands of candidates?', 'A large telescope survey observes many stars and produces many signals. A signal can later be confirmed, remain a candidate, or prove to be a false positive.'],
              ['What does EXO AI do?', 'It organizes 6,725 cleaned Kepler records and applies transparent scientific screening, HZ, ESI, HITE, and ML disposition models for exploration and prioritization.'],
              ['What cannot it determine?', 'The platform cannot prove atmosphere, liquid water, surface conditions, habitability, or extraterrestrial life from catalogue measurements alone.'],
            ].map(([title, text]) => (
              <article key={title} className="rounded-md border border-white/[0.08] bg-[#090d13]/80 p-5">
                <h3 className="text-sm font-medium text-[#e9edf2]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#adb8c3]">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="workflow-heading">
          <h2 id="workflow-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">How the platform works</h2>
          <div className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-6">
            {architecture.map((step, index) => (
              <React.Fragment key={step}>
                <div className="rounded-md border border-[#405167] bg-[#090d13] px-3 py-4 text-center">
                  <span className="block font-mono text-[8px] text-[#dfb15b]">0{index + 1}</span>
                  <span className="mt-2 block text-xs leading-5 text-[#dce3e9]">{step}</span>
                </div>
                {index < architecture.length - 1 && (
                  <span className="hidden md:block" aria-hidden="true" />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#aeb9c3]">
            Scientific analysis and screening serve different purposes: HZ, ESI, and HITE summarize physical or model indicators; the candidate score ranks follow-up priority; the Random Forest predicts catalogue disposition. None is a life-detection result.
          </p>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="concepts-heading">
          <h2 id="concepts-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">Scientific concepts</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {concepts.map((concept) => (
              <article key={concept.title} className="rounded-md border border-white/[0.08] bg-[#080b10]/70 p-5">
                <h3 className="text-sm font-medium text-[#83bfd6]">{concept.title}</h3>
                <dl className="mt-3 space-y-2 text-xs leading-6 text-[#bac5cf]">
                  <div><dt className="font-mono text-[8px] uppercase text-[#71818f]">Definition</dt><dd>{concept.definition}</dd></div>
                  <div><dt className="font-mono text-[8px] uppercase text-[#71818f]">Uses</dt><dd>{concept.uses}</dd></div>
                  <div><dt className="font-mono text-[8px] uppercase text-[#71818f]">What it means</dt><dd>{concept.means}</dd></div>
                  <div><dt className="font-mono text-[8px] uppercase text-[#71818f]">What it does not mean</dt><dd>{concept.notMean}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="ranking-heading">
          <h2 id="ranking-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">How planets are ranked</h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-[#b3bec8]">
            The existing candidate score combines normalized planetary-radius, equilibrium-temperature, and stellar-insolation components:
          </p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[['40%', 'Radius'], ['30%', 'Temperature'], ['30%', 'Insolation']].map(([value, label]) => (
              <div key={label} className="rounded-md border border-[#dfb15b]/20 bg-[#0a0d12] p-3 text-center">
                <p className="text-lg text-[#dfb15b]">{value}</p>
                <p className="mt-1 text-xs text-[#bbc5cf]">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm leading-7 text-[#98a5b1]">This is an application-specific heuristic, not a validated probability of life or habitability.</p>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="ml-heading">
          <h2 id="ml-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">Random Forest methodology</h2>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div className="text-sm leading-7 text-[#b3bec8]">
              <p>Random Forest combines many decision trees and uses their majority/aggregate classification to predict one of four Kepler disposition labels.</p>
              <p className="mt-3">Features: planet radius, equilibrium temperature, stellar insolation, orbital period, semi-major axis, stellar effective temperature, stellar radius, and stellar mass.</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 rounded-md border border-white/[0.08] bg-[#090d13] p-4">
              <div><dt className="text-[10px] text-[#8f9daa]">Test accuracy</dt><dd className="mt-1 text-lg text-[#edf1f4]">57.03%</dd></div>
              <div><dt className="text-[10px] text-[#8f9daa]">Trees</dt><dd className="mt-1 text-lg text-[#edf1f4]">200</dd></div>
              <div><dt className="text-[10px] text-[#8f9daa]">Training</dt><dd className="mt-1 text-lg text-[#edf1f4]">5,380</dd></div>
              <div><dt className="text-[10px] text-[#8f9daa]">Test</dt><dd className="mt-1 text-lg text-[#edf1f4]">1,345</dd></div>
            </dl>
          </div>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="guide-heading">
          <h2 id="guide-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">Website user guide</h2>
          <ol className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['Search', 'Use the homepage catalogue search by planet name or host star.'],
              ['Explore', 'Open Explorer and combine search, radius, distance, temperature, flux, and type filters.'],
              ['Rank', 'Review live heuristic rankings and filter by HZ, temperature, type, or disposition.'],
              ['Inspect', 'Open Planet Details for HZ, ESI, HITE, stellar, screening, and ML fields.'],
              ['Compare', 'Select up to three real planets for side-by-side comparison.'],
              ['Visualize', 'Use the observatory scatter plots, distributions, HZ diagram, and HITE profile.'],
            ].map(([title, text], index) => (
              <li key={title} className="flex gap-3 rounded-md border border-white/[0.08] p-4">
                <span className="font-mono text-[9px] text-[#dfb15b]">0{index + 1}</span>
                <div><h3 className="text-sm text-[#e7ecf1]">{title}</h3><p className="mt-1 text-xs leading-6 text-[#9fabb7]">{text}</p></div>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t border-white/[0.10] py-8" aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="font-['Cinzel',sans-serif] text-lg tracking-[0.08em]">Scientific limitations</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-[#aeb9c4] sm:grid-cols-2">
            {[
              'Missing observations remain unavailable rather than being replaced with zero.',
              'Estimated mass and derived values are not direct confirmations.',
              'Catalogue bias and measurement uncertainty affect all derived displays.',
              'Scientific models rely on assumptions and do not include every atmospheric or geological factor.',
              'No HZ, ESI, HITE, screening, or ML result proves extraterrestrial life.',
              'Independent scientific validation is outside the scope of the application.',
            ].map((item) => <li key={item} className="rounded border border-white/[0.07] px-4 py-3">{item}</li>)}
          </ul>
        </section>
      </main>
    </div>
  );
};
