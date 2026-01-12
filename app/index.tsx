import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import { useStatisticsStore } from '../store/statisticsStore';
import vragenData from '../data/vragen.json';

type ExamenType = 'proefexamen7' | 'proefexamen8' | 'proefexamen9' | 'proefexamen10' | 'proefexamen11' | 'alle';

const examens = [
  { id: 'proefexamen7' as ExamenType, naam: 'Proefexamen 7', vragen: 60, beschrijving: 'Officieel niveau' },
  { id: 'proefexamen8' as ExamenType, naam: 'Proefexamen 8', vragen: 60, beschrijving: 'Officieel niveau' },
  { id: 'proefexamen9' as ExamenType, naam: 'Proefexamen 9', vragen: 60, beschrijving: 'Examen simulatie' },
  { id: 'proefexamen10' as ExamenType, naam: 'Proefexamen 10', vragen: 60, beschrijving: 'Nieuw examenniveau' },
  { id: 'proefexamen11' as ExamenType, naam: 'Proefexamen 11', vragen: 60, beschrijving: 'Nieuw examenniveau' },
  { id: 'alle' as ExamenType, naam: 'Alle vragen', vragen: 300, beschrijving: 'Mix van alles' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { startQuiz, laadLaatsteScore, laatsteScore } = useQuizStore();
  const { laadStatistieken, totaalVragen: totaalBeantwoord, totaalCorrect } = useStatisticsStore();
  const [selectedExam, setSelectedExam] = useState<ExamenType>('proefexamen7');
  const totaalVragen = vragenData.vragen.length;

  // Calculate cumulative percentage
  const cumulatiefPercentage = totaalBeantwoord > 0
    ? Math.round((totaalCorrect / totaalBeantwoord) * 100)
    : null;

  useEffect(() => {
    laadLaatsteScore();
    laadStatistieken();
  }, []);

  const handleStartQuiz = () => {
    startQuiz(selectedExam);
    router.push('/quiz');
  };

  const handleWeetjes = () => {
    router.push('/weetjes');
  };

  const handleTrends = () => {
    router.push('/trends');
  };

  const handleAnalyse = () => {
    router.push('/analyse');
  };

  const handleStudiegids = () => {
    router.push('/studiegids');
  };

  const handleLeerschema = () => {
    router.push('/leerschema');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>P2</Text>
            </View>
            <Text style={styles.title}>PRINCE2 Trainer</Text>
            <Text style={styles.subtitle}>Oefen voor je PRINCE2 Foundation examen</Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Pressable
              style={({ pressed }) => [styles.actionCard, styles.actionCardPrimary, pressed && styles.actionCardPressed]}
              onPress={handleWeetjes}
            >
              <Text style={styles.actionIcon}>📚</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Weetjes & Tips</Text>
                <Text style={styles.actionSubtitle}>Leer de theorie</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionCard, styles.actionCardSecondary, pressed && styles.actionCardPressed]}
              onPress={handleTrends}
            >
              <Text style={styles.actionIcon}>📈</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitleDark}>Trends & Patronen</Text>
                <Text style={styles.actionSubtitleDark}>Herken examenvragen</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionCard, styles.actionCardTertiary, pressed && styles.actionCardPressed]}
              onPress={handleAnalyse}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitleDark}>Analyse</Text>
                <Text style={styles.actionSubtitleDark}>Zie je zwakke punten</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionCard, styles.actionCardStudiegids, pressed && styles.actionCardPressed]}
              onPress={handleStudiegids}
            >
              <Text style={styles.actionIcon}>📖</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Studiegids</Text>
                <Text style={styles.actionSubtitle}>Complete PRINCE2 theorie</Text>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.actionCard, styles.actionCardLeerschema, pressed && styles.actionCardPressed]}
              onPress={handleLeerschema}
            >
              <Text style={styles.actionIcon}>📅</Text>
              <View style={styles.actionTextContainer}>
                <Text style={styles.actionTitle}>Leerschema</Text>
                <Text style={styles.actionSubtitle}>27 dagen tot 8 feb</Text>
              </View>
            </Pressable>
          </View>

          {/* Stats Card */}
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totaalVragen}</Text>
              <Text style={styles.statLabel}>Vragen</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>Examens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {laatsteScore !== null ? `${Math.round((laatsteScore / 60) * 100)}%` : '-'}
              </Text>
              <Text style={styles.statLabel}>Laatste</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, cumulatiefPercentage !== null && cumulatiefPercentage >= 60 ? styles.statGreen : styles.statOrange]}>
                {cumulatiefPercentage !== null ? `${cumulatiefPercentage}%` : '-'}
              </Text>
              <Text style={styles.statLabel}>Gemiddeld</Text>
            </View>
          </View>

          {/* Score Details Card */}
          {totaalBeantwoord > 0 && (
            <View style={styles.scoreDetailsCard}>
              <Text style={styles.scoreDetailsTitle}>Jouw Voortgang</Text>
              <View style={styles.scoreDetailsRow}>
                <View style={styles.scoreDetailItem}>
                  <Text style={styles.scoreDetailNumber}>{totaalBeantwoord}</Text>
                  <Text style={styles.scoreDetailLabel}>Beantwoord</Text>
                </View>
                <View style={styles.scoreDetailItem}>
                  <Text style={[styles.scoreDetailNumber, styles.statGreen]}>{totaalCorrect}</Text>
                  <Text style={styles.scoreDetailLabel}>Correct</Text>
                </View>
                <View style={styles.scoreDetailItem}>
                  <Text style={[styles.scoreDetailNumber, styles.statRed]}>{totaalBeantwoord - totaalCorrect}</Text>
                  <Text style={styles.scoreDetailLabel}>Fout</Text>
                </View>
              </View>
              {laatsteScore !== null && (
                <View style={styles.laatsteScoreRow}>
                  <Text style={styles.laatsteScoreLabel}>Laatste examen:</Text>
                  <Text style={[
                    styles.laatsteScoreValue,
                    laatsteScore >= 36 ? styles.statGreen : styles.statRed
                  ]}>
                    {laatsteScore}/60 ({Math.round((laatsteScore / 60) * 100)}%)
                    {laatsteScore >= 36 ? ' ✓' : ' ✗'}
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Exam Info */}
          <View style={styles.examInfo}>
            <Text style={styles.examInfoTitle}>Examen Info</Text>
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoIcon}>⏱️</Text>
              <Text style={styles.examInfoText}>60 minuten voor 60 vragen</Text>
            </View>
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoIcon}>✅</Text>
              <Text style={styles.examInfoText}>60% nodig om te slagen (36/60)</Text>
            </View>
            <View style={styles.examInfoRow}>
              <Text style={styles.examInfoIcon}>📝</Text>
              <Text style={styles.examInfoText}>Meerkeuzevragen (A, B, C, D)</Text>
            </View>
          </View>

          {/* Exam Selection */}
          <Text style={styles.sectionTitle}>Kies je proefexamen:</Text>
          <View style={styles.examList}>
            {examens.map((examen) => (
              <Pressable
                key={examen.id}
                onPress={() => setSelectedExam(examen.id)}
                style={[
                  styles.examButton,
                  selectedExam === examen.id && styles.examButtonSelected,
                ]}
              >
                <View style={styles.examButtonContent}>
                  <View style={[
                    styles.radio,
                    selectedExam === examen.id && styles.radioSelected,
                  ]}>
                    {selectedExam === examen.id && <View style={styles.radioInner} />}
                  </View>
                  <View style={styles.examTextContainer}>
                    <Text style={[
                      styles.examButtonText,
                      selectedExam === examen.id && styles.examButtonTextSelected,
                    ]}>
                      {examen.naam}
                    </Text>
                    <Text style={styles.examDescription}>{examen.beschrijving}</Text>
                  </View>
                  <Text style={styles.examCount}>{examen.vragen}</Text>
                </View>
              </Pressable>
            ))}
          </View>

          {/* Start Button */}
          <Pressable
            onPress={handleStartQuiz}
            style={({ pressed }) => [
              styles.startButton,
              pressed && styles.startButtonPressed,
            ]}
          >
            <Text style={styles.startButtonText}>Start Quiz</Text>
          </Pressable>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Studietip</Text>
            <Text style={styles.tipsText}>
              Begin met de "Weetjes & Tips" om de theorie te leren. Doe daarna de proefexamens om jezelf te testen. Herhaal de vragen die je fout had!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 72,
    height: 72,
    backgroundColor: '#2563eb',
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 14,
  },
  quickActions: {
    marginBottom: 16,
    gap: 10,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: 'white',
  },
  actionCardPrimary: {
    backgroundColor: '#2563eb',
  },
  actionCardSecondary: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  actionCardTertiary: {
    backgroundColor: '#f0fdf4',
    borderWidth: 2,
    borderColor: '#86efac',
  },
  actionCardStudiegids: {
    backgroundColor: '#7c3aed',
  },
  actionCardLeerschema: {
    backgroundColor: '#f97316',
  },
  actionCardPressed: {
    opacity: 0.9,
  },
  actionIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  actionTitleDark: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  actionSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  actionSubtitleDark: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#e5e7eb',
  },
  statGreen: {
    color: '#16a34a',
  },
  statOrange: {
    color: '#ea580c',
  },
  statRed: {
    color: '#dc2626',
  },
  scoreDetailsCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreDetailsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  scoreDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  scoreDetailItem: {
    alignItems: 'center',
  },
  scoreDetailNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  scoreDetailLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  laatsteScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  laatsteScoreLabel: {
    fontSize: 13,
    color: '#6b7280',
  },
  laatsteScoreValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  examInfo: {
    backgroundColor: '#eff6ff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  examInfoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 10,
  },
  examInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  examInfoIcon: {
    fontSize: 14,
    marginRight: 10,
    width: 20,
  },
  examInfoText: {
    fontSize: 14,
    color: '#3b82f6',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 10,
  },
  examList: {
    gap: 8,
    marginBottom: 20,
  },
  examButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  examButtonSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  examButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: '#2563eb',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  examTextContainer: {
    flex: 1,
  },
  examButtonText: {
    fontSize: 15,
    color: '#374151',
  },
  examButtonTextSelected: {
    color: '#2563eb',
    fontWeight: '600',
  },
  examDescription: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  examCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  startButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  startButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
  tipsCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400e',
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 13,
    color: '#a16207',
    lineHeight: 20,
  },
});
