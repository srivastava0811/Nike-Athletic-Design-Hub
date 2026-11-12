import { Swoosh } from './Nav';

export default function Footer() {
  return (
    <footer className="bg-ink px-5 py-14 text-white/60 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-white">
            <Swoosh className="h-5 w-auto" />
            <span className="font-display text-2xl">
              Athlete <span className="text-ember">Design</span> Hub
            </span>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed">
            Conceptual hackathon prototype. Not an official Nike service, and not affiliated with or endorsed by Nike,
            Inc. All example ideas, athletes and comments are fictional. Submissions, support and comments are stored
            only in your browser&rsquo;s local storage. Imagery is AI-generated for this concept.
          </p>
        </div>
        <p className="font-display text-4xl text-white md:text-5xl">
          Listen. Create. <span className="text-ember">Evolve.</span>
        </p>
      </div>
    </footer>
  );
}

