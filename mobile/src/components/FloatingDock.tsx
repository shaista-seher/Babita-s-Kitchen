import React from 'react';
import {
  Animated,
  Keyboard,
  KeyboardEventName,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../hooks/useCart';
import { colors, radius, shadows, spacing, typeScale } from '../constants/theme';
import { fonts } from '../theme/fonts';
import { RootTabParamList } from '../navigation/types';

type TabName = keyof RootTabParamList;

const ICONS: Record<TabName, keyof typeof Feather.glyphMap> = {
  Home: 'home',
  Menu: 'grid',
  Cart: 'shopping-cart',
  About: 'info',
};

export function FloatingDock({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { totalItems } = useCart();
  const [keyboardVisible, setKeyboardVisible] = React.useState(false);
  const layouts = React.useRef<Record<string, { x: number; width: number }>>({});
  const indicatorX = React.useRef(new Animated.Value(0)).current;
  const indicatorWidth = React.useRef(new Animated.Value(64)).current;

  React.useEffect(() => {
    const showEvent: KeyboardEventName =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent: KeyboardEventName =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  React.useEffect(() => {
    const routeName = state.routes[state.index]?.name;
    const layout = routeName ? layouts.current[routeName] : undefined;

    if (!layout) {
      return;
    }

    Animated.spring(indicatorX, {
      toValue: layout.x,
      useNativeDriver: false,
      stiffness: 200,
      damping: 20,
      mass: 0.9,
    }).start();

    Animated.spring(indicatorWidth, {
      toValue: layout.width,
      useNativeDriver: false,
      stiffness: 200,
      damping: 20,
      mass: 0.9,
    }).start();
  }, [indicatorWidth, indicatorX, state.index, state.routes]);

  const handleLayout = React.useCallback(
    (routeName: string, event: LayoutChangeEvent) => {
      const { x, width } = event.nativeEvent.layout;
      layouts.current[routeName] = { x, width };

      if (routeName === state.routes[state.index]?.name) {
        indicatorX.setValue(x);
        indicatorWidth.setValue(width);
      }
    },
    [indicatorWidth, indicatorX, state.index, state.routes]
  );

  if (keyboardVisible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <BlurView
        intensity={60}
        tint="light"
        style={[styles.shell, { bottom: Math.max(spacing.lg, insets.bottom + spacing.xs) }]}
      >
        <View style={styles.dock}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.activePill,
              {
                transform: [{ translateX: indicatorX }],
                width: indicatorWidth,
              },
            ]}
          />
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const options = descriptors[route.key].options;
            const label =
              typeof options.tabBarLabel === 'string'
                ? options.tabBarLabel
                : options.title ?? route.name;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };

            return (
              <Pressable
                key={route.key}
                onLayout={(event) => handleLayout(route.name, event)}
                onPress={onPress}
                style={({ pressed }) => [styles.item, focused && styles.itemFocused, pressed && styles.pressed]}
              >
                <View style={[styles.iconWrap, focused && styles.iconWrapFocused]}>
                  <Feather
                    name={ICONS[route.name as TabName]}
                    size={23}
                    color={focused ? colors.primary : '#9F8D84'}
                  />
                  {route.name === 'Cart' && totalItems > 0 ? <View style={styles.badge} /> : null}
                </View>
                {focused ? <Text style={styles.label}>{label}</Text> : null}
                {focused ? <View style={styles.dot} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    alignSelf: 'center',
    minWidth: 278,
    height: 70,
    borderRadius: radius.pill,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.72)',
    backgroundColor: 'rgba(255,250,246,0.86)',
    ...shadows.dock,
  },
  dock: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    borderRadius: 22,
    backgroundColor: 'rgba(123, 27, 27, 0.10)',
  },
  item: {
    minWidth: 60,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    zIndex: 1,
  },
  itemFocused: {
    paddingHorizontal: 14,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapFocused: {
    backgroundColor: 'rgba(255,255,255,0.75)',
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    lineHeight: 13,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -1,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
});
