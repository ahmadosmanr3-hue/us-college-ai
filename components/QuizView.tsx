
import React, { useState, useMemo } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle2, XCircle, ChevronLeft, ArrowRight, ArrowLeft, Trophy, Info, PartyPopper, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface QuizViewProps {
  questions: QuizQuestion[];
  onBack: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null));
  const [showResults, setShowResults] = useState(false);

  // Derived state for the current question
  const selectedOption = answers[currentIndex];
  const isAnswered = selectedOption !== null;
  const isCorrect = isAnswered && selectedOption === questions[currentIndex].correctAnswer;

  // Calculate score based on all answers
  const score = useMemo(() => {
    // Filter out null answers to ensure type safety
    const validAnswers = answers.filter((a): a is number => a !== null);

    return answers.reduce<number>((acc, ans, idx) => {
      // If answer is null, skip it (though logic below handles it)
      if (ans === null) return acc;

      const currentQuestion = questions[idx];
      // Ensure question exists and check answer
      if (currentQuestion && ans === currentQuestion.correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [answers, questions]);

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = idx;
    setAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (showResults) {
    const data = [
      { name: 'Correct', value: score, color: '#10b981' },
      { name: 'Incorrect', value: questions.length - score, color: '#ef4444' },
    ];

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center p-6 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600 dark:text-yellow-500 mb-6">
            <Trophy size={64} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Quiz Complete!</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Here is how you performed on this topic.</p>
        </div>

        <div className="h-64 w-full mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '12px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-gray-100 dark:border-slate-700 shadow-sm mb-12">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <span className="block text-3xl font-bold text-gray-800 dark:text-white">{score}/{questions.length}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Total Score</span>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
              <span className="block text-3xl font-bold text-gray-800 dark:text-white">{Math.round((score / questions.length) * 100)}%</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest font-bold">Accuracy</span>
            </div>
          </div>
        </div>

        <button
          onClick={onBack}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-12">
        <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
          <ChevronLeft size={20} /> End Quiz
        </button>
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">Question {currentIndex + 1} of {questions.length}</span>
          <div className="w-32 h-2 bg-gray-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-600 dark:bg-indigo-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-slate-700 mb-8 transition-all">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-8 leading-relaxed">
          {q.question}
        </h3>

        <div className="space-y-4 mb-8">
          {q.options.map((opt, idx) => {
            let bgColor = 'bg-white dark:bg-slate-800';
            let borderColor = 'border-gray-200 dark:border-slate-700';
            let textColor = 'text-gray-700 dark:text-gray-300';

            if (isAnswered) {
              if (idx === q.correctAnswer) {
                bgColor = 'bg-emerald-50 dark:bg-emerald-900/20';
                borderColor = 'border-emerald-500';
                textColor = 'text-emerald-700 dark:text-emerald-400';
              } else if (selectedOption === idx) {
                bgColor = 'bg-rose-50 dark:bg-rose-900/20';
                borderColor = 'border-rose-500';
                textColor = 'text-rose-700 dark:text-rose-400';
              } else {
                textColor = 'text-gray-400 dark:text-gray-600';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleOptionSelect(idx)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${bgColor} ${borderColor} ${textColor} ${!isAnswered ? 'hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 cursor-pointer shadow-sm' : ''}`}
              >
                <span className="font-medium">{opt}</span>
                {isAnswered && idx === q.correctAnswer && <CheckCircle2 size={24} className="text-emerald-500" />}
                {isAnswered && selectedOption === idx && idx !== q.correctAnswer && <XCircle size={24} className="text-rose-500" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500 space-y-6">
            {/* Immediate Result Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-100/50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100/50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/30 text-rose-800 dark:text-rose-300'}`}>
              <div className={`p-2 rounded-full ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                {isCorrect ? <PartyPopper size={20} /> : <AlertTriangle size={20} />}
              </div>
              <span className="font-bold text-lg">{isCorrect ? 'Correct!' : 'Incorrect'}</span>
            </div>

            {/* Detailed Explanation */}
            <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
              <div className="flex items-start gap-4 p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                <div className="p-2 bg-white dark:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 shadow-sm">
                  <Info size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1 uppercase tracking-tight">Key Explanation</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{q.explanation}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase py-0.5 px-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
                      Correct Answer: {q.options[q.correctAnswer]}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4">
        {currentIndex > 0 && (
          <button
            onClick={prevQuestion}
            className="flex-1 flex justify-center items-center gap-2 py-4 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-slate-700 font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-[0.98]"
          >
            <ArrowLeft size={20} />
            Previous
          </button>
        )}

        {isAnswered && (
          <button
            onClick={nextQuestion}
            className="flex-[2] flex justify-center items-center gap-2 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-[0.98]"
          >
            {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
            <ArrowRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
