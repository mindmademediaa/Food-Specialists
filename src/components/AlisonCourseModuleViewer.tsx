import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  HelpCircle,
  LayoutGrid,
  Lightbulb,
  Presentation
} from 'lucide-react';
import {
  CoursePresentationSlide,
  CourseStudyModule,
  InternationalTrainingCourse
} from '../data/internationalTrainingsData';

interface AlisonCourseModuleViewerProps {
  course: InternationalTrainingCourse;
  module: CourseStudyModule;
  moduleIndex: number;
  totalModules: number;
  isCompleted: boolean;
  onSelectprev: () => void;
  onCompleteAndNext: () => void;
  onCompleteAndStartExam: () => void;
}

/**
 * Builds a clean, simple Slide Deck from `module.presentationSlides` if provided,
 * or automatically converts any custom module's overview, keyPrinciples, parameters,
 * and checklist into straightforward presentation slides.
 */
function getModulePresentationSlides(
  course: InternationalTrainingCourse,
  mod: CourseStudyModule
): CoursePresentationSlide[] {
  if (mod.presentationSlides && mod.presentationSlides.length > 0) {
    return mod.presentationSlides;
  }

  const generated: CoursePresentationSlide[] = [
    {
      slideNumber: 1,
      title: `Introduction: ${mod.title}`,
      subtitle: `${course.title} · Module ${mod.moduleNumber}`,
      bulletPoints: [
        mod.overview,
        ...(mod.internationalClauses || []).map(
          (cl) => `Standard / Guideline Covered: ${cl}`
        )
      ],
      keyTakeaway:
        mod.keyPrinciples[0] ||
        `Understand the core operational rules for ${mod.title}.`
    }
  ];

  mod.keyPrinciples.forEach((principle, idx) => {
    generated.push({
      slideNumber: generated.length + 1,
      title: `Key Topic ${idx + 1} — ${mod.title}`,
      subtitle: `Core Operational Rule ${idx + 1} of ${mod.keyPrinciples.length}`,
      bulletPoints: principle
        .split(/(?<=\.)\s+/)
        .map((s) => s.trim())
        .filter(Boolean),
      keyTakeaway: principle
    });
  });

  if (mod.criticalControlParameters && mod.criticalControlParameters.length > 0) {
    generated.push({
      slideNumber: generated.length + 1,
      title: 'Important Standards & Limits to Remember',
      subtitle: 'Key Rules & Corrective Actions for Daily Work',
      bulletPoints: mod.criticalControlParameters.map(
        (ccp) =>
          `${ccp.parameter}: Standard Limit = ${ccp.standardLimit}. Action if not met: ${ccp.correctiveProtocol}`
      ),
      keyTakeaway:
        'Always check these limits daily and take immediate corrective action if any reading is out of range.'
    });
  }

  if (mod.practicalChecklist && mod.practicalChecklist.length > 0) {
    generated.push({
      slideNumber: generated.length + 1,
      title: 'Daily Practical Manager Checklist',
      subtitle: 'Simple Action Steps for Your Shift',
      bulletPoints: mod.practicalChecklist,
      keyTakeaway: `Complete all checklist steps in Module ${mod.moduleNumber} before moving to the next module.`
    });
  }

  return generated;
}

