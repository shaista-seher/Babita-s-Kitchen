import React, { useRef, useState, useEffect } from 'react';
import {
  View, StyleSheet, TouchableOpacity, Text, Animated, Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { LoadingScreen } from '../components/loading-screen';

const { width, height } = Dimensions.get('window');

export default function OpeningVideoScreen() {
  const router = useRouter();
  const videoRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const skipOpacity = useRef(new Animated.Value(0)).current;

  // Fade in skip button after 1.5s
  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(skipOpacity, {
        toValue: 1, duration: 600, useNativeDriver: true,
      }).start();
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  const navigateToLogin = () => {
    if (isFading) return;
    setIsFading(true);
    Animated.timing(fadeAnim, {
      toValue: 0, duration: 800, useNativeDriver: true,
    }).start(() => {
      router.replace('/login');
    });
  };

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>

      {/* Loading screen shown while video buffers */}
      {isLoading && (
        <View style={StyleSheet.absoluteFill}>
          <LoadingScreen />
        </View>
      )}

      {/* Video */}
      <Video
        ref={videoRef}
        source={require('../assets/videos/opening.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        isMuted
        onReadyForDisplay={() => setIsLoading(false)}
        onPlaybackStatusUpdate={(status: any) => {
          // When video ends, navigate to login
          if (status.didJustFinish) {
            navigateToLogin();
          }
        }}
      />

      {/* Dark gradient overlay at top and bottom */}
      <LinearGradient
        colors={['rgba(26,21,18,0.6)', 'transparent', 'rgba(26,21,18,0.8)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      {/* Brand name at top */}
      {!isLoading && (
        <View style={styles.topBar}>
          <Text style={styles.brandName}>Babita's Kitchen</Text>
          <Text style={styles.brandTagline}>True taste of home</Text>
        </View>
      )}

      {/* Skip button */}
      {!isLoading && (
        <Animated.View style={[styles.skipWrap, { opacity: skipOpacity }]}>
          <TouchableOpacity
            style={styles.skipBtn}
            onPress={navigateToLogin}
            activeOpacity={0.8}
          >
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={14} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </Animated.View>
      )}

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root:     { flex: 1, backgroundColor: '#1A1512' },
  video:    { width, height, position: 'absolute', top: 0, left: 0 },
  topBar:   { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center' },
  brandName:  { color: '#FFFFFF', fontSize: 26, fontWeight: '800', letterSpacing: 1 },
  brandTagline: { color: 'rgba(255,255,255,0.55)', fontSize: 13, fontStyle: 'italic', marginTop: 4 },
  skipWrap: { position: 'absolute', bottom: 50, right: 24 },
  skipBtn:  { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  skipText: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
});
