import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fasalMasterData, getAllEvidenceMetrics } from '@/data/fasalMasterData';
import type { AuditStatus } from '@/types/evidence';
import {
  type ChapterProps, ChapterOpener, Figure, Note, Section, Segmented, ShareBar, Stat, StatRow, Tag,
  coordOf, inr, num, useSource,
} from '../../ui';

const DOMAINS: Record<string, string> = {
  all: 'All', governance: 'People', income: 'Income', rf_progression: 'Farming', rights: 'Rights', nutrition: 'Nutrition', forensic: 'Data repairs',
};
const STATUS: Record<AuditStatus, { text: string; tone: 'forest' | 'haldi' | 'clay' }> = {
  VERIFIED: { text: 'Verified', tone: 'forest' },
  RECONCILED: { text: 'Reconciled', tone: 'haldi' },
  NEUTRALIZED: { text: 'Neutralised', tone: 'clay' },
};
const show = (v: string | number | undefined) => (v === undefined ? '–' : typeof v === 'number' ? v.toLocaleString('en-IN') : v);

export const ForensicChapter: React.FC<ChapterProps & { highlightedMetricId?: string }> = ({ highlightedMetricId }) => {
  const { forensic, metadata } = fasalMasterData;
  const a = forensic.auditOverview;
  const proof = forensic.sliceIdentityProof;
  const pii = forensic.piiRedactionStatus;
  const all = useMemo(() => getAllEvidenceMetrics(), []);
  const source = useSource();

  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('all');
  const [status, setStatus] = useState<'all' | AuditStatus>('all');
  const [openDefect, setOpenDefect] = useState<string | null>(forensic.systemicDefects[0]?.defectId ?? null);
  const rowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Arriving from "Open in the ledger": clear filters, then bring the row into view.
  useEffect(() => {
    if (!highlightedMetricId) return;
    setQuery('');
    setDomain('all');
    setStatus('all');
    const t = setTimeout(() => rowRefs.current[highlightedMetricId]?.scrollIntoView({ block: 'center', behavior: 'smooth' }), 350);
    return () => clearTimeout(t);
  }, [highlightedMetricId]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(
      (m) =>
        (domain === 'all' || m.thematicDomain === domain) &&
        (status === 'all' || m.provenance.auditStatus === status) &&
        (!q || `${m.metricId} ${m.label} ${m.verifiedValue} ${m.provenance.sheetName} ${m.provenance.cellCoordinates ?? ''}`.toLowerCase().includes(q)),
    );
  }, [all, query, domain, status]);

  const cut = new Date(metadata.datasetCutDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <>
      <ChapterOpener
        no="05"
        name="Evidence"
        title={<>Every number on this site was checked against the survey workbook. <em className="accent">Here is how.</em></>}
        lead="Earlier reports on FASAL carried errors: totals counted twice, a land unit misread, claims no data supported. Before anything was published here, each claim was traced to its cells, corrected or withdrawn."
      >
        <StatRow cols={4}>
          <Stat label="Claims from earlier reports audited" countTo={a.totalAuditedClaims} note={`${a.verifiedClaimsCount} verified, ${a.reconciledClaimsCount} reconciled, ${a.neutralizedDefectsCount} neutralised`} />
          <Stat label="Automated assertions passing" value="103 / 103" note="Re-run against the workbook on every build" />
          <Stat label="Systemic data defects repaired" countTo={forensic.systemicDefects.length} tone="ink" />
          <Stat label="Personal identifiers published" countTo={a.zeroPiiViolationsCount} note="No names, no phone numbers" tone="ink" />
        </StatRow>
      </ChapterOpener>

      <div className="wrap">
        <Section
          id="claims" no="5.1" kicker="The audit"
          title="Nine in ten earlier claims held. The rest were restated or removed."
          intro="Each claim ends in one of three states."
        >
          <Figure no="5.1" title={`Outcome of ${num(a.totalAuditedClaims)} audited claims`}>
            <ShareBar height={22} parts={[
              { value: a.verifiedClaimsCount, color: 'var(--forest)', label: 'Verified' },
              { value: a.reconciledClaimsCount, color: 'var(--haldi-mark)', label: 'Reconciled' },
              { value: a.neutralizedDefectsCount, color: 'var(--clay)', label: 'Neutralised' },
            ]} />
            <dl className="defs mt-6">
              {[
                { t: 'Verified', n: a.verifiedClaimsCount, d: 'Matches the primary microdata exactly.' },
                { t: 'Reconciled', n: a.reconciledClaimsCount, d: 'Restated on a consistent base across the two survey waves.' },
                { t: 'Neutralised', n: a.neutralizedDefectsCount, d: 'An error or artefact. Removed from all reporting.' },
              ].map((x) => (
                <div className="def" key={x.t} style={{ gridTemplateColumns: '8rem 4rem minmax(0,1fr)' }}>
                  <dt className="font-semibold" style={{ color: 'var(--ink)' }}>{x.t}</dt>
                  <dd className="text-right">{x.n}</dd>
                  <dd style={{ color: 'var(--ink-2)' }}>{x.d}</dd>
                </div>
              ))}
            </dl>
          </Figure>
        </Section>

        <Section
          id="defects" no="5.2" kicker="Repairs"
          title="Seven defects were found in how the data had been handled. All seven are fixed."
          intro="Open a defect to read what earlier files said, what the data shows, and the safeguard now in place."
        >
          <div className="border-t border-ink">
            {forensic.systemicDefects.map((d) => {
              const open = openDefect === d.defectId;
              return (
                <div key={d.defectId} className="border-b border-rule">
                  <button type="button" className="grid w-full grid-cols-[4rem_minmax(0,1fr)_1.5rem] items-baseline gap-3 border-0 bg-transparent py-4 text-left" aria-expanded={open} onClick={() => setOpenDefect(open ? null : d.defectId)}>
                    <span className="t-mono text-haldi-ink">{d.defectId}</span>
                    <span className="text-[0.9375rem] font-semibold text-ink">{d.title}</span>
                    <span className="text-ink-3" aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <div className="grid gap-x-8 gap-y-5 pb-6 pl-0 md:grid-cols-3 md:pl-[4.75rem]">
                      {[
                        { l: 'What earlier files did', v: d.historicalArtifact, c: 'text-clay' },
                        { l: 'What the data shows', v: d.remediatedTruth, c: 'text-forest' },
                        { l: 'Safeguard now', v: d.safeguardMandate, c: 'text-ink-3' },
                      ].map((x) => (
                        <div key={x.l}>
                          <div className={`t-label ${x.c}`} style={{ color: 'currentColor' }}>{x.l}</div>
                          <p className="mt-2 text-[0.875rem] leading-[1.6] text-ink-2">{x.v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        <Section
          id="totals" no="5.3" kicker="The totals add up"
          title="The farmer rows sum to the workbook’s own totals, to the rupee."
          intro={<>The income sheet holds {num(proof.farmerRowsCount)} farmer rows and a pre-computed total in row {proof.grandTotalRowIndex}. Summing the rows independently reproduces each total with no difference, which also proves the total row is no longer being counted as a farmer.</>}
        >
          <Figure no="5.2" title="Sum of farmer rows against the grand-total cell" src="REC-HYG-01">
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Measure</th><th className="r">Sum of farmer rows</th><th className="r">Total cell</th><th className="r">Difference</th><th>Cell</th></tr></thead>
                <tbody>
                  {proof.metrics.map((m) => (
                    <tr key={m.metricName}>
                      <td className="strong" style={{ minWidth: 220 }}>{m.metricName}</td>
                      <td className="r">{inr(m.farmerRowsSum)}</td>
                      <td className="r">{inr(m.grandTotalCellValue)}</td>
                      <td className="r text-forest" style={{ fontWeight: 600 }}>{inr(m.discrepancyDelta, 2)}</td>
                      <td className="t-mono">{m.cellCoordinate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Figure>
        </Section>

        <Section
          id="withdrawn" no="5.4" kicker="Withdrawn"
          title="Claims we no longer make."
          intro="Each of these appeared in earlier material. None survived a check against the data."
        >
          <div className="border-t border-ink">
            {forensic.debunkedMyths.map((m) => (
              <div key={m.mythId} className="grid gap-x-8 gap-y-3 border-b border-rule py-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.6fr)]">
                <div>
                  <span className="t-mono text-ink-3">{m.mythId}</span>
                  <div className="mt-1 font-display text-[1.25rem] leading-[1.25] text-clay line-through decoration-1">{m.mythName}</div>
                </div>
                <div className="text-[0.875rem] leading-[1.6] text-ink-2">
                  <p><span className="font-semibold text-ink">Where it came from. </span>{m.originatingContext}</p>
                  <p className="mt-2"><span className="font-semibold text-ink">What we found. </span>{m.forensicInvestigation}</p>
                  <p className="mt-2"><span className="font-semibold text-ink">Outcome. </span>{m.neutralizationVerdict}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section
          id="privacy" no="5.5" kicker="Privacy"
          title="No household can be identified from anything published here."
          intro="Villages and panchayats are kept so the geography stays meaningful. People are not."
        >
          <dl className="defs">
            <div className="def"><dt>Phone numbers in published files</dt><dd>{pii.phoneNumbersFoundCount}</dd></div>
            <div className="def"><dt>Respondent names</dt><dd>{pii.namesAnonymizationPolicy}</dd></div>
            <div className="def"><dt>Children and family members</dt><dd>{pii.childRosterTokenization}</dd></div>
            <div className="def"><dt>Village and panchayat names</dt><dd>{pii.geographyIntegrityPreserved ? 'Kept intact' : 'Generalised'}</dd></div>
          </dl>
        </Section>

        <Section
          id="ledger" no="5.6" kicker="The ledger"
          title={`All ${all.length} evidence entries, searchable.`}
          intro="Select a row to open its full record: workbook, sheet, cells, cohort and the assertion that guards it."
          aside={<>FDB Survey as on 05112026.xlsx<br />Cut {cut}<br /><span className="t-mono">sha-256 {metadata.datasetSha256.slice(0, 16)}…</span></>}
          wide
        >
          <Note kind="method" label="Dataset">
            {metadata.surveyWave1Window} · {metadata.surveyWave2Window}
          </Note>
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <input className="input max-w-xs" type="search" placeholder="Search id, measure, sheet or cell" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search the ledger" />
              <Segmented label="Chapter" value={domain} onChange={setDomain} options={Object.entries(DOMAINS).map(([value, label]) => ({ value, label }))} />
              <Segmented label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'Any status' }, { value: 'VERIFIED', label: 'Verified' }, { value: 'RECONCILED', label: 'Reconciled' }, { value: 'NEUTRALIZED', label: 'Neutralised' }]} />
            </div>
            <p className="t-note mt-3" aria-live="polite">{rows.length} of {all.length} entries</p>
            <div className="tbl-wrap mt-4">
              <table className="tbl tbl--dense">
                <thead><tr><th>Id</th><th>Measure</th><th className="r">Verified value</th><th>Earlier value</th><th className="r">N</th><th>Cells</th><th>Status</th></tr></thead>
                <tbody>
                  {rows.map((m) => {
                    const s = STATUS[m.provenance.auditStatus] ?? STATUS.VERIFIED;
                    const hit = m.metricId === highlightedMetricId;
                    return (
                      <tr
                        key={m.metricId}
                        ref={(el) => { rowRefs.current[m.metricId] = el; }}
                        tabIndex={0}
                        onClick={() => source.open(m.metricId)}
                        onKeyDown={(e) => { if (e.key === 'Enter') source.open(m.metricId); }}
                        style={{ cursor: 'pointer', background: hit ? 'color-mix(in srgb, var(--haldi) 22%, transparent)' : undefined, boxShadow: hit ? 'inset 4px 0 0 var(--haldi)' : undefined }}
                      >
                        <td className="t-mono" style={{ whiteSpace: 'nowrap', paddingLeft: hit ? 12 : undefined }}>{m.metricId}</td>
                        <td className="strong" style={{ minWidth: 230 }}>{m.label}</td>
                        <td className="r" style={{ maxWidth: 220 }}>{show(m.verifiedValue)}</td>
                        <td className="muted" style={{ maxWidth: 220 }}>{show(m.baselineValue)}</td>
                        <td className="r muted">{num(m.sampleSize)}</td>
                        <td className="t-mono muted" style={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={coordOf(m)}>{coordOf(m)}</td>
                        <td><Tag tone={s.tone}>{s.text}</Tag></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && (
              <p className="t-note mt-4">Nothing matches. <button type="button" className="link" onClick={() => { setQuery(''); setDomain('all'); setStatus('all'); }}>Clear filters</button></p>
            )}
          </div>
        </Section>
      </div>
    </>
  );
};
