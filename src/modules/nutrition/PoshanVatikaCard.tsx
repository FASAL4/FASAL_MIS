import React from 'react';
import {
  HeartPulse,
  Leaf,
  Droplet,
} from 'lucide-react';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { fasalMasterData } from '../../data/fasalMasterData';
import type { NutritionData } from '../../types/dashboard';
import { formatCount } from './nutritionFormatters';

export interface PoshanVatikaCardProps {
  data?: NutritionData;
  className?: string;
}

export const PoshanVatikaCard: React.FC<PoshanVatikaCardProps> = ({
  data,
  className = '',
}) => {
  const nutrition = data || fasalMasterData.nutrition;
  const vatikas = nutrition.poshanVatikas;

  const micronutrientPillars = [
    {
      pillar: 'Iron & Folate',
      clinicalNeed: 'Attacks maternal anemia & fatigue',
      homesteadCrops: 'Spinach (Palak - 163 growers), Cultivated Bathua (248 growers), Fenugreek (Methi)',
      status: 'Active in 100% of gardens',
    },
    {
      pillar: 'Vitamin A & Carotenes',
      clinicalNeed: 'Prevents childhood night blindness & stunting',
      homesteadCrops: 'Moringa leaves (Sahjan), Papaya (Papita), Pumpkin (Kaddu), Carrots',
      status: 'Perennial homestead trees',
    },
    {
      pillar: 'Vitamin C & Immunity',
      clinicalNeed: 'Enhances biological iron absorption',
      homesteadCrops: 'Citrus lemon (Nimbu), Amla, Country Tomatoes, Chillies',
      status: 'Continuous multi-season harvest',
    },
    {
      pillar: 'Dietary Fiber & Minerals',
      clinicalNeed: 'Gut microbiome health & slow glucose release',
      homesteadCrops: 'Beetroot (Chukandar - 171 growers), Yam (Suran - 138 growers), Radish (Mooli)',
      status: 'Root & tuber resilience',
    },
  ];

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-6 ${className}`}>
      {/* 1. Header & Evidence Linkage */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-subtle pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F19: Homestead Bio-Diverse Nutrition Gardens
            </span>
            <EvidenceBadge metricId="REC-NUTR-03" variant="card" label="1,120+ Poshan Vatikas" />
            <EvidenceBadge metricId="REC-TRN-03" variant="card" label="Curriculum 8 PoP" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary">
            Poshan Vatikas: Micro-Nutrient Remediation & Greywater Circularity
          </h3>
        </div>
      </div>

      {/* 2. Top Metric Ribbon (Scale, Growth, Saturation) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-elevated border border-border-subtle space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Functional Nutrition Gardens</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-growth tabular-nums flex items-baseline gap-1.5">
            <span>{formatCount(vatikas.endlineGardensCount)}+</span>
            <span className="text-xs font-mono text-content-muted">Gardens</span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            Baseline: {vatikas.baselineGardensCount} units (5.6× expansion)
          </p>
        </div>

        <div className="p-4 rounded-lg bg-elevated border border-border-subtle space-y-1">
          <span className="text-xs font-mono text-content-muted uppercase">Household Cohort Saturation</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-content-primary tabular-nums flex items-baseline gap-1.5">
            <span>{vatikas.saturationPctOfHHs}%</span>
            <span className="text-xs font-mono text-content-muted">of 1,535 HHs</span>
          </div>
          <p className="text-[11px] text-content-secondary font-mono">
            Managed predominantly by female AAS members
          </p>
        </div>

        <div className="p-4 rounded-lg bg-accent-growth/5 border border-accent-growth/20 space-y-1">
          <span className="text-xs font-mono text-accent-growth uppercase font-bold">Winter Trough Remediation</span>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-accent-growth tabular-nums flex items-baseline gap-1.5">
            <span>+11.4 pp</span>
            <span className="text-xs font-mono text-content-muted">Lift</span>
          </div>
          <p className="text-[11px] text-accent-growth font-mono">
            Winter greens raised from 31.4% to 42.8%
          </p>
        </div>
      </div>

      {/* 3. The 4 Micronutrient Clinical Focus Pillars */}
      <div className="space-y-3">
        <h4 className="text-sm font-serif font-bold text-content-primary flex items-center gap-2">
          <HeartPulse className="w-4 h-4 text-accent-harvest" />
          The Four Micronutrient Remediation Pillars
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {micronutrientPillars.map((p) => (
            <div key={p.pillar} className="p-4 rounded-lg bg-surface border border-border-subtle space-y-2 hover:border-accent-growth/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-content-primary font-sans text-sm flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-accent-growth" />
                  {p.pillar}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-growth/10 text-accent-growth font-bold">
                  {p.status}
                </span>
              </div>
              <p className="text-accent-harvest text-[11px] font-sans">
                <strong>Clinical Target:</strong> {p.clinicalNeed}
              </p>
              <p className="text-content-secondary text-[11px] font-sans">
                <strong>Homestead Species:</strong> {p.homesteadCrops}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Ecological Circularity & 100% Zero-Chemical Policy */}
      <div className="p-4 sm:p-5 rounded-lg bg-elevated border border-border-subtle space-y-3">
        <h4 className="text-sm font-serif font-bold text-content-primary flex items-center gap-2">
          <Droplet className="w-4 h-4 text-accent-evidence" />
          Closed-Loop Agronomy: Greywater Recycling & Bio-Drum Manures
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-content-primary">Household Greywater Recycling</span>
            <p className="text-[11px] text-content-secondary font-sans leading-tight">
              Kitchen wastewater and wash runoff redirected via small gravity trenches into mulched perennial garden beds.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-content-primary">1,120 Bio-Fermentation Drums</span>
            <p className="text-[11px] text-content-secondary font-sans leading-tight">
              Homestead gardens are fortified exclusively with Jeevamrit liquid microbial washes and Ghanjeevamrit soil inoculants.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-surface border border-border-subtle space-y-1">
            <span className="font-bold text-content-primary">100% Zero Chemical Inputs</span>
            <p className="text-[11px] text-content-secondary font-sans leading-tight">
              Synthetic urea, DAP, and chemical pesticides are strictly prohibited; botanical Neemastra and Dashparni Ark provide pest defense.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoshanVatikaCard;
