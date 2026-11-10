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

function extractUserDetails(userOrName: HubUser | string) {
  if (typeof userOrName === 'string') {
    return {
      name: userOrName || 'Food Specialist',
      email: 'Verified Member',
      phone: '',
      role: 'Food Safety & Quality Specialist',
      qualification: 'Food Science & Technology',
      location: 'Pakistan'
    };
  }
  return {
    name: userOrName.name?.trim() || 'Food Specialist',
    email: userOrName.email?.trim() || 'Verified Member',
    phone: userOrName.phone?.trim() || '',
    role:
      userOrName.title?.trim() ||
      userOrName.currentRole?.trim() ||
      'Food Safety & Quality Specialist',
    qualification:
      userOrName.qualification?.trim() || 'Food Science & Technology',
    location: userOrName.location?.trim() || 'Pakistan'
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
  let y = 16;

  // Top Emerald Header Banner
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 36, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15.5);
  doc.text('FOODIFYY — PERSONAL NUTRITION & BMI HEALTH REPORT', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Specialist: ${u.name}   |   Role: ${u.role}   |   Email: ${u.email}`,
    margin,
    20.5
  );
  doc.text(
    `Height: ${nutrition.heightCm} cm   |   Current Weight: ${nutrition.weightKg} kg   |   Target Weight: ${nutrition.targetWeightKg} kg   |   Age: ${nutrition.age} yrs (${nutrition.gender.toUpperCase()})   |   Date: ${new Date().toLocaleDateString('en-PK')}`,
    margin,
    27.5
  );

  y = 43;

  // Section 1: BMI & Weight Recommendation Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 3, 3, 'FD');

  doc.setTextColor(15, 41, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.text(
    `1. BMI & Clinical Weight Verdict: BMI ${metrics.bmi} kg/m² (${metrics.bmiCategory}) — ${metrics.weightAction}`,
    margin + 4,
    y + 8
  );

  doc.setFontSize(10);
  doc.setTextColor(14, 159, 110);
  doc.text(`Verdict: ${metrics.recommendationHeadline}`, margin + 4, y + 15);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(55, 65, 81);
  const recLines = doc.splitTextToSize(
    metrics.recommendationDetail,
    pageWidth - margin * 2 - 8
  );
  doc.text(recLines, margin + 4, y + 21);

  y += 40;

  // Section 2: Daily Energy & Macronutrient Targets
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 27, 3, 3, 'FD');

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
  doc.text(
    `• BMR: ${metrics.bmrKcal} kcal/day   |   Maintenance TDEE: ${metrics.tdeeKcal} kcal/day   |   Daily Target: ${metrics.dailyTargetKcal} kcal/day`,
    margin + 4,
    y + 14.5
  );
  doc.text(
    `• Macro Targets: Protein ${metrics.targetProteinG}g   |   Carbs ${metrics.targetCarbsG}g   |   Fats ${metrics.targetFatsG}g   |   Logged Today: ${metrics.consumedKcal} kcal (${nutrition.waterGlassesToday}/8 glasses water)`,
    margin + 4,
    y + 21.5
  );

  y += 34;

  // Section 3: Weight Trajectory Visual Bar Chart inside PDF
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
  doc.roundedRect(margin, y, pageWidth - margin * 2, 28, 2.5, 2.5, 'FD');

  const maxScaleKg = Math.max(
    110,
    nutrition.weightKg + 15,
    nutrition.targetWeightKg + 15
  );
  const barMaxW = pageWidth - margin * 2 - 55;

  const curW = Math.max(10, (nutrition.weightKg / maxScaleKg) * barMaxW);
  const tarW = Math.max(10, (nutrition.targetWeightKg / maxScaleKg) * barMaxW);
  const idlW = Math.max(10, (metrics.idealMidKg / maxScaleKg) * barMaxW);

  doc.setFontSize(8.5);
  doc.setTextColor(15, 41, 30);
  doc.text(`Current (${nutrition.weightKg} kg)`, margin + 3, y + 8);
  doc.setFillColor(234, 88, 12);
  doc.roundedRect(margin + 38, y + 4.5, curW, 4.5, 1, 1, 'F');

  doc.text(`Target Goal (${nutrition.targetWeightKg} kg)`, margin + 3, y + 16);
  doc.setFillColor(14, 159, 110);
  doc.roundedRect(margin + 38, y + 12.5, tarW, 4.5, 1, 1, 'F');

  doc.text(`WHO Ideal (${metrics.idealMidKg} kg)`, margin + 3, y + 24);
  doc.setFillColor(37, 99, 235);
  doc.roundedRect(margin + 38, y + 20.5, idlW, 4.5, 1, 1, 'F');

  y += 35;

  // Section 4: Logged Meals
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
    y += 10;
  } else {
    nutrition.mealLogs.slice(0, 10).forEach((meal, idx) => {
      if (y > pageHeight - 28) {
        doc.addPage();
        y = 18;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.8);
      doc.setTextColor(15, 41, 30);
      doc.text(
        `${idx + 1}. [${meal.mealType}] ${meal.foodName} (${meal.portion}) — ${meal.calories} kcal (P: ${meal.proteinG}g, C: ${meal.carbsG}g, F: ${meal.fatsG}g)`,
        margin + 2,
        y
      );
      y += 5.5;
    });
  }

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Official Personalized Nutrition Report for ${u.name} | Generated via Foodifyy — Developed by Food Specialist`,
    margin,
    pageHeight - 8
  );

  doc.save(
    `Foodifyy-Nutrition-Report-${u.name
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
  let y = 15;

  // Resolve the 30 questions for this attempt
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

  // 1. Top Emerald Official Transcript Header with Candidate Profile Details
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text(
    'FOODIFYY — OFFICIAL 30-MCQ EXAM ASSESSMENT REPORT',
    margin,
    12
  );

  doc.setFontSize(10.5);
  doc.setTextColor(167, 243, 208);
  doc.text(
    `Candidate Name: ${u.name.toUpperCase()}   |   Verdict: ${
      attempt.passed ? 'PASSED (QUALIFIED)' : 'NEEDS REVISION (FAILED)'
    } (${attempt.percentage}%)`,
    margin,
    19.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Email: ${u.email}   |   Role: ${u.role}   |   Qualification: ${u.qualification}`,
    margin,
    26.5
  );
  doc.text(
    `Session: ${attempt.setTitle || '30-MCQ Randomized Specialist Exam'}   |   Date: ${new Date(
      attempt.completedAt || Date.now()
    ).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}   |   Question Bank: 2,000 Verified MCQs`,
    margin,
    33.5
  );

  y = 46;

  // 2. Score Summary & Pass/Fail KPI Box
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
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 41, 30);
  doc.text(
    `Total MCQs: ${totalQs}   •   Passed (Correct): ${passedCount}   •   Failed (Wrong): ${failedCount}   •   Score: ${attempt.percentage}% (Grade ${attempt.grade})`,
    margin + 4,
    y + 9
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.2);
  doc.setTextColor(55, 65, 81);
  doc.text(
    `Marks Obtained: ${attempt.scoreMarks} / ${attempt.totalMarks} Marks   |   Passing Criteria: 60% (18/30 Correct MCQs)   |   Candidate: ${u.name}`,
    margin + 4,
    y + 17
  );

  y += 30;

  // 3. Visual Performance Bar Graph inside the PDF
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 42, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    `Visual Performance Graph — ${u.name} (Pass vs Fail Breakdown)`,
    margin + 4,
    y + 7.5
  );

  const chartLeft = margin + 48;
  const chartMaxW = pageWidth - margin * 2 - 68;
  const passRatio = Math.min(1, Math.max(0, passedCount / Math.max(1, totalQs)));
  const failRatio = Math.min(1, Math.max(0, failedCount / Math.max(1, totalQs)));
  const passBarW = Math.max(2, passRatio * chartMaxW);
  const failBarW = Math.max(2, failRatio * chartMaxW);

  // Row 1: Passed / Correct Bar
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(14, 159, 110);
  doc.text(`Passed / Correct (${passedCount}/${totalQs})`, margin + 4, y + 16);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 12, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(14, 159, 110);
  doc.roundedRect(chartLeft, y + 12, passBarW, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(15, 41, 30);
  doc.text(
    `${Math.round(passRatio * 100)}%`,
    chartLeft + chartMaxW + 3,
    y + 16
  );

  // Row 2: Failed / Wrong Bar
  doc.setTextColor(220, 38, 38);
  doc.text(`Failed / Wrong (${failedCount}/${totalQs})`, margin + 4, y + 25);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 21, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(chartLeft, y + 21, failBarW, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(15, 41, 30);
  doc.text(
    `${Math.round(failRatio * 100)}%`,
    chartLeft + chartMaxW + 3,
    y + 25
  );

  // Row 3: Overall Percentage vs 60% Benchmark
  doc.setTextColor(29, 78, 216);
  doc.text(`Overall Score (${attempt.percentage}%)`, margin + 4, y + 34);
  doc.setFillColor(226, 232, 240);
  doc.roundedRect(chartLeft, y + 30, chartMaxW, 5.5, 1.5, 1.5, 'F');
  doc.setFillColor(29, 78, 216);
  doc.roundedRect(
    chartLeft,
    y + 30,
    Math.max(2, (attempt.percentage / 100) * chartMaxW),
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
    if (y > pageHeight - 36) {
      doc.addPage();
      y = 16;
    }

    const userChoiceIdx =
      typeof ansMap[q.id] === 'number' ? ansMap[q.id] : undefined;
    const isCorrect = userChoiceIdx === q.correctAnswerIndex;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 41, 30);
    const qLines = doc.splitTextToSize(
      `Q${idx + 1} [${q.subject}]: ${q.question}`,
      pageWidth - margin * 2
    );
    doc.text(qLines, margin, y);
    y += qLines.length * 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    if (isCorrect) {
      doc.setTextColor(14, 159, 110);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    const chosenText =
      userChoiceIdx !== undefined
        ? q.options[userChoiceIdx] || 'Invalid Option'
        : 'Not Answered (Skipped)';
    const chosenLines = doc.splitTextToSize(
      `   Candidate Answer (${u.name}): ${chosenText} — [${
        isCorrect ? 'PASS / CORRECT ✓' : 'FAIL / INCORRECT ✗'
      }]`,
      pageWidth - margin * 2 - 4
    );
    doc.text(chosenLines, margin, y);
    y += chosenLines.length * 3.8;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(14, 159, 110);
    const corrLines = doc.splitTextToSize(
      `   Verified Correct Answer: ${q.options[q.correctAnswerIndex]}`,
      pageWidth - margin * 2 - 4
    );
    doc.text(corrLines, margin, y);
    y += corrLines.length * 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.9);
    doc.setTextColor(75, 85, 99);
    const expLines = doc.splitTextToSize(
      `   Explanation: ${q.explanation}`,
      pageWidth - margin * 2 - 4
    );
    doc.text(expLines, margin, y);
    y += expLines.length * 3.7 + 2.8;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Official Exam Assessment Report for ${u.name} (${u.email}) | Foodifyy — Developed by Food Specialist`,
    margin,
    pageHeight - 8
  );

  doc.save(
    `Foodifyy-30MCQ-Exam-Report-${u.name
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
  let y = 15;

  const preparedSet = new Set(preparedIds);
  const preparedInSession = questions.filter((q) =>
    preparedSet.has(q.id)
  ).length;
  const readinessPct = Math.round(
    (preparedInSession / Math.max(1, questions.length)) * 100
  );

  // Header
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14.5);
  doc.text(
    'FOODIFYY — PERSONALIZED 30-QUESTION INTERVIEW REPORT',
    margin,
    12
  );

  doc.setFontSize(10);
  doc.setTextColor(167, 243, 208);
  doc.text(
    `Specialist Name: ${u.name.toUpperCase()}   |   Session #${sessionNumber} (30 Unique Q&As from 2,000-Question Bank)`,
    margin,
    19.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.8);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Email: ${u.email}   |   Role: ${u.role}   |   Qualification: ${u.qualification}`,
    margin,
    26.5
  );
  doc.text(
    `Date: ${new Date().toLocaleDateString('en-PK')}   |   Standards Covered: Food Safety, HACCP, ISO 9001, ISO 22000, FSSC 22000 & Food Science`,
    margin,
    33
  );

  y = 44;

  // Visual Topic & Readiness Graph Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 227, 214);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    `Interview Readiness & Subject Coverage Graph — ${u.name}`,
    margin + 4,
    y + 7.5
  );

  const barLeft = margin + 52;
  const barMaxW = pageWidth - margin * 2 - 72;

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
    Math.max(3, (readinessPct / 100) * barMaxW),
    5.5,
    1.5,
    1.5,
    'F'
  );
  doc.setTextColor(15, 41, 30);
  doc.text(`${readinessPct}%`, barLeft + barMaxW + 3, y + 16);

  // Topic distribution summary line
  const topicCounts: Record<string, number> = {};
  questions.forEach((q) => {
    topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
  });
  const topicSummary = Object.entries(topicCounts)
    .map(([k, v]) => `${k}: ${v} Qs`)
    .join('  •  ');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(55, 65, 81);
  const topLines = doc.splitTextToSize(
    `Subject Breakdown in this 30-Q Session: ${topicSummary}`,
    pageWidth - margin * 2 - 8
  );
  doc.text(topLines, margin + 4, y + 24.5);

  y += 40;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(19, 66, 43);
  doc.text(
    `Complete 30 Interview Questions & Expert Model Answers for ${u.name}:`,
    margin,
    y
  );
  y += 6;

  questions.forEach((item, idx) => {
    if (y > pageHeight - 38) {
      doc.addPage();
      y = 16;
    }

    const isPrepared = preparedSet.has(item.id);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.2);
    doc.setTextColor(19, 66, 43);
    const qLines = doc.splitTextToSize(
      `Q${idx + 1} [${item.topic}] ${isPrepared ? '(✓ Prepared)' : ''}: ${item.question}`,
      pageWidth - margin * 2
    );
    doc.text(qLines, margin, y);
    y += qLines.length * 4.1;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.4);
    doc.setTextColor(31, 41, 55);
    const aLines = doc.splitTextToSize(
      `Model Answer: ${item.answer}`,
      pageWidth - margin * 2 - 2
    );
    doc.text(aLines, margin + 2, y);
    y += aLines.length * 3.9;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(14, 159, 110);
    const kLines = doc.splitTextToSize(
      `Key Interview Takeaway: ${item.keyTakeaway}`,
      pageWidth - margin * 2 - 2
    );
    doc.text(kLines, margin + 2, y);
    y += kLines.length * 3.8 + 3;
  });

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Official Interview Preparation Report for ${u.name} (${u.email}) | Foodifyy — Developed by Food Specialist`,
    margin,
    pageHeight - 8
  );

  doc.save(
    `Foodifyy-30Q-Interview-Report-${u.name
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
