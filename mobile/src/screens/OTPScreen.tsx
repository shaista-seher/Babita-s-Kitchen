import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

const DEMO_OTP = '123456';
const LOGO = require('../../assets/BK_logo.jpeg');
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=80';

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
      inputs.current[0]?.focus();
    }, 60);

    return () => clearTimeout(timer);
  }, []);

  const focusIndex = (index: number) => inputs.current[index]?.focus();

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
      setError('Incorrect OTP. Please enter the demo code and try again.');
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
    setResendMessage('Fresh OTP sent for the demo flow.');
    setTimeout(() => setResendMessage(''), 2200);
  };

  const fillDemoOtp = () => {
    const next = DEMO_OTP.split('');
    setDigits(next);
    setError('');
    setFocusedIndex(5);
    focusIndex(5);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <BackgroundBlobs softened />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <Image source={{ uri: HERO_IMAGE }} style={styles.heroImage} contentFit="cover" />
              <LinearGradient
                colors={['rgba(38,20,15,0.18)', 'rgba(38,20,15,0.52)', 'rgba(38,20,15,0.90)']}
                style={styles.heroOverlay}
              />

              <View style={styles.heroTopRow}>
                <Pressable
                  style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
                  onPress={() => navigation.goBack()}
                >
                  <Feather name="chevron-left" size={18} color="#FFFFFF" />
                </Pressable>
                <View style={styles.heroBadge}>
                  <Feather name="shield" size={14} color="#F8D56B" />
                  <Text style={styles.heroBadgeText}>Secure OTP access</Text>
                </View>
              </View>

              <View style={styles.heroBody}>
                <View style={styles.heroBrandRow}>
                  <Image source={LOGO} style={styles.logo} contentFit="cover" />
                  <Text style={styles.heroBrand}>Babita&apos;s Kitchen</Text>
                </View>
                <Text style={styles.heroTitle}>One quick step left</Text>
                <Text style={styles.heroSubtitle}>
                  Enter the OTP sent to +91 {phone} and continue to the menu.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Verify OTP</Text>
                <Text style={styles.cardSubtitle}>
                  Demo login is enabled on this build, so you can continue immediately.
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Feather name="info" size={16} color="#2F5EA8" />
                <Text style={styles.infoBoxText}>Demo OTP: 123456</Text>
              </View>

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

              <View style={styles.actions}>
                <ActionButton title="Verify OTP" icon="arrow-right" onPress={verify} />
                <GhostButton title="Fill Demo OTP" icon="copy" onPress={fillDemoOtp} />
              </View>

              <View style={styles.footerPanel}>
                <View style={styles.footerRow}>
                  <View style={styles.footerMetric}>
                    <Text style={styles.footerMetricValue}>30 sec</Text>
                    <Text style={styles.footerMetricLabel}>average login flow</Text>
                  </View>
                  <View style={styles.footerMetric}>
                    <Text style={styles.footerMetricValue}>4.8</Text>
                    <Text style={styles.footerMetricLabel}>customer rating</Text>
                  </View>
                </View>

                <View style={styles.resendRow}>
                  <Text style={styles.resendLabel}>Didn&apos;t receive the OTP?</Text>
                  <Pressable style={({ pressed }) => pressed && styles.pressed} onPress={resend}>
                    <Text style={styles.resendAction}>Resend</Text>
                  </Pressable>
                </View>

                {name ? <Text style={styles.helperText}>Signing up as {name}</Text> : null}
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function ActionButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.actionButtonWrap, pressed && styles.pressed]} onPress={onPress}>
      <LinearGradient
        colors={['#7A2E2E', '#C75C2A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.actionButton}
      >
        <Text style={styles.actionButtonText}>{title}</Text>
        {icon ? <Feather name={icon} size={18} color="#FFFFFF" /> : null}
      </LinearGradient>
    </Pressable>
  );
}

function GhostButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: keyof typeof Feather.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable style={({ pressed }) => [styles.ghostButton, pressed && styles.pressed]} onPress={onPress}>
      {icon ? <Feather name={icon} size={16} color="#7A2E2E" /> : null}
      <Text style={styles.ghostButtonText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F3EF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F7F3EF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  hero: {
    minHeight: 280,
    borderRadius: 32,
    overflow: 'hidden',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: 'rgba(24,18,17,0.42)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
    fontSize: 12,
  },
  heroBody: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  heroBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  heroBrand: {
    color: '#F5E6DB',
    fontFamily: fonts.bodyBold,
    fontSize: typeScale.support.size,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.serifBold,
    fontSize: 31,
    lineHeight: 37,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 300,
  },
  card: {
    marginTop: -22,
    borderRadius: 30,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.96)',
    gap: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    color: '#261B16',
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 34,
  },
  cardSubtitle: {
    color: '#6F615A',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: 16,
    backgroundColor: '#EEF5FF',
    borderWidth: 1,
    borderColor: '#D3E4FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  infoBoxText: {
    color: '#2F5EA8',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.xs,
  },
  otpBox: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#DDCFC7',
    backgroundColor: '#FFFDFC',
    textAlign: 'center',
    fontSize: 24,
    color: '#261B16',
    fontFamily: fonts.bodyBold,
  },
  otpBoxFocused: {
    borderColor: '#A94D37',
    shadowColor: '#C75C2A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 2,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  successText: {
    color: colors.success,
    fontFamily: fonts.body,
    fontSize: 12,
  },
  actions: {
    gap: spacing.sm,
  },
  actionButtonWrap: {
    borderRadius: 18,
    overflow: 'hidden',
    ...shadows.card,
  },
  actionButton: {
    minHeight: 58,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  ghostButton: {
    minHeight: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D8C7C0',
    backgroundColor: '#FFF8F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  ghostButtonText: {
    color: '#7A2E2E',
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  footerPanel: {
    paddingTop: spacing.xs,
    gap: spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  footerMetric: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#F5EEEA',
    padding: spacing.md,
    gap: 2,
  },
  footerMetricValue: {
    color: '#261B16',
    fontFamily: fonts.serifBold,
    fontSize: 20,
  },
  footerMetricLabel: {
    color: '#7A6B64',
    fontFamily: fonts.body,
    fontSize: 12,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  resendLabel: {
    color: '#867871',
    fontFamily: fonts.body,
    fontSize: 13,
  },
  resendAction: {
    color: '#7A2E2E',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  helperText: {
    textAlign: 'center',
    color: '#867871',
    fontFamily: fonts.body,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.9,
  },
});
