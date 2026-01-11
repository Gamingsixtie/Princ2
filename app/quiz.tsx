import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store/quizStore';
import { ProgressBar } from '../components/ProgressBar';
import { QuestionCard } from '../components/QuestionCard';
import { OptieKey } from '../types';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function QuizScreen() {
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showNavigator, setShowNavigator] = useState(false);
  const {
    vragen,
    huidigeIndex,
    vraagBeantwoord,
    gekozenAntwoord,
    antwoorden,
    beantwoordVraag,
    volgendeVraag,
    vorigeVraag,
    gaNaarVraag,
    quizActief,
    tijdOver,
    timerActief,
    updateTimer,
    stopTimer,
  } = useQuizStore();

  const huidigeVraag = vragen[huidigeIndex];
  const isLaatsteVraag = huidigeIndex >= vragen.length - 1;
  const isEersteVraag = huidigeIndex === 0;
  const isLowTime = tijdOver < 300;

  // Check if a question has been answered
  const isVraagBeantwoord = (index: number) => {
    const vraag = vragen[index];
    return antwoorden.some(a => a.vraagId === vraag.id);
  };

  // Check if answer was correct
  const isVraagCorrect = (index: number) => {
    const vraag = vragen[index];
    const antwoord = antwoorden.find(a => a.vraagId === vraag.id);
    return antwoord?.correct ?? null;
  };

  useEffect(() => {
    if (timerActief && tijdOver > 0) {
      timerRef.current = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActief]);

  useEffect(() => {
    if (tijdOver === 0 && timerActief) {
      stopTimer();
      router.replace('/result');
    }
  }, [tijdOver, timerActief]);

  const handleVolgende = () => {
    volgendeVraag();
    if (isLaatsteVraag) {
      router.replace('/result');
    }
  };

  const handleSelectAnswer = (antwoord: OptieKey) => {
    beantwoordVraag(antwoord);
  };

  // Redirect if quiz is not active
  useEffect(() => {
    if (!quizActief || vragen.length === 0) {
      router.replace('/');
    }
  }, [quizActief, vragen.length]);

  if (!quizActief || !huidigeVraag) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.stopButton}>
            <Text style={styles.stopButtonText}>Stoppen</Text>
          </Pressable>
          <View style={[styles.timerBadge, isLowTime && styles.timerBadgeLow]}>
            <Text style={[styles.timerText, isLowTime && styles.timerTextLow]}>
              {formatTime(tijdOver)}
            </Text>
          </View>
        </View>

        {/* Progress Bar with navigation */}
        <Pressable onPress={() => setShowNavigator(!showNavigator)}>
          <ProgressBar current={huidigeIndex + 1} total={vragen.length} />
        </Pressable>
        <Text style={styles.progressHint}>Tik op de balk om te navigeren</Text>

        {/* Question Content */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <QuestionCard
            vraag={huidigeVraag}
            onSelectAnswer={handleSelectAnswer}
            gekozenAntwoord={gekozenAntwoord}
            vraagBeantwoord={vraagBeantwoord}
          />
        </ScrollView>

        {/* Question Navigator */}
        {showNavigator && (
          <View style={styles.navigatorContainer}>
            <View style={styles.navigatorHeader}>
              <Text style={styles.navigatorTitle}>Vraag Navigator</Text>
              <Pressable onPress={() => setShowNavigator(false)}>
                <Text style={styles.navigatorClose}>Sluiten</Text>
              </Pressable>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.navigatorScroll}>
              <View style={styles.navigatorGrid}>
                {vragen.map((_, index) => {
                  const beantwoord = isVraagBeantwoord(index);
                  const correct = isVraagCorrect(index);
                  const isCurrent = index === huidigeIndex;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => {
                        gaNaarVraag(index);
                        setShowNavigator(false);
                      }}
                      style={[
                        styles.navigatorItem,
                        isCurrent && styles.navigatorItemCurrent,
                        beantwoord && correct === true && styles.navigatorItemCorrect,
                        beantwoord && correct === false && styles.navigatorItemFout,
                      ]}
                    >
                      <Text style={[
                        styles.navigatorItemText,
                        isCurrent && styles.navigatorItemTextCurrent,
                        beantwoord && styles.navigatorItemTextBeantwoord,
                      ]}>
                        {index + 1}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {/* Previous Button */}
          <Pressable
            onPress={vorigeVraag}
            disabled={isEersteVraag}
            style={[styles.navButton, isEersteVraag && styles.navButtonDisabled]}
          >
            <Text style={[styles.navButtonText, isEersteVraag && styles.navButtonTextDisabled]}>
              ← Vorige
            </Text>
          </Pressable>

          {/* Next/Finish Button */}
          {vraagBeantwoord ? (
            <Pressable
              onPress={handleVolgende}
              style={({ pressed }) => [
                styles.nextButton,
                pressed && styles.nextButtonPressed,
              ]}
            >
              <Text style={styles.nextButtonText}>
                {isLaatsteVraag ? 'Bekijk Resultaat' : 'Volgende →'}
              </Text>
            </Pressable>
          ) : (
            <View style={styles.navButtonPlaceholder}>
              <Text style={styles.navButtonPlaceholderText}>Beantwoord eerst</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stopButton: {
    padding: 8,
    marginLeft: -8,
  },
  stopButtonText: {
    color: '#2563eb',
    fontSize: 16,
  },
  timerBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },
  timerBadgeLow: {
    backgroundColor: '#fee2e2',
  },
  timerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  timerTextLow: {
    color: '#dc2626',
  },
  progressHint: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  navigatorContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigatorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navigatorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  navigatorClose: {
    fontSize: 14,
    color: '#2563eb',
  },
  navigatorScroll: {
    flexGrow: 0,
  },
  navigatorGrid: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 8,
  },
  navigatorItem: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  navigatorItemCurrent: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  navigatorItemCorrect: {
    backgroundColor: '#dcfce7',
  },
  navigatorItemFout: {
    backgroundColor: '#fee2e2',
  },
  navigatorItemText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  navigatorItemTextCurrent: {
    color: '#2563eb',
    fontWeight: 'bold',
  },
  navigatorItemTextBeantwoord: {
    color: '#111827',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    gap: 12,
  },
  navButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
  },
  navButtonDisabled: {
    backgroundColor: '#f3f4f6',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  navButtonTextDisabled: {
    color: '#9ca3af',
  },
  navButtonPlaceholder: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  navButtonPlaceholderText: {
    fontSize: 15,
    color: '#9ca3af',
  },
  nextButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
  },
});
