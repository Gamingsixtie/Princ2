export interface Vraag {
  id: number;
  vraag: string;
  opties: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: 'A' | 'B' | 'C' | 'D';
  uitleg: string;
  thema: string;
  bron?: string;
}

export interface Antwoord {
  vraagId: number;
  gekozen: 'A' | 'B' | 'C' | 'D';
  correct: boolean;
}

export type ExamenType = 'proefexamen7' | 'proefexamen8' | 'proefexamen9' | 'proefexamen10' | 'proefexamen11' | 'alle';

export interface QuizState {
  vragen: Vraag[];
  huidigeIndex: number;
  antwoorden: Antwoord[];
  score: number;
  quizActief: boolean;
  vraagBeantwoord: boolean;
  gekozenAntwoord: 'A' | 'B' | 'C' | 'D' | null;
  laatsteScore: number | null;
  tijdOver: number; // Remaining time in seconds
  timerActief: boolean;
  gekozenExamen: ExamenType | null;

  // Actions
  startQuiz: (examen: ExamenType, themaFilter?: string[]) => void;
  beantwoordVraag: (antwoord: 'A' | 'B' | 'C' | 'D') => void;
  volgendeVraag: () => void;
  vorigeVraag: () => void;
  gaNaarVraag: (index: number) => void;
  resetQuiz: () => void;
  laadLaatsteScore: () => Promise<void>;
  updateTimer: () => void;
  stopTimer: () => void;
}

export type OptieKey = 'A' | 'B' | 'C' | 'D';
