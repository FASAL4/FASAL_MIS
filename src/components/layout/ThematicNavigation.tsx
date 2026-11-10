import React, { useRef } from 'react';
import { 
  Compass, 
  TrendingUp, 
  Sprout, 
  Scale, 
  Apple, 
  FileSearch 
} from 'lucide-react';
import { useViewMode } from '../../context/ViewModeContext';

export type ThematicTab = 'overview' | 'income' | 'rf' | 'rights' | 'nutrition' | 'forensic';

export interface TabItem {
  id: ThematicTab;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const RESEARCH_TABS: TabItem[] = [
  { id: 'overview', label: 'Executive Overview', shortLabel: 'Overview', icon: Compass },
  { id: 'income', label: 'Pillar I: Income Security', shortLabel: 'Income', icon: TrendingUp },
  { id: 'rf', label: 'Pillar II: RF & LEISA', shortLabel: 'RF & LEISA', icon: Sprout },
  { id: 'rights', label: 'Pillar III: Rights & Entitlements', shortLabel: 'Rights', icon: Scale },
  { id: 'nutrition', label: 'Pillar IV: Nutrition & Inclusion', shortLabel: 'Nutrition', icon: Apple },
  { id: 'forensic', label: 'Forensic Audit Ledger', shortLabel: 'Audit Ledger', icon: FileSearch },
];

export const EXECUTIVE_TABS: TabItem[] = [
  { id: 'overview', label: 'Executive Brief & ROI', shortLabel: 'Executive', icon: Compass },
  { id: 'income', label: 'Pillar I: Income & Spices', shortLabel: 'Income', icon: TrendingUp },
  { id: 'rf', label: 'Pillar II: Agro-Ecology (RF)', shortLabel: 'Agro-Ecology', icon: Sprout },
  { id: 'rights', label: 'Pillar III: Public Leverage', shortLabel: 'Public Leverage', icon: Scale },
  { id: 'nutrition', label: 'Pillar IV: Nutrition Security', shortLabel: 'Nutrition', icon: Apple },
];

export interface ThematicNavigationProps {
  activeTab: ThematicTab;
  onTabChange: (tab: ThematicTab) => void;
}

export const ThematicNavigation: React.FC<ThematicNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const { isExecutive } = useViewMode();
  const navRef = useRef<HTMLDivElement>(null);

  const tabs = isExecutive ? EXECUTIVE_TABS : RESEARCH_TABS;

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (index + 1) % tabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (index - 1 + tabs.length) % tabs.length;
    }

    if (nextIndex >= 0) {
      e.preventDefault();
      onTabChange(tabs[nextIndex].id);
      const buttons = navRef.current?.querySelectorAll<HTMLButtonElement>('button[role="tab"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <nav 
      aria-label="Thematic Pillar Navigation" 
      className="bg-surface border-b border-border-strong sticky top-[110px] z-20 transition-colors duration-200 no-print"
    >
      <div 
        ref={navRef}
        role="tablist" 
        className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto scroll-smooth"
      >
        <div className="flex items-center gap-1 sm:gap-2">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onTabChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`group flex items-center gap-2 py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary cursor-pointer ${
                  isActive
                    ? 'border-accent-harvest text-content-primary font-semibold'
                    : 'border-transparent text-content-muted hover:text-content-primary hover:border-border-subtle'
                }`}
              >
                <Icon 
                  className={`w-4 h-4 transition-colors ${
                    isActive 
                      ? 'text-accent-harvest' 
                      : 'text-content-muted group-hover:text-content-secondary'
                  }`} 
                />
                <span className="hidden md:inline">{tab.label}</span>
                <span className="inline md:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {isExecutive && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-content-muted pr-2">
            <span>Executive Presentation Mode</span>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ThematicNavigation;
