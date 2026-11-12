import { motion, useScroll, useTransform } from 'motion/react';
import { Ear, PenTool, RefreshCcw } from 'lucide-react';
import { useRef } from 'react';
import { RevealLines } from './ui';

const STEPS = [
  {
    word: 'Listen',
    icon: Ear,
    line: 'Understand real athlete experiences.',
    body: 'Athletes share what actually happens in training and competition — the blisters, the slips, the gear that fails at the worst moment.',
    where: 'Athlete identity · Innovation Studio step 1–2',
  },
  {
    word: 'Create',
    icon: PenTool,
    line: 'Turn athlete challenges into product ideas.',
    body: 'Every challenge becomes a concrete proposal. Athletes describe the fix in their own words — no design degree required.',
    where: 'Innovation Studio step 3–4',
  },
  {
    word: 'Evolve',
    icon: RefreshCcw,
    line: 'Use community feedback to shape future innovation.',
    body: 'The community supports, discusses and sharpens ideas, so the strongest athlete insights rise to the top.',
    where: 'Community board · Design evolution',
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how" aria-labelledby="how-title" className="relative bg-bone py-24 text-ink md:py-32">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-black/60">How it works</p>
            <RevealLines
              id="how-title"
              className="font-display text-huge mt-4"
              lines={[
                <>
                  Listen <span className="text-ember-deep">→</span> Create
                </>,
                <>
                  <span className="text-ember-deep">→</span> Evolve
                </>,
              ]}
            />
          </div>
          <p className="max-w-sm text-base font-medium text-black/70">
            Three principles. One loop. Athletes stay in the process from the first frustration to the future product —
            not just at launch day.
          </p>
        </div>

        <div ref={ref} className="relative mt-16 md:mt-24">
          {/* animated rail */}
          <div className="absolute left-0 right-0 top-[38px] hidden h-[3px] bg-black/10 md:block" />
          <motion.div
            className="absolute left-0 right-0 top-[38px] hidden h-[3px] origin-left bg-ember md:block"
            style={{ scaleX: lineScale }}
          />
          <div className="absolute bottom-0 left-[38px] top-0 w-[3px] bg-black/10 md:hidden" />
          <motion.div
            className="absolute bottom-0 left-[38px] top-0 w-[3px] origin-top bg-ember md:hidden"
            style={{ scaleY: lineScale }}
          />

          <ol className="relative grid gap-14 md:grid-cols-3 md:gap-10">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.word}
                className="group relative pl-24 md:pl-0"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="absolute left-0 top-0 grid h-[78px] w-[78px] place-items-center bg-ink text-white transition-colors duration-300 group-hover:bg-ember group-hover:text-black md:relative">
                  <s.icon className="h-8 w-8" aria-hidden />
                </div>
                <p className="mt-0 text-xs font-bold tracking-[0.3em] text-black/50 md:mt-8">0{i + 1}</p>
                <h3 className="font-display mt-2 text-[clamp(3.5rem,7vw,6.5rem)] transition-transform duration-500 group-hover:translate-x-2">
                  {s.word}
                </h3>
                <p className="mt-4 text-xl font-bold leading-snug">{s.line}</p>
                <p className="mt-3 max-w-sm text-base text-black/70">{s.body}</p>
                <p className="mt-5 inline-block border-t-2 border-ink pt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-black/70">
                  {s.where}
                </p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

