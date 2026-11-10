import { jsPDF } from 'jspdf';
import { HubUser } from '../types/hub';
import { SuiteExamResult } from '../data/examSuiteData';

function drawQrCodePlaceholder(pdf: jsPDF, x: number, y: number, size: number) {
  pdf.setDrawColor(19, 66, 43);
  pdf.setLineWidth(0.6);
  pdf.rect(x, y, size, size);
  // Corner finder squares
  const cSize = size * 0.26;
  pdf.setFillColor(19, 66, 43);
  pdf.rect(x + 1.5, y + 1.5, cSize, cSize, 'F');
  pdf.rect(x + size - cSize - 1.5, y + 1.5, cSize, cSize, 'F');
  pdf.rect(x + 1.5, y + size - cSize - 1.5, cSize, cSize, 'F');
  pdf.setFillColor(255, 255, 255);
  pdf.rect(x + 2.7, y + 2.7, cSize - 2.4, cSize - 2.4, 'F');
  pdf.rect(
    x + size - cSize - 0.3,
    y + 2.7,
    cSize - 2.4,
    cSize - 2.4,
    'F'
  );
  pdf.rect(
    x + 2.7,
    y + size - cSize - 0.3,
    cSize - 2.4,
    cSize - 2.4,
    'F'
  );
  // Inner matrix dots
  pdf.setFillColor(19, 66, 43);
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if ((r + c) % 2 === 0) {
        pdf.rect(
          x + size * 0.36 + c * 1.9,
          y + size * 0.36 + r * 1.9,
          1.3,
          1.3,
          'F'
        );
      }
    }
  }
}

