import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function CategoryPill({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const progress = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    progress.value = withTiming(selected ? 1 : 0, { duration: 250 });
  }, [progress, selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [colors.white, colors.primary]
    ),
    borderColor: interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(0,0,0,0.10)', colors.primary]
    ),
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        animatedStyle,
        selected ? styles.selected : styles.unselected,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.text, selected ? styles.selectedText : styles.unselectedText]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.full,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderWidth: 1.5,
  },
  selected: {
    borderColor: colors.primary,
  },
  unselected: {
    borderColor: 'rgba(0,0,0,0.10)',
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 13,
  },
  selectedText: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  unselectedText: {
    color: colors.textHeading,
    fontFamily: fonts.bodyMedium,
  },
});
