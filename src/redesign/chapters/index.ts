/**
 * Chapter registry and the contract every chapter component follows.
 * Keep this file free of component imports (it is re-exported by ui/index.ts).
 */
export type ChapterId = 'overview' | 'income' | 'rf' | 'rights' | 'nutrition' | 'forensic';

export interface ChapterProps {
  /** Jump to the Evidence chapter, optionally focusing one ledger entry. */
  onOpenLedger: (metricId?: string) => void;
  /** Switch chapter. */
  onNavigate: (id: ChapterId) => void;
}

export interface ChapterMeta {
  id: ChapterId;
  /** Two-digit chapter number; empty for the overview. */
  no: string;
  /** Short name used in the top bar. */
  name: string;
  /** One line used by the "next chapter" link. */
  teaser: string;
}

export const CHAPTERS: ChapterMeta[] = [
  { id: 'overview', no: '', name: 'Overview', teaser: 'The programme at a glance' },
  { id: 'income', no: '01', name: 'Income', teaser: 'What five harvests did to household income' },
  { id: 'rf', no: '02', name: 'Farming', teaser: 'How the land is farmed now' },
  { id: 'rights', no: '03', name: 'Rights', teaser: 'The public money villages unlocked' },
  { id: 'nutrition', no: '04', name: 'Nutrition', teaser: 'What is on the plate, month by month' },
  { id: 'forensic', no: '05', name: 'Evidence', teaser: 'How every number here was checked' },
];
