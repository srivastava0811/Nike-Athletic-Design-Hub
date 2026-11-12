import type { Category, ProblemArea, Sport } from '../types';

export interface SportSuggestion {
  label: string;
  category: Category;
  problemArea: ProblemArea;
  starter: string;
}

export interface SportConfig {
  id: Sport;
  label: string;
  image: string;
  kicker: string;
  headline: string;
  message: string;
  stat: string;
  suggestions: SportSuggestion[];
}

export const SPORTS: SportConfig[] = [
  {
    id: 'running',
    label: 'Running',
    image: '/images/running.jpg',
    kicker: 'Mile 1 to mile 26',
    headline: 'YOU FEEL EVERY MILE.',
    message:
      'Blisters at kilometre 30. A waistband that rides up on hills. Runners notice what labs miss — tell us what your miles have taught you.',
    stat: 'LONG RUNS · TEMPO · TRAIL · RACE DAY',
    suggestions: [
      { label: 'Feet swell late in long runs', category: 'footwear', problemArea: 'comfort', starter: 'After about 90 minutes of running, my feet swell and the upper starts to feel tight…' },
      { label: 'No safe place for keys & phone', category: 'apparel', problemArea: 'performance', starter: 'On long runs I carry a phone, keys and gels, but every pocket bounces…' },
      { label: 'Outsole wears out too fast', category: 'footwear', problemArea: 'durability', starter: 'My outsoles wear through at the heel long before the cushioning is done…' },
    ],
  },
  {
    id: 'basketball',
    label: 'Basketball',
    image: '/images/basketball.jpg',
    kicker: 'Hardwood truth',
    headline: 'YOU KNOW EVERY CUT.',
    message:
      'Hard plants, quick cuts, sudden lifts. Hoopers know exactly where a shoe gives out and where a jersey gets in the way. Bring that to the table.',
    stat: 'CUTS · JUMPS · CONTACT · LATE QUARTERS',
    suggestions: [
      { label: 'Ankle feels unstable on cuts', category: 'footwear', problemArea: 'performance', starter: 'When I plant hard to change direction, my foot slides over the footbed…' },
      { label: 'Grip fades on dusty courts', category: 'footwear', problemArea: 'durability', starter: 'On outdoor and dusty gym floors, traction drops off after a few weeks…' },
      { label: 'Jersey stays soaked', category: 'apparel', problemArea: 'comfort', starter: 'By the third quarter my jersey is heavy and clings when I shoot…' },
    ],
  },
  {
    id: 'football',
    label: 'Football',
    image: '/images/football.jpg',
    kicker: 'Ninety minutes of evidence',
    headline: 'YOU READ EVERY TOUCH.',
    message:
      'Wet pitches, hard ground, artificial turf. Footballers feel how boots react to every surface. Your touch is data no machine can capture.',
    stat: 'FIRST TOUCH · STRIKE · TURF · WEATHER',
    suggestions: [
      { label: 'Boots slip on wet turf', category: 'footwear', problemArea: 'performance', starter: 'On wet artificial turf my studs lose grip during quick turns…' },
      { label: 'Shin guards shift mid-match', category: 'equipment', problemArea: 'comfort', starter: 'My shin guards slide down as soon as I start sweating…' },
      { label: 'Kits made for one body type', category: 'apparel', problemArea: 'accessibility', starter: 'Team kits rarely fit athletes with different body shapes…' },
    ],
  },
  {
    id: 'training',
    label: 'Training',
    image: '/images/training.jpg',
    kicker: 'Every rep counts',
    headline: 'YOU EARN EVERY REP.',
    message:
      'Lifts, sprints, rope work, recovery. Training athletes switch movements in seconds. Gear should keep up — you know when it doesn\u2019t.',
    stat: 'LIFT · HIIT · MOBILITY · RECOVERY',
    suggestions: [
      { label: 'Shoe too soft for lifting', category: 'footwear', problemArea: 'performance', starter: 'In mixed sessions my shoes are great for jumping but unstable under heavy squats…' },
      { label: 'Gear smells after one wash', category: 'apparel', problemArea: 'sustainability', starter: 'My training tops hold odour so I wash them constantly, which wears them out…' },
      { label: 'Gloves tear at the palm', category: 'equipment', problemArea: 'durability', starter: 'Lifting gloves split at the palm seam within a couple of months…' },
    ],
  },
  {
    id: 'other',
    label: 'Other',
    image: '/images/other.jpg',
    kicker: 'Every sport. Every body.',
    headline: 'YOUR GAME COUNTS.',
    message:
      'Tennis, climbing, para-sport, skating, dance — if you have a body, you are an athlete. The best ideas often come from the edges of sport.',
    stat: 'COURT · WALL · TRACK · STREET',
    suggestions: [
      { label: 'Adaptive gear is hard to find', category: 'apparel', problemArea: 'accessibility', starter: 'As an adaptive athlete, getting in and out of performance gear takes extra time…' },
      { label: 'Gear isn\u2019t built for my sport', category: 'equipment', problemArea: 'performance', starter: 'There is almost no gear designed specifically for my sport, so I adapt…' },
      { label: 'Too much packaging waste', category: 'footwear', problemArea: 'sustainability', starter: 'Every new pair comes with layers of packaging I immediately throw away…' },
    ],
  },
];

export const SPORT_MAP: Record<Sport, SportConfig> = Object.fromEntries(
  SPORTS.map((s) => [s.id, s]),
) as Record<Sport, SportConfig>;

export const CATEGORIES: { id: Category; label: string; blurb: string }[] = [
  { id: 'footwear', label: 'Footwear', blurb: 'Shoes, boots, spikes, cleats' },
  { id: 'apparel', label: 'Apparel', blurb: 'Tops, shorts, kits, layers' },
  { id: 'equipment', label: 'Equipment', blurb: 'Bags, guards, balls, gloves' },
];

export const PROBLEM_AREAS: { id: ProblemArea; label: string }[] = [
  { id: 'comfort', label: 'Comfort' },
  { id: 'performance', label: 'Performance' },
  { id: 'durability', label: 'Durability' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'sustainability', label: 'Sustainability' },
  { id: 'other', label: 'Other' },
];

export const label = {
  category: (c: Category) => CATEGORIES.find((x) => x.id === c)?.label ?? c,
  problem: (p: ProblemArea) => PROBLEM_AREAS.find((x) => x.id === p)?.label ?? p,
  sport: (s: Sport) => SPORT_MAP[s]?.label ?? s,
};

export const isSport = (v: unknown): v is Sport =>
  typeof v === 'string' && SPORTS.some((s) => s.id === v);

