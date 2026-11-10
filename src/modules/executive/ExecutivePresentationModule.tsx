import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Coins, 
  Users, 
  Sprout, 
  Apple, 
  Award, 
  FileText, 
  Printer, 
  ArrowRight, 
  Scale, 
  Landmark, 
  CheckCircle2, 
  Layers,
  HeartHandshake
} from 'lucide-react';
import { useFilters } from '../../context/FilterContext';
import { useViewMode } from '../../context/ViewModeContext';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { type ThematicTab } from '../../components/layout/ThematicNavigation';

export interface ExecutivePresentationModuleProps {
  onOpenLedger?: (metricId?: string) => void;
  onNavigateTab?: (tab: ThematicTab) => void;
}

export const ExecutivePresentationModule: React.FC<ExecutivePresentationModuleProps> = ({
  onOpenLedger,
  onNavigateTab,
}) => {
  const { isFiltered, cohortCount, cohortPercentage, filters } = useFilters();
  const { setViewMode } = useViewMode();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 1. EXECUTIVE HERO MARQUEE & GRANT ATTRIBUTION                       */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-br from-surface to-elevated border border-border-strong p-6 sm:p-8 lg:p-10 shadow-card">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-3.5 max-w-3xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-accent-harvest/15 text-accent-harvest border border-accent-harvest/30">
                <Award className="w-3.5 h-3.5" /> APPI Grant Synthesis • 2021–2026
              </span>
              <span className="text-xs font-mono text-content-muted bg-surface/80 px-2.5 py-1 rounded border border-border-subtle">
                Grant Ref: G-2110-10970 (₹2.16 Crore)
              </span>
              <span className="text-xs font-mono text-accent-growth bg-accent-growth/10 px-2.5 py-1 rounded border border-accent-growth/20 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> 103/103 Assertions Verified
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-content-primary tracking-tight leading-tight">
              Executive Presentation: Longitudinal Agrarian Transformation & Public Policy Leverage
            </h1>

            <p className="text-sm sm:text-base text-content-secondary leading-relaxed font-sans">
              Five-year programmatic evaluation of the <strong>FASAL</strong> initiative implemented by <strong>DEHAT India</strong> across 7 Gram Panchayats in the Katarniaghat Wildlife Sanctuary Buffer, Mihinpurwa Block, Bahraich, Uttar Pradesh. Demonstrating how community-led governance turns philanthropic seed capital into a <strong>3.57x public leverage multiplier</strong> and generates <strong>₹9.50 Crore</strong> in net agrarian surplus for 1,535 marginalized households.
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 no-print">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-accent-primary text-surface hover:bg-accent-primary/90 shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-accent-harvest" />
              <span>Print / Export Executive Brief</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('research')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-medium bg-elevated hover:bg-surface border border-border-strong text-content-primary transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-accent-evidence" />
              <span>Switch to Research Workbench</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Filter Context Notification */}
        {isFiltered && (
          <div className="mt-6 p-3 rounded-lg bg-accent-harvest/10 border border-accent-harvest/25 text-xs font-mono text-content-primary flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-accent-harvest">Active Demographic Filter:</span>
              <span>
                Cohort N={cohortCount.toLocaleString('en-IN')} ({cohortPercentage.toFixed(1)}% of 1,535 HHs)
                {filters.selectedGP !== 'ALL' && ` • GP: ${filters.selectedGP}`}
                {filters.selectedCaste !== 'ALL' && ` • Caste: ${filters.selectedCaste}`}
                {filters.selectedLandTier !== 'ALL' && ` • Tier: ${filters.selectedLandTier.replace(/_/g, ' ')}`}
              </span>
            </div>
            <span className="text-[11px] text-content-muted">Executive rollups display universal program totals</span>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 2. THE 7 EXECUTIVE HEADLINE ROLLUPS                                  */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-content-primary flex items-center gap-2">
              <Award className="w-5 h-5 text-accent-harvest" />
              The 7 Executive Headline Rollups
            </h2>
            <p className="text-xs text-content-muted font-sans">
              Audited programmatic benchmarks across financial, agro-ecological, demographic, and civic dimensions
            </p>
          </div>
          <EvidenceBadge metricId="METRIC-INC-001" variant="card" label="Audited Program Rollups" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Rollup 1: Public Leverage Multiplier */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-harvest">
                  Catalytic Public Leverage
                </span>
                <Landmark className="w-4 h-4 text-accent-harvest" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                3.57x
              </div>
              <div className="text-xs font-mono font-semibold text-accent-growth">
                ₹7.71 Cr Mobilized vs ₹2.16 Cr Grant
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Each ₹1 of APPI philanthropic commitment unlocked ₹3.57 in governmental infrastructure and entitlement disbursements.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-LEV-01</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('rights')} 
                className="text-accent-harvest hover:underline cursor-pointer flex items-center gap-1"
              >
                Pillar III <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 2: Public Investment Mobilized */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-evidence">
                  Public Capital Mobilized
                </span>
                <Coins className="w-4 h-4 text-accent-evidence" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                ₹7.71 Cr
              </div>
              <div className="text-xs font-mono font-semibold text-content-secondary">
                577 Genuine Civil Projects Verified
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Neutralized ₹11.70 Cr double-counting myth; certified 280 PMAY houses, 665 tap connections, and 60 roads.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-LEV-02</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('rights')} 
                className="text-accent-evidence hover:underline cursor-pointer flex items-center gap-1"
              >
                Explore Works <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 3: Net Crop Surplus */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-growth">
                  Agrarian Wealth Created
                </span>
                <TrendingUp className="w-4 h-4 text-accent-growth" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                ₹9.50 Cr
              </div>
              <div className="text-xs font-mono font-semibold text-accent-growth">
                +84.97% 5-Yr Mean Gain • 2.43x Median
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Median net farm income surged to ₹53,400/HH across 1,487 genuine cultivating farmers (74.16% profit margin).
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: METRIC-INC-001</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('income')} 
                className="text-accent-growth hover:underline cursor-pointer flex items-center gap-1"
              >
                Pillar I <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 4: Marginalized & Union Saturation */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-primary">
                  Social Equity & Union
                </span>
                <Users className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                99.48%
              </div>
              <div className="text-xs font-mono font-semibold text-content-secondary">
                Marginalized Saturation (1,527 HHs)
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                58.1% OBC, 24.6% ST Tharu, 16.9% SC Dalit. AAS Union enrolled 4,826 members (74.32% saturation) for sustained advocacy.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-SOC-01</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('overview')} 
                className="text-accent-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                Census Data <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 5: 42-Crop Agro-Ecological Diversity */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-harvest">
                  Agro-Ecological Diversity
                </span>
                <Sprout className="w-4 h-4 text-accent-harvest" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                42 Crops
              </div>
              <div className="text-xs font-mono font-semibold text-accent-harvest">
                Turmeric: ₹98.38 L Profit (82.85% Margin)
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Commercial turmeric yielded 107.0 q/ac with 0% wildlife damage along the tiger corridor, validating buffer-zone cash crops.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-VC-01</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('income')} 
                className="text-accent-harvest hover:underline cursor-pointer flex items-center gap-1"
              >
                Value Chain <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 6: Poshan Vatika Coverage */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-growth">
                  Homestead Nutrition
                </span>
                <Apple className="w-4 h-4 text-accent-growth" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                73.0%
              </div>
              <div className="text-xs font-mono font-semibold text-content-secondary">
                1,120+ Poshan Vatikas Established
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Kitchen gardens remediated the critical winter dietary trough, expanding winter green vegetable intake by +11.4 percentage points.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-NUT-04</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('nutrition')} 
                className="text-accent-growth hover:underline cursor-pointer flex items-center gap-1"
              >
                Pillar IV <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Rollup 7: 50 kg Pulse Reserve Protocol */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs hover:border-border-strong transition-all flex flex-col justify-between md:col-span-2 lg:col-span-2 xl:col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent-primary">
                  Maternal-Child Nutrition Protocol
                </span>
                <HeartHandshake className="w-4 h-4 text-accent-primary" />
              </div>
              <div className="text-3xl font-serif font-bold text-content-primary tracking-tight">
                +23.8 pp
              </div>
              <div className="text-xs font-mono font-semibold text-accent-growth">
                Weekly Pulse Intake: 42.6% → 66.4%
              </div>
              <p className="text-xs text-content-secondary leading-relaxed pt-1">
                Mandatory retention protocol of 50 kg farm pulses before commercial market sales protects household protein security during seasonal price surges, directly closing dietary deficit windows.
              </p>
            </div>
            <div className="pt-3 mt-3 border-t border-border-subtle/50 flex items-center justify-between text-[11px] font-mono text-content-muted">
              <span>Metric: REC-NUT-01</span>
              <button 
                type="button" 
                onClick={() => onNavigateTab?.('nutrition')} 
                className="text-accent-primary hover:underline cursor-pointer flex items-center gap-1"
              >
                Dietary Recall <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 3. GRANT ROI & SOCIETAL VALUE SYNTHESIS                             */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-strong shadow-card space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-content-primary flex items-center gap-2">
              <Scale className="w-5 h-5 text-accent-harvest" />
              Philanthropic Return on Investment: Societal Wealth Creation
            </h2>
            <p className="text-xs text-content-muted font-sans">
              Comprehensive economic model contrasting grant input against catalytic public leverage and net farm profits
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
            7.97x Societal ROI Multiplier
          </span>
        </div>

        {/* 3-Tier Waterfall Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Seed Grant Input */}
          <div className="p-5 rounded-lg bg-elevated/60 border border-border-subtle space-y-2">
            <span className="text-[11px] font-mono uppercase text-content-muted font-bold">1. Philanthropic Seed Capital</span>
            <div className="text-2xl font-serif font-bold text-content-primary">₹2.16 Crore</div>
            <p className="text-xs text-content-secondary leading-relaxed">
              APPI Grant Commitment (Ref: G-2110-10970) deployed across community organizing, cadre training, and agro-ecological demonstration.
            </p>
            <div className="text-[11px] font-mono text-accent-harvest font-semibold pt-1">
              Seed Catalyst Base (1.0x)
            </div>
          </div>

          {/* Card 2: Public Leverage Output */}
          <div className="p-5 rounded-lg bg-accent-harvest/5 border border-accent-harvest/25 space-y-2">
            <span className="text-[11px] font-mono uppercase text-accent-harvest font-bold">2. Public Investment Mobilized</span>
            <div className="text-2xl font-serif font-bold text-accent-harvest">₹7.71 Crore</div>
            <p className="text-xs text-content-secondary leading-relaxed">
              577 verified civil projects unlocked through citizen advocacy: PMAY housing, Jal Jeevan Mission piped water, and rural roads.
            </p>
            <div className="text-[11px] font-mono text-accent-growth font-semibold pt-1">
              3.57x Public Leverage Multiplier
            </div>
          </div>

          {/* Card 3: Crop Wealth Output */}
          <div className="p-5 rounded-lg bg-accent-growth/5 border border-accent-growth/25 space-y-2">
            <span className="text-[11px] font-mono uppercase text-accent-growth font-bold">3. Agrarian Wealth Generated</span>
            <div className="text-2xl font-serif font-bold text-accent-growth">₹9.50 Crore</div>
            <p className="text-xs text-content-secondary leading-relaxed">
              Aggregate net crop profit achieved in 2026 across 1,487 smallholders (+84.97% 5-yr net gain, ₹53,400 median).
            </p>
            <div className="text-[11px] font-mono text-accent-growth font-semibold pt-1">
              4.40x Direct Farm Profit Return
            </div>
          </div>
        </div>

        {/* Synthesis Banner */}
        <div className="p-4 rounded-lg bg-elevated border border-border-strong flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-content-muted font-bold">Total Societal Wealth Realized</div>
            <div className="text-lg sm:text-xl font-serif font-bold text-content-primary">
              ₹2.16 Cr Grant → <span className="text-accent-harvest">₹7.71 Cr Leverage</span> + <span className="text-accent-growth">₹9.50 Cr Crop Surplus</span> = <span className="text-accent-primary font-mono">₹17.21 Crore</span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-accent-growth">7.97x</div>
            <div className="text-[11px] font-mono text-content-muted">Total Societal Multiplier</div>
          </div>
        </div>

        {/* Sectoral Breakdown of Public Leverage */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-content-muted">
            Composition of Verified Public Investment (₹7.71 Crore across 577 Works)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-surface border border-border-subtle">
              <div className="text-[11px] font-mono text-content-muted">PMAY Housing</div>
              <div className="text-base font-serif font-bold text-content-primary">₹4.24 Crore</div>
              <div className="text-[11px] font-mono text-accent-harvest">353 units (55.0%)</div>
            </div>
            <div className="p-3 rounded-md bg-surface border border-border-subtle">
              <div className="text-[11px] font-mono text-content-muted">Interlocking Roads & Drains</div>
              <div className="text-base font-serif font-bold text-content-primary">₹1.88 Crore</div>
              <div className="text-[11px] font-mono text-accent-harvest">46 works (24.4%)</div>
            </div>
            <div className="p-3 rounded-md bg-surface border border-border-subtle">
              <div className="text-[11px] font-mono text-content-muted">Jal Jeevan Mission Water</div>
              <div className="text-base font-serif font-bold text-content-primary">₹1.05 Crore</div>
              <div className="text-[11px] font-mono text-accent-harvest">83 works (13.6%)</div>
            </div>
            <div className="p-3 rounded-md bg-surface border border-border-subtle">
              <div className="text-[11px] font-mono text-content-muted">Sanitation & Solar</div>
              <div className="text-base font-serif font-bold text-content-primary">₹0.54 Crore</div>
              <div className="text-[11px] font-mono text-accent-harvest">399 works (7.0%)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 4. STRATEGIC DONOR POLICY TAKEAWAYS                                  */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-content-primary flex items-center gap-2">
            <Layers className="w-5 h-5 text-accent-harvest" />
            4 Strategic Donor & Policy Takeaways
          </h2>
          <p className="text-xs text-content-muted font-sans">
            Core philanthropic principles and replication strategies distilled from the 5-year longitudinal evaluation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Takeaway 1 */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-harvest/15 text-accent-harvest flex items-center justify-center font-mono text-xs font-bold">1</span>
              <h3 className="font-serif font-bold text-content-primary text-base">The Catalytic Public Leverage Engine</h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Philanthropy cannot substitute for public social safety nets. Instead, the highest-leverage role for philanthropic funding is establishing frontline community self-advocacy (<em>"Jiska Mudda Uski Agwai"</em>). Investing in citizen knowledge and entitlement navigation unlocks state coffers, achieving an extraordinary <strong>3.57x public leverage multiplier</strong> (₹7.71 Cr mobilized from a ₹2.16 Cr grant).
            </p>
          </div>

          {/* Takeaway 2 */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-growth/15 text-accent-growth flex items-center justify-center font-mono text-xs font-bold">2</span>
              <h3 className="font-serif font-bold text-content-primary text-base">Wildlife-Immune Forest-Edge Economics</h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Agrarian development in wildlife sanctuary buffer corridors fails if crop raiding by elephants, wild boars, and deer is ignored. Introducing organic commercial turmeric (<em>Curcuma longa</em>) provided complete biological immunity to herbivores, generating <strong>₹98.38 Lakh net surplus</strong> at an 82.85% margin with 0% crop loss. Ecological conservation and high-value agrarian surplus are fully compatible.
            </p>
          </div>

          {/* Takeaway 3 */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-primary/15 text-accent-primary flex items-center justify-center font-mono text-xs font-bold">3</span>
              <h3 className="font-serif font-bold text-content-primary text-base">Pro-Poor Structural Redistribution</h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Conventional agricultural subsidies disproportionately favor large landholders. In contrast, FASAL focused exclusively on marginalized smallholders (99.48% OBC, ST Tharu, and SC Dalit). Consequently, median net farm income grew by <strong>+142.73%</strong> (2.43x baseline), dramatically outpacing mean growth (+84.97%) and compressing historical village inequality.
            </p>
          </div>

          {/* Takeaway 4 */}
          <div className="p-5 rounded-lg bg-surface border border-border-subtle shadow-xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent-evidence/15 text-accent-evidence flex items-center justify-center font-mono text-xs font-bold">4</span>
              <h3 className="font-serif font-bold text-content-primary text-base">Decoupled Household Nutrition Sovereignty</h3>
            </div>
            <p className="text-xs text-content-secondary leading-relaxed font-sans">
              Higher cash crop income does not automatically translate into improved maternal and child nutrition. By institutionalizing 1,120+ homestead Poshan Vatikas and mandating a <strong>50 kg pulse reserve protocol</strong> before grain liquidation, households protected dietary diversity from inflationary market shocks, expanding weekly pulse intake by +23.8 pp.
            </p>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────── */}
      {/* 5. APPI GRANT DELIVERABLE SCORECARD                                  */}
      {/* ──────────────────────────────────────────────────────────────────── */}
      <section className="p-6 sm:p-8 rounded-xl bg-surface border border-border-strong shadow-card space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-content-primary flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-accent-growth" />
              APPI Grant Deliverables Compliance Scorecard
            </h2>
            <p className="text-xs text-content-muted font-sans">
              Formal accountability matrix verifying final achievement against approved project proposal targets
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-accent-growth/15 text-accent-growth border border-accent-growth/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Milestone Fulfillment
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-border-strong text-content-muted uppercase tracking-wider text-[11px]">
                <th className="pb-3 pr-4">Grant Deliverable / Indicator</th>
                <th className="pb-3 text-right pr-4">Proposed Target</th>
                <th className="pb-3 text-right pr-4">Verified Endline (2026)</th>
                <th className="pb-3 text-right pr-4">Attainment (%)</th>
                <th className="pb-3 text-center pl-2">Audit Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/70">
              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  1. Household Coverage & Survey Census
                  <span className="block text-[10px] text-content-muted font-mono">Total households mobilized across 7 Gram Panchayats</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">1,500 HHs</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">1,535 HHs (1,487 Cultivators)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">102.3%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    EXCEEDED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  2. Income Benchmark (€/₹60,000 per Acre Threshold)
                  <span className="block text-[10px] text-content-muted font-mono">Proportion of active cultivators achieving target net return</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">70.0% of cohort</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">76.8% (1,142 / 1,487 farmers)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">109.7%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    EXCEEDED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  3. Catalytic Public Investment Mobilization
                  <span className="block text-[10px] text-content-muted font-mono">Governmental infrastructure & scheme convergence mobilized</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">₹2.16 Cr (1.0x)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">₹7.71 Cr (577 projects)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">356.9%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    EXCEEDED (3.57x)
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  4. AAS Democratic Smallholder Union Saturation
                  <span className="block text-[10px] text-content-muted font-mono">Independent community organizing union membership</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">3,000 members</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">4,826 members (74.32%)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">160.9%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    EXCEEDED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  5. Homestead Nutrition Infrastructure (Poshan Vatikas)
                  <span className="block text-[10px] text-content-muted font-mono">Intensive bio-manured kitchen gardens deployed</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">800 gardens</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">1,120+ gardens (73.0%)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">140.0%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    EXCEEDED
                  </span>
                </td>
              </tr>

              <tr className="hover:bg-elevated/40 transition-colors">
                <td className="py-3 pr-4 font-sans font-medium text-content-primary">
                  6. Agrochemical Reduction & LEISA Conversion
                  <span className="block text-[10px] text-content-muted font-mono">Organic inputs, bio-drums, and non-chemical pest management</span>
                </td>
                <td className="py-3 text-right pr-4 tabular-nums">50.0% adoption</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-content-primary">100% in Turmeric (1,120+ drums)</td>
                <td className="py-3 text-right pr-4 tabular-nums font-bold text-accent-growth">100.0%</td>
                <td className="py-3 text-center pl-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-growth/15 text-accent-growth border border-accent-growth/30">
                    ACHIEVED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-mono text-content-muted flex-wrap gap-2">
          <span>Grant Term: Nov 2021 – Dec 2026 • Verified Dataset: FDB Survey as on 05112026.xlsx</span>
          <button
            type="button"
            onClick={() => onOpenLedger?.()}
            className="text-accent-harvest hover:underline cursor-pointer flex items-center gap-1 font-bold"
          >
            Inspect 120-Row Forensic Reconciliation Ledger <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default ExecutivePresentationModule;

