import React, { useRef, useEffect, useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { useRouter } from 'expo-router';
import { colors } from '../theme/colors';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface VideoSplashScreenProps {
  onComplete?: () => void;
}

export default function VideoSplashScreen({ onComplete }: VideoSplashScreenProps) {
  const router = useRouter();
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = React.useState<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    setStatus(status);
    if (status.isLoaded) {
      // Auto navigate after 5 seconds or video end
      if ((status.positionMillis && status.positionMillis > 5000) || status.didJustFinish) {
        timeoutRef.current && clearTimeout(timeoutRef.current);
        router.replace('/login');
        onComplete?.();
      }
    }
  }, [router, onComplete]);

  useEffect(() => {
    // 5s timeout fallback
    timeoutRef.current = setTimeout(() => {
      router.replace('/login');
      onComplete?.();
    }, 5000);

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [router, onComplete]);

  return (
    <View style={styles.container}>
      <Video
        ref={videoRef}
        source={require('../../assets/videos/opening.mp4')}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        shouldPlay
        useNativeControls={false}
        style={styles.video}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
});

