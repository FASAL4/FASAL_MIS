import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import type { CropEconomicRecord } from '../../types/dashboard';
import { EvidenceBadge } from '../../components/evidence/EvidenceBadge';
import { formatINR, formatPercent } from './incomeFormatters';

export interface CropEconomicsTableProps {
  crops: CropEconomicRecord[];
  className?: string;
  defaultCategory?: string;
  onSelectCrop?: (crop: CropEconomicRecord) => void;
}

type SortField =
  | 'netProfit2026'
  | 'grossRevenue2026'
  | 'cultivationCost2026'
  | 'growersCount2026'
  | 'netProfitMargin2026'
  | 'yoyGrowthPct';

type SortDirection = 'asc' | 'desc';

const CATEGORIES = [
  'All',
  'Cereal',
  'Cash/Spice',
  'Vegetable',
  'Pulse',
  'Oilseed',
  'Other',
] as const;

export const CropEconomicsTable: React.FC<CropEconomicsTableProps> = ({
  crops,
  className = '',
  defaultCategory = 'All',
  onSelectCrop,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(defaultCategory);
  const [sortField, setSortField] = useState<SortField>('netProfit2026');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewLimit, setViewLimit] = useState<'top10' | 'all'>('top10');
  const [expandedCropKey, setExpandedCropKey] = useState<string | null>(null);
  const [isCompact, setIsCompact] = useState(false);

  // Maximum net profit for scaling relative mini-bars
  const maxNetProfit = useMemo(() => {
    return Math.max(...crops.map((c) => c.netProfit2026), 1);
  }, [crops]);

  // Handle Sort Toggle
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and Sort Pipeline
  const filteredAndSortedCrops = useMemo(() => {
    return crops
      .filter((crop) => {
        // Category Filter
        if (selectedCategory !== 'All' && crop.category !== selectedCategory) {
          return false;
        }
        // Search Filter (matches English name, Hindi name, or category)
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim();
          const matchEnglish = crop.displayName.toLowerCase().includes(query);
          const matchHindi = crop.hindiName.toLowerCase().includes(query);
          const matchCategory = crop.category.toLowerCase().includes(query);
          if (!matchEnglish && !matchHindi && !matchCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;
        return (valA - valB) * modifier;
      });
  }, [crops, selectedCategory, searchQuery, sortField, sortDirection]);

  const displayedCrops = viewLimit === 'top10' ? filteredAndSortedCrops.slice(0, 10) : filteredAndSortedCrops;

  // Aggregate totals across all filtered crops
  const totals = useMemo(() => {
    return filteredAndSortedCrops.reduce(
      (acc, c) => {
        acc.cost += c.cultivationCost2026;
        acc.gross += c.grossRevenue2026;
        acc.net += c.netProfit2026;
        return acc;
      },
      { cost: 0, gross: 0, net: 0 }
    );
  }, [filteredAndSortedCrops]);

  return (
    <div className={`p-6 sm:p-7 rounded-xl bg-surface border border-border-subtle shadow-card space-y-5 ${className}`}>
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border-subtle pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider uppercase bg-accent-growth/10 text-accent-growth border border-accent-growth/20">
              Feature F09: Crop Economics Explorer
            </span>
            <EvidenceBadge metricId="REC-ECON-11" variant="card" label="41 Commercial Crops + Aggregate" />
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-content-primary mt-1">
            42-Crop Economics & Value Addition Explorer
          </h3>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed max-w-4xl">
            Multi-crop diversification across cereals, pulses, vegetables, oilseeds, and cash crops cultivated by 1,487 smallholders. Row 1492 Grand Total is neutralized to maintain strict empirical integrity.
          </p>
        </div>

        {/* View Controls: Limit & Density */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <div className="flex items-center p-1 rounded-lg bg-elevated border border-border-subtle">
            <button
              type="button"
              onClick={() => setViewLimit('top10')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                viewLimit === 'top10'
                  ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              Top 10 Surplus
            </button>
            <button
              type="button"
              onClick={() => setViewLimit('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all cursor-pointer ${
                viewLimit === 'all'
                  ? 'bg-surface text-content-primary shadow-xs font-bold border border-border-subtle'
                  : 'text-content-muted hover:text-content-primary'
              }`}
            >
              All {crops.length} Crops
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsCompact(!isCompact)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
              isCompact
                ? 'bg-accent-growth/15 border-accent-growth/30 text-accent-growth font-bold'
                : 'bg-elevated border-border-subtle text-content-muted hover:text-content-primary'
            }`}
          >
            {isCompact ? 'Compact View' : 'Standard View'}
          </button>
        </div>
      </div>

      {/* 2. Interactive Search and Category Filter Pills */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-content-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search crop by English name, Hindi name (गेहूं, धान), or category..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-elevated border border-border-subtle text-xs font-mono text-content-primary placeholder:text-content-muted focus:outline-none focus:ring-2 focus:ring-accent-growth/40"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? crops.length
                : crops.filter((c) => c.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-content-primary text-base font-bold shadow-xs'
                    : 'bg-elevated border border-border-subtle text-content-muted hover:text-content-primary'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. The 42-Crop Ledger Table */}
      <div className="overflow-x-auto rounded-lg border border-border-subtle">
        <table className="w-full text-left text-xs font-mono" role="table">
          <thead>
            <tr className="border-b border-border-strong bg-elevated/80 text-content-muted select-none">
              <th scope="col" className="py-2.5 px-3">
                Crop & Category
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('growersCount2026')}
                aria-sort={sortField === 'growersCount2026' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Growers</span>
                  {sortField === 'growersCount2026' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('cultivationCost2026')}
                aria-sort={sortField === 'cultivationCost2026' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Input Cost (₹)</span>
                  {sortField === 'cultivationCost2026' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('grossRevenue2026')}
                aria-sort={sortField === 'grossRevenue2026' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Gross Revenue (₹)</span>
                  {sortField === 'grossRevenue2026' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('netProfit2026')}
                aria-sort={sortField === 'netProfit2026' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>2026 Net Profit (₹)</span>
                  {sortField === 'netProfit2026' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('netProfitMargin2026')}
                aria-sort={sortField === 'netProfitMargin2026' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>Margin</span>
                  {sortField === 'netProfitMargin2026' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>

              <th
                scope="col"
                className="py-2.5 px-3 text-right cursor-pointer hover:text-content-primary"
                onClick={() => handleSort('yoyGrowthPct')}
                aria-sort={sortField === 'yoyGrowthPct' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
              >
                <div className="inline-flex items-center gap-1 justify-end">
                  <span>YoY Growth</span>
                  {sortField === 'yoyGrowthPct' ? (
                    sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowUpDown className="w-3 h-3 opacity-40" />
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border-subtle/60">
            {displayedCrops.map((crop, idx) => {
              const isExpanded = expandedCropKey === crop.cropKey;
              const relativeBarWidth = (crop.netProfit2026 / maxNetProfit) * 100;
              const growerShare = ((crop.growersCount2026 / 1487) * 100).toFixed(1);
              const paddingY = isCompact ? 'py-1.5' : 'py-2.5';

              return (
                <React.Fragment key={crop.cropKey}>
                  <tr
                    onClick={() => {
                      setExpandedCropKey(isExpanded ? null : crop.cropKey);
                      onSelectCrop?.(crop);
                    }}
                    className={`hover:bg-elevated/50 transition-colors cursor-pointer ${
                      isExpanded ? 'bg-elevated/70' : ''
                    }`}
                  >
                    {/* Crop Name & Category */}
                    <td className={`${paddingY} px-3`}>
                      <div className="flex items-center gap-2">
                        <span className="text-content-muted font-mono w-5 text-right">{idx + 1}.</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-sans font-medium text-content-primary text-sm">
                              {crop.displayName}
                            </span>
                            <span className="text-[11px] font-sans text-content-muted font-normal">
                              ({crop.hindiName})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-elevated border border-border-subtle text-content-muted">
                              {crop.category}
                            </span>
                            {crop.cropKey === 'wheat' && (
                              <EvidenceBadge metricId="REC-CROP-01" variant="subtle" />
                            )}
                            {crop.cropKey === 'paddy' && (
                              <EvidenceBadge metricId="REC-CROP-02" variant="subtle" />
                            )}
                            {crop.cropKey === 'turmeric' && (
                              <EvidenceBadge metricId="REC-TURM-07" variant="subtle" />
                            )}
                            {crop.cropKey === 'okra' && (
                              <EvidenceBadge metricId="REC-CROP-03" variant="subtle" />
                            )}
                            {crop.cropKey === 'bitter_gourd' && (
                              <EvidenceBadge metricId="REC-CROP-04" variant="subtle" />
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Active Growers */}
                    <td className={`${paddingY} px-3 text-right tabular-nums`}>
                      <span className="font-bold text-content-primary">{crop.growersCount2026}</span>
                      <span className="text-[10px] text-content-muted block">{growerShare}% cohort</span>
                    </td>

                    {/* Cultivation Cost */}
                    <td className={`${paddingY} px-3 text-right tabular-nums text-content-muted`}>
                      {formatINR(crop.cultivationCost2026, { compact: true })}
                    </td>

                    {/* Gross Revenue */}
                    <td className={`${paddingY} px-3 text-right tabular-nums text-content-primary`}>
                      {formatINR(crop.grossRevenue2026, { compact: true })}
                    </td>

                    {/* Net Profit & Relative Bar */}
                    <td className={`${paddingY} px-3 text-right tabular-nums`}>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-accent-growth text-sm">
                          {formatINR(crop.netProfit2026, { compact: true })}
                        </span>
                        {/* Relative Bar */}
                        <div className="w-20 h-1 rounded-full bg-border-subtle overflow-hidden mt-1">
                          <div
                            style={{ width: `${Math.max(relativeBarWidth, 4)}%` }}
                            className="h-full bg-accent-growth rounded-full"
                          />
                        </div>
                      </div>
                    </td>

                    {/* Margin */}
                    <td className={`${paddingY} px-3 text-right tabular-nums`}>
                      <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-accent-growth/10 text-accent-growth">
                        {crop.netProfitMargin2026.toFixed(1)}%
                      </span>
                    </td>

                    {/* YoY Growth */}
                    <td className={`${paddingY} px-3 text-right tabular-nums`}>
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold ${
                          crop.yoyGrowthPct >= 0 ? 'text-accent-growth' : 'text-accent-stress'
                        }`}
                      >
                        {crop.yoyGrowthPct >= 0 ? (
                          <span className="text-[10px]">▲</span>
                        ) : (
                          <span className="text-[10px]">▼</span>
                        )}
                        {formatPercent(crop.yoyGrowthPct)}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Row Detail */}
                  {isExpanded && (
                    <tr className="bg-elevated/40 border-b border-border-subtle">
                      <td colSpan={7} className="p-4">
                        <div className="p-4 rounded-lg bg-surface border border-border-subtle space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-serif font-bold text-sm text-content-primary">
                              Detailed Economics for {crop.displayName} ({crop.hindiName})
                            </span>
                            <span className="text-xs font-mono text-content-muted">
                              2025 vs 2026 Financial Audit
                            </span>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                            <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                              <span className="text-content-muted block text-[10px]">2025 Net Profit</span>
                              <span className="text-sm font-bold text-content-primary tabular-nums">
                                {formatINR(crop.netProfit2025)}
                              </span>
                            </div>
                            <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                              <span className="text-content-muted block text-[10px]">2026 Net Profit</span>
                              <span className="text-sm font-bold text-accent-growth tabular-nums">
                                {formatINR(crop.netProfit2026)}
                              </span>
                            </div>
                            <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                              <span className="text-content-muted block text-[10px]">Mean Net / Grower</span>
                              <span className="text-sm font-bold text-content-primary tabular-nums">
                                {crop.growersCount2026 > 0
                                  ? formatINR(crop.netProfit2026 / crop.growersCount2026)
                                  : '-'}
                              </span>
                            </div>
                            <div className="p-2.5 rounded bg-elevated border border-border-subtle">
                              <span className="text-content-muted block text-[10px]">Net Surplus Expansion</span>
                              <span
                                className={`text-sm font-bold tabular-nums ${
                                  crop.netProfit2026 >= crop.netProfit2025
                                    ? 'text-accent-growth'
                                    : 'text-accent-stress'
                                }`}
                              >
                                {crop.netProfit2026 > crop.netProfit2025
                                  ? `+${formatINR(crop.netProfit2026 - crop.netProfit2025)}`
                                  : crop.netProfit2026 < crop.netProfit2025
                                  ? `-${formatINR(crop.netProfit2025 - crop.netProfit2026)}`
                                  : '₹0'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>

          {/* Table Footer with Filtered Subtotals */}
          <tfoot>
            <tr className="border-t-2 border-border-strong bg-elevated/80 font-bold text-content-primary">
              <td className="py-3 px-3">
                Total ({filteredAndSortedCrops.length} Crops)
              </td>
              <td className="py-3 px-3 text-right tabular-nums">
                {displayedCrops.reduce((acc, c) => acc + c.growersCount2026, 0).toLocaleString()} participations
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-content-muted">
                {formatINR(totals.cost, { compact: true })}
              </td>
              <td className="py-3 px-3 text-right tabular-nums">
                {formatINR(totals.gross, { compact: true })}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-accent-growth text-sm">
                {formatINR(totals.net, { compact: true })}
              </td>
              <td className="py-3 px-3 text-right tabular-nums text-accent-growth">
                {totals.gross > 0 ? ((totals.net / totals.gross) * 100).toFixed(1) : '0.0'}%
              </td>
              <td className="py-3 px-3 text-right text-content-muted text-[11px]">
                Subtotal
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* 4. Table Footnote & Row 1492 Neutralization Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-content-muted pt-2 border-t border-border-subtle">
        <div className="flex items-center gap-2">
          <span>Macro Ledger Grand Totals:</span>
          <EvidenceBadge metricId="REC-ECON-09" variant="subtle" label="Cost: ₹3.31 Cr" />
          <EvidenceBadge metricId="REC-ECON-10" variant="subtle" label="Gross: ₹12.82 Cr" />
          <EvidenceBadge metricId="REC-ECON-11" variant="subtle" label="Net: ₹9.50 Cr" />
        </div>
        <div>
          Showing {displayedCrops.length} of {filteredAndSortedCrops.length} filtered crops
        </div>
      </div>
    </div>
  );
};
