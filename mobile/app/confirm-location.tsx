import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Animated, Alert,
  KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

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
  cardBg:   'rgba(255,255,255,0.07)',
};

type LocationMode = 'choose' | 'search' | 'pincode' | 'manual';

interface LocationResult {
  display_name: string;
  lat: string;
  lon: string;
  address?: { postcode?: string; suburb?: string; city?: string; state?: string };
}

export default function ConfirmLocationScreen() {
  const router = useRouter();
  const { userId, name } = useLocalSearchParams<{ userId: string; name: string }>();

  const [mode, setMode]             = useState<LocationMode>('choose');
  const [loading, setLoading]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState('');

  // GPS
  const [gpsAddress, setGpsAddress] = useState('');
  const [gpsCoords, setGpsCoords]   = useState<{ lat: number; lng: number } | null>(null);

  // Search by area
  const [searchQuery, setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<LocationResult | null>(null);

  // Pincode
  const [pincode, setPincode]       = useState('');
  const [pincodeArea, setPincodeArea] = useState('');
  const [pincodeLoading, setPincodeLoading] = useState(false);

  // Manual
  const [line1, setLine1]           = useState('');
  const [line2, setLine2]           = useState('');
  const [city, setCity]             = useState('');
  const [manualPin, setManualPin]   = useState('');
  const [label, setLabel]           = useState<'Home' | 'Work' | 'Other'>('Home');

  const slideAnim = useRef(new Animated.Value(0)).current;

  const animateIn = () => {
    slideAnim.setValue(30);
    Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }).start();
  };

  const setModeAnimated = (m: LocationMode) => {
    setMode(m);
    setError('');
    animateIn();
  };

  // ── GPS ──────────────────────────────────────────────────
  const handleGPS = async () => {
    setLoading(true);
    setError('');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please try another method.');
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      const { latitude: lat, longitude: lng } = pos.coords;
      setGpsCoords({ lat, lng });

      // Reverse geocode via Nominatim (free, no API key needed)
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
        { headers: { 'User-Agent': 'BabitasKitchenApp/1.0' } }
      );
      const data = await res.json();
      setGpsAddress(data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
      setModeAnimated('choose'); // stay on choose, GPS result shown inline
    } catch {
      setError('Could not get your location. Please try manually.');
    } finally {
      setLoading(false);
    }
  };

  // ── Area search ──────────────────────────────────────────
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    setSelectedResult(null);
    if (!q.trim()) { setSearchResults([]); return; }

    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q + ', India')}&format=json&limit=5&addressdetails=1`,
          { headers: { 'User-Agent': 'BabitasKitchenApp/1.0' } }
        );
        const data: LocationResult[] = await res.json();
        setSearchResults(data);
      } catch { setSearchResults([]); }
      finally { setSearchLoading(false); }
    }, 500);
  };

  // ── Pincode lookup ───────────────────────────────────────
  const handlePincodeLookup = async () => {
    if (pincode.length !== 6) {
      setError('Enter a valid 6-digit pincode');
      return;
    }
    setPincodeLoading(true);
    setPincodeArea('');
    setError('');
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = await res.json();
      if (data[0]?.Status === 'Success' && data[0]?.PostOffice?.length) {
        const po = data[0].PostOffice[0];
        setPincodeArea(`${po.Name}, ${po.District}, ${po.State}`);
      } else {
        setError('Invalid pincode or not found');
      }
    } catch {
      setError('Pincode lookup failed. Check your connection.');
    } finally {
      setPincodeLoading(false);
    }
  };

  // ── Save & Continue ──────────────────────────────────────
  const handleConfirm = async () => {
    setError('');

    let addressPayload: object | null = null;

    if (gpsCoords && mode === 'choose') {
      addressPayload = {
        line1:    gpsAddress.split(',')[0] || 'GPS Location',
        city:     gpsAddress.split(',').slice(-3, -2)[0]?.trim() || 'Bengaluru',
        pincode:  '000000',
        lat:      gpsCoords.lat,
        lng:      gpsCoords.lng,
        source:   'gps',
        label:    'Home',
      };
    } else if (mode === 'search' && selectedResult) {
      addressPayload = {
        line1:    selectedResult.display_name.split(',')[0],
        city:     selectedResult.address?.city || selectedResult.address?.suburb || 'Bengaluru',
        pincode:  selectedResult.address?.postcode || '000000',
        lat:      parseFloat(selectedResult.lat),
        lng:      parseFloat(selectedResult.lon),
        source:   'search',
        label:    'Home',
      };
    } else if (mode === 'pincode' && pincodeArea) {
      addressPayload = {
        line1:    pincodeArea.split(',')[0],
        city:     pincodeArea.split(',')[1]?.trim() || 'Bengaluru',
        pincode,
        lat:      null,
        lng:      null,
        source:   'pincode',
        label:    'Home',
      };
    } else if (mode === 'manual') {
      if (!line1.trim() || !city.trim() || manualPin.length !== 6) {
        setError('Please fill in Address Line 1, City, and a valid Pincode');
        return;
      }
      addressPayload = {
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city:  city.trim(),
        pincode: manualPin,
        lat:   null,
        lng:   null,
        source: 'manual',
        label,
      };
    } else {
      setError('Please select or enter a delivery location first');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/location/confirm`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, address: addressPayload }),
        }
      );
      if (!res.ok) throw new Error('Failed to save location');
      // Navigate to the main app home
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Could not save location. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const canConfirm =
    (mode === 'choose' && !!gpsCoords) ||
    (mode === 'search' && !!selectedResult) ||
    (mode === 'pincode' && !!pincodeArea) ||
    (mode === 'manual' && !!line1 && !!city && manualPin.length === 6);

  return (
    <LinearGradient colors={['#2A1F1A', '#1A1512', '#2A1F1A']} style={{ flex: 1 }}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Ionicons name="location" size={30} color={COLORS.white} />
            </View>
            <Text style={styles.title}>
              {name ? `Hi ${name.split(' ')[0]}! 👋` : 'Confirm Location'}
            </Text>
            <Text style={styles.subtitle}>
              Where should we deliver your order?
            </Text>
          </View>

          {/* GPS result banner (if fetched) */}
          {gpsCoords && (
            <Animated.View style={[styles.gpsBanner, { transform: [{ translateY: slideAnim }] }]}>
              <Ionicons name="navigate-circle" size={20} color={COLORS.success} />
              <Text style={styles.gpsText} numberOfLines={2}>{gpsAddress}</Text>
            </Animated.View>
          )}

          {/* Method cards */}
          {(mode === 'choose' || !gpsCoords) && (
            <View style={styles.methodGrid}>

              {/* GPS */}
              <TouchableOpacity
                style={[styles.methodCard, loading && styles.methodCardDisabled]}
                onPress={handleGPS}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading
                  ? <ActivityIndicator color={COLORS.primary} />
                  : <Ionicons name="navigate-outline" size={26} color={COLORS.primary} />
                }
                <Text style={styles.methodLabel}>Use GPS</Text>
                <Text style={styles.methodSub}>Auto-detect location</Text>
              </TouchableOpacity>

              {/* Search */}
              <TouchableOpacity
                style={[styles.methodCard, mode === 'search' && styles.methodCardActive]}
                onPress={() => setModeAnimated('search')}
                activeOpacity={0.8}
              >
                <Ionicons name="search-outline" size={26} color={mode === 'search' ? COLORS.white : COLORS.primary} />
                <Text style={[styles.methodLabel, mode === 'search' && { color: COLORS.white }]}>Search Area</Text>
                <Text style={[styles.methodSub, mode === 'search' && { color: 'rgba(255,255,255,0.6)' }]}>Area or landmark</Text>
              </TouchableOpacity>

              {/* Pincode */}
              <TouchableOpacity
                style={[styles.methodCard, mode === 'pincode' && styles.methodCardActive]}
                onPress={() => setModeAnimated('pincode')}
                activeOpacity={0.8}
              >
                <Ionicons name="keypad-outline" size={26} color={mode === 'pincode' ? COLORS.white : COLORS.primary} />
                <Text style={[styles.methodLabel, mode === 'pincode' && { color: COLORS.white }]}>Pincode</Text>
                <Text style={[styles.methodSub, mode === 'pincode' && { color: 'rgba(255,255,255,0.6)' }]}>Enter 6-digit code</Text>
              </TouchableOpacity>

              {/* Manual */}
              <TouchableOpacity
                style={[styles.methodCard, mode === 'manual' && styles.methodCardActive]}
                onPress={() => setModeAnimated('manual')}
                activeOpacity={0.8}
              >
                <Ionicons name="create-outline" size={26} color={mode === 'manual' ? COLORS.white : COLORS.primary} />
                <Text style={[styles.methodLabel, mode === 'manual' && { color: COLORS.white }]}>Manual</Text>
                <Text style={[styles.methodSub, mode === 'manual' && { color: 'rgba(255,255,255,0.6)' }]}>Type full address</Text>
              </TouchableOpacity>

            </View>
          )}

          {/* ── Search panel ── */}
          {mode === 'search' && (
            <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.inputRow}>
                <Ionicons name="search-outline" size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Koramangala, Bengaluru"
                  placeholderTextColor={COLORS.muted}
                  value={searchQuery}
                  onChangeText={handleSearchChange}
                  autoFocus
                />
                {searchLoading && <ActivityIndicator size="small" color={COLORS.primary} />}
              </View>

              {searchResults.map((r, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.resultRow, selectedResult === r && styles.resultRowActive]}
                  onPress={() => { setSelectedResult(r); setSearchQuery(r.display_name.split(',').slice(0, 2).join(',')); setSearchResults([]); }}
                >
                  <Ionicons name="location-outline" size={16} color={selectedResult === r ? COLORS.white : COLORS.muted} style={{ marginRight: 8 }} />
                  <Text style={[styles.resultText, selectedResult === r && { color: COLORS.white }]} numberOfLines={2}>
                    {r.display_name}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          {/* ── Pincode panel ── */}
          {mode === 'pincode' && (
            <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
              <View style={styles.inputRow}>
                <Ionicons name="keypad-outline" size={18} color={COLORS.muted} style={{ marginRight: 8 }} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="e.g. 560034"
                  placeholderTextColor={COLORS.muted}
                  value={pincode}
                  onChangeText={t => { setPincode(t.replace(/\D/g, '').slice(0, 6)); setPincodeArea(''); setError(''); }}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.lookupBtn, pincode.length !== 6 && { opacity: 0.4 }]}
                  onPress={handlePincodeLookup}
                  disabled={pincode.length !== 6 || pincodeLoading}
                >
                  {pincodeLoading
                    ? <ActivityIndicator size="small" color={COLORS.white} />
                    : <Text style={styles.lookupBtnText}>Look up</Text>
                  }
                </TouchableOpacity>
              </View>

              {!!pincodeArea && (
                <View style={styles.pincodeResult}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.pincodeResultText}>{pincodeArea}</Text>
                </View>
              )}
            </Animated.View>
          )}

          {/* ── Manual panel ── */}
          {mode === 'manual' && (
            <Animated.View style={[styles.panel, { transform: [{ translateY: slideAnim }] }]}>
              {/* Label selector */}
              <View style={styles.labelRow}>
                {(['Home', 'Work', 'Other'] as const).map(l => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.labelBtn, label === l && styles.labelBtnActive]}
                    onPress={() => setLabel(l)}
                  >
                    <Ionicons
                      name={l === 'Home' ? 'home-outline' : l === 'Work' ? 'briefcase-outline' : 'bookmark-outline'}
                      size={14}
                      color={label === l ? COLORS.white : COLORS.muted}
                    />
                    <Text style={[styles.labelText, label === l && { color: COLORS.white }]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {[
                { label: 'Address Line 1 *', value: line1, set: setLine1, placeholder: 'House / Flat / Building no.' },
                { label: 'Address Line 2', value: line2, set: setLine2, placeholder: 'Street / Area (optional)' },
                { label: 'City *', value: city, set: setCity, placeholder: 'e.g. Bengaluru' },
                { label: 'Pincode *', value: manualPin, set: (t: string) => setManualPin(t.replace(/\D/g,'').slice(0,6)), placeholder: '6-digit pincode', keyboard: 'number-pad' as const },
              ].map((f, i) => (
                <View key={i} style={{ marginBottom: 12 }}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, { flex: 1 }]}
                      placeholder={f.placeholder}
                      placeholderTextColor={COLORS.muted}
                      value={f.value}
                      onChangeText={f.set}
                      keyboardType={f.keyboard || 'default'}
                      autoCapitalize="words"
                    />
                  </View>
                </View>
              ))}
            </Animated.View>
          )}

          {/* Error */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={15} color={COLORS.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Confirm button */}
          <TouchableOpacity
            style={[styles.cta, (!canConfirm || saving) && styles.ctaDisabled]}
            onPress={handleConfirm}
            disabled={!canConfirm || saving}
            activeOpacity={0.85}
          >
            {saving
              ? <ActivityIndicator color={COLORS.white} />
              : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.white} />
                  <Text style={styles.ctaText}>Confirm & Continue</Text>
                </>
              )
            }
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  scroll:       { flexGrow: 1, paddingHorizontal: 22, paddingTop: 60, paddingBottom: 50 },

  header:       { alignItems: 'center', marginBottom: 28 },
  iconCircle:   { width: 68, height: 68, borderRadius: 34, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 14, shadowColor: COLORS.primary, shadowOpacity: 0.5, shadowRadius: 14, elevation: 8 },
  title:        { fontSize: 24, fontWeight: '800', color: COLORS.white, marginBottom: 6, textAlign: 'center' },
  subtitle:     { fontSize: 14, color: 'rgba(255,255,255,0.5)', textAlign: 'center' },

  gpsBanner:    { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: 'rgba(76,175,80,0.15)', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(76,175,80,0.3)' },
  gpsText:      { flex: 1, fontSize: 13, color: COLORS.white, lineHeight: 18 },

  methodGrid:   { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
  methodCard:   { width: '47%', backgroundColor: COLORS.cardBg, borderRadius: 16, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.1)' },
  methodCardActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  methodCardDisabled: { opacity: 0.5 },
  methodLabel:  { color: COLORS.white, fontSize: 14, fontWeight: '700', marginTop: 8 },
  methodSub:    { color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 2, textAlign: 'center' },

  panel:        { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  inputRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, height: 48, marginBottom: 8 },
  input:        { flex: 1, fontSize: 15, color: COLORS.white },
  fieldLabel:   { fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontWeight: '600' },

  lookupBtn:    { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  lookupBtnText:{ color: COLORS.white, fontSize: 13, fontWeight: '700' },

  pincodeResult:{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(76,175,80,0.1)', borderRadius: 10, padding: 10 },
  pincodeResultText: { fontSize: 13, color: COLORS.white, flex: 1 },

  resultRow:    { flexDirection: 'row', alignItems: 'flex-start', padding: 10, borderRadius: 10, marginBottom: 4 },
  resultRowActive: { backgroundColor: COLORS.primary },
  resultText:   { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 18 },

  labelRow:     { flexDirection: 'row', gap: 8, marginBottom: 16 },
  labelBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)' },
  labelBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  labelText:    { fontSize: 13, color: COLORS.muted, fontWeight: '600' },

  errorBox:     { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(226,114,91,0.15)', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText:    { fontSize: 13, color: COLORS.error, flex: 1 },

  cta:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: COLORS.primary, borderRadius: 14, height: 54, marginTop: 8 },
  ctaDisabled:  { opacity: 0.4 },
  ctaText:      { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
