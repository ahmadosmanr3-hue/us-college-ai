
import React, { useState, useEffect } from 'react';

const messages = [
  "Analyzing your document...",
  "Extracting key concepts...",
  "Generating flashcards...",
  "Crafting challenging quiz questions...",
  "Organizing your study session...",
  "Finalizing your personalized dashboard..."
];

export const Loading: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Pulsing with intelligence...</h2>
      <p className="text-gray-500 dark:text-gray-400 animate-pulse">{messages[msgIndex]}</p>
    </div>
  );
};
