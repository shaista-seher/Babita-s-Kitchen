import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="opening-video" options={{ animation: 'none' }} />
        <Stack.Screen name="login"         options={{ animation: 'fade' }} />
        <Stack.Screen name="verify-otp"    options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="confirm-location" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="index"         options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}
