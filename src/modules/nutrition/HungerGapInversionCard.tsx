import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Sun,
  Snowflake,
  Layers,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { NutritionData } from '../../types/dashboard';

export interface HungerGapInversionCardProps {
  data?: NutritionData;
  className?: string;
}

export const HungerGapInversionCard: React.FC<HungerGapInversionCardProps> = ({
  data,
  className = '',
}) => {
  const nutrition = data || fasalMasterData.nutrition;
  const veg = nutrition.foodGroupRecall.greenFoodsVegetables;

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header & Evidence Linkage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-stress/10 text-accent-stress border border-accent-stress/20">
              Feature F17: Empirical Myth Debunking
            </span>
            <EvidenceBadge metricId="REC-NUTR-02" variant="card" label="Summer Peak: 67.2%–70.4%" />
            <EvidenceBadge metricId="REC-NUTR-03" variant="card" label="Winter Trough: 31.4%➔42.8%" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary">
            Inversion of the "Summer Hunger Gap" Myth
          </h3>
        </div>
      </div>

      {/* 2. Side-by-Side Debunking Juxtaposition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: The Debunked Myth */}
        <div className="p-4 sm:p-5 rounded-lg bg-accent-stress/5 border border-accent-stress/25 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-accent-stress/15 text-accent-stress border border-accent-stress/30 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              The Debunked Myth (Historical Narrative)
            </span>
            <span className="text-[10px] font-mono text-accent-stress font-bold">DISPROVED</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-stress tabular-nums">
              31.4% (Claimed Summer Gap)
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Historical development literature alleged smallholders suffer devastating nutritional collapse during May & June ("Summer Hunger Gap"), surviving on borrowed coarse rice and wild roots.
            </p>
          </div>

          <div className="pt-2 border-t border-accent-stress/20 text-[11px] font-mono text-content-muted space-y-1">
            <div>• Alleged Summer Green Deficit: 31.4%</div>
            <div>• Alleged Winter Green Abundance: 88.6%</div>
            <div className="text-accent-stress font-bold">❌ Audit Finding: Inverted seasonal reality based on unverified assumptions.</div>
          </div>
        </div>

        {/* Right: Audited Empirical Reality */}
        <div className="p-4 sm:p-5 rounded-lg bg-accent-growth/5 border border-accent-growth/25 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-accent-growth/15 text-accent-growth border border-accent-growth/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Audited Empirical Reality (FDB Microdata)
            </span>
            <span className="text-[10px] font-mono text-accent-growth font-bold">100% VERIFIED</span>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-growth tabular-nums">
              67.2% – 70.4% (Summer Peak)
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              May & June are empirically the <strong>highest peak of green vegetable intake</strong> across the 60-month series. Multi-tier trellises and riverbeds provide daily fresh gourds, cucumber, and okra.
            </p>
          </div>

          <div className="pt-2 border-t border-accent-growth/20 text-[11px] font-mono text-content-muted space-y-1">
            <div className="flex items-center justify-between">
              <span>• Summer Harvest Peak:</span>
              <strong className="text-accent-growth">{veg.summerPeakPctRange} (May/Jun)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span>• True Winter Trough:</span>
              <strong className="text-accent-stress">{veg.winterTroughBaselinePct}% (Jan/Feb)</strong>
            </div>
            <div className="flex items-center justify-between text-accent-growth font-bold">
              <span>• Remediated Winter Endline:</span>
              <span>{veg.winterTroughEndlinePct}% (+{veg.netWinterRemediationGainPp} pp)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Agronomic Mechanisms & Remediation Proof */}
      <div className="p-4 sm:p-5 rounded-lg bg-elevated border border-border-subtle space-y-3">
        <h4 className="text-sm font-serif font-bold text-content-primary flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent-growth" />
          Agronomic Mechanisms Explaining the Seasonal Inversion
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-content-primary">
              <Sun className="w-4 h-4 text-accent-harvest" />
              <span>Why Summer is the Green Peak (67%–70%):</span>
            </div>
            <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
              777+ multi-tier bamboo-wire trellises (<em>Machan</em> systems) and riverbed sand farming cultivate heat-resilient cucurbits: bitter gourd (<em>karela</em>), bottle gourd (<em>lauki</em>), sponge gourd (<em>nenua</em>), and cucumber. These crops produce massive daily vegetative yields throughout May, June, and July.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-content-primary">
              <Snowflake className="w-4 h-4 text-accent-evidence" />
              <span>Why Winter is the True Trough (31%➔43%):</span>
            </div>
            <p className="text-[11px] text-content-secondary font-sans leading-relaxed">
              Winter frost and heavy Terai fog in December and January dramatically slow vegetative plant growth. FASAL addressed this vulnerability by introducing cold-hardy winter garden varieties (spinach, bathua, fenugreek), lifting winter green consumption by <strong>+11.4 pp (from 31.4% to 42.8%)</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HungerGapInversionCard;
