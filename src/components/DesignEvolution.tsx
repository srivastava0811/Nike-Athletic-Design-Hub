import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, FlaskConical, Lightbulb, PencilRuler, Timer, Users } from 'lucide-react';
import { useRef, useState, type KeyboardEvent } from 'react';
import { label } from '../data/sports';
import { useHub } from '../state/HubContext';
import type { AthleteIdea } from '../types';
import { PrincipleTag, RevealLines } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;

const STAGES = [
  {
    title: 'Idea submitted',
    icon: Lightbulb,
    summary: 'An athlete turns a real frustration into a concrete proposal.',
    body: 'It starts on the field, not in the boardroom. An athlete describes what went wrong and how they would fix it — in their own words, with no design jargon required.',
    athlete: ['Describes a real problem from training or competition', 'Proposes a solution', 'Tags sport, product type and problem area'],
    forIdea: (i: AthleteIdea) =>
      `"${i.title}" enters the hub as a ${label.category(i.category).toLowerCase()} idea focused on ${label.problem(i.problemArea).toLowerCase()} for ${label.sport(i.sport).toLowerCase()}.`,
  },
  {
    title: 'Community feedback',
    icon: Users,
    summary: 'Other athletes validate, challenge and sharpen the idea.',
    body: 'The community signals what resonates. Support shows how widely a problem is shared; discussion adds edge cases the original athlete may not have experienced.',
    athlete: ['Support ideas that match their own experience', 'Add constructive comments and variations', 'Surface needs across body types and abilities'],
    forIdea: (i: AthleteIdea, support: number) =>
      `On this device, "${i.title}" currently shows ${support} supporters and ${i.comments.length} comment${i.comments.length === 1 ? '' : 's'}. In a full platform, these signals would help prioritise which challenges to explore.`,
  },
  {
    title: 'Design exploration',
    icon: PencilRuler,
    summary: 'Designers explore directions — with athletes in the room.',
    body: 'In this concept, designers would translate highly supported insights into sketches, material studies and early directions, sharing them back with the athletes who raised the problem.',
    athlete: ['Join co-design sessions', 'React to sketches and material swatches', 'Point out what would — and wouldn\u2019t — work in real play'],
    forIdea: (i: AthleteIdea) =>
      `Hypothetically, designers might explore several ${label.category(i.category).toLowerCase()} directions that address the ${label.problem(i.problemArea).toLowerCase()} challenge described in "${i.title}".`,
  },
  {
    title: 'Prototype concept',
    icon: FlaskConical,
    summary: 'Ideas become tangible early concepts.',
    body: 'Promising directions could become rough prototypes. Athletes would see how their input shaped the concept, closing the loop between suggestion and object.',
    athlete: ['Review early concepts', 'Compare options against their original problem', 'Help decide what to test first'],
    forIdea: (i: AthleteIdea) =>
      `An illustrative prototype stage for "${i.title}" would focus on proving the core idea: ${i.solution.slice(0, 110)}${i.solution.length > 110 ? '…' : ''}`,
  },
  {
    title: 'Athlete testing',
    icon: Timer,
    summary: 'Athletes put concepts to work in real conditions.',
    body: 'The people who raised the problem would be among the first to test the response — in real sessions, real weather and real competition — and their feedback would feed the next round.',
    athlete: ['Wear-test in real training', 'Report what changed, what didn\u2019t', 'Feed results back to the community'],
    forIdea: (i: AthleteIdea) =>
      `In this illustration, ${label.sport(i.sport).toLowerCase()} athletes would test whether the concept actually solves: "${i.challenge.slice(0, 90)}${i.challenge.length > 90 ? '…' : ''}"`,
  },
];