export const AlisonCourseModuleViewer: React.FC<AlisonCourseModuleViewerProps> = ({
  course,
  module,
  moduleIndex,
  totalModules,
  isCompleted,
  onSelectprev,
  onCompleteAndNext,
  onCompleteAndStartExam
}) => {
  const slides = useMemo(
    () => getModulePresentationSlides(course, module),
    [course, module]
  );

  const [currentSlideIdx, setCurrentSlideIdx] = useState<number>(0);
  const [presentationMode, setPresentationMode] = useState<'slides' | 'all'>('slides');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);

  // Reset slide to 1 when user switches modules
  useEffect(() => {
    setCurrentSlideIdx(0);
    setSelectedQuizOption(null);
  }, [module.id]);

  // Keyboard Left / Right arrow navigation for presentation slides
  useEffect(() => {
    if (presentationMode !== 'slides') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'ArrowRight') {
        setCurrentSlideIdx((prev) => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setCurrentSlideIdx((prev) => Math.max(0, prev - 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [presentationMode, slides.length]);

  const activeSlide = slides[currentSlideIdx] || slides[0];
  const totalSlides = slides.length;
  const isFirstSlide = currentSlideIdx === 0;
  const isLastSlide = currentSlideIdx === totalSlides - 1;
  const slideProgressPct = Math.round(((currentSlideIdx + 1) / totalSlides) * 100);

  // Simple 1-question self-check at the end of each module
  const ccp0 = module.criticalControlParameters[0];
  const quickCheckQuiz = useMemo(() => {
    if (ccp0) {
      return {
        question: `Quick Check (Module ${module.moduleNumber}): What is the required standard rule for "${ccp0.parameter}"?`,
        options: [
          ccp0.standardLimit,
          'No check is required during busy hours',
          'Ignore the rule unless an inspector visits',
          'Check only once a year'
        ] as [string, string, string, string],
        correctIndex: 0,
        explanation: `Correct! ${ccp0.parameter} must follow: ${ccp0.standardLimit}. Action: ${ccp0.correctiveProtocol}`
      };
    }
    const lastSlide = slides[slides.length - 1];
    return {
      question: `Quick Check (Module ${module.moduleNumber}): Which statement is correct regarding "${module.title}"?`,
      options: [
        lastSlide?.keyTakeaway || module.keyPrinciples[0] || 'Follow daily food safety and dietary checks.',
        'Skip daily temperature and hygiene checks',
        'Deliver patient trays without checking the diet ticket',
        'Store raw chicken above cooked food'
      ] as [string, string, string, string],
      correctIndex: 0,
      explanation: lastSlide?.keyTakeaway || 'Always follow the standard operating procedures covered in this module.'
    };
  }, [ccp0, module.moduleNumber, module.title, module.keyPrinciples, slides]);

  return (
    <div className="space-y-4">
      {/* 1. SIMPLE PRESENTATION HEADER & VIEW TOGGLE */}
      <div className="rounded-2xl border border-[#D2DEEA] bg-gradient-to-r from-[#1A2138] via-[#105E9A] to-[#1673B8] text-white p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider">
              <Presentation className="w-3.5 h-3.5" />
              Module {module.moduleNumber} of {totalModules} · Presentation Deck
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white/15 text-white text-xs font-bold">
              {totalSlides} Simple Slides
            </span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 text-xs font-black">
                <CheckCircle2 className="w-3.5 h-3.5" /> Completed
              </span>
            )}
          </div>

          {/* Toggle between Slide-by-Slide Presentation vs All Slides View */}
          <div className="flex items-center gap-1.5 bg-[#1A2138]/50 p-1 rounded-xl border border-white/15">
            <button
              type="button"
              onClick={() => setPresentationMode('slides')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                presentationMode === 'slides'
                  ? 'bg-white text-[#1A2138] shadow-xs'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              Slide-by-Slide View
            </button>
            <button
              type="button"
              onClick={() => setPresentationMode('all')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition cursor-pointer ${
                presentationMode === 'all'
                  ? 'bg-white text-[#1A2138] shadow-xs'
                  : 'text-white/85 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Read All {totalSlides} Slides
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg sm:text-xl font-black leading-snug">
            Module {module.moduleNumber}: {module.title}
          </h3>
          <p className="text-xs sm:text-sm text-[#EBF4FC]/95 mt-1 leading-relaxed">
            {module.overview}
          </p>
        </div>

        {/* Slide Progress Bar & Quick Slide Number Selector */}
        {presentationMode === 'slides' && (
          <div className="pt-2 border-t border-white/15 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-amber-300">
                Viewing Slide {currentSlideIdx + 1} of {totalSlides}: {activeSlide.title}
              </span>
              <span className="text-white">{slideProgressPct}% of Module</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-amber-400 transition-all duration-300"
                style={{ width: `${slideProgressPct}%` }}
              />
            </div>

            {/* Numbered Slide Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] font-bold text-[#DCE9F6] mr-1">
                Go to Slide:
              </span>
              {slides.map((sl, sIdx) => {
                const isActive = sIdx === currentSlideIdx;
                const isSeen = sIdx < currentSlideIdx;
                return (
                  <button
                    key={sl.slideNumber}
                    type="button"
                    onClick={() => setCurrentSlideIdx(sIdx)}
                    title={`Slide ${sl.slideNumber}: ${sl.title}`}
                    className={`w-7 h-7 rounded-lg text-xs font-black transition cursor-pointer flex items-center justify-center ${
                      isActive
                        ? 'bg-amber-400 text-slate-950 shadow-xs scale-105'
                        : isSeen
                        ? 'bg-white/25 text-white hover:bg-white/35'
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {sl.slideNumber}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 2A. MODE 1: INTERACTIVE SLIDE-BY-SLIDE PRESENTATION VIEW */}
      {presentationMode === 'slides' && activeSlide && (
        <div className="rounded-2xl border-2 border-[#1673B8]/30 bg-white shadow-md overflow-hidden">
          {/* Slide Top Banner */}
          <div className="bg-[#F0F6FC] border-b border-[#D2DEEA] px-5 py-4 sm:px-7 sm:py-5 flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#1673B8] text-white text-[11px] font-black uppercase tracking-wider">
                  Slide {activeSlide.slideNumber} of {totalSlides}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Module {module.moduleNumber} · {course.title}
                </span>
              </div>
              <h4 className="text-xl sm:text-2xl font-black text-[#1A2138] leading-snug pt-0.5">
                {activeSlide.title}
              </h4>
              <p className="text-xs sm:text-sm font-semibold text-[#1673B8]">
                {activeSlide.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isFirstSlide}
                onClick={() => setCurrentSlideIdx((p) => Math.max(0, p - 1))}
                className={`p-2 rounded-xl border text-xs font-bold transition ${
                  isFirstSlide
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-[#D2DEEA] bg-white text-[#1A2138] hover:bg-slate-100 cursor-pointer'
                }`}
                title="Previous Slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={isLastSlide}
                onClick={() =>
                  setCurrentSlideIdx((p) => Math.min(totalSlides - 1, p + 1))
                }
                className={`p-2 rounded-xl border text-xs font-bold transition ${
                  isLastSlide
                    ? 'border-slate-200 text-slate-300 cursor-not-allowed'
                    : 'border-[#1673B8] bg-[#1673B8] text-white hover:bg-[#105E9A] cursor-pointer'
                }`}
                title="Next Slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Slide Body — Clear, Simple Presentation Bullet Points */}
          <div className="p-5 sm:p-7 space-y-5">
            <ul className="space-y-2.5">
              {activeSlide.bulletPoints.map((point, idx) => {
                const cleanText = point.replace(/^\s*(?:[0-9]+[.)]\s*|•\s*)/, '');
                return (
                  <li
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 flex items-start gap-3 hover:border-[#1673B8]/40 transition"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1673B8] shrink-0 mt-2" />
                    <span className="text-sm sm:text-[15px] text-slate-800 font-medium leading-relaxed">
                      {cleanText}
                    </span>
                  </li>
                );
              })}
            </ul>

            {activeSlide.practicalExample && (
              <div className="rounded-xl border border-[#D2DEEA] bg-[#F0F6FC] p-4 flex items-start gap-3">
                <BookOpen className="w-5 h-5 text-[#1673B8] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-[#1673B8]">
                    Practical Real-Life Example
                  </p>
                  <p className="text-xs sm:text-sm text-[#1A2138] leading-relaxed">
                    {activeSlide.practicalExample}
                  </p>
                </div>
              </div>
            )}

            {/* Key Takeaway Box on Every Slide */}
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50/80 p-4 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-black uppercase tracking-wider text-amber-950">
                  Key Point to Remember (Exam &amp; Daily Work)
                </p>
                <p className="text-xs sm:text-sm font-bold text-amber-950 leading-relaxed">
                  {activeSlide.keyTakeaway}
                </p>
              </div>
            </div>
          </div>

          {/* Slide Footer Navigation */}
          <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 sm:px-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              {!isFirstSlide ? (
                <button
                  type="button"
                  onClick={() => setCurrentSlideIdx((p) => Math.max(0, p - 1))}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Slide ({currentSlideIdx})
                </button>
              ) : moduleIndex > 0 ? (
                <button
                  type="button"
                  onClick={onSelectprev}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Module
                </button>
              ) : (
                <span className="text-xs text-slate-400 font-semibold">
                  Start of Module {module.moduleNumber}
                </span>
              )}
            </div>

            <div className="text-xs font-extrabold text-slate-600">
              Slide {activeSlide.slideNumber} / {totalSlides}
            </div>

            <div>
              {!isLastSlide ? (
                <button
                  type="button"
                  onClick={() =>
                    setCurrentSlideIdx((p) => Math.min(totalSlides - 1, p + 1))
                  }
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  Next Slide ({currentSlideIdx + 2} of {totalSlides})
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : moduleIndex < totalModules - 1 ? (
                <button
                  type="button"
                  onClick={onCompleteAndNext}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Complete Module {module.moduleNumber} &amp; Go to Module{' '}
                  {module.moduleNumber + 1} →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCompleteAndStartExam}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  Complete Course &amp; Start 40-MCQ Final Exam →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2B. MODE 2: READ ALL SLIDES ON ONE PAGE */}
      {presentationMode === 'all' && (
        <div className="space-y-4">
          {slides.map((sl) => (
            <div
              key={sl.slideNumber}
              className="rounded-2xl border border-[#D2DEEA] bg-white p-5 sm:p-6 shadow-xs space-y-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-[#EBF4FC] text-[#1673B8] text-[11px] font-black uppercase tracking-wider">
                    Slide {sl.slideNumber} of {totalSlides}
                  </span>
                  <h4 className="text-base sm:text-lg font-black text-[#1A2138] mt-1">
                    {sl.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500">
                    {sl.subtitle}
                  </p>
                </div>
              </div>

              <ul className="space-y-2">
                {sl.bulletPoints.map((pt, idx) => {
                  const cleanText = pt.replace(/^\s*(?:[0-9]+[.)]\s*|•\s*)/, '');
                  return (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800 leading-relaxed"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#1673B8] shrink-0 mt-1.5" />
                      <span>{cleanText}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-3 flex items-start gap-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-amber-950">
                  <span className="uppercase tracking-wider">Key Takeaway: </span>
                  {sl.keyTakeaway}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. QUICK MODULE SUMMARY CHECKLIST & 1-QUESTION SELF-CHECK (SHOWN ON LAST SLIDE OR IN ALL-SLIDES VIEW) */}
      {(isLastSlide || presentationMode === 'all') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Daily Manager Checklist */}
          <div className="rounded-2xl border border-[#D2DEEA] bg-white p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#1673B8]">
              <ClipboardCheck className="w-4 h-4" />
              Module {module.moduleNumber} Practical Checklist
            </div>
            <ul className="space-y-2">
              {module.practicalChecklist.map((item, idx) => (
                <li
                  key={idx}
                  className="p-2.5 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] flex items-start gap-2 text-xs text-[#1A2138] font-semibold"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#1673B8] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 1-Question Quick Practice Check */}
          <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-950">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Quick Practice Question (Optional)
            </div>
            <p className="text-xs sm:text-sm font-bold text-[#1A2138]">
              {quickCheckQuiz.question}
            </p>
            <div className="space-y-1.5">
              {quickCheckQuiz.options.map((opt, oIdx) => {
                const isSelected = selectedQuizOption === oIdx;
                const isCorrect = oIdx === quickCheckQuiz.correctIndex;
                let btnClass =
                  'border-slate-200 bg-white text-slate-800 hover:border-amber-400';
                if (selectedQuizOption !== null) {
                  if (isCorrect) {
                    btnClass =
                      'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                  } else if (isSelected && !isCorrect) {
                    btnClass = 'border-rose-400 bg-rose-50 text-rose-900';
                  }
                }
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => setSelectedQuizOption(oIdx)}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs transition cursor-pointer flex items-start gap-2 ${btnClass}`}
                  >
                    <span className="font-black">
                      {String.fromCharCode(65 + oIdx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
            {selectedQuizOption !== null && (
              <p className="text-xs font-semibold text-emerald-900 bg-emerald-100/80 border border-emerald-300 rounded-xl p-2.5">
                {quickCheckQuiz.explanation}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 4. BOTTOM MODULE ACTION BAR */}
      <div className="rounded-2xl border border-[#D2DEEA] bg-white p-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="text-xs text-slate-600 font-semibold">
          Module {module.moduleNumber} of {totalModules} ·{' '}
          <span className="text-[#1673B8] font-bold">
            {totalSlides} Presentation Slides
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {moduleIndex > 0 && (
            <button
              type="button"
              onClick={onSelectprev}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs cursor-pointer"
            >
              ← Previous Module
            </button>
          )}
          {moduleIndex < totalModules - 1 ? (
            <button
              type="button"
              onClick={onCompleteAndNext}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#1673B8] hover:bg-[#105E9A] text-white font-extrabold text-xs shadow-sm cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark Module {module.moduleNumber} Complete &amp; Next Module →
            </button>
          ) : (
            <button
              type="button"
              onClick={onCompleteAndStartExam}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-sm cursor-pointer"
            >
              <Award className="w-4 h-4" />
              Complete All Modules &amp; Start 40-MCQ Final Exam →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
