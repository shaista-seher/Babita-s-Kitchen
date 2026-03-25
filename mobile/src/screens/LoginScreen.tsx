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
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation, useRoute } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { PrimaryButton } from '../components/PrimaryButton';
import { showErrorToast, showSuccessToast } from '../components/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';

const phoneSchema = z.object({
  phone: z.string().min(10).max(10),
});

const otpSchema = z.object({
  otp: z.string().min(6).max(6),
});

type PhoneValues = z.infer<typeof phoneSchema>;
type OtpValues = z.infer<typeof otpSchema>;

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sendOtp, verifyOtp, isAuthenticated, isLoading } = useAuth();
  const [step, setStep] = React.useState<'landing' | 'phone' | 'otp'>(
    route.params?.scannedPhone ? 'otp' : 'landing'
  );
  const [phone, setPhone] = React.useState(route.params?.scannedPhone ?? '');
  const [demoOtp, setDemoOtp] = React.useState<string | undefined>();

  const phoneForm = useForm<PhoneValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: phone },
  });

  const otpForm = useForm<OtpValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigation.replace('MainTabs');
    }
  }, [isAuthenticated, isLoading, navigation]);

  const handleSendOtp = phoneForm.handleSubmit(async (values) => {
    try {
      const normalizedPhone = values.phone.replace(/\D/g, '').slice(-10);
      setPhone(normalizedPhone);
      const response = await sendOtp(normalizedPhone, 'login');
      setDemoOtp(response.otp);
      setStep('otp');
      showSuccessToast('OTP sent', 'Check the server response or SMS provider');
    } catch (error) {
      showErrorToast('Could not send OTP', (error as Error).message);
    }
  });

  const handleVerifyOtp = otpForm.handleSubmit(async (values) => {
    try {
      await verifyOtp(phone, values.otp);
      showSuccessToast('Verified', 'Signed in successfully');
      navigation.replace('MainTabs');
    } catch (error) {
      showErrorToast('OTP verification failed', (error as Error).message);
    }
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <BackgroundBlobs />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.select({ ios: 'padding', android: undefined })}
        >
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.hero}>
              <Text style={styles.title}>
                {step === 'landing' ? 'Babita&apos;s Kitchen' : step === 'otp' ? 'Verify OTP' : 'Welcome back'}
              </Text>
              <Text style={styles.subtitle}>
                {step === 'landing'
                  ? 'Choose how you want to enter the app.'
                  : step === 'otp'
                  ? 'Enter the 6-digit code sent for your phone number.'
                  : 'Sign in with your phone number to continue.'}
              </Text>
            </View>

            <View style={styles.card}>
              {step === 'landing' ? (
                <>
                  <PrimaryButton
                    title="Login with OTP"
                    onPress={() => setStep('phone')}
                  />
                  <PrimaryButton
                    title="Signup"
                    variant="ghost"
                    onPress={() => navigation.navigate('Signup')}
                  />
                  <PrimaryButton
                    title="Scan QR"
                    variant="ghost"
                    onPress={() => navigation.navigate('QRScanner')}
                  />
                  <PrimaryButton
                    title="Demo Login"
                    onPress={async () => {
                      try {
                        await verifyOtp('9999999999', '123456');
                        navigation.replace('MainTabs');
                      } catch (error) {
                        showErrorToast('Demo login failed', (error as Error).message);
                      }
                    }}
                  />
                </>
              ) : step === 'phone' ? (
                <>
                  <Field
                    control={phoneForm.control}
                    name="phone"
                    label="Phone number"
                    placeholder="10-digit mobile number"
                    keyboardType="phone-pad"
                    error={phoneForm.formState.errors.phone?.message}
                  />
                  <PrimaryButton title="Send OTP" loading={phoneForm.formState.isSubmitting} onPress={handleSendOtp} />
                  <PrimaryButton
                    title="Back"
                    variant="ghost"
                    onPress={() => setStep('landing')}
                  />
                  <Pressable onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.link}>Need an account? Sign up</Text>
                  </Pressable>
                </>
              ) : (
                <>
                  <View style={styles.phoneBanner}>
                    <Text style={styles.phoneBannerLabel}>OTP sent to</Text>
                    <Text style={styles.phoneBannerValue}>+91 {phone}</Text>
                    {demoOtp ? <Text style={styles.demoOtp}>Demo OTP: {demoOtp}</Text> : null}
                  </View>
                  <Field
                    control={otpForm.control}
                    name="otp"
                    label="OTP"
                    placeholder="6-digit code"
                    keyboardType="number-pad"
                    error={otpForm.formState.errors.otp?.message}
                  />
                  <PrimaryButton title="Verify OTP" loading={otpForm.formState.isSubmitting} onPress={handleVerifyOtp} />
                  <Pressable onPress={handleSendOtp}>
                    <Text style={styles.link}>Resend OTP</Text>
                  </Pressable>
                  <Pressable onPress={() => setStep('phone')}>
                    <Text style={styles.secondaryLink}>Change phone number</Text>
                  </Pressable>
                  <Pressable onPress={() => setStep('landing')}>
                    <Text style={styles.secondaryLink}>Back to options</Text>
                  </Pressable>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

function Field({
  control,
  name,
  label,
  placeholder,
  error,
  ...props
}: {
  control: any;
  name: keyof PhoneValues | keyof OtpValues;
  label: string;
  placeholder: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name as never}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder={placeholder}
            placeholderTextColor={colors.textMuted}
            style={styles.input}
            {...props}
          />
        )}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.cream },
  container: { flex: 1, backgroundColor: colors.cream },
  flex: { flex: 1 },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.lg },
  hero: { marginTop: spacing.md, gap: spacing.sm },
  title: { color: colors.textHeading, fontFamily: fonts.serif, fontSize: 36 },
  subtitle: { color: colors.textBody, fontFamily: fonts.sansRegular, fontSize: 15, lineHeight: 24 },
  card: { borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', padding: spacing.lg, gap: spacing.md },
  fieldWrap: { gap: 6 },
  label: { color: colors.textHeading, fontFamily: fonts.sansMedium, fontSize: 13 },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: '#faf7f4',
    paddingHorizontal: spacing.md,
    color: colors.textHeading,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },
  errorText: { color: colors.danger, fontFamily: fonts.sansRegular, fontSize: 12 },
  link: { color: colors.primary, textAlign: 'center', fontFamily: fonts.sansBold, fontSize: 13 },
  secondaryLink: { color: colors.textMuted, textAlign: 'center', fontFamily: fonts.sansMedium, fontSize: 13 },
  phoneBanner: {
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    padding: spacing.md,
    gap: 4,
  },
  phoneBannerLabel: { color: colors.textMuted, fontFamily: fonts.sansMedium, fontSize: 12, textTransform: 'uppercase' },
  phoneBannerValue: { color: colors.textHeading, fontFamily: fonts.sansBold, fontSize: 18 },
  demoOtp: { color: colors.primary, fontFamily: fonts.sansBold, fontSize: 12 },
});
