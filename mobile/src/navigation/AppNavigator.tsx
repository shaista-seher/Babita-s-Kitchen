import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { useCart } from '../hooks/useCart';
import AboutScreen from '../screens/AboutScreen';
import AdminScreen from '../screens/AdminScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ContactScreen from '../screens/ContactScreen';
import DishDetailsScreen from '../screens/DishDetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import MenuScreen from '../screens/MenuScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import PolicyScreen from '../screens/PolicyScreen';
import SignupScreen from '../screens/SignupScreen';
import { colors } from '../theme/colors';
import { fonts } from '../theme/fonts';
import { RootStackParamList, RootTabParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function TabsNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#b0a8a0',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          shadowColor: '#8B1A1A',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 16,
          elevation: 12,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.body,
          fontSize: 11,
        },
        tabBarIcon: ({ color, size, focused }) => (
          <TabIcon routeName={route.name} color={color} size={size} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Menu" component={MenuScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="About" component={AboutScreen} />
    </Tab.Navigator>
  );
}

function TabIcon({
  routeName,
  color,
  size,
  focused,
}: {
  routeName: keyof RootTabParamList;
  color: string;
  size: number;
  focused: boolean;
}) {
  const { totalItems } = useCart();
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (routeName === 'Cart' && totalItems > 0) {
      scale.value = withSequence(withSpring(1.4), withSpring(1));
    }
  }, [routeName, scale, totalItems]);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const icon =
    routeName === 'Home' ? (
      <Feather name="home" color={color} size={size} />
    ) : routeName === 'Menu' ? (
      <MaterialCommunityIcons name="silverware-fork-knife" color={color} size={size} />
    ) : routeName === 'Cart' ? (
      <Feather name="shopping-cart" color={color} size={size} />
    ) : (
      <Feather name="info" color={color} size={size} />
    );

  return (
    <View style={{ width: 32, height: 28, alignItems: 'center' }}>
      {focused ? <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.primary, marginBottom: 3 }} /> : <View style={{ height: 9 }} />}
      {icon}
      {routeName === 'Cart' && totalItems > 0 ? (
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              right: 0,
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor: colors.primary,
              borderWidth: 2,
              borderColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            },
            badgeStyle,
          ]}
        >
          <Text style={{ color: colors.white, fontFamily: fonts.bodyBold, fontSize: 10 }}>{totalItems}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabsNavigator} />
        <Stack.Screen name="DishDetails" component={DishDetailsScreen} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
        <Stack.Screen name="Admin" component={AdminScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Policy" component={PolicyScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
