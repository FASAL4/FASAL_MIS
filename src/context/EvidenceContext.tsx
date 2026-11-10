import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { MetricProvenance, EvidenceContextType } from '../types/evidence';
import evidenceLedgerRaw from '../data/evidenceLedger.json';

// Type-safe registry cast
const evidenceRegistry = evidenceLedgerRaw as unknown as Record<string, MetricProvenance>;

const EvidenceContext = createContext<EvidenceContextType | undefined>(undefined);

export const EvidenceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeMetricId, setActiveMetricId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeMetric = useMemo(() => {
    if (!activeMetricId) return null;
    return evidenceRegistry[activeMetricId] || null;
  }, [activeMetricId]);

  const openDrawer = useCallback((metricId: string) => {
    if (evidenceRegistry[metricId]) {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      setActiveMetricId(metricId);
      setIsOpen(true);
    } else {
      console.warn(`[EvidenceContext] Metric ID "${metricId}" not found in evidence registry.`);
    }
  }, []);

  const closeDrawer = useCallback(() => {
    setIsOpen(false);
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setActiveMetricId(null);
      closeTimerRef.current = null;
    }, 250);
  }, []);

  // Cleanup pending timer on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const getMetric = useCallback((metricId: string): MetricProvenance | undefined => {
    return evidenceRegistry[metricId];
  }, []);

  // Lock body scroll & listen for Escape key when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeDrawer]);

  const value = useMemo<EvidenceContextType>(
    () => ({
      activeMetricId,
      activeProvenance: activeMetric,
      activeMetric,
      isOpen,
      openEvidence: openDrawer,
      openDrawer,
      closeEvidence: closeDrawer,
      closeDrawer,
      getProvenance: getMetric,
      getMetric,
      registry: evidenceRegistry,
    }),
    [activeMetricId, activeMetric, isOpen, openDrawer, closeDrawer, getMetric]
  );

  return <EvidenceContext.Provider value={value}>{children}</EvidenceContext.Provider>;
};

export const useEvidence = (): EvidenceContextType => {
  const context = useContext(EvidenceContext);
  if (!context) {
    throw new Error('useEvidence must be used within an EvidenceProvider');
  }
  return context;
};

