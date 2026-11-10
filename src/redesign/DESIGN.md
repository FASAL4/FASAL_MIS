# FASAL redesign — design brief and component contract

The dashboard is being rebuilt as an **editorial field report**, not a SaaS dashboard.
The old UI (`src/modules/**`, `src/components/**`, `src/App.tsx`) is the *content source* and stays untouched.
The new UI lives only in `src/redesign/**`. `src/main.tsx` mounts `src/redesign/App.tsx`.

Reference implementation (read these before writing anything):

- `src/redesign/redesign.css` — tokens and every component class
- `src/redesign/ui/*` — primitives (import everything from `'../../ui'`)
- `src/redesign/chapters/overview/OverviewChapter.tsx` + `Cover.tsx` — the exemplar chapter
- `src/redesign/EVIDENCE_INDEX.md` — every evidence id with its label and value

## 1. The idea

One sentence: **a calm printed monograph in which every number opens to its source.**

- Paper ground, ink text, hairline rules. One accent: haldi (turmeric yellow). Forest green means growth / endline.
- Fraunces (display serif) for headlines and figures. Geist for everything else. Geist Mono only for cell coordinates and section numbers.
- Big figures, generous white space, few words. The reader should get the finding from the headline alone.
- Evidence is everywhere but quiet: no badges. See §4.

What made the old UI feel cluttered — do not reproduce any of it:

- "FEATURE F06" / "SYS-1 PROOF" style tags, pills and shouted uppercase mono labels
- an evidence badge beside every number; several badges in every header
- boxes inside boxes: bordered, tinted, rounded cards nested in cards
- monospace used for ordinary labels, table text and numbers
- four KPI tiles, then four more tiles, then a chart with its own tiles
- coloured callout boxes stacked under every block
- headings that name a topic ("Longitudinal Net Farm Income Trajectory (2022 Baseline to 2026 Endline)") instead of saying what happened

## 2. Hard rules

1. **Write only inside your own chapter folder** (`src/redesign/chapters/<yours>/`). Do not edit `ui/`, `redesign.css`, `shell/`, other chapters, or anything outside `src/redesign`. If you need something the kit lacks, build it locally in your folder with Tailwind utilities + the tokens, and mention it in your final report.
2. **Never invent, round differently, or re-derive a number or a claim.** Every figure must come from `fasalMasterData` / the evidence registry, or be carried over verbatim from the old module's hard-coded content. Arithmetic on those values (shares, ratios, differences) is fine. Do not "verify" claims; this is a presentation job.
3. **Lose no information.** Every dataset, table, toggle, insight and audit note the old module conveyed must still be reachable in your chapter. You may condense, merge, move things into a table, a `<details>`, a segmented view or a caption — you may not silently drop them. Keep sorting / filtering / search where the old module had them.
4. **Tokens only.** No hex colours, no Tailwind palette colours (`emerald-600`, `amber-500`, `stone-400`…), no `dark:` variants. Use the theme utilities (`text-ink`, `text-ink-2`, `text-ink-3`, `bg-paper`, `bg-raised`, `bg-sunk`, `border-rule`, `border-rule-strong`, `border-ink`, `text-forest`, `text-clay`, `text-haldi-ink`, `bg-haldi`, `font-display`, `font-mono`) or `var(--token)`. Dark mode then works by itself.
5. **No cards.** No element may have border + background + radius + padding together. Structure comes from rules (`border-t border-ink` for a strong start, `border-b border-rule` between rows), columns and space. No shadows, no gradients, no icons used as decoration. Lucide icons only where they are functional (arrows on links, sort carets, search, external link).
6. **Typography.** Sentence case everywhere. No ALL-CAPS except the `.t-label` class. No mono for labels or table text. Use `−` (U+2212) for negatives and `×` for multiples. Do **not** type arrow glyphs (`→ ← ▲ ▼`) in text: the fonts lack them; say "to", or use a Lucide icon. Use "pts" for percentage points. Write "households", not "HHs"; "per household", not "/ HH". Indian digit grouping via the `num` / `inr` helpers.
7. **Copy.** Plain, specific, active. Section titles are findings written as sentences ("The poorest households gained the most."). No "forensic", "empirical", "unprecedented", "catalytic", "saturation" unless it is the literal name of a thing. Hindi / programme terms stay (bigha, machan, Jeevamrit, Poshan Vatika, Jan Suvidha Kendra) with a short gloss on first use.
8. Must compile: `pnpm exec tsc -p tsconfig.app.json --noEmit` (run from `dashboard/`; `noUnusedLocals` and `noUnusedParameters` are on). Errors inside your folder are yours to fix; ignore errors in other chapter folders (other people are mid-edit).
9. Do not open the browser preview or start a dev server; the lead does visual QA. Do not run git. Do not touch `.agents/`.
10. Mobile first: everything must hold at 360px. Wrap tables in `.tbl-wrap`. Grids collapse to one column.

