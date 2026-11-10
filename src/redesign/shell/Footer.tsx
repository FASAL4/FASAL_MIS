import React from 'react';
import { ArrowRight } from 'lucide-react';
import { fasalMasterData } from '@/data/fasalMasterData';
import { CHAPTERS, type ChapterId } from '../chapters';

/** The big "next chapter" link that closes every chapter. */
export const NextChapter: React.FC<{ active: ChapterId; onNavigate: (id: ChapterId) => void }> = ({
  active,
  onNavigate,
}) => {
  const i = CHAPTERS.findIndex((c) => c.id === active);
  const next = CHAPTERS[(i + 1) % CHAPTERS.length];
  const wrapsAround = i === CHAPTERS.length - 1;
  return (
    <div className="wrap no-print">
      <button type="button" className="next" onClick={() => onNavigate(next.id)}>
        <span>
          <span className="t-label block mb-4">
            {wrapsAround ? 'Back to the start' : `Next · ${next.no ? `Chapter ${next.no}` : next.name}`}
          </span>
          <span className="next-title">{wrapsAround ? 'Overview' : next.teaser}</span>
        </span>
        <ArrowRight size={44} strokeWidth={1} aria-hidden="true" />
      </button>
    </div>
  );
};

export const Footer: React.FC<{ onNavigate: (id: ChapterId) => void }> = ({ onNavigate }) => {
  const meta = fasalMasterData.metadata;
  const cut = new Date(meta.datasetCutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  return (
    <footer className="foot">
      <div className="wrap foot-grid">
        <div>
          <div className="flex items-baseline gap-3 text-ink">
            <span className="mark-hi" lang="hi" aria-hidden="true">
              फ़सल
            </span>
            <span className="mark-en">FASAL</span>
          </div>
          <p className="mt-3 max-w-[46ch]">
            Farmers’ Action for Sustainable Agro-based Livelihoods. Implemented by <strong>DEHAT India</strong> with a
            grant from <strong>Azim Premji Philanthropic Initiatives</strong> ({meta.grantRef}), {meta.lifecycleSpan}.
          </p>
        </div>
        <div>
          <div className="t-label mb-3">Dataset</div>
          <p>
            <strong>FDB Survey as on 05112026.xlsx</strong>
            <br />
            Cut {cut} · 1,535 households
            <br />
            <span className="t-mono">sha-256 {meta.datasetSha256.slice(0, 16)}…</span>
          </p>
        </div>
        <div>
          <div className="t-label mb-3">Integrity</div>
          <p>
            <strong>103 of 103</strong> programmatic assertions pass.
            <br />
            No personal names or phone numbers are published.
          </p>
          <button type="button" className="link mt-3 no-print" onClick={() => onNavigate('forensic')}>
            Read the evidence chapter <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
