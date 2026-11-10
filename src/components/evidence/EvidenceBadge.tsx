import React from 'react';
import { ShieldCheck, FileSpreadsheet, ExternalLink } from 'lucide-react';
import { useEvidence } from '../../context/EvidenceContext';
import type { EvidenceBadgeProps } from '../../types/evidence';

export const EvidenceBadge: React.FC<EvidenceBadgeProps> = ({
  metricId,
  variant = 'card',
  showValue = false,
  label,
  showIcon = true,
  className = '',
  ariaLabel,
}) => {
  const { openDrawer, getMetric } = useEvidence();
  const metric = getMetric(metricId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDrawer(metricId);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openDrawer(metricId);
    }
  };

  const coordinates = metric?.provenance.cellCoordinates 
    ? `${metric.provenance.sheetName}!${metric.provenance.cellCoordinates}`
    : metric?.provenance.sheetName || 'Ledger Ref';

  const defaultAriaLabel = ariaLabel || `Inspect verified provenance for ${metric?.label || metricId}`;

  // Variant 1: Subtle (Icon only, micro footprint)
  if (variant === 'subtle') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={defaultAriaLabel}
        title={`Audit Provenance: ${coordinates}`}
        className={`inline-flex items-center justify-center p-1 rounded hover:bg-accent-evidence/15 text-accent-evidence transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-accent-evidence/50 cursor-pointer ${className}`}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
      </button>
    );
  }

  // Variant 2: Inline (Superscript/compact beside a number)
  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={defaultAriaLabel}
        title={`Inspect cell coordinates: ${coordinates}`}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono tracking-tight font-medium bg-accent-evidence/10 text-accent-evidence hover:bg-accent-evidence/20 border border-accent-evidence/20 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-accent-evidence/40 cursor-pointer ${className}`}
      >
        {showIcon && <ShieldCheck className="w-2.5 h-2.5" />}
        <span>{showValue && metric ? `${metric.verifiedValue}` : (label || coordinates)}</span>
      </button>
    );
  }

  // Variant 3: Pill (Audit status tag with verified checkmark)
  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={defaultAriaLabel}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-accent-growth/10 text-accent-growth hover:bg-accent-growth/20 border border-accent-growth/25 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-growth/30 cursor-pointer ${className}`}
      >
        {showIcon && <ShieldCheck className="w-3 h-3 text-accent-growth" />}
        <span>{label || '100% Verified'}</span>
      </button>
    );
  }

  // Variant 4: Button (Full interactive callout button)
  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={defaultAriaLabel}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium bg-surface hover:bg-elevated text-content-primary border border-border-strong shadow-xs hover:border-accent-evidence/50 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent-evidence/40 cursor-pointer ${className}`}
      >
        <FileSpreadsheet className="w-3.5 h-3.5 text-accent-evidence" />
        <span>{label || `Inspect Provenance (${coordinates})`}</span>
        <ExternalLink className="w-3 h-3 text-content-muted" />
      </button>
    );
  }

  // Variant 5: Card Footer / Header Default ('card')
  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={defaultAriaLabel}
      title="Click to view cell coordinate audit and Python assertion"
      className={`group inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-content-muted hover:text-accent-evidence hover:bg-accent-evidence/10 border border-transparent hover:border-accent-evidence/25 transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-accent-evidence/40 cursor-pointer ${className}`}
    >
      {showIcon && (
        <ShieldCheck className="w-3 h-3 text-accent-evidence/70 group-hover:text-accent-evidence transition-colors" />
      )}
      <span className="truncate max-w-[160px] sm:max-w-none">
        {showValue && metric ? `${metric.verifiedValue} (${coordinates})` : (label || `Source: ${coordinates}`)}
      </span>
    </button>
  );
};

export default EvidenceBadge;

