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
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

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
    <Animated.View style={[animatedStyle, fullWidth && styles.wrapperFullWidth]}>
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
            <ActivityIndicator color={variant === 'ghost' ? colors.primary : colors.white} />
            <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, textStyle]}>
              {title}
            </Text>
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
            <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, textStyle]}>
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapperFullWidth: {
    alignSelf: 'stretch',
  },
  button: {
    minHeight: 48,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  solid: {
    backgroundColor: colors.primary,
    ...shadows.soft,
  },
  ghost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.75,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  label: {
    color: colors.white,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.body.size,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  ghostLabel: {
    color: colors.primary,
  },
});
