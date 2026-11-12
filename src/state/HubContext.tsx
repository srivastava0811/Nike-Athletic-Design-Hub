import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AthleteIdea, Comment, IdeaDraft, Sport } from '../types';
import { SAMPLE_IDEAS } from '../data/sampleIdeas';
import { isSport } from '../data/sports';
import { KEYS, readJSON, uid, writeJSON } from '../lib/storage';

const isArray = (v: unknown): v is unknown[] => Array.isArray(v);

function sanitizeIdeas(raw: unknown[]): AthleteIdea[] {
  return raw.filter(
    (i): i is AthleteIdea =>
      !!i &&
      typeof i === 'object' &&
      typeof (i as AthleteIdea).id === 'string' &&
      typeof (i as AthleteIdea).challenge === 'string' &&
      typeof (i as AthleteIdea).solution === 'string' &&
      isSport((i as AthleteIdea).sport),
  ).map((i) => ({ ...i, isSample: false, comments: [], supportCount: Number(i.supportCount) || 0 }));
}

function sanitizeComments(raw: unknown[]): Comment[] {
  return raw.filter(
    (c): c is Comment =>
      !!c && typeof c === 'object' && typeof (c as Comment).ideaId === 'string' && typeof (c as Comment).content === 'string',
  );
}

export const emptyDraft = (sport: Sport): IdeaDraft => ({
  sport,
  category: null,
  problemArea: null,
  challenge: '',
  solution: '',
  title: '',
});

interface HubState {
  sport: Sport;
  setSport: (s: Sport) => void;
  ideas: AthleteIdea[];
  getIdea: (id: string) => AthleteIdea | undefined;
  supportedIds: string[];
  toggleSupport: (id: string) => void;
  isSupported: (id: string) => boolean;
  supportTotal: (idea: AthleteIdea) => number;
  addComment: (ideaId: string, content: string) => void;
  submitIdea: (draft: IdeaDraft) => AthleteIdea;
  draft: IdeaDraft;
  setDraft: (d: IdeaDraft | ((d: IdeaDraft) => IdeaDraft)) => void;
  studioStepRequest: number;
  requestStudioReset: () => void;
  openIdeaId: string | null;
  openIdea: (id: string | null) => void;
  journeyIdeaId: string | null;
  setJourneyIdeaId: (id: string | null) => void;
  lastSubmittedId: string | null;
}

const HubContext = createContext<HubState | null>(null);

export function HubProvider({ children }: { children: ReactNode }) {
  const [sport, setSportState] = useState<Sport>(() => readJSON<Sport>(KEYS.sport, 'running', isSport));
  const [userIdeas, setUserIdeas] = useState<AthleteIdea[]>(() => sanitizeIdeas(readJSON(KEYS.ideas, [], isArray)));
  const [userComments, setUserComments] = useState<Comment[]>(() => sanitizeComments(readJSON(KEYS.comments, [], isArray)));
  const [supportedIds, setSupportedIds] = useState<string[]>(() =>
    readJSON<unknown[]>(KEYS.supported, [], isArray).filter((x): x is string => typeof x === 'string'),
  );
  const [draft, setDraft] = useState<IdeaDraft>(() => emptyDraft(sport));
  const [studioStepRequest, setStudioStepRequest] = useState(0);
  const [openIdeaId, setOpenIdeaId] = useState<string | null>(null);
  const [journeyIdeaId, setJourneyIdeaId] = useState<string | null>(null);
  const [lastSubmittedId, setLastSubmittedId] = useState<string | null>(null);

  useEffect(() => writeJSON(KEYS.sport, sport), [sport]);
  useEffect(() => writeJSON(KEYS.ideas, userIdeas), [userIdeas]);
  useEffect(() => writeJSON(KEYS.comments, userComments), [userComments]);
  useEffect(() => writeJSON(KEYS.supported, supportedIds), [supportedIds]);

  const setSport = useCallback((s: Sport) => {
    setSportState(s);
    // Carry the sport into the Innovation Studio automatically
    setDraft((d) => ({ ...d, sport: s }));
  }, []);

  const ideas = useMemo<AthleteIdea[]>(() => {
    const all = [...userIdeas, ...SAMPLE_IDEAS];
    return all.map((idea) => ({
      ...idea,
      comments: [...idea.comments, ...userComments.filter((c) => c.ideaId === idea.id)].sort(
        (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
      ),
    }));
  }, [userIdeas, userComments]);

  const getIdea = useCallback((id: string) => ideas.find((i) => i.id === id), [ideas]);
  const isSupported = useCallback((id: string) => supportedIds.includes(id), [supportedIds]);
  const supportTotal = useCallback(
    (idea: AthleteIdea) => idea.supportCount + (supportedIds.includes(idea.id) ? 1 : 0),
    [supportedIds],
  );

  // One support per browser. Clicking again withdraws support (never double-counts).
  const toggleSupport = useCallback((id: string) => {
    setSupportedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const addComment = useCallback((ideaId: string, content: string) => {
    const c: Comment = {
      id: uid('C'),
      ideaId,
      content: content.trim().slice(0, 280),
      createdAt: new Date().toISOString(),
      author: 'You',
    };
    setUserComments((prev) => [...prev, c]);
  }, []);

  const submitIdea = useCallback((d: IdeaDraft): AthleteIdea => {
    const idea: AthleteIdea = {
      id: uid('ADH'),
      sport: d.sport,
      category: d.category!,
      problemArea: d.problemArea!,
      title: d.title.trim(),
      challenge: d.challenge.trim(),
      solution: d.solution.trim(),
      createdAt: new Date().toISOString(),
      supportCount: 0,
      comments: [],
      author: 'You',
      isSample: false,
    };
    setUserIdeas((prev) => [idea, ...prev]);
    setLastSubmittedId(idea.id);
    return idea;
  }, []);

  const requestStudioReset = useCallback(() => setStudioStepRequest((n) => n + 1), []);

  const value: HubState = {
    sport,
    setSport,
    ideas,
    getIdea,
    supportedIds,
    toggleSupport,
    isSupported,
    supportTotal,
    addComment,
    submitIdea,
    draft,
    setDraft,
    studioStepRequest,
    requestStudioReset,
    openIdeaId,
    openIdea: setOpenIdeaId,
    journeyIdeaId,
    setJourneyIdeaId,
    lastSubmittedId,
  };

  return <HubContext.Provider value={value}>{children}</HubContext.Provider>;
}

export function useHub() {
  const ctx = useContext(HubContext);
  if (!ctx) throw new Error('useHub must be used within HubProvider');
  return ctx;
}

