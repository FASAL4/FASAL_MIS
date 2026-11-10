import React from 'react';
import { fasalMasterData } from '@/data/fasalMasterData';
import { useEvidence } from '@/context/EvidenceContext';
import { CountUp, inrShort, num, times } from '../../ui';
import { HouseholdField } from './HouseholdField';

/** The cover: one sentence, the household field, four figures. */
export const Cover: React.FC = () => {
  const { overview, income, metadata, rights } = fasalMasterData;
  const { openDrawer } = useEvidence();
  const k = overview.headlineKPIs;
  const y26 = income.macroFinancials.year2026;
  const first = income.longitudinalTrajectory[0];
  const medianMultiple = y26.medianNetIncomePerHH / first.medianNetIncomeINR;
  const leverageMultiple = k.verifiedPublicLeverageINR / k.grantCommitment;
  const marginalised = overview.casteDemographics
    .filter((c) => c.casteCategory !== 'General')
    .reduce((s, c) => s + c.households, 0);

  const figs: Array<{ id: string; label: string; value: React.ReactNode; note: string }> = [
    {
      id: 'METRIC-INC-001',
      label: 'Net farm profit, 2026',
      value: <CountUp to={y26.netProfitINR} format={inrShort} />,
      note: `${num(y26.activeFarmersCount)} farming households · +${income.longitudinalGrowth.aggregateGrowthPct}% on 2022`,
    },
    {
      id: 'METRIC-INC-002',
      label: 'Median farm income per household',
      value: <CountUp to={y26.medianNetIncomePerHH} format={(n) => `₹${num(Math.round(n))}`} />,
      note: `up from ₹${num(first.medianNetIncomeINR)} in ${first.calendarYear}`,
    },
    {
      id: 'METRIC-SOC-001',
      label: 'Households from SC, ST and OBC communities',
      value: <CountUp to={k.marginalizedInclusionRate} format={(n) => `${n.toFixed(2)}%`} />,
      note: `${num(marginalised)} of ${num(k.totalHouseholdsSurveyed)} households · ${num(k.residentIndividualPopulation)} people`,
    },
    {
      id: 'METRIC-RGHT-001',
      label: 'Public investment unlocked',
      value: <CountUp to={k.verifiedPublicLeverageINR} format={inrShort} />,
      note: `${num(rights.publicLeverage.totalProjectsCount)} public works · ${times(leverageMultiple)} the grant`,
    },
  ];

  return (
    <section className="cover" id="cover" aria-label="FASAL at a glance">
      <div className="wrap">
        <div className="cover-grid">
          <div>
            <div className="cover-kicker">
              <span>Farmers’ Action for Sustainable Agro-based Livelihoods</span>
              <span>2021–2026</span>
            </div>
            <h1 className="t-display mt-7">
              At the edge of a tiger forest, the typical family’s farm income grew <em>{times(medianMultiple)}</em> in five years.
            </h1>
            <p className="cover-deck mt-8">
              <strong>{num(k.totalHouseholdsSurveyed)} households</strong> in {k.villagesCount} hamlets along the Katarniaghat
              Wildlife Sanctuary, Bahraich, Uttar Pradesh. Run by <strong>DEHAT India</strong> on a{' '}
              <strong>{inrShort(metadata.grantCommitmentINR).replace(' Cr', ' crore')}</strong> grant from Azim Premji
              Philanthropic Initiatives. Every figure here opens to the survey cell it came from.
            </p>
          </div>
          <HouseholdField />
        </div>

        <div className="cover-figs">
          {figs.map((f) => (
            <button key={f.id} type="button" className="cover-fig" onClick={() => openDrawer(f.id)} title="Open the source">
              <span className="cover-fig-label">{f.label}</span>
              <span className="cover-fig-value">{f.value}</span>
              <span className="cover-fig-note">{f.note}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
