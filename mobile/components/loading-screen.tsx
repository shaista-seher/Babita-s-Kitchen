import React, { useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, Animated, Dimensions, Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Food icons using Ionicons — closest matches to the brand
const FOOD_ICONS: { name: any; color: string; label: string }[] = [
  { name: 'flask-outline',        color: '#E2725B', label: 'Pickle Jar'  }, // 🫙 pickle jar
  { name: 'pizza-outline',        color: '#D4A96A', label: 'Papad'       }, // 🫓 papad / flatbread
  { name: 'cafe-outline',         color: '#8B5E3C', label: 'Bowl'        }, // 🥣 bowl with spoon
  { name: 'wine-outline',         color: '#C4763A', label: 'Bottle'      }, // 🍶 bottle
  { name: 'leaf-outline',         color: '#6B9E5E', label: 'Fresh'       }, // organic
  { name: 'restaurant-outline',   color: '#E2725B', label: 'Food'        }, // general food
];

// Each floating icon has its own position and timing
const POSITIONS = [
  { x: width * 0.12, y: height * 0.15, delay: 0,    duration: 2800 },
  { x: width * 0.75, y: height * 0.12, delay: 400,  duration: 3200 },
  { x: width * 0.08, y: height * 0.55, delay: 800,  duration: 2600 },
  { x: width * 0.80, y: height * 0.50, delay: 200,  duration: 3000 },
  { x: width * 0.20, y: height * 0.78, delay: 600,  duration: 2900 },
  { x: width * 0.65, y: height * 0.75, delay: 1000, duration: 2700 },
];

interface FloatingIconProps {
  icon: typeof FOOD_ICONS[0];
  position: typeof POSITIONS[0];
}

function FloatingIcon({ icon, position }: FloatingIconProps) {
  const floatAnim  = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(opacityAnim, {
      toValue: 0.7,
      duration: 600,
      delay: position.delay,
      useNativeDriver: true,
    }).start();

    // Float up and down forever
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -18,
          duration: position.duration,
          delay: position.delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: position.duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Gentle sway rotation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: position.duration * 1.2,
          delay: position.delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: -1,
          duration: position.duration * 1.2,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: position.duration * 0.6,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-12deg', '12deg'],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        opacity: opacityAnim,
        transform: [{ translateY: floatAnim }, { rotate }],
      }}
    >
      <View style={styles.iconWrap}>
        <Ionicons name={icon.name} size={32} color={icon.color} />
      </View>
    </Animated.View>
  );
}

// ── Pulsing dots loader ────────────────────────────────────
function PulsingDots() {
  const dots = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    dots.forEach((dot, i) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(dot, { toValue: 1,   duration: 400, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0.3, duration: 400, useNativeDriver: true }),
          Animated.delay((dots.length - i - 1) * 200),
        ])
      ).start();
    });
  }, []);

  return (
    <View style={styles.dotsRow}>
      {dots.map((dot, i) => (
        <Animated.View
          key={i}
          style={[styles.dot, { opacity: dot, transform: [{ scale: dot }] }]}
        />
      ))}
    </View>
  );
}

// ── Main loading screen export ─────────────────────────────
export function LoadingScreen({ message = 'Loading…' }: { message?: string }) {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient colors={['#2A1F1A', '#1A1512', '#2A1F1A']} style={styles.root}>

      {/* Floating food icons in background */}
      {FOOD_ICONS.map((icon, i) => (
        <FloatingIcon key={i} icon={icon} position={POSITIONS[i]} />
      ))}

      {/* Center content */}
      <View style={styles.center}>
        <Animated.View style={[styles.logoCircle, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
          <Ionicons name="storefront-outline" size={36} color="#FFFFFF" />
        </Animated.View>

        <Animated.Text style={[styles.brand, { opacity: logoOpacity }]}>
          Babita's Kitchen
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: logoOpacity }]}>
          True taste of home
        </Animated.Text>

        <PulsingDots />

        {message !== 'Loading…' && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root:       { flex: 1 },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#8B5E3C', alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#8B5E3C', shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  brand:      { color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6 },
  tagline:    { color: 'rgba(255,255,255,0.45)', fontSize: 13, fontStyle: 'italic', marginBottom: 32 },
  dotsRow:    { flexDirection: 'row', gap: 8, alignItems: 'center' },
  dot:        { width: 8, height: 8, borderRadius: 4, backgroundColor: '#8B5E3C' },
  message:    { color: 'rgba(255,255,255,0.4)', fontSize: 12, marginTop: 16 },
  iconWrap:   { width: 52, height: 52, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
});
