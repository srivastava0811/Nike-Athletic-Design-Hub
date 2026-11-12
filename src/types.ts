export type Sport = 'running' | 'basketball' | 'football' | 'training' | 'other';
export type Category = 'footwear' | 'apparel' | 'equipment';
export type ProblemArea =
  | 'comfort'
  | 'performance'
  | 'durability'
  | 'accessibility'
  | 'sustainability'
  | 'other';

export interface Comment {
  id: string;
  ideaId: string;
  content: string;
  createdAt: string;
  author: string;
  isSample?: boolean;
}

export interface AthleteIdea {
  id: string;
  sport: Sport;
  category: Category;
  problemArea: ProblemArea;
  title: string;
  challenge: string;
  solution: string;
  createdAt: string;
  /** Base support count (excluding this browser's support). */
  supportCount: number;
  comments: Comment[];
  author: string;
  isSample: boolean;
}

export interface IdeaDraft {
  sport: Sport;
  category: Category | null;
  problemArea: ProblemArea | null;
  challenge: string;
  solution: string;
  title: string;
}

