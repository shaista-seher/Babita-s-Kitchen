import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
  Animated, Dimensions, BackHandler,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg:       '#F8F4EC',
  primary:  '#8B5E3C',
  accent:   '#E2725B',
  dark:     '#3D2B1F',
  muted:    '#A08060',
  white:    '#FFFFFF',
  inputBg:  '#F0EAE0',
  border:   '#D4C4B0',
  error:    '#E2725B',
  success:  '#4CAF50',
};

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30; // seconds
const OTP_EXPIRY = 300;     // 5 minutes in seconds

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { phone, channel, name, email, isNew } = useLocalSearchParams<{
    phone: string; channel: string; name: string; email: string; isNew: string;
  }>();

  const [otp, setOtp]               = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading]       = useState(false);
  const [resending, setResending]   = useState(false);
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const [expiryTimer, setExpiryTimer] = useState(OTP_EXPIRY);

  const inputRefs = useRef<(TextInput | null)[]>([]);
  const shakeAnim  = useRef(new Animated.Value(0)).current;
  const successAnim = useRef(new Animated.Value(0)).current;

  // Resend cooldown countdown
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => setResendTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  // OTP expiry countdown
  useEffect(() => {
    if (expiryTimer <= 0) return;
    const t = setInterval(() => setExpiryTimer(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [expiryTimer]);

  // Auto-focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, []);

  // Prevent going back during loading
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => loading);
    return () => sub.remove();
  }, [loading]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12,  duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -12, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 8,   duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60, useNativeDriver: true }),
    ]).start();
  };

  const handleOtpChange = (value: string, index: number) => {
    const cleaned = value.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleaned;
    setOtp(newOtp);
    setError('');

    if (cleaned && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (cleaned && index === OTP_LENGTH - 1) {
      const full = [...newOtp.slice(0, OTP_LENGTH - 1), cleaned].join('');
      if (full.length === OTP_LENGTH) {
        submitOTP(full);
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOTP = async (code?: string) => {
    const finalOtp = code || otp.join('');
    if (finalOtp.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits');
      shake();
      return;
    }
    if (expiryTimer <= 0) {
      setError('OTP has expired. Please request a new one.');
      shake();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone:   `+91${phone}`,
            otp:     finalOtp,
            channel,
            name,
            email:   email || undefined,
            isNew:   isNew === '1',
          }),
        }
      );

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(body.message || 'Invalid OTP. Please try again.');
      }

      // Store auth token
      // In production use expo-secure-store instead of AsyncStorage for tokens
      const { token, user } = body;
      // AsyncStorage.setItem('auth_token', token);

      // Success animation then navigate to location screen
      setSuccess(true);
      Animated.spring(successAnim, {
        toValue: 1, useNativeDriver: true, tension: 60, friction: 8,
      }).start(() => {
        setTimeout(() => {
          router.replace({
            pathname: '/confirm-location',
            params: { userId: user?.id, name: user?.full_name || name },
          });
        }, 600);
      });

    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.');
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      shake();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    setResending(true);
    setError('');
    setOtp(Array(OTP_LENGTH).fill(''));

    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/send-otp`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: `+91${phone}`, channel }),
        }
      );
      if (!res.ok) throw new Error('Failed to resend');
      setResendTimer(RESEND_COOLDOWN);
      setExpiryTimer(OTP_EXPIRY);
      inputRefs.current[0]?.focus();
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const successScale = successAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.05] });

  return (
    <LinearGradient colors={['#2A1F1A', '#1A1512', '#2A1F1A']} style={styles.root}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.container}>

          {/* Back */}
          <TouchableOpacity style={styles.back} onPress={() => router.back()} disabled={loading}>
            <Ionicons name="arrow-back" size={22} color={COLORS.white} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.iconCircle, success && { backgroundColor: COLORS.success }]}>
              <Ionicons
                name={success ? 'checkmark' : (channel === 'whatsapp' ? 'logo-whatsapp' : 'phone-portrait-outline')}
                size={32}
                color={COLORS.white}
              />
            </View>
            <Text style={styles.title}>
              {success ? 'Verified!' : 'Enter OTP'}
            </Text>
            <Text style={styles.subtitle}>
              {success
                ? 'Taking you to set your location…'
                : `A 6-digit code was sent via ${channel === 'whatsapp' ? 'WhatsApp' : 'SMS'} to`}
            </Text>
            {!success && (
              <Text style={styles.phoneDisplay}>+91 {phone}</Text>
            )}
          </View>

          {/* OTP inputs */}
          <Animated.View style={[styles.otpRow, { transform: [{ translateX: shakeAnim }] }]}>
            {otp.map((digit, i) => (
              <TextInput
                key={i}
                ref={r => { inputRefs.current[i] = r; }}
                style={[
                  styles.otpBox,
                  digit        && styles.otpBoxFilled,
                  error        && styles.otpBoxError,
                  success      && styles.otpBoxSuccess,
                ]}
                value={digit}
                onChangeText={v => handleOtpChange(v, i)}
                onKeyPress={e => handleKeyPress(e, i)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading && !success}
              />
            ))}
          </Animated.View>

          {/* Expiry timer */}
          {!success && expiryTimer > 0 && (
            <View style={styles.timerRow}>
              <Ionicons name="time-outline" size={14} color={expiryTimer < 60 ? COLORS.error : COLORS.muted} />
              <Text style={[styles.timerText, expiryTimer < 60 && { color: COLORS.error }]}>
                OTP expires in {formatTime(expiryTimer)}
              </Text>
            </View>
          )}
          {!success && expiryTimer <= 0 && (
            <Text style={styles.expiredText}>OTP expired — please request a new one</Text>
          )}

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Verify button */}
          {!success && (
            <TouchableOpacity
              style={[styles.cta, (loading || expiryTimer <= 0) && styles.ctaDisabled]}
              onPress={() => submitOTP()}
              disabled={loading || expiryTimer <= 0}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.ctaText}>Verify OTP</Text>
              }
            </TouchableOpacity>
          )}

          {/* Resend */}
          {!success && (
            <View style={styles.resendRow}>
              <Text style={styles.resendLabel}>Didn't receive it? </Text>
              {resending ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : resendTimer > 0 ? (
                <Text style={styles.resendCooldown}>Resend in {resendTimer}s</Text>
              ) : (
                <TouchableOpacity onPress={handleResend}>
                  <Text style={styles.resendLink}>Resend OTP</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Channel switch */}
          {!success && resendTimer <= 0 && (
            <TouchableOpacity
              style={styles.switchChannel}
              onPress={() => {
                router.setParams({ channel: channel === 'sms' ? 'whatsapp' : 'sms' });
                handleResend();
              }}
            >
              <Text style={styles.switchChannelText}>
                Try via {channel === 'sms' ? 'WhatsApp' : 'SMS'} instead
              </Text>
            </TouchableOpacity>
          )}

        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:         { flex: 1 },
  container:    { flex: 1, paddingHorizontal: 28, paddingTop: 60, paddingBottom: 40 },
  back:         { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },

  header:       { alignItems: 'center', marginBottom: 36 },
  iconCircle:   { width: 72, height: 72, borderRadius: 36, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 16, elevation: 8 },
  title:        { fontSize: 26, fontWeight: '800', color: COLORS.white, marginBottom: 8 },
  subtitle:     { fontSize: 14, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
  phoneDisplay: { fontSize: 17, fontWeight: '700', color: COLORS.white, marginTop: 4, letterSpacing: 1 },

  otpRow:       { flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20 },
  otpBox:       { width: 46, height: 56, borderRadius: 12, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 22, fontWeight: '800', color: COLORS.white },
  otpBoxFilled: { borderColor: COLORS.primary, backgroundColor: 'rgba(139,94,60,0.2)' },
  otpBoxError:  { borderColor: COLORS.error, backgroundColor: 'rgba(226,114,91,0.1)' },
  otpBoxSuccess:{ borderColor: COLORS.success, backgroundColor: 'rgba(76,175,80,0.15)' },

  timerRow:     { flexDirection: 'row', alignItems: 'center', gap: 4, justifyContent: 'center', marginBottom: 8 },
  timerText:    { fontSize: 13, color: COLORS.muted },
  expiredText:  { textAlign: 'center', color: COLORS.error, fontSize: 13, marginBottom: 8 },

  errorBox:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(226,114,91,0.15)', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:    { fontSize: 13, color: COLORS.error, flex: 1 },

  cta:          { backgroundColor: COLORS.primary, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  ctaDisabled:  { opacity: 0.5 },
  ctaText:      { color: COLORS.white, fontSize: 16, fontWeight: '700' },

  resendRow:    { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  resendLabel:  { fontSize: 14, color: 'rgba(255,255,255,0.45)' },
  resendCooldown: { fontSize: 14, color: COLORS.muted },
  resendLink:   { fontSize: 14, color: COLORS.primary, fontWeight: '700' },

  switchChannel:{ alignItems: 'center', marginTop: 4 },
  switchChannelText: { fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecorationLine: 'underline' },
});
