import { View, Text, StyleSheet } from 'react-native';
import { Vraag, OptieKey } from '../types';
import { OptionButton } from './OptionButton';

interface QuestionCardProps {
  vraag: Vraag;
  onSelectAnswer: (antwoord: OptieKey) => void;
  gekozenAntwoord: OptieKey | null;
  vraagBeantwoord: boolean;
}

// Parse the uitleg to separate explanations for each option
function parseUitleg(uitleg: string): { optie: string; tekst: string }[] {
  // Split on patterns like "A." "B." "C." "D." at the start or after space
  const parts = uitleg.split(/(?=\b[A-D]\.\s)/);

  return parts
    .filter(part => part.trim())
    .map(part => {
      const match = part.match(/^([A-D])\.\s*(.+)/s);
      if (match) {
        return { optie: match[1], tekst: match[2].trim() };
      }
      return { optie: '', tekst: part.trim() };
    })
    .filter(item => item.tekst);
}

export function QuestionCard({
  vraag,
  onSelectAnswer,
  gekozenAntwoord,
  vraagBeantwoord,
}: QuestionCardProps) {
  const opties: OptieKey[] = ['A', 'B', 'C', 'D'];
  const isCorrect = gekozenAntwoord === vraag.correct;
  const uitlegParts = parseUitleg(vraag.uitleg);
  const hasStructuredUitleg = uitlegParts.length > 1;

  return (
    <View style={styles.container}>
      {/* Question */}
      <View style={styles.questionCard}>
        <Text style={styles.themaLabel}>{vraag.thema}</Text>
        <Text style={styles.vraagText}>{vraag.vraag}</Text>
      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {opties.map((key) => (
          <OptionButton
            key={key}
            optieKey={key}
            tekst={vraag.opties[key]}
            onPress={() => onSelectAnswer(key)}
            disabled={vraagBeantwoord}
            isSelected={gekozenAntwoord === key}
            isCorrect={vraag.correct === key}
            showResult={vraagBeantwoord}
          />
        ))}
      </View>

      {/* Explanation */}
      {vraagBeantwoord && (
        <View style={[styles.uitlegCard, isCorrect ? styles.uitlegCorrect : styles.uitlegFout]}>
          <Text style={[styles.uitlegHeader, isCorrect ? styles.textCorrect : styles.textFout]}>
            {isCorrect ? '✓ Correct!' : '✗ Helaas, fout'}
          </Text>

          {/* Show comparison when wrong */}
          {!isCorrect && gekozenAntwoord && (
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonBox}>
                <View style={styles.comparisonHeader}>
                  <View style={styles.comparisonBadgeFout}>
                    <Text style={styles.comparisonBadgeText}>{gekozenAntwoord}</Text>
                  </View>
                  <Text style={styles.comparisonLabelFout}>Jouw antwoord</Text>
                </View>
                <Text style={styles.comparisonText}>{vraag.opties[gekozenAntwoord]}</Text>
                {uitlegParts.find(p => p.optie === gekozenAntwoord) && (
                  <Text style={styles.comparisonUitlegFout}>
                    {uitlegParts.find(p => p.optie === gekozenAntwoord)?.tekst}
                  </Text>
                )}
              </View>
              <View style={[styles.comparisonBox, styles.comparisonBoxCorrect]}>
                <View style={styles.comparisonHeader}>
                  <View style={styles.comparisonBadgeCorrect}>
                    <Text style={styles.comparisonBadgeText}>{vraag.correct}</Text>
                  </View>
                  <Text style={styles.comparisonLabelCorrect}>Correct antwoord</Text>
                </View>
                <Text style={styles.comparisonText}>{vraag.opties[vraag.correct]}</Text>
                {uitlegParts.find(p => p.optie === vraag.correct) ? (
                  <Text style={styles.comparisonUitlegCorrect}>
                    {uitlegParts.find(p => p.optie === vraag.correct)?.tekst}
                  </Text>
                ) : (
                  <Text style={styles.comparisonUitlegCorrect}>
                    {vraag.uitleg}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Show success message when correct */}
          {isCorrect && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                {vraag.correct}. {vraag.opties[vraag.correct]}
              </Text>
              {uitlegParts.find(p => p.optie === vraag.correct) ? (
                <Text style={styles.successUitleg}>
                  {uitlegParts.find(p => p.optie === vraag.correct)?.tekst}
                </Text>
              ) : (
                <Text style={styles.successUitleg}>
                  {vraag.uitleg}
                </Text>
              )}
            </View>
          )}

          {/* Full explanation section */}
          <View style={styles.uitlegContent}>
            <Text style={styles.uitlegSectionTitle}>Volledige toelichting:</Text>
            {hasStructuredUitleg ? (
              uitlegParts.map((part, index) => (
                <View key={index} style={styles.uitlegItem}>
                  {part.optie && (
                    <View style={[
                      styles.uitlegOptieLabel,
                      part.optie === vraag.correct ? styles.uitlegOptieLabelCorrect :
                      part.optie === gekozenAntwoord && !isCorrect ? styles.uitlegOptieLabelFout :
                      styles.uitlegOptieLabelNormal
                    ]}>
                      <Text style={[
                        styles.uitlegOptieText,
                        (part.optie === vraag.correct || (part.optie === gekozenAntwoord && !isCorrect))
                          ? styles.uitlegOptieTextCorrect
                          : styles.uitlegOptieTextNormal
                      ]}>
                        {part.optie}
                      </Text>
                    </View>
                  )}
                  <Text style={[
                    styles.uitlegTekst,
                    part.optie === vraag.correct && styles.uitlegTekstCorrect,
                    part.optie === gekozenAntwoord && !isCorrect && styles.uitlegTekstFout
                  ]}>{part.tekst}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.uitlegTekst}>{vraag.uitleg}</Text>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  questionCard: {
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
  themaLabel: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  vraagText: {
    fontSize: 18,
    color: '#111827',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  uitlegCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  uitlegCorrect: {
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  uitlegFout: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  uitlegHeader: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
  },
  textCorrect: {
    color: '#16a34a',
  },
  textFout: {
    color: '#dc2626',
  },
  comparisonContainer: {
    gap: 12,
    marginBottom: 16,
  },
  comparisonBox: {
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  comparisonBoxCorrect: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  comparisonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  comparisonBadgeFout: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  comparisonBadgeCorrect: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  comparisonBadgeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  comparisonLabelFout: {
    fontSize: 12,
    fontWeight: '600',
    color: '#dc2626',
    textTransform: 'uppercase',
  },
  comparisonLabelCorrect: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
    textTransform: 'uppercase',
  },
  comparisonText: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    marginBottom: 8,
  },
  comparisonUitlegFout: {
    fontSize: 13,
    color: '#991b1b',
    fontStyle: 'italic',
    lineHeight: 20,
    backgroundColor: '#fee2e2',
    padding: 10,
    borderRadius: 8,
  },
  comparisonUitlegCorrect: {
    fontSize: 13,
    color: '#166534',
    fontStyle: 'italic',
    lineHeight: 20,
    backgroundColor: '#dcfce7',
    padding: 10,
    borderRadius: 8,
  },
  successBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  successText: {
    fontSize: 15,
    color: '#166534',
    fontWeight: '600',
    marginBottom: 8,
  },
  successUitleg: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 22,
  },
  uitlegContent: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  uitlegSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  uitlegItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  uitlegOptieLabel: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    flexShrink: 0,
  },
  uitlegOptieLabelCorrect: {
    backgroundColor: '#22c55e',
  },
  uitlegOptieLabelNormal: {
    backgroundColor: '#e5e7eb',
  },
  uitlegOptieLabelFout: {
    backgroundColor: '#dc2626',
  },
  uitlegOptieText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  uitlegOptieTextCorrect: {
    color: 'white',
  },
  uitlegOptieTextNormal: {
    color: '#4b5563',
  },
  uitlegTekst: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
  },
  uitlegTekstCorrect: {
    color: '#166534',
    fontWeight: '500',
  },
  uitlegTekstFout: {
    color: '#991b1b',
  },
});
