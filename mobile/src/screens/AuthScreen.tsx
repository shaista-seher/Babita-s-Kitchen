import React from 'react';
import {
  KeyboardAvoidingView,
  LayoutChangeEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';

const LOGO = require('../../assets/BK_logo.jpeg');
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1400&q=80';

export default function AuthScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [focused, setFocused] = React.useState<'name' | 'phone' | null>('phone');
  const [segmentWidth, setSegmentWidth] = React.useState(0);
  const nameInputRef = React.useRef<TextInput | null>(null);
  const phoneInputRef = React.useRef<TextInput | null>(null);
  const indicatorX = useSharedValue(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'signup') {
        nameInputRef.current?.focus();
      } else {
        phoneInputRef.current?.focus();
      }
    }, 220);

    return () => clearTimeout(timer);
  }, [mode]);

  React.useEffect(() => {
    if (!segmentWidth) {
      return;
    }

    indicatorX.value = withTiming(mode === 'login' ? 0 : segmentWidth / 2, {
      duration: 200,
    });
  }, [indicatorX, mode, segmentWidth]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  const handleSegmentLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setSegmentWidth(width);
  };

  const submit = () => {
    const cleanPhone = phone.replace(/\D/g, '');
    let valid = true;

    setNameError('');
    setPhoneError('');

    if (mode === 'signup' && !name.trim()) {
      setNameError('Please enter your full name');
      valid = false;
    }

    if (cleanPhone.length !== 10) {
      setPhoneError('Please enter a valid 10-digit mobile number');
      valid = false;
    }

    if (!valid) {
      if (mode === 'signup' && !name.trim()) {
        nameInputRef.current?.focus();
      } else {
        phoneInputRef.current?.focus();
      }
      return;
    }

    navigation.navigate('OTPScreen', {
      phone: cleanPhone,
      name: mode === 'signup' ? name.trim() : undefined,
    });
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
              <View style={styles.richnessOverlay} />
              <LinearGradient
                colors={[
                  'rgba(28,14,10,0.70)',
                  'rgba(28,14,10,0.38)',
                  'rgba(28,14,10,0.08)',
                  'rgba(28,14,10,0.00)',
                ]}
                locations={[0, 0.22, 0.55, 1]}
                style={styles.heroGradient}
              />

              <View style={styles.heroTopRow}>
                <GlassPill style={styles.brandPill}>
                  <Image source={LOGO} style={styles.brandLogo} contentFit="cover" />
                  <Text style={styles.brandPillText}>Babitas Kitchen</Text>
                </GlassPill>

                <GlassPill style={styles.ratingPill}>
                  <Feather name="star" size={13} color="#F6D673" />
                  <Text style={styles.ratingPillText}>4.8 rated</Text>
                </GlassPill>
              </View>

              <BlurView intensity={28} tint="dark" style={styles.heroCopyWrap}>
                <Text style={styles.heroEyebrow}>FRESHLY COOKED, DELIVERED DAILY</Text>
                <Text style={styles.heroTitle}>घर जैसा स्वाद, हर दिन</Text>
                <Text style={styles.heroSubtitle}>
                  Homemade pickles, papad, and everyday favourites with a warmer ordering
                  experience.
                </Text>

                <View style={styles.featureRow}>
                  <FeatureChip icon="coffee" label="Fresh Daily" />
                  <FeatureChip icon="smartphone" label="Quick OTP" />
                  <FeatureChip icon="home" label="Homemade" />
                </View>
              </BlurView>

              <View style={styles.trustRow}>
                <TrustCard icon="users" value="5000+" label="happy customers" />
                <TrustCard icon="headphones" value="Same Day" label="support" />
              </View>
            </View>

            <LinearGradient
              colors={['rgba(255,252,249,0.98)', 'rgba(247,240,234,0.96)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.loginCard}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>Welcome back</Text>
                <Text style={styles.cardSubtitle}>
                  Login with your mobile number and continue to the freshest picks from the
                  kitchen.
                </Text>
              </View>

              <View style={styles.segmentedControl} onLayout={handleSegmentLayout}>
                {segmentWidth ? (
                  <Animated.View
                    style={[
                      styles.segmentIndicator,
                      { width: segmentWidth / 2 - 6 },
                      indicatorStyle,
                    ]}
                  />
                ) : null}

                <Pressable
                  style={styles.segmentTab}
                  onPress={() => setMode('login')}
                  accessibilityRole="button"
                >
                  <Text style={[styles.segmentText, mode === 'login' && styles.segmentTextActive]}>
                    Login
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.segmentTab}
                  onPress={() => setMode('signup')}
                  accessibilityRole="button"
                >
                  <Text style={[styles.segmentText, mode === 'signup' && styles.segmentTextActive]}>
                    Sign Up
                  </Text>
                </Pressable>
              </View>

              {mode === 'signup' ? (
                <Field
                  ref={nameInputRef}
                  label="Full name"
                  error={nameError}
                  focused={focused === 'name'}
                  value={name}
                  onFocus={() => setFocused('name')}
                  onBlur={() => setFocused(null)}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => phoneInputRef.current?.focus()}
                />
              ) : null}

              <PhoneField
                ref={phoneInputRef}
                label="Mobile number"
                error={phoneError}
                focused={focused === 'phone'}
                value={phone}
                onFocus={() => setFocused('phone')}
                onBlur={() => setFocused(null)}
                onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter your mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                returnKeyType="done"
                onSubmitEditing={submit}
              />

              <View style={styles.infoBox}>
                <Feather name="info" size={15} color="#3E6EAE" />
                <Text style={styles.infoBoxText}>Demo OTP: 123456</Text>
              </View>

              <GradientButton title="Get OTP" onPress={submit} />

              <Text style={styles.termsText}>
                By continuing, you agree to the Terms and Privacy Policy.
              </Text>
            </LinearGradient>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const Field = React.forwardRef<
  TextInput,
  TextInputProps & {
    label: string;
    error?: string;
    focused: boolean;
  }
>(function Field({ label, error, focused, ...props }, ref) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        ref={ref}
        placeholderTextColor="#B5AAA2"
        style={[styles.textInput, focused && styles.focusedInput]}
        {...props}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const PhoneField = React.forwardRef<
  TextInput,
  TextInputProps & {
    label: string;
    error?: string;
    focused: boolean;
  }
>(function PhoneField({ label, error, focused, ...props }, ref) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.phoneField, focused && styles.focusedInput]}>
        <View style={styles.phonePrefix}>
          <Text style={styles.phonePrefixText}>+91</Text>
        </View>
        <TextInput
          ref={ref}
          placeholderTextColor="#B5AAA2"
          style={styles.phoneInput}
          selectionColor={colors.primary}
          {...props}
        />
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

function GlassPill({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <BlurView intensity={24} tint="dark" style={[styles.glassPill, style]}>
      {children}
    </BlurView>
  );
}

function FeatureChip({
  icon,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
}) {
  return (
    <BlurView intensity={22} tint="dark" style={styles.featureChip}>
      <Feather name={icon} size={14} color="#FFFFFF" />
      <Text style={styles.featureChipText}>{label}</Text>
    </BlurView>
  );
}

function TrustCard({
  icon,
  value,
  label,
}: {
  icon: keyof typeof Feather.glyphMap;
  value: string;
  label: string;
}) {
  return (
    <BlurView intensity={20} tint="dark" style={styles.trustCard}>
      <View style={styles.trustIconWrap}>
        <Feather name={icon} size={14} color="#FFF7EF" />
      </View>
      <Text style={styles.trustValue}>{value}</Text>
      <Text style={styles.trustLabel}>{label}</Text>
    </BlurView>
  );
}

function GradientButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withSpring(0.98, { damping: 16, stiffness: 260 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 260 });
        }}
      >
        <LinearGradient
          colors={['#7A2E2E', '#C75C2A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaButton}
        >
          <Text style={styles.ctaText}>{title}</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </LinearGradient>
      </Pressable>
    </Animated.View>
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
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  hero: {
    minHeight: 388,
    borderRadius: 30,
    overflow: 'hidden',
    justifyContent: 'space-between',
    ...shadows.card,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  richnessOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(154,78,33,0.12)',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  glassPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 10,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,16,15,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  brandPill: {},
  ratingPill: {},
  brandLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  brandPillText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  ratingPillText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  heroCopyWrap: {
    marginHorizontal: spacing.md,
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(18,12,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: spacing.sm,
  },
  heroEyebrow: {
    color: '#F3DACA',
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    lineHeight: 16,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontFamily: fonts.serifBold,
    fontSize: 33,
    lineHeight: 40,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 22,
    maxWidth: 300,
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 9,
    overflow: 'hidden',
    backgroundColor: 'rgba(26,18,17,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  featureChipText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  trustRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  trustCard: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    overflow: 'hidden',
    backgroundColor: 'rgba(18,12,11,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: 4,
  },
  trustIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginBottom: 2,
  },
  trustValue: {
    color: '#FFFFFF',
    fontFamily: fonts.serifBold,
    fontSize: 20,
    lineHeight: 24,
  },
  trustLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  loginCard: {
    marginTop: -18,
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
    ...shadows.card,
  },
  cardHeader: {
    gap: 4,
  },
  cardTitle: {
    color: '#2A1F1A',
    fontFamily: fonts.serifBold,
    fontSize: 28,
    lineHeight: 34,
  },
  cardSubtitle: {
    color: '#746761',
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 21,
  },
  segmentedControl: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.full,
    backgroundColor: '#EFE5DF',
    padding: 4,
  },
  segmentIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: radius.full,
    backgroundColor: '#FFFFFF',
    ...shadows.soft,
  },
  segmentTab: {
    flex: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    color: '#8D7C75',
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  segmentTextActive: {
    color: '#2A1F1A',
    fontFamily: fonts.bodyBold,
  },
  fieldGroup: {
    gap: spacing.xxs,
  },
  fieldLabel: {
    color: '#3A2A23',
    fontFamily: fonts.bodyBold,
    fontSize: 13,
  },
  textInput: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7C6BE',
    backgroundColor: '#FFFDFB',
    paddingHorizontal: spacing.md,
    color: '#2A1F1A',
    fontFamily: fonts.body,
    fontSize: 16,
    letterSpacing: 0.2,
  },
  phoneField: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#D7C6BE',
    backgroundColor: '#FFFDFB',
    overflow: 'hidden',
  },
  phonePrefix: {
    minWidth: 62,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFE2DA',
    borderRightWidth: 1,
    borderRightColor: '#D7C6BE',
  },
  phonePrefixText: {
    color: '#5B2D24',
    fontFamily: fonts.bodyBold,
    fontSize: 15,
  },
  phoneInput: {
    flex: 1,
    alignSelf: 'stretch',
    paddingHorizontal: spacing.md,
    color: '#2A1F1A',
    fontFamily: fonts.body,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  focusedInput: {
    borderColor: '#7A2E2E',
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 2,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    backgroundColor: '#EEF4FB',
    borderWidth: 1,
    borderColor: '#D7E4F4',
  },
  infoBoxText: {
    color: '#5978A2',
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
  },
  ctaButton: {
    minHeight: 54,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    shadowColor: '#7A2E2E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.22,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: {
    color: '#FFFFFF',
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 20,
  },
  termsText: {
    color: '#8F817A',
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
  },
});
