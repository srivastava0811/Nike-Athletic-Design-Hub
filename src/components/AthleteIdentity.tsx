import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react';
import { SPORTS, SPORT_MAP, label, type SportSuggestion } from '../data/sports';
import { useHub } from '../state/HubContext';
import { scrollToId } from '../lib/storage';
import { Photo, PrincipleTag, RevealLines } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function AthleteIdentity() {
  const { sport, setSport, setDraft, requestStudioReset } = useHub();
  const cfg = SPORT_MAP[sport];

  const applySuggestion = (s: SportSuggestion) => {
    setDraft((d) => ({
      ...d,
      sport,
      category: s.category,
      problemArea: s.problemArea,
      challenge: d.challenge.trim() ? d.challenge : s.starter,
    }));
    requestStudioReset();
    scrollToId('studio');
  };

  return (
    <section id="identity" aria-labelledby="identity-title" className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <PrincipleTag principle="LISTEN" label="Athlete identity" />
        <RevealLines
          id="identity-title"
          className="font-display text-huge mt-6 max-w-[16ch]"
          lines={['Every athlete has a voice.', <span className="text-ember">What&rsquo;s your game?</span>]}
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Selector */}
          <div className="lg:col-span-4">
            <p id="sport-label" className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/60">
              Choose your sport
            </p>
            <div role="group" aria-labelledby="sport-label" className="flex flex-col border-t border-white/15">
              {SPORTS.map((s, idx) => {
                const active = s.id === sport;
                return (
                  <button
                    key={s.id}
                    onClick={() => setSport(s.id)}
                    aria-pressed={active}
                    className={`group relative flex items-center justify-between overflow-hidden border-b border-white/15 py-4 text-left transition-colors ${
                      active ? 'text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="sport-active-bg"
                        className="absolute inset-0 bg-ember"
                        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                      />
                    )}
                    <span className="relative flex items-baseline gap-4 pl-3">
                      <span className="text-xs font-bold tabular-nums opacity-60">0{idx + 1}</span>
                      <span className="font-display text-4xl md:text-5xl">{s.label}</span>
                    </span>
                    <span className="relative pr-3">
                      {active ? (
                        <Check className="h-6 w-6" aria-hidden />
                      ) : (
                        <ArrowUpRight className="h-6 w-6 opacity-0 transition group-hover:opacity-100" aria-hidden />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-white/50" aria-live="polite">
              Selected: <strong className="text-white">{cfg.label}</strong> — saved on this device and carried into the
              Innovation Studio.
            </p>
          </div>

          {/* Visual composition */}
          <div className="relative lg:col-span-8">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-ink-2 sm:aspect-[16/11]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={sport}
                  className="absolute inset-0"
                  initial={{ clipPath: 'inset(0 0 0 100%)', scale: 1.15 }}
                  animate={{ clipPath: 'inset(0 0 0 0%)', scale: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.8, ease: EASE }}
                >
                  <Photo
                    src={cfg.image}
                    alt={`${cfg.label} athlete in action`}
                    className="h-full w-full object-cover grayscale contrast-125"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Giant outlined sport word */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={sport + '-word'}
                  aria-hidden
                  className="text-stroke pointer-events-none absolute -right-4 top-4 font-display text-[clamp(4rem,14vw,13rem)] leading-none text-white/40"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {cfg.label}
                </motion.span>
              </AnimatePresence>

              <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={sport + '-copy'}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-ember">{cfg.kicker}</p>
                    <p className="font-display text-big mt-2">{cfg.headline}</p>
                    <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">{cfg.message}</p>
                    <p className="mt-4 text-[10px] font-bold tracking-[0.3em] text-white/50">{cfg.stat}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Personalized challenges */}
            <div className="mt-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/60">
                  Common {cfg.label.toLowerCase()} challenges — start from one
                </p>
                <button
                  onClick={() => {
                    requestStudioReset();
                    scrollToId('studio');
                  }}
                  className="group inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white hover:text-ember"
                >
                  Or start from scratch <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </button>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.ul
                  key={sport + '-sugs'}
                  className="mt-4 grid gap-3 sm:grid-cols-3"
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  variants={{ show: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
                >
                  {cfg.suggestions.map((s) => (
                    <motion.li
                      key={s.label}
                      variants={{ hidden: { opacity: 0, y: 14 }, show: { opacity: 1, y: 0 } }}
                      transition={{ duration: 0.35 }}
                    >
                      <button
                        onClick={() => applySuggestion(s)}
                        className="group flex h-full w-full flex-col justify-between gap-6 border border-white/15 bg-white/[0.03] p-4 text-left transition hover:border-ember hover:bg-ember hover:text-black"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">
                          {label.category(s.category)} · {label.problem(s.problemArea)}
                        </span>
                        <span className="flex items-end justify-between gap-3">
                          <span className="text-base font-bold leading-snug">{s.label}</span>
                          <ArrowUpRight className="h-5 w-5 shrink-0 transition group-hover:rotate-45" aria-hidden />
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
