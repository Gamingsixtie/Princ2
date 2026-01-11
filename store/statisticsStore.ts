import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = 'prince2_statistics';

export interface ThemaStats {
  thema: string;
  totaalVragen: number;
  correcteAntwoorden: number;
  fouteAntwoorden: number;
  laatstePoging: string | null;
}

export interface StatisticsState {
  themaStats: Record<string, ThemaStats>;
  totaalQuizzes: number;
  totaalVragen: number;
  totaalCorrect: number;

  // Actions
  registreerAntwoord: (thema: string, correct: boolean) => void;
  laadStatistieken: () => Promise<void>;
  resetStatistieken: () => Promise<void>;
  getZwaksteThemas: () => ThemaStats[];
  getSterksteThemas: () => ThemaStats[];
}

const initialThemas: Record<string, ThemaStats> = {
  'Concepten': { thema: 'Concepten', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Principes': { thema: 'Principes', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Mensen': { thema: 'Mensen', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Business Case': { thema: 'Business Case', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Organisatie': { thema: 'Organisatie', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Kwaliteit': { thema: 'Kwaliteit', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Plannen': { thema: 'Plannen', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Risico': { thema: 'Risico', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Issues': { thema: 'Issues', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Voortgang': { thema: 'Voortgang', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
  'Processen': { thema: 'Processen', totaalVragen: 0, correcteAntwoorden: 0, fouteAntwoorden: 0, laatstePoging: null },
};

export const useStatisticsStore = create<StatisticsState>((set, get) => ({
  themaStats: { ...initialThemas },
  totaalQuizzes: 0,
  totaalVragen: 0,
  totaalCorrect: 0,

  registreerAntwoord: (thema: string, correct: boolean) => {
    const { themaStats, totaalVragen, totaalCorrect } = get();

    const huidigeStats = themaStats[thema] || {
      thema,
      totaalVragen: 0,
      correcteAntwoorden: 0,
      fouteAntwoorden: 0,
      laatstePoging: null,
    };

    const nieuweStats = {
      ...huidigeStats,
      totaalVragen: huidigeStats.totaalVragen + 1,
      correcteAntwoorden: correct ? huidigeStats.correcteAntwoorden + 1 : huidigeStats.correcteAntwoorden,
      fouteAntwoorden: correct ? huidigeStats.fouteAntwoorden : huidigeStats.fouteAntwoorden + 1,
      laatstePoging: new Date().toISOString(),
    };

    const nieuweThemaStats = {
      ...themaStats,
      [thema]: nieuweStats,
    };

    set({
      themaStats: nieuweThemaStats,
      totaalVragen: totaalVragen + 1,
      totaalCorrect: correct ? totaalCorrect + 1 : totaalCorrect,
    });

    // Save to AsyncStorage
    AsyncStorage.setItem(STATS_KEY, JSON.stringify({
      themaStats: nieuweThemaStats,
      totaalQuizzes: get().totaalQuizzes,
      totaalVragen: totaalVragen + 1,
      totaalCorrect: correct ? totaalCorrect + 1 : totaalCorrect,
    }));
  },

  laadStatistieken: async () => {
    try {
      const opgeslagen = await AsyncStorage.getItem(STATS_KEY);
      if (opgeslagen) {
        const data = JSON.parse(opgeslagen);
        set({
          themaStats: { ...initialThemas, ...data.themaStats },
          totaalQuizzes: data.totaalQuizzes || 0,
          totaalVragen: data.totaalVragen || 0,
          totaalCorrect: data.totaalCorrect || 0,
        });
      }
    } catch (error) {
      console.error('Fout bij laden statistieken:', error);
    }
  },

  resetStatistieken: async () => {
    set({
      themaStats: { ...initialThemas },
      totaalQuizzes: 0,
      totaalVragen: 0,
      totaalCorrect: 0,
    });
    await AsyncStorage.removeItem(STATS_KEY);
  },

  getZwaksteThemas: () => {
    const { themaStats } = get();
    return Object.values(themaStats)
      .filter(stats => stats.totaalVragen >= 3) // Minimaal 3 vragen beantwoord
      .map(stats => ({
        ...stats,
        percentage: stats.totaalVragen > 0
          ? Math.round((stats.correcteAntwoorden / stats.totaalVragen) * 100)
          : 0,
      }))
      .sort((a, b) => (a.percentage || 0) - (b.percentage || 0))
      .slice(0, 5);
  },

  getSterksteThemas: () => {
    const { themaStats } = get();
    return Object.values(themaStats)
      .filter(stats => stats.totaalVragen >= 3)
      .map(stats => ({
        ...stats,
        percentage: stats.totaalVragen > 0
          ? Math.round((stats.correcteAntwoorden / stats.totaalVragen) * 100)
          : 0,
      }))
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
      .slice(0, 5);
  },
}));
