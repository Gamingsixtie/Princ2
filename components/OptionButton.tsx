import { Pressable, Text, View, StyleSheet } from 'react-native';
import { OptieKey } from '../types';

interface OptionButtonProps {
  optieKey: OptieKey;
  tekst: string;
  onPress: () => void;
  disabled: boolean;
  isSelected: boolean;
  isCorrect: boolean;
  showResult: boolean;
}

export function OptionButton({
  optieKey,
  tekst,
  onPress,
  disabled,
  isSelected,
  isCorrect,
  showResult,
}: OptionButtonProps) {
  const getBackgroundColor = () => {
    if (!showResult) {
      return isSelected ? '#dbeafe' : 'white';
    }
    if (isCorrect) {
      return '#dcfce7';
    }
    if (isSelected && !isCorrect) {
      return '#fee2e2';
    }
    return 'white';
  };

  const getBorderColor = () => {
    if (!showResult) {
      return isSelected ? '#2563eb' : '#d1d5db';
    }
    if (isCorrect) {
      return '#22c55e';
    }
    if (isSelected && !isCorrect) {
      return '#ef4444';
    }
    return '#d1d5db';
  };

  const getTextColor = () => {
    if (!showResult) {
      return isSelected ? '#2563eb' : '#1f2937';
    }
    if (isCorrect) {
      return '#16a34a';
    }
    if (isSelected && !isCorrect) {
      return '#dc2626';
    }
    return '#1f2937';
  };

  const getCircleBackgroundColor = () => {
    if (showResult && isCorrect) return '#22c55e';
    if (showResult && isSelected && !isCorrect) return '#ef4444';
    if (isSelected) return '#2563eb';
    return '#e5e7eb';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() },
      ]}
    >
      <View style={[styles.circle, { backgroundColor: getCircleBackgroundColor() }]}>
        <Text
          style={[
            styles.circleText,
            { color: isSelected || (showResult && isCorrect) ? 'white' : '#4b5563' },
          ]}
        >
          {optieKey}
        </Text>
      </View>
      <Text style={[styles.optionText, { color: getTextColor() }]}>{tekst}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
    cursor: 'pointer',
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  circleText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
