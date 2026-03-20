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
import { useNavigation } from '@react-navigation/native';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { PrimaryButton } from '../components/PrimaryButton';
import { showErrorToast, showSuccessToast } from '../components/ToastNotification';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';

const signupSchema = z
  .object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupScreen() {
  const navigation = useNavigation<any>();
  const { signUp } = useAuth();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
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
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join Babita&apos;s Kitchen to track orders and save your details.</Text>
            </View>

            <View style={styles.card}>
              <Field control={control} name="name" label="Name" placeholder="Your full name" error={errors.name?.message} />
              <Field
                control={control}
                name="email"
                label="Email"
                placeholder="you@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.email?.message}
              />
              <Field
                control={control}
                name="password"
                label="Password"
                placeholder="Choose a password"
                secureTextEntry
                error={errors.password?.message}
              />
              <Field
                control={control}
                name="confirmPassword"
                label="Confirm password"
                placeholder="Retype your password"
                secureTextEntry
                error={errors.confirmPassword?.message}
              />

              <PrimaryButton
                title="Create Account"
                loading={isSubmitting}
                onPress={handleSubmit(async (values) => {
                  try {
                    await signUp(values.name, values.email, values.password);
                    showSuccessToast('Account created', 'Check your email if confirmation is enabled');
                    navigation.replace('Login');
                  } catch (error) {
                    showErrorToast('Signup failed', (error as Error).message);
                  }
                })}
              />

              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have an account?</Text>
              </Pressable>
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
  name: keyof SignupValues;
  label: string;
  placeholder: string;
  error?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: 'default' | 'email-address';
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <Controller
        control={control}
        name={name}
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
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  hero: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  title: {
    color: colors.textHeading,
    fontFamily: fonts.serif,
    fontSize: 36,
  },
  subtitle: {
    color: colors.textBody,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 24,
  },
  card: {
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: spacing.lg,
    gap: spacing.md,
  },
  fieldWrap: {
    gap: 6,
  },
  label: {
    color: colors.textHeading,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
  input: {
    minHeight: 50,
    borderRadius: radius.md,
    backgroundColor: '#faf7f4',
    paddingHorizontal: spacing.md,
    color: colors.textHeading,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },
  errorText: {
    color: colors.danger,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  link: {
    color: colors.primary,
    textAlign: 'center',
    fontFamily: fonts.sansBold,
    fontSize: 13,
  },
});
