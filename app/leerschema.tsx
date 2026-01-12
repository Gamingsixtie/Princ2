import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StudyDay {
  dag: number;
  datum: string;
  onderwerp: string;
  details: string[];
  actie: string;
  voltooid?: boolean;
}

const leerschema: StudyDay[] = [
  // Week 1: Basis & Principes (12-18 jan)
  { dag: 1, datum: '12 jan', onderwerp: 'Introductie PRINCE2', details: ['Wat is PRINCE2?', 'Projectdefinitie', '6 prestatiedoelen', '4 geintegreerde elementen'], actie: 'Lees Studiegids: Kernconcepten' },
  { dag: 2, datum: '13 jan', onderwerp: 'Principes 1-3', details: ['Voortdurende zakelijke rechtvaardiging', 'Leren van ervaring', 'Gedefinieerde rollen en verantwoordelijkheden'], actie: 'Lees Studiegids: Principes' },
  { dag: 3, datum: '14 jan', onderwerp: 'Principes 4-7', details: ['Managen per fase', 'Managen bij uitzondering', 'Productgerichte aanpak', 'Aanpassen aan project'], actie: 'Lees Studiegids: Principes' },
  { dag: 4, datum: '15 jan', onderwerp: 'Mensen & Rollen', details: ['Stuurgroep', 'Opdrachtgever', 'Senior User/Supplier', 'Projectmanager', 'Teammanager'], actie: 'Lees Studiegids: Mensen' },
  { dag: 5, datum: '16 jan', onderwerp: 'Herhaling Week 1', details: ['Kernconcepten', 'Alle 7 principes', 'Alle rollen'], actie: 'Maak 20 vragen Proefexamen 7' },
  { dag: 6, datum: '17 jan', onderwerp: 'Oefenen', details: ['Focus op definitievragen', 'Rollenvragen'], actie: 'Maak 20 vragen Proefexamen 8' },
  { dag: 7, datum: '18 jan', onderwerp: 'Rustdag + Review', details: ['Herlees moeilijke delen', 'Noteer vragen'], actie: 'Bekijk foute antwoorden' },

  // Week 2: Practices (19-25 jan)
  { dag: 8, datum: '19 jan', onderwerp: 'Business Case', details: ['Doel: Waarom?', 'Outputs', 'Baten, nadelen, risicos', 'Continue rechtvaardiging'], actie: 'Lees Studiegids: Business Case' },
  { dag: 9, datum: '20 jan', onderwerp: 'Organiseren', details: ['3 niveaus', 'Stuurgroep samenstelling', 'Projectborging', 'Belanghebbenden'], actie: 'Lees Studiegids: Organiseren' },
  { dag: 10, datum: '21 jan', onderwerp: 'Plannen', details: ['Planniveaus', 'Productdecompositiestructuur', 'Productbeschrijvingen', 'Plannen stappenplan'], actie: 'Lees Studiegids: Plannen' },
  { dag: 11, datum: '22 jan', onderwerp: 'Kwaliteit', details: ['Kwaliteitsplanning', 'Kwaliteitsbeheersing', 'Kwaliteitsregister', 'Klantverwtachtingen'], actie: 'Lees Studiegids: Kwaliteit' },
  { dag: 12, datum: '23 jan', onderwerp: 'Risico', details: ['Risicocategorien', 'Risicoprocedure', 'Risicoregister', 'Risicoreacties'], actie: 'Lees Studiegids: Risico' },
  { dag: 13, datum: '24 jan', onderwerp: 'Wijziging + Issues', details: ['Issuetypen', 'Wijzigingsverzoek', 'Afwijking', 'Configuratiebeheer'], actie: 'Lees Studiegids: Issues & Wijziging' },
  { dag: 14, datum: '25 jan', onderwerp: 'Voortgang', details: ['Toleranties', 'Rapportages', 'Checkpuntrapporten', 'Uitzonderingen'], actie: 'Lees Studiegids: Voortgang' },

  // Week 3: Processen (26 jan - 1 feb)
  { dag: 15, datum: '26 jan', onderwerp: 'Opstarten (SU)', details: ['Trigger: projectmandaat', 'Projectvoorstel', 'Dagelijks logboek', 'Lessen logboek'], actie: 'Lees Studiegids: Opstarten' },
  { dag: 16, datum: '27 jan', onderwerp: 'Initiatie (IP)', details: ['PID samenstellen', 'Strategieen opzetten', 'Projectplan maken', 'Baten review plan'], actie: 'Lees Studiegids: Initiatie' },
  { dag: 17, datum: '28 jan', onderwerp: 'Sturen (DP)', details: ['Beslissingen stuurgroep', 'Ad hoc sturing', 'Autoriseren fasen', 'Afsluiten autoriseren'], actie: 'Lees Studiegids: Sturen' },
  { dag: 18, datum: '29 jan', onderwerp: 'Beheersen fase (CS)', details: ['Werk autoriseren', 'Voortgang bewaken', 'Issues behandelen', 'Escaleren'], actie: 'Lees Studiegids: Beheersen fase' },
  { dag: 19, datum: '30 jan', onderwerp: 'Managen productoplevering (MP)', details: ['Werk accepteren', 'Werk uitvoeren', 'Werk opleveren', 'Teammanager taken'], actie: 'Lees Studiegids: Productoplevering' },
  { dag: 20, datum: '31 jan', onderwerp: 'Managen faseovergang (SB)', details: ['Volgende fase plannen', 'Projectplan bijwerken', 'Business Case bijwerken', 'Eindfaserapport'], actie: 'Lees Studiegids: Faseovergang' },
  { dag: 21, datum: '1 feb', onderwerp: 'Afsluiten (CP)', details: ['Geplande afsluiting', 'Voortijdige afsluiting', 'Producten overdragen', 'Evalueren project'], actie: 'Lees Studiegids: Afsluiten' },

  // Week 4: Herhaling & Examens (2-8 feb)
  { dag: 22, datum: '2 feb', onderwerp: 'Oefenexamen compleet', details: ['60 vragen in 60 min', 'Examenomstandigheden', 'Niet spieken!'], actie: 'Maak Proefexamen 9 volledig' },
  { dag: 23, datum: '3 feb', onderwerp: 'Analyse fouten', details: ['Welke themas fout?', 'Patronen herkennen', 'Moeilijke vragen'], actie: 'Bestudeer foute antwoorden' },
  { dag: 24, datum: '4 feb', onderwerp: 'Zwakke punten', details: ['Focus op lastige onderwerpen', 'Herlees relevante secties'], actie: 'Studiegids herlezen' },
  { dag: 25, datum: '5 feb', onderwerp: 'Oefenexamen 2', details: ['60 vragen in 60 min', 'Let op tijd'], actie: 'Maak Proefexamen 10 volledig' },
  { dag: 26, datum: '6 feb', onderwerp: 'Laatste herhaling', details: ['7-7-7 structuur', 'Snelreferentie', 'Managementproducten'], actie: 'Studiegids: 7-7-7 overzicht' },
  { dag: 27, datum: '7 feb', onderwerp: 'Lichte review', details: ['Niet te veel leren', 'Ontspan', 'Vroeg slapen'], actie: 'Alleen flashcards bekijken' },
  { dag: 28, datum: '8 feb', onderwerp: 'EXAMENDAG!', details: ['Goed ontbijten', 'Op tijd aanwezig', 'Rustig blijven', 'Je bent voorbereid!'], actie: 'SUCCES!' },
];

