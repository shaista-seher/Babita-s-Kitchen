import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius } from '../theme/spacing';

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
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    minHeight: 64,
    paddingVertical: 6,
  },
  errorContainer: {
    borderLeftWidth: 0,
    borderRadius: radius.lg,
    backgroundColor: '#fdecea',
    minHeight: 64,
    paddingVertical: 6,
  },
  content: {
    paddingHorizontal: 10,
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.bodyBold,
    fontSize: 14,
  },
  body: {
    color: colors.textBody,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  successAccent: {
    width: 5,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  errorAccent: {
    width: 5,
    borderTopLeftRadius: radius.lg,
    borderBottomLeftRadius: radius.lg,
    backgroundColor: '#c0392b',
  },
});
