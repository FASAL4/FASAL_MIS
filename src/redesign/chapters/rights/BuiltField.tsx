import React, { useMemo } from 'react';
import type { RightsEntitlementsData } from '@/types/dashboard';
import { Figure, UnitField, type UnitMode, inr, inrShort, num, pct } from '../../ui';

/**
 * What got built: one mark for every home, tap, road, latrine, light, boring
 * and soak pit the unions had sanctioned. Switch to rupees (one mark per
 * ₹1 lakh) and the picture inverts: many taps, little money; few roads, a lot.
 */
export const BuiltField: React.FC<{ leverage: RightsEntitlementsData['publicLeverage'] }> = ({ leverage }) => {
  const modes = useMemo<UnitMode[]>(() => {
    const cats = leverage.categoryBreakdown;
    const units = cats.reduce((s, c) => s + c.unitsSanctioned, 0);
    return [
      {
        id: 'units',
        label: 'Things built',
        colorVar: '--ink',
        blurb: (
          <>
            <b>One mark for each thing sanctioned:</b> {num(units)} in all. Switch to rupees to see where the money went
            instead. Point at a strip to read about it.
          </>
        ),
        groups: [...cats]
          .sort((a, b) => b.unitsSanctioned - a.unitsSanctioned)
          .map((c) => ({
            key: c.schemeCategory,
            name: c.unitDescription,
            count: c.unitsSanctioned,
            meta: num(c.unitsSanctioned),
            detail: (
              <>
                <b>{c.schemeCategory}.</b> {num(c.unitsSanctioned)} {c.unitDescription.toLowerCase()} for {inr(c.amountINR)}:{' '}
                {inr(Math.round(c.amountINR / c.unitsSanctioned))} each on average.
              </>
            ),
          })),
      },
      {
        id: 'rupees',
        label: 'Rupees spent',
        colorVar: '--haldi-mark',
        blurb: (
          <>
            <b>One mark for every ₹1 lakh sanctioned:</b> {inrShort(leverage.totalLeverageAmountINR)} in all. Homes and roads
            take four marks in five.
          </>
        ),
        groups: cats.map((c) => ({
          key: c.schemeCategory,
          name: c.unitDescription,
          count: Math.max(1, Math.round(c.amountINR / 1e5)),
          meta: `${inrShort(c.amountINR)} · ${pct(c.percentage, 1)}`,
          detail: (
            <>
              <b>{c.schemeCategory}.</b> {inr(c.amountINR)}, {pct(c.percentage, 2)} of all verified public investment, for{' '}
              {num(c.unitsSanctioned)} {c.unitDescription.toLowerCase()}.
            </>
          ),
        })),
      },
    ];
  }, [leverage]);

  return (
    <section className="border-t border-rule-strong py-[clamp(40px,5.5vw,80px)]" aria-label="What got built">
      <Figure
        title="What the unions got built, mark by mark"
        src="REC-LEV-01"
        caption="Counts and amounts are the sanctioned units and values in the three annual leverage registers. In the rupee view each mark is ₹1 lakh, rounded."
      >
        <UnitField modes={modes} title={<><b>Every home, tap and road</b>, one mark each</>} />
      </Figure>
    </section>
  );
};
