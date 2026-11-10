import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fasalMasterData } from '@/data/fasalMasterData';
import { useEvidence } from '@/context/EvidenceContext';
import {
  type ChapterId,
  type ChapterProps,
  Figure,
  Meter,
  Note,
  Reveal,
  Section,
  Segmented,
  ShareBar,
  Src,
  Stat,
  StatRow,
  Tag,
  inr,
  inrShort,
  num,
  pct,
  times,
} from '../../ui';
import { Cover } from './Cover';

const GEO_SRC = ['REC-GEO-02', 'REC-GEO-03', 'REC-GEO-04', 'REC-GEO-05', 'REC-GEO-06', 'REC-GEO-07', 'REC-GEO-08'];
const SOC_SRC: Record<string, string> = { OBC: 'REC-SOC-01', ST: 'REC-SOC-02', SC: 'REC-SOC-03', General: 'REC-SOC-04' };
const SOC_COLOR: Record<string, string> = {
  OBC: 'var(--river)',
  ST: 'var(--forest)',
  SC: 'var(--haldi-mark)',
  General: 'var(--stone)',
};

/** Sample of the 64 affinity groups (reconciliation sub-ledger 8). */
const AFFINITY_SAMPLE = [
  { name: 'Ganga', village: 'Karikot', members: 74 },
  { name: 'Krishna', village: 'Fakirpuri', members: 63 },
  { name: 'Meera', village: 'Chahalwa', members: 54 },
  { name: 'Durga', village: 'Bajpur', members: 44 },
  { name: 'Mahima', village: 'Mangalpurwa', members: 38 },
  { name: 'Shanti', village: 'Badkhadiya', members: 37 },
];

/** The six grant deliverables: proposed target and verified endline, as reported in the donor scorecard. */
const COMMITMENTS: Array<{
  name: string;
  target: string;
  achieved: string;
  detail?: string;
  attainment: number;
  verdict: string;
  src?: string;
}> = [
  { name: 'Households covered', target: '1,500 households', achieved: '1,535 households', detail: '1,487 cultivators', attainment: 102.3, verdict: 'Exceeded', src: 'REC-ADM-01' },
  { name: 'Farmers above ₹60,000 net income per acre', target: '70.0% of cohort', achieved: '76.8%', detail: '1,142 of 1,487 farmers', attainment: 109.7, verdict: 'Exceeded' },
  { name: 'Public investment mobilised', target: '₹2.16 Cr (1.0×)', achieved: '₹7.71 Cr', detail: '577 projects', attainment: 356.9, verdict: 'Exceeded', src: 'METRIC-RGHT-001' },
  { name: 'Farmers’ union (AAS) membership', target: '3,000 members', achieved: '4,826 members', detail: '74.32% of residents', attainment: 160.9, verdict: 'Exceeded', src: 'REC-INST-01' },
  { name: 'Poshan Vatika kitchen gardens', target: '800 gardens', achieved: '1,120+ gardens', detail: '73.0% of households', attainment: 140.0, verdict: 'Exceeded' },
  { name: 'Agrochemical reduction and LEISA conversion', target: '50.0% adoption', achieved: '100% in turmeric', detail: '1,120+ bio-input drums', attainment: 100.0, verdict: 'Achieved' },
];

