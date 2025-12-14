export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: number;
  scenario: string;
  options: string[]; // Simple array of strings for display
  correctOptionIndex: number;
  explanation: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  LOADING = 'LOADING',
  QUIZ = 'QUIZ',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  ERROR = 'ERROR'
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  feedback: string;
  archetype: string;
}
