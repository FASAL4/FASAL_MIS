import React, { createContext, useContext, useState, useEffect } from 'react';

export type ViewMode = 'executive' | 'research';

export interface ViewModeContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  isExecutive: boolean;
  isResearch: boolean;
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined);

const VIEW_MODE_STORAGE_KEY = 'fasal-view-mode-preference';

export const ViewModeProvider: React.FC<{
  children: React.ReactNode;
  defaultMode?: ViewMode;
}> = ({ children, defaultMode = 'executive' }) => {
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
        if (stored === 'executive' || stored === 'research') {
          return stored;
        }
      } catch {
        // Fallback on restricted storage
      }
    }
    return defaultMode;
  });

  useEffect(() => {
    try {
      localStorage.setItem(VIEW_MODE_STORAGE_KEY, viewMode);
    } catch {
      // Storage quota / sandbox
    }
  }, [viewMode]);

  const setViewMode = (mode: ViewMode) => {
    setViewModeState(mode);
  };

  const toggleViewMode = () => {
    setViewModeState((prev) => (prev === 'executive' ? 'research' : 'executive'));
  };

  const value: ViewModeContextType = {
    viewMode,
    setViewMode,
    toggleViewMode,
    isExecutive: viewMode === 'executive',
    isResearch: viewMode === 'research',
  };

  return <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>;
};

export const useViewMode = (): ViewModeContextType => {
  const context = useContext(ViewModeContext);
  if (!context) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};

export default ViewModeContext;

