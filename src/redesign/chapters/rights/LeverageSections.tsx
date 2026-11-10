import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { RightsEntitlementsData } from '@/types/dashboard';
import { Figure, Meter, Note, Section, ShareBar, Src, inr, num, pct } from '../../ui';
import { ANNUAL_SRC, CORRECTIONS, OLDER_CLAIM, crore, leverageLabel, word } from './rightsData';

type Leverage = RightsEntitlementsData['publicLeverage'];

/** Tints of forest for the three register years, lightest first. */
const YEAR_MIX = [36, 64, 100];
const yearColor = (i: number) => `color-mix(in srgb, var(--forest) ${YEAR_MIX[i % YEAR_MIX.length]}%, var(--paper))`;

/** The amount that should never have been counted: clay, hatched. */
const STRUCK: React.CSSProperties = {
  backgroundImage: 'repeating-linear-gradient(135deg, var(--clay) 0 2px, transparent 2px 6px)',
  border: '1px solid var(--clay)',
};

/* ----------------------------------------------------------------------------
   3.1 — Where the public money went
---------------------------------------------------------------------------- */
export const WhereItWent: React.FC<{ leverage: Leverage }> = ({ leverage }) => {
  const cats = [...leverage.categoryBreakdown].sort((a, b) => b.amountINR - a.amountINR);
  const [first, second, third] = cats;
  const topTwoShare = (first?.percentage ?? 0) + (second?.percentage ?? 0);
  const rest = cats.slice(3);
  const restShare = rest.reduce((s, c) => s + c.percentage, 0);
  const meterMax = Math.ceil(Math.max(...cats.map((c) => c.percentage)) / 10) * 10;

  return (
    <Section
      id="where-it-went"
      no="3.1"
      kicker="Where it went"
      title="Four rupees in five went into homes and village roads."
      intro={
        <>
          {leverageLabel(first.schemeCategory).name} and {leverageLabel(second.schemeCategory).name.toLowerCase()} together
          account for {pct(topTwoShare)} of the verified total. {leverageLabel(third.schemeCategory).name} is third at{' '}
          {pct(third.percentage)}. The other {word(rest.length)} categories share the remaining {pct(restShare)}.
        </>
      }
      aside="Leverage here means public money that government departments sanctioned for works the unions asked for. None of it is grant money."
    >
      <Figure
        no="3.1"
        title="Verified public investment by category, 2023–2025"
        src="REC-LEV-01"
        caption={`Ranked by amount. Shares are of the verified ${crore(leverage.totalLeverageAmountINR)}.`}
      >
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Category</th>
                <th className="r">Sanctioned</th>
                <th className="r">Amount</th>
                <th style={{ width: '26%' }}>Share of total</th>
              </tr>
            </thead>
            <tbody>
              {cats.map((c) => {
                const label = leverageLabel(c.schemeCategory);
                return (
                  <tr key={c.schemeCategory}>
                    <td className="strong" style={{ minWidth: 220 }}>
                      {label.name}
                      {label.scheme && <span className="sub">{label.scheme}</span>}
                    </td>
                    <td className="r" style={{ minWidth: 150 }}>
                      {num(c.unitsSanctioned)}
                      <span className="sub">{c.unitDescription.toLowerCase()}</span>
                    </td>
                    <td className="r strong" style={{ minWidth: 130 }}>
                      {label.src ? <Src id={label.src}>{inr(c.amountINR)}</Src> : inr(c.amountINR)}
                      <span className="sub">{crore(c.amountINR)}</span>
                    </td>
                    <td style={{ minWidth: 170 }}>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Meter
                            value={c.percentage}
                            max={meterMax}
                            label={`${label.name}: ${pct(c.percentage, 2)} of the verified total`}
                          />
                        </div>
                        <span className="w-14 text-right">{pct(c.percentage, 2)}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td>All {word(cats.length)} categories</td>
                <td />
                <td className="r">{inr(leverage.totalLeverageAmountINR)}</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </Figure>
    </Section>
  );
};

/* ----------------------------------------------------------------------------
   3.2 — Year by year
---------------------------------------------------------------------------- */
export const YearByYear: React.FC<{ leverage: Leverage }> = ({ leverage }) => {
  const years = leverage.annualBreakdown;
  const amounts = years.map((y) => y.verifiedAmountINR);
  const low = Math.min(...amounts);
  const high = Math.max(...amounts);

  return (
    <Section
      id="year-by-year"
      no="3.2"
      kicker="Year by year"
      title={`The money came steadily: ${crore(low).replace(' crore', '')} to ${crore(high)} in each of ${word(years.length)} years.`}
      intro={
        <>
          Each year’s works are logged in a leverage register kept for the Ajeevika Adhikar Sangathan (AAS) unions. The{' '}
          {word(years.length)} registers were audited row by row; together they hold{' '}
          <Src id="REC-LEV-01">{num(leverage.totalProjectsCount)} works</Src>.
        </>
      }
      aside="A register is one spreadsheet per year. Every row is a sanctioned work with its amount."
    >
      <Figure
        no="3.2"
        title="Verified public investment by register year"
        src="REC-LEV-01"
        caption={
          <>
            Register files:{' '}
            {years.map((y, i) => (
              <React.Fragment key={y.fiscalYear}>
                {i > 0 && '; '}
                {y.fiscalYear}, “{y.registerFile}”
              </React.Fragment>
            ))}
            .
          </>
        }
      >
        <ShareBar
          height={18}
          parts={years.map((y, i) => ({ value: y.verifiedAmountINR, color: yearColor(i), label: y.fiscalYear }))}
        />
        <div className="mt-6 grid gap-x-8 gap-y-7 sm:grid-cols-3">
          {years.map((y, i) => (
            <div key={y.fiscalYear}>
              <div className="flex items-center gap-2 text-[0.8125rem] text-ink-2">
                <span className="inline-block h-2.5 w-2.5 rounded-[2px]" style={{ background: yearColor(i) }} />
                {y.fiscalYear}
              </div>
              <div className="mt-2 font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink">
                {ANNUAL_SRC[y.fiscalYear] ? (
                  <Src id={ANNUAL_SRC[y.fiscalYear]}>{crore(y.verifiedAmountINR)}</Src>
                ) : (
                  crore(y.verifiedAmountINR)
                )}
              </div>
              <div className="num mt-2 text-[0.875rem] text-ink-2">
                {num(y.projectItemsCount)} works · {pct((y.verifiedAmountINR / leverage.totalLeverageAmountINR) * 100)} of the
                total
              </div>
              <div className="t-note num mt-1">{inr(y.verifiedAmountINR)}</div>
            </div>
          ))}
        </div>
      </Figure>
    </Section>
  );
};

/* ----------------------------------------------------------------------------
   3.3 — The correction
---------------------------------------------------------------------------- */
export const TheCorrection: React.FC<{ leverage: Leverage; onOpenLedger: (metricId?: string) => void }> = ({
  leverage,
  onOpenLedger,
}) => {
  const verified = leverage.totalLeverageAmountINR;
  const verifiedWidth = (verified / OLDER_CLAIM.amountINR) * 100;
  const struckWidth = 100 - verifiedWidth;
  const purged = crore(leverage.subtotalDoubleCountingPurgedINR);

  return (
    <Section
      id="correction"
      no="3.3"
      kicker="The correction"
      title={`An older claim of ${crore(OLDER_CLAIM.amountINR)} counted spreadsheet totals as works. It has been withdrawn.`}
      intro={
        <>
          Earlier synthesis drafts reported {inr(OLDER_CLAIM.amountINR)} across {num(OLDER_CLAIM.rows)} projects. When the
          registers were re-read, {purged} of that turned out to be total and subtotal rows added in with the real entries.
          The verified figure is <Src id="REC-LEV-01">{inr(verified)}</Src> across {num(leverage.totalProjectsCount)} works.
        </>
      }
      aside="The older figure is shown only so the correction can be checked. It is not used anywhere else in this report."
    >
      <Figure
        no="3.3"
        title="The older claim and the verified total, on the same scale"
        src="METRIC-RGHT-001"
        caption="The hatched part is not public investment. It is the registers’ own total rows, counted a second time."
      >
        <div className="grid gap-y-8">
          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[0.875rem] font-semibold text-ink">
                Older drafts
                <span className="font-normal text-ink-3"> · {num(OLDER_CLAIM.rows)} rows added up</span>
              </span>
              <span className="font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink-3 line-through decoration-clay decoration-1">
                {crore(OLDER_CLAIM.amountINR)}
              </span>
            </div>
            <div
              className="share mt-3"
              style={{ height: 22 }}
              role="img"
              aria-label={`Older claim: ${crore(OLDER_CLAIM.amountINR)}, of which ${purged} was counted twice`}
            >
              <span style={{ width: `${verifiedWidth}%`, background: 'var(--stone)' }} />
              <span style={{ width: `${struckWidth}%`, ...STRUCK }} />
            </div>
            <div className="mt-2 flex gap-[2px] text-[0.78125rem] leading-snug">
              <span className="text-ink-3" style={{ width: `${verifiedWidth}%` }}>
                Real works
              </span>
              <span className="font-semibold text-clay" style={{ width: `${struckWidth}%` }}>
                {purged} of totals counted again
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="text-[0.875rem] font-semibold text-ink">
                Verified
                <span className="font-normal text-ink-3"> · {num(leverage.totalProjectsCount)} works, each a row in a register</span>
              </span>
              <span className="font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink">{crore(verified)}</span>
            </div>
            <div
              className="share mt-3"
              style={{ height: 22 }}
              role="img"
              aria-label={`Verified total: ${crore(verified)}`}
            >
              <span style={{ width: `${verifiedWidth}%`, background: 'var(--forest)' }} />
            </div>
          </div>
        </div>
      </Figure>

      <details open>
        <summary className="cursor-pointer text-[0.9375rem] font-semibold text-ink">
          How the older figure came to be too high
        </summary>
        <div className="tbl-wrap mt-4">
          <table className="tbl">
            <thead>
              <tr>
                <th>What went wrong</th>
                <th className="r">Effect on the older figure</th>
              </tr>
            </thead>
            <tbody>
              {CORRECTIONS.map((c) => (
                <tr key={c.title}>
                  <td className="strong" style={{ minWidth: 260 }}>
                    {c.title}
                    <span className="sub" style={{ maxWidth: '64ch' }}>
                      {c.detail}
                    </span>
                  </td>
                  <td className="r strong" style={{ minWidth: 150 }}>
                    <span className="text-clay">{c.effect}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <Note kind="audit" title="Systemic defect SYS-7: total rows counted as works.">
        The audit removed every total, subtotal and footer row from the three registers and summed only the works
        themselves. {crore(verified)} across {num(leverage.totalProjectsCount)} works is the only public-investment figure
        this report uses, and the multiple of the grant is calculated from it.
        <div className="mt-3">
          <button type="button" className="link" onClick={() => onOpenLedger('REC-LEV-01')}>
            Open this correction in the evidence ledger <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </Note>
    </Section>
  );
};
