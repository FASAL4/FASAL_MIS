import React, { useState } from 'react';
import { CartesianGrid, Line, LineChart, ReferenceArea, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { fasalMasterData } from '@/data/fasalMasterData';
import { Thali } from './Thali';
import {
  type ChapterProps, C, ChapterOpener, ChartTooltip, Figure, Meter, Note, Section, Segmented, Src, Stat, StatRow,
  chartMargin, gridProps, num, pct, xAxisProps, yAxisProps,
} from '../../ui';

type Focus = 'all' | 'green' | 'yellow' | 'white';

/** Baseline (hatched) above endline (solid), on one scale. */
const ThenNow: React.FC<{ label: string; then: number; now: number; max?: number; unit?: string; thenLabel?: string; nowLabel?: string; tone?: 'forest' | 'haldi' }> = ({
  label, then, now, max = 100, unit = '%', thenLabel = '2022', nowLabel = '2026', tone = 'forest',
}) => (
  <div className="border-b border-rule py-5">
    <div className="text-[0.9375rem] font-semibold text-ink">{label}</div>
    {[{ l: thenLabel, v: then, base: true }, { l: nowLabel, v: now, base: false }].map((r) => (
      <div key={r.l} className="mt-3 grid grid-cols-[3rem_minmax(0,1fr)_5rem] items-center gap-4 text-[0.875rem]">
        <span className="text-ink-3">{r.l}</span>
        <Meter value={r.v} max={max} hatch={r.base} tone={r.base ? 'stone' : tone} size="lg" label={`${r.l}: ${r.v}${unit}`} />
        <span className={`num text-right ${r.base ? 'text-ink-3' : 'font-semibold text-ink'}`}>{num(r.v, unit === '%' ? 1 : 0)}{unit}</span>
      </div>
    ))}
  </div>
);

export const NutritionChapter: React.FC<ChapterProps> = ({ onOpenLedger }) => {
  const { nutrition: n } = fasalMasterData;
  const green = n.foodGroupRecall.greenFoodsVegetables;
  const yellow = n.foodGroupRecall.yellowFoodsPulses;
  const white = n.foodGroupRecall.whiteFoodsStaples;
  const pv = n.poshanVatikas;
  const months = n.monthlySeasonalDynamics;
  const [focus, setFocus] = useState<Focus>('all');

  const summer = months.filter((m) => m.isSummerPeakWindow).map((m) => m.calendarMonth);
  const dim = (k: Focus) => (focus === 'all' || focus === k ? 1 : 0.18);

  return (
    <>
      <ChapterOpener
        no="04"
        name="Nutrition"
        title={<>Pulses are back on the plate, and the <em className="accent">winter vegetable gap</em> is closing.</>}
        lead="Households recalled what they ate, month by month, across five years. The survey groups food by colour: white for staples, green for vegetables, yellow for pulses."
      >
        <StatRow cols={4}>
          <Stat label="Households eating pulses weekly" countTo={yellow.endlineWeeklyPct} format={(v) => pct(v, 1)} delta={`+${yellow.reversalExpansionGainPp} pts since 2022`} tone="haldi" src="REC-NUTR-04" />
          <Stat label="Green vegetables in the winter trough" countTo={green.winterTroughEndlinePct} format={(v) => pct(v, 1)} delta={`+${green.netWinterRemediationGainPp} pts since 2022`} src="REC-NUTR-03" />
          <Stat label="Poshan Vatika kitchen gardens" countTo={pv.endlineGardensCount} unit="+" delta={`from ${num(pv.baselineGardensCount)} in 2022`} />
          <Stat label="Households with a garden" value={`~${pct(pv.saturationPctOfHHs, 0)}`} tone="ink" />
        </StatRow>
      </ChapterOpener>

      <div className="wrap">
        <Section
          id="calendar" no="4.1" kicker="The food calendar"
          title="Staples never run short. Vegetables rise and fall with the season."
          intro={<>Share of households eating each food group, by month. Vegetables peak in {summer.join(' and ')} and bottom out in December. The record runs <Src id="REC-NUTR-01">60 months</Src> without a break.</>}
          aside="White: rice, wheat, dairy. Green: leafy and other vegetables. Yellow: pulses and lentils."
        >
          <Figure title="The plate, month by month: each portion is the share of households eating that group" src="REC-NUTR-01">
            <Thali months={months} />
          </Figure>
          <Figure
            no="4.1" title="Households eating each food group, by month (%)" src="REC-NUTR-01"
            legend={[{ label: 'White · staples', color: C.stone, shape: 'line' }, { label: 'Green · vegetables', color: C.forest, shape: 'line' }, { label: 'Yellow · pulses', color: C.haldi, shape: 'line' }]}
            actions={<Segmented<Focus> label="Emphasise" value={focus} onChange={setFocus} options={[{ value: 'all', label: 'All' }, { value: 'green', label: 'Green' }, { value: 'yellow', label: 'Yellow' }, { value: 'white', label: 'White' }]} />}
            caption="Shaded bands: the January–February end of the winter trough (it begins in December) and the early-summer peak."
          >
            <div className="h-[360px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={months} margin={chartMargin}>
                  <CartesianGrid {...gridProps} />
                  <ReferenceArea x1="Jan" x2="Feb" fill="var(--river)" fillOpacity={0.1} />
                  {summer.length > 0 && <ReferenceArea x1={summer[0]} x2={summer[summer.length - 1]} fill="var(--haldi)" fillOpacity={0.16} />}
                  <XAxis dataKey="calendarMonth" {...xAxisProps} interval={0} />
                  <YAxis {...yAxisProps} domain={[0, 100]} tickFormatter={(v: number) => `${v}%`} width={44} />
                  <Tooltip
                    content={<ChartTooltip format={(v) => pct(v, 1)} labels={{ whiteFoodsAccessPct: 'White · staples', greenFoodsAccessPct: 'Green · vegetables', yellowFoodsAccessPct: 'Yellow · pulses' }} note={(p) => String(p?.[0]?.payload?.notes ?? '')} />}
                    cursor={{ stroke: C.ruleStrong }}
                  />
                  <Line type="monotone" dataKey="whiteFoodsAccessPct" stroke={C.stone} strokeOpacity={dim('white')} strokeWidth={2.25} dot={false} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="yellowFoodsAccessPct" stroke={C.haldi} strokeOpacity={dim('yellow')} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.haldi, fillOpacity: dim('yellow') }} activeDot={{ r: 5 }} />
                  <Line type="monotone" dataKey="greenFoodsAccessPct" stroke={C.forest} strokeOpacity={dim('green')} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.forest, fillOpacity: dim('green') }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Figure>
          <details>
            <summary className="link cursor-pointer">Month-by-month notes</summary>
            <div className="tbl-wrap mt-4">
              <table className="tbl tbl--dense">
                <thead><tr><th>Month</th><th className="r">White</th><th className="r">Green</th><th className="r">Yellow</th><th>Field note</th></tr></thead>
                <tbody>
                  {months.map((m) => (
                    <tr key={m.calendarMonth}>
                      <td className="strong">{m.calendarMonth}</td>
                      <td className="r">{pct(m.whiteFoodsAccessPct, 1)}</td>
                      <td className="r">{pct(m.greenFoodsAccessPct, 1)}</td>
                      <td className="r">{pct(m.yellowFoodsAccessPct, 1)}</td>
                      <td className="muted" style={{ minWidth: 240 }}>{m.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </Section>

        <Section
          id="winter" no="4.2" kicker="The hunger gap"
          title="The lean season for vegetables is winter, not summer."
          intro={<>Earlier reports described a summer hunger gap. The monthly record shows the reverse: vegetable eating peaks at {green.summerPeakPctRange.replace(' - ', ' to ')} in early summer, when riverbed gourds and trellis crops come in, and falls lowest in the cold months.</>}
        >
          <Figure no="4.2" title="Households eating green vegetables in the winter trough (%)" src="REC-NUTR-03">
            <div className="border-t border-ink">
              <ThenNow label="Winter trough" then={green.winterTroughBaselinePct} now={green.winterTroughEndlinePct} />
            </div>
          </Figure>
          <Note kind="audit" title="A claim that was turned around.">
            {green.invertedMythDescription}.{' '}
            <button type="button" className="link" onClick={() => onOpenLedger('REC-NUTR-02')}>See the ledger entry</button>
          </Note>
        </Section>

        <Section
          id="pulses" no="4.3" kicker="Pulses"
          title="Two in three households now eat pulses every week."
          intro={<>Up from {pct(yellow.baselineWeeklyPct, 1)} in 2022. Families hold back about {yellow.indigenousPulseRetentionKg} kg of their own pulses before selling the rest, so the supply at home no longer depends on the market price.</>}
        >
          <Figure no="4.3" title="Households eating pulses at least weekly (%)" src="REC-NUTR-04">
            <div className="border-t border-ink">
              <ThenNow label="Weekly pulse eating" then={yellow.baselineWeeklyPct} now={yellow.endlineWeeklyPct} tone="haldi" />
            </div>
          </Figure>
        </Section>

        <Section
          id="gardens" no="4.4" kicker="Poshan Vatika"
          title="Kitchen gardens went from 200 homes to more than 1,100."
          intro="A Poshan Vatika is a small homestead garden planted with many vegetables at once, so something is ready to pick in every season, including winter."
        >
          <Figure no="4.4" title="Homestead nutrition gardens" caption={`Planted for: ${pv.micronutrientKeyFocus.join(', ').toLowerCase()}.`}>
            <div className="border-t border-ink">
              <ThenNow label="Gardens in use" then={pv.baselineGardensCount} now={pv.endlineGardensCount} max={pv.endlineGardensCount} unit="" />
            </div>
          </Figure>
        </Section>

        <Section
          id="staples" no="4.5" kicker="Staples"
          title="The staple base is universal and has stayed that way."
          intro={<>{white.accessDynamic}. Between {white.baselineRangePct.replace(' - ', ' and ')} of households ate staples in any month of 2022; in 2026 the range is {white.endlineRangePct.replace(' - ', ' to ')}.</>}
        >
          <Note kind="method" title="How to read this chapter.">
            These are recall shares: the proportion of households that reported eating a food group in a month. They show access and season, not quantities eaten or nutritional status.
          </Note>
        </Section>
      </div>
    </>
  );
};
