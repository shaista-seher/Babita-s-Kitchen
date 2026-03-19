import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Button, InputField } from '../../components/ui';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [otp, setOtp] = useState('');
  const { signInWithPhone, verifyOTP } = useAuth();

  const handleSendOTP = async () => {
    const result = await signInWithPhone(phone);
    if (!result.error) {
      setStep('otp');
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const handleVerify = async () => {
    const result = await verifyOTP(phone, otp);
    if (!result.error) {
      // Navigate to home
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (step === 'otp') {
    return (
      <View className="flex-1 justify-center p-8 bg-[#F8F4EC]">
        <Text className="text-2xl font-bold mb-4">Verify OTP</Text>
        <InputField value={otp} onChange={setOtp} placeholder="Enter OTP" />
        <Button title="Verify" onPress={handleVerify} />
        <TouchableOpacity onPress={() => setStep('phone')}>
          <Text>Change phone</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center p-8 bg-[#F8F4EC]">
      <Image source={require('../../assets/BK_logo.png')} className="w-20 h-20 mx-auto mb-4" />
      <Text className="text-2xl font-serif font-bold text-center mb-2">Welcome</Text>
      <Text className="text-muted-foreground text-center mb-8">Sign in with your phone number</Text>
      <InputField 
        value={phone} 
        onChange={setPhone} 
        placeholder="9876543210"
        keyboardType="phone-pad"
      />
      <Button title="Send OTP" onPress={handleSendOTP} />
      <Button title="Scan QR for Phone" onPress={handleScanQR} className="bg-blue-500" />
    </View>
  );
}

const handleScanQR = async () => {
  // Note: Request camera permission first in real app
  // npx expo install expo-barcode-scanner
  // import BarCodeScanner from 'expo-barcode-scanner';
  // const [hasPermission, setHasPermission] = useState(false);
  // BarCodeScanner.requestPermissionsAsync().then(({ status }) => setHasPermission(status === 'granted'));
  // if (hasPermission) {
  //   const result = await BarCodeScanner.scan();
  //   const phoneMatch = result.data.match(/phone:(\d{10})/i);
  //   if (phoneMatch) {
  //     setPhone(phoneMatch[1]);
  //   } else {
  //     Alert.alert('Invalid QR', 'QR should contain phone:xxxxxxxxxx');
  //   }
  // }
  Alert.alert('QR Scanner', 'Install expo-barcode-scanner and uncomment code for full QR phone prefill. QR format: phone:9876543210');
};

