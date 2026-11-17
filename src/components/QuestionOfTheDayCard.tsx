import React, { useMemo, useState } from 'react';
import { Flame, CheckCircle2, XCircle, ChevronRight, Sparkles } from 'lucide-react';
import { ALL_2000_EXAM_MCQS } from '../data/questionBank2000';
import { UserToolsData } from '../types/hub';

interface QuestionOfTheDayCardProps {
  toolsData: UserToolsData;
  isLoggedIn: boolean;
  onSaveToolsData: (updated: UserToolsData) => Promise<void>;
  onOpenExamSuite: () => void;
}

const LOCAL_QOTD_KEY = 'fsp_qotd_history_v1';

function getTodayIsoDate(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getYesterdayIsoDate(): string {
  const dt = new Date(Date.now() - 86400000);
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const d = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDeterministicQuestionIndex(dateStr: string, bankLength: number): number {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i += 1) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) % 1000003;
  }
  return Math.abs(hash) % Math.max(1, bankLength);
}

export const QuestionOfTheDayCard: React.FC<QuestionOfTheDayCardProps> = ({
  toolsData,
  isLoggedIn,
  onSaveToolsData,
  onOpenExamSuite
}) => {
  const todayKey = useMemo(() => getTodayIsoDate(), []);

  const [localState, setLocalState] = useState<{
    history: Record<string, { questionId: string; selected: 'A' | 'B' | 'C' | 'D'; isCorrect: boolean }>;
    streak: number;
    lastDate: string;
  }>(() => {
    try {
      const raw = window.localStorage.getItem(LOCAL_QOTD_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            history: parsed.history || {},
            streak: Number(parsed.streak) || 0,
            lastDate: parsed.lastDate || ''
          };
        }
      }
    } catch {
      // Ignore storage error
    }
    return { history: {}, streak: 0, lastDate: '' };
  });

  const mergedHistory = isLoggedIn
    ? { ...localState.history, ...(toolsData.qotdHistory || {}) }
    : localState.history;
  const activeStreak = isLoggedIn
    ? Math.max(localState.streak, toolsData.qotdStreak || 0)
    : localState.streak;

  const dailyQuestion = useMemo(() => {
    const idx = getDeterministicQuestionIndex(todayKey, ALL_2000_EXAM_MCQS.length);
    return ALL_2000_EXAM_MCQS[idx] || ALL_2000_EXAM_MCQS[0];
  }, [todayKey]);

  const todaysAnswer = mergedHistory[todayKey];

  const correctLetter = (['A', 'B', 'C', 'D'] as const)[
    dailyQuestion.correctAnswerIndex ?? 0
  ] || 'A';

  const handleSelectOption = async (letter: 'A' | 'B' | 'C' | 'D') => {
    if (todaysAnswer) return;
    const isCorrect = letter === correctLetter;
    const yesterdayKey = getYesterdayIsoDate();
    const prevLast = (isLoggedIn ? toolsData.lastQotdDate : localState.lastDate) || localState.lastDate;
    const nextStreak =
      prevLast === yesterdayKey ? activeStreak + 1 : prevLast === todayKey ? activeStreak : 1;

    const nextHistory = {
      ...mergedHistory,
      [todayKey]: {
        questionId: dailyQuestion.id,
        selected: letter,
        isCorrect
      }
    };

    setLocalState({
      history: nextHistory,
      streak: nextStreak,
      lastDate: todayKey
    });

    try {
      window.localStorage.setItem(
        LOCAL_QOTD_KEY,
        JSON.stringify({
          history: nextHistory,
          streak: nextStreak,
          lastDate: todayKey
        })
      );
    } catch {
      // Ignore storage quota error
    }

    if (isLoggedIn) {
      await onSaveToolsData({
        ...toolsData,
        qotdHistory: nextHistory,
        qotdStreak: nextStreak,
        lastQotdDate: todayKey,
        updatedAt: new Date().toISOString().slice(0, 19) + 'Z'
      });
    }
  };

  if (!dailyQuestion) return null;

  const options: Array<{ letter: 'A' | 'B' | 'C' | 'D'; text: string }> = [
    { letter: 'A', text: dailyQuestion.options[0] || '' },
    { letter: 'B', text: dailyQuestion.options[1] || '' },
    { letter: 'C', text: dailyQuestion.options[2] || '' },
    { letter: 'D', text: dailyQuestion.options[3] || '' }
  ];

  return (
    <div className="bg-white border border-[#D2DEEA] rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D2DEEA] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F0F6FC] border border-[#D2DEEA] text-[#1673B8] flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-[10.5px] font-extrabold uppercase tracking-wider text-[#1673B8]">
              Daily Food Safety Challenge · {dailyQuestion.subject}
            </div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#1A2138]">
              Question of the Day
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F0F6FC] border border-[#D2DEEA] text-[#105E9A] text-xs font-extrabold tabular-nums">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>{activeStreak} Day Streak</span>
          </span>
          <button
            type="button"
            onClick={onOpenExamSuite}
            className="text-xs font-extrabold text-[#1673B8] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
          >
            <span>Full Exam Prep</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm font-bold text-[#1A2138] leading-snug">
        {dailyQuestion.question.replace(/^\[[^\]]+\]\s*/, '').trim()}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => {
          const isPicked = todaysAnswer?.selected === opt.letter;
          const isRight = correctLetter === opt.letter;
          let cardStyle =
            'bg-[#F8FAFC] hover:bg-[#F0F6FC] border-[#D2DEEA] text-[#1A2138] cursor-pointer';
          if (todaysAnswer) {
            if (isRight) {
              cardStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold';
            } else if (isPicked && !isRight) {
              cardStyle = 'bg-rose-50 border-rose-400 text-rose-900';
            } else {
              cardStyle = 'bg-slate-50 border-slate-200 text-slate-500';
            }
          }

          return (
            <button
              key={opt.letter}
              type="button"
              disabled={Boolean(todaysAnswer)}
              onClick={() => handleSelectOption(opt.letter)}
              className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start gap-2 ${cardStyle}`}
            >
              <span className="w-5 h-5 rounded-md bg-white border border-[#D2DEEA] text-[10.5px] font-black flex items-center justify-center shrink-0">
                {opt.letter}
              </span>
              <span className="flex-1 leading-snug">{opt.text}</span>
            </button>
          );
        })}
      </div>

      {todaysAnswer && (
        <div
          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
            todaysAnswer.isCorrect
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          {todaysAnswer.isCorrect ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5">
            <div className="font-extrabold">
              {todaysAnswer.isCorrect
                ? 'Correct! Streak updated.'
                : `Correct Answer: Option ${correctLetter}`}
            </div>
            <p className="text-[11.5px] leading-relaxed opacity-90">
              {dailyQuestion.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
