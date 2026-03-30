import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors, radius, shadows, spacing } from '../constants/theme';

export function SkeletonCard() {
  const opacity = useSharedValue(0.4);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.4, { duration: 600 })
      ),
      -1,
      false
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.image} />
      <View style={styles.body}>
        <View style={[styles.line, { width: '40%', height: 10 }]} />
        <View style={[styles.line, { width: '78%', height: 18 }]} />
        <View style={[styles.line, { width: '95%', height: 14 }]} />
        <View style={[styles.line, { width: '60%', height: 14 }]} />
        <View style={[styles.button, { marginTop: spacing.sm }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    ...shadows.soft,
  },
  image: {
    aspectRatio: 4 / 3,
    backgroundColor: '#EFE4DA',
  },
  body: {
    padding: spacing.sm,
    gap: spacing.sm,
  },
  line: {
    borderRadius: radius.md,
    backgroundColor: '#EFE4DA',
  },
  button: {
    height: 28,
    width: 28,
    borderRadius: 14,
    backgroundColor: '#EFE4DA',
    alignSelf: 'flex-end',
  },
});
