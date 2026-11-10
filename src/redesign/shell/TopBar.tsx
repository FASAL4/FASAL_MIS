import React, { useLayoutEffect, useRef, useState } from 'react';
import { Moon, Printer, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { CHAPTERS, type ChapterId } from '../chapters';

export const TopBar: React.FC<{
  active: ChapterId;
  onNavigate: (id: ChapterId) => void;
  onCover: boolean;
  sourcesOn: boolean;
  onToggleSources: () => void;
}> = ({ active, onNavigate, onCover, sourcesOn, onToggleSources }) => {
  const { theme, toggleTheme } = useTheme();
  const navRef = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<{ x: number; w: number } | null>(null);

  // Slide the indicator under the active chapter.
  useLayoutEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const btn = nav?.querySelector<HTMLButtonElement>(`[data-chapter="${active}"]`);
      if (!nav || !btn) return;
      setInk({ x: btn.offsetLeft + 12, w: btn.offsetWidth - 24 });
      const left = btn.offsetLeft - nav.clientWidth / 2 + btn.offsetWidth / 2;
      if (nav.scrollWidth > nav.clientWidth) nav.scrollTo({ left, behavior: 'smooth' });
    };
    measure();
    document.fonts?.ready.then(measure).catch(() => undefined);
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = CHAPTERS[(i + dir + CHAPTERS.length) % CHAPTERS.length];
    onNavigate(next.id);
    navRef.current?.querySelector<HTMLButtonElement>(`[data-chapter="${next.id}"]`)?.focus();
  };

  return (
    <header className="bar no-print" data-on-cover={onCover}>
      <div className="wrap bar-inner">
        <button type="button" className="mark" onClick={() => onNavigate('overview')} aria-label="FASAL — back to overview">
          <span className="mark-hi" lang="hi" aria-hidden="true">
            फ़सल
          </span>
          <span className="mark-en">FASAL</span>
        </button>

        <div className="nav" role="tablist" aria-label="Chapters" ref={navRef}>
          {CHAPTERS.map((c, i) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              id={`tab-${c.id}`}
              data-chapter={c.id}
              aria-selected={active === c.id}
              aria-controls="chapter-panel"
              tabIndex={active === c.id ? 0 : -1}
              className="nav-item"
              onClick={() => onNavigate(c.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              {c.no && <span className="nav-no">{c.no}</span>}
              {c.name}
            </button>
          ))}
          {ink && (
            <span
              className="nav-ink"
              aria-hidden="true"
              style={{ width: ink.w, transform: `translateX(${ink.x}px)` }}
            />
          )}
        </div>

        <div className="bar-actions">
          <button
            type="button"
            className="chip"
            aria-pressed={sourcesOn}
            onClick={onToggleSources}
            title="Print the survey cell under every figure (S)"
          >
            <span className="bar-hide-sm">{sourcesOn ? 'Sources shown' : 'Show sources'}</span>
            <span className="bar-show-sm">Sources</span>
            <span className="kbd bar-hide-md" aria-hidden="true">
              S
            </span>
          </button>
          <button
            type="button"
            className="chip bar-hide-lg"
            onClick={() => onNavigate('forensic')}
            title="103 of 103 programmatic assertions pass against the master dataset"
          >
            <span className="chip-dot" aria-hidden="true" />
            103 / 103 verified
          </button>
          <button
            type="button"
            className="icon-btn bar-hide-sm"
            onClick={() => window.print()}
            aria-label="Print the donor brief"
            title="Print the donor brief"
          >
            <Printer size={16} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark presentation mode' : 'Switch to light reading mode'}
            title={theme === 'light' ? 'Dark presentation mode' : 'Light reading mode'}
          >
            {theme === 'light' ? <Moon size={16} strokeWidth={1.75} /> : <Sun size={16} strokeWidth={1.75} />}
          </button>
        </div>
      </div>
    </header>
  );
};
