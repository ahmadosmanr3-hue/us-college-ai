
import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard } from '../types';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

interface FlashcardViewProps {
  cards: Flashcard[];
  onBack: () => void;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({ cards, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  }, [cards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  }, [cards.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Navigate cards
      if (event.key === 'ArrowRight') {
        handleNext();
      } else if (event.key === 'ArrowLeft') {
        handlePrev();
      } 
      // Flip current card
      else if (event.key === ' ' || event.key === 'Enter') {
        // Prevent scrolling with spacebar
        if (event.key === ' ') event.preventDefault();
        setIsFlipped(prev => !prev);
      }
      // Back on Escape
      else if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onBack]);

  const card = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <button onClick={onBack} className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">Card {currentIndex + 1} of {cards.length}</span>
      </div>

      <div 
        className="perspective-1000 h-96 w-full cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 flex flex-col items-center justify-center p-12 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-500 dark:text-indigo-400 mb-4">{card.category}</span>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">{card.question}</h3>
            <p className="mt-8 text-sm text-gray-400 dark:text-gray-500">Click or press Space/Enter to flip</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-indigo-600 dark:bg-indigo-700 rounded-3xl shadow-xl flex flex-col items-center justify-center p-12 text-center rotate-y-180">
            <h3 className="text-xl leading-relaxed text-white font-medium">{card.answer}</h3>
            <p className="mt-8 text-sm text-indigo-200 dark:text-indigo-300">Click or press Space/Enter to flip back</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 mt-12">
        <button 
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
          className="p-4 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          title="Previous Card (Left Arrow)"
        >
          <ChevronLeft size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
          className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors shadow-sm"
          title="Flip Card (Space/Enter)"
        >
          <RotateCcw size={24} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="p-4 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
          title="Next Card (Right Arrow)"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="mt-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/30">
        <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Keyboard Shortcuts</h4>
        <div className="flex flex-wrap gap-4 text-indigo-700 dark:text-indigo-400 text-sm">
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded shadow text-xs">←</kbd> Previous</div>
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded shadow text-xs">→</kbd> Next</div>
          <div className="flex items-center gap-2"><kbd className="px-2 py-1 bg-white dark:bg-slate-800 rounded shadow text-xs">Space</kbd> Flip</div>
        </div>
      </div>
    </div>
  );
};
