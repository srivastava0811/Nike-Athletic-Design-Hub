import { motion } from 'motion/react';
import { useState, type ReactNode } from 'react';

/** Accessible reveal for oversized headlines that never gets stuck or clipped. */
export function RevealLines({
  lines,
  className = '',
  delay = 0,
  as: Tag = 'h2',
  id,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
}) {
  return (
    <Tag className={className} id={id}>
      {lines.map((line, i) => (
        <motion.span
          key={i}
          className="block"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          {line}
        </motion.span>
      ))}
    </Tag>
  );
}

export function FadeUp({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

const PRINCIPLE_STYLE = {
  LISTEN: '01',
  CREATE: '02',
  EVOLVE: '03',
} as const;

/** Every major section is tagged with the principle it reinforces. */
export function PrincipleTag({
  principle,
  label,
  tone = 'dark',
}: {
  principle: keyof typeof PRINCIPLE_STYLE;
  label: string;
  tone?: 'dark' | 'light';
}) {
  return (
    <div
      className={`flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] ${
        tone === 'dark' ? 'text-white/70' : 'text-black/60'
      }`}
    >
      <span className="inline-flex items-center gap-2 bg-ember px-2 py-1 text-black">
        {PRINCIPLE_STYLE[principle]} · {principle}
      </span>
      <span>{label}</span>
    </div>
  );
}

/** Image with graceful fallback if the asset fails to load. */
export function Photo({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div role="img" aria-label={alt} className={`img-fallback ${className}`} />;
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} loading="lazy" decoding="async" />;
}

export function FictionalBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 border border-current px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${className}`}
    >
      Fictional example
    </span>
  );
}

