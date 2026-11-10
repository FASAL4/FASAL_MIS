import React, { useState } from 'react';
import { fasalMasterData } from '@/data/fasalMasterData';
import {
  type ChapterProps, ChapterOpener, Figure, Meter, Note, Section, Segmented, ShareBar, Src, Stat, StatRow, Tag,
  inr, num, pct,
} from '../../ui';

const STATUS: Record<string, string> = { EXCEEDED: 'Exceeded', MET: 'Met', ON_TRACK: 'On track', NOT_MET: 'Not met' };

export const RFChapter: React.FC<ChapterProps> = ({ onOpenLedger }) => {
  const { rfProgression: rf } = fasalMasterData;
  const land = rf.landholdingStructure;
  const leisa = rf.leisaTransition;
  const base = rf.bighaSensitivity.find((b) => b.isProjectBaseline) ?? rf.bighaSensitivity[0];
  const [std, setStd] = useState(String(base.multiplierAcrePerBigha));
  const chosen = rf.bighaSensitivity.find((b) => String(b.multiplierAcrePerBigha) === std) ?? base;
  const maxYield = Math.max(...leisa.physicalYields.map((y) => y.yieldPerAcreQuintals));

  return (
    <>
      <ChapterOpener
        no="02"
        name="Farming"
        title={<>Every target in the results framework was beaten, on farms <em className="accent">smaller than an acre</em>.</>}
        lead="How the land is farmed now: tiny holdings, home-made biological inputs in place of bought chemicals, and bamboo trellises that grow two crops where one grew before."
      >
        <StatRow cols={4}>
          <Stat label="Net farm income per acre" value={rf.benchmarks[0]?.achievedValueFormatted.replace(' / acre', '')} unit="per acre" delta={`target ${rf.benchmarks[0]?.targetValueFormatted.replace(' / acre', '')}`} />
          <Stat label="Landholders above the target" countTo={base.benchmarkAttainmentPct} format={(n) => pct(n, 1)} delta="target 70%" />
          <Stat label="Mean holding" countTo={land.meanLandAcres020} format={(n) => n.toFixed(2)} unit="acres" delta={`${land.meanLandBigha} bigha`} tone="ink" src="REC-LAND-03" />
          <Stat label="Households with a machan trellis" countTo={leisa.machanTrellisFarmsCount} delta="target 400" />
        </StatRow>
      </ChapterOpener>

      <div className="wrap">
        <Section
          id="targets" no="2.1" kicker="Targets and results"
          title="Four benchmarks, four exceeded."
          intro="The grant’s results framework set four farm-level targets. The tick on each bar marks the target; the bar is what the 2026 census found."
        >
          <Figure no="2.1" title="Results-framework benchmarks: target and achievement">
            <div className="border-t border-ink">
              {rf.benchmarks.map((b) => (
                <div key={b.indicatorKey} className="grid gap-x-8 gap-y-3 border-b border-rule py-5 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[0.9375rem] font-semibold text-ink">{b.label.replace(/\s*\(.*\)$/, '')}</span>
                      <Tag tone={b.status === 'NOT_MET' ? 'clay' : 'forest'}>{STATUS[b.status] ?? b.status}</Tag>
                    </div>
                    <p className="t-note mt-1.5">{b.notes}</p>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-4 text-[0.8125rem] text-ink-3">
                      <span>Target {b.targetValueFormatted}</span>
                      <span className="font-display text-[1.375rem] leading-none tracking-[-0.02em] text-ink">{b.achievedValueFormatted}</span>
                    </div>
                    <div className="mt-3"><Meter value={Math.min(b.attainmentPct, 200)} max={200} target={100} size="lg" label={`${b.attainmentPct}% of target`} /></div>
                    <div className="t-note mt-2 num">{pct(b.attainmentPct, 1)} of target</div>
                  </div>
                </div>
              ))}
            </div>
          </Figure>
        </Section>

        <Section
          id="land" no="2.2" kicker="The land"
          title="Nine in ten landholders farm an acre or less."
          intro={<>The whole programme stands on <Src id="REC-LAND-02">{num(land.totalPhysicalAcres020, 2)} acres</Src>. The median household works <Src id="REC-LAND-04">{land.medianLandAcres020.toFixed(2)} of an acre</Src>, about three bigha.</>}
          aside="A bigha is the local land unit. Here five bigha make one acre."
        >
          <StatRow cols={4}>
            <Stat size="md" label="Total farmed land" value={num(land.regexParsedTotalBigha, 2)} unit="bigha" note={`${num(land.totalPhysicalAcres020, 2)} acres`} src="REC-LAND-01" />
            <Stat size="md" label="At or under one acre" value={pct(land.smallholderProportionLe1Acre, 1)} note="of landholders" src="REC-LAND-09" />
            <Stat size="md" label="Households with no farmland" value={num(land.landlessHHsCount)} note="report zero bigha" src="REC-LAND-05" tone="ink" />
            <Stat size="md" label="Homestead only, no titled plot" value={num(land.unparsedHomesteadHHsCount)} note="gave no parcel size" src="REC-LAND-06" tone="ink" />
          </StatRow>
          <Figure no="2.2" title="Owned and leased land (acres)" src="REC-LAND-07" legend={[{ label: `Owned · ${num(land.ownedLandAcres, 2)} acres`, color: 'var(--forest)' }, { label: `Leased or sharecropped (batai) · ${num(land.leasedBataiLandAcres, 2)} acres`, color: 'var(--haldi-mark)' }]}>
            <ShareBar height={18} parts={[{ value: land.ownedLandAcres, color: 'var(--forest)', label: 'Owned' }, { value: land.leasedBataiLandAcres, color: 'var(--haldi-mark)', label: 'Leased' }]} />
          </Figure>
        </Section>

        <Section
          id="bigha" no="2.3" kicker="What is a bigha?"
          title="The per-acre result depends on which bigha you mean."
          intro="A bigha is not one size across Uttar Pradesh. The survey recorded land in the local kacha bigha, and the project counts five to the acre. Pick another standard to see how the headline would move."
          aside="Earlier files assumed 0.619 acre per bigha, which made farms look three times larger and incomes per acre three times smaller."
        >
          <Figure
            no="2.3" title="Sensitivity of the headline to the bigha standard"
            actions={<Segmented label="Bigha standard" value={std} onChange={setStd} options={rf.bighaSensitivity.map((b) => ({ value: String(b.multiplierAcrePerBigha), label: `${b.multiplierAcrePerBigha} acre` }))} />}
          >
            <StatRow cols={3}>
              <Stat size="md" quiet label={chosen.standardName} value={pct(chosen.benchmarkAttainmentPct, 1)} note="of landholders above ₹60,000 an acre" tone={chosen.isProjectBaseline ? 'forest' : 'ink'} delta={chosen.isProjectBaseline ? 'Project standard' : 'Alternative standard'} />
              <Stat size="md" quiet label="Mean holding" value={chosen.meanAcresPerHH.toFixed(2)} unit="acres" />
              <Stat size="md" quiet label="Total land" value={num(chosen.totalAcresDerived, 2)} unit="acres" />
            </StatRow>
            <div className="tbl-wrap mt-8">
              <table className="tbl">
                <thead><tr><th>Standard</th><th className="r">Acre per bigha</th><th className="r">Total acres</th><th className="r">Mean acres</th><th style={{ width: '26%' }}>Above the target</th></tr></thead>
                <tbody>
                  {rf.bighaSensitivity.map((b) => (
                    <tr key={b.standardName} onClick={() => setStd(String(b.multiplierAcrePerBigha))} style={{ cursor: 'pointer', background: b === chosen ? 'color-mix(in srgb, var(--haldi) 14%, transparent)' : undefined }}>
                      <td className="strong" style={{ minWidth: 240 }}>{b.standardName}{b.isProjectBaseline && <> <Tag tone="haldi">Used here</Tag></>}<span className="sub">{b.regionalContext}</span></td>
                      <td className="r">{b.multiplierAcrePerBigha}</td>
                      <td className="r">{num(b.totalAcresDerived, 2)}</td>
                      <td className="r">{b.meanAcresPerHH.toFixed(2)}</td>
                      <td><div className="flex items-center gap-3"><div className="flex-1"><Meter value={b.benchmarkAttainmentPct} target={70} tone={b.isProjectBaseline ? 'forest' : 'stone'} /></div><span className="w-12 text-right">{pct(b.benchmarkAttainmentPct, 1)}</span></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Figure>
          <Note kind="audit" title="The unit was fixed at the source.">
            The questionnaire header says “in bigha”, and local practice is five kacha bigha to the acre. All per-acre figures on this site use 0.20.{' '}
            <button type="button" className="link" onClick={() => onOpenLedger('REC-HYG-04')}>See the ledger entry</button>
          </Note>
        </Section>

        <Section
          id="leisa" no="2.4" kicker="Inputs"
          title="Farmers now brew their own inputs instead of buying chemicals."
          intro="LEISA, low external input sustainable agriculture, replaces bought fertiliser and pesticide with preparations fermented at home in 200-litre drums."
        >
          <StatRow cols={4}>
            <Stat label="Cut in chemical pesticide" value={`~${leisa.chemicalPesticideCutPct}%`} />
            <Stat label="Bio-input drums in use" countTo={leisa.bioNutrientDrumsCount} unit="+" note="200-litre units" />
            <Stat label="Cost of cultivation" value={`~${inr(leisa.averageCultivationCostPerBighaINR)}`} unit="per bigha" tone="ink" />
            <Stat label="Land equivalent ratio" value={`> ${leisa.lerLandEquivalentRatio.toFixed(1)}`} note="on trellised plots" />
          </StatRow>
          <div>
            <h3 className="t-h3">What goes into the drums</h3>
            <dl className="defs mt-4">
              {leisa.formulationsAdopted.map((f) => (
                <div className="def" key={f.name} style={{ gridTemplateColumns: 'minmax(0,0.7fr) minmax(0,1.6fr)' }}>
                  <dt><span className="font-semibold text-ink">{f.name}</span><span className="block text-[0.78125rem]">{f.type}</span></dt>
                  <dd><span className="block">{f.ingredients}</span><span className="t-note mt-1 block">{f.applicationTarget}</span></dd>
                </div>
              ))}
            </dl>
          </div>
          <Figure no="2.4" title="Physical yields (quintals per acre)">
            <div className="border-t border-rule">
              {leisa.physicalYields.map((y) => (
                <div key={y.crop} className="grid grid-cols-[7rem_minmax(0,1fr)_9rem] items-center gap-4 border-b border-rule py-3 text-[0.875rem]">
                  <span className="font-semibold text-ink">{y.crop}</span>
                  <Meter value={y.yieldPerAcreQuintals} max={maxYield} tone={y.crop === 'Turmeric' ? 'haldi' : 'forest'} />
                  <span className="num text-right text-ink-2">{y.yieldPerAcreQuintals} q <span className="text-ink-3">· {num(y.yieldPerBighaKg)} kg/bigha</span></span>
                </div>
              ))}
            </div>
          </Figure>
        </Section>

        <Section
          id="machan" no="2.5" kicker="The machan"
          title="A bamboo trellis turns one field into two."
          intro={<>A machan is a raised bamboo frame. Gourds and beans climb over it while turmeric, ginger or leafy crops grow in the shade beneath. <Src id="REC-CROP-04">{num(leisa.machanTrellisFarmsCount)} households</Src> now farm this way.</>}
          aside="Land equivalent ratio above 2 means the trellised plot yields what two separate single-crop plots would."
        >
          <Figure no="2.5" title="One plot, two tiers">
            <svg viewBox="0 0 800 220" role="img" aria-label="Diagram of a machan: climbers on a bamboo frame above, shade crops below" style={{ width: '100%', height: 'auto' }}>
              <line x1="20" y1="196" x2="700" y2="196" stroke="var(--ink)" strokeWidth="1" />
              {[90, 250, 410, 570].map((x) => <line key={x} x1={x} y1="196" x2={x} y2="70" stroke="var(--ink)" strokeWidth="2" />)}
              <line x1="60" y1="70" x2="600" y2="70" stroke="var(--ink)" strokeWidth="2" />
              <line x1="60" y1="84" x2="600" y2="84" stroke="var(--ink)" strokeWidth="1" />
              {Array.from({ length: 22 }, (_, i) => <circle key={i} cx={75 + i * 24} cy={58 - (i % 3) * 7} r="9" fill="var(--forest)" opacity={0.55 + (i % 3) * 0.15} />)}
              {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${112 + i * 56} 84 q4 22 -2 44`} stroke="var(--forest)" strokeWidth="1.5" fill="none" />)}
              {Array.from({ length: 17 }, (_, i) => <path key={i} d={`M${82 + i * 31} 196 q-9 -26 0 -40 q9 14 0 40`} fill="var(--haldi-mark)" />)}
              <text x="622" y="62" fontSize="13" fill="var(--ink-2)" fontFamily="var(--font-sans)">Climbers: gourds, beans</text>
              <text x="622" y="176" fontSize="13" fill="var(--ink-2)" fontFamily="var(--font-sans)">Shade crops below</text>
            </svg>
          </Figure>
        </Section>
      </div>
    </>
  );
};
