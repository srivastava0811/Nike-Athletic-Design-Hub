import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scrollToId } from '../lib/storage';

const LINKS = [
  { id: 'identity', label: 'Your Game' },
  { id: 'how', label: 'How It Works' },
  { id: 'studio', label: 'Studio' },
  { id: 'community', label: 'Community' },
  { id: 'evolution', label: 'Evolution' },
];

export function Swoosh({ className = '' }: { className?: string }) {
  // Abstract mark (not the official logo) — conceptual prototype.
  return (
    <svg viewBox="0 0 64 24" className={className} aria-hidden="true">
      <path d="M2 18 L22 6 L30 14 L62 2 L32 22 L22 12 Z" fill="currentColor" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-ink/90 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <motion.div className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-ember" style={{ scaleX: progress }} />
      <nav className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-5 md:px-10" aria-label="Primary">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            go('top');
          }}
          className="flex items-center gap-3"
        >
          <Swoosh className="h-5 w-auto text-white" />
          <span className="font-display text-lg tracking-wide">
            Athlete <span className="text-ember">Design</span> Hub
          </span>
        </a>
        <ul className="hidden items-center gap-7 lg:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(l.id);
                }}
                className="group relative text-xs font-bold uppercase tracking-[0.2em] text-white/75 transition hover:text-white"
              >
                {l.label}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-ember transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <button
            onClick={() => go('studio')}
            className="hidden bg-white px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-black transition hover:bg-ember sm:block"
          >
            Share your idea
          </button>
          <button
            className="grid h-11 w-11 place-items-center lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10 lg:hidden"
          >
            <ul className="flex flex-col px-5 py-4">
              {[...LINKS, { id: 'studio', label: 'Share your idea' }].map((l, i) => (
                <li key={l.label}>
                  <a
                    href={`#${l.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(l.id);
                    }}
                    className={`block py-3 font-display text-4xl ${i === LINKS.length ? 'text-ember' : ''}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