## 3. Page anatomy

```tsx
import React from 'react';
import { fasalMasterData } from '@/data/fasalMasterData';
import { type ChapterProps, ChapterOpener, Section, Stat, StatRow, Figure, Note, Src, ... } from '../../ui';

export const IncomeChapter: React.FC<ChapterProps> = ({ onOpenLedger, onNavigate }) => {
  const { income } = fasalMasterData;
  return (
    <>
      <ChapterOpener
        no="01"
        name="Income"
        title={<>The typical household’s farm income grew <em className="accent">2.43×</em> in five years.</>}
        lead="Two or three sentences that give the cohort, the period and the one caveat that matters."
      >
        <StatRow cols={4}>…three or four <Stat>s, the headline numbers of the chapter…</StatRow>
      </ChapterOpener>

      <div className="wrap">
        <Section id="trajectory" no="1.1" kicker="Trajectory" title="A finding, as a sentence." intro={<>…</>}>
          <Figure no="1.1" title="What the chart shows, with unit" src="REC-ECON-12" caption="…">…chart…</Figure>
          <Note kind="finding" title="…">…</Note>
        </Section>
        …
      </div>
    </>
  );
};
```

- Keep the exported name and file path of the placeholder in your folder (`IncomeChapter`, `RFChapter`, `RightsChapter`, `NutritionChapter`, `ForensicChapter`). Split into as many local files as you like.
- A chapter is 4–7 `Section`s. Section numbers are `<chapter>.<n>` (Income = 1.x, Farming = 2.x, Rights = 3.x, Nutrition = 4.x, Evidence = 5.x). Figure numbers run the same way.
- One idea per section. Order: headline result → how it breaks down → who it reached → caveats / method. Audit notes go last in a section, never first.
- `Section` puts content on columns 4–12 with a left rail. Use `wide` when a table or chart needs all 12 columns. The rail's `aside` takes one short plain-text note (definition of a term, the cohort, a unit).
- Inside `sec-body`, direct children are spaced automatically. For two-up layouts use `grid gap-x-10 gap-y-10 lg:grid-cols-2`.
- Do not add a "next chapter" link or footer; the shell does that.

## 4. Evidence: one rule instead of a hundred badges

| Where the number is | Use | Looks like |
|---|---|---|
| inside a sentence | `<Src id="REC-ECON-12">₹63,918</Src>` | marker-pen highlight |
| a standalone figure | `<Stat src="REC-ECON-12" …/>` | the figure is the button; small haldi dot |
| a chart / table | `<Figure src="…">` | one source line in the caption |
| a table cell | `<Src id>` around the key cell | thin underline |
| anywhere else | `<SourceLink id label? />` | small mono link |

- Look ids up in `EVIDENCE_INDEX.md`. If no id fits, leave the number plain. Never fabricate an id (`<Src>` with an unknown id renders plain text; `<Stat src>` degrades the same way).
- At most two or three `<Src>` per paragraph. One `src` per figure.
- "Open in the ledger" style actions call `onOpenLedger(metricId)`.
- The old `EvidenceBadge` / `EvidenceDrawer` must not be imported.

## 5. The kit (`import { … } from '../../ui'`)

| Export | Purpose |
|---|---|
| `ChapterOpener` `{no, name, title, lead?, children?}` | chapter head; children = `<StatRow>` |
| `Section` `{id?, no, kicker, title, intro?, aside?, wide?}` | numbered section with rail |
| `Stat` `{label, value? \| countTo?+format?, unit?, delta?, tone?, note?, src?, size?: 'xl'\|'lg'\|'md'\|'sm', quiet?}` | one figure. `countTo` animates on first view. `tone`: forest (default), haldi, clay, ink |
| `StatRow` `{cols?: 2\|3\|4\|5}` | row of stats, each with a top rule |
| `Figure` `{no?, title, caption?, src?, srcLabel?, legend?: {label,color,shape?}[], actions?}` | numbered figure frame; `actions` = a `Segmented` |
| `Note` `{kind?: 'audit'\|'finding'\|'caution'\|'method', label?, title?, src?}` | the only callout. Max one per section, two if one is an audit note |
| `Segmented<T>` `{value, onChange, options, label}` | the only switcher (sub-views, units, chart modes) |
| `Meter` `{value, max?, tone?, hatch?, size?, target?, label?}` | single proportion bar; `hatch` = baseline; `target` draws a tick |
| `ShareBar` `{parts: {value,color,label}[], height?}` | stacked 100% bar |
| `Tag` `{tone?: 'forest'\|'haldi'\|'clay'}` | tiny status word (Exceeded, Verified…). Use sparingly |
| `Src`, `SourceLink`, `SrcCoord`, `useSource()` | evidence (see §4) |
| `Reveal` `{delay?}`, `CountUp` `{to, format?}` | motion. `Section` head and `Figure` already reveal themselves |
| `C`, `gridProps`, `xAxisProps`, `yAxisProps`, `chartMargin`, `ChartTooltip` | Recharts vocabulary |
| `num`, `inr`, `inrShort`, `inrAxis`, `pct`, `signedPct`, `points`, `times` | formatting |

