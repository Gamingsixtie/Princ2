import { useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import weetjesData from '../data/weetjes.json';

type Categorie = typeof weetjesData.categorieen[0];

const iconMap: Record<string, string> = {
  target: '🎯',
  star: '⭐',
  book: '📚',
  flow: '🔄',
  users: '👥',
  document: '📄',
  question: '❓',
  lightbulb: '💡',
};

export default function WeetjesScreen() {
  const router = useRouter();
  const [selectedCategorie, setSelectedCategorie] = useState<Categorie | null>(null);
  const [expandedItem, setExpandedItem] = useState<number | null>(null);

  const handleCategoriePress = (categorie: Categorie) => {
    setSelectedCategorie(categorie);
    setExpandedItem(null);
  };

  const handleBack = () => {
    if (selectedCategorie) {
      setSelectedCategorie(null);
    } else {
      router.back();
    }
  };

  const toggleItem = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={handleBack} style={styles.backButton}>
            <Text style={styles.backButtonText}>
              {selectedCategorie ? '← Terug' : '← Home'}
            </Text>
          </Pressable>
          <Text style={styles.headerTitle}>
            {selectedCategorie ? selectedCategorie.titel : 'Weetjes'}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {!selectedCategorie ? (
          // Category List
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Text style={styles.introText}>
              Leer de belangrijkste PRINCE2 concepten en herken vraagpatronen voor het examen.
            </Text>

            <View style={styles.categorieGrid}>
              {weetjesData.categorieen.map((categorie) => (
                <Pressable
                  key={categorie.id}
                  style={({ pressed }) => [
                    styles.categorieCard,
                    pressed && styles.categorieCardPressed,
                  ]}
                  onPress={() => handleCategoriePress(categorie)}
                >
                  <Text style={styles.categorieIcon}>
                    {iconMap[categorie.icon] || '📌'}
                  </Text>
                  <Text style={styles.categorieTitel}>{categorie.titel}</Text>
                  <Text style={styles.categorieCount}>
                    {categorie.items.length} items
                  </Text>
                </Pressable>
              ))}
            </View>
          </ScrollView>
        ) : (
          // Category Detail
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.itemsList}>
              {selectedCategorie.items.map((item, index) => (
                <Pressable
                  key={index}
                  style={styles.itemCard}
                  onPress={() => toggleItem(index)}
                >
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitel}>{item.titel}</Text>
                    <Text style={styles.expandIcon}>
                      {expandedItem === index ? '−' : '+'}
                    </Text>
                  </View>
                  {expandedItem === index && (
                    <Text style={styles.itemInhoud}>{item.inhoud}</Text>
                  )}
                </Pressable>
              ))}
            </View>

            {/* Quick tip */}
            <View style={styles.tipCard}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                Tip: Klik op een item om de uitleg te zien. Leer deze weetjes uit je hoofd voor het examen!
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
  introText: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 22,
  },
  categorieGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  categorieCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categorieCardPressed: {
    backgroundColor: '#f9fafb',
  },
  categorieIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categorieTitel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 4,
  },
  categorieCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemsList: {
    paddingTop: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    paddingRight: 8,
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
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});
