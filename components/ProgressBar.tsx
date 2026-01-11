import { View, Text, StyleSheet } from 'react-native';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.textRow}>
        <Text style={styles.text}>Vraag {current} van {total}</Text>
        <Text style={styles.text}>{Math.round(percentage)}%</Text>
      </View>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  text: {
    color: '#6b7280',
    fontSize: 14,
  },
  barBackground: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 4,
  },
});
