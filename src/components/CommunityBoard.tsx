import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Flame, MessageSquare, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORIES, PROBLEM_AREAS, SPORTS, SPORT_MAP, label } from '../data/sports';
import { useHub } from '../state/HubContext';
import type { AthleteIdea, Category, ProblemArea, Sport } from '../types';
import { timeAgo } from '../lib/storage';
import { FictionalBadge, PrincipleTag, RevealLines } from './ui';

type SortKey = 'supported' | 'recent';

export function SupportButton({ idea, size = 'md' }: { idea: AthleteIdea; size?: 'md' | 'lg' }) {
  const { toggleSupport, isSupported, supportTotal } = useHub();
  const on = isSupported(idea.id);
  const total = supportTotal(idea);
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.stopPropagation();
        toggleSupport(idea.id);
      }}
      aria-pressed={on}
      aria-label={`${on ? 'Remove support from' : 'Support'} "${idea.title}". ${total} supporters.`}
      className={`relative z-10 inline-flex items-center gap-2 border-2 font-extrabold uppercase tracking-[0.12em] transition ${
        size === 'lg' ? 'min-h-[52px] px-5 text-sm' : 'min-h-[44px] px-3 text-xs'
      } ${on ? 'border-ember bg-ember text-black' : 'border-ink bg-transparent text-ink hover:bg-ink hover:text-white'}`}
    >
      <motion.span key={on ? 'on' : 'off'} initial={{ scale: 0.4, rotate: -30 }} animate={{ scale: 1, rotate: 0 }}>
        <Flame className="h-4 w-4" fill={on ? 'currentColor' : 'none'} aria-hidden />
      </motion.span>
      <span className="relative inline-block min-w-[2.5ch] overflow-hidden text-left tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={total}
            className="block"
            initial={{ y: on ? 14 : -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: on ? -14 : 14, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {total}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="sr-only">{on ? 'Supported' : 'Support'}</span>
      <span aria-hidden className={size === 'lg' ? '' : 'hidden sm:inline'}>
        {on ? 'Supported' : 'Support'}
      </span>
    </motion.button>
  );
}

