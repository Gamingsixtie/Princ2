import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useMemo } from 'react';
import { useQuizStore } from '../store/quizStore';

// Study tips per theme - how to better reason through questions
const themaTips: Record<string, { tip: string; redeneerHulp: string; veelgemaakteFout: string }> = {
  'Business Case': {
    tip: 'Focus op de drie rechtvaardigingsvragen: Is het wenselijk? Is het haalbaar? Is het levensvatbaar?',
    redeneerHulp: 'Vraag jezelf af: "Wie is eigenaar?" (Opdrachtgever) en "Wanneer wordt dit gereviewed?" (elke faseovergang)',
    veelgemaakteFout: 'Benefits worden meestal NA het project gerealiseerd, niet tijdens.',
  },
  'Organisatie': {
    tip: 'Onthoud de drie belangengroepen: Business, Gebruiker, Leverancier. Elke rol vertegenwoordigt één belang.',
    redeneerHulp: 'De PM mag NOOIT in de Stuurgroep zitten. De Opdrachtgever is altijd eindverantwoordelijk.',
    veelgemaakteFout: 'De Stuurgroep beheert niet dagelijks - dat doet de PM.',
  },
  'Kwaliteit': {
    tip: 'Onderscheid: Kwaliteitscontrole = producten checken, Kwaliteitsborging = processen checken.',
    redeneerHulp: 'Klantkwaliteitsverwachtingen → vertaald naar → Acceptatiecriteria (specifiek en meetbaar)',
    veelgemaakteFout: 'Het kwaliteitsregister bevat activiteiten, NIET de kwaliteitsmanagementaanpak.',
  },
  'Plannen': {
    tip: 'PRINCE2 is productgericht: eerst WAT (producten), dan HOE (activiteiten), dan WIE en WANNEER.',
    redeneerHulp: 'Drie planniveaus: Projectplan (Stuurgroep), Faseplan (PM), Teamplan (optioneel)',
    veelgemaakteFout: 'Teamplannen zijn optioneel, niet verplicht.',
  },
  'Risico': {
    tip: 'Risico = toekomstige onzekerheid. Issue = huidige situatie. Kans = positief risico.',
    redeneerHulp: 'Inherent risico = VOOR maatregelen. Residueel risico = NA maatregelen.',
    veelgemaakteFout: 'Een risico-eigenaar is niet altijd de PM - het is degene die het beste gepositioneerd is.',
  },
  'Wijziging': {
    tip: 'Drie typen issues: Wijzigingsverzoek, Afwijking (off-spec), Probleem/zorg.',
    redeneerHulp: 'Een baseline kan alleen worden gewijzigd via formeel wijzigingsbeheer.',
    veelgemaakteFout: 'De wijzigingsautoriteit beslist, niet automatisch de PM of Stuurgroep.',
  },
  'Voortgang': {
    tip: 'Time-driven = periodiek (Highlight Reports). Event-driven = bij gebeurtenissen (Afwijkingsrapport).',
    redeneerHulp: 'Zes tolerantieaspecten: Tijd, Kosten, Kwaliteit, Scope, Risico, Benefits.',
    veelgemaakteFout: 'Het dagboek van de PM is informeel, geen formeel register.',
  },
  'Processen': {
    tip: 'Zeven processen. Alleen "Sturen van Project" is voor de Stuurgroep en loopt door het hele project.',
    redeneerHulp: 'Opstarten → Projectvoorstel. Initiëren → PID. Afsluiten → Eindrapport.',
    veelgemaakteFout: 'Initiëren produceert de PID, niet het Projectvoorstel (dat is Opstarten).',
  },
  'Principes': {
    tip: 'Zeven principes. Als een principe niet wordt toegepast, is het geen PRINCE2-project.',
    redeneerHulp: 'Voortdurende zakelijke rechtvaardiging = de rode draad door het hele project.',
    veelgemaakteFout: 'Manage by exception gaat over toleranties, niet over uitzonderingen negeren.',
  },
  'Concepten': {
    tip: 'Project = tijdelijk, uniek, met begin en einde. Programma = coördineert meerdere projecten.',
    redeneerHulp: 'Vijf elementen: Principes, Practices, Processen, Context, Mensen.',
    veelgemaakteFout: 'PRINCE2 is generiek - toepasbaar op elk type project, niet alleen IT.',
  },
};