CSS classes you will use directly: `.wrap`, `.t-h3`, `.t-lead`, `.t-body`, `.t-label`, `.t-note`, `.t-mono`, `.num`, `.tbl-wrap` + `.tbl` (`.r` right-align, `.strong`, `.muted`, `.sub`, `.tbl--dense`, `<tfoot>`), `.defs` + `.def` (definition rows), `.btn`, `.btn--solid`, `.link`, `.input`, `.hatch`.

Tables: `<th>` is the small caps label automatically; numbers right-aligned with `.r`; first column `.strong`; secondary line inside a cell with `<span className="sub">`. Sortable headers: put a `<button>` inside the `<th>` and set `aria-sort`. Totals in `<tfoot>`.

Inline big numbers outside `Stat` (e.g. in a list): `className="font-display text-[1.625rem] leading-none tracking-[-0.02em] text-ink"`.

## 6. Charts (Recharts 2)

- Wrap in a fixed-height box: `<div className="h-[340px]">` → `<ResponsiveContainer width="100%" height="100%">`.
- Colours: `C.forest` = endline / current / the main series. `C.haldi` = the flagship or second series. `C.stone` = baseline or comparison, drawn dashed (lines) or with `className="hatch"`-like lighter treatment (bars: `fill={C.stone}`). `C.clay` = cost, deficit, loss. `C.river` only if a third series is unavoidable. Never more than three series colours in a figure. No gradients, no drop shadows, no 3D, no pie/donut (use `ShareBar` or bars).
- Grid: `<CartesianGrid {...gridProps} />` (horizontal hairlines only). Axes: `<XAxis {...xAxisProps} />`, `<YAxis {...yAxisProps} tickFormatter={inrAxis} />`. Margins: `chartMargin`.
- Lines: `strokeWidth={2.25}`, `dot={{ r: 3.5, strokeWidth: 0 }}`, `activeDot={{ r: 5 }}`, `type="monotone"`. Bars: `radius={[2, 2, 0, 0]}`, `maxBarSize={44}`.
- Prefer direct labels (`<LabelList>` on the last point / on bars) plus the `Figure legend` prop over Recharts' `<Legend>` (do not use `<Legend>`).
- Tooltip: `<Tooltip content={<ChartTooltip format={(v) => inr(v)} labels={{ mean: 'Mean', median: 'Median' }} />} cursor={{ stroke: C.ruleStrong }} />` (for bars: `cursor={{ fill: 'var(--rule)' }}`).
- A simple comparison of two or three values is better as `Meter`s in a list than as a chart. A chart must earn its space.

```tsx
<Figure
  no="1.1"
  title="Net farm income per household, 2022–2026 (₹)"
  src="REC-ECON-12"
  legend={[
    { label: 'Median', color: C.forest, shape: 'line' },
    { label: 'Mean', color: C.haldi, shape: 'line' },
  ]}
  caption="2022–2024 are wave-one recall values (N = 1,329); 2025–2026 are wave-two census values (N = 1,487)."
>
  <div className="h-[340px]">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={rows} margin={chartMargin}>
        <CartesianGrid {...gridProps} />
        <XAxis dataKey="year" {...xAxisProps} />
        <YAxis {...yAxisProps} tickFormatter={inrAxis} />
        <Tooltip content={<ChartTooltip format={(v) => inr(v)} labels={{ median: 'Median', mean: 'Mean' }} />} cursor={{ stroke: C.ruleStrong }} />
        <Line type="monotone" dataKey="mean" stroke={C.haldi} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.haldi }} activeDot={{ r: 5 }} />
        <Line type="monotone" dataKey="median" stroke={C.forest} strokeWidth={2.25} dot={{ r: 3.5, strokeWidth: 0, fill: C.forest }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
</Figure>
```

## 7. Quality bar before you report back

- Could a trustee read only the opener and the section titles and repeat the story? If not, rewrite the titles.
- Is there any box with a border and a tinted background? Remove it.
- Is anything in monospace that is not a cell coordinate or a section number? Change it.
- Does every toggle in the old module still exist (as a `Segmented`) and still work?
- Does it type-check with zero errors in your folder?

Final report (short): files written; the section outline; anything from the old module you condensed and where it went; anything you could not fit; kit gaps you hit.