export default function DesignEvolution() {
  const { ideas, journeyIdeaId, setJourneyIdeaId, supportTotal } = useHub();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const idea = journeyIdeaId ? ideas.find((i) => i.id === journeyIdeaId) : undefined;
  const stage = STAGES[active];

  const select = (i: number) => {
    const n = (i + STAGES.length) % STAGES.length;
    setActive(n);
    tabRefs.current[n]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      select(active + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      select(active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(STAGES.length - 1);
    }
  };

  return (
    <section id="evolution" aria-labelledby="evolution-title" className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <PrincipleTag principle="EVOLVE" label="Design evolution" />
            <RevealLines
              id="evolution-title"
              className="font-display text-huge mt-6"
              lines={['From your experience', <span className="text-ember">to what&rsquo;s next.</span>]}
            />
          </div>
          <div className="lg:col-span-4">
            <label htmlFor="journey-idea" className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">
              Trace an idea&rsquo;s hypothetical journey
            </label>
            <select
              id="journey-idea"
              value={journeyIdeaId ?? ''}
              onChange={(e) => setJourneyIdeaId(e.target.value || null)}
              className="mt-2 min-h-[48px] w-full border-2 border-white/30 bg-ink px-3 text-sm font-bold text-white focus:border-ember"
            >
              <option value="">General process (no idea selected)</option>
              {ideas.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.isSample ? '[Fictional] ' : '[Yours] '}
                  {i.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stage track */}
        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-6 hidden h-[2px] bg-white/15 md:block" />
          <motion.div
            className="absolute left-0 top-6 hidden h-[2px] bg-ember md:block"
            animate={{ width: `${(active / (STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 0.6, ease: EASE }}
          />
          <div
            role="tablist"
            aria-label="Design evolution stages"
            onKeyDown={onKey}
            className="relative grid grid-cols-5 gap-1 md:gap-4"
          >
            {STAGES.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={s.title}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  role="tab"
                  id={`stage-tab-${i}`}
                  aria-selected={on}
                  aria-controls="stage-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="group flex flex-col items-center gap-3 text-center md:items-start md:text-left"
                >
                  <span
                    className={`relative grid h-12 w-12 place-items-center transition-colors duration-300 ${
                      on ? 'bg-ember text-black' : done ? 'bg-white text-black' : 'border-2 border-white/25 bg-ink text-white/70 group-hover:border-white'
                    }`}
                  >
                    <s.icon className="h-5 w-5" aria-hidden />
                    {on && (
                      <motion.span
                        layoutId="stage-ring"
                        className="absolute -inset-2 border-2 border-ember"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </span>
                  <span className={`hidden text-xs font-bold tracking-[0.2em] sm:block ${on ? 'text-ember' : 'text-white/50'}`}>0{i + 1}</span>
                  <span
                    className={`font-display hidden text-xl leading-none transition-colors sm:block md:text-3xl ${
                      on ? 'text-white' : 'text-white/45 group-hover:text-white/80'
                    }`}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div
          id="stage-panel"
          role="tabpanel"
          aria-labelledby={`stage-tab-${active}`}
          className="relative mt-12 min-h-[420px] overflow-hidden border border-white/15 bg-ink-2"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid gap-8 p-6 md:p-10 lg:grid-cols-12"
            >
              <motion.span
                aria-hidden
                className="text-stroke pointer-events-none absolute -bottom-10 -right-4 font-display text-[clamp(10rem,26vw,24rem)] leading-none text-white/10"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                0{active + 1}
              </motion.span>

              <div className="relative lg:col-span-7">
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="text-[11px] font-bold uppercase tracking-[0.3em] text-ember"
                >
                  Stage 0{active + 1} of 05
                </motion.p>
                <motion.h3
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="font-display mt-3 text-big"
                >
                  {stage.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mt-4 text-xl font-bold text-white"
                >
                  {stage.summary}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.5 }}
                  className="mt-3 max-w-xl text-base leading-relaxed text-white/70"
                >
                  {stage.body}
                </motion.p>

                {idea && (
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.26, duration: 0.5 }}
                    className="mt-6 border-l-4 border-ember bg-white/[0.04] p-4"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-ember">
                      Hypothetical journey · {idea.isSample ? 'fictional example' : 'your idea'}
                    </p>
                    <p className="mt-2 text-base text-white/90">{stage.forIdea(idea, supportTotal(idea))}</p>
                  </motion.div>
                )}
              </div>

              <div className="relative lg:col-span-5">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-white/60">What athletes do here</p>
                <ul className="mt-4 flex flex-col">
                  {stage.athlete.map((a, i) => (
                    <motion.li
                      key={a}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: EASE }}
                      className="flex items-start gap-4 border-b border-white/10 py-4"
                    >
                      <span className="font-display text-2xl text-ember">{String(i + 1).padStart(2, '0')}</span>
                      <span className="pt-1 text-base font-semibold">{a}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setActive((a) => Math.max(0, a - 1))}
                    disabled={active === 0}
                    aria-label="Previous stage"
                    className="grid h-12 w-12 place-items-center border-2 border-white/30 transition hover:border-white disabled:opacity-30"
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    onClick={() => setActive((a) => Math.min(STAGES.length - 1, a + 1))}
                    disabled={active === STAGES.length - 1}
                    aria-label="Next stage"
                    className="grid h-12 w-12 place-items-center bg-white text-black transition hover:bg-ember disabled:opacity-30"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="mt-6 max-w-3xl text-xs text-white/50">
          Illustrative concept only. This journey shows how athlete participation <em>could</em> work in a future
          platform. It does not mean any idea shown here has been reviewed, approved or developed by Nike.
        </p>
      </div>
    </section>
  );
}

