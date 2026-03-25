import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';

export default function QRScannerScreen() {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const navigation = useNavigation();

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
    if (!permission) return;
    if (!permission.granted) {
      requestPermission().then((response) => {
        if (!response.granted) {
          Alert.alert('Camera permission required', 'Please grant camera permission in settings.');
        }
      });
    }
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F8F4EC]">
        <ActivityIndicator size="large" color="#8B5E3C" />
        <Text className="mt-3">Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
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
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={scanned ? undefined : onBarCodeScanned}
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
