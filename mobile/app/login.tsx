import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
  Dimensions, Animated, Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import QRScannerModal from '../components/qr-scanner-modal';

const { width, height } = Dimensions.get('window');

// ─── Brand colours (from index.css) ───────────────────────
const COLORS = {
  bg:        '#F8F4EC',   // warm cream background
  primary:   '#8B5E3C',   // warm brown
  accent:    '#E2725B',   // terracotta
  dark:      '#3D2B1F',   // dark text
  muted:     '#A08060',   // muted brown
  white:     '#FFFFFF',
  inputBg:   '#F0EAE0',
  border:    '#D4C4B0',
  error:     '#E2725B',
};

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone]           = useState('');
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [isNewUser, setIsNewUser]   = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [channel, setChannel]       = useState<'sms' | 'whatsapp'>('sms');
  const [scannerVisible, setScannerVisible] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const shake = () => {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 60,  useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 60,  useNativeDriver: true }),
    ]).start();
  };

  const validatePhone = (p: string) => /^[6-9]\d{9}$/.test(p);

  // Handle QR code scan result
  const handleQRScan = (scannedPhone: string) => {
    if (validatePhone(scannedPhone)) {
      setPhone(scannedPhone);
      setError('');
    } else {
      setError('Scanned phone number is invalid');
    }
  };

  // 
  // Check if user exists in Supabase (or treat as new user if not found)
  const checkUser = async (p: string) => {
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/rest/v1/profiles?phone=eq.%2B91${p}&select=id,full_name`,
        {
          headers: {
            apikey:        process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
          },
        }
      );
      const data = await res.json();
      return data && data.length > 0 ? data[0] : null;
    } catch {
      return null;
    }
  };

  const handleSendOTP = async () => {
    setError('');
    if (!validatePhone(phone)) {
      setError('Enter a valid 10-digit Indian mobile number');
      shake();
      return;
    }
    if (isNewUser && !name.trim()) {
      setError('Please enter your name');
      shake();
      return;
    }

    setLoading(true);
    try {
      const existing = await checkUser(phone);

      if (!existing && !isNewUser) {
        // First time — show name field
        setIsNewUser(true);
        setLoading(false);
        return;
      }

      // Call your backend /api/auth/send-otp
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/send-otp`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone:   `+91${phone}`,
            channel,
            name:    isNewUser ? name.trim() : existing?.full_name,
            email:   email.trim() || undefined,
            isNew:   !existing,
          }),
        }
      );

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || 'Failed to send OTP');
      }

      // Navigate to OTP screen passing phone + channel
      router.push({
        pathname: '/verify-otp',
        params: {
          phone,
          channel,
          name:  isNewUser ? name.trim() : (existing?.full_name || ''),
          email: email.trim(),
          isNew: isNewUser ? '1' : '0',
        },
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
      shake();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#2A1F1A', '#1A1512', '#2A1F1A']} style={styles.root}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Logo / header */}
          <View style={styles.header}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>BK</Text>
            </View>
            <Text style={styles.brand}>Babita's Kitchen</Text>
            <Text style={styles.tagline}>True taste of home, wherever you roam.</Text>
          </View>

          {/* Card */}
          <Animated.View style={[styles.card, { transform: [{ translateX: shakeAnim }] }]}>
            <Text style={styles.cardTitle}>
              {isNewUser ? 'Create Account' : 'Welcome Back'}
            </Text>
            <Text style={styles.cardSub}>
              {isNewUser
                ? 'Enter your details to get started'
                : 'Sign in with your mobile number'}
            </Text>

            {/* Name — only for new users */}
            {isNewUser && (
              <View style={styles.fieldWrap}>
                <Text style={styles.label}>Your Name <Text style={styles.req}>*</Text></Text>
                <View style={styles.inputRow}>
                  <Ionicons name="person-outline" size={18} color={COLORS.muted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Priya Sharma"
                    placeholderTextColor={COLORS.muted}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>
            )}

            {/* Phone */}
            <View style={styles.fieldWrap}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mobile Number <Text style={styles.req}>*</Text></Text>
                <TouchableOpacity
                  style={styles.qrButton}
                  onPress={() => setScannerVisible(true)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="qr-code" size={18} color={COLORS.primary} />
                  <Text style={styles.qrButtonText}>Scan QR</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputRow}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                </View>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="98765 43210"
                  placeholderTextColor={COLORS.muted}
                  value={phone}
                  onChangeText={(t) => { setPhone(t.replace(/\D/g, '').slice(0, 10)); setError(''); }}
                  keyboardType="phone-pad"
                  maxLength={10}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Email (optional) */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>
                Email <Text style={styles.optional}>(optional)</Text>
              </Text>
              <View style={styles.inputRow}>
                <Ionicons name="mail-outline" size={18} color={COLORS.muted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.muted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* OTP Channel selector */}
            <View style={styles.fieldWrap}>
              <Text style={styles.label}>Receive OTP via</Text>
              <View style={styles.channelRow}>
                <TouchableOpacity
                  style={[styles.channelBtn, channel === 'sms' && styles.channelBtnActive]}
                  onPress={() => setChannel('sms')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={16}
                    color={channel === 'sms' ? COLORS.white : COLORS.muted}
                  />
                  <Text style={[styles.channelText, channel === 'sms' && styles.channelTextActive]}>
                    SMS
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.channelBtn, channel === 'whatsapp' && styles.channelBtnActive]}
                  onPress={() => setChannel('whatsapp')}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="logo-whatsapp"
                    size={16}
                    color={channel === 'whatsapp' ? COLORS.white : COLORS.muted}
                  />
                  <Text style={[styles.channelText, channel === 'whatsapp' && styles.channelTextActive]}>
                    WhatsApp
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Error */}
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={COLORS.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* CTA */}
            <TouchableOpacity
              style={[styles.cta, loading && styles.ctaDisabled]}
              onPress={handleSendOTP}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Text style={styles.ctaText}>
                    {isNewUser ? 'Send OTP & Continue' : 'Send OTP'}
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>

            {/* New / returning toggle */}
            {!isNewUser && (
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => { setIsNewUser(true); setError(''); }}
              >
                <Text style={styles.toggleText}>

      {/* QR Scanner Modal */}
      <QRScannerModal
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScan={handleQRScan}
        title="Scan Phone Number QR"
      />
                  New here? <Text style={styles.toggleLink}>Create account</Text>
                </Text>
              </TouchableOpacity>
            )}
            {isNewUser && (
              <TouchableOpacity
                style={styles.toggleRow}
                onPress={() => { setIsNewUser(false); setError(''); }}
              >
                <Text style={styles.toggleText}>
                  Already have an account? <Text style={styles.toggleLink}>Sign in</Text>
                </Text>
              </TouchableOpacity>
            )}
          </Animated.View>

          <Text style={styles.footer}>
            By continuing you agree to our Terms & Privacy Policy
          </Text>
        </ScrollView>

          {/* QR Scanner Modal */}
          <QRScannerModal
            visible={scannerVisible}
            onClose={() => setScannerVisible(false)}
            onScan={handleQRScan}
            title="Scan Phone Number QR"
          />

          {/* Toggle Row */}
          {!isNewUser && (
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => { setIsNewUser(true); setError(''); }}
            >
              <Text style={styles.toggleText}>
                New here? <Text style={styles.toggleLink}>Create account</Text>
              </Text>
            </TouchableOpacity>
          )}
          {isNewUser && (
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => { setIsNewUser(false); setError(''); }}
            >
              <Text style={styles.toggleText}>
                Already have an account? <Text style={styles.toggleLink}>Sign in</Text>
              </Text>
            </TouchableOpacity>
          )}

          <Text style={styles.footer}>
            By continuing you agree to our Terms & Privacy Policy
          </Text>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  const styles = StyleSheet.create({
    root: {
      flex: 1,
    },
    scroll: {
      flexGrow: 1,
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 40,
    },
    header: {
      alignItems: 'center',
      marginBottom: 36,
    },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: COLORS.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      shadowColor: COLORS.primary,
      shadowOpacity: 0.5,
      shadowRadius: 16,
      elevation: 8,
    },
    logoText: {
      color: COLORS.white,
      fontSize: 26,
      fontWeight: '800',
      letterSpacing: 1,
    },
    brand: {
      color: COLORS.white,
      fontSize: 22,
      fontWeight: '700',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    tagline: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 13,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    card: {
      backgroundColor: COLORS.white,
      borderRadius: 24,
      padding: 24,
      shadowColor: '#000',
      shadowOpacity: 0.15,
      shadowRadius: 24,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 10,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: COLORS.dark,
      marginBottom: 4,
    },
    cardSub: {
      fontSize: 14,
      color: COLORS.muted,
      marginBottom: 24,
    },
    fieldWrap: {
      marginBottom: 16,
    },
    label: {
      fontSize: 13,
      fontWeight: '600',
      color: COLORS.dark,
      marginBottom: 8,
    },
    req: {
      color: COLORS.accent,
    },
    optional: {
      color: COLORS.muted,
      fontWeight: '400',
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.inputBg,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      paddingHorizontal: 12,
      height: 50,
    },
    inputIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      fontSize: 15,
      color: COLORS.dark,
      height: '100%',
    },
    countryCode: {
      paddingRight: 10,
      borderRightWidth: 1,
      borderRightColor: COLORS.border,
      marginRight: 10,
    },
    countryCodeText: {
      fontSize: 14,
      color: COLORS.dark,
      fontWeight: '600',
    },
    labelRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    qrButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: COLORS.primary,
      backgroundColor: 'rgba(139, 94, 60, 0.05)',
    },
    qrButtonText: {
      fontSize: 12,
      fontWeight: '600',
      color: COLORS.primary,
    },
    channelRow: {
      flexDirection: 'row',
      gap: 12,
    },
    channelBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: COLORS.border,
      backgroundColor: COLORS.inputBg,
    },
    channelBtnActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    channelText: {
      fontSize: 14,
      fontWeight: '600',
      color: COLORS.muted,
    },
    channelTextActive: {
      color: COLORS.white,
    },
    errorBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#FFF0ED',
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
    },
    errorText: {
      fontSize: 13,
      color: COLORS.error,
      flex: 1,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: COLORS.primary,
      borderRadius: 14,
      height: 52,
      marginTop: 4,
    },
    ctaDisabled: {
      opacity: 0.6,
    },
    ctaText: {
      color: COLORS.white,
      fontSize: 16,
      fontWeight: '700',
    },
    toggleRow: {
      alignItems: 'center',
      marginTop: 16,
    },
    toggleText: {
      fontSize: 13,
      color: COLORS.muted,
    },
    toggleLink: {
      color: COLORS.primary,
      fontWeight: '700',
    },
    footer: {
      textAlign: 'center',
      color: 'rgba(255,255,255,0.3)',
      fontSize: 11,
      marginTop: 24,
    },
  });
};

