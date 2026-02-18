
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudySession {
  topic: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
}

export enum AppState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  FLASHCARDS = 'FLASHCARDS'
}