export const OverviewChapter: React.FC<ChapterProps> = ({ onNavigate }) => {
  const { metadata, overview, income, rfProgression, rights, nutrition, forensic } = fasalMasterData;
  const { getMetric } = useEvidence();
  const [landUnit, setLandUnit] = useState<'bigha' | 'acres'>('bigha');

  const k = overview.headlineKPIs;
  const c = overview.collectivization;
  const f = overview.fieldAdministration;
  const audit = forensic.auditOverview;
  const y26 = income.macroFinancials.year2026;
  const first = income.longitudinalTrajectory[0];
  const rf1 = rfProgression.benchmarks[0];
  const pulses = nutrition.foodGroupRecall.yellowFoodsPulses;
  const gardens = nutrition.poshanVatikas;

  const metricNumber = (id: string, fallback: number) => {
    const v = getMetric(id)?.verifiedValue;
    return typeof v === 'number' ? v : fallback;
  };
  const sizeBands = [
    { label: '1–2 people', id: 'REC-DEMO-04', value: metricNumber('REC-DEMO-04', 158), mix: 28 },
    { label: '3–4 people', id: 'REC-DEMO-03', value: metricNumber('REC-DEMO-03', 826), mix: 100 },
    { label: '5–6 people', id: 'REC-DEMO-05', value: metricNumber('REC-DEMO-05', 470), mix: 62 },
    { label: '7 or more', id: 'REC-DEMO-06', value: metricNumber('REC-DEMO-06', 81), mix: 40 },
  ];

  const communities = overview.casteDemographics.map((d) => {
    const econ = income.casteEconomics.find((e) => e.caste === d.casteCategory);
    return { ...d, econ };
  });
  const tharu = communities.find((d) => d.casteCategory === 'ST');

  const grant = metadata.grantCommitmentINR;
  const leverage = rights.publicLeverage.totalLeverageAmountINR;
  const turmeric = income.turmericValueChain;
  const returnRows: Array<{ label: string; sub: string; value: number; color: string; mult: string; src?: string }> = [
    { label: 'The grant', sub: 'Azim Premji Philanthropic Initiatives, 2021–2026', value: grant, color: 'var(--ink)', mult: 'the base' },
    {
      label: 'Public investment drawn in',
      sub: `${num(rights.publicLeverage.totalProjectsCount)} verified public works`,
      value: leverage,
      color: 'var(--haldi-mark)',
      mult: `${times(leverage / grant)} the grant`,
      src: 'METRIC-RGHT-001',
    },
    {
      label: 'Net farm profit, 2026',
      sub: `${num(y26.activeFarmersCount)} cultivating households`,
      value: y26.netProfitINR,
      color: 'var(--forest)',
      mult: `${times(y26.netProfitINR / grant)} the grant`,
      src: 'METRIC-INC-001',
    },
  ];
  const returnMax = Math.max(...returnRows.map((r) => r.value));

  const lessons: Array<{ title: string; body: React.ReactNode; to: ChapterId; cta: string }> = [
    {
      title: 'Fund the asking, not the service.',
      body: (
        <>
          Philanthropy cannot stand in for public safety nets. Its highest-leverage use here was frontline self-advocacy:{' '}
          <em>Jiska mudda, uski agwai</em> — whoever’s issue it is, leads. Money spent on what citizens know and how they
          claim entitlements unlocked {inrShort(leverage).replace(' Cr', ' crore')} of public funds from a{' '}
          {inrShort(grant).replace(' Cr', ' crore')} grant.
        </>
      ),
      to: 'rights',
      cta: 'Rights',
    },
    {
      title: 'Grow what wildlife will not eat.',
      body: (
        <>
          Farming on a sanctuary buffer fails if raiding by elephants, wild boar and deer is ignored. Herbivores leave
          organic turmeric alone: it returned a {inrShort(turmeric.netProfit2026).replace(' L', ' lakh')} net surplus at a{' '}
          {pct(turmeric.netProfitMarginPct2026, 2)} margin with no crop loss. Conservation and a cash crop proved compatible.
        </>
      ),
      to: 'income',
      cta: 'Income',
    },
    {
      title: 'Aim at the median, not the mean.',
      body: (
        <>
          Farm subsidies usually favour larger landholders. FASAL worked almost only with marginalised smallholders, and
          median net farm income rose {pct(income.longitudinalGrowth.medianGrowthPct, 2)}, well ahead of the{' '}
          {pct(income.longitudinalGrowth.meanGrowthPct, 2)} rise in the mean. The gains went to the many, and inequality
          within villages narrowed.
        </>
      ),
      to: 'income',
      cta: 'Income',
    },
    {
      title: 'Income does not feed a family by itself.',
      body: (
        <>
          More cash-crop income does not automatically improve what mothers and children eat.{' '}
          {num(gardens.endlineGardensCount)}+ Poshan Vatika kitchen gardens, and a rule to hold back{' '}
          {pulses.indigenousPulseRetentionKg} kg of pulses before selling, protected diets from price shocks. Weekly pulse
          eating rose {pulses.reversalExpansionGainPp} pts.
        </>
      ),
      to: 'nutrition',
      cta: 'Nutrition',
    },
  ];

  const index: Array<{ id: ChapterId; no: string; name: string; line: React.ReactNode; fig: string; unit?: string; cap: string }> = [
    {
      id: 'income',
      no: '01',
      name: 'Income',
      line: (
        <>
          Median net farm income per household rose from {inr(first.medianNetIncomeINR)} to {inr(y26.medianNetIncomePerHH)}.
        </>
      ),
      fig: times(y26.medianNetIncomePerHH / first.medianNetIncomeINR),
      cap: `median farm income, ${first.calendarYear} to 2026`,
    },
    {
      id: 'rf',
      no: '02',
      name: 'Farming',
      line: (
        <>
          Farms averaging {rfProgression.landholdingStructure.meanLandAcres020.toFixed(2)} of an acre now net{' '}
          {rf1.achievedValueFormatted.replace(' / acre', '')} an acre, against a grant target of{' '}
          {rf1.targetValueFormatted.replace(' / acre', '')}.
        </>
      ),
      fig: `${Math.round(rf1.attainmentPct)}%`,
      cap: 'of the per-acre income target',
    },
    {
      id: 'rights',
      no: '03',
      name: 'Rights',
      line: (
        <>
          Village unions drew {inrShort(rights.publicLeverage.totalLeverageAmountINR).replace(' Cr', ' crore')} of public
          investment into {num(rights.publicLeverage.totalProjectsCount)} works: housing, roads, piped water.
        </>
      ),
      fig: times(k.verifiedPublicLeverageINR / k.grantCommitment),
      cap: 'the grant, returned in public money',
    },
    {
      id: 'nutrition',
      no: '04',
      name: 'Nutrition',
      line: (
        <>
          Kitchen gardens grew from {num(gardens.baselineGardensCount)} to {num(gardens.endlineGardensCount)}; weekly pulse
          eating rose from {pulses.baselineWeeklyPct}% to {pulses.endlineWeeklyPct}% of households.
        </>
      ),
      fig: `+${pulses.reversalExpansionGainPp}`,
      unit: 'pts',
      cap: 'households eating pulses weekly',
    },
    {
      id: 'forensic',
      no: '05',
      name: 'Evidence',
      line: (
        <>
          {num(audit.totalAuditedClaims)} claims audited, seven systemic data defects repaired, no
          personal data published.
        </>
      ),
      fig: '103 / 103',
      cap: 'verification assertions passing',
    },
  ];

  return (
    <>
      <Cover />

      <div className="wrap">
        {/* The grant, in four facts */}
        <Reveal className="grid grid-cols-2 gap-x-8 gap-y-6 py-9 lg:grid-cols-4">
          {[
            { l: 'Funded by', v: 'Azim Premji Philanthropic Initiatives', s: `Grant ${metadata.grantRef} · ${inrShort(metadata.grantCommitmentINR)}` },
            { l: 'Implemented by', v: 'DEHAT India', s: 'Developmental Association for Human Advancement' },
            { l: 'Period', v: 'November 2021 – December 2026', s: 'Two survey waves, five harvest years' },
            { l: 'Landscape', v: 'Mihinpurwa block, Bahraich', s: 'Katarniaghat Wildlife Sanctuary buffer, Uttar Pradesh' },
          ].map((x) => (
            <div key={x.l}>
              <div className="t-label">{x.l}</div>
              <div className="mt-2 text-[0.9375rem] font-semibold leading-snug text-ink">{x.v}</div>
              <div className="t-note mt-1">{x.s}</div>
            </div>
          ))}
        </Reveal>

        {/* 0.1 — Index of results */}
        <Section
          id="results"
          no="0.1"
          kicker="What changed"
          title="Four results and the audit behind them."
          intro="Each line is the headline of a chapter. Open one to see the full series, the cohort it was measured on, and the cells it came from."
          wide
        >
          <div className="index">
            {index.map((row, i) => (
              <Reveal key={row.id} delay={i * 60}>
                <button type="button" className="index-row" onClick={() => onNavigate(row.id)}>
                  <span className="index-no">{row.no}</span>
                  <span>
                    <span className="t-label block">{row.name}</span>
                    <span className="mt-2 block font-display text-[1.3125rem] leading-[1.3] tracking-[-0.01em] text-ink [text-wrap:balance] max-w-[40ch]">
                      {row.line}
                    </span>
                  </span>
                  <span>
                    <span className="index-fig">
                      {row.fig}
                      {row.unit && <span className="stat-unit ml-2">{row.unit}</span>}
                    </span>
                    <span className="t-note mt-2 block">{row.cap}</span>
                  </span>
                  <ArrowRight className="index-arrow" size={26} strokeWidth={1.25} aria-hidden="true" />
                </button>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 0.2 — Return on the grant */}
        <Section
          id="return"
          no="0.2"
          kicker="Return on the grant"
          title={<>Every rupee of grant drew in {inr(leverage / grant, 2)} of public money.</>}
          intro={
            <>
              Add the net profit farmers earned in 2026 and the programme’s footprint is{' '}
              {inrShort(leverage + y26.netProfitINR).replace(' Cr', ' crore')}: {times((leverage + y26.netProfitINR) / grant)} the
              grant that started it.
            </>
          }
          aside="The grant paid for organising, training and demonstration plots. It did not pay for the houses, roads or harvests counted here."
        >
          <Figure
            no="0.1"
            title="The grant, and what stood on it (₹ crore, to scale)"
            caption="Public investment is the verified total of three annual registers, 2023–2025. Farm profit is the 2026 season alone."
            src="METRIC-RGHT-001"
          >
            <div className="border-t border-rule">
              {returnRows.map((r, i) => (
                <div
                  key={r.label}
                  className="grid items-center gap-x-6 gap-y-2 border-b border-rule py-5 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)_minmax(0,9.5rem)]"
                >
                  <div>
                    <div className="text-[0.9375rem] font-semibold text-ink">{r.label}</div>
                    <div className="t-note mt-0.5">{r.sub}</div>
                  </div>
                  <div className="h-7">
                    <div
                      className="h-full origin-left rounded-[1px]"
                      style={{
                        width: `${(r.value / returnMax) * 100}%`,
                        background: r.color,
                        animation: `meter-in 1100ms var(--ease-out) ${i * 140}ms both`,
                      }}
                    />
                  </div>
                  <div className="md:text-right">
                    <span className="font-display text-[1.75rem] leading-none tracking-[-0.03em] text-ink">
                      {r.src ? <Src id={r.src}>{inrShort(r.value)}</Src> : inrShort(r.value)}
                    </span>
                    <span className="t-note ml-2 md:ml-0 md:mt-1 md:block">{r.mult}</span>
                  </div>
                </div>
              ))}
            </div>
          </Figure>
        </Section>

        {/* 0.3 — Against the proposal */}
        <Section
          id="commitments"
          no="0.3"
          kicker="Against the proposal"
          title="All six commitments in the grant proposal were met. Five were exceeded."
          intro="What DEHAT proposed to Azim Premji Philanthropic Initiatives in 2021, beside what the 2026 census found."
        >
          <Figure no="0.2" title="Grant deliverables: proposed target and verified endline">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Commitment</th>
                    <th className="r">Proposed</th>
                    <th className="r">Verified, 2026</th>
                    <th style={{ width: '24%' }}>Attainment</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {COMMITMENTS.map((d) => (
                    <tr key={d.name}>
                      <td className="strong" style={{ minWidth: 220 }}>
                        {d.name}
                      </td>
                      <td className="r muted" style={{ whiteSpace: 'nowrap' }}>
                        {d.target}
                      </td>
                      <td className="r strong" style={{ minWidth: 170 }}>
                        {d.src ? <Src id={d.src}>{d.achieved}</Src> : d.achieved}
                        {d.detail && <span className="sub">{d.detail}</span>}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex-1" style={{ minWidth: 90 }}>
                            <Meter
                              value={Math.min(d.attainment, 200)}
                              max={200}
                              target={100}
                              label={`${d.attainment}% of target`}
                            />
                          </div>
                          <span className="w-14 text-right">{pct(d.attainment)}</span>
                        </div>
                      </td>
                      <td className="r">
                        <Tag tone="forest">{d.verdict}</Tag>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="t-note mt-3">The tick marks 100% of target; bars are capped at 200%.</p>
          </Figure>
        </Section>

        {/* 0.4 — Geography */}
        <Section
          id="where"
          no="0.4"
          kicker="Where"
          title="Seven panchayats along the sanctuary border."
          intro={
            <>
              The programme works in <Src id="REC-GEO-01">{k.gramPanchayatsCount} gram panchayats</Src> and {k.villagesCount}{' '}
              hamlets of Mihinpurwa block. Karikot, with nine forest hamlets, holds almost half of all households.
            </>
          }
          aside="Hamlets sit on the buffer of the Katarniaghat Wildlife Sanctuary; each panchayat has a distinct farming character."
        >
          <Figure no="0.3" title="Households by gram panchayat" src="REC-GEO-01">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Panchayat</th>
                    <th className="r">Households</th>
                    <th style={{ width: '22%' }}>Share</th>
                    <th>Hamlets</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.geographicDistribution.map((gp, i) => (
                    <tr key={gp.gpName}>
                      <td className="strong" style={{ minWidth: 220 }}>
                        {gp.gpName}
                        <span className="sub">{gp.primaryCharacteristics}</span>
                      </td>
                      <td className="r strong">
                        <Src id={GEO_SRC[i]}>{num(gp.households)}</Src>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="flex-1">
                            <Meter value={gp.percentage} max={50} tone="ink" label={`${gp.percentage}% of households`} />
                          </div>
                          <span className="w-12 text-right">{pct(gp.percentage)}</span>
                        </div>
                      </td>
                      <td className="muted" style={{ minWidth: 200 }}>
                        {gp.hamletsCount > 1 ? gp.hamletNames.join(', ') : 'Single hamlet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>All seven</td>
                    <td className="r">{num(k.totalHouseholdsSurveyed)}</td>
                    <td />
                    <td>{k.villagesCount} hamlets</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </Figure>
        </Section>

        {/* 0.5 — People */}
        <Section
          id="who"
          no="0.5"
          kicker="Who"
          title="Almost every household comes from a marginalised community."
          intro={
            <>
              <Src id="REC-SOC-05">{pct(k.marginalizedInclusionRate, 2)}</Src> of households are Scheduled Caste, Scheduled Tribe
              or Other Backward Class. Together they are home to{' '}
              <Src id="REC-DEMO-01">{num(k.residentIndividualPopulation)} people</Src>, a mean of{' '}
              <Src id="REC-DEMO-02">{k.meanHouseholdSize}</Src> per household.
            </>
          }
          aside="General-category households number only eight; read their averages as indicative, not as a comparison group."
        >
          <Figure
            no="0.4"
            title="Land, farm income and union membership by community, 2026"
            src="REC-SOC-05"
            actions={
              <Segmented
                label="Land unit"
                value={landUnit}
                onChange={setLandUnit}
                options={[
                  { value: 'bigha', label: 'Bigha' },
                  { value: 'acres', label: 'Acres' },
                ]}
              />
            }
            caption="One local bigha is counted as 0.20 acre throughout. Farm income is the 2026 mean net income per cultivating household."
          >
            <ShareBar
              parts={communities.map((d) => ({
                value: d.households,
                color: SOC_COLOR[d.casteCategory],
                label: d.casteCategory,
              }))}
            />
            <div className="tbl-wrap mt-6">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Community</th>
                    <th className="r">Households</th>
                    <th className="r">Share</th>
                    <th className="r">Mean land</th>
                    <th className="r">Landless</th>
                    <th className="r">Net farm income</th>
                    <th className="r">In the union</th>
                  </tr>
                </thead>
                <tbody>
                  {communities.map((d) => (
                    <tr key={d.casteCategory}>
                      <td className="strong" style={{ minWidth: 240 }}>
                        <span className="inline-flex items-center gap-2.5">
                          <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: SOC_COLOR[d.casteCategory] }} />
                          {d.casteCategory}
                        </span>
                        <span className="sub">{d.description}</span>
                      </td>
                      <td className="r strong">
                        <Src id={SOC_SRC[d.casteCategory]}>{num(d.households)}</Src>
                      </td>
                      <td className="r">{pct(d.percentage, 2)}</td>
                      <td className="r">
                        {landUnit === 'bigha'
                          ? `${d.meanLandBigha.toFixed(2)} bigha`
                          : `${(d.econ?.meanLandAcres020 ?? d.meanLandBigha * 0.2).toFixed(2)} ac`}
                      </td>
                      <td className="r muted">{d.econ ? pct(d.econ.landlessRatePct, 2) : '–'}</td>
                      <td className="r strong">{inr(d.meanNetIncome2026)}</td>
                      <td className="r">{pct(d.aasMembershipPct, 2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Figure>

          {tharu && (
            <Note kind="finding" title="Tharu households lead on both income and organisation.">
              Scheduled Tribe smallholders report the highest mean net farm income ({inr(tharu.meanNetIncome2026)}) and the
              highest union membership ({pct(tharu.aasMembershipPct, 2)}), driven by organic turmeric in the forest buffer and
              collective bargaining.
            </Note>
          )}

          <Figure no="0.5" title="Households by size" src="REC-DEMO-03" caption="Just over half of all homes are nuclear families of three or four.">
            <ShareBar
              parts={sizeBands.map((b) => ({
                value: b.value,
                label: b.label,
                color: `color-mix(in srgb, var(--forest) ${b.mix}%, var(--paper))`,
              }))}
            />
            <div className="mt-5 grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-4">
              {sizeBands.map((b) => (
                <div key={b.label}>
                  <div className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                    <span
                      className="inline-block h-2.5 w-2.5 rounded-[2px]"
                      style={{ background: `color-mix(in srgb, var(--forest) ${b.mix}%, var(--paper))` }}
                    />
                    {b.label}
                  </div>
                  <div className="mt-1.5 font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink">
                    <Src id={b.id}>{num(b.value)}</Src>
                  </div>
                  <div className="t-note mt-1">{pct((b.value / k.totalHouseholdsSurveyed) * 100)} of households</div>
                </div>
              ))}
            </div>
          </Figure>
        </Section>

        {/* 0.6 — Collectives */}
        <Section
          id="organised"
          no="0.6"
          kicker="Organised"
          title="Three in four residents belong to the farmers’ union."
          intro="FASAL works through people’s own institutions: the Ajeevika Adhikar Sangathan (AAS) union and its village affinity groups, women’s savings groups, and three tiers of youth parliament."
        >
          <StatRow cols={4}>
            <Stat
              label="AAS union members"
              countTo={c.aasUnionMembers}
              delta={`${pct((c.aasUnionMembers / k.residentIndividualPopulation) * 100, 2)} of all residents`}
              src="REC-INST-01"
            />
            <Stat label="Village affinity groups" countTo={c.aasAffinityGroups} note="Self-governing clusters of the union" src="REC-INST-05" />
            <Stat
              label="Women’s self-help groups"
              countTo={c.shgGroupsCount}
              note={`${num(c.shgMembersCount)} women saving together`}
              src="REC-INST-06"
            />
            <Stat
              label="Elected youth leaders"
              countTo={c.balSansadMinisters + c.kishorSangathanLeaders + c.yuvaSansadDelegates}
              note="Across three tiers of youth parliament"
              src="REC-INST-02"
            />
          </StatRow>

          <div className="grid gap-x-10 gap-y-10 lg:grid-cols-2">
            <div>
              <h3 className="t-h3">Three tiers of youth parliament</h3>
              <dl className="defs mt-4">
                {[
                  { n: 'Bal Sansad', v: `${c.balSansadMinisters} ministers`, id: 'REC-INST-02', d: 'Primary-school ministers who monitor teacher attendance and kitchen hygiene every day.' },
                  { n: 'Kishor Sangathan', v: `${c.kishorSangathanLeaders} leaders`, id: 'REC-INST-03', d: 'Adolescent peers who campaign against child marriage and for secondary schooling and menstrual hygiene.' },
                  { n: 'Yuva Sansad', v: `${c.yuvaSansadDelegates} delegates`, id: 'REC-INST-04', d: 'Young adults who run the Jan Suvidha Kendra kiosks, file RTI applications and carry Gram Sabha resolutions.' },
                ].map((t) => (
                  <div className="def" key={t.n} style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
                    <dt className="flex items-baseline justify-between gap-4">
                      <span className="font-semibold text-ink">{t.n}</span>
                      <Src id={t.id}>{t.v}</Src>
                    </dt>
                    <dd className="text-ink-2" style={{ color: 'var(--ink-2)' }}>
                      {t.d}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <h3 className="t-h3">Frontline cadres reach nearly every home</h3>
              <div className="mt-4 border-t border-ink">
                {[
                  { n: 'Baghmitra / Gajmitra', v: c.baghmitraGajmitraLinkages, id: 'REC-INST-07', d: 'Community wildlife scouts on the tiger and elephant corridors, running solar early-warning alarms and patrols.' },
                  { n: 'Krishi Mitra', v: c.krishiMitraLinkages, id: 'REC-INST-08', d: 'Peer agro-ecology trainers for bio-input fermentation, botanical pest repellents and bamboo trellis building.' },
                ].map((x) => (
                  <div key={x.n} className="border-b border-rule py-4">
                    <div className="flex items-baseline justify-between gap-4 text-[0.875rem]">
                      <span className="font-semibold text-ink">{x.n}</span>
                      <span className="num text-ink-2">
                        <Src id={x.id}>{num(x.v)}</Src> of {num(k.totalHouseholdsSurveyed)} households
                      </span>
                    </div>
                    <div className="mt-3">
                      <Meter value={x.v} max={k.totalHouseholdsSurveyed} label={`${x.n}: ${x.v} households linked`} />
                    </div>
                    <p className="t-note mt-3">{x.d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="t-body">
            Training holds it together: <Src id="REC-TRN-01">{num(k.trainingSessionsCount)} sessions</Src> and{' '}
            <Src id="REC-TRN-02">{num(k.trainingAttendancesCount)} attendances</Src> since 2021. The largest affinity groups
            include {AFFINITY_SAMPLE.map((a) => `${a.name} (${a.village}, ${a.members})`).join(', ')}.
          </p>
        </Section>

        {/* 0.7 — Lessons */}
        <Section
          id="lessons"
          no="0.7"
          kicker="What it taught"
          title="Four lessons for whoever funds the next one."
          intro="Drawn from the five-year evaluation. Each is argued in full in its chapter."
        >
          <div className="grid gap-x-12 gap-y-10 border-t border-ink pt-8 md:grid-cols-2">
            {lessons.map((l, i) => (
              <Reveal key={l.title} delay={i * 70}>
                <div className="font-display text-[2.25rem] leading-none tracking-[-0.03em] text-haldi-ink">{i + 1}</div>
                <h3 className="t-h3 mt-3">{l.title}</h3>
                <p className="t-body mt-2">{l.body}</p>
                <button type="button" className="link mt-4" onClick={() => onNavigate(l.to)}>
                  {l.cta} <ArrowRight size={14} />
                </button>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 0.8 — Method */}
        <Section
          id="method"
          no="0.8"
          kicker="How we know"
          title="A door-to-door census, then an audit of every claim."
          intro={
            <>
              Figures for 2022–2024 come from survey wave one ({metadata.surveyWave1Window.replace(/\s*\(.*\)/, '')}, 1,329
              households). Figures for 2025–2026 come from wave two, the Family Development Booklet census cut on 5 November
              2026.
            </>
          }
          aside="Press S, or use “Show sources” in the top bar, to print the survey cell under every figure on the site."
        >
          <StatRow cols={4}>
            <Stat label="Survey submissions" countTo={f.visibleSubmissions} src="REC-ADM-01" note="Wave two, all seven panchayats" />
            <Stat
              label="Complete and validated"
              countTo={f.completedValidatedSurveys}
              src="REC-ADM-02"
              note={`${f.incompleteSurveys} incomplete and ${f.duplicateSurveys} duplicate entries set aside`}
            />
            <Stat
              label="Paper booklets deposited"
              countTo={f.physicalBookletsDeposited}
              src="REC-ADM-05"
              note={`${pct((f.physicalBookletsDeposited / f.visibleSubmissions) * 100, 2)} of submissions have a physical record`}
            />
            <Stat label="Surveyors" countTo={f.totalSurveyors} src="REC-ADM-08" note={`${num(f.enumeratorPaymentsDisbursed)} surveys paid, ${num(f.enumeratorPaymentsPending)} pending audit`} />
          </StatRow>

          <Figure
            no="0.6"
            title={`What became of the ${num(audit.totalAuditedClaims)} claims in earlier reports`}
            caption="Verified: matches the microdata exactly. Reconciled: restated on a consistent base. Neutralised: an error or artefact, removed."
            legend={[
              { label: `Verified · ${audit.verifiedClaimsCount}`, color: 'var(--forest)' },
              { label: `Reconciled · ${audit.reconciledClaimsCount}`, color: 'var(--haldi-mark)' },
              { label: `Neutralised · ${audit.neutralizedDefectsCount}`, color: 'var(--clay)' },
            ]}
          >
            <ShareBar
              height={22}
              parts={[
                { value: audit.verifiedClaimsCount, color: 'var(--forest)', label: 'Verified' },
                { value: audit.reconciledClaimsCount, color: 'var(--haldi-mark)', label: 'Reconciled' },
                { value: audit.neutralizedDefectsCount, color: 'var(--clay)', label: 'Neutralised' },
              ]}
            />
          </Figure>

          <button type="button" className="link" onClick={() => onNavigate('forensic')}>
            Read how the audit was done <ArrowRight size={15} />
          </button>
        </Section>
      </div>
    </>
  );
};
