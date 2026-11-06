import { jsPDF } from 'jspdf';
import {
  NutritionProfileData,
  UserExamAttempt
} from '../types/hub';
import {
  ComputedNutritionMetrics,
  ExamPrepSet
} from '../data/examPrepData';
import { InterviewPrepSet } from '../data/interviewPrepData';

export function downloadNutritionReportPdf(
  userName: string,
  nutrition: NutritionProfileData,
  metrics: ComputedNutritionMetrics
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 16;

  // Top Emerald Header Banner
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('FS PORTAL — PERSONAL NUTRITION & HEALTH REPORT', margin, 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(
    `Specialist: ${userName || 'Food Specialist'}   |   Date: ${new Date().toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}   |   Verified Nutrition Assessment`,
    margin,
    22
  );
  doc.text(
    `Height: ${nutrition.heightCm} cm   |   Current Weight: ${nutrition.weightKg} kg   |   Target Weight: ${nutrition.targetWeightKg} kg   |   Age: ${nutrition.age} yrs (${nutrition.gender.toUpperCase()})`,
    margin,
    28.5
  );

  y = 42;

  // Section 1: BMI & Weight Recommendation Box
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(16, 185, 129);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 34, 3, 3, 'FD');

  doc.setTextColor(15, 41, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(
    `1. BMI & Clinical Weight Verdict: BMI ${metrics.bmi} kg/m² (${metrics.bmiCategory})`,
    margin + 4,
    y + 8
  );

  doc.setFontSize(10.5);
  doc.setTextColor(14, 159, 110);
  doc.text(
    `Action Required: ${metrics.weightAction} — ${metrics.recommendationHeadline}`,
    margin + 4,
    y + 15.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  const recLines = doc.splitTextToSize(
    metrics.recommendationDetail,
    pageWidth - margin * 2 - 8
  );
  doc.text(recLines, margin + 4, y + 22);

  y += 40;

  // Section 2: Daily Energy & Macronutrient Targets
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(19, 66, 43);
  doc.text('2. Daily Calorie & Macronutrient Targets vs. Logged Intake', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(31, 41, 55);
  doc.text(
    `• Basal Metabolic Rate (BMR): ${metrics.bmrKcal} kcal/day   |   Maintenance TDEE: ${metrics.tdeeKcal} kcal/day`,
    margin + 2,
    y
  );
  y += 5.5;
  doc.text(
    `• Recommended Daily Target (${metrics.weightAction}): ${metrics.dailyTargetKcal} kcal/day   |   Logged Today: ${metrics.consumedKcal} kcal`,
    margin + 2,
    y
  );
  y += 5.5;
  doc.text(
    `• Protein Target: ${metrics.targetProteinG}g (Logged: ${metrics.consumedProteinG}g)   |   Carbs Target: ${metrics.targetCarbsG}g (Logged: ${metrics.consumedCarbsG}g)   |   Fats Target: ${metrics.targetFatsG}g (Logged: ${metrics.consumedFatsG}g)`,
    margin + 2,
    y
  );
  y += 5.5;
  doc.text(
    `• Hydration Logged Today: ${nutrition.waterGlassesToday || 0} / 8 Glasses (${(nutrition.waterGlassesToday || 0) * 250} mL)`,
    margin + 2,
    y
  );
  y += 9;

  // Section 3: Weight Trajectory History
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(19, 66, 43);
  doc.text('3. Weight & BMI Progress Log', margin, y);
  y += 5.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(55, 65, 81);
  const historyStr = (nutrition.weightHistory || [])
    .map((h) => `${h.date}: ${h.weightKg} kg (BMI ${h.bmi})`)
    .join('   ->   ');
  const histLines = doc.splitTextToSize(
    historyStr || `Current: ${nutrition.weightKg} kg (BMI ${metrics.bmi})`,
    pageWidth - margin * 2
  );
  doc.text(histLines, margin + 2, y);
  y += histLines.length * 5 + 4;

  // Section 4: Logged Daily Meals
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(19, 66, 43);
  doc.text('4. Logged Daily Meals & Calorie Breakdown', margin, y);
  y += 6;

  if (!nutrition.mealLogs || nutrition.mealLogs.length === 0) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9);
    doc.text('No meals logged yet for today.', margin + 2, y);
    y += 7;
  } else {
    nutrition.mealLogs.forEach((meal, idx) => {
      if (y > pageHeight - 25) {
        doc.addPage();
        y = 18;
      }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(15, 41, 30);
      doc.text(
        `${idx + 1}. [${meal.mealType}] ${meal.foodName} (${meal.portion})`,
        margin + 2,
        y
      );
      y += 4.5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(75, 85, 99);
      doc.text(
        `   Calories: ${meal.calories} kcal   |   Protein: ${meal.proteinG}g   |   Carbs: ${meal.carbsG}g   |   Fats: ${meal.fatsG}g`,
        margin + 2,
        y
      );
      y += 5.5;
    });
  }

  y += 3;

  // Section 5: Personalized Meal Plan
  if (y > pageHeight - 45) {
    doc.addPage();
    y = 18;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(19, 66, 43);
  doc.text('5. Recommended Daily Meal Plan Schedule', margin, y);
  y += 6;

  (nutrition.mealPlans || []).forEach((plan) => {
    if (y > pageHeight - 36) {
      doc.addPage();
      y = 18;
    }
    const totalDayKcal =
      (plan.breakfastKcal || 0) +
      (plan.lunchKcal || 0) +
      (plan.snackKcal || 0) +
      (plan.dinnerKcal || 0);

    doc.setFillColor(246, 251, 248);
    doc.setDrawColor(184, 216, 196);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 27, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(19, 66, 43);
    doc.text(`${plan.day} (Total Plan: ${totalDayKcal} kcal)`, margin + 3, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.2);
    doc.setTextColor(31, 41, 55);
    doc.text(
      `• Breakfast (${plan.breakfastKcal} kcal): ${plan.breakfast.slice(0, 85)}`,
      margin + 3,
      y + 11
    );
    doc.text(
      `• Lunch (${plan.lunchKcal} kcal): ${plan.lunch.slice(0, 88)}`,
      margin + 3,
      y + 15.8
    );
    doc.text(
      `• Snack (${plan.snackKcal} kcal): ${plan.snack.slice(0, 88)}`,
      margin + 3,
      y + 20.5
    );
    doc.text(
      `• Dinner (${plan.dinnerKcal} kcal): ${plan.dinner.slice(0, 88)}`,
      margin + 3,
      y + 25
    );

    y += 31;
  });

  // Footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(107, 114, 128);
  doc.text(
    'Generated by FS Portal — Food Specialists Personal Health & Nutrition Tracker | Developed by Food Specialist',
    margin,
    pageHeight - 8
  );

  doc.save(
    `FS-Portal-Nutrition-Health-Report-${(userName || 'Specialist')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 25)}.pdf`
  );
}

export function downloadExamReportPdf(
  userName: string,
  attempt: UserExamAttempt,
  examSet: ExamPrepSet,
  selectedAnswers?: Record<string, number>
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 16;

  // Header
  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 34, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('FS PORTAL — OFFICIAL EXAM PREPARATION TRANSCRIPT', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Exam Title: ${examSet.title}`, margin, 20.5);
  doc.text(
    `Candidate: ${userName || 'Food Specialist'}   |   Date: ${new Date(
      attempt.completedAt || Date.now()
    ).toLocaleDateString('en-PK', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })}   |   Subject: ${examSet.subjectArea}`,
    margin,
    27.5
  );

  y = 41;

  // Score Summary Box
  doc.setFillColor(attempt.passed ? 240 : 254, attempt.passed ? 253 : 242, attempt.passed ? 244 : 242);
  doc.setDrawColor(attempt.passed ? 16 : 220, attempt.passed ? 185 : 38, attempt.passed ? 129 : 38);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(15, 41, 30);
  doc.text(
    `Marks Obtained: ${attempt.scoreMarks} / ${attempt.totalMarks} (${attempt.percentage}%)   •   Grade: ${attempt.grade}   •   Status: ${
      attempt.passed ? 'PASSED (QUALIFIED)' : 'NEEDS REVISION'
    }`,
    margin + 4,
    y + 9.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(55, 65, 81);
  doc.text(
    `Correct Answers: ${attempt.correctCount} out of ${attempt.totalQuestions} MCQs (2 Marks per Question • Passing Criteria: 60%)`,
    margin + 4,
    y + 17.5
  );

  y += 31;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(19, 66, 43);
  doc.text(
    'Complete 50-MCQ Answer Key, Candidate Response & Technical Explanations:',
    margin,
    y
  );
  y += 6;

  examSet.questions.forEach((q) => {
    if (y > pageHeight - 34) {
      doc.addPage();
      y = 16;
    }

    const userChoiceIdx =
      selectedAnswers && typeof selectedAnswers[q.id] === 'number'
        ? selectedAnswers[q.id]
        : undefined;
    const isCorrect =
      userChoiceIdx === undefined || userChoiceIdx === q.correctIndex;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.8);
    doc.setTextColor(15, 41, 30);
    const qLines = doc.splitTextToSize(
      `Q${q.qNum} [${q.category} — ${q.marks} Marks]: ${q.question}`,
      pageWidth - margin * 2
    );
    doc.text(qLines, margin, y);
    y += qLines.length * 4.1;

    if (userChoiceIdx !== undefined) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      if (isCorrect) {
        doc.setTextColor(14, 159, 110);
      } else {
        doc.setTextColor(220, 38, 38);
      }
      const userAnsText = q.options[userChoiceIdx] || 'Not Answered';
      doc.text(
        `   Your Answer: ${userAnsText} ${isCorrect ? '[CORRECT +2 Marks]' : '[INCORRECT 0 Marks]'}`,
        margin,
        y
      );
      y += 4;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(14, 159, 110);
    const corrLines = doc.splitTextToSize(
      `   Correct Answer: ${q.options[q.correctIndex]}`,
      pageWidth - margin * 2 - 4
    );
    doc.text(corrLines, margin, y);
    y += corrLines.length * 3.9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(75, 85, 99);
    const expLines = doc.splitTextToSize(
      `   Explanation: ${q.explanation}`,
      pageWidth - margin * 2 - 4
    );
    doc.text(expLines, margin, y);
    y += expLines.length * 3.8 + 2.5;
  });

  doc.save(
    `FS-Portal-Exam-Report-Set-${examSet.setNumber}-${(userName || 'Specialist')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 20)}.pdf`
  );
}

export function downloadInterviewSetPdf(
  userName: string,
  interviewSet: InterviewPrepSet
): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 16;

  doc.setFillColor(19, 66, 43);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('FS PORTAL — INTERVIEW PREPARATION MASTER GUIDE', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(interviewSet.title, margin, 20);
  doc.text(
    `Prepared for: ${userName || 'Food Specialist'}   |   20 Verified Questions & Model Answers`,
    margin,
    26.5
  );

  y = 39;

  interviewSet.questions.forEach((item) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 16;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(19, 66, 43);
    const qLines = doc.splitTextToSize(
      `Q${item.questionNumber} [${item.topic}]: ${item.question}`,
      pageWidth - margin * 2
    );
    doc.text(qLines, margin, y);
    y += qLines.length * 4.3;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.6);
    doc.setTextColor(31, 41, 55);
    const aLines = doc.splitTextToSize(
      `Answer: ${item.answer}`,
      pageWidth - margin * 2 - 2
    );
    doc.text(aLines, margin + 2, y);
    y += aLines.length * 4;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(14, 159, 110);
    const kLines = doc.splitTextToSize(
      `Key Interview Takeaway: ${item.keyTakeaway}`,
      pageWidth - margin * 2 - 2
    );
    doc.text(kLines, margin + 2, y);
    y += kLines.length * 4 + 3.5;
  });

  doc.save(
    `FS-Portal-Interview-Prep-Set-${interviewSet.setNumber}-${(userName || 'Specialist')
      .replace(/[^a-zA-Z0-9]/g, '-')
      .slice(0, 20)}.pdf`
  );
}