export default function LeerschemaScreen() {
  const router = useRouter();
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

  const getWeekTitle = (dag: number): string | null => {
    if (dag === 1) return 'Week 1: Basis & Principes';
    if (dag === 8) return 'Week 2: Practices';
    if (dag === 15) return 'Week 3: Processen';
    if (dag === 22) return 'Week 4: Examens & Herhaling';
    return null;
  };

  const progress = Math.round((completedDays.length / 28) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>Terug</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Leerschema</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Voortgang: {completedDays.length}/28 dagen ({progress}%)</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.examDate}>Examen: 8 februari 2025</Text>
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
              <TouchableOpacity
                style={[
                  styles.dayCard,
                  isCompleted && styles.dayCompleted,
                  isCurrent && styles.dayCurrent
                ]}
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

                <View style={styles.actieContainer}>
                  <Text style={styles.actieLabel}>Actie:</Text>
                  <Text style={styles.actieText}>{day.actie}</Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>Tips voor succes</Text>
          <Text style={styles.tipText}>• Leer elke dag op hetzelfde tijdstip</Text>
          <Text style={styles.tipText}>• Maak aantekeningen van moeilijke concepten</Text>
          <Text style={styles.tipText}>• Bij 55% of hoger ben je geslaagd (33/60 vragen)</Text>
          <Text style={styles.tipText}>• Focus op de 7-7-7 structuur: 7 Principes, 7 Practices, 7 Processen</Text>
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
  },
  weekTitle: {
    color: '#ffffff',
    fontSize: 16,
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
    marginBottom: 12,
  },
  detail: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 2,
  },
  actieContainer: {
    backgroundColor: '#334155',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actieLabel: {
    color: '#f97316',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  actieText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
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
});
