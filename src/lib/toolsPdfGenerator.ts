import { jsPDF } from 'jspdf';
import {
  HubUser,
  NutritionProfileData,
  UserExamAttempt
} from '../types/hub';
import {
  ComputedNutritionMetrics,
  ExamPrepSet
} from '../data/examPrepData';
import {
  ALL_2000_EXAM_MCQS,
  UnifiedExamQuestion,
  UnifiedInterviewQuestion
} from '../data/questionBank2000';
import { InterviewPrepSet } from '../data/interviewPrepData';
import {
  drawPdfBrandLogo,
  drawPdfUserPhoto,
  fitPdfTextToWidth,
  sanitizePdfText
} from './pdfBranding';

function extractUserDetails(userOrName: HubUser | string) {
  if (typeof userOrName === 'string') {
    return {
      name: sanitizePdfText(userOrName || 'Food Specialist', true),
      email: 'Verified Member',
      phone: '',
      role: 'Food Safety & Quality Specialist',
      qualification: 'Food Science & Technology',
      location: 'Pakistan',
      profilePicUrl: undefined as string | undefined
    };
  }
  return {
    name: sanitizePdfText(userOrName.name?.trim() || 'Food Specialist', true),
    email: sanitizePdfText(userOrName.email?.trim() || 'Verified Member', true),
    phone: sanitizePdfText(userOrName.phone?.trim() || '', true),
    role: sanitizePdfText(
      userOrName.title?.trim() ||
        userOrName.currentRole?.trim() ||
        'Food Safety & Quality Specialist',
      true
    ),
    qualification: sanitizePdfText(
      userOrName.qualification?.trim() || 'Food Science & Technology',
      true
    ),
    location: sanitizePdfText(userOrName.location?.trim() || 'Pakistan', true),
    profilePicUrl: userOrName.profilePicUrl
  };
}

