import React, { useState } from 'react';
import type { EntitlementSchemeDelivery, RightsEntitlementsData } from '@/types/dashboard';
import { Figure, Meter, Note, Section, Segmented, Src, num, pct } from '../../ui';
import { RoundBars } from './RoundBars';
import {
  CATEGORY_LABEL,
  CATEGORY_ORDER,
  type CategoryFilter,
  FUNNEL,
  REFERENCE_PCT,
  ROUNDS,
  SCHEME_SRC,
  SCHOOL_DESKS,
  averageCount,
  capital,
  funnelFor,
  roundsOf,
  schemeDetail,
  schemeName,
  word,
} from './rightsData';

type Unit = 'share' | 'households';
type RoundView = 'avg' | 'r1' | 'r2' | 'r3' | 'r4';
type ServiceView = 'rounds' | 'reference';

/** Shared scale for every four-round bar in the chapter, in % of households. */
const BAR_MAX = 50;

const peakedInRoundOne = (s: EntitlementSchemeDelivery) =>
  s.round1Pct >= Math.max(s.round2Pct, s.round3Pct, s.round4Pct);

/* ----------------------------------------------------------------------------
   3.4 — Entitlements reaching households
---------------------------------------------------------------------------- */
export const Entitlements: React.FC<{ schemes: EntitlementSchemeDelivery[] }> = ({ schemes }) => {
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [unit, setUnit] = useState<Unit>('share');
  const [schemeKey, setSchemeKey] = useState<string>(schemes[0]?.schemeKey ?? '');
  const [round, setRound] = useState<RoundView>('avg');

  const ranked = [...schemes].sort((a, b) => b.fourRoundAveragePct - a.fourRoundAveragePct);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];
  const shown = ranked.filter((s) => category === 'all' || s.category === category);
  const allPeakedFirst = schemes.every(peakedInRoundOne);
  const universe = top?.sampleUniverse ?? 0;

  const categories = CATEGORY_ORDER.filter((c) => schemes.some((s) => s.category === c));

  // The scheme in focus for the three-step figure
  const focus = schemes.find((s) => s.schemeKey === schemeKey) ?? schemes[0];
  const focusRounds = roundsOf(focus);
  const roundIndex = round === 'avg' ? -1 : Number(round.slice(1)) - 1;
  const receipt =
    roundIndex < 0
      ? { count: averageCount(focus), pct: focus.fourRoundAveragePct, label: 'four-round average' }
      : {
          count: focusRounds[roundIndex].count,
          pct: focusRounds[roundIndex].pct,
          label: `${ROUNDS[roundIndex].name.toLowerCase()}, ${ROUNDS[roundIndex].period}`,
        };
  const modelled = funnelFor(receipt.count, focus.sampleUniverse);
  const share = (count: number) => (count / focus.sampleUniverse) * 100;
  const steps = [
    {
      name: 'Knows the entitlement',
      gloss: 'jankari',
      count: modelled.aware,
      pct: share(modelled.aware),
      tone: 'stone' as const,
      basis: 'Modelled.',
      text: 'The household has been told the rules, eligibility and deadlines for the scheme at an AAS group meeting.',
    },
    {
      name: 'Leads the demand',
      gloss: 'agwai',
      count: modelled.lead,
      pct: share(modelled.lead),
      tone: 'haldi' as const,
      basis: 'Modelled.',
      text: 'The people affected file the application, join the deputation and attend the Gram Sabha themselves.',
    },
    {
      name: 'Receives it',
      gloss: 'prapti',
      count: receipt.count,
      pct: receipt.pct,
      tone: 'forest' as const,
      basis: 'Recorded in the survey.',
      text: 'The welfare benefit, civil work or frontline service is recorded as received.',
    },
  ];

  return (
    <Section
      id="entitlements"
      no="3.4"
      kicker="Entitlements"
      title="On average, each entitlement reached between a fifth and just under half of households."
      intro={
        <>
          The household survey tracks <Src id="REC-RNE-01">77 public schemes</Src> in four half-year rounds, from January 2025
          to December 2026. The {word(schemes.length)} below have a full four-round series. {schemeName(top)} reached the
          most households, {pct(top.fourRoundAveragePct)} on average; {schemeName(bottom)} reached the fewest,{' '}
          {pct(bottom.fourRoundAveragePct)}.
          {allPeakedFirst && ' Every one of them recorded its highest share in the first round.'}
        </>
      }
      aside={`Every percentage is a share of all ${num(universe)} surveyed households. A round is one half-year survey window.`}
    >
      <Figure
        no="3.4"
        title={
          unit === 'share'
            ? 'Households receiving each scheme, by survey round (% of households)'
            : 'Households receiving each scheme, by survey round (number of households)'
        }
        src="REC-RNE-01"
        legend={[
          { label: 'Rounds 1 to 3', color: 'color-mix(in srgb, var(--forest) 40%, var(--paper))' },
          { label: 'Round 4, the latest', color: 'var(--forest)' },
        ]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Segmented<CategoryFilter>
              label="Scheme category"
              value={category}
              onChange={setCategory}
              options={[
                { value: 'all', label: 'All' },
                ...categories.map((c) => ({ value: c as CategoryFilter, label: CATEGORY_LABEL[c] })),
              ]}
            />
            <Segmented<Unit>
              label="Unit"
              value={unit}
              onChange={setUnit}
              options={[
                { value: 'share', label: 'Share' },
                { value: 'households', label: 'Households' },
              ]}
            />
          </div>
        }
        caption={`${shown.length} of ${schemes.length} schemes shown, ranked by four-round average. The small bars share one scale, 0 to ${BAR_MAX}% of households.`}
      >
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Scheme</th>
                <th>Four rounds</th>
                {ROUNDS.map((r) => (
                  <th key={r.short} className="r">
                    {r.name}
                    <span className="sub normal-case tracking-normal">{r.period}</span>
                  </th>
                ))}
                <th className="r">Average</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((s) => {
                const rounds = roundsOf(s);
                const src = SCHEME_SRC[s.schemeKey];
                return (
                  <tr key={s.schemeKey}>
                    <td className="strong" style={{ minWidth: 230 }}>
                      {schemeName(s)}
                      <span className="sub">
                        {CATEGORY_LABEL[s.category]} · {s.department}
                      </span>
                    </td>
                    <td style={{ minWidth: 64 }}>
                      <RoundBars values={rounds.map((r) => r.pct)} max={BAR_MAX} format={(v) => pct(v)} />
                    </td>
                    {rounds.map((r, i) => {
                      const value = unit === 'share' ? pct(r.pct) : num(r.count);
                      return (
                        <td key={ROUNDS[i].short} className="r" style={{ minWidth: 84 }}>
                          {i === 0 && unit === 'share' && src ? <Src id={src}>{value}</Src> : value}
                        </td>
                      );
                    })}
                    <td className="r strong" style={{ minWidth: 84 }}>
                      {unit === 'share' ? pct(s.fourRoundAveragePct) : num(averageCount(s))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Figure>

      <Figure
        no="3.5"
        title={`From knowing to leading to receiving: ${schemeName(focus).toLowerCase()}, ${receipt.label}`}
        src={SCHEME_SRC[focus.schemeKey]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="input"
              style={{ width: 'auto', maxWidth: '100%', height: 32, fontSize: '0.78125rem' }}
              aria-label="Scheme shown in the three steps"
              value={focus.schemeKey}
              onChange={(e) => setSchemeKey(e.target.value)}
            >
              {ranked.map((s) => (
                <option key={s.schemeKey} value={s.schemeKey}>
                  {schemeName(s)} · {pct(s.fourRoundAveragePct)}
                </option>
              ))}
            </select>
            <Segmented<RoundView>
              label="Survey round"
              value={round}
              onChange={setRound}
              options={[
                { value: 'avg', label: 'Average' },
                ...ROUNDS.map((r, i) => ({ value: `r${i + 1}` as RoundView, label: r.short })),
              ]}
            />
          </div>
        }
        caption={`Only receipt is recorded. The two earlier steps are modelled from it with the programme’s conversion rates: ${pct(FUNNEL.leadToReceiptPct)} of households that lead a demand go on to receive the scheme, and ${pct(FUNNEL.awareToLeadPct)} of households that know of it go on to lead.`}
      >
        <p className="t-note" style={{ maxWidth: '70ch' }}>
          {schemeDetail(focus)} Department: {focus.department}.
        </p>
        <div className="mt-4 border-t border-ink">
          {steps.map((step) => (
            <div key={step.gloss} className="border-b border-rule py-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.875rem]">
                <span className="font-semibold text-ink">
                  {step.name} <span className="font-normal italic text-ink-3">({step.gloss})</span>
                </span>
                <span className="num text-ink-2">
                  {num(step.count)} of {num(focus.sampleUniverse)} households ·{' '}
                  <span className="font-semibold text-ink">{pct(step.pct)}</span>
                </span>
              </div>
              <div className="mt-3">
                <Meter
                  value={step.pct}
                  tone={step.tone}
                  label={`${step.name}: ${pct(step.pct)} of households`}
                />
              </div>
              <p className="t-note mt-3">
                {step.text} {step.basis}
              </p>
            </div>
          ))}
        </div>
      </Figure>

      <Note kind="finding" title="Households that receive a scheme have usually led the demand themselves.">
        Across the schemes, {FUNNEL.coRecordedRange} of the households that reported receiving one also reported agwai, taking
        the lead. This is the working rule of the union, “Jiska mudda, uski agwai”: whoever has the problem leads on it.
        Members frame their own demands and negotiate with officials directly, with no intermediary.
      </Note>
    </Section>
  );
};

/* ----------------------------------------------------------------------------
   3.5 — Frontline services across rounds
---------------------------------------------------------------------------- */
export const FrontlineServices: React.FC<{
  services: RightsEntitlementsData['stableFrontlineServices'];
  schemes: EntitlementSchemeDelivery[];
  balSansadMinisters: number;
  unionMembers: number;
}> = ({ services, schemes, balSansadMinisters, unionMembers }) => {
  const [view, setView] = useState<ServiceView>('rounds');

  const rows = [
    { key: 'essential_meds', short: 'Essential medicines', avg: services.essentialMedicationCoveragePct },
    { key: 'sanitary_napkins', short: 'Sanitary napkins', avg: services.sanitaryNapkinsCoveragePct },
    { key: 'teacher_attendance', short: 'Teachers present daily', avg: services.teacherDailyAttendancePct },
    { key: 'mid_day_meal', short: 'Mid-day meal', avg: services.midDayMealRegularityPct },
    { key: 'junior_school_access', short: 'Junior high school access', avg: services.juniorSchoolAccessPct },
  ].map((r) => {
    const scheme = schemes.find((s) => s.schemeKey === r.key);
    const rounds = scheme ? roundsOf(scheme) : [];
    return { ...r, scheme, rounds };
  });

  const allPcts = rows.flatMap((r) => r.rounds.map((p) => p.pct));
  const lowest = allPcts.length ? Math.min(...allPcts) : 0;
  const highest = allPcts.length ? Math.max(...allPcts) : 0;
  const allPeakedFirst = rows.every((r) => !r.scheme || peakedInRoundOne(r.scheme));

  const reference = [...rows.map((r) => ({ name: r.short, pct: r.avg })), SCHOOL_DESKS];

  return (
    <Section
      id="frontline"
      no="3.5"
      kicker="Frontline services"
      title="Frontline services reached between three and five in ten households, round after round."
      intro={
        <>
          {capital(word(rows.length))} everyday services are followed as a set: medicines, sanitary napkins, teachers in
          class, the school meal and access to junior high school. Across all four rounds their reach stayed between{' '}
          {pct(lowest)} and {pct(highest)} of households.
          {allPeakedFirst && ' Each was highest in the first round.'}
        </>
      }
      aside="Bal Sansad: the children’s parliament, whose elected ministers check their own school each day."
    >
      <Figure
        no="3.6"
        title={
          view === 'rounds'
            ? 'Households reached by each frontline service, round by round (% of households)'
            : `Four-round average for each service against the ${REFERENCE_PCT}% reference (% of households)`
        }
        src="REC-RNE-01"
        legend={
          view === 'rounds'
            ? [
                { label: 'Rounds 1 to 3', color: 'color-mix(in srgb, var(--forest) 40%, var(--paper))' },
                { label: 'Round 4, the latest', color: 'var(--forest)' },
              ]
            : undefined
        }
        actions={
          <Segmented<ServiceView>
            label="View"
            value={view}
            onChange={setView}
            options={[
              { value: 'rounds', label: 'Round by round' },
              { value: 'reference', label: `Against ${REFERENCE_PCT}%` },
            ]}
          />
        }
        caption={
          view === 'rounds'
            ? `Rounds run ${ROUNDS[0].period} to ${ROUNDS[ROUNDS.length - 1].period}. All bars share one scale, 0 to ${BAR_MAX}% of households.`
            : `Bars run from 0 to 60%. The tick marks ${REFERENCE_PCT}% of households, the reference used in earlier reports. ${SCHOOL_DESKS.name} appears in this comparison only.`
        }
      >
        {view === 'rounds' ? (
          <div className="border-t border-ink">
            {rows.map((r) => {
              const counts = r.rounds.map((p) => p.count);
              const pcts = r.rounds.map((p) => p.pct);
              return (
                <div
                  key={r.key}
                  className="grid items-end gap-x-8 gap-y-4 border-b border-rule py-5 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1.2fr)_auto_minmax(0,0.8fr)]"
                >
                  <div className="self-start">
                    <div className="text-[0.9375rem] font-semibold text-ink">{r.short}</div>
                    {r.scheme && (
                      <p className="t-note mt-1.5" style={{ maxWidth: '44ch' }}>
                        {schemeDetail(r.scheme)}
                      </p>
                    )}
                  </div>
                  <RoundBars values={pcts} max={BAR_MAX} labelled format={(v) => pct(v)} />
                  <div className="sm:col-span-2 lg:col-span-1 lg:text-right">
                    <div className="font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink">
                      {pct(r.avg)}
                    </div>
                    <div className="t-note mt-1.5">four-round average</div>
                    {counts.length > 0 && (
                      <div className="t-note num">
                        {num(Math.min(...counts))}–{num(Math.max(...counts))} households ({pct(Math.min(...pcts))}–
                        {pct(Math.max(...pcts))})
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="border-t border-ink">
            {reference.map((r) => (
              <div
                key={r.name}
                className="grid items-center gap-x-6 gap-y-2 border-b border-rule py-4 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)_64px]"
              >
                <span className="text-[0.875rem] font-semibold text-ink">{r.name}</span>
                <Meter
                  value={r.pct}
                  max={60}
                  target={REFERENCE_PCT}
                  label={`${r.name}: ${pct(r.pct)} of households, against a ${REFERENCE_PCT}% reference`}
                />
                <span className="num text-[0.875rem] font-semibold text-ink sm:text-right">{pct(r.pct)}</span>
              </div>
            ))}
          </div>
        )}
      </Figure>

      <Note kind="finding" label="Who keeps watch" title="Children check the school; the union takes it to the Gram Sabha.">
        <Src id="REC-INST-02">{capital(word(balSansadMinisters))} elected child ministers</Src> of the Bal Sansad take a daily
        roll-call of teachers and inspect kitchen hygiene. Behind them, <Src id="REC-INST-01">{num(unionMembers)} AAS members</Src>{' '}
        present community charters at the monthly Gram Sabha.
      </Note>
    </Section>
  );
};