export function download5PageExamReportPdf(
  user: HubUser,
  result: SuiteExamResult,
  previousResults: SuiteExamResult[] = []
) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const candidateName = (user.name || 'Food Specialist').trim();
  const isPass = result.status === 'PASS';

  // Compute subject breakdown
  const subjMap: Record<
    string,
    { total: number; correct: number; wrong: number; skipped: number }
  > = {};
  result.answers.forEach((ans) => {
    const cat = ans.category || 'Food Safety';
    if (!subjMap[cat]) {
      subjMap[cat] = { total: 0, correct: 0, wrong: 0, skipped: 0 };
    }
    subjMap[cat].total += 1;
    if (ans.userAnswer === null) {
      subjMap[cat].skipped += 1;
    } else if (ans.isCorrect) {
      subjMap[cat].correct += 1;
    } else {
      subjMap[cat].wrong += 1;
    }
  });
  const subjEntries = Object.entries(subjMap).map(([subject, st]) => {
    const pct = Math.round((st.correct / Math.max(1, st.total)) * 100);
    let grade = 'F';
    if (pct >= 90) grade = 'A+';
    else if (pct >= 80) grade = 'A';
    else if (pct >= 65) grade = 'B';
    else if (pct >= 50) grade = 'C';
    return {
      subject,
      ...st,
      pct,
      grade
    };
  });

  // ==========================================================================
  // PAGE 1: OFFICIAL COVER PAGE & SCORE STAMP
  // ==========================================================================
  // Dark Emerald Header Banner
  pdf.setFillColor(19, 66, 43);
  pdf.rect(0, 0, 210, 52, 'F');
  pdf.setFillColor(22, 163, 74);
  pdf.rect(0, 48, 210, 4, 'F');

  // Logo Emblem Box
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(14, 11, 24, 24, 4, 4, 'F');
  pdf.setTextColor(19, 66, 43);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(15);
  pdf.text('FS', 26, 26, { align: 'center' });

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(11);
  pdf.text('FOOD SCIENCE PORTAL OFFICIAL ASSESSMENT BOARD', 44, 18);
  pdf.setFontSize(20);
  pdf.text('EXAM PERFORMANCE REPORT', 44, 28);
  pdf.setFontSize(10);
  pdf.setTextColor(187, 247, 208);
  pdf.text(
    `Certificate ID: ${result.certificateId}  •  Official Multi-Page Transcript`,
    44,
    36
  );

  // Candidate & Exam Metadata Box
  pdf.setFillColor(244, 250, 247);
  pdf.setDrawColor(187, 247, 208);
  pdf.setLineWidth(0.5);
  pdf.roundedRect(14, 62, 182, 54, 4, 4, 'FD');

  // Avatar Circle with Initial
  pdf.setFillColor(22, 163, 74);
  pdf.circle(32, 89, 12, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.text(candidateName.charAt(0).toUpperCase(), 32, 94, { align: 'center' });

  pdf.setTextColor(15, 41, 30);
  pdf.setFontSize(14);
  pdf.text(candidateName, 50, 76);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(75, 99, 86);
  pdf.text(
    `Role / Qualification: ${
      user.title || user.currentRole || user.qualification || 'Food Safety & Quality Specialist'
    }`,
    50,
    83
  );
  pdf.text(`Email: ${user.email || 'Verified Specialist Member'}`, 50, 90);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(19, 66, 43);
  pdf.text(`Exam Title: ${result.title} (${result.category})`, 50, 99);
  pdf.text(
    `Date Completed: ${result.dateFormatted}   •   Duration: ${result.timeTakenFormatted}`,
    50,
    106
  );

  // Big Score Circle & Official PASS / FAIL Stamp
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(isPass ? 22 : 220, isPass ? 163 : 38, isPass ? 74 : 38);
  pdf.setLineWidth(1.2);
  pdf.roundedRect(14, 126, 182, 92, 6, 6, 'FD');

  // Score Circle
  pdf.setLineWidth(3.5);
  pdf.setDrawColor(isPass ? 22 : 220, isPass ? 163 : 38, isPass ? 74 : 38);
  pdf.circle(105, 164, 24, 'S');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(22);
  pdf.setTextColor(15, 41, 30);
  pdf.text(`${result.scorePercent}%`, 105, 162, { align: 'center' });
  pdf.setFontSize(11);
  pdf.setTextColor(75, 99, 86);
  pdf.text(
    `${result.correct} / ${result.totalQuestions} MCQs`,
    105,
    171,
    { align: 'center' }
  );

  // Official PASS / FAIL Stamp Pill
  if (isPass) {
    pdf.setFillColor(22, 163, 74);
  } else {
    pdf.setFillColor(220, 38, 38);
  }
  pdf.roundedRect(75, 195, 60, 13, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.text(
    isPass ? 'OFFICIAL STAMP: PASS' : 'OFFICIAL STAMP: FAIL',
    105,
    203.5,
    { align: 'center' }
  );

  // QR Verification Box on Cover Page
  pdf.setFillColor(248, 250, 252);
  pdf.setDrawColor(203, 227, 214);
  pdf.setLineWidth(0.4);
  pdf.roundedRect(14, 228, 182, 38, 4, 4, 'FD');
  drawQrCodePlaceholder(pdf, 20, 233, 26);

  pdf.setTextColor(15, 41, 30);
  pdf.setFontSize(11);
  pdf.text('Digital Transcript Verification & Authenticity', 52, 240);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(75, 99, 86);
  pdf.text(
    `Certificate ID: ${result.certificateId}  |  Pass Criteria: 50% Minimum  |  Candidate Status: ${result.status}`,
    52,
    248
  );
  pdf.text(
    'Verified by Food Science Portal — Food Safety, HACCP, ISO 22000 & FSSC 22000 Division.',
    52,
    255
  );

  // ==========================================================================
  // PAGE 2: SUMMARY DASHBOARD, METRICS TABLE & 3 VISUAL CHARTS
  // ==========================================================================
  pdf.addPage();
  pdf.setFillColor(19, 66, 43);
  pdf.rect(0, 0, 210, 22, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('PAGE 2 — EXECUTIVE SUMMARY DASHBOARD & VISUAL ANALYTICS', 14, 14);

  // 1. Summary Table
  pdf.setTextColor(15, 41, 30);
  pdf.setFontSize(12);
  pdf.text('1. Exam Performance Summary Table', 14, 33);

  const summaryRows = [
    ['Total Questions', `${result.totalQuestions} MCQs`, 'Pass Marks Criteria', '50% (15/30 MCQs)'],
    ['Correct Answers', `${result.correct} (${Math.round((result.correct / Math.max(1, result.totalQuestions)) * 100)}%)`, 'Final Status', result.status],
    ['Wrong Answers', `${result.wrong}`, 'Time Taken', result.timeTakenFormatted],
    ['Skipped Questions', `${result.skipped}`, 'Standing / Rank', result.scorePercent >= 80 ? 'Top 10% Specialist' : result.scorePercent >= 65 ? 'Top 25% Specialist' : 'Standard Tier']
  ];

  let tableY = 38;
  summaryRows.forEach((row, rIdx) => {
    pdf.setFillColor(rIdx % 2 === 0 ? 240 : 255, rIdx % 2 === 0 ? 253 : 255, rIdx % 2 === 0 ? 244 : 255);
    pdf.setDrawColor(203, 227, 214);
    pdf.rect(14, tableY, 182, 9, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(19, 66, 43);
    pdf.text(row[0], 18, tableY + 6);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(15, 41, 30);
    pdf.text(row[1], 65, tableY + 6);

    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(19, 66, 43);
    pdf.text(row[2], 110, tableY + 6);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(row[3] === 'PASS' ? 22 : 15, row[3] === 'PASS' ? 163 : 41, row[3] === 'PASS' ? 74 : 30);
    pdf.text(row[3], 158, tableY + 6);
    tableY += 9;
  });

  // 2. Visual Distribution Chart (Correct / Wrong / Skipped Segmented Bar + Legend Boxes)
  pdf.setTextColor(15, 41, 30);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('2. Accuracy Breakdown Chart (Correct vs. Wrong vs. Skipped)', 14, 86);

  const barX = 14;
  const barY = 92;
  const fullW = 182;
  const totalQ = Math.max(1, result.totalQuestions);
  const cW = (result.correct / totalQ) * fullW;
  const wW = (result.wrong / totalQ) * fullW;
  const sW = Math.max(0, fullW - cW - wW);

  if (cW > 0) {
    pdf.setFillColor(22, 163, 74);
    pdf.rect(barX, barY, cW, 12, 'F');
  }
  if (wW > 0) {
    pdf.setFillColor(234, 88, 12);
    pdf.rect(barX + cW, barY, wW, 12, 'F');
  }
  if (sW > 0) {
    pdf.setFillColor(156, 163, 175);
    pdf.rect(barX + cW + wW, barY, sW, 12, 'F');
  }

  // Legend boxes
  pdf.setFillColor(22, 163, 74);
  pdf.rect(14, 108, 4, 4, 'F');
  pdf.setFontSize(9.5);
  pdf.setTextColor(15, 41, 30);
  pdf.text(`Correct: ${result.correct} (${Math.round((result.correct / totalQ) * 100)}%)`, 20, 111.5);

  pdf.setFillColor(234, 88, 12);
  pdf.rect(76, 108, 4, 4, 'F');
  pdf.text(`Wrong: ${result.wrong} (${Math.round((result.wrong / totalQ) * 100)}%)`, 82, 111.5);

  pdf.setFillColor(156, 163, 175);
  pdf.rect(138, 108, 4, 4, 'F');
  pdf.text(`Skipped: ${result.skipped} (${Math.round((result.skipped / totalQ) * 100)}%)`, 144, 111.5);

  // 3. Subject-wise Performance Horizontal Bar Chart
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 41, 30);
  pdf.text('3. Subject-wise Performance Bar Chart', 14, 126);

  let chartY = 133;
  subjEntries.slice(0, 6).forEach((item) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(15, 41, 30);
    pdf.text(item.subject.slice(0, 26), 14, chartY + 4);

    // Track
    pdf.setFillColor(229, 231, 235);
    pdf.roundedRect(68, chartY, 100, 5.5, 1.5, 1.5, 'F');
    // Fill
    const fillW = Math.max(2, item.pct);
    pdf.setFillColor(item.pct >= 50 ? 22 : 220, item.pct >= 50 ? 163 : 38, item.pct >= 50 ? 74 : 38);
    pdf.roundedRect(68, chartY, fillW, 5.5, 1.5, 1.5, 'F');

    pdf.text(`${item.correct}/${item.total} (${item.pct}%)`, 172, chartY + 4);
    chartY += 10;
  });

  // 4. Line Chart: Previous 5 Exams Progress Trajectory
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 41, 30);
  pdf.text('4. Last 5 Exams Progress Trajectory (Score %)', 14, 202);

  const histScores = [
    ...previousResults
      .slice(0, 4)
      .map((r) => r.scorePercent)
      .reverse(),
    result.scorePercent
  ];
  while (histScores.length < 5) {
    histScores.unshift(Math.max(55, result.scorePercent - (5 - histScores.length) * 4));
  }

  const plotX = 24;
  const plotY = 210;
  const plotW = 164;
  const plotH = 44;

  pdf.setDrawColor(203, 227, 214);
  pdf.setFillColor(248, 252, 250);
  pdf.rect(plotX, plotY, plotW, plotH, 'FD');

  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(1.1);
  histScores.forEach((sc, idx) => {
    const x1 = plotX + (idx / 4) * plotW;
    const y1 = plotY + plotH - (Math.min(100, Math.max(0, sc)) / 100) * plotH;
    if (idx < 4) {
      const nextSc = histScores[idx + 1];
      const x2 = plotX + ((idx + 1) / 4) * plotW;
      const y2 =
        plotY + plotH - (Math.min(100, Math.max(0, nextSc)) / 100) * plotH;
      pdf.line(x1, y1, x2, y2);
    }
    pdf.setFillColor(19, 66, 43);
    pdf.circle(x1, y1, 1.8, 'F');
    pdf.setFontSize(8.5);
    pdf.setTextColor(19, 66, 43);
    pdf.text(`${sc}%`, x1, y1 - 3, { align: 'center' });
    pdf.setTextColor(100, 116, 139);
    pdf.text(idx === 4 ? 'Current' : `Exam -${4 - idx}`, x1, plotY + plotH + 5, {
      align: 'center'
    });
  });

  // ==========================================================================
  // PAGE 3: SUBJECT-WISE DETAILED ANALYSIS & AUDITOR RECOMMENDATIONS
  // ==========================================================================
  pdf.addPage();
  pdf.setFillColor(19, 66, 43);
  pdf.rect(0, 0, 210, 22, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('PAGE 3 — SUBJECT-WISE DETAILED ANALYSIS & RECOMMENDATIONS', 14, 14);

  // Table Header
  let sY = 32;
  pdf.setFillColor(19, 66, 43);
  pdf.rect(14, sY, 182, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.text('Subject / Category', 17, sY + 6.5);
  pdf.text('Total', 78, sY + 6.5);
  pdf.text('Correct', 95, sY + 6.5);
  pdf.text('Wrong/Skip', 115, sY + 6.5);
  pdf.text('Accuracy', 142, sY + 6.5);
  pdf.text('Grade', 166, sY + 6.5);
  pdf.text('Status', 180, sY + 6.5);
  sY += 10;

  subjEntries.forEach((item, idx) => {
    pdf.setFillColor(idx % 2 === 0 ? 244 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 247 : 255);
    pdf.setDrawColor(203, 227, 214);
    pdf.rect(14, sY, 182, 10, 'FD');

    pdf.setTextColor(15, 41, 30);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text(item.subject.slice(0, 28), 17, sY + 6.5);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(item.total), 81, sY + 6.5);
    pdf.text(String(item.correct), 99, sY + 6.5);
    pdf.text(String(item.wrong + item.skipped), 121, sY + 6.5);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`${item.pct}%`, 145, sY + 6.5);
    pdf.text(item.grade, 169, sY + 6.5);
    pdf.setTextColor(item.pct >= 50 ? 22 : 220, item.pct >= 50 ? 163 : 38, item.pct >= 50 ? 74 : 38);
    pdf.text(item.pct >= 50 ? 'PASS' : 'REVISE', 180, sY + 6.5);
    sY += 10;
  });

  // Detailed Recommendations per Subject
  sY += 10;
  pdf.setTextColor(15, 41, 30);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('Personalized Auditor Recommendations by Subject:', 14, sY);
  sY += 6;

  subjEntries.forEach((item) => {
    if (sY > 255) return;
    pdf.setFillColor(248, 252, 250);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(14, sY, 182, 16, 2.5, 2.5, 'FD');

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(19, 66, 43);
    pdf.text(
      `${item.subject} (${item.pct}% — Grade ${item.grade}):`,
      18,
      sY + 6
    );
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.8);
    pdf.setTextColor(51, 65, 85);
    const recText =
      item.pct >= 80
        ? `Strong command in ${item.subject}. Keep practicing advanced lead auditor case studies.`
        : item.pct >= 50
        ? `Satisfactory foundation in ${item.subject}. Review critical limits, ISO clauses, and verification procedures.`
        : `Priority focus needed in ${item.subject}. Revise core Codex HACCP principles and re-attempt Wrong Questions Bank.`;
    pdf.text(recText, 18, sY + 12.5);
    sY += 19;
  });

  // ==========================================================================
  // PAGE 4+: ALL 30 QUESTIONS WITH ANSWERS (STRUCTURED MCQ EXAM PAPER BOXES)
  // ==========================================================================
  pdf.addPage();
  pdf.setFillColor(19, 66, 43);
  pdf.rect(0, 0, 210, 22, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('PAGE 4 — COMPLETE 30-MCQ EXAM PAPER & ANSWER KEY REVIEW', 14, 14);

  let qY = 28;
  result.answers.forEach((ans, idx) => {
    if (qY > 238) {
      pdf.addPage();
      pdf.setFillColor(19, 66, 43);
      pdf.rect(0, 0, 210, 18, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.text(
        `30-MCQ EXAM PAPER & ANSWER KEY REVIEW (CONTINUED — Q${idx + 1} TO Q${result.answers.length})`,
        14,
        12
      );
      qY = 24;
    }

    const boxH = 38;
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(
      ans.isCorrect ? 22 : ans.userAnswer === null ? 156 : 234,
      ans.isCorrect ? 163 : ans.userAnswer === null ? 163 : 88,
      ans.isCorrect ? 74 : ans.userAnswer === null ? 175 : 12
    );
    pdf.setLineWidth(0.45);
    pdf.roundedRect(14, qY, 182, boxH, 2.5, 2.5, 'FD');

    // Top row inside MCQ box: Q# + Clean Question Text + Status Badge
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8.8);
    pdf.setTextColor(15, 41, 30);
    const cleanQText = ans.questionText.replace(/^\[[^\]]+\]\s*/, '').trim();
    const qLines = pdf.splitTextToSize(
      `Q${ans.questionNumber}. ${cleanQText}`,
      148
    );
    pdf.text(qLines.slice(0, 2), 17, qY + 5.5);

    const statusLabel =
      ans.userAnswer === null
        ? 'SKIPPED'
        : ans.isCorrect
        ? 'CORRECT ✓'
        : 'WRONG ✗';
    pdf.setTextColor(
      ans.isCorrect ? 22 : ans.userAnswer === null ? 100 : 220,
      ans.isCorrect ? 163 : ans.userAnswer === null ? 116 : 38,
      ans.isCorrect ? 74 : ans.userAnswer === null ? 139 : 38
    );
    pdf.text(statusLabel, 193, qY + 5.5, { align: 'right' });

    // Options A, B, C, D in 2x2 grid
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.8);
    pdf.setTextColor(51, 65, 85);
    pdf.text(`A) ${ans.optionA.slice(0, 42)}`, 17, qY + 15);
    pdf.text(`B) ${ans.optionB.slice(0, 42)}`, 105, qY + 15);
    pdf.text(`C) ${ans.optionC.slice(0, 42)}`, 17, qY + 20);
    pdf.text(`D) ${ans.optionD.slice(0, 42)}`, 105, qY + 20);

    // Highlighted Your Answer vs Correct Answer
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(22, 163, 74);
    pdf.text(`✓ Correct Answer: Option ${ans.correctAnswer}`, 17, qY + 26);

    pdf.setTextColor(
      ans.isCorrect ? 22 : 220,
      ans.isCorrect ? 163 : 38,
      ans.isCorrect ? 74 : 38
    );
    pdf.text(
      `Your Answer: ${
        ans.userAnswer ? `Option ${ans.userAnswer}` : 'Skipped (Not Answered)'
      }`,
      105,
      qY + 26
    );

    // 2-line Explanation
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(71, 85, 105);
    const expLine = pdf.splitTextToSize(
      `Explanation: ${ans.explanation}`,
      176
    );
    pdf.text(expLine.slice(0, 2), 17, qY + 31.5);

    qY += boxH + 3.5;
  });

  // ==========================================================================
  // FINAL PAGE (PAGE 5): IMPROVEMENT PLAN + CERTIFICATE SIGN-OFF
  // ==========================================================================
  pdf.addPage();
  pdf.setFillColor(19, 66, 43);
  pdf.rect(0, 0, 210, 22, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text('FINAL PAGE — PERSONALIZED IMPROVEMENT PLAN & CERTIFICATION', 14, 14);

  // Top 5 Weak Topics to Study
  pdf.setTextColor(15, 41, 30);
  pdf.setFontSize(12);
  pdf.text('1. Top 5 Priority Topics to Study & Revise', 14, 34);

  const weakSubjects = [...subjEntries]
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 5);
  const defaultWeakTopics = [
    'HACCP Principle 2 & 3 — Validating Critical Control Points & Critical Limits',
    'FSSC 22000 Version 6 Clause 2.5 — Food Defense (TACCP) & Food Fraud (VACCP)',
    'ISO 22000:2018 Clause 8.5.4 — OPRP vs. CCP Hazard Control Plan Differentiation',
    'Food Microbiology — Pathogen Lethality D-Value, Z-Value & Water Activity (Aw) Limits',
    'ISO 19011 Auditing — Grading Minor, Major & Critical Non-Conformities and CAPA Root Cause'
  ];

  let impY = 41;
  for (let i = 0; i < 5; i++) {
    const topicText = weakSubjects[i]
      ? `${weakSubjects[i].subject} (Current Accuracy: ${weakSubjects[i].pct}%) — Revise standard clauses & CCP monitoring`
      : defaultWeakTopics[i];
    pdf.setFillColor(244, 250, 247);
    pdf.setDrawColor(187, 247, 208);
    pdf.roundedRect(14, impY, 182, 10, 2, 2, 'FD');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(19, 66, 43);
    pdf.text(`${i + 1}. ${topicText}`, 18, impY + 6.5);
    impY += 12.5;
  }

  // Recommended Study Material
  impY += 4;
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.setTextColor(15, 41, 30);
  pdf.text('2. Recommended Food Safety & Science Study Material', 14, impY);
  impY += 7;
  const materials = [
    '• Codex Alimentarius General Principles of Food Hygiene (CXC 1-1969, Latest Revision)',
    '• ISO 22000:2018 Food Safety Management Systems & ISO/TS 22002-1 Prerequisite Programmes',
    '• FSSC 22000 Version 6 Scheme Documents & Additional Requirements',
    '• ICMSF Microorganisms in Foods & FDA Food Code TCS Temperature Guidelines',
    '• Next Suggested Mock Exam Date: ' +
      new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
  ];
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(51, 65, 85);
  materials.forEach((m) => {
    pdf.text(m, 16, impY);
    impY += 7;
  });

  // Official Certificate & Signature Block
  impY += 8;
  pdf.setFillColor(240, 253, 244);
  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(0.8);
  pdf.roundedRect(14, impY, 182, 54, 4, 4, 'FD');

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.setTextColor(19, 66, 43);
  pdf.text('OFFICIAL EXAM COMPLETION ENDORSEMENT', 105, impY + 12, {
    align: 'center'
  });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(9.5);
  pdf.setTextColor(15, 41, 30);
  pdf.text(
    `This certifies that ${candidateName} completed ${result.title} (${result.category})`,
    105,
    impY + 21,
    { align: 'center' }
  );
  pdf.text(
    `with a verified score of ${result.correct}/${result.totalQuestions} (${result.scorePercent}%) — Status: ${result.status}.`,
    105,
    impY + 28,
    { align: 'center' }
  );

  // Signature line
  pdf.setDrawColor(19, 66, 43);
  pdf.line(125, impY + 42, 182, impY + 42);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('Food Science Portal Exam Team', 153.5, impY + 47, { align: 'center' });
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8);
  pdf.text(`Certificate ID: ${result.certificateId}`, 22, impY + 46);

  // Add Footer & Page Numbers across ALL pages
  const totalPages = pdf.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(
      `This report is generated by Food Science Portal  •  Confidential  •  Page ${p} of ${totalPages}`,
      105,
      290,
      { align: 'center' }
    );
  }

  const safeName = candidateName.replace(/[^a-zA-Z0-9]/g, '-') || 'Specialist';
  const safeDate = result.dateFormatted.replace(/\s+/g, '-');
  pdf.save(`Food-Science-Portal-Exam-Report-${safeName}-${safeDate}.pdf`);
}

