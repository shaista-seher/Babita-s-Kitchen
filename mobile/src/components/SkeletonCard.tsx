import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

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
    borderRadius: radius.lg,
    backgroundColor: colors.cardBg,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  image: {
    height: 160,
    backgroundColor: '#ece4dd',
  },
  body: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  line: {
    borderRadius: radius.sm,
    backgroundColor: '#ece4dd',
  },
  button: {
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: '#ece4dd',
  },
});
