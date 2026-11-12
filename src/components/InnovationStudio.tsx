import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, Check, Eye, Pencil, Plus, Send, TriangleAlert } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { CATEGORIES, PROBLEM_AREAS, SPORTS, label } from '../data/sports';
import { emptyDraft, useHub } from '../state/HubContext';
import type { AthleteIdea, IdeaDraft } from '../types';
import { scrollToId } from '../lib/storage';
import { PrincipleTag, RevealLines } from './ui';

const EASE = [0.16, 1, 0.3, 1] as const;
const STEPS = ['Challenge', 'Experience', 'Innovation', 'Review'] as const;
const LIMITS = { challenge: [20, 600], solution: [20, 600], title: [4, 60] } as const;

type Errors = Partial<Record<'category' | 'problemArea' | 'challenge' | 'solution' | 'title', string>>;

function validateStep(step: number, d: IdeaDraft): Errors {
  const e: Errors = {};
  if (step === 0) {
    if (!d.category) e.category = 'Pick the product type that needs to change.';
    if (!d.problemArea) e.problemArea = 'Pick the problem area.';
  }
  if (step === 1) {
    const n = d.challenge.trim().length;
    if (n < LIMITS.challenge[0]) e.challenge = `Tell us a bit more — at least ${LIMITS.challenge[0]} characters (${n} so far).`;
  }
  if (step === 2) {
    const t = d.title.trim().length;
    if (t < LIMITS.title[0]) e.title = `Give your idea a short name (at least ${LIMITS.title[0]} characters).`;
    const n = d.solution.trim().length;
    if (n < LIMITS.solution[0]) e.solution = `Describe your fix in at least ${LIMITS.solution[0]} characters (${n} so far).`;
  }
  return e;
}

