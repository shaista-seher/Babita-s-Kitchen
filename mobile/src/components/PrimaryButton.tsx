import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  TextStyle,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';
import { shadow } from '../theme/shadow';

type Props = Omit<PressableProps, 'style'> & {
  title: string;
  loading?: boolean;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  icon?: keyof typeof Feather.glyphMap;
  variant?: 'solid' | 'ghost';
};

export function PrimaryButton({
  title,
  loading,
  disabled,
  fullWidth = true,
  style,
  textStyle,
  icon,
  variant = 'solid',
  onPressIn,
  onPressOut,
  ...props
}: Props) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
      disabled={disabled || loading}
      onPressIn={(event) => {
        scale.value = withSpring(0.97);
        onPressIn?.(event);
      }}
      onPressOut={(event) => {
        scale.value = withSpring(1);
        onPressOut?.(event);
      }}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        variant === 'ghost' ? styles.ghost : styles.solid,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && !loading && styles.pressed,
        style,
      ]}
      {...props}
    >
      {loading ? (
        <View style={styles.row}>
          <ActivityIndicator color={colors.white} />
          <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, textStyle]}>{title}</Text>
        </View>
      ) : (
        <View style={styles.row}>
          {icon ? (
            <Feather
              name={icon}
              size={16}
              color={variant === 'ghost' ? colors.primary : colors.white}
            />
          ) : null}
          <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, textStyle]}>{title}</Text>
        </View>
      )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: spacing.sm + 5,
  },
  fullWidth: {
    width: '100%',
  },
  solid: {
    backgroundColor: colors.primary,
    ...shadow.card,
  },
  ghost: {
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    backgroundColor: colors.primaryDark,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  ghostLabel: {
    color: colors.primary,
  },
});
