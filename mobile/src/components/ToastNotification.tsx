import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={styles.successContainer}
      contentContainerStyle={styles.content}
      text1Style={styles.title}
      text2Style={styles.body}
      renderLeadingIcon={() => <View style={styles.successAccent} />}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={styles.errorContainer}
      contentContainerStyle={styles.content}
      text1Style={styles.title}
      text2Style={styles.body}
      renderLeadingIcon={() => <View style={styles.errorAccent} />}
    />
  ),
};

export const showSuccessToast = (text1: string, text2?: string) => {
  Toast.show({
    type: 'success',
    text1,
    text2,
    visibilityTime: 2500,
    position: 'bottom',
  });
};

export const showErrorToast = (text1: string, text2?: string) => {
  Toast.show({
    type: 'error',
    text1,
    text2,
    position: 'bottom',
  });
};

export function ToastHost() {
  return <Toast config={toastConfig} />;
}

const styles = StyleSheet.create({
  successContainer: {
    borderLeftWidth: 0,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,255,255,0.96)',
    minHeight: 68,
    paddingVertical: spacing.xxs,
    ...shadows.soft,
  },
  errorContainer: {
    borderLeftWidth: 0,
    borderRadius: radius.xl,
    backgroundColor: 'rgba(255,245,244,0.98)',
    minHeight: 68,
    paddingVertical: spacing.xxs,
    ...shadows.soft,
  },
  content: {
    paddingHorizontal: spacing.xs,
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.body.size,
  },
  body: {
    color: colors.textBody,
    fontFamily: fonts.body,
    fontSize: typeScale.support.size,
  },
  successAccent: {
    width: 5,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
    backgroundColor: colors.primary,
  },
  errorAccent: {
    width: 5,
    borderTopLeftRadius: radius.xl,
    borderBottomLeftRadius: radius.xl,
    backgroundColor: '#c0392b',
  },
});
