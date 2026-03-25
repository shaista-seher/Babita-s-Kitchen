import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function QRScannerScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();

  const onBarCodeScanned = useCallback(({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    const trimmed = data.trim();
    let phone = trimmed;
    if (/^phone:/i.test(trimmed)) {
      phone = trimmed.split(':')[1].trim();
    }

    const match = phone.match(/\d{10}/);
    if (!match) {
      Alert.alert('Invalid QR', 'QR code did not contain a valid phone number');
      setScanned(false);
      return;
    }

    const parsedPhone = match[0];
    navigation.navigate('Login' as never, { scannedPhone: parsedPhone } as never);
  }, [scanned, navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert('Camera permission required', 'Please grant camera permission in settings.');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F4EC]">
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Text className="mt-3">Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F4EC] p-4">
        <Text className="text-center">Camera access is required to scan QR codes.</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 px-4 py-2 bg-[#8B5E3C] rounded-lg">
          <Text className="text-white">Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : onBarCodeScanned}
        className="flex-1"
      />
      <View className="absolute inset-x-0 bottom-10 items-center">
        <Text className="text-white text-lg font-bold">Hold QR code inside frame</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} className="mt-4 px-4 py-3 rounded-lg bg-white/90">
          <Text className="text-black font-semibold">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
