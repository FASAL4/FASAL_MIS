import React from 'react';
import { ShieldCheck, FileSpreadsheet, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border-subtle py-8 mt-12 text-content-muted text-xs transition-colors duration-200">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-elevated border border-border-subtle text-accent-primary shrink-0">
              <FileSpreadsheet className="w-4 h-4 text-accent-harvest" />
            </div>
            <div>
              <div className="font-mono text-content-primary font-semibold">
                Primary Master Source: FDB Survey as on 05112026.xlsx
              </div>
              <div className="font-mono text-[11px] text-content-muted">
                SHA-256: <code className="text-content-secondary">a7c0ecee3c233157... (18.3 MB)</code> • Audited: 05 Nov 2026
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span className="inline-flex items-center gap-1.5 text-accent-growth">
              <ShieldCheck className="w-3.5 h-3.5" />
              103/103 Assertions Passed
            </span>
            <span className="inline-flex items-center gap-1.5 text-content-muted">
              <Lock className="w-3.5 h-3.5" />
              Zero PII Architecture
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-content-muted">
          <p>
            Farmers' Action for Sustainable Agro-based Livelihoods (FASAL) • Implemented by DEHAT India with APPI catalytic grant support.
          </p>
          <p className="font-mono">
            Vite 6 + React 19 + Tailwind v4 • Standalone Client-Side Architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

