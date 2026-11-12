import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import { Photo } from './ui';

const BEATS = [
  { word: 'They play.', img: '/images/shift-play.jpg', alt: 'Worn athletic shoes on a track', copy: 'Thousands of hours on courts, tracks and pitches.' },
  { word: 'They push.', img: '/images/shift-push.jpg', alt: 'An exhausted athlete, sweat and grit', copy: 'Through the pain, the weather, the last rep.' },
  { word: 'They know.', img: '/images/shift-know.jpg', alt: 'A designer workbench with sneaker sketches and materials', copy: 'Every blister, every slip, every seam that rubs.' },
];

function Beat({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const seg = 0.25;
  const start = i * seg;
  const end = start + seg;
  const fadeIn = i === 0 ? [0, 0.001] : [start - 0.04, start + 0.04];
  const opacity = useTransform(progress, [fadeIn[0], fadeIn[1], end - 0.04, end + 0.02], [i === 0 ? 1 : 0, 1, 1, 0]);
  const y = useTransform(progress, [start, end], ['12%', '-12%']);
  const scale = useTransform(progress, [start, end], [1.15, 1]);
  const wordX = useTransform(progress, [start, end], ['6%', '-6%']);
  const b = BEATS[i];
  return (
    <motion.div className="absolute inset-0" style={{ opacity }}>
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Photo src={b.img} alt={b.alt} className="h-full w-full object-cover grayscale contrast-125 brightness-50" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
      <div className="relative flex h-full flex-col justify-center px-5 md:px-10">
        <motion.p
          style={{ x: wordX }}
          className="font-display whitespace-nowrap text-[clamp(4.5rem,17vw,17rem)] leading-none md:leading-[0.92]"
        >
          {b.word}
        </motion.p>
        <motion.p style={{ y }} className="mt-6 max-w-sm text-lg font-medium text-white/80 md:ml-[40%]">
          <span className="mr-3 font-display text-ember">0{i + 1}</span>
          {b.copy}
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Shift() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const finalOpacity = useTransform(scrollYProgress, [0.74, 0.8], [0, 1]);
  const finalClip = useTransform(scrollYProgress, [0.74, 0.86], ['inset(50% 0% 50% 0%)', 'inset(0% 0% 0% 0%)']);
  const finalScale = useTransform(scrollYProgress, [0.76, 1], [1.12, 1]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  if (reduce) {
    return (
      <section id="shift" aria-label="The Shift" className="bg-ink">
        {BEATS.map((b) => (
          <div key={b.word} className="relative flex min-h-[70vh] items-center overflow-hidden px-5 md:px-10">
            <Photo src={b.img} alt={b.alt} className="absolute inset-0 h-full w-full object-cover grayscale brightness-50" />
            <p className="relative font-display text-mega">{b.word}</p>
          </div>
        ))}
        <div className="bg-bone px-5 py-32 text-ink md:px-10">
          <p className="font-display text-mega">
            So why shouldn&rsquo;t they <span className="text-ember-deep">design?</span>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="shift" ref={ref} aria-label="The Shift" className="relative h-[420vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {BEATS.map((_, i) => (
          <Beat key={i} i={i} progress={scrollYProgress} />
        ))}

        <motion.div
          style={{ opacity: finalOpacity, clipPath: finalClip }}
          className="absolute inset-0 flex items-center bg-bone px-5 text-ink md:px-10"
        >
          <motion.div style={{ scale: finalScale }} className="w-full">
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.3em] text-black/60">The shift</p>
            <p className="font-display text-mega max-w-[12ch]">
              So why shouldn&rsquo;t they <span className="text-ember-deep">design?</span>
            </p>
            <p className="mt-8 max-w-lg text-lg font-medium text-black/70">
              Athletes are not passive consumers. They are the most qualified collaborators in sport. The Athlete Design
              Hub puts them at the table — from the first idea.
            </p>
          </motion.div>
        </motion.div>

        {/* Progress rail */}
        <div className="absolute bottom-8 left-5 right-5 z-10 flex items-center gap-4 md:left-10 md:right-10">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mix-blend-difference">The shift</span>
          <div className="relative h-[2px] flex-1 bg-white/20">
            <motion.div className="absolute inset-y-0 left-0 bg-ember" style={{ width: bar }} />
          </div>
        </div>
      </div>
    </section>
  );
}

