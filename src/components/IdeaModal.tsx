import { AnimatePresence, motion } from 'motion/react';
import { GitBranch, MessageSquare, Send, X } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { label } from '../data/sports';
import { useHub } from '../state/HubContext';
import { scrollToId, timeAgo } from '../lib/storage';
import { SupportButton } from './CommunityBoard';
import { FictionalBadge } from './ui';

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export default function IdeaModal() {
  const { openIdeaId, openIdea, getIdea, addComment, setJourneyIdeaId } = useHub();
  const idea = openIdeaId ? getIdea(openIdeaId) : undefined;
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');

  const close = () => openIdea(null);

  useEffect(() => {
    if (!idea) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        openIdea(null);
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const els = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      returnFocus.current?.focus?.({ preventScroll: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIdeaId]);

  useEffect(() => {
    setComment('');
    setError('');
  }, [openIdeaId]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!idea) return;
    const v = comment.trim();
    if (v.length < 3) return setError('Comments need at least 3 characters.');
    if (v.length > 280) return setError('Keep it under 280 characters.');
    addComment(idea.id, v);
    setComment('');
    setError('');
  };

  const traceJourney = () => {
    if (!idea) return;
    setJourneyIdeaId(idea.id);
    close();
    setTimeout(() => scrollToId('evolution'), 120);
  };

  return (
    <AnimatePresence>
      {idea && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="idea-modal-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-2xl flex-col overflow-hidden bg-bone text-ink shadow-2xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 32 }}
          >
            <div className="flex items-center gap-2 bg-ink px-5 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white md:px-8">
              <span className="bg-ember px-2 py-0.5 text-black">{label.sport(idea.sport)}</span>
              <span>{label.category(idea.category)}</span>
              <span className="text-white/40">/</span>
              <span>{label.problem(idea.problemArea)}</span>
              <button
                data-autofocus
                onClick={close}
                aria-label="Close idea details"
                className="ml-auto grid h-11 w-11 place-items-center transition hover:bg-white hover:text-black"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain">
              <div className="p-5 md:p-8">
                <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-black/55">
                  {idea.isSample ? <FictionalBadge /> : <span className="bg-ember px-1.5 py-0.5 text-black">Your idea</span>}
                  <span>{idea.author}</span>
                  <span>· {timeAgo(idea.createdAt)}</span>
                  <span className="font-mono normal-case tracking-normal">#{idea.id}</span>
                </div>
                <motion.h2
                  id="idea-modal-title"
                  className="font-display mt-4 text-[clamp(2.6rem,6vw,4.8rem)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {idea.title}
                </motion.h2>

                <div className="mt-8 grid gap-6">
                  <div className="border-l-4 border-ink pl-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-black/60">The athlete&rsquo;s challenge</p>
                    <p className="mt-2 whitespace-pre-line break-words text-lg leading-relaxed">{idea.challenge}</p>
                  </div>
                  <div className="border-l-4 border-ember pl-5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-ember-deep">Proposed innovation</p>
                    <p className="mt-2 whitespace-pre-line break-words text-lg leading-relaxed">{idea.solution}</p>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <SupportButton idea={idea} size="lg" />
                  <button
                    onClick={traceJourney}
                    className="inline-flex min-h-[52px] items-center gap-2 border-2 border-ink px-5 text-sm font-extrabold uppercase tracking-[0.12em] transition hover:bg-ink hover:text-white"
                  >
                    <GitBranch className="h-4 w-4" /> Visualize its journey
                  </button>
                </div>
              </div>

              {/* Discussion */}
              <div className="border-t-2 border-ink bg-white p-5 md:p-8">
                <h3 className="font-display flex items-center gap-3 text-3xl">
                  <MessageSquare className="h-6 w-6" aria-hidden /> Discussion
                  <span className="text-base font-sans font-bold text-black/50">({idea.comments.length})</span>
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  <AnimatePresence initial={false}>
                    {idea.comments.map((c) => (
                      <motion.li
                        key={c.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`border p-4 ${c.isSample ? 'border-black/10 bg-bone/60' : 'border-ember/60 bg-ember/5'}`}
                      >
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-black/55">
                          <span className="text-ink">{c.author}</span>
                          {c.isSample && <FictionalBadge />}
                          <span className="ml-auto">{timeAgo(c.createdAt)}</span>
                        </div>
                        <p className="mt-2 break-words text-base">{c.content}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                  {idea.comments.length === 0 && (
                    <li className="text-sm text-black/55">No comments yet. Start the conversation.</li>
                  )}
                </ul>

                <form onSubmit={submit} className="mt-6" noValidate>
                  <label htmlFor="comment" className="text-xs font-bold uppercase tracking-[0.2em] text-black/70">
                    Add a constructive comment
                  </label>
                  <textarea
                    id="comment"
                    rows={3}
                    maxLength={280}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (error) setError('');
                    }}
                    aria-invalid={!!error}
                    aria-describedby={error ? 'comment-err' : 'comment-hint'}
                    placeholder="Build on the idea — what would make it work for you?"
                    className={`mt-2 w-full resize-none border-2 bg-white p-3 text-base outline-none focus:border-ink ${
                      error ? 'border-red-600' : 'border-black/15'
                    }`}
                  />
                  <div className="mt-2 flex items-center justify-between gap-3">
                    {error ? (
                      <p id="comment-err" role="alert" className="text-sm font-semibold text-red-700">
                        {error}
                      </p>
                    ) : (
                      <p id="comment-hint" className="text-xs text-black/55">
                        {comment.length}/280 · Saved on this device
                      </p>
                    )}
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] shrink-0 items-center gap-2 bg-ink px-5 text-xs font-extrabold uppercase tracking-[0.15em] text-white transition hover:bg-ember hover:text-black"
                    >
                      Post <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
