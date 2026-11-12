import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import { useHub } from '../state/HubContext';
import { scrollToId } from '../lib/storage';
import { SPORT_MAP } from '../data/sports';
import { Photo } from './ui';

export default function FinalCTA() {
  const ref = useRef<HTMLElement>(null);
  const { sport, requestStudioReset } = useHub();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const x1 = useTransform(scrollYProgress, [0, 1], ['10%', '-20%']);
  const x2 = useTransform(scrollYProgress, [0, 1], ['-25%', '5%']);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);

  return (
    <section ref={ref} aria-labelledby="cta-title" className="grain relative overflow-hidden bg-ember py-28 text-ink md:py-40">
      <motion.div aria-hidden className="pointer-events-none absolute inset-0 opacity-25 mix-blend-multiply" style={{ scale: imgScale }}>
        <Photo src={SPORT_MAP[sport].image} alt="" className="h-full w-full object-cover grayscale" />
      </motion.div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-6 select-none overflow-hidden">
        <motion.p style={{ x: x1 }} className="font-display whitespace-nowrap text-[clamp(4rem,12vw,12rem)] text-black/10">
          Listen · Create · Evolve · Listen · Create · Evolve
        </motion.p>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <h2 id="cta-title" className="font-display text-mega max-w-[13ch]">
          The next breakthrough starts with <span className="text-white">you.</span>
        </h2>
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              requestStudioReset();
              scrollToId('studio');
            }}
            className="group inline-flex min-h-[64px] items-center justify-center gap-4 bg-ink px-10 text-base font-extrabold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-black"
          >
            Share your idea
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
          <p className="max-w-xs text-sm font-semibold text-black/75">
            Takes about two minutes. No account needed. Your game: <strong>{SPORT_MAP[sport].label}</strong>.
          </p>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-4 select-none overflow-hidden">
        <motion.p style={{ x: x2 }} className="font-display whitespace-nowrap text-[clamp(4rem,12vw,12rem)] text-black/10">
          Made with athletes · Made with athletes · Made with athletes
        </motion.p>
      </div>
    </section>
  );
}