function IdeaCard({ idea, index, featured }: { idea: AthleteIdea; index: number; featured?: boolean }) {
  const { openIdea, lastSubmittedId } = useHub();
  const isNew = idea.id === lastSubmittedId;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      className={`group relative flex flex-col border-2 bg-white transition-shadow hover:shadow-[8px_8px_0_0_#0a0a0a] ${
        isNew ? 'border-ember' : 'border-ink'
      } ${featured ? 'md:col-span-2 lg:row-span-2' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-ink px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em]">
        <span className="bg-ink px-2 py-0.5 text-white">{label.sport(idea.sport)}</span>
        <span>{label.category(idea.category)}</span>
        <span className="text-black/40">/</span>
        <span>{label.problem(idea.problemArea)}</span>
        <span className="ml-auto">
          {idea.isSample ? (
            <FictionalBadge className="text-black/55" />
          ) : (
            <span className="bg-ember px-1.5 py-0.5 text-black">{isNew ? 'New · Your idea' : 'Your idea'}</span>
          )}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4 md:p-5">
        <h3 className={`font-display ${featured ? 'text-[clamp(2.5rem,4.5vw,4.5rem)]' : 'text-3xl'}`}>
          <button
            onClick={() => openIdea(idea.id)}
            className="text-left after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {idea.title}
          </button>
        </h3>
        <p className={`mt-3 text-black/70 ${featured ? 'line-clamp-4 text-lg' : 'line-clamp-3 text-sm'}`}>
          <span className="font-bold text-ink">Challenge: </span>
          {idea.challenge}
        </p>
        {featured && (
          <p className="mt-3 line-clamp-3 text-lg text-black/70">
            <span className="font-bold text-ember-deep">Innovation: </span>
            {idea.solution}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <SupportButton idea={idea} />
          <div className="flex items-center gap-3 text-xs font-bold text-black/55">
            <span className="inline-flex items-center gap-1" aria-label={`${idea.comments.length} comments`}>
              <MessageSquare className="h-4 w-4" aria-hidden /> {idea.comments.length}
            </span>
            <span>{timeAgo(idea.createdAt)}</span>
            <ArrowUpRight className="h-5 w-5 text-ink transition group-hover:rotate-45" aria-hidden />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function CommunityBoard() {
  const { ideas, supportTotal, sport } = useHub();
  const [sportF, setSportF] = useState<Sport | 'all'>('all');
  const [catF, setCatF] = useState<Category | 'all'>('all');
  const [probF, setProbF] = useState<ProblemArea | 'all'>('all');
  const [sort, setSort] = useState<SortKey>('supported');

  const list = useMemo(() => {
    const filtered = ideas.filter(
      (i) =>
        (sportF === 'all' || i.sport === sportF) &&
        (catF === 'all' || i.category === catF) &&
        (probF === 'all' || i.problemArea === probF),
    );
    return filtered.sort((a, b) =>
      sort === 'supported'
        ? supportTotal(b) - supportTotal(a) || +new Date(b.createdAt) - +new Date(a.createdAt)
        : +new Date(b.createdAt) - +new Date(a.createdAt),
    );
  }, [ideas, sportF, catF, probF, sort, supportTotal]);

  const filtersActive = sportF !== 'all' || catF !== 'all' || probF !== 'all';
  const clear = () => {
    setSportF('all');
    setCatF('all');
    setProbF('all');
  };

  const selectCls =
    'min-h-[44px] w-full appearance-none border-2 border-ink bg-white px-3 pr-8 text-sm font-bold uppercase tracking-[0.1em] text-ink';

  return (
    <section id="community" aria-labelledby="community-title" className="relative bg-bone py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <PrincipleTag principle="EVOLVE" label="Community innovation board" tone="light" />
            <RevealLines
              id="community-title"
              className="font-display text-huge mt-6"
              lines={['The future is', <span className="text-ember-deep">a team sport.</span>]}
            />
          </div>
          <p className="text-base font-medium text-black/70 lg:col-span-4">
            Explore athlete ideas, back the ones that matter to you, and add your perspective. Support is limited to one
            per idea per browser.
          </p>
        </div>

        {/* Controls */}
        <div className="mt-12 border-y-2 border-ink py-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div role="group" aria-label="Filter by sport" className="flex flex-wrap gap-2">
              {(['all', ...SPORTS.map((s) => s.id)] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSportF(s)}
                  aria-pressed={sportF === s}
                  className={`relative min-h-[40px] px-3 text-xs font-extrabold uppercase tracking-[0.15em] transition ${
                    sportF === s ? 'text-white' : 'text-ink hover:bg-black/5'
                  }`}
                >
                  {sportF === s && (
                    <motion.span layoutId="sport-filter" className="absolute inset-0 bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 35 }} />
                  )}
                  <span className="relative">
                    {s === 'all' ? 'All sports' : SPORT_MAP[s].label}
                    {s === sport && <span className="ml-1 text-ember">●</span>}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="relative">
                <label htmlFor="cat-filter" className="sr-only">
                  Filter by product category
                </label>
                <select id="cat-filter" value={catF} onChange={(e) => setCatF(e.target.value as Category | 'all')} className={selectCls}>
                  <option value="all">All products</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▼</span>
              </div>
              <div className="relative">
                <label htmlFor="prob-filter" className="sr-only">
                  Filter by problem area
                </label>
                <select id="prob-filter" value={probF} onChange={(e) => setProbF(e.target.value as ProblemArea | 'all')} className={selectCls}>
                  <option value="all">All problems</option>
                  {PROBLEM_AREAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs">▼</span>
              </div>
              <div role="group" aria-label="Sort ideas" className="col-span-2 flex border-2 border-ink">
                {(
                  [
                    ['supported', 'Most supported'],
                    ['recent', 'Most recent'],
                  ] as const
                ).map(([k, l]) => (
                  <button
                    key={k}
                    onClick={() => setSort(k)}
                    aria-pressed={sort === k}
                    className={`min-h-[40px] flex-1 whitespace-nowrap px-3 text-xs font-extrabold uppercase tracking-[0.12em] transition ${
                      sort === k ? 'bg-ember text-black' : 'bg-white hover:bg-black/5'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-black/60">
            <p aria-live="polite">
              {list.length} {list.length === 1 ? 'idea' : 'ideas'}
              {filtersActive ? ' match your filters' : ' on the board'}
            </p>
            {filtersActive && (
              <button onClick={clear} className="inline-flex min-h-[36px] items-center gap-1 text-ink hover:text-ember-deep">
                <RotateCcw className="h-3.5 w-3.5" /> Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Grid */}
        <motion.div layout className="mt-10 grid auto-rows-auto gap-5 md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {list.map((idea, i) => (
              <IdeaCard key={idea.id} idea={idea} index={i} featured={i === 0 && list.length > 2} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="mt-10 border-2 border-dashed border-ink/40 p-12 text-center">
            <p className="font-display text-4xl">No ideas here yet.</p>
            <p className="mt-2 text-black/60">Be the first — or clear the filters.</p>
            <a href="#studio" className="mt-6 inline-block bg-ink px-6 py-3 text-sm font-extrabold uppercase tracking-[0.15em] text-white hover:bg-ember hover:text-black">
              Share your idea
            </a>
          </div>
        )}

        <p className="mt-8 text-xs text-black/55">
          Ideas marked &ldquo;Fictional example&rdquo; are invented demo content for this concept prototype. They do not
          represent real athletes, real submissions or Nike data.
        </p>
      </div>
    </section>
  );
}
