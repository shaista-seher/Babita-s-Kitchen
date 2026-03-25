import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';

const PRIMARY = colors.primary;
const DEMO_OTP = '123456';
const LOGO = require('../../assets/BK_logo.jpeg');

export default function OTPScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { phone, name } = route.params ?? {};
  const [digits, setDigits] = React.useState(['', '', '', '', '', '']);
  const [error, setError] = React.useState('');
  const [resendMessage, setResendMessage] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(0);
  const inputs = React.useRef<Array<TextInput | null>>([]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      focusIndex(0);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const focusIndex = (index: number) => {
    inputs.current[index]?.focus();
  };

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value.replace(/\D/g, '').slice(-1);
    setDigits(next);
    setError('');
    if (next[index] && index < 5) {
      focusIndex(index + 1);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !digits[index] && index > 0) {
      const next = [...digits];
      next[index - 1] = '';
      setDigits(next);
      focusIndex(index - 1);
    }
  };

  const clearDigits = () => {
    setDigits(['', '', '', '', '', '']);
    setFocusedIndex(0);
    focusIndex(0);
  };

  const verify = () => {
    const value = digits.join('');
    if (value !== DEMO_OTP) {
      setError('Incorrect OTP. Please try again.');
      clearDigits();
      return;
    }

    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  const resend = () => {
    clearDigits();
    setResendMessage('OTP resent!');
    setTimeout(() => setResendMessage(''), 2000);
  };

  const fillDemoOtp = () => {
    const next = DEMO_OTP.split('');
    setDigits(next);
    setError('');
    setFocusedIndex(5);
    focusIndex(5);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.container}>
            <View style={styles.logoWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Feather name="chevron-left" size={24} color={PRIMARY} />
            </TouchableOpacity>

            <Text style={styles.title}>Verify your number</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit OTP sent to +91 {phone}
            </Text>
            <Text style={styles.demoHint}>Demo OTP: 123456</Text>

            <View style={styles.otpRow}>
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(value) => setDigit(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  onFocus={() => setFocusedIndex(index)}
                  onBlur={() => setFocusedIndex(null)}
                  keyboardType="number-pad"
                  maxLength={1}
                  style={[styles.otpBox, focusedIndex === index && styles.otpBoxFocused]}
                />
              ))}
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            {resendMessage ? <Text style={styles.successText}>{resendMessage}</Text> : null}

            <TouchableOpacity style={styles.primaryButton} onPress={verify} activeOpacity={0.9}>
              <Text style={styles.primaryButtonText}>Verify OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={fillDemoOtp} activeOpacity={0.9}>
              <Text style={styles.secondaryButtonText}>Fill Demo OTP</Text>
            </TouchableOpacity>

            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive the OTP? </Text>
              <TouchableOpacity onPress={resend} hitSlop={8}>
                <Text style={styles.resendAction}>Resend</Text>
              </TouchableOpacity>
            </View>

            {name ? <Text style={styles.helperText}>Signing up as {name}</Text> : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg - 4,
    paddingVertical: spacing.lg,
  },
  container: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 0,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: 0,
  },
  logo: {
    width: 58,
    height: 58,
  },
  title: {
    color: colors.textHeading,
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: colors.textBody,
    fontSize: 14,
    lineHeight: 20,
  },
  demoHint: {
    marginTop: 4,
    color: PRIMARY,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 12,
  },
  otpBox: {
    width: 46,
    height: 54,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: colors.textHeading,
    fontFamily: fonts.sansBold,
  },
  otpBoxFocused: {
    borderColor: PRIMARY,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  successText: {
    color: '#16A34A',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  primaryButton: {
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: PRIMARY,
    fontSize: 16,
    fontWeight: '700',
  },
  resendRow: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  resendLabel: {
    color: colors.textBody,
    fontSize: 13,
  },
  resendAction: {
    color: PRIMARY,
    fontSize: 13,
    fontWeight: '600',
  },
  helperText: {
    marginTop: 10,
    textAlign: 'center',
    color: colors.textBody,
    fontSize: 12,
  },
});
