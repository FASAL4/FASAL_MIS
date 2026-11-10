import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fasalMasterData } from '@/data/fasalMasterData';
import type { CropEconomicRecord } from '@/types/dashboard';
import {
  type ChapterProps, C, ChapterOpener, ChartTooltip, Figure, Meter, Note, Section, Segmented, Src, Stat, StatRow,
  chartMargin, gridProps, inr, inrAxis, inrShort, num, pct, signedPct, times, xAxisProps, yAxisProps,
} from '../../ui';

type View = 'household' | 'aggregate' | 'earners';
type SortKey = 'displayName' | 'growersCount2026' | 'cultivationCost2026' | 'grossRevenue2026' | 'netProfit2026' | 'netProfitMargin2026' | 'yoyGrowthPct';

export const IncomeChapter: React.FC<ChapterProps> = ({ onOpenLedger }) => {
  const { income } = fasalMasterData;
  const traj = income.longitudinalTrajectory;
  const first = traj[0];
  const y25 = income.macroFinancials.year2025;
  const y26 = income.macroFinancials.year2026;
  const d = income.macroFinancials.deltaYoY;
  const g = income.longitudinalGrowth;
  const t = income.turmericValueChain;

  const [view, setView] = useState<View>('household');
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<string>('All');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'netProfit2026', dir: -1 });
  const [showAll, setShowAll] = useState(false);

  const rows = traj.map((y) => ({
    year: String(y.calendarYear),
    mean: y.meanNetIncomeINR,
    median: y.medianNetIncomeINR,
    aggregate: y.aggregateNetIncomeINR,
    earners: y.activeEarnerPct,
    n: y.sampleSize,
    notes: y.notes,
  }));

  const categories = useMemo(() => ['All', ...Array.from(new Set(income.cropLedger.map((c) => c.category)))], [income.cropLedger]);
  const crops = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = income.cropLedger.filter(
      (c) => (cat === 'All' || c.category === cat) && (!q || c.displayName.toLowerCase().includes(q) || c.hindiName.includes(q)),
    );
    return [...list].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      return (typeof av === 'string' ? av.localeCompare(bv as string) : (av as number) - (bv as number)) * sort.dir;
    });
  }, [income.cropLedger, query, cat, sort]);
  const visible = showAll || query || cat !== 'All' ? crops : crops.slice(0, 12);
  const maxProfit = Math.max(...income.cropLedger.map((c) => c.netProfit2026));

  const Th: React.FC<{ k: SortKey; children: React.ReactNode; right?: boolean }> = ({ k, children, right }) => (
    <th className={right ? 'r' : ''} aria-sort={sort.key === k ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : k === 'displayName' ? 1 : -1 }))}>
        {children}
        {sort.key === k && (sort.dir === 1 ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
      </button>
    </th>
  );

  const statement: Array<{ label: string; a: number; b: number; delta: string; tone?: string; strong?: boolean; fmt?: (n: number) => string }> = [
    { label: 'Gross revenue', a: y25.grossRevenueINR, b: y26.grossRevenueINR, delta: signedPct(d.grossRevenueGrowthPct, 2) },
    { label: 'Cost of cultivation', a: y25.cultivationCostINR, b: y26.cultivationCostINR, delta: signedPct(d.cultivationCostGrowthPct, 2), tone: 'text-clay' },
    { label: 'Net farm profit', a: y25.netProfitINR, b: y26.netProfitINR, delta: signedPct(d.netProfitGrowthPct, 2), strong: true },
    { label: 'Mean net income per household', a: y25.meanNetIncomePerHH, b: y26.meanNetIncomePerHH, delta: signedPct((y26.meanNetIncomePerHH / y25.meanNetIncomePerHH - 1) * 100, 2) },
    { label: 'Median net income per household', a: y25.medianNetIncomePerHH, b: y26.medianNetIncomePerHH, delta: signedPct((y26.medianNetIncomePerHH / y25.medianNetIncomePerHH - 1) * 100, 2) },
    { label: 'Net profit margin', a: y25.netProfitMarginPct, b: y26.netProfitMarginPct, delta: `+${d.profitMarginDeltaPp} pts`, fmt: (n) => pct(n, 2) },
    { label: 'Households with a positive farm income', a: y25.activeEarnersCount, b: y26.activeEarnersCount, delta: `${pct(y26.activeEarnerSaturationPct, 2)} of ${num(y26.activeFarmersCount)}`, fmt: (n) => num(n) },
  ];

  return (
    <>
      <ChapterOpener
        no="01"
        name="Income"
        title={<>The typical household’s farm income grew <em className="accent">{times(y26.medianNetIncomePerHH / first.medianNetIncomeINR)}</em> in five years.</>}
        lead={<>Net farm income for {num(y26.activeFarmersCount)} cultivating households, 2022 to 2026. The median rose faster than the mean: the gains reached the many, not a few large farms.</>}
      >
        <StatRow cols={4}>
          <Stat label="Median net farm income, 2026" countTo={y26.medianNetIncomePerHH} format={(n) => inr(Math.round(n))} unit="per household" delta={`${signedPct(g.medianGrowthPct, 2)} since ${first.calendarYear}`} src="METRIC-INC-002" />
          <Stat label="Mean net farm income, 2026" countTo={y26.meanNetIncomePerHH} format={(n) => inr(Math.round(n))} unit="per household" delta={`${signedPct(g.meanGrowthPct, 2)} since ${first.calendarYear}`} src="REC-ECON-12" />
          <Stat label="Net farm profit, all households" countTo={y26.netProfitINR} format={inrShort} delta={`${signedPct(g.aggregateGrowthPct, 2)} since ${first.calendarYear}`} src="METRIC-INC-001" />
          <Stat label="Households earning from their land" countTo={y26.activeEarnerSaturationPct} format={(n) => pct(n, 2)} delta={`${num(y26.activeEarnersCount)} of ${num(y26.activeFarmersCount)}`} tone="ink" />
        </StatRow>
      </ChapterOpener>

      <div className="wrap">
        <Section
          id="trajectory" no="1.1" kicker="Trajectory"
          title="Five harvests, and income rose in almost every one."
          intro={<>Mean net farm income went from <Src id="REC-ECON-01">{inr(first.meanNetIncomeINR, 2)}</Src> in {first.calendarYear} to <Src id="REC-ECON-12">{inr(y26.meanNetIncomePerHH, 2)}</Src> in 2026. The median more than doubled.</>}
          aside="2022–2024 are wave-one recall values (about 1,329 households). 2025–2026 are wave-two census values (1,487 households)."
        >
          <Figure
            no="1.1"
            title={view === 'household' ? 'Net farm income per household (₹)' : view === 'aggregate' ? 'Net farm income, all households (₹)' : 'Households with a positive farm income (%)'}
            src="REC-ECON-12"
            legend={view === 'household' ? [{ label: 'Median', color: C.forest, shape: 'line' }, { label: 'Mean', color: C.haldi, shape: 'line' }] : undefined}
            actions={<Segmented<View> label="Series" value={view} onChange={setView} options={[{ value: 'household', label: 'Per household' }, { value: 'aggregate', label: 'All households' }, { value: 'earners', label: 'Share earning' }]} />}
            caption={g.bottomQuartileGainSummary + '.'}
          >
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                {view === 'household' ? (
                  <LineChart data={rows} margin={{ ...chartMargin, right: 56 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="year" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={inrAxis} />
                    <Tooltip content={<ChartTooltip format={(v) => inr(Math.round(v))} labels={{ median: 'Median', mean: 'Mean' }} note={(p) => `N = ${num(Number(p?.[0]?.payload?.n))}`} />} cursor={{ stroke: C.ruleStrong }} />
                    <Line type="monotone" dataKey="mean" stroke={C.haldi} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.haldi }} activeDot={{ r: 5 }}>
                      <LabelList dataKey="mean" position="right" formatter={(v: number) => inrAxis(v)} content={undefined} />
                    </Line>
                    <Line type="monotone" dataKey="median" stroke={C.forest} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.forest }} activeDot={{ r: 5 }} />
                  </LineChart>
                ) : (
                  <BarChart data={rows} margin={chartMargin}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="year" {...xAxisProps} />
                    <YAxis {...yAxisProps} tickFormatter={view === 'aggregate' ? inrAxis : (v: number) => `${v}%`} domain={view === 'earners' ? [90, 100] : [0, 'auto']} />
                    <Tooltip content={<ChartTooltip format={(v) => (view === 'aggregate' ? inr(Math.round(v)) : pct(v, 2))} labels={{ aggregate: 'Net income', earners: 'Share earning' }} note={(p) => `N = ${num(Number(p?.[0]?.payload?.n))}`} />} cursor={{ fill: 'var(--rule)' }} />
                    <Bar dataKey={view === 'aggregate' ? 'aggregate' : 'earners'} fill={C.forest} radius={[2, 2, 0, 0]} maxBarSize={56}>
                      <LabelList position="top" formatter={(v: number) => (view === 'aggregate' ? inrShort(v) : pct(v, 1))} />
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </Figure>
          <div className="tbl-wrap">
            <table className="tbl tbl--dense">
              <thead><tr><th>Year</th><th className="r">Mean</th><th className="r">Median</th><th className="r">All households</th><th className="r">N</th><th>Note</th></tr></thead>
              <tbody>
                {traj.map((y) => (
                  <tr key={y.calendarYear}>
                    <td className="strong">{y.calendarYear}</td>
                    <td className="r">{inr(Math.round(y.meanNetIncomeINR))}</td>
                    <td className="r">{inr(y.medianNetIncomeINR)}</td>
                    <td className="r">{inrShort(y.aggregateNetIncomeINR)}</td>
                    <td className="r muted">{num(y.sampleSize)}</td>
                    <td className="muted" style={{ minWidth: 220 }}>{y.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note kind="audit" title="A total row was once counted as a farmer.">
            The workbook’s income sheet ends with a pre-computed grand total (row 1492). Earlier analyses summed it with the farmer rows and doubled the totals. Every aggregate here is the sum of the {num(y26.activeFarmersCount)} farmer rows only, and matches the total cell to the rupee.{' '}
            <button type="button" className="link" onClick={() => onOpenLedger('REC-HYG-01')}>See the check</button>
          </Note>
        </Section>

        <Section
          id="statement" no="1.2" kicker="2025 to 2026"
          title="Revenue grew faster than cost, so the margin widened."
          intro={<>In one year net farm profit rose by {inrShort(d.netProfitGrowthAmount)} while the cost of cultivation rose by only {inrShort(d.cultivationCostGrowthAmount)}.</>}
        >
          <Figure no="1.2" title={`Farm statement for ${num(y26.activeFarmersCount)} cultivating households`} src="REC-ECON-11">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th /><th className="r">2025</th><th className="r">2026</th><th className="r">Change</th></tr></thead>
                <tbody>
                  {statement.map((r) => {
                    const f = r.fmt ?? ((n: number) => inr(Math.round(n)));
                    return (
                      <tr key={r.label}>
                        <td className={r.strong ? 'strong' : ''}>{r.label}</td>
                        <td className="r">{f(r.a)}</td>
                        <td className={`r ${r.strong ? 'strong' : ''}`}>{f(r.b)}</td>
                        <td className={`r ${r.tone ?? 'text-forest'}`} style={{ fontWeight: 600 }}>{r.delta}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Figure>
        </Section>

        <Section
          id="equity" no="1.3" kicker="Who gained"
          title="Every community earns from its land; Tharu households earn the most."
          intro="Net farm income in 2026 by social group, beside the land each group farms and how organised it is."
          aside="One bigha is counted as 0.20 acre. General-category households number only eight."
        >
          <Figure no="1.3" title="Farm income by community, 2026" src="REC-SOC-05">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Community</th><th className="r">Households</th><th className="r">Mean land</th><th className="r">Landless</th><th className="r">Mean income</th><th className="r">Median income</th><th className="r">Per bigha</th><th className="r">In the union</th></tr></thead>
                <tbody>
                  {income.casteEconomics.map((c) => (
                    <tr key={c.caste}>
                      <td className="strong" style={{ minWidth: 230 }}>{c.label}<span className="sub">{c.keyDrivers}</span></td>
                      <td className="r">{num(c.sampleSize)}</td>
                      <td className="r">{c.meanLandBigha.toFixed(2)} bigha</td>
                      <td className="r muted">{pct(c.landlessRatePct, 2)}</td>
                      <td className="r strong">{inr(c.meanNetFarmIncome2026)}</td>
                      <td className="r">{inr(c.medianNetFarmIncome2026)}</td>
                      <td className="r">{inr(Math.round(c.meanNetFarmIncome2026 / c.meanLandBigha))}</td>
                      <td className="r">{pct(c.aasUnionEnrollmentPct, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Figure>
          <Note kind="finding" title="The smallest plots are worked the hardest.">
            Scheduled Caste households hold the least land, yet earn the most from each bigha they farm: trellis vegetables, dense kitchen gardens and home-made inputs make a small plot pay.
          </Note>
        </Section>

        <Section
          id="turmeric" no="1.4" kicker="The flagship crop"
          title="Turmeric: a cash crop that wildlife leaves alone."
          intro={<>Organic turmeric (haldi) is grown by <Src id="REC-TURM-01">{num(t.growers2026)} households</Src> on {num(t.areaBigha2026)} bigha. It kept {pct(t.netProfitMarginPct2026, 2)} of its revenue as profit in 2026.</>}
          aside="Elephants, wild boar and deer do not raid turmeric, which is why it suits fields on the sanctuary edge."
        >
          <StatRow cols={4}>
            <Stat label="Net profit, 2026" countTo={t.netProfit2026} format={inrShort} tone="haldi" delta={`${signedPct((t.netProfit2026 / t.netProfit2025 - 1) * 100, 2)} on 2025`} src="REC-TURM-07" />
            <Stat label="Profit per grower" countTo={t.averageNetProfitPerGrower2026} format={(n) => inr(Math.round(n))} tone="haldi" note="Mean across 2026 growers" />
            <Stat label="Fresh harvest" countTo={t.freshRhizomeProductionKg / 100} format={(n) => num(Math.round(n))} unit="quintals" note={`${t.averageYieldQuintalsPerAcre} quintals an acre`} src="REC-TURM-08" />
            <Stat label="Profit margin" countTo={t.netProfitMarginPct2026} format={(n) => pct(n, 2)} tone="haldi" />
          </StatRow>
          <Figure no="1.4" title="Turmeric, 2025 and 2026" src="REC-TURM-05" caption={`Curcumin content ${t.curcuminContentPctRange}. Dried finger sells at ${t.dryFingerMarketingPriceRange}.`}>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th /><th className="r">2025</th><th className="r">2026</th><th style={{ width: '34%' }}>2026, to scale</th></tr></thead>
                <tbody>
                  {[
                    { l: 'Growers', a: num(t.growers2025), b: num(t.growers2026) },
                    { l: 'Area', a: `${num(t.areaBigha2025)} bigha`, b: `${num(t.areaBigha2026)} bigha` },
                    { l: 'Gross revenue', a: inr(t.grossRevenue2025), b: inr(t.grossRevenue2026), v: t.grossRevenue2026, tone: 'stone' as const },
                    { l: 'Cost of cultivation', a: inr(t.cultivationCost2025), b: inr(t.cultivationCost2026), v: t.cultivationCost2026, tone: 'clay' as const },
                    { l: 'Net profit', a: inr(t.netProfit2025), b: inr(t.netProfit2026), v: t.netProfit2026, tone: 'haldi' as const, strong: true },
                  ].map((r) => (
                    <tr key={r.l}>
                      <td className={r.strong ? 'strong' : ''}>{r.l}</td>
                      <td className="r">{r.a}</td>
                      <td className={`r ${r.strong ? 'strong' : ''}`}>{r.b}</td>
                      <td>{r.v !== undefined && <div className="pt-1.5"><Meter value={r.v} max={t.grossRevenue2026} tone={r.tone} size="lg" label={`${r.l}: ${r.b}`} /></div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Figure>
        </Section>

        <Section
          id="crops" no="1.5" kicker="Crop ledger"
          title={`${income.cropLedger.length} crops, each with its own account.`}
          intro="Cost, revenue and profit for every crop in the 2026 income sheet. Search, filter by type, or sort any column."
          wide
        >
          <Figure
            no="1.5" title="Crop economics, 2026" src="REC-ECON-11"
            actions={<Segmented label="Crop type" value={cat} onChange={setCat} options={categories.map((c) => ({ value: c, label: c }))} />}
          >
            <input className="input mb-5 max-w-sm" type="search" placeholder="Search a crop" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search crops" />
            <div className="tbl-wrap">
              <table className="tbl tbl--dense">
                <thead>
                  <tr>
                    <Th k="displayName">Crop</Th><Th k="growersCount2026" right>Growers</Th><Th k="cultivationCost2026" right>Cost</Th><Th k="grossRevenue2026" right>Revenue</Th>
                    <Th k="netProfit2026" right>Net profit</Th><th style={{ width: '14%' }} /><Th k="netProfitMargin2026" right>Margin</Th><Th k="yoyGrowthPct" right>On 2025</Th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((c: CropEconomicRecord) => (
                    <tr key={c.cropKey}>
                      <td className="strong" style={{ minWidth: 170 }}>{c.displayName} <span className="muted font-normal" lang="hi">{c.hindiName}</span><span className="sub">{c.category}</span></td>
                      <td className="r">{num(c.growersCount2026)}</td>
                      <td className="r muted">{inr(c.cultivationCost2026)}</td>
                      <td className="r">{inr(c.grossRevenue2026)}</td>
                      <td className="r strong">{inr(c.netProfit2026)}</td>
                      <td><div className="pt-1.5"><Meter value={Math.max(0, c.netProfit2026)} max={maxProfit} tone={c.cropKey === 'turmeric' ? 'haldi' : 'forest'} size="sm" /></div></td>
                      <td className="r">{pct(c.netProfitMargin2026, 1)}</td>
                      <td className={`r ${c.yoyGrowthPct < 0 ? 'text-clay' : 'text-forest'}`}>{signedPct(c.yoyGrowthPct, 1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {visible.length === 0 && <p className="t-note mt-4">No crop matches. <button type="button" className="link" onClick={() => { setQuery(''); setCat('All'); }}>Clear filters</button></p>}
            {!query && cat === 'All' && (
              <button type="button" className="btn mt-5" onClick={() => setShowAll((v) => !v)}>{showAll ? 'Show the top 12' : `Show all ${crops.length} crops`}</button>
            )}
          </Figure>
        </Section>
      </div>
    </>
  );
};