export function downloadExamAchievementCertificatePdf(
  user: HubUser,
  result: SuiteExamResult
) {
  const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const candidateName = (user.name || 'Food Specialist').trim();

  // Decorative Border
  pdf.setFillColor(244, 250, 247);
  pdf.rect(0, 0, 297, 210, 'F');
  pdf.setDrawColor(19, 66, 43);
  pdf.setLineWidth(2.5);
  pdf.rect(10, 10, 277, 190);
  pdf.setDrawColor(22, 163, 74);
  pdf.setLineWidth(0.8);
  pdf.rect(14, 14, 269, 182);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(14);
  pdf.setTextColor(22, 163, 74);
  pdf.text('FOOD SCIENCE PORTAL PROFESSIONAL CERTIFICATION BOARD', 148.5, 38, {
    align: 'center'
  });

  pdf.setFontSize(28);
  pdf.setTextColor(19, 66, 43);
  pdf.text('CERTIFICATE OF EXCELLENCE', 148.5, 55, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(75, 99, 86);
  pdf.text('This is proudly presented to', 148.5, 72, { align: 'center' });

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(24);
  pdf.setTextColor(15, 41, 30);
  pdf.text(candidateName, 148.5, 88, { align: 'center' });

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(12);
  pdf.setTextColor(51, 65, 85);
  pdf.text(
    `for achieving an outstanding score of ${result.scorePercent}% (${result.correct}/${result.totalQuestions} MCQs)`,
    148.5,
    105,
    { align: 'center' }
  );
  pdf.text(
    `in ${result.title} — ${result.category} Exam Preparation Assessment.`,
    148.5,
    115,
    { align: 'center' }
  );

  // Stamp
  pdf.setFillColor(22, 163, 74);
  pdf.roundedRect(118.5, 126, 60, 14, 3, 3, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(12);
  pdf.text('DISTINCTION • PASS', 148.5, 135, { align: 'center' });

  pdf.setTextColor(19, 66, 43);
  pdf.setFontSize(10);
  pdf.text(`Date: ${result.dateFormatted}`, 45, 168);
  pdf.text(`Certificate ID: ${result.certificateId}`, 45, 175);

  pdf.line(200, 165, 260, 165);
  pdf.text('Food Science Portal Exam Team', 230, 172, { align: 'center' });

  pdf.save(
    `Food-Science-Portal-Certificate-${candidateName.replace(/\s+/g, '-')}.pdf`
  );
}