export default function InnovationStudio() {
  const { draft, setDraft, sport, setSport, submitIdea, studioStepRequest, openIdea } = useHub();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<AthleteIdea | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  // External requests (e.g. a suggestion chip in Athlete Identity) jump into the flow.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSubmitted(null);
    setErrors({});
    setDir(1);
    setStep(draft.category && draft.problemArea ? 1 : 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studioStepRequest]);

  const update = <K extends keyof IdeaDraft>(k: K, v: IdeaDraft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    if (errors[k as keyof Errors]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const focusFirstError = (e: Errors) => {
    requestAnimationFrame(() => {
      const key = Object.keys(e)[0];
      if (!key) return;
      const el = panelRef.current?.querySelector<HTMLElement>(`[data-field="${key}"]`);
      el?.focus();
    });
  };

  const goTo = (target: number) => {
    setDir(target > step ? 1 : -1);
    setErrors({});
    setStep(target);
    requestAnimationFrame(() => panelRef.current?.querySelector<HTMLElement>('h3')?.focus());
  };

  const next = () => {
    const e = validateStep(step, draft);
    if (Object.keys(e).length) {
      setErrors(e);
      focusFirstError(e);
      return;
    }
    goTo(Math.min(step + 1, 3));
  };

  const submit = () => {
    for (let s = 0; s < 3; s++) {
      const e = validateStep(s, draft);
      if (Object.keys(e).length) {
        setDir(-1);
        setStep(s);
        setErrors(e);
        focusFirstError(e);
        return;
      }
    }
    const idea = submitIdea(draft);
    setSubmitted(idea);
  };

  const reset = () => {
    setDraft(emptyDraft(sport));
    setSubmitted(null);
    setErrors({});
    setDir(-1);
    setStep(0);
  };

  const viewIdea = () => {
    if (!submitted) return;
    scrollToId('community');
    setTimeout(() => openIdea(submitted.id), 450);
  };

  const sportCfg = SPORTS.find((s) => s.id === draft.sport)!;

  return (
    <section id="studio" aria-labelledby="studio-title" className="relative bg-ink py-24 md:py-32">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-10 lg:grid-cols-12">
        {/* Left rail */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <PrincipleTag principle="CREATE" label="Athlete Innovation Studio" />
            <RevealLines
              id="studio-title"
              className="font-display text-huge mt-6"
              lines={['You know the game.', <span className="text-ember">Help design</span>, <span className="text-ember">what&rsquo;s next.</span>]}
            />
            <p className="mt-6 max-w-md text-base text-white/70">
              Four quick steps. No account. Your idea is saved on this device and posted to the community board
              instantly.
            </p>

            <div className="mt-8">
              <p id="studio-sport" className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60">
                Designing for
              </p>
              <div role="group" aria-labelledby="studio-sport" className="mt-3 flex flex-wrap gap-2">
                {SPORTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSport(s.id)}
                    aria-pressed={draft.sport === s.id}
                    disabled={!!submitted}
                    className={`min-h-[40px] border px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] transition disabled:opacity-40 ${
                      draft.sport === s.id
                        ? 'border-ember bg-ember text-black'
                        : 'border-white/25 text-white/80 hover:border-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress */}
            <ol className="mt-10 hidden flex-col gap-1 lg:flex" aria-label="Submission progress">
              {STEPS.map((s, i) => {
                const state = submitted ? 'done' : i < step ? 'done' : i === step ? 'current' : 'todo';
                return (
                  <li key={s} aria-current={state === 'current' ? 'step' : undefined} className="flex items-center gap-4">
                    <span
                      className={`grid h-9 w-9 place-items-center text-sm font-extrabold transition-colors ${
                        state === 'done'
                          ? 'bg-white text-black'
                          : state === 'current'
                            ? 'bg-ember text-black'
                            : 'border border-white/25 text-white/50'
                      }`}
                    >
                      {state === 'done' ? <Check className="h-4 w-4" /> : i + 1}
                    </span>
                    <span
                      className={`font-display text-3xl transition-colors ${
                        state === 'todo' ? 'text-white/30' : 'text-white'
                      }`}
                    >
                      {s}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        {/* Form panel */}
        <div className="lg:col-span-7">
          <div ref={panelRef} className="relative overflow-hidden bg-bone text-ink">
            {/* progress bar */}
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4 md:px-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/60">
                {submitted ? 'Submitted' : `Step ${step + 1} of 4 — ${STEPS[step]}`}
              </p>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/60">{sportCfg.label}</p>
            </div>
            <div
              className="h-1 bg-black/10"
              role="progressbar"
              aria-label="Submission progress"
              aria-valuemin={1}
              aria-valuemax={4}
              aria-valuenow={submitted ? 4 : step + 1}
            >
              <motion.div
                className="h-full bg-ember"
                animate={{ width: submitted ? '100%' : `${((step + 1) / 4) * 100}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>

            <div className="relative min-h-[520px] p-5 md:p-10">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                {submitted ? (
                  <Success key="success" idea={submitted} onView={viewIdea} onAnother={reset} />
                ) : (
                  <motion.div
                    key={step}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ x: d * 60, opacity: 0 }),
                      center: { x: 0, opacity: 1 },
                      exit: (d: number) => ({ x: d * -60, opacity: 0 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.4, ease: EASE }}
                  >
                    {step === 0 && (
                      <StepShell title="What needs to change?" kicker="Step 1 · Identify the challenge">
                        <fieldset aria-describedby={errors.category ? 'err-category' : undefined}>
                          <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-black/70">
                            Product type <span className="text-ember-deep">*</span>
                          </legend>
                          <div className="grid gap-3 sm:grid-cols-3">
                            {CATEGORIES.map((c, i) => (
                              <Tile
                                key={c.id}
                                name="category"
                                checked={draft.category === c.id}
                                onChange={() => update('category', c.id)}
                                dataField={i === 0 ? 'category' : undefined}
                                invalid={!!errors.category}
                              >
                                <span className="font-display text-3xl">{c.label}</span>
                                <span className="mt-1 block text-xs opacity-70">{c.blurb}</span>
                              </Tile>
                            ))}
                          </div>
                          <FieldError id="err-category" msg={errors.category} />
                        </fieldset>

                        <fieldset className="mt-8" aria-describedby={errors.problemArea ? 'err-problem' : undefined}>
                          <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-black/70">
                            Problem area <span className="text-ember-deep">*</span>
                          </legend>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {PROBLEM_AREAS.map((p, i) => (
                              <Tile
                                key={p.id}
                                name="problemArea"
                                compact
                                checked={draft.problemArea === p.id}
                                onChange={() => update('problemArea', p.id)}
                                dataField={i === 0 ? 'problemArea' : undefined}
                                invalid={!!errors.problemArea}
                              >
                                <span className="text-sm font-extrabold uppercase tracking-[0.12em]">{p.label}</span>
                              </Tile>
                            ))}
                          </div>
                          <FieldError id="err-problem" msg={errors.problemArea} />
                        </fieldset>
                      </StepShell>
                    )}

                    {step === 1 && (
                      <StepShell title="What have you experienced?" kicker="Step 2 · Share your experience">
                        <TextArea
                          id="challenge"
                          label={`Describe a real problem you've hit in ${sportCfg.label.toLowerCase()}`}
                          hint="When does it happen? How does it affect your performance or comfort?"
                          value={draft.challenge}
                          onChange={(v) => update('challenge', v)}
                          max={LIMITS.challenge[1]}
                          error={errors.challenge}
                          placeholder="e.g. Around the 15 km mark my shoes start rubbing on the outside of my little toe…"
                        />
                      </StepShell>
                    )}

                    {step === 2 && (
                      <StepShell title="How would you improve it?" kicker="Step 3 · Propose an innovation">
                        <div className="mb-6">
                          <label htmlFor="title" className="mb-2 block text-xs font-bold uppercase tracking-[0.2em] text-black/70">
                            Name your idea <span className="text-ember-deep">*</span>
                          </label>
                          <input
                            id="title"
                            data-field="title"
                            value={draft.title}
                            maxLength={LIMITS.title[1]}
                            onChange={(e) => update('title', e.target.value)}
                            aria-invalid={!!errors.title}
                            aria-describedby={errors.title ? 'err-title' : undefined}
                            placeholder="e.g. Adaptive toe-box upper"
                            className={`w-full border-2 bg-white px-4 py-3 text-lg font-bold outline-none transition focus:border-ink ${
                              errors.title ? 'border-red-600' : 'border-black/15'
                            }`}
                          />
                          <FieldError id="err-title" msg={errors.title} />
                        </div>
                        <TextArea
                          id="solution"
                          label="Your proposed innovation"
                          hint="Think materials, fit, features, sizing, sustainability — whatever would fix it for you."
                          value={draft.solution}
                          onChange={(v) => update('solution', v)}
                          max={LIMITS.solution[1]}
                          error={errors.solution}
                          placeholder="e.g. A stretch zone in the forefoot that expands as the foot swells…"
                        />
                      </StepShell>
                    )}

                    {step === 3 && (
                      <StepShell title="Review & submit" kicker="Step 4 · Your idea at a glance">
                        <div className="border-2 border-ink bg-white">
                          <div className="flex flex-wrap items-center gap-2 bg-ink px-4 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
                            <span className="bg-ember px-2 py-0.5 text-black">{label.sport(draft.sport)}</span>
                            <span>{draft.category && label.category(draft.category)}</span>
                            <span className="text-white/50">/</span>
                            <span>{draft.problemArea && label.problem(draft.problemArea)}</span>
                            <EditBtn onClick={() => goTo(0)} label="Edit challenge type" dark />
                          </div>
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-display text-4xl">{draft.title || 'Untitled idea'}</p>
                              <EditBtn onClick={() => goTo(2)} label="Edit idea name" />
                            </div>
                            <ReviewBlock title="The challenge" onEdit={() => goTo(1)}>
                              {draft.challenge}
                            </ReviewBlock>
                            <ReviewBlock title="The innovation" onEdit={() => goTo(2)}>
                              {draft.solution}
                            </ReviewBlock>
                          </div>
                        </div>
                        <p className="mt-4 text-xs text-black/60">
                          Prototype note: submissions are stored only in this browser&rsquo;s local storage and shown on
                          the community board. They are not sent to or reviewed by Nike.
                        </p>
                      </StepShell>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!submitted && (
              <div className="flex items-center justify-between gap-3 border-t border-black/10 px-5 py-4 md:px-8">
                <button
                  onClick={() => goTo(step - 1)}
                  disabled={step === 0}
                  className="inline-flex min-h-[48px] items-center gap-2 px-3 text-sm font-extrabold uppercase tracking-[0.15em] transition hover:text-ember-deep disabled:pointer-events-none disabled:opacity-30"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                {step < 3 ? (
                  <button
                    onClick={next}
                    className="group inline-flex min-h-[48px] items-center gap-3 bg-ink px-6 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-ember hover:text-black"
                  >
                    Next <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    onClick={submit}
                    className="group inline-flex min-h-[48px] items-center gap-3 bg-ember px-6 text-sm font-extrabold uppercase tracking-[0.15em] text-black transition hover:bg-ink hover:text-white"
                  >
                    Submit idea <Send className="h-4 w-4 transition group-hover:translate-x-1" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function StepShell({ title, kicker, children }: { title: string; kicker: string; children: ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ember-deep">{kicker}</p>
      <h3 tabIndex={-1} className="font-display mb-8 mt-2 text-[clamp(2.4rem,5vw,4rem)] outline-none">
        {title}
      </h3>
      {children}
    </div>
  );
}

function Tile({
  name,
  checked,
  onChange,
  children,
  compact,
  dataField,
  invalid,
}: {
  name: string;
  checked: boolean;
  onChange: () => void;
  children: ReactNode;
  compact?: boolean;
  dataField?: string;
  invalid?: boolean;
}) {
  return (
    <label
      className={`relative block cursor-pointer border-2 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ember ${
        compact ? 'px-3 py-3' : 'p-4'
      } ${
        checked
          ? 'border-ink bg-ink text-white'
          : invalid
            ? 'border-red-600/60 bg-white hover:border-ink'
            : 'border-black/15 bg-white hover:border-ink'
      }`}
    >
      <input type="radio" name={name} checked={checked} onChange={onChange} className="sr-only" data-field={dataField} />
      {checked && (
        <motion.span
          layoutId={`tile-${name}`}
          className="absolute right-2 top-2 grid h-5 w-5 place-items-center bg-ember text-black"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        >
          <Check className="h-3 w-3" />
        </motion.span>
      )}
      {children}
    </label>
  );
}

function TextArea({
  id,
  label: lbl,
  hint,
  value,
  onChange,
  max,
  error,
  placeholder,
}: {
  id: 'challenge' | 'solution';
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  error?: string;
  placeholder: string;
}) {
  const min = LIMITS[id][0];
  const n = value.trim().length;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-[0.2em] text-black/70">
        {lbl} <span className="text-ember-deep">*</span>
      </label>
      <p id={`${id}-hint`} className="mb-3 mt-1 text-sm text-black/60">
        {hint}
      </p>
      <textarea
        id={id}
        data-field={id}
        value={value}
        maxLength={max}
        rows={7}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={`${id}-hint ${id}-count${error ? ` err-${id}` : ''}`}
        placeholder={placeholder}
        className={`w-full resize-y border-2 bg-white p-4 text-base leading-relaxed outline-none transition focus:border-ink ${
          error ? 'border-red-600' : 'border-black/15'
        }`}
      />
      <div className="mt-2 flex items-start justify-between gap-4">
        <FieldError id={`err-${id}`} msg={error} />
        <p id={`${id}-count`} className={`ml-auto shrink-0 text-xs font-bold tabular-nums ${n >= min ? 'text-green-700' : 'text-black/50'}`}>
          {n}/{max}
          {n < min && <span className="sr-only"> characters, minimum {min}</span>}
        </p>
      </div>
    </div>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center gap-2 text-sm font-semibold text-red-700"
        >
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden /> {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function EditBtn({ onClick, label: lbl, dark }: { onClick: () => void; label: string; dark?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={lbl}
      className={`ml-auto inline-flex min-h-[36px] items-center gap-1 px-2 text-[11px] font-bold uppercase tracking-[0.15em] transition ${
        dark ? 'text-white/80 hover:text-ember' : 'text-black/60 hover:text-ember-deep'
      }`}
    >
      <Pencil className="h-3.5 w-3.5" /> Edit
    </button>
  );
}

function ReviewBlock({ title, onEdit, children }: { title: string; onEdit: () => void; children: ReactNode }) {
  return (
    <div className="mt-5 border-t border-black/10 pt-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ember-deep">{title}</p>
        <EditBtn onClick={onEdit} label={`Edit ${title.toLowerCase()}`} />
      </div>
      <p className="mt-1 whitespace-pre-line break-words text-base leading-relaxed text-black/80">{children}</p>
    </div>
  );
}

function Success({ idea, onView, onAnother }: { idea: AthleteIdea; onView: () => void; onAnother: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[460px] flex-col items-start justify-center"
      role="status"
    >
      <div className="relative">
        <motion.div
          className="absolute inset-0 rounded-full bg-ember"
          initial={{ scale: 0.6, opacity: 0.7 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="relative grid h-20 w-20 place-items-center rounded-full bg-ember text-black"
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
        >
          <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={3}>
            <motion.path
              d="M5 12.5l4.5 4.5L19 7"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 text-[11px] font-bold uppercase tracking-[0.25em] text-black/60"
      >
        Idea ID · <span className="font-mono text-ink">{idea.id}</span>
      </motion.p>
      <h3 ref={headingRef} tabIndex={-1} className="font-display mt-3 text-[clamp(2.6rem,6vw,5rem)] outline-none">
        <motion.span
          className="block"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: EASE }}
        >
          Your voice
        </motion.span>
        <motion.span
          className="block text-ember-deep"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: EASE }}
        >
          is on the board.
        </motion.span>
      </h3>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-4 max-w-md text-base text-black/70"
      >
        &ldquo;{idea.title}&rdquo; is now live on the community board, where other athletes can support and discuss it.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <button
          onClick={onView}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 bg-ink px-6 text-sm font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-ember hover:text-black"
        >
          <Eye className="h-4 w-4" /> View your idea
        </button>
        <button
          onClick={onAnother}
          className="inline-flex min-h-[48px] items-center justify-center gap-2 border-2 border-ink px-6 text-sm font-extrabold uppercase tracking-[0.15em] transition hover:bg-ink hover:text-white"
        >
          <Plus className="h-4 w-4" /> Submit another
        </button>
      </motion.div>
    </motion.div>
  );
}

