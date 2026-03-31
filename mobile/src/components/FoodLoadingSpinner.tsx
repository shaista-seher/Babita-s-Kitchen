import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, G } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ICON_SIZE = 60;
const RADIUS = 120;
const CENTER_X = SCREEN_WIDTH / 2;
const CENTER_Y = SCREEN_HEIGHT / 2 - 50;

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedG = Animated.createAnimatedComponent(G);

interface FoodIconProps {
  progress: Animated.SharedValue;
  angle: number;
  delay: number;
  children: React.ReactNode;
}

function FoodIcon({ progress, angle, delay, children }: FoodIconProps) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [0, 1];
    const scale = progress.value === 0 ? 0.8 : 1.2;
    const opacity = Easing.out(Easing.ease)(progress.value) * 0.7 + 0.3;
    const floatY = Math.sin(progress.value * Math.PI * 2 + delay) * 20;
    return {
      transform: [
        { translateX: Math.cos((angle * Math.PI) / 180) * RADIUS },
        { translateY: Math.sin((angle * Math.PI) / 180) * RADIUS + floatY },
        { scale: scale },
      ],
      opacity,
    };
  });

  return (
    <AnimatedG style={[animatedStyle, { transform: [{ translateX: CENTER_X - ICON_SIZE / 2 }, { translateY: CENTER_Y - ICON_SIZE / 2 }] }]}>
      {children}
    </AnimatedG>
  );
}

export default function FoodLoadingSpinner() {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [progress]);

  return (
    <View style={styles.container}>
      <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT} viewBox={`0 0 ${SCREEN_WIDTH} ${SCREEN_HEIGHT}`}>
        <FoodIcon progress={progress} angle={45} delay={0}>
          {/* Pickle Jar 🫙 */}
          <G fill="#8B5E3C" stroke="#6B4C2F" strokeWidth="2">
            <Path d="M20 10 Q25 5 30 10 V35 Q30 40 25 35 H15 Q10 40 10 35 V10 Q15 5 20 10 Z" />
            <Path d="M12 15 L12 25 M20 15 L20 25 M28 15 L28 25" strokeDasharray="2,2" stroke="#D4AF37" />
            <Circle cx="25" cy="12" r="3" fill="#4A7C59" />
          </G>
        </FoodIcon>

        <FoodIcon progress={progress} angle={135} delay={1}>
          {/* Papad 🫓 flat crisp */}
          <Circle cx="25" cy="25" r="20" fill="#D2B48C" stroke="#A67C00" strokeWidth="3" opacity="0.9"/>
          <Path d="M10 15 Q15 10 20 15 Q25 20 30 15 Q35 10 35 20" stroke="#8B4513" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <Circle cx="18" cy="20" r="2" fill="#654321"/>
          <Circle cx="28" cy="18" r="1.5" fill="#654321"/>
        </FoodIcon>

        <FoodIcon progress={progress} angle={225} delay={2}>
          {/* Bowl with spoon 🥣 */}
          <Path d="M10 25 Q25 15 40 25 Q45 30 40 35 Q25 45 10 35 Q5 30 10 25 Z" fill="#F5DEB3" stroke="#8B4513" strokeWidth="2.5"/>
          <Path d="M30 20 L35 15 L40 25" stroke="#CD853F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          <Circle cx="35" cy="18" r="2" fill="#FFF8DC"/>
        </FoodIcon>

        <FoodIcon progress={progress} angle={315} delay={3}>
          {/* Bottle 🍶 */}
          <Path d="M25 5 L20 10 L15 35 Q15 40 20 40 H30 Q35 40 35 35 L30 10 Z" fill="#8B7355" stroke="#654321" strokeWidth="2"/>
          <Path d="M18 12 L32 12" stroke="#D4AF37" strokeWidth="2"/>
          <Circle cx="22" cy="28" r="3" fill="#4A7C59" opacity="0.8"/>
          <Circle cx="28" cy="30" r="2.5" fill="#4A7C59" opacity="0.8"/>
        </FoodIcon>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F4EC', // cream bg
  },
});

