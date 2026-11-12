import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { scrollToId } from '../lib/storage';

const EASE = [0.16, 1, 0.3, 1] as const;

const LINES = [
  { text: 'Not just made', cls: '' },
  { text: 'for athletes.', cls: '' },
  { text: 'Made with them.', cls: 'text-ember' },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section id="top" ref={ref} className="grain relative flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* Cinematic image */}
      <motion.div className="absolute inset-0 img-fallback" style={{ y: imgY }}>
        <motion.img
          src="/images/hero.jpg"
          alt="A sprinter exploding out of the blocks under dramatic light"
          className="h-full w-full object-cover object-center"
          initial={{ scale: 1.25, opacity: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.4)' }}
          animate={{ scale: 1.05, opacity: 1, filter: 'grayscale(1) contrast(1.15) brightness(0.65)' }}
          transition={{ duration: 2.4, ease: EASE }}
          fetchPriority="high"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />


      <motion.div
        style={{ y: textY, opacity: fade }}
        className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-1 flex-col justify-end px-5 pb-28 pt-28 md:px-10 md:pb-32"
      >
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: EASE }}
          className="mb-6 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.3em] text-white/80"
        >
          <span className="h-[2px] w-10 bg-ember" />
          Nike / Athlete Design Hub
        </motion.p>

        <h1 className="font-display text-mega max-w-[14ch]">
          {LINES.map((l, i) => (
            <motion.span
              key={l.text}
              className={`block ${l.cls}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.08, ease: EASE }}
            >
              {l.text}
            </motion.span>
          ))}
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: EASE }}
            className="max-w-md text-lg font-medium text-white/85 md:text-xl"
          >
            Your experience. Your ideas. The future of sport.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.6, ease: EASE }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => scrollToId('identity')}
              className="group inline-flex items-center justify-center gap-3 bg-ember px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-black transition hover:bg-white"
            >
              Enter the Design Hub
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollToId('how')}
              className="inline-flex items-center justify-center gap-3 border-2 border-white/80 px-7 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              See how it works
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee */}
      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/15 bg-ink/70 py-3 backdrop-blur-sm">
        <div className="animate-marquee flex w-max whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
              {['Listen', 'Create', 'Evolve', 'Made with athletes', 'Listen', 'Create', 'Evolve', 'Your game. Your voice.'].map((w, i) => (
                <span key={i} className="flex items-center font-display text-xl tracking-wider text-white/85 md:text-2xl">
                  <span className="px-6">{w}</span>
                  <span className="text-ember">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <motion.button
        onClick={() => scrollToId('shift')}
        aria-label="Scroll to next section"
        className="absolute bottom-20 right-6 z-10 hidden h-12 w-12 place-items-center rounded-full border border-white/40 md:grid"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2 }}
      >
        <ArrowDown className="h-5 w-5" />
      </motion.button>
    </section>
  );
}

