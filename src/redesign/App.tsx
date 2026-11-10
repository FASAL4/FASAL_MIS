import React, { useCallback, useEffect, useState } from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { EvidenceProvider } from '@/context/EvidenceContext';
import { CHAPTERS, type ChapterId } from './chapters';
import { TopBar } from './shell/TopBar';
import { EvidenceDrawer } from './shell/EvidenceDrawer';
import { Footer, NextChapter } from './shell/Footer';
import { OverviewChapter } from './chapters/overview/OverviewChapter';
import { IncomeChapter } from './chapters/income/IncomeChapter';
import { RFChapter } from './chapters/rf/RFChapter';
import { RightsChapter } from './chapters/rights/RightsChapter';
import { NutritionChapter } from './chapters/nutrition/NutritionChapter';
import { ForensicChapter } from './chapters/forensic/ForensicChapter';

const IDS = CHAPTERS.map((c) => c.id);

function chapterFromHash(): ChapterId {
  const h = window.location.hash.replace(/^#\/?/, '') as ChapterId;
  return IDS.includes(h) ? h : 'overview';
}

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23f2b01e'/%3E%3Cg fill='%23141c17'%3E%3Ccircle cx='10' cy='10' r='2.4'/%3E%3Ccircle cx='16' cy='10' r='2.4'/%3E%3Ccircle cx='22' cy='10' r='2.4'/%3E%3Ccircle cx='10' cy='16' r='2.4'/%3E%3Ccircle cx='16' cy='16' r='2.4'/%3E%3Ccircle cx='22' cy='16' r='2.4'/%3E%3Ccircle cx='10' cy='22' r='2.4'/%3E%3Ccircle cx='16' cy='22' r='2.4'/%3E%3C/g%3E%3C/svg%3E";

const Shell: React.FC = () => {
  const [chapter, setChapter] = useState<ChapterId>(chapterFromHash);
  const [highlightedMetricId, setHighlightedMetricId] = useState<string | undefined>();
  const [sourcesOn, setSourcesOn] = useState(false);
  const [onCover, setOnCover] = useState(true);

  const navigate = useCallback((id: ChapterId) => {
    setChapter(id);
    if (chapterFromHash() !== id) {
      window.history.pushState(null, '', id === 'overview' ? window.location.pathname : `#${id}`);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  const openLedger = useCallback(
    (metricId?: string) => {
      setHighlightedMetricId(metricId);
      navigate('forensic');
    },
    [navigate],
  );

  // Back / forward
  useEffect(() => {
    const sync = () => setChapter(chapterFromHash());
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  // Tab title and favicon
  useEffect(() => {
    const meta = CHAPTERS.find((c) => c.id === chapter)!;
    document.title = chapter === 'overview' ? 'FASAL — Katarniaghat, 2021–2026' : `${meta.name} — FASAL`;
    let icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.type = 'image/svg+xml';
    icon.href = FAVICON;
  }, [chapter]);

  // "Show sources": print the survey cell under every figure. Toggle with S.
  useEffect(() => {
    document.documentElement.dataset.sources = sourcesOn ? 'on' : 'off';
  }, [sourcesOn]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 's' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      setSourcesOn((v) => !v);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // The bar is transparent while it sits over the overview cover.
  useEffect(() => {
    const measure = () => {
      const cover = document.getElementById('cover');
      setOnCover(!!cover && cover.getBoundingClientRect().bottom > 64);
    };
    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [chapter]);

  const props = { onOpenLedger: openLedger, onNavigate: navigate };

  return (
    <div className="min-h-dvh flex flex-col bg-paper text-ink">
      <a
        href="#chapter-panel"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
      >
        Skip to content
      </a>
      <TopBar
        active={chapter}
        onNavigate={navigate}
        onCover={onCover && chapter === 'overview'}
        sourcesOn={sourcesOn}
        onToggleSources={() => setSourcesOn((v) => !v)}
      />

      <main id="chapter-panel" role="tabpanel" aria-labelledby={`tab-${chapter}`} className="flex-1">
        <div key={chapter} className="chapter-in">
          {chapter === 'overview' && <OverviewChapter {...props} />}
          {chapter === 'income' && <IncomeChapter {...props} />}
          {chapter === 'rf' && <RFChapter {...props} />}
          {chapter === 'rights' && <RightsChapter {...props} />}
          {chapter === 'nutrition' && <NutritionChapter {...props} />}
          {chapter === 'forensic' && <ForensicChapter {...props} highlightedMetricId={highlightedMetricId} />}
        </div>
        <NextChapter active={chapter} onNavigate={navigate} />
      </main>

      <Footer onNavigate={navigate} />
      <EvidenceDrawer onOpenLedger={openLedger} />
    </div>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <EvidenceProvider>
      <Shell />
    </EvidenceProvider>
  </ThemeProvider>
);

export default App;
