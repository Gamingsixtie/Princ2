import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuizStore } from '../store/quizStore';

interface StudyDay {
  dag: number;
  datum: string;
  onderwerp: string;
  details: string[];
  themas: string[]; // For filtering quiz questions
  studiegidssectie: string; // Section name in studiegids
  aantalVragen: number; // How many practice questions to do
}

const leerschema: StudyDay[] = [
  // Week 1: Basis & Principes (12-18 jan)
  { dag: 1, datum: '12 jan', onderwerp: 'Introductie PRINCE2',
    details: ['Wat is PRINCE2?', 'Projectdefinitie', '6 prestatiedoelen', '4 geintegreerde elementen'],
    themas: ['project', 'prestatie', 'element'], studiegidsectie: 'Kernconcepten', aantalVragen: 10 },

  { dag: 2, datum: '13 jan', onderwerp: 'Principes 1-3',
    details: ['Voortdurende zakelijke rechtvaardiging', 'Leren van ervaring', 'Gedefinieerde rollen'],
    themas: ['principe', 'zakelijke rechtvaardiging', 'leren', 'rollen'], studiegidsectie: 'Principes', aantalVragen: 15 },

  { dag: 3, datum: '14 jan', onderwerp: 'Principes 4-7',
    details: ['Managen per fase', 'Managen bij uitzondering', 'Productgerichte aanpak', 'Aanpassen'],
    themas: ['principe', 'fase', 'uitzondering', 'product', 'aanpassen'], studiegidsectie: 'Principes', aantalVragen: 15 },

  { dag: 4, datum: '15 jan', onderwerp: 'Mensen & Rollen',
    details: ['Stuurgroep', 'Opdrachtgever', 'Senior User/Supplier', 'Projectmanager', 'Teammanager'],
    themas: ['rol', 'stuurgroep', 'opdrachtgever', 'projectmanager', 'teammanager', 'organisatie'], studiegidsectie: 'Mensen', aantalVragen: 15 },

  { dag: 5, datum: '16 jan', onderwerp: 'Herhaling Week 1',
    details: ['Alle principes', 'Alle rollen', 'Kernconcepten'],
    themas: ['principe', 'rol', 'organisatie'], studiegidsectie: 'Principes', aantalVragen: 20 },

  { dag: 6, datum: '17 jan', onderwerp: 'Oefenexamen deel 1',
    details: ['20 vragen in examentijd', 'Focus op principes en rollen'],
    themas: ['principe', 'rol', 'organisatie'], studiegidsectie: 'Principes', aantalVragen: 20 },

  { dag: 7, datum: '18 jan', onderwerp: 'Review & Rust',
    details: ['Bekijk foute antwoorden', 'Herlees moeilijke delen'],
    themas: [], studiegidsectie: 'Kernconcepten', aantalVragen: 0 },

  // Week 2: Practices (19-25 jan)
  { dag: 8, datum: '19 jan', onderwerp: 'Business Case',
    details: ['Doel: Waarom?', 'Outputs', 'Baten, nadelen, risicos', 'Continue rechtvaardiging'],
    themas: ['business case', 'baten', 'rechtvaardiging'], studiegidsectie: 'Business Case', aantalVragen: 15 },

  { dag: 9, datum: '20 jan', onderwerp: 'Organiseren',
    details: ['3 niveaus', 'Stuurgroep samenstelling', 'Projectborging', 'Belanghebbenden'],
    themas: ['organisatie', 'stuurgroep', 'borging', 'belanghebbenden'], studiegidsectie: 'Organiseren', aantalVragen: 15 },

  { dag: 10, datum: '21 jan', onderwerp: 'Plannen',
    details: ['Planniveaus', 'Productdecompositiestructuur', 'Productbeschrijvingen'],
    themas: ['plan', 'product', 'decompositie'], studiegidsectie: 'Plannen', aantalVragen: 15 },

  { dag: 11, datum: '22 jan', onderwerp: 'Kwaliteit',
    details: ['Kwaliteitsplanning', 'Kwaliteitsbeheersing', 'Kwaliteitsregister'],
    themas: ['kwaliteit', 'register'], studiegidsectie: 'Kwaliteit', aantalVragen: 15 },

  { dag: 12, datum: '23 jan', onderwerp: 'Risico',
    details: ['Risicocategorien', 'Risicoprocedure', 'Risicoregister', 'Risicoreacties'],
    themas: ['risico', 'register', 'reactie'], studiegidsectie: 'Risico', aantalVragen: 15 },

  { dag: 13, datum: '24 jan', onderwerp: 'Issues & Wijziging',
    details: ['Issuetypen', 'Wijzigingsverzoek', 'Afwijking', 'Configuratiebeheer'],
    themas: ['issue', 'wijziging', 'configuratie', 'change'], studiegidsectie: 'Issues', aantalVragen: 15 },

  { dag: 14, datum: '25 jan', onderwerp: 'Voortgang',
    details: ['Toleranties', 'Rapportages', 'Checkpuntrapporten', 'Uitzonderingen'],
    themas: ['voortgang', 'tolerantie', 'rapport', 'uitzondering'], studiegidsectie: 'Voortgang', aantalVragen: 15 },

  // Week 3: Processen (26 jan - 1 feb)
  { dag: 15, datum: '26 jan', onderwerp: 'Opstarten (SU)',
    details: ['Trigger: projectmandaat', 'Projectvoorstel', 'Dagelijks logboek'],
    themas: ['opstarten', 'mandaat', 'voorstel', 'SU'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 16, datum: '27 jan', onderwerp: 'Initiatie (IP)',
    details: ['PID samenstellen', 'Strategieen opzetten', 'Projectplan maken'],
    themas: ['initieren', 'initiatie', 'PID', 'IP'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 17, datum: '28 jan', onderwerp: 'Sturen (DP)',
    details: ['Beslissingen stuurgroep', 'Ad hoc sturing', 'Autoriseren'],
    themas: ['sturen', 'stuurgroep', 'autoriseren', 'DP'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 18, datum: '29 jan', onderwerp: 'Beheersen fase (CS)',
    details: ['Werk autoriseren', 'Voortgang bewaken', 'Issues behandelen'],
    themas: ['beheersen', 'fase', 'bewaken', 'CS'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 19, datum: '30 jan', onderwerp: 'Productoplevering (MP)',
    details: ['Werk accepteren', 'Werk uitvoeren', 'Werk opleveren'],
    themas: ['productoplevering', 'opleveren', 'teammanager', 'MP'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 20, datum: '31 jan', onderwerp: 'Faseovergang (SB)',
    details: ['Volgende fase plannen', 'Projectplan bijwerken', 'Eindfaserapport'],
    themas: ['faseovergang', 'fasegrens', 'SB'], studiegidsectie: 'Processen', aantalVragen: 15 },

  { dag: 21, datum: '1 feb', onderwerp: 'Afsluiten (CP)',
    details: ['Geplande afsluiting', 'Voortijdige afsluiting', 'Evalueren'],
    themas: ['afsluiten', 'afsluiting', 'evalueren', 'CP'], studiegidsectie: 'Processen', aantalVragen: 15 },

  // Week 4: Examens (2-8 feb)
  { dag: 22, datum: '2 feb', onderwerp: 'Proefexamen 9',
    details: ['60 vragen in 60 min', 'Volledige examensimulatie'],
    themas: [], studiegidsectie: 'Examenstrategie', aantalVragen: 60 },

  { dag: 23, datum: '3 feb', onderwerp: 'Analyse fouten',
    details: ['Welke themas fout?', 'Patronen herkennen'],
    themas: [], studiegidsectie: 'Kernconcepten', aantalVragen: 0 },

  { dag: 24, datum: '4 feb', onderwerp: 'Zwakke punten',
    details: ['Focus op lastige onderwerpen', 'Herlees relevante secties'],
    themas: [], studiegidsectie: 'Principes', aantalVragen: 20 },

  { dag: 25, datum: '5 feb', onderwerp: 'Proefexamen 10',
    details: ['60 vragen in 60 min', 'Nieuw examenniveau'],
    themas: [], studiegidsectie: 'Examenstrategie', aantalVragen: 60 },

  { dag: 26, datum: '6 feb', onderwerp: 'Laatste herhaling',
    details: ['7-7-7 structuur', 'Snelreferentie bekijken'],
    themas: ['principe', 'practice', 'proces'], studiegidsectie: 'Snelreferentie', aantalVragen: 30 },

  { dag: 27, datum: '7 feb', onderwerp: 'Lichte review',
    details: ['Niet te veel leren', 'Ontspan', 'Vroeg slapen'],
    themas: [], studiegidsectie: 'Kernconcepten', aantalVragen: 10 },

  { dag: 28, datum: '8 feb', onderwerp: 'EXAMENDAG!',
    details: ['Goed ontbijten', 'Op tijd aanwezig', 'Rustig blijven'],
    themas: [], studiegidsectie: '', aantalVragen: 0 },
];

export default function LeerschemaScreen() {
  const router = useRouter();
  const { startQuiz } = useQuizStore();
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    loadProgress();
    calculateCurrentDay();
  }, []);

  const loadProgress = async () => {
    try {
      const saved = await AsyncStorage.getItem('leerschema_progress');
      if (saved) {
        setCompletedDays(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Error loading progress:', e);
    }
  };

  const calculateCurrentDay = () => {
    const startDate = new Date('2025-01-12');
    const today = new Date();
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setCurrentDay(Math.max(1, Math.min(28, diffDays + 1)));
  };

  const toggleDay = async (dag: number) => {
    let newCompleted: number[];
    if (completedDays.includes(dag)) {
      newCompleted = completedDays.filter(d => d !== dag);
    } else {
      newCompleted = [...completedDays, dag];
    }
    setCompletedDays(newCompleted);
    await AsyncStorage.setItem('leerschema_progress', JSON.stringify(newCompleted));
  };

  const handleStudiegids = (sectie: string) => {
    router.push({ pathname: '/studiegids', params: { sectie } });
  };

  const handleOefenen = (day: StudyDay) => {
    if (day.aantalVragen === 60) {
      // Full exam - use specific exam
      if (day.dag === 22) {
        startQuiz('proefexamen9');
      } else if (day.dag === 25) {
        startQuiz('proefexamen10');
      } else {
        startQuiz('alle', day.themas);
      }
    } else if (day.themas.length > 0) {
      // Themed practice
      startQuiz('alle', day.themas);
    } else {
      // General practice
      startQuiz('alle');
    }
    router.push('/quiz');
  };

  const getWeekTitle = (dag: number): string | null => {
    if (dag === 1) return 'Week 1: Basis & Principes';
    if (dag === 8) return 'Week 2: Practices (7 themas)';
    if (dag === 15) return 'Week 3: Processen (7 processen)';
    if (dag === 22) return 'Week 4: Examens & Herhaling';
    return null;
  };

  const progress = Math.round((completedDays.length / 28) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Terug</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leerschema</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Voortgang: {completedDays.length}/28 dagen ({progress}%)</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.examDate}>Examen: 8 februari 2025 | 20 min/dag</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {leerschema.map((day) => {
          const weekTitle = getWeekTitle(day.dag);
          const isCompleted = completedDays.includes(day.dag);
          const isCurrent = day.dag === currentDay;

          return (
            <View key={day.dag}>
              {weekTitle && (
                <View style={styles.weekHeader}>
                  <Text style={styles.weekTitle}>{weekTitle}</Text>
                </View>
              )}
              <View
                style={[
                  styles.dayCard,
                  isCompleted && styles.dayCompleted,
                  isCurrent && styles.dayCurrent
                ]}
              >
                <TouchableOpacity
                  style={styles.dayHeaderTouchable}
                  onPress={() => toggleDay(day.dag)}
                >
                  <View style={styles.dayHeader}>
                    <View style={styles.dayBadge}>
                      <Text style={styles.dayNumber}>Dag {day.dag}</Text>
                      <Text style={styles.dayDate}>{day.datum}</Text>
                    </View>
                    <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                      {isCompleted && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </View>

                  <Text style={styles.onderwerp}>{day.onderwerp}</Text>

                  <View style={styles.detailsContainer}>
                    {day.details.map((detail, idx) => (
                      <Text key={idx} style={styles.detail}>• {detail}</Text>
                    ))}
                  </View>
                </TouchableOpacity>

                {/* Action buttons */}
                <View style={styles.actionButtons}>
                  {day.studiegidsectie && (
                    <TouchableOpacity
                      style={styles.theorieButton}
                      onPress={() => handleStudiegids(day.studiegidsectie)}
                    >
                      <Text style={styles.buttonIcon}>📖</Text>
                      <Text style={styles.theorieButtonText}>Theorie: {day.studiegidsectie}</Text>
                    </TouchableOpacity>
                  )}

                  {day.aantalVragen > 0 && (
                    <TouchableOpacity
                      style={styles.oefenButton}
                      onPress={() => handleOefenen(day)}
                    >
                      <Text style={styles.buttonIcon}>✏️</Text>
                      <Text style={styles.oefenButtonText}>
                        {day.aantalVragen === 60 ? 'Start examen (60 vragen)' : `Oefen ${day.aantalVragen} vragen`}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Tips voor succes</Text>
          <Text style={styles.tipText}>• Klik op "Theorie" om de studiegids te openen</Text>
          <Text style={styles.tipText}>• Klik op "Oefen" voor vragen over dat onderwerp</Text>
          <Text style={styles.tipText}>• Vink dagen af als je ze hebt afgerond</Text>
          <Text style={styles.tipText}>• Bij 55% of hoger ben je geslaagd (33/60 vragen)</Text>
        </View>

        <View style={styles.summaryBox}>
          <Text style={styles.summaryTitle}>Weekoverzicht</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Week 1:</Text>
            <Text style={styles.summaryText}>Kernconcepten + 7 Principes + Rollen</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Week 2:</Text>
            <Text style={styles.summaryText}>7 Practices (Business Case t/m Voortgang)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Week 3:</Text>
            <Text style={styles.summaryText}>7 Processen (SU, IP, DP, CS, MP, SB, CP)</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Week 4:</Text>
            <Text style={styles.summaryText}>Proefexamens + Herhaling zwakke punten</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#f97316',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 60,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#1e293b',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 12,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 6,
  },
  examDate: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  weekHeader: {
    marginTop: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#7c3aed',
    borderRadius: 10,
  },
  weekTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  dayCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  dayCompleted: {
    backgroundColor: '#14532d',
    borderColor: '#22c55e',
  },
  dayCurrent: {
    borderColor: '#f97316',
    borderWidth: 3,
  },
  dayHeaderTouchable: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayNumber: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayDate: {
    color: '#94a3b8',
    fontSize: 14,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#475569',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onderwerp: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detailsContainer: {
    marginBottom: 4,
  },
  detail: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 2,
  },
  actionButtons: {
    gap: 8,
  },
  theorieButton: {
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  oefenButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  theorieButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  oefenButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  tipBox: {
    backgroundColor: '#1e3a5f',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  tipTitle: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipText: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryBox: {
    backgroundColor: '#312e81',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#6366f1',
  },
  summaryTitle: {
    color: '#a5b4fc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
    width: 70,
  },
  summaryText: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
  },
});
