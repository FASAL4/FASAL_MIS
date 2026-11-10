import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { RightsEntitlementsData } from '@/types/dashboard';
import { Figure, Meter, Note, Section, Src, num, pct } from '../../ui';
import { KIOSK_CORRECTION, KIOSK_REGISTER, capital, kioskServiceName, word } from './rightsData';

/* ----------------------------------------------------------------------------
   3.6 — Jan Suvidha Kendra
---------------------------------------------------------------------------- */
export const Kiosks: React.FC<{
  jsk: RightsEntitlementsData['janSuvidhaKendra'];
  onOpenLedger: (metricId?: string) => void;
}> = ({ jsk, onOpenLedger }) => {
  const total = jsk.totalCitizenServicesDelivered;
  const types = [...jsk.topServiceTypes].sort((a, b) => b.applicationsCount - a.applicationsCount);
  const register = [...KIOSK_REGISTER].sort((a, b) => b.records - a.records);
  const registerMax = Math.ceil(Math.max(...register.map((r) => r.sharePct)) / 10) * 10;

  return (
    <Section
      id="kiosks"
      no="3.6"
      kicker="Jan Suvidha Kendra"
      title={`${capital(word(jsk.activeKiosksCount))} youth-run kiosks put ${num(total)} citizen services within reach.`}
      intro={
        <>
          In the forest buffer, digital exclusion, paperwork and failing biometric connections at common service centres
          keep households from services they are entitled to. At {word(jsk.activeKiosksCount)} Jan Suvidha Kendra
          (citizen-service kiosks), trained youth fellows facilitated <Src id="REC-JSK-01">{num(total)} verified services</Src>{' '}
          between 2022 and 2025.
        </>
      }
      aside="A Jan Suvidha Kendra is a village kiosk where a trained young person files online applications for neighbours and follows them up."
    >
      <Figure
        no="3.7"
        title="Applications filed and delivered, by service type"
        src="REC-JSK-01"
        caption="Success rate is delivered services as a share of applications filed."
      >
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Service</th>
                <th className="r">Applications</th>
                <th className="r">Delivered</th>
                <th style={{ width: '30%' }}>Success rate</th>
              </tr>
            </thead>
            <tbody>
              {types.map((t) => (
                <tr key={t.serviceName}>
                  <td className="strong" style={{ minWidth: 240 }}>
                    {kioskServiceName(t.serviceName)}
                  </td>
                  <td className="r">{num(t.applicationsCount)}</td>
                  <td className="r strong">{num(t.deliveredCount)}</td>
                  <td style={{ minWidth: 180 }}>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Meter
                          value={t.successRatePct}
                          label={`${kioskServiceName(t.serviceName)}: ${pct(t.successRatePct)} of applications delivered`}
                        />
                      </div>
                      <span className="w-14 text-right">{pct(t.successRatePct)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Figure>

      <Figure
        no="3.8"
        title={`Service lines verified in the kiosk register, 2022–2025 (share of ${num(total)} records)`}
        src="REC-JSK-01"
        caption="From the audited kiosk service register (reconciliation sub-ledger 11). The register files services under different headings from Fig. 3.7."
      >
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Service line</th>
                <th className="r">Records</th>
                <th style={{ width: '30%' }}>Share of all records</th>
              </tr>
            </thead>
            <tbody>
              {register.map((r) => (
                <tr key={r.name}>
                  <td className="strong" style={{ minWidth: 240 }}>
                    {r.name}
                    <span className="sub">{r.department}</span>
                  </td>
                  <td className="r strong">{r.src ? <Src id={r.src}>{num(r.records)}</Src> : num(r.records)}</td>
                  <td style={{ minWidth: 180 }}>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <Meter
                          value={r.sharePct}
                          max={registerMax}
                          tone="ink"
                          label={`${r.name}: ${pct(r.sharePct, 2)} of kiosk records`}
                        />
                      </div>
                      <span className="w-14 text-right">{pct(r.sharePct, 2)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Figure>

      <Note kind="audit" title={`An earlier draft counted ${num(KIOSK_CORRECTION.olderCount)}.`}>
        The register held {KIOSK_CORRECTION.removedRows} rows that were not services, and they were removed:{' '}
        {KIOSK_CORRECTION.titleBanners} title banners, {KIOSK_CORRECTION.repeatHeaders} repeated header rows and{' '}
        {KIOSK_CORRECTION.blankSerials} blank serial numbers. That leaves {num(total)} verified records.
        <div className="mt-3">
          <button type="button" className="link" onClick={() => onOpenLedger('REC-JSK-01')}>
            Open the kiosk register in the evidence ledger <ArrowRight size={15} aria-hidden="true" />
          </button>
        </div>
      </Note>
    </Section>
  );
};