export function downloadNutritionReportPdf(
  userOrName: HubUser | string,
  nutrition: NutritionProfileData,
  metrics: ComputedNutritionMetrics
): void {
  const u = extractUserDetails(userOrName);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageWidth - margin * 2;
  let y = 16;

  // Top Emerald Header Banner with Large Food Science Portal Logo & User Profile Picture
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 40, 'F');

  drawPdfBrandLogo(doc, 12, 7, 26, {
    borderColor: [255, 255, 255],
    bgFill: [255, 255, 255],
    roundedRadius: 3.5
  });

  drawPdfUserPhoto(doc, u.profilePicUrl, u.name, pageWidth - 36, 8, 24, {
    borderColor: [167, 243, 208],
    fallbackBgColor: [22, 163, 74],
    fallbackTextColor: [255, 255, 255]
  });

  const textX = 41;
  const headerMaxW = pageWidth - 39 - textX; // Clears photo at pageWidth - 36
  doc.setTextColor(167, 243, 208);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Food Science Portal', textX, 12.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13.5);
  doc.text(
    fitPdfTextToWidth(doc, 'PERSONAL NUTRITION & BMI HEALTH REPORT', headerMaxW),
    textX,
    19.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Specialist: ${u.name} | Role: ${u.role} | Email: ${u.email}`,
      headerMaxW
    ),
    textX,
    26.5
  );
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Height: ${nutrition.heightCm} cm | Weight: ${nutrition.weightKg} kg | Target: ${nutrition.targetWeightKg} kg | Age: ${nutrition.age} (${nutrition.gender.toUpperCase()}) | ${new Date().toLocaleDateString('en-PK')}`,
      headerMaxW
    ),
    textX,
    33
  );

  y = 46;

  // Section 1: BMI & Weight Recommendation Box (dynamically sized)
  const innerW = contentW - 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const bmiHeaderLines = doc.splitTextToSize(
    sanitizePdfText(
      `1. BMI & Clinical Weight Verdict: BMI ${metrics.bmi} kg/m2 (${metrics.bmiCategory}) - ${metrics.weightAction}`,
      true
    ),
    innerW
  );
  doc.setFontSize(10);
  const verdictLines = doc.splitTextToSize(
    sanitizePdfText(`Verdict: ${metrics.recommendationHeadline}`, true),
    innerW
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  const recLines = doc.splitTextToSize(
    sanitizePdfText(metrics.recommendationDetail, true),
    innerW
  );

  const sec1H =
    6 +
    bmiHeaderLines.length * 4.8 +
    1.5 +
    verdictLines.length * 4.4 +
    1.5 +
    recLines.length * 4.1 +
    4;

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, contentW, sec1H, 3, 3, 'FD');

  let boxY = y + 7.5;
  doc.setTextColor(15, 41, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(bmiHeaderLines, margin + 4, boxY);
  boxY += bmiHeaderLines.length * 4.8 + 1.5;

  doc.setFontSize(10);
  doc.setTextColor(14, 159, 110);
  doc.text(verdictLines, margin + 4, boxY);
  boxY += verdictLines.length * 4.4 + 1.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(55, 65, 81);
  doc.text(recLines, margin + 4, boxY);

  y += sec1H + 6;

  // Section 2: Daily Energy & Macronutrient Targets (dynamically sized)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const bmrLines = doc.splitTextToSize(
    sanitizePdfText(
      `- BMR: ${metrics.bmrKcal} kcal/day | Maintenance TDEE: ${metrics.tdeeKcal} kcal/day | Daily Target: ${metrics.dailyTargetKcal} kcal/day`,
      true
    ),
    innerW
  );
  const macroLines = doc.splitTextToSize(
    sanitizePdfText(
      `- Macro Targets: Protein ${metrics.targetProteinG}g | Carbs ${metrics.targetCarbsG}g | Fats ${metrics.targetFatsG}g | Logged Today: ${metrics.consumedKcal} kcal (${nutrition.waterGlassesToday}/8 glasses water)`,
      true
    ),
    innerW
  );
  const sec2H = 11 + bmrLines.length * 4.4 + macroLines.length * 4.4 + 5;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, contentW, sec2H, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(19, 66, 43);
  doc.text(
    '2. Daily Calorie & Macronutrient Prescription (Mifflin-St Jeor)',
    margin + 4,
    y + 7.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(31, 41, 55);
  let s2Y = y + 14;
  doc.text(bmrLines, margin + 4, s2Y);
  s2Y += bmrLines.length * 4.4 + 1.5;
  doc.text(macroLines, margin + 4, s2Y);

  y += sec2H + 6;

  // Section 3: Weight Trajectory Visual Bar Chart inside PDF
  if (y + 38 > pageHeight - 18) {
    doc.addPage();
    y = 18;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(19, 66, 43);
  doc.text(
    '3. Visual Weight Trajectory Graph (Current vs Healthy Range vs Target Goal)',
    margin,
    y
  );
  y += 4;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, contentW, 28, 2.5, 2.5, 'FD');

  const maxScaleKg = Math.max(
    110,
    nutrition.weightKg + 15,
    nutrition.targetWeightKg + 15
  );
  const labelColW = 44;
  const barStartX = margin + labelColW + 4;
  const barMaxW = contentW - labelColW - 10;

  const curW = Math.max(10, Math.min(barMaxW, (nutrition.weightKg / maxScaleKg) * barMaxW));
  const tarW = Math.max(10, Math.min(barMaxW, (nutrition.targetWeightKg / maxScaleKg) * barMaxW));
  const idlW = Math.max(10, Math.min(barMaxW, (metrics.idealMidKg / maxScaleKg) * barMaxW));

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.4);
  doc.setTextColor(15, 41, 30);
  doc.text(
    fitPdfTextToWidth(doc, `Current (${nutrition.weightKg} kg)`, labelColW),
    margin + 3,
    y + 8
  );
  doc.setFillColor(234, 88, 12);
  doc.roundedRect(barStartX, y + 4.5, curW, 4.5, 1, 1, 'F');

  doc.text(
    fitPdfTextToWidth(doc, `Target Goal (${nutrition.targetWeightKg} kg)`, labelColW),
    margin + 3,
    y + 16
  );
  doc.setFillColor(14, 159, 110);
  doc.roundedRect(barStartX, y + 12.5, tarW, 4.5, 1, 1, 'F');

  doc.text(
    fitPdfTextToWidth(doc, `WHO Ideal (${metrics.idealMidKg} kg)`, labelColW),
    margin + 3,
    y + 24
  );
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(barStartX, y + 20.5, idlW, 4.5, 1, 1, 'F');

  y += 35;

  // Section 4: Logged Meals
  if (y + 16 > pageHeight - 18) {
    doc.addPage();
    y = 18;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(19, 66, 43);
  doc.text('4. Logged Daily Food & Calorie Intake:', margin, y);
  y += 5;

  if (!nutrition.mealLogs || nutrition.mealLogs.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('No meals logged yet.', margin + 2, y + 4);
  } else {
    nutrition.mealLogs.slice(0, 12).forEach((meal, idx) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      const mealLines = doc.splitTextToSize(
        sanitizePdfText(
          `${idx + 1}. [${meal.mealType}] ${meal.foodName} (${meal.portion}) - ${meal.calories} kcal (P: ${meal.proteinG}g, C: ${meal.carbsG}g, F: ${meal.fatsG}g)`,
          true
        ),
        contentW - 4
      );
      if (y + mealLines.length * 4.5 > pageHeight - 16) {
        doc.addPage();
        y = 18;
      }
      doc.setTextColor(15, 41, 30);
      doc.text(mealLines, margin + 2, y);
      y += mealLines.length * 4.5 + 1.5;
    });
  }

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      fitPdfTextToWidth(
        doc,
        `Official Personalized Nutrition Report for ${u.name} | Generated via Food Science Portal`,
        contentW - 24
      ),
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right'
    });
  }

  doc.save(
    `Food-Science-Portal-Nutrition-Report-${u.name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 25)}.pdf`
  );
}

