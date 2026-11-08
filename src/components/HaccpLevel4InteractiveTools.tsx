import React, { useState } from 'react';
import {
  HACCP_L4_PRP_CHECKLIST_ITEMS,
  HACCP_L4_SIMULATOR_PRESETS
} from '../data/haccpLevel4CourseData';

const LIKELIHOOD_LABELS = [
  '',
  'Improbable (1)',
  'Remote (2)',
  'Occasional (3)',
  'Probable (4)',
  'Frequent (5)'
];

const SEVERITY_LABELS = [
  '',
  'Negligible (1)',
  'Minor (2)',
  'Moderate (3)',
  'Major (4)',
  'Catastrophic (5)'
];

export const HaccpExecutiveModuleSummary: React.FC<{
  moduleNumber: number;
}> = ({ moduleNumber }) => {
  return (
    <div className="rounded-2xl border-2 border-[#1673B8]/35 bg-white p-5 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
        <div>
          <span className="inline-block bg-[#F0F6FC] text-[#1673B8] border border-[#D2DEEA] text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            Level 4 Managerial Executive Summary · Module {moduleNumber}
          </span>
          <h4 className="text-base font-black text-[#1A2138] mt-1">
            {moduleNumber === 1 &&
              'Module 1: Legal Framework & Managerial Responsibility'}
            {moduleNumber === 2 &&
              'Module 2: Prerequisite Programs (PRPs - ISO/TS 22002-1)'}
            {moduleNumber === 3 &&
              'Module 3: Preliminary Steps of HACCP (Steps 1–5)'}
            {moduleNumber === 4 &&
              'Module 4: The 7 Principles of HACCP (Steps 6–12) — Master CCP Table'}
            {moduleNumber === 5 &&
              'Module 5: Mandatory Documentation & Traceability Tiers'}
            {moduleNumber === 6 &&
              'Module 6: Conducting a HACCP Audit (ISO 19011 Approach)'}
          </h4>
        </div>
      </div>

      {moduleNumber === 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 bg-[#F0F6FC] rounded-xl border border-[#D2DEEA]">
            <h5 className="font-extrabold text-[#1673B8]">
              1. Global &amp; National Mandates
            </h5>
            <ul className="list-disc pl-5 space-y-2 mt-2 text-[#1A2138]">
              <li>
                <strong>Codex CXC 1-1969 (Rev. 2022/2023):</strong> International
                benchmark integrating 12 Steps, 7 Principles, Food Safety
                Culture, and Allergen Control.
              </li>
              <li>
                <strong>Pakistan Framework:</strong> PSQCA Standard{' '}
                <strong>PS: 3733</strong> and Provincial Food Authorities (PFA,
                SFA, KPFA, BFA) Pure Food Regulations require hazard-based
                controls and full traceability.
              </li>
              <li>
                <strong>Export Law:</strong> US FDA FSMA (21 CFR Part 117 -
                HARPC) &amp; EU Regulation (EC) 852/2004 Article 5 mandate
                validated food safety plans.
              </li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h5 className="font-extrabold text-[#1A2138]">
              2. Legal Due Diligence Defense
            </h5>
            <p className="mt-2 text-slate-700">
              In legal prosecution following a foodborne outbreak, a Food
              Business Operator (FBO) cannot rely on supplier warranties alone.
              Management must prove <strong>Due Diligence</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 mt-2 text-slate-700">
              <li>
                Scientific validation of Critical Limits before production.
              </li>
              <li>
                Continuous, un-falsified CCP monitoring and calibration logs.
              </li>
              <li>
                Immediate quarantine and root-cause CAPA when deviations occur.
              </li>
            </ul>
          </div>
        </div>
      )}

      {moduleNumber === 2 && (
        <div className="space-y-4 text-xs sm:text-sm">
          <p className="bg-[#F0F6FC] p-3.5 rounded-xl border border-[#D2DEEA] text-[#1A2138]">
            <strong className="text-[#1673B8]">Managerial Rule:</strong> PRPs
            control general operational and environmental hazards. If PRPs fail,
            the HACCP plan collapses under excessive CCPs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-[#D2DEEA] rounded-xl bg-white">
              <h5 className="font-extrabold text-[#1673B8]">
                7-Step SSOP Protocol
              </h5>
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-slate-700">
                <li>Dry Scrape heavy soil</li>
                <li>Pre-rinse (45–50°C warm water)</li>
                <li>Detergent foam (alkaline/acid)</li>
                <li>Potable water rinse</li>
                <li>Sanitize (100–200 ppm Chlorine / 200 ppm QAC)</li>
                <li>Final rinse (if required)</li>
                <li>Air dry &amp; ATP Swab (&lt; 30 RLU)</li>
              </ol>
            </div>
            <div className="p-4 border border-[#D2DEEA] rounded-xl bg-white">
              <h5 className="font-extrabold text-[#1673B8]">
                3-Line Integrated Pest Management
              </h5>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700">
                <li>
                  <strong>Line 1 (Perimeter):</strong> Tamper-resistant bait
                  stations every 15–20m outside;{' '}
                  <strong>no toxic rodenticides inside food zones</strong>.
                </li>
                <li>
                  <strong>Line 2 (Proofing):</strong> Door gaps &lt; 3mm, mesh
                  screens &lt; 1.2mm, positive air pressure.
                </li>
                <li>
                  <strong>Line 3 (Internal):</strong> Shatterproof LED Electric
                  Fly Killers (EFKs) placed &gt;= 3m away from exposed food.
                </li>
              </ul>
            </div>
            <div className="p-4 border border-[#D2DEEA] rounded-xl bg-white">
              <h5 className="font-extrabold text-[#1673B8]">
                Zoning &amp; Utilities
              </h5>
              <ul className="list-disc pl-5 mt-2 space-y-1.5 text-slate-700">
                <li>
                  <strong>Airflow:</strong> High-Care RTE zones maintained at
                  positive pressure (+5 to +15 Pa) so air flows outward toward
                  raw areas.
                </li>
                <li>
                  <strong>Water:</strong> 0 CFU/100ml Coliforms; residual free
                  chlorine 0.2–0.5 ppm at point of use.
                </li>
                <li>
                  <strong>Ice &amp; Steam:</strong> Culinary steam requires
                  food-grade boiler additives.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {moduleNumber === 3 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-4 border border-[#D2DEEA] rounded-xl bg-[#F0F6FC]/60 space-y-2">
            <h5 className="font-extrabold text-[#1673B8]">
              Step 1: Multidisciplinary Team
            </h5>
            <p className="text-slate-700">
              Requires QA Lead, Production Manager, Maintenance Engineer,
              Microbiologist, and Procurement. Ensures thermal mechanics, flow
              rates, and pathogen kinetics are understood.
            </p>
            <h5 className="font-extrabold text-[#1673B8] pt-2">
              Step 2 &amp; 3: Product Specs &amp; YOPI
            </h5>
            <p className="text-slate-700">
              Document intrinsic factors (pH, water activity a_w, preservatives)
              and extrinsic factors (modified atmosphere, storage temp).
              Explicitly assess vulnerability for <strong>YOPI</strong> (Young,
              Old, Pregnant, Immunocompromised).
            </p>
          </div>
          <div className="p-4 border border-[#D2DEEA] rounded-xl bg-[#F0F6FC]/60 space-y-2">
            <h5 className="font-extrabold text-[#1673B8]">
              Step 4 &amp; 5: Process Flow Diagram (PFD) &amp; Verification
            </h5>
            <p className="text-slate-700">
              PFD must include raw inputs, packaging, water/steam contact,
              rework loops, hold delays, and waste exits.{' '}
              <strong>Step 5 Mandate:</strong> Walk the floor across{' '}
              <em>Morning, Night, and Weekend Sanitation shifts</em> to catch
              undocumented bypass pipes or temporary holding tables.
            </p>
          </div>
        </div>
      )}

      {moduleNumber === 4 && (
        <div className="space-y-3 text-xs">
          <div className="overflow-x-auto rounded-xl border border-[#D2DEEA]">
            <table className="w-full border-collapse text-left">
              <thead className="bg-[#1A2138] text-white">
                <tr>
                  <th className="p-2.5 border border-[#D2DEEA]">CCP Example</th>
                  <th className="p-2.5 border border-[#D2DEEA]">Hazard</th>
                  <th className="p-2.5 border border-[#D2DEEA]">
                    Critical Limit (CL) vs Operating Limit (OL)
                  </th>
                  <th className="p-2.5 border border-[#D2DEEA]">Monitoring</th>
                  <th className="p-2.5 border border-[#D2DEEA]">
                    Corrective Action &amp; Validation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2DEEA]">
                <tr className="bg-white">
                  <td className="p-2.5 font-extrabold text-[#1673B8]">
                    CCP 1B: HTST Pasteurization
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Survival of Coxiella burnetii &amp; Salmonella
                  </td>
                  <td className="p-2.5 font-semibold text-[#1A2138]">
                    CL: &gt;= 72°C for &gt;= 15s | OL: 73.5°C for 16s
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Continuous FDV &amp; chart recorder
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Auto-divert flow; hold product; daily FDV cut-out validation
                  </td>
                </tr>
                <tr className="bg-[#F0F6FC]">
                  <td className="p-2.5 font-extrabold text-[#1673B8]">
                    CCP 2B: Poultry Blast Chilling
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Clostridium perfringens spore outgrowth
                  </td>
                  <td className="p-2.5 font-semibold text-[#1A2138]">
                    CL: 60°C to &lt;= 4°C within &lt;= 4 hrs | OL: &lt;= 2°C in
                    3.5 hrs
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Core data-logger in thickest bird every batch
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Hold batch if &gt; 4 hrs; lab pathogen test or destroy
                  </td>
                </tr>
                <tr className="bg-white">
                  <td className="p-2.5 font-extrabold text-[#1673B8]">
                    CCP 3P: Metal Detection
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Fe, Non-Fe, &amp; SS fragments
                  </td>
                  <td className="p-2.5 font-semibold text-[#1A2138]">
                    CL: Fe 1.5mm, Non-Fe 2.0mm, SS 2.5mm
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Hourly certified test wand checks (Leading/Middle/Trailing)
                  </td>
                  <td className="p-2.5 text-slate-700">
                    Stop line; lock reject bin; quarantine back to last good
                    check
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {moduleNumber === 5 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl">
            <strong className="text-[#1673B8] block">Tier 1: Policy</strong>
            <p className="mt-1 text-slate-700">
              Signed CEO Food Safety Policy, Scope, and Org Chart showing QA
              independence from Production.
            </p>
          </div>
          <div className="p-3.5 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl">
            <strong className="text-[#1673B8] block">Tier 2: Core HACCP</strong>
            <p className="mt-1 text-slate-700">
              Team credentials, PFDs, Zoning Maps, Hazard Worksheets, Decision
              Tree Logs, Master CCP Chart, Validation Dossiers.
            </p>
          </div>
          <div className="p-3.5 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl">
            <strong className="text-[#1673B8] block">Tier 3: PRP SOPs</strong>
            <p className="mt-1 text-slate-700">
              SSOPs, Master Cleaning Schedule, Pest Control Map, Glass Policy,
              Allergen Matrix, Recall SOP.
            </p>
          </div>
          <div className="p-3.5 bg-[#F0F6FC] border border-[#D2DEEA] rounded-xl">
            <strong className="text-[#1673B8] block">
              Tier 4: Live Records
            </strong>
            <p className="mt-1 text-slate-700">
              CCP Logs, NCR/CAPA registers, NIST Calibration Certificates, Mock
              Recall Mass-Balance Reports (98–102% within 4 hrs).
            </p>
          </div>
        </div>
      )}

      {moduleNumber === 6 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 border border-[#D2DEEA] rounded-xl bg-[#F0F6FC]/50">
            <h5 className="font-extrabold text-[#1673B8]">
              The Audit Triangle
            </h5>
            <p className="mt-1.5 text-slate-700">
              Triangulate every CCP via: (1) Physical Observation of line test,
              (2) Unscripted Operator Interview, and (3) Record Cross-Check for
              &ldquo;Pencil Whipping&rdquo; (identical numbers or pre-filled
              future timestamps).
            </p>
          </div>
          <div className="p-4 border border-[#D2DEEA] rounded-xl bg-[#F0F6FC]/50">
            <h5 className="font-extrabold text-[#1673B8]">
              Vertical Audit &amp; Traceability
            </h5>
            <p className="mt-1.5 text-slate-700">
              Select 1 finished batch code from dispatch and trace backward to
              raw supplier CoAs, that exact day&apos;s pasteurizer chart, pre-op
              ATP swabs, and calibration status of the probe used.
            </p>
          </div>
          <div className="p-4 border border-[#D2DEEA] rounded-xl bg-[#F0F6FC]/50">
            <h5 className="font-extrabold text-[#1673B8]">
              Grading Non-Conformances
            </h5>
            <ul className="list-disc pl-4 mt-1.5 text-xs space-y-1.5 text-slate-700">
              <li>
                <strong>Critical NC:</strong> Direct food safety failure or
                falsified CCP log (Immediate line stop).
              </li>
              <li>
                <strong>Major NC:</strong> Systemic breakdown / uncalibrated CCP
                probe (7–14 days closure).
              </li>
              <li>
                <strong>Minor NC:</strong> Isolated lapse with zero immediate
                risk (30 days closure).
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export const HaccpRiskAndCcpSimulator: React.FC = () => {
  const [scenarioIdx, setScenarioIdx] = useState<number>(0);
  const [likelihood, setLikelihood] = useState<number>(
    HACCP_L4_SIMULATOR_PRESETS[0].l
  );
  const [severity, setSeverity] = useState<number>(
    HACCP_L4_SIMULATOR_PRESETS[0].s
  );
  const [q1, setQ1] = useState<boolean>(HACCP_L4_SIMULATOR_PRESETS[0].q1);
  const [q2, setQ2] = useState<boolean>(HACCP_L4_SIMULATOR_PRESETS[0].q2);
  const [q3, setQ3] = useState<boolean>(HACCP_L4_SIMULATOR_PRESETS[0].q3);
  const [q4, setQ4] = useState<boolean>(HACCP_L4_SIMULATOR_PRESETS[0].q4);

  const currentPreset =
    HACCP_L4_SIMULATOR_PRESETS[scenarioIdx] || HACCP_L4_SIMULATOR_PRESETS[0];
  const score = likelihood * severity;

  const handleSelectScenario = (idx: number) => {
    const preset =
      HACCP_L4_SIMULATOR_PRESETS[idx] || HACCP_L4_SIMULATOR_PRESETS[0];
    setScenarioIdx(idx);
    setLikelihood(preset.l);
    setSeverity(preset.s);
    setQ1(preset.q1);
    setQ2(preset.q2);
    setQ3(preset.q3);
    setQ4(preset.q4);
  };

  let riskBadgeClass = 'bg-red-600 text-white';
  let riskBadgeText = `Risk Score: ${score} (High / Significant Hazard — Enter CCP Tree)`;
  if (score <= 4) {
    riskBadgeClass = 'bg-[#1673B8] text-white';
    riskBadgeText = `Risk Score: ${score} (Low Risk — Manage via Standard PRPs)`;
  } else if (score <= 9) {
    riskBadgeClass = 'bg-amber-400 text-slate-900';
    riskBadgeText = `Risk Score: ${score} (Medium Risk — Manage via OPRP)`;
  }

  let verdictPillClass = 'bg-red-100 text-red-800';
  let verdictPillText = 'CRITICAL CONTROL POINT (CCP)';
  let verdictLogic = '';

  if (score < 10) {
    verdictPillClass = 'bg-[#EBF4FC] text-[#105E9A]';
    verdictPillText = 'PREREQUISITE PROGRAM (PRP / OPRP)';
    verdictLogic = `Because the Risk Score (${score}) is below the Significant threshold (10), this step is controlled by foundational PRPs/OPRPs without creating a CCP.`;
  } else if (!q1) {
    verdictPillClass = 'bg-amber-100 text-amber-800';
    verdictPillText = 'MODIFY PROCESS STEP';
    verdictLogic =
      'Q1 is NO: Preventive control measures do not exist at this step. Modify the process, equipment, or product design to establish control.';
  } else if (q2) {
    verdictPillClass = 'bg-red-100 text-red-800';
    verdictPillText = 'DIRECT CRITICAL CONTROL POINT (CCP)';
    verdictLogic =
      'Q1=Yes & Q2=Yes: This step is specifically designed to eliminate or reduce the significant hazard to an acceptable level.';
  } else if (!q3) {
    verdictPillClass = 'bg-[#EBF4FC] text-[#105E9A]';
    verdictPillText = 'NOT A CCP (MANAGE VIA PRP)';
    verdictLogic =
      'Q2=No & Q3=No: Contamination cannot occur in excess of acceptable levels at this step.';
  } else if (q4) {
    verdictPillClass = 'bg-amber-100 text-amber-800';
    verdictPillText = 'OPRP (SUBSEQUENT STEP IS THE CCP)';
    verdictLogic =
      'Q3=Yes & Q4=Yes: Although contamination can increase here, a downstream step (e.g., Cooking or Metal Detection) eliminates the hazard.';
  } else {
    verdictPillClass = 'bg-red-100 text-red-800';
    verdictPillText = 'CRITICAL CONTROL POINT (CCP via Q4=NO)';
    verdictLogic =
      'Q3=Yes & Q4=No: No subsequent step will eliminate this hazard! Therefore, THIS step must be controlled as a CCP.';
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D2DEEA] p-5 sm:p-6 space-y-6">
      <div>
        <span className="inline-block px-2.5 py-1 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-[10.5px] font-extrabold uppercase tracking-wider">
          Interactive Simulator · Codex Principle 1 &amp; Principle 2
        </span>
        <h3 className="text-xl sm:text-2xl font-black text-[#1A2138] mt-1.5">
          Interactive 5×5 Risk Matrix &amp; Codex CCP Decision Engine
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Select an industrial scenario or adjust the Likelihood &amp; Severity
          sliders and Codex Q1–Q4 toggles to determine whether a step is a PRP,
          OPRP, or CCP.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="bg-[#F0F6FC] p-5 rounded-2xl border border-[#D2DEEA] space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase text-[#1A2138] mb-1.5">
              Preset Plant Scenario
            </label>
            <select
              value={scenarioIdx}
              onChange={(e) => handleSelectScenario(Number(e.target.value))}
              className="w-full p-2.5 rounded-xl border border-[#94B8D7] bg-white text-xs sm:text-sm font-bold text-[#1A2138] focus:outline-none focus:border-[#1673B8]"
            >
              {HACCP_L4_SIMULATOR_PRESETS.map((preset, idx) => (
                <option key={preset.name} value={idx}>
                  {preset.categoryLabel}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-1">
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span>
                Likelihood (L):{' '}
                <span className="text-[#1673B8] font-black">{likelihood}</span>
                /5
              </span>
              <span className="text-xs text-slate-500">
                {LIKELIHOOD_LABELS[likelihood]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={likelihood}
              onChange={(e) => setLikelihood(Number(e.target.value))}
              className="w-full accent-[#1673B8] mt-1.5 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs sm:text-sm font-bold">
              <span>
                Severity (S):{' '}
                <span className="text-[#1673B8] font-black">{severity}</span>/5
              </span>
              <span className="text-xs text-slate-500">
                {SEVERITY_LABELS[severity]}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              className="w-full accent-[#1673B8] mt-1.5 cursor-pointer"
            />
          </div>

          <div
            className={`p-3.5 rounded-xl font-extrabold text-xs sm:text-sm text-center transition ${riskBadgeClass}`}
          >
            {riskBadgeText}
          </div>

          {/* Codex Decision Tree Questions */}
          <div className="space-y-2.5 pt-3 border-t border-[#D2DEEA]">
            <h4 className="text-xs font-extrabold uppercase text-[#1A2138]">
              Codex Decision Tree (Step 7)
            </h4>
            <label className="flex justify-between items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#D2DEEA] cursor-pointer">
              <span className="text-[#1A2138]">
                <strong>Q1:</strong> Do preventive control measures exist?
              </span>
              <input
                type="checkbox"
                checked={q1}
                onChange={(e) => setQ1(e.target.checked)}
                className="w-4 h-4 accent-[#1673B8] shrink-0"
              />
            </label>
            <label className="flex justify-between items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#D2DEEA] cursor-pointer">
              <span className="text-[#1A2138]">
                <strong>Q2:</strong> Step specifically designed to eliminate
                hazard?
              </span>
              <input
                type="checkbox"
                checked={q2}
                onChange={(e) => setQ2(e.target.checked)}
                className="w-4 h-4 accent-[#1673B8] shrink-0"
              />
            </label>
            <label className="flex justify-between items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#D2DEEA] cursor-pointer">
              <span className="text-[#1A2138]">
                <strong>Q3:</strong> Can contamination exceed acceptable level?
              </span>
              <input
                type="checkbox"
                checked={q3}
                onChange={(e) => setQ3(e.target.checked)}
                className="w-4 h-4 accent-[#1673B8] shrink-0"
              />
            </label>
            <label className="flex justify-between items-center gap-2 text-xs bg-white p-2.5 rounded-xl border border-[#D2DEEA] cursor-pointer">
              <span className="text-[#1A2138]">
                <strong>Q4:</strong> Will a subsequent step eliminate the
                hazard?
              </span>
              <input
                type="checkbox"
                checked={q4}
                onChange={(e) => setQ4(e.target.checked)}
                className="w-4 h-4 accent-[#1673B8] shrink-0"
              />
            </label>
          </div>
        </div>

        {/* 5x5 Visual Matrix & Result Card */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-[#D2DEEA]">
            <h4 className="text-xs sm:text-sm font-extrabold text-[#1A2138] mb-3">
              Live 5×5 Risk Matrix Grid (Likelihood × Severity)
            </h4>
            <div className="grid grid-cols-5 gap-1.5 text-center text-xs font-bold">
              {[5, 4, 3, 2, 1].map((rowL) =>
                [1, 2, 3, 4, 5].map((colS) => {
                  const val = rowL * colS;
                  const isSelected = rowL === likelihood && colS === severity;
                  let cellClass =
                    val <= 4
                      ? 'bg-[#EBF4FC] text-[#105E9A]'
                      : val <= 9
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-red-100 text-red-900';
                  if (isSelected) {
                    cellClass =
                      'bg-[#1A2138] text-white ring-4 ring-[#1673B8] scale-105 z-10';
                  }
                  return (
                    <button
                      key={`L${rowL}-S${colS}`}
                      type="button"
                      onClick={() => {
                        setLikelihood(rowL);
                        setSeverity(colS);
                      }}
                      className={`p-2.5 rounded-xl transition cursor-pointer ${cellClass}`}
                    >
                      L{rowL}×S{colS}
                      <br />
                      <span className="text-sm font-black">{val}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl border-2 border-[#1673B8] bg-white space-y-3 shadow-xs">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Codex Determination Verdict
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${verdictPillClass}`}
              >
                {verdictPillText}
              </span>
            </div>
            <h4 className="text-lg font-black text-[#1A2138]">
              {currentPreset.name}
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {verdictLogic}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="bg-[#F0F6FC] p-3.5 rounded-xl border border-[#D2DEEA]">
                <strong className="block text-[#1673B8] font-extrabold">
                  Critical / Target Limit:
                </strong>
                <span className="mt-1 block font-semibold text-[#1A2138]">
                  {currentPreset.cl}
                </span>
              </div>
              <div className="bg-[#F0F6FC] p-3.5 rounded-xl border border-[#D2DEEA]">
                <strong className="block text-[#1673B8] font-extrabold">
                  Monitoring Protocol:
                </strong>
                <span className="mt-1 block font-semibold text-[#1A2138]">
                  {currentPreset.mon}
                </span>
              </div>
              <div className="bg-[#F0F6FC] p-3.5 rounded-xl border border-[#D2DEEA]">
                <strong className="block text-[#1673B8] font-extrabold">
                  Corrective Action:
                </strong>
                <span className="mt-1 block font-semibold text-[#1A2138]">
                  {currentPreset.ca}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const HaccpPrpAuditChecklistTool: React.FC = () => {
  const [items, setItems] = useState(() =>
    HACCP_L4_PRP_CHECKLIST_ITEMS.map((item) => ({
      ...item,
      checked: item.defaultChecked
    }))
  );

  const verifiedCount = items.filter((i) => i.checked).length;

  const toggleItem = (idx: number) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#D2DEEA] p-5 sm:p-6 space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#D2DEEA] pb-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-md bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] text-[10.5px] font-extrabold uppercase tracking-wider">
            ISO/TS 22002-1 Prerequisite Audit Tool
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-[#1A2138] mt-1">
            Daily Managerial PRP &amp; GMP Audit Checklist
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Interactive ISO/TS 22002-1 Prerequisite verification tracker for QA
            Managers.
          </p>
        </div>
        <div className="text-right bg-[#F0F6FC] px-4 py-2.5 rounded-2xl border border-[#D2DEEA]">
          <span className="text-2xl font-black text-[#1673B8]">
            {verifiedCount}/{items.length}
          </span>
          <span className="block text-[11px] font-bold text-slate-500">
            Verified Items
          </span>
        </div>
      </div>

      <div className="divide-y divide-slate-200">
        {items.map((item, idx) => (
          <div
            key={item.id}
            className="py-3.5 flex items-start justify-between gap-4"
          >
            <label className="flex items-start gap-3 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => toggleItem(idx)}
                className="mt-1 w-5 h-5 accent-[#1673B8] rounded cursor-pointer shrink-0"
              />
              <div>
                <span className="text-[11px] font-extrabold uppercase text-[#1673B8]">
                  {item.cat}
                </span>
                <p
                  className={`font-bold text-xs sm:text-sm ${
                    item.checked
                      ? 'line-through text-slate-400'
                      : 'text-[#1A2138]'
                  }`}
                >
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{item.sub}</p>
              </div>
            </label>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-extrabold shrink-0 ${
                item.checked
                  ? 'bg-[#EBF4FC] text-[#105E9A]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {item.checked ? 'Verified' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
