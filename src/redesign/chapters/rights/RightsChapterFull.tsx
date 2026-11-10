import React from 'react';
import { fasalMasterData } from '@/data/fasalMasterData';
import { type ChapterProps, ChapterOpener, Src, Stat, StatRow, inr, num, times } from '../../ui';
import { BuiltField } from './BuiltField';
import { Entitlements, FrontlineServices } from './EntitlementSections';
import { Kiosks } from './KioskSection';
import { TheCorrection, WhereItWent, YearByYear } from './LeverageSections';
import { OLDER_CLAIM, crore, word } from './rightsData';

/**
 * 03 Rights — what the unions drew down from the state. Full chapter.
 *   3.1 where the public money went      3.4 entitlements reaching households
 *   3.2 year by year                     3.5 frontline services across rounds
 *   3.3 the correction                   3.6 Jan Suvidha Kendra kiosks
 *
 * To mount it, make RightsChapter.tsx contain only:
 *   export { RightsChapterFull as RightsChapter } from './RightsChapterFull';
 */
export const RightsChapterFull: React.FC<ChapterProps> = ({ onOpenLedger }) => {
  const { metadata, overview, rights } = fasalMasterData;
  const { publicLeverage: leverage, janSuvidhaKendra: jsk } = rights;

  const grant = metadata.grantCommitmentINR;
  const multiple = leverage.totalLeverageAmountINR / grant;
  const years = leverage.annualBreakdown.map((y) => y.fiscalYear);
  const span = years.length > 1 ? `${years[0]}–${years[years.length - 1]}` : years[0];

  return (
    <>
      <ChapterOpener
        no="03"
        name="Rights"
        title={
          <>
            Village unions drew <em className="accent">{crore(leverage.totalLeverageAmountINR)}</em> of public investment into
            their own hamlets: {times(multiple)} the grant.
          </>
        }
        lead={
          <>
            FASAL organised {num(overview.headlineKPIs.totalHouseholdsSurveyed)} households into the Ajeevika Adhikar
            Sangathan (AAS), a farmers’ union of <Src id="REC-INST-01">{num(overview.collectivization.aasUnionMembers)} members</Src>{' '}
            that works by one rule, “Jiska mudda, uski agwai”: whoever has the problem leads on it. Between {years[0]} and{' '}
            {years[years.length - 1]} its demands brought housing, roads and piped water to the hamlets. An older figure of{' '}
            {crore(OLDER_CLAIM.amountINR)} double-counted spreadsheet totals and has been withdrawn.
          </>
        }
      >
        <StatRow cols={4}>
          <Stat
            label="Verified public investment"
            countTo={leverage.totalLeverageAmountINR}
            format={(n) => `₹${(n / 1e7).toFixed(2)}`}
            unit="crore"
            note={`${inr(leverage.totalLeverageAmountINR)} sanctioned, ${span}`}
            src="REC-LEV-01"
          />
          <Stat
            label="Public works"
            countTo={leverage.totalProjectsCount}
            note={`Logged in ${word(years.length)} annual registers and audited row by row`}
            src="REC-LEV-01"
          />
          <Stat
            label="Multiple of the grant"
            countTo={multiple}
            format={(n) => times(n)}
            delta={`${inr(multiple, 2)} of public money for every ₹1 of grant`}
            note={`Against the ${crore(grant)} APPI grant, ${metadata.grantRef}`}
            src="METRIC-RGHT-001"
          />
          <Stat
            label="Citizen services through kiosks"
            countTo={jsk.totalCitizenServicesDelivered}
            note={`Facilitated at ${word(jsk.activeKiosksCount)} Jan Suvidha Kendra, 2022–2025`}
            src="REC-JSK-01"
          />
        </StatRow>
      </ChapterOpener>

      <div className="wrap">
        <BuiltField leverage={leverage} />
        <WhereItWent leverage={leverage} />
        <YearByYear leverage={leverage} />
        <TheCorrection leverage={leverage} onOpenLedger={onOpenLedger} />
        <Entitlements schemes={rights.longitudinalRounds} />
        <FrontlineServices
          services={rights.stableFrontlineServices}
          schemes={rights.longitudinalRounds}
          balSansadMinisters={overview.collectivization.balSansadMinisters}
          unionMembers={overview.collectivization.aasUnionMembers}
        />
        <Kiosks jsk={jsk} onOpenLedger={onOpenLedger} />
      </div>
    </>
  );
};
