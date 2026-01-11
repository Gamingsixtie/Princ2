import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import trendsData from '../data/trends.json';

type Sectie = typeof trendsData.secties[0];

const iconMap: Record<string, string> = {
  '📊': '📊',
  '🎯': '🎯',
  '⚠️': '⚠️',
  '🔍': '🔍',
  '🔑': '🔑',
  '🔢': '🔢',
  '❌': '❌',
  '💡': '💡',
};

export default function TrendsScreen() {
  const router = useRouter();
  const [selectedSectie, setSelectedSectie] = useState<Sectie | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const handleSectiePress = (sectie: Sectie) => {
    setSelectedSectie(sectie);
    setExpandedItems(new Set());
  };

  const handleBack = () => {
    if (selectedSectie) {
      setSelectedSectie(null);
    } else {
      router.back();
    }
  };

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const expandAll = () => {
    if (selectedSectie) {
      const allIndices = selectedSectie.items.map((_, i) => i);
      setExpandedItems(new Set(allIndices));
    }
  };

  const collapseAll = () => {
    setExpandedItems(new Set());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>
              {selectedSectie ? '← Terug' : '← Home'}
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {selectedSectie ? selectedSectie.titel : 'Trends & Patronen'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {!selectedSectie ? (
          // Section List
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.introCard}>
              <Text style={styles.introIcon}>📈</Text>
              <Text style={styles.introTitle}>Examenanalyse</Text>
              <Text style={styles.introText}>
                Op basis van analyse van 180+ examenvragen heb ik patronen ontdekt die je helpen het examen te halen. Gebruik deze inzichten slim!
              </Text>
            </View>

            <View style={styles.sectieList}>
              {trendsData.secties.map((sectie) => (
                <Pressable
                  key={sectie.id}
                  style={({ pressed }) => [
                    styles.sectieCard,
                    pressed && styles.sectieCardPressed,
                  ]}
                  onPress={() => handleSectiePress(sectie)}
                >
                  <Text style={styles.sectieIcon}>{sectie.icon}</Text>
                  <View style={styles.sectieTextContainer}>
                    <Text style={styles.sectieTitel}>{sectie.titel}</Text>
                    <Text style={styles.sectieBeschrijving}>{sectie.beschrijving}</Text>
                  </View>
                  <Text style={styles.sectieArrow}>→</Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          // Section Detail
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionIcon}>{selectedSectie.icon}</Text>
              <Text style={styles.descriptionText}>{selectedSectie.beschrijving}</Text>
            </View>

            {/* Expand/Collapse buttons */}
            <View style={styles.expandButtons}>
              <Pressable style={styles.expandButton} onPress={expandAll}>
                <Text style={styles.expandButtonText}>Alles uitklappen</Text>
              </Pressable>
              <Pressable style={styles.expandButton} onPress={collapseAll}>
                <Text style={styles.expandButtonText}>Alles inklappen</Text>
              </Pressable>
            </View>

            {/* Items */}
            <View style={styles.itemsList}>
              {selectedSectie.items.map((item, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.itemCard,
                    item.belangrijk && styles.itemCardImportant,
                  ]}
                  onPress={() => toggleItem(index)}
                >
                  <View style={styles.itemHeader}>
                    {item.belangrijk && (
                      <Text style={styles.importantBadge}>BELANGRIJK</Text>
                    )}
                    <Text style={[
                      styles.itemTitel,
                      item.belangrijk && styles.itemTitelImportant,
                    ]}>
                      {item.titel}
                    </Text>
                    <Text style={styles.expandIcon}>
                      {expandedItems.has(index) ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedItems.has(index) && (
                    <Text style={styles.itemInhoud}>{item.inhoud}</Text>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Bottom tip */}
            <View style={styles.bottomTip}>
              <Text style={styles.bottomTipIcon}>🎓</Text>
              <Text style={styles.bottomTipText}>
                Items gemarkeerd als BELANGRIJK komen het vaakst voor op het examen!
              </Text>
            </View>
          </ScrollView>
        )}
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
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  backButton: {
    padding: 4,
  },
  backButtonText: {
    color: '#2563eb',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  headerSpacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  introCard: {
    backgroundColor: '#1e40af',
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  introIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  sectieList: {
    paddingBottom: 24,
  },
  sectieCard: {
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectieCardPressed: {
    backgroundColor: '#f9fafb',
  },
  sectieIcon: {
    fontSize: 28,
    marginRight: 14,
  },
  sectieTextContainer: {
    flex: 1,
  },
  sectieTitel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sectieBeschrijving: {
    fontSize: 13,
    color: '#6b7280',
  },
  sectieArrow: {
    fontSize: 18,
    color: '#9ca3af',
  },
  descriptionCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  descriptionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  descriptionText: {
    flex: 1,
    fontSize: 15,
    color: '#1e40af',
    fontWeight: '500',
  },
  expandButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
    marginBottom: 8,
  },
  expandButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
  },
  expandButtonText: {
    fontSize: 12,
    color: '#4b5563',
  },
  itemsList: {
    paddingTop: 8,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e5e7eb',
  },
  itemCardImportant: {
    borderLeftColor: '#f59e0b',
    backgroundColor: '#fffbeb',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  importantBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#b45309',
    backgroundColor: '#fde68a',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  itemTitel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    paddingRight: 8,
  },
  itemTitelImportant: {
    color: '#92400e',
  },
  expandIcon: {
    fontSize: 20,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  itemInhoud: {
    marginTop: 12,
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  bottomTip: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 14,
    marginVertical: 20,
    alignItems: 'center',
  },
  bottomTipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  bottomTipText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 20,
  },
});
