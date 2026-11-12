import type { AthleteIdea } from '../types';

const daysAgo = (d: number, h = 0) => new Date(Date.now() - (d * 24 + h) * 3600_000).toISOString();

/**
 * FICTIONAL demo ideas. These are not real athletes, real submissions,
 * or real Nike data. They exist only to demonstrate the prototype.
 * They are generated in-memory and never written to localStorage,
 * so they can never duplicate on reload.
 */
export const SAMPLE_IDEAS: AthleteIdea[] = [
  {
    id: 'DEMO-RUN01',
    sport: 'running',
    category: 'footwear',
    problemArea: 'comfort',
    title: 'Adaptive upper for long runs',
    challenge:
      'Shoes become uncomfortable during long-distance training. After two hours my feet swell and the upper starts pressing on my toes.',
    solution:
      'An adaptive upper material that responds to movement and ventilation needs — loosening slightly as temperature rises and opening micro-vents in the forefoot.',
    createdAt: daysAgo(6),
    supportCount: 214,
    author: 'Demo Runner · fictional',
    isSample: true,
    comments: [
      { id: 'DC-1', ideaId: 'DEMO-RUN01', content: 'Same for marathon training. A forefoot that gives a few millimetres late in the run would change everything.', createdAt: daysAgo(5), author: 'Demo athlete', isSample: true },
      { id: 'DC-2', ideaId: 'DEMO-RUN01', content: 'Would love this for hot-weather races too.', createdAt: daysAgo(3), author: 'Demo athlete', isSample: true },
    ],
  },
  {
    id: 'DEMO-BBL01',
    sport: 'basketball',
    category: 'footwear',
    problemArea: 'performance',
    title: 'Lateral lock-in wings',
    challenge:
      'On hard cuts my foot slides over the edge of the midsole. I end up lacing so tight that my foot goes numb by halftime.',
    solution:
      'Internal lateral "wings" that tension only when you plant sideways, so the shoe locks down on cuts but stays relaxed while running the floor.',
    createdAt: daysAgo(4, 3),
    supportCount: 187,
    author: 'Demo Guard · fictional',
    isSample: true,
    comments: [
      { id: 'DC-3', ideaId: 'DEMO-BBL01', content: 'Numb feet by halftime is way too relatable.', createdAt: daysAgo(4), author: 'Demo athlete', isSample: true },
    ],
  },
  {
    id: 'DEMO-FBL01',
    sport: 'football',
    category: 'footwear',
    problemArea: 'performance',
    title: 'Weather-reactive stud plate',
    challenge:
      'We train on wet artificial turf and play on dry grass. One pair of boots never grips well on both, and most of us can\u2019t afford two.',
    solution:
      'A stud plate with swappable low-profile pods for turf and firmer pods for grass, clicked in without tools before kickoff.',
    createdAt: daysAgo(3, 6),
    supportCount: 142,
    author: 'Demo Midfielder · fictional',
    isSample: true,
    comments: [],
  },
  {
    id: 'DEMO-TRN01',
    sport: 'training',
    category: 'footwear',
    problemArea: 'performance',
    title: 'Hybrid lift-and-sprint sole',
    challenge:
      'Circuit sessions mix box jumps and heavy deadlifts. Soft shoes wobble under the bar; flat lifters feel terrible for sprints.',
    solution:
      'A dual-density sole with a firm, flat heel platform for lifting and a responsive forefoot for jumps and short sprints.',
    createdAt: daysAgo(2, 2),
    supportCount: 96,
    author: 'Demo Coach · fictional',
    isSample: true,
    comments: [
      { id: 'DC-4', ideaId: 'DEMO-TRN01', content: 'Add a wide toe box and I\u2019m in.', createdAt: daysAgo(1), author: 'Demo athlete', isSample: true },
    ],
  },
  {
    id: 'DEMO-OTH01',
    sport: 'other',
    category: 'apparel',
    problemArea: 'accessibility',
    title: 'Magnetic-close adaptive warm-ups',
    challenge:
      'As a wheelchair athlete, getting out of warm-up pants before competition takes too long and zips are hard to manage with cold hands.',
    solution:
      'Side-opening warm-up pants with magnetic closures running hip to ankle, removable in seconds while seated.',
    createdAt: daysAgo(5, 1),
    supportCount: 231,
    author: 'Demo Para-athlete · fictional',
    isSample: true,
    comments: [
      { id: 'DC-5', ideaId: 'DEMO-OTH01', content: 'This would help so many athletes. Easy-on should be the default.', createdAt: daysAgo(4), author: 'Demo athlete', isSample: true },
    ],
  },
  {
    id: 'DEMO-RUN02',
    sport: 'running',
    category: 'apparel',
    problemArea: 'sustainability',
    title: 'Repairable race-day shorts',
    challenge:
      'My favourite running shorts get thrown away as soon as the liner tears, even though the outer shell is still perfect.',
    solution:
      'Shorts with a snap-in replaceable liner, plus a take-back program that recycles worn liners into new ones.',
    createdAt: daysAgo(1, 4),
    supportCount: 73,
    author: 'Demo Trail Runner · fictional',
    isSample: true,
    comments: [],
  },
  {
    id: 'DEMO-BBL02',
    sport: 'basketball',
    category: 'equipment',
    problemArea: 'durability',
    title: 'Outdoor-rated grip ball',
    challenge:
      'Indoor-feel basketballs shred on outdoor courts within weeks. Outdoor balls feel slick and dead in your hands.',
    solution:
      'A ball with a tougher micro-textured cover tested specifically on asphalt, keeping indoor-style grip for longer.',
    createdAt: daysAgo(0, 9),
    supportCount: 58,
    author: 'Demo Streetballer · fictional',
    isSample: true,
    comments: [],
  },
  {
    id: 'DEMO-FBL02',
    sport: 'football',
    category: 'equipment',
    problemArea: 'comfort',
    title: 'Sleeve-integrated shin guards',
    challenge:
      'Shin guards slip as soon as I sweat, and tape irritates my skin after every match.',
    solution:
      'A compression sleeve with a contoured pocket that holds a slim guard in place without tape.',
    createdAt: daysAgo(2, 10),
    supportCount: 119,
    author: 'Demo Defender · fictional',
    isSample: true,
    comments: [],
  },
];