export default function ResultScreen() {
  const router = useRouter();
  const { score, vragen, antwoorden, resetQuiz, gekozenExamen } = useQuizStore();
  const [expandedVragen, setExpandedVragen] = useState<Record<number, boolean>>({});
  const [showTips, setShowTips] = useState(true);
  const totaal = vragen.length;
  const percentage = totaal > 0 ? Math.round((score / totaal) * 100) : 0;
  const geslaagd = percentage >= 60; // PRINCE2 pass mark is 60%

  const fouteAntwoorden = antwoorden.filter((a) => !a.correct);
  const fouteVragen = fouteAntwoorden
    .map((a) => vragen.find((v) => v.id === a.vraagId))
    .filter(Boolean);

  const goedeAntwoorden = antwoorden.filter((a) => a.correct);
  const goedeVragen = goedeAntwoorden
    .map((a) => vragen.find((v) => v.id === a.vraagId))
    .filter(Boolean);

  const [showCorrect, setShowCorrect] = useState(false);

  // Calculate theme statistics
  const themaStats = useMemo(() => {
    const stats: Record<string, { correct: number; fout: number; totaal: number }> = {};

    antwoorden.forEach((antwoord) => {
      const vraag = vragen.find((v) => v.id === antwoord.vraagId);
      if (vraag) {
        const thema = vraag.thema;
        if (!stats[thema]) {
          stats[thema] = { correct: 0, fout: 0, totaal: 0 };
        }
        stats[thema].totaal++;
        if (antwoord.correct) {
          stats[thema].correct++;
        } else {
          stats[thema].fout++;
        }
      }
    });

    return stats;
  }, [antwoorden, vragen]);

  // Get weak themes (themes with >30% errors)
  const zwakkeThemas = useMemo(() => {
    return Object.entries(themaStats)
      .filter(([_, stats]) => stats.fout > 0 && (stats.fout / stats.totaal) > 0.3)
      .sort((a, b) => b[1].fout - a[1].fout)
      .map(([thema]) => thema);
  }, [themaStats]);

  // Get all themes with errors for tips
  const themasMetFouten = useMemo(() => {
    return Object.entries(themaStats)
      .filter(([_, stats]) => stats.fout > 0)
      .sort((a, b) => b[1].fout - a[1].fout)
      .map(([thema, stats]) => ({ thema, ...stats }));
  }, [themaStats]);

  const toggleExpand = (vraagId: number) => {
    setExpandedVragen(prev => ({ ...prev, [vraagId]: !prev[vraagId] }));
  };

  const examenNaam = gekozenExamen === 'alle' ? 'Alle vragen' :
    gekozenExamen ? `Proefexamen ${gekozenExamen.replace('proefexamen', '')}` : 'Quiz';

  const handleOpnieuw = () => {
    resetQuiz();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Result Header */}
          <View style={styles.resultHeader}>
            <Text style={styles.examenNaam}>{examenNaam}</Text>
            <View style={[styles.percentageCircle, geslaagd ? styles.circleGeslaagd : styles.circleGezakt]}>
              <Text style={styles.percentageText}>{percentage}%</Text>
            </View>
            <Text style={styles.resultTitle}>
              {geslaagd ? 'Gefeliciteerd!' : 'Blijf oefenen!'}
            </Text>
            <Text style={styles.resultSubtitle}>
              {geslaagd
                ? 'Je hebt de quiz succesvol afgerond.'
                : 'Je hebt nog wat werk te doen. Probeer het opnieuw!'}
            </Text>
            <Text style={styles.passInfo}>
              (Slagingspercentage: 60% = 36 van 60 vragen)
            </Text>
          </View>

          {/* Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Jouw Score</Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreNumber, styles.scoreCorrect]}>{score}</Text>
                <Text style={styles.scoreLabel}>Correct</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreNumber, styles.scoreFout]}>{totaal - score}</Text>
                <Text style={styles.scoreLabel}>Fout</Text>
              </View>
              <View style={styles.scoreDivider} />
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreNumber, styles.scoreTotaal]}>{totaal}</Text>
                <Text style={styles.scoreLabel}>Totaal</Text>
              </View>
            </View>
          </View>

          {/* Theme Analysis */}
          {themasMetFouten.length > 0 && (
            <View style={styles.themaAnalyseCard}>
              <Text style={styles.themaAnalyseTitle}>📊 Thema-analyse</Text>
              <Text style={styles.themaAnalyseSubtitle}>Jouw prestatie per onderwerp</Text>
              {Object.entries(themaStats).map(([thema, stats]) => {
                const percentage = Math.round((stats.correct / stats.totaal) * 100);
                const isZwak = stats.fout > 0 && (stats.fout / stats.totaal) > 0.3;
                return (
                  <View key={thema} style={styles.themaRow}>
                    <View style={styles.themaInfo}>
                      <Text style={[styles.themaNaam, isZwak && styles.themaNaamZwak]}>{thema}</Text>
                      <Text style={styles.themaScore}>{stats.correct}/{stats.totaal}</Text>
                    </View>
                    <View style={styles.themaBarContainer}>
                      <View style={[styles.themaBar, { width: `${percentage}%` }, isZwak ? styles.themaBarZwak : styles.themaBarGoed]} />
                    </View>
                    {isZwak && <Text style={styles.themaWarning}>⚠️</Text>}
                  </View>
                );
              })}
            </View>
          )}

          {/* Tips & Recommendations Card - NEW */}
          {themasMetFouten.length > 0 && (
            <View style={styles.tipsCard}>
              <Pressable onPress={() => setShowTips(!showTips)} style={styles.tipsHeader}>
                <View>
                  <Text style={styles.tipsTitle}>💡 Aanbevelingen & Tips</Text>
                  <Text style={styles.tipsSubtitle}>Hoe je deze vragen beter kunt beredeneren</Text>
                </View>
                <Text style={styles.expandIcon}>{showTips ? '▼' : '▶'}</Text>
              </Pressable>

              {showTips && (
                <View style={styles.tipsContent}>
                  {themasMetFouten.map(({ thema, fout, totaal }) => {
                    const tips = themaTips[thema];
                    if (!tips) return null;
                    return (
                      <View key={thema} style={styles.themaTipCard}>
                        <View style={styles.themaTipHeader}>
                          <Text style={styles.themaTipTitle}>{thema}</Text>
                          <Text style={styles.themaTipFout}>{fout} fout</Text>
                        </View>

                        <View style={styles.tipSection}>
                          <Text style={styles.tipSectionIcon}>📚</Text>
                          <View style={styles.tipSectionContent}>
                            <Text style={styles.tipSectionLabel}>Studietip:</Text>
                            <Text style={styles.tipSectionText}>{tips.tip}</Text>
                          </View>
                        </View>

                        <View style={styles.tipSection}>
                          <Text style={styles.tipSectionIcon}>🧠</Text>
                          <View style={styles.tipSectionContent}>
                            <Text style={styles.tipSectionLabel}>Redeneerhulp:</Text>
                            <Text style={styles.tipSectionText}>{tips.redeneerHulp}</Text>
                          </View>
                        </View>

                        <View style={[styles.tipSection, styles.tipSectionWarning]}>
                          <Text style={styles.tipSectionIcon}>⚠️</Text>
                          <View style={styles.tipSectionContent}>
                            <Text style={styles.tipSectionLabelWarning}>Veelgemaakte fout:</Text>
                            <Text style={styles.tipSectionTextWarning}>{tips.veelgemaakteFout}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {/* General reasoning tips */}
                  <View style={styles.algemeneTipsCard}>
                    <Text style={styles.algemeneTipsTitle}>🎯 Algemene Beredeneerstrategieën</Text>
                    <View style={styles.algemeneTip}>
                      <Text style={styles.algemeneTipBullet}>•</Text>
                      <Text style={styles.algemeneTipText}>
                        <Text style={styles.bold}>Let op absolute woorden:</Text> "Altijd", "nooit", "alleen" zijn vaak fout - PRINCE2 is flexibel.
                      </Text>
                    </View>
                    <View style={styles.algemeneTip}>
                      <Text style={styles.algemeneTipBullet}>•</Text>
                      <Text style={styles.algemeneTipText}>
                        <Text style={styles.bold}>Check de rolverdeling:</Text> De PM doet dagelijks werk, de Stuurgroep beslist op strategisch niveau.
                      </Text>
                    </View>
                    <View style={styles.algemeneTip}>
                      <Text style={styles.algemeneTipBullet}>•</Text>
                      <Text style={styles.algemeneTipText}>
                        <Text style={styles.bold}>Wanneer gebeurt het?:</Text> Opstarten (begin), Initiëren (PID maken), Afsluiten (einde).
                      </Text>
                    </View>
                    <View style={styles.algemeneTip}>
                      <Text style={styles.algemeneTipBullet}>•</Text>
                      <Text style={styles.algemeneTipText}>
                        <Text style={styles.bold}>Wie is eigenaar?:</Text> Opdrachtgever = Business Case, Senior Gebruiker = behoeften, Senior Leverancier = middelen.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Wrong Answers */}
          {fouteVragen.length > 0 && (
            <View style={styles.wrongCard}>
              <Text style={styles.wrongTitle}>Te verbeteren ({fouteVragen.length})</Text>
              <Text style={styles.wrongHint}>Tik op een vraag voor meer details</Text>
              {fouteVragen.map((vraag, index) => {
                if (!vraag) return null;
                const antwoord = fouteAntwoorden.find((a) => a.vraagId === vraag.id);
                const isExpanded = expandedVragen[vraag.id];
                const gekozenKey = antwoord?.gekozen as 'A' | 'B' | 'C' | 'D';
                const correctKey = vraag.correct as 'A' | 'B' | 'C' | 'D';
                return (
                  <Pressable
                    key={vraag.id}
                    onPress={() => toggleExpand(vraag.id)}
                    style={[
                      styles.wrongItem,
                      index < fouteVragen.length - 1 && styles.wrongItemBorder,
                    ]}
                  >
                    <View style={styles.wrongHeader}>
                      <Text style={styles.wrongThema}>{vraag.thema}</Text>
                      <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                    </View>
                    <Text style={styles.wrongVraag} numberOfLines={isExpanded ? undefined : 2}>
                      {vraag.vraag}
                    </Text>
                    <View style={styles.wrongAnswerBadges}>
                      <View style={styles.badgeFout}>
                        <Text style={styles.badgeFoutText}>Jouw: {gekozenKey}</Text>
                      </View>
                      <View style={styles.badgeCorrect}>
                        <Text style={styles.badgeCorrectText}>Correct: {correctKey}</Text>
                      </View>
                    </View>

                    {isExpanded && (
                      <View style={styles.expandedContent}>
                        <View style={styles.optieContainer}>
                          <View style={[styles.optieBox, styles.optieFout]}>
                            <Text style={styles.optieLabel}>Jouw antwoord ({gekozenKey}):</Text>
                            <Text style={styles.optieText}>{vraag.opties[gekozenKey]}</Text>
                          </View>
                          <View style={[styles.optieBox, styles.optieGoed]}>
                            <Text style={styles.optieLabel}>Correct antwoord ({correctKey}):</Text>
                            <Text style={styles.optieText}>{vraag.opties[correctKey]}</Text>
                          </View>
                        </View>
                        <View style={styles.uitlegBox}>
                          <Text style={styles.uitlegLabel}>Uitleg:</Text>
                          <Text style={styles.uitlegText}>{vraag.uitleg}</Text>
                        </View>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Correct Answers */}
          {goedeVragen.length > 0 && (
            <View style={styles.correctCard}>
              <Pressable
                onPress={() => setShowCorrect(!showCorrect)}
                style={styles.correctHeader}
              >
                <Text style={styles.correctTitle}>Goed beantwoord ({goedeVragen.length})</Text>
                <Text style={styles.expandIcon}>{showCorrect ? '▼' : '▶'}</Text>
              </Pressable>
              {showCorrect && (
                <>
                  <Text style={styles.correctHint}>Tik op een vraag voor meer details</Text>
                  {goedeVragen.map((vraag, index) => {
                    if (!vraag) return null;
                    const antwoord = goedeAntwoorden.find((a) => a.vraagId === vraag.id);
                    const isExpanded = expandedVragen[vraag.id];
                    const gekozenKey = antwoord?.gekozen as 'A' | 'B' | 'C' | 'D';
                    return (
                      <Pressable
                        key={vraag.id}
                        onPress={() => toggleExpand(vraag.id)}
                        style={[
                          styles.correctItem,
                          index < goedeVragen.length - 1 && styles.correctItemBorder,
                        ]}
                      >
                        <View style={styles.correctItemHeader}>
                          <Text style={styles.correctThema}>{vraag.thema}</Text>
                          <Text style={styles.expandIcon}>{isExpanded ? '▼' : '▶'}</Text>
                        </View>
                        <Text style={styles.correctVraag} numberOfLines={isExpanded ? undefined : 2}>
                          {vraag.vraag}
                        </Text>
                        <View style={styles.correctBadge}>
                          <Text style={styles.correctBadgeText}>Correct: {gekozenKey}</Text>
                        </View>

                        {isExpanded && (
                          <View style={styles.expandedContent}>
                            <View style={[styles.optieBox, styles.optieGoed]}>
                              <Text style={styles.optieLabel}>Jouw antwoord ({gekozenKey}):</Text>
                              <Text style={styles.optieText}>{vraag.opties[gekozenKey]}</Text>
                            </View>
                            <View style={[styles.uitlegBox, { marginTop: 10 }]}>
                              <Text style={styles.uitlegLabel}>Uitleg:</Text>
                              <Text style={styles.uitlegText}>{vraag.uitleg}</Text>
                            </View>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </>
              )}
            </View>
          )}

          {/* Actions */}
          <Pressable
            onPress={handleOpnieuw}
            style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          >
            <Text style={styles.primaryButtonText}>Opnieuw Proberen</Text>
          </Pressable>

          <Pressable onPress={() => router.replace('/')} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Terug naar Home</Text>
          </Pressable>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  examenNaam: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  circleGeslaagd: {
    backgroundColor: '#22c55e',
  },
  circleGezakt: {
    backgroundColor: '#ef4444',
  },
  percentageText: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  resultSubtitle: {
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  passInfo: {
    color: '#9ca3af',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  scoreCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scoreCorrect: {
    color: '#22c55e',
  },
  scoreFout: {
    color: '#ef4444',
  },
  scoreTotaal: {
    color: '#2563eb',
  },
  scoreLabel: {
    color: '#6b7280',
    fontSize: 14,
    marginTop: 4,
  },
  scoreDivider: {
    width: 1,
    height: 48,
    backgroundColor: '#e5e7eb',
  },
  // Theme Analysis Styles
  themaAnalyseCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  themaAnalyseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  themaAnalyseSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 16,
  },
  themaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  themaInfo: {
    width: 120,
  },
  themaNaam: {
    fontSize: 13,
    fontWeight: '500',
    color: '#374151',
  },
  themaNaamZwak: {
    color: '#dc2626',
  },
  themaScore: {
    fontSize: 11,
    color: '#9ca3af',
  },
  themaBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  themaBar: {
    height: 8,
    borderRadius: 4,
  },
  themaBarGoed: {
    backgroundColor: '#22c55e',
  },
  themaBarZwak: {
    backgroundColor: '#f97316',
  },
  themaWarning: {
    fontSize: 12,
  },
  // Tips Card Styles
  tipsCard: {
    backgroundColor: '#fffbeb',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fcd34d',
    marginBottom: 24,
    overflow: 'hidden',
  },
  tipsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#92400e',
  },
  tipsSubtitle: {
    fontSize: 12,
    color: '#b45309',
    marginTop: 2,
  },
  tipsContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  themaTipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  themaTipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  themaTipTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#92400e',
  },
  themaTipFout: {
    fontSize: 12,
    color: '#dc2626',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tipSection: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#f9fafb',
    padding: 10,
    borderRadius: 8,
  },
  tipSectionWarning: {
    backgroundColor: '#fef2f2',
  },
  tipSectionIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  tipSectionContent: {
    flex: 1,
  },
  tipSectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  tipSectionLabelWarning: {
    fontSize: 11,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  tipSectionText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  tipSectionTextWarning: {
    fontSize: 13,
    color: '#991b1b',
    lineHeight: 18,
  },
  algemeneTipsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  algemeneTipsTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e40af',
    marginBottom: 12,
  },
  algemeneTip: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  algemeneTipBullet: {
    fontSize: 14,
    color: '#2563eb',
    marginRight: 8,
    fontWeight: 'bold',
  },
  algemeneTipText: {
    flex: 1,
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 10,
    color: '#9ca3af',
  },
  wrongCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wrongTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  wrongHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 16,
  },
  wrongItem: {
    paddingVertical: 16,
  },
  wrongItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  wrongHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  wrongThema: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  wrongVraag: {
    color: '#111827',
    marginBottom: 10,
    lineHeight: 22,
    fontSize: 15,
  },
  wrongAnswerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  badgeFout: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  badgeFoutText: {
    color: '#dc2626',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeCorrect: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  badgeCorrectText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
  },
  optieContainer: {
    gap: 10,
    marginBottom: 12,
  },
  optieBox: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  optieFout: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  optieGoed: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  optieLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  optieText: {
    fontSize: 14,
    color: '#111827',
    lineHeight: 20,
  },
  uitlegBox: {
    backgroundColor: '#eff6ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  uitlegLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1d4ed8',
    textTransform: 'uppercase',
  },
  uitlegText: {
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  primaryButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontSize: 18,
    fontWeight: '600',
  },
  correctCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 2,
    borderColor: '#bbf7d0',
  },
  correctHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  correctTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#16a34a',
  },
  correctHint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    marginBottom: 16,
  },
  correctItem: {
    paddingVertical: 16,
  },
  correctItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#dcfce7',
  },
  correctItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  correctThema: {
    fontSize: 11,
    color: '#16a34a',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  correctVraag: {
    color: '#111827',
    marginBottom: 10,
    lineHeight: 22,
    fontSize: 15,
  },
  correctBadge: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    alignSelf: 'flex-start',
  },
  correctBadgeText: {
    color: '#16a34a',
    fontSize: 12,
    fontWeight: '600',
  },
});
