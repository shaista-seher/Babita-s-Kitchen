import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  ActivityIndicator, Alert, Dimensions, SafeAreaView,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const COLORS = {
  bg: '#F8F4EC',
  primary: '#8B5E3C',
  accent: '#E2725B',
  dark: '#3D2B1F',
  white: '#FFFFFF',
  success: '#4CAF50',
  error: '#E2725B',
};

interface QRScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onScan: (data: string) => void;
  title?: string;
}

export default function QRScannerModal({
  visible,
  onClose,
  onScan,
  title = 'Scan QR Code',
}: QRScannerModalProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const getPermission = async () => {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        if (status !== 'granted') {
          Alert.alert(
            'Permission Denied',
            'Camera permission is required to scan QR codes. Please enable it in settings.',
            [{ text: 'OK', onPress: onClose }]
          );
        }
      } catch (err) {
        console.error('Permission error:', err);
        setHasPermission(false);
      }
    };

    if (visible) {
      setScanned(false);
      getPermission();
    }
  }, [visible]);

  const handleBarCodeScanned = async ({ data }: { data: string; type: string }) => {
    if (scanned || scanning) return;

    setScanning(true);
    setScanned(true);

    try {
      // Extract phone number from QR code (format: "phone:9876543210" or just "9876543210")
      let phoneNumber = data.trim();

      // Check if it starts with "phone:" prefix
      if (phoneNumber.toLowerCase().startsWith('phone:')) {
        phoneNumber = phoneNumber.substring(6).trim();
      }

      // Validate phone number (10 digits)
      if (!/^\d{10}$/.test(phoneNumber)) {
        // If it's not a standard phone number, try to see if it contains a phone number
        const match = phoneNumber.match(/(\d{10})/);
        if (match) {
          phoneNumber = match[1];
        } else {
          Alert.alert(
            'Invalid QR Code',
            'This QR code does not contain a valid phone number.\nExpected format: 10-digit number or "phone:XXXXXXXXXX"'
          );
          setScanning(false);
          setScanned(false);
          return;
        }
      }

      // Success - close modal and pass data back
      onScan(phoneNumber);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error('Scan error:', error);
      Alert.alert('Scan Error', 'Failed to process QR code. Please try again.');
      setScanning(false);
      setScanned(false);
    }
  };

  if (hasPermission === null) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.permissionContainer}>
          <View style={styles.permissionCard}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.permissionText}>Requesting camera permission...</Text>
          </View>
        </View>
      </Modal>
    );
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.permissionContainer}>
          <View style={styles.permissionCard}>
            <Ionicons name="camera-off" size={48} color={COLORS.error} />
            <Text style={styles.permissionDeniedTitle}>Camera Access Denied</Text>
            <Text style={styles.permissionDeniedText}>
              Please enable camera permissions in your device settings to use QR scanning.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={COLORS.dark} />
          </TouchableOpacity>
        </View>

        {/* Camera View */}
        <View style={styles.cameraContainer}>
          {!scanned ? (
            <>
              <BarCodeScanner
                onBarCodeScanned={scanned || scanning ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              {/* Overlay with frame */}
              <View style={styles.overlay}>
                <View style={styles.unfocused} />
                <View style={styles.focusedRow}>
                  <View style={styles.unfocused} />
                  <View style={styles.focused} />
                  <View style={styles.unfocused} />
                </View>
                <View style={styles.unfocused} />
              </View>

              {/* Corner indicators */}
              <View style={[styles.corner, styles.cornerTopLeft]} />
              <View style={[styles.corner, styles.cornerTopRight]} />
              <View style={[styles.corner, styles.cornerBottomLeft]} />
              <View style={[styles.corner, styles.cornerBottomRight]} />
            </>
          ) : (
            <View style={styles.scannedContainer}>
              <Ionicons name="checkmark-circle" size={80} color={COLORS.success} />
              <Text style={styles.scannedText}>QR Code Scanned!</Text>
              <ActivityIndicator size="large" color={COLORS.primary} style={styles.spinner} />
            </View>
          )}
        </View>

        {/* Instructions */}
        {!scanned && (
          <View style={styles.instructions}>
            <Ionicons name="camera" size={24} color={COLORS.primary} />
            <Text style={styles.instructionText}>
              Position the QR code within the frame
            </Text>
          </View>
        )}

        {/* Manual Entry Fallback */}
        {!scanned && (
          <View style={styles.footer}>
            <Text style={styles.footerText}>Can't scan? Enter phone manually instead</Text>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: '#D4C4B0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
  },
  closeButton: {
    padding: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.dark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  unfocused: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  focusedRow: {
    flexDirection: 'row',
    flex: 1.5,
  },
  focused: {
    flex: 1,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: COLORS.accent,
    borderWidth: 3,
  },
  cornerTopLeft: {
    top: '25%',
    left: '10%',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cornerTopRight: {
    top: '25%',
    right: '10%',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  cornerBottomLeft: {
    bottom: '25%',
    left: '10%',
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  cornerBottomRight: {
    bottom: '25%',
    right: '10%',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  scannedContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  scannedText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 16,
  },
  spinner: {
    marginTop: 24,
  },
  instructions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  instructionText: {
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.bg,
    borderTopWidth: 1,
    borderTopColor: '#D4C4B0',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.muted,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  permissionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  permissionText: {
    marginTop: 16,
    fontSize: 14,
    color: COLORS.dark,
    textAlign: 'center',
  },
  permissionDeniedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.dark,
    marginTop: 16,
  },
  permissionDeniedText: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
