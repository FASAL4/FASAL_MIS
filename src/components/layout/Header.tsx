import React from 'react';
import { Sun, Moon, Printer, ShieldCheck, Sprout, Briefcase, FlaskConical } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useViewMode, type ViewMode } from '../../context/ViewModeContext';

export interface HeaderProps {
  onOpenLedger?: () => void;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenLedger, 
  viewMode: propViewMode, 
  onViewModeChange: propOnViewModeChange 
}) => {
  const { theme, toggleTheme } = useTheme();
  const contextViewMode = useViewMode();

  const activeMode = propViewMode ?? contextViewMode.viewMode;
  const setMode = propOnViewModeChange ?? contextViewMode.setViewMode;

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border-subtle transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left: Co-Branded Insignia & Title */}
        <div className="flex items-center gap-3.5">
          {/* Institutional Icon */}
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent-primary text-surface shadow-xs shrink-0">
            <Sprout className="w-5 h-5 text-accent-harvest" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono font-bold tracking-wider text-accent-harvest uppercase">
                DEHAT INDIA
              </span>
              <span className="text-content-muted text-xs">•</span>
              <span className="text-[11px] font-mono tracking-tight text-content-secondary bg-elevated px-2 py-0.5 rounded border border-border-subtle">
                APPI Grant Ref: G-2110-10970 (₹2.16 Cr)
              </span>
            </div>
            <h1 className="text-base sm:text-lg lg:text-xl font-serif font-bold text-content-primary tracking-tight leading-tight">
              FASAL: Longitudinal Agrarian Transformation Dashboard
            </h1>
            <p className="hidden sm:block text-xs text-content-muted font-sans">
              Katarniaghat Wildlife Sanctuary Buffer Corridor, Mihinpurwa Block, Bahraich, UP (2021–2026)
            </p>
          </div>
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Audience Presentation Mode Segmented Switch */}
          <div
            role="radiogroup"
            aria-label="Dashboard Presentation Mode"
            className="inline-flex items-center p-1 rounded-lg bg-elevated border border-border-strong shadow-xs shrink-0"
          >
            <button
              type="button"
              role="radio"
              aria-checked={activeMode === 'executive'}
              onClick={() => setMode('executive')}
              title="Executive & Donor Presentation Mode (High-level synthesis for leadership and board)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-primary ${
                activeMode === 'executive'
                  ? 'bg-surface text-content-primary shadow-xs font-semibold border border-border-subtle'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              <Briefcase className={`w-3.5 h-3.5 ${activeMode === 'executive' ? 'text-accent-harvest' : 'text-content-muted'}`} />
              <span className="hidden sm:inline">Executive Mode</span>
              <span className="inline sm:hidden">Exec</span>
            </button>

            <button
              type="button"
              role="radio"
              aria-checked={activeMode === 'research'}
              onClick={() => setMode('research')}
              title="Public Research Showcase Mode (Deep empirical analysis, micro-evidence & forensic ledger)"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent-primary ${
                activeMode === 'research'
                  ? 'bg-surface text-content-primary shadow-xs font-semibold border border-border-subtle'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              <FlaskConical className={`w-3.5 h-3.5 ${activeMode === 'research' ? 'text-accent-growth' : 'text-content-muted'}`} />
              <span className="hidden sm:inline">Research Mode</span>
              <span className="inline sm:hidden">Research</span>
            </button>
          </div>

          {/* Verification Pill */}
          <button
            type="button"
            onClick={onOpenLedger}
            title="103/103 Programmatic Assertions Verified against Master Dataset"
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-accent-growth/10 text-accent-growth border border-accent-growth/25 hover:bg-accent-growth/20 transition-colors cursor-pointer"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-growth opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-growth"></span>
            </span>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>103/103 Verified</span>
          </button>

          {/* Donor Brief Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            aria-label="Print or Download Executive Donor Brief (Ctrl+P)"
            title="Print or Export Executive Donor Brief (Ctrl+P / Cmd+P)"
            className="print-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-elevated hover:bg-surface border border-border-strong text-content-primary shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer print-preserve"
          >
            <Printer className="w-3.5 h-3.5 text-accent-harvest" aria-hidden="true" />
            <span className="hidden sm:inline">Export Brief</span>
            <kbd className="hidden md:inline font-mono text-[10px] text-content-muted bg-base px-1.5 py-0.5 rounded border border-border-subtle">
              Ctrl+P
            </kbd>
          </button>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Executive Presentation Dark' : 'Editorial Monograph Light'} mode`}
            title={`Toggle Theme (Current: ${theme === 'light' ? 'Editorial Monograph Light' : 'Executive Presentation Dark'})`}
            className="theme-toggle-btn p-2 rounded-md bg-elevated hover:bg-surface border border-border-strong text-content-primary transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-accent-harvest" />
            ) : (
              <Sun className="w-4 h-4 text-accent-harvest" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
