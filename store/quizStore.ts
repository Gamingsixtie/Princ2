import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizState, Vraag, Antwoord, ExamenType } from '../types';
import { shuffle } from '../utils/shuffle';
import vragenData from '../data/vragen.json';
import { useStatisticsStore } from './statisticsStore';

const LAATSTE_SCORE_KEY = 'prince2_laatste_score';
const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes in seconds

export const useQuizStore = create<QuizState>((set, get) => ({
  vragen: [],
  huidigeIndex: 0,
  antwoorden: [],
  score: 0,
  quizActief: false,
  vraagBeantwoord: false,
  gekozenAntwoord: null,
  laatsteScore: null,
  tijdOver: EXAM_DURATION_SECONDS,
  timerActief: false,
  gekozenExamen: null,

  startQuiz: (examen: ExamenType, themaFilter?: string[]) => {
    const alleVragen = vragenData.vragen as Vraag[];

    // Filter questions based on selected exam
    let gefiltrerdeVragen = examen === 'alle'
      ? alleVragen
      : alleVragen.filter(v => v.bron === examen);

    // Additional filter by theme if provided
    if (themaFilter && themaFilter.length > 0) {
      gefiltrerdeVragen = gefiltrerdeVragen.filter(v =>
        themaFilter.some(t => v.thema.toLowerCase().includes(t.toLowerCase()))
      );
    }

    // Official exams (proefexamen7 and proefexamen8) are NOT shuffled
    // They stay in the exact original order
    const isOfficieelExamen = examen === 'proefexamen7' || examen === 'proefexamen8';
    const quizVragen = isOfficieelExamen
      ? gefiltrerdeVragen.sort((a, b) => a.id - b.id) // Sort by ID to keep original order
      : shuffle(gefiltrerdeVragen);

    set({
      vragen: quizVragen,
      huidigeIndex: 0,
      antwoorden: [],
      score: 0,
      quizActief: true,
      vraagBeantwoord: false,
      gekozenAntwoord: null,
      tijdOver: EXAM_DURATION_SECONDS,
      timerActief: true,
      gekozenExamen: examen,
    });
  },

  beantwoordVraag: (antwoord) => {
    const { vragen, huidigeIndex, antwoorden, score } = get();
    const huidigeVraag = vragen[huidigeIndex];
    const isCorrect = antwoord === huidigeVraag.correct;

    const nieuwAntwoord: Antwoord = {
      vraagId: huidigeVraag.id,
      gekozen: antwoord,
      correct: isCorrect,
    };

    // Register answer for statistics
    useStatisticsStore.getState().registreerAntwoord(huidigeVraag.thema, isCorrect);

    set({
      antwoorden: [...antwoorden, nieuwAntwoord],
      score: isCorrect ? score + 1 : score,
      vraagBeantwoord: true,
      gekozenAntwoord: antwoord,
    });
  },

  volgendeVraag: () => {
    const { huidigeIndex, vragen, score } = get();
    const isLaatsteVraag = huidigeIndex >= vragen.length - 1;

    if (isLaatsteVraag) {
      // Save score to AsyncStorage
      AsyncStorage.setItem(LAATSTE_SCORE_KEY, JSON.stringify({
        score,
        totaal: vragen.length,
        datum: new Date().toISOString(),
      }));

      set({
        quizActief: false,
        laatsteScore: score,
        timerActief: false,
      });
    } else {
      const { antwoorden, vragen: alleVragen } = get();
      const volgendeVraag = alleVragen[huidigeIndex + 1];
      const bestaandAntwoord = antwoorden.find(a => a.vraagId === volgendeVraag.id);

      set({
        huidigeIndex: huidigeIndex + 1,
        vraagBeantwoord: !!bestaandAntwoord,
        gekozenAntwoord: bestaandAntwoord?.gekozen || null,
      });
    }
  },

  vorigeVraag: () => {
    const { huidigeIndex, antwoorden, vragen } = get();
    if (huidigeIndex > 0) {
      const vorigeVraag = vragen[huidigeIndex - 1];
      const bestaandAntwoord = antwoorden.find(a => a.vraagId === vorigeVraag.id);

      set({
        huidigeIndex: huidigeIndex - 1,
        vraagBeantwoord: !!bestaandAntwoord,
        gekozenAntwoord: bestaandAntwoord?.gekozen || null,
      });
    }
  },

  gaNaarVraag: (index: number) => {
    const { vragen, antwoorden } = get();
    if (index >= 0 && index < vragen.length) {
      const vraag = vragen[index];
      const bestaandAntwoord = antwoorden.find(a => a.vraagId === vraag.id);

      set({
        huidigeIndex: index,
        vraagBeantwoord: !!bestaandAntwoord,
        gekozenAntwoord: bestaandAntwoord?.gekozen || null,
      });
    }
  },

  resetQuiz: () => {
    set({
      vragen: [],
      huidigeIndex: 0,
      antwoorden: [],
      score: 0,
      quizActief: false,
      vraagBeantwoord: false,
      gekozenAntwoord: null,
      tijdOver: EXAM_DURATION_SECONDS,
      timerActief: false,
    });
  },

  updateTimer: () => {
    const { tijdOver, timerActief } = get();
    if (timerActief && tijdOver > 0) {
      set({ tijdOver: tijdOver - 1 });
    }
  },

  stopTimer: () => {
    set({ timerActief: false });
  },

  laadLaatsteScore: async () => {
    try {
      const opgeslagen = await AsyncStorage.getItem(LAATSTE_SCORE_KEY);
      if (opgeslagen) {
        const data = JSON.parse(opgeslagen);
        set({ laatsteScore: data.score });
      }
    } catch (error) {
      console.error('Fout bij laden laatste score:', error);
    }
  },
}));