/**
 * Generates an Official Personalized 30-MCQ Exam Transcript & Visual Graph Report PDF
 * in the User's Name with Pass/Fail counts, Percentage Score, Visual Graph, and all 30 Questions.
 */
export function downloadExamReportPdf(
  userOrName: HubUser | string,
  attempt: UserExamAttempt,
  questionsOrSet?: UnifiedExamQuestion[] | ExamPrepSet,
  selectedAnswers?: Record<string, number>
): void {
  const u = extractUserDetails(userOrName);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageWidth - margin * 2;
  let y = 15;

  let questionsList: UnifiedExamQuestion[] = [];
  if (Array.isArray(questionsOrSet)) {
    questionsList = questionsOrSet;
  } else if (questionsOrSet && 'questions' in questionsOrSet) {
    questionsList = questionsOrSet.questions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      globalNumber: idx + 1,
      subject: q.category || 'Food Safety',
      question: q.question,
      options: [...q.options],
      correctAnswerIndex: q.correctIndex,
      explanation: q.explanation
    }));
  } else if (attempt.questionIds && attempt.questionIds.length > 0) {
    const idMap = new Map(ALL_2000_EXAM_MCQS.map((q) => [q.id, q]));
    const resolved: UnifiedExamQuestion[] = [];
    attempt.questionIds.forEach((id, idx) => {
      const found = idMap.get(id);
      if (found) {
        resolved.push({ ...found, questionNumber: idx + 1 });
      }
    });
    questionsList = resolved;
  } else {
    questionsList = ALL_2000_EXAM_MCQS.slice(0, attempt.totalQuestions || 30);
  }

  const ansMap = selectedAnswers || attempt.selectedAnswers || {};
  const totalQs = attempt.totalQuestions || questionsList.length || 30;
  const passedCount = attempt.correctCount;
  const failedCount =
    typeof attempt.failedCount === 'number'
      ? attempt.failedCount
      : Math.max(0, totalQs - passedCount);

  // 1. Top Emerald Official Transcript Header with Large Logo & Candidate Photo
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 42, 'F');

  drawPdfBrandLogo(doc, 12, 8, 26, {
    borderColor: [255, 255, 255],
    bgFill: [255, 255, 255],
    roundedRadius: 3.5
  });

  drawPdfUserPhoto(doc, u.profilePicUrl, u.name, pageWidth - 36, 9, 24, {
    borderColor: [167, 243, 208],
    fallbackBgColor: [22, 163, 74],
    fallbackTextColor: [255, 255, 255]
  });

  const textX = 41;
  const headerMaxW = pageWidth - 39 - textX;
  doc.setTextColor(167, 243, 208);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('Food Science Portal', textX, 11.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(
    fitPdfTextToWidth(doc, 'OFFICIAL 30-MCQ EXAM ASSESSMENT REPORT', headerMaxW),
    textX,
    18
  );

  doc.setFontSize(9.2);
  doc.setTextColor(167, 243, 208);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Candidate: ${u.name.toUpperCase()} | Verdict: ${
        attempt.passed ? 'PASSED (QUALIFIED)' : 'NEEDS REVISION (FAILED)'
      } (${attempt.percentage}%)`,
      headerMaxW
    ),
    textX,
    24.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(255, 255, 255);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Email: ${u.email} | Role: ${u.role} | Qualification: ${u.qualification}`,
      headerMaxW
    ),
    textX,
    30.5
  );
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Session: ${attempt.setTitle || '30-MCQ Specialist Exam'} | Date: ${new Date(
        attempt.completedAt || Date.now()
      ).toLocaleDateString('en-PK', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })}`,
      headerMaxW
    ),
    textX,
    36.5
  );

  y = 48;

  // 2. Score Summary & Pass/Fail KPI Box (dynamically wrapped)
  const kpiInnerW = contentW - 8;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  const kpiTopLines = doc.splitTextToSize(
    sanitizePdfText(
      `Total MCQs: ${totalQs} | Passed (Correct): ${passedCount} | Failed (Wrong): ${failedCount} | Score: ${attempt.percentage}% (Grade ${attempt.grade})`,
      true
    ),
    kpiInnerW
  );
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const kpiSubLines = doc.splitTextToSize(
    sanitizePdfText(
      `Marks Obtained: ${attempt.scoreMarks} / ${attempt.totalMarks} Marks | Passing Criteria: 60% (18/30 Correct MCQs) | Candidate: ${u.name}`,
      true
    ),
    kpiInnerW
  );
  const kpiBoxH = 7 + kpiTopLines.length * 4.8 + kpiSubLines.length * 4.3 + 4;

  doc.setFillColor(
    attempt.passed ? 240 : 254,
    attempt.passed ? 253 : 242,
    attempt.passed ? 244 : 242
  );
  doc.setDrawColor(
    attempt.passed ? 16 : 220,
    attempt.passed ? 185 : 38,
    attempt.passed ? 129 : 38
  );
  doc.roundedRect(margin, y, contentW, kpiBoxH, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 41, 30);
  doc.text(kpiTopLines, margin + 4, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  doc.text(kpiSubLines, margin + 4, y + 8 + kpiTopLines.length * 4.8 + 1.5);

  y += kpiBoxH + 6;

  // 3. Visual Performance Bar Graph inside the PDF
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, contentW, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Visual Performance Graph - ${u.name} (Pass vs Fail Breakdown)`,
      contentW - 8
    ),
    margin + 4,
    y + 7.5
  );

  const chartLeft = margin + 48;
  const chartMaxW = contentW - 68;
  const passRatio = Math.min(1, Math.max(0, passedCount / Math.max(1, totalQs)));
  const failRatio = Math.min(1, Math.max(0, failedCount / Math.max(1, totalQs)));
  const passBarW = Math.max(2, passRatio * chartMaxW);
  const failBarW = Math.max(2, failRatio * chartMaxW);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.6);
  doc.setTextColor(14, 159, 110);
  doc.text(`Passed / Correct (${passedCount}/${totalQs})`, margin + 4, y + 16);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 12, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(14, 159, 110);
  doc.roundedRect(chartLeft, y + 12, passBarW, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(15, 41, 30);
  doc.text(`${Math.round(passRatio * 100)}%`, chartLeft + chartMaxW + 3, y + 16);

  doc.setTextColor(220, 38, 38);
  doc.text(`Failed / Wrong (${failedCount}/${totalQs})`, margin + 4, y + 25);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 21, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(chartLeft, y + 21, failBarW, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(15, 41, 30);
  doc.text(`${Math.round(failRatio * 100)}%`, chartLeft + chartMaxW + 3, y + 25);

  doc.setTextColor(29, 78, 216);
  doc.text(`Overall Score (${attempt.percentage}%)`, margin + 4, y + 34);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 30, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(29, 78, 216);
  doc.roundedRect(
    chartLeft,
    y + 30,
    Math.max(2, Math.min(chartMaxW, (attempt.percentage / 100) * chartMaxW)),
    5.5,
    1.5,
    1.5,
    'F'
  );
  doc.setTextColor(15, 41, 30);
  doc.text(`Grade ${attempt.grade}`, chartLeft + chartMaxW + 3, y + 34);

  y += 49;

  // 4. Complete 30-Question Breakdown
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    `Complete ${questionsList.length}-MCQ Question-by-Question Audit & Answer Key:`,
    margin,
    y
  );
  y += 6;

  questionsList.forEach((q, idx) => {
    const userChoiceIdx =
      typeof ansMap[q.id] === 'number' ? ansMap[q.id] : undefined;
    const isCorrect = userChoiceIdx === q.correctAnswerIndex;
    const chosenText =
      userChoiceIdx !== undefined
        ? sanitizePdfText(q.options[userChoiceIdx] || 'Invalid Option', true)
        : 'Not Answered (Skipped)';

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    const qLines = doc.splitTextToSize(
      sanitizePdfText(`Q${idx + 1} [${q.subject}]: ${q.question}`, true),
      contentW
    );
    doc.setFontSize(8.2);
    const chosenLines = doc.splitTextToSize(
      `  Candidate Answer (${u.name}): ${chosenText} - [${
        isCorrect ? 'PASS / CORRECT [OK]' : 'FAIL / INCORRECT [X]'
      }]`,
      contentW - 4
    );
    const corrLines = doc.splitTextToSize(
      sanitizePdfText(
        `  Verified Correct Answer: ${q.options[q.correctAnswerIndex] || ''}`,
        true
      ),
      contentW - 4
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    const expLines = doc.splitTextToSize(
      sanitizePdfText(`  Explanation: ${q.explanation}`, true),
      contentW - 4
    );

    const neededH =
      qLines.length * 4 +
      chosenLines.length * 3.8 +
      corrLines.length * 3.8 +
      expLines.length * 3.7 +
      4;

    if (y + neededH > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 41, 30);
    doc.text(qLines, margin, y);
    y += qLines.length * 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    if (isCorrect) {
      doc.setTextColor(14, 159, 110);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.text(chosenLines, margin, y);
    y += chosenLines.length * 3.8;

    doc.setTextColor(14, 159, 110);
    doc.text(corrLines, margin, y);
    y += corrLines.length * 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(75, 85, 99);
    doc.text(expLines, margin, y);
    y += expLines.length * 3.7 + 2.8;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      fitPdfTextToWidth(
        doc,
        `Official Exam Assessment Report for ${u.name} (${u.email}) | Food Science Portal`,
        contentW - 24
      ),
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right'
    });
  }

  doc.save(
    `Food-Science-Portal-30MCQ-Exam-Report-${u.name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 22)}.pdf`
  );
}

/**
 * Generates an Official Personalized 30-Question Interview Preparation & Readiness Report PDF
 * in the User's Name with Visual Topic/Readiness Graph and all 30 Questions & Model Answers.
 */
export function downloadInterviewSessionReportPdf(
  userOrName: HubUser | string,
  questions: UnifiedInterviewQuestion[],
  preparedIds: string[] = [],
  sessionNumber = 1
): void {
  const u = extractUserDetails(userOrName);
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pageWidth - margin * 2;
  let y = 15;

  const preparedSet = new Set(preparedIds);
  const preparedInSession = questions.filter((q) =>
    preparedSet.has(q.id)
  ).length;
  const readinessPct = Math.round(
    (preparedInSession / Math.max(1, questions.length)) * 100
  );

  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 42, 'F');

  drawPdfBrandLogo(doc, 12, 8, 26, {
    borderColor: [255, 255, 255],
    bgFill: [255, 255, 255],
    roundedRadius: 3.5
  });

  drawPdfUserPhoto(doc, u.profilePicUrl, u.name, pageWidth - 36, 9, 24, {
    borderColor: [167, 243, 208],
    fallbackBgColor: [22, 163, 74],
    fallbackTextColor: [255, 255, 255]
  });

  const textX = 41;
  const headerMaxW = pageWidth - 39 - textX;
  doc.setTextColor(167, 243, 208);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text('Food Science Portal', textX, 11.5);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text(
    fitPdfTextToWidth(doc, 'PERSONALIZED 30-QUESTION INTERVIEW REPORT', headerMaxW),
    textX,
    18
  );

  doc.setFontSize(9.2);
  doc.setTextColor(167, 243, 208);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Specialist: ${u.name.toUpperCase()} | Session #${sessionNumber} (30 Q&As)`,
      headerMaxW
    ),
    textX,
    24.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(255, 255, 255);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Email: ${u.email} | Role: ${u.role} | Qualification: ${u.qualification}`,
      headerMaxW
    ),
    textX,
    30.5
  );
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Date: ${new Date().toLocaleDateString('en-PK')} | Standards: Food Safety, HACCP, ISO 9001, ISO 22000 & FSSC 22000`,
      headerMaxW
    ),
    textX,
    36.5
  );

  y = 48;

  // Topic distribution summary line (measure dynamically so box always fits)
  const topicCounts: Record<string, number> = {};
  questions.forEach((q) => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
  });
  const topicSummary = Object.entries(topicCounts)
    .map(([k, v]) => `${sanitizePdfText(k, true)}: ${v} Qs`)
    .join(' | ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  const topLines = doc.splitTextToSize(
    `Subject Breakdown in this 30-Q Session: ${topicSummary}`,
    contentW - 8
  );
  const graphBoxH = 24 + topLines.length * 4 + 3;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, contentW, graphBoxH, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Interview Readiness & Subject Coverage Graph - ${u.name}`,
      contentW - 8
    ),
    margin + 4,
    y + 7.5
  );

  const barLeft = margin + 52;
  const barMaxW = contentW - 72;

  doc.setFontSize(8.6);
  doc.setTextColor(14, 159, 110);
  doc.text(
    `Prepared Q&As (${preparedInSession}/${questions.length})`,
    margin + 4,
    y + 16
  );
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(barLeft, y + 12, barMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(14, 159, 110);
  doc.roundedRect(
    barLeft,
    y + 12,
    Math.max(3, Math.min(barMaxW, (readinessPct / 100) * barMaxW)),
    5.5,
    1.5,
    1.5,
    'F'
  );
  doc.setTextColor(15, 41, 30);
  doc.text(`${readinessPct}%`, barLeft + barMaxW + 3, y + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(55, 65, 81);
  doc.text(topLines, margin + 4, y + 24);

  y += graphBoxH + 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    fitPdfTextToWidth(
      doc,
      `Complete ${questions.length} Interview Questions & Expert Model Answers for ${u.name}:`,
      contentW
    ),
    margin,
    y
  );
  y += 6;

  questions.forEach((item, idx) => {
    const isPrepared = preparedSet.has(item.id);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    const qLines = doc.splitTextToSize(
      sanitizePdfText(
        `Q${idx + 1} [${item.topic}] ${isPrepared ? '(Prepared)' : ''}: ${item.question}`,
        true
      ),
      contentW
    );
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    const aLines = doc.splitTextToSize(
      sanitizePdfText(`Model Answer: ${item.answer}`, true),
      contentW - 2
    );
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    const kLines = doc.splitTextToSize(
      sanitizePdfText(`Key Interview Takeaway: ${item.keyTakeaway}`, true),
      contentW - 2
    );

    const neededH =
      qLines.length * 4.1 + aLines.length * 3.9 + kLines.length * 3.8 + 4;
    if (y + neededH > pageHeight - 16) {
      doc.addPage();
      y = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(19, 66, 43);
    doc.text(qLines, margin, y);
    y += qLines.length * 4.1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(31, 41, 55);
    doc.text(aLines, margin + 2, y);
    y += aLines.length * 3.9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(14, 159, 110);
    doc.text(kLines, margin + 2, y);
    y += kLines.length * 3.8 + 3;
  });

  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(107, 114, 128);
    doc.text(
      fitPdfTextToWidth(
        doc,
        `Official Interview Preparation Report for ${u.name} (${u.email}) | Food Science Portal`,
        contentW - 24
      ),
      margin,
      pageHeight - 8
    );
    doc.text(`Page ${p} of ${totalPages}`, pageWidth - margin, pageHeight - 8, {
      align: 'right'
    });
  }

  doc.save(
    `Food-Science-Portal-30Q-Interview-Report-${u.name
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 22)}.pdf`
  );
}

// Keep backward-compatible export for any legacy callers
export function downloadInterviewSetPdf(
  userOrName: HubUser | string,
  interviewSet: InterviewPrepSet
): void {
  const mapped: UnifiedInterviewQuestion[] = interviewSet.questions.map(
    (q, idx) => ({
      id: q.id,
      globalNumber: idx + 1,
      topic: q.topic,
      question: q.question,
      answer: q.answer,
      keyTakeaway: q.keyTakeaway
    })
  );
  downloadInterviewSessionReportPdf(
    userOrName,
    mapped,
    [],
    interviewSet.setNumber
  );
}
