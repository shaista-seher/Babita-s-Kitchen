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
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { radius, spacing } from '../theme/spacing';

const PRIMARY = colors.primary;
const LOGO = require('../../assets/BK_logo.jpeg');

export default function AuthScreen() {
  const navigation = useNavigation<any>();
  const [mode, setMode] = React.useState<'login' | 'signup'>('login');
  const [name, setName] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [focused, setFocused] = React.useState<'name' | 'phone' | null>(null);

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
      return;
    }

    navigation.navigate('OTPScreen', {
      phone: cleanPhone,
      name: mode === 'signup' ? name.trim() : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.centerWrap}>
            <View style={styles.brandWrap}>
              <Image source={LOGO} style={styles.logo} resizeMode="contain" />
              <Text style={styles.brand}>Babita's Kitchen</Text>
              <Text style={styles.subtitle}>Home-cooked flavours, delivered with love</Text>
            </View>

            <View style={styles.card}>
              <View style={styles.toggleWrap}>
                <TouchableOpacity
                  style={[styles.toggleTab, mode === 'login' && styles.toggleTabActive]}
                  onPress={() => setMode('login')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.toggleText, mode === 'login' && styles.toggleTextActive]}>
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleTab, mode === 'signup' && styles.toggleTabActive]}
                  onPress={() => setMode('signup')}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.toggleText, mode === 'signup' && styles.toggleTextActive]}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {mode === 'signup' ? (
                <View style={styles.fieldGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused(null)}
                    placeholder="Enter your full name"
                    placeholderTextColor={colors.textMuted}
                    autoCapitalize="words"
                    style={[styles.input, focused === 'name' && styles.inputFocused]}
                  />
                  {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                </View>
              ) : null}

              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Mobile Number</Text>
                <TextInput
                  value={phone}
                  onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="Enter your 10-digit mobile number"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={[styles.input, focused === 'phone' && styles.inputFocused]}
                />
                {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={submit} activeOpacity={0.9}>
                <Text style={styles.primaryButtonText}>Send OTP</Text>
              </TouchableOpacity>

              <Text style={styles.note}>By continuing, you agree to our Terms & Privacy Policy</Text>
            </View>
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
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  centerWrap: {
    gap: 24,
  },
  brandWrap: {
    marginTop: 8,
    marginBottom: 0,
    alignItems: 'center',
  },
  logo: {
    width: 68,
    height: 68,
    marginBottom: 8,
  },
  brand: {
    color: PRIMARY,
    fontSize: 27,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    color: colors.textBody,
    fontSize: 14,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: 0,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    gap: spacing.md,
  },
  toggleWrap: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.sm,
    padding: spacing.xs,
  },
  toggleTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
  },
  toggleTabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: PRIMARY,
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    color: colors.textHeading,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md - 2,
    paddingVertical: spacing.md - 2,
    fontSize: 15,
    color: colors.textHeading,
    fontFamily: fonts.sansRegular,
  },
  inputFocused: {
    borderColor: PRIMARY,
  },
  errorText: {
    color: colors.danger,
    fontSize: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: radius.sm,
    backgroundColor: PRIMARY,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  note: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
  },
});
