import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    setIsScanning(true);
    // React Native에서는 카메라 권한이 필요하므로 데모용으로 시뮬레이션
    Alert.alert(
      '카메라 권한',
      '실제 앱에서는 카메라 권한이 필요합니다. 데모용으로 가상 스캔을 진행합니다.',
      [
        { text: '확인', onPress: simulateScan }
      ]
    );
  };

  const simulateScan = () => {
    // 데모용 가짜 QR 스캔
    setTimeout(() => {
      onScan(JSON.stringify({
        type: 'payment_request',
        currency: 'KRW',
        amount: '5000',
        timestamp: Date.now()
      }));
      setIsScanning(false);
    }, 1500);
  };

  return (
    <View style={styles.container}>
      <View style={styles.scannerArea}>
        {isScanning ? (
          <View style={styles.scanningContainer}>
            <IconSymbol name="camera" size={48} color="#ffffff" />
            <Text style={styles.scanningText}>스캔 중...</Text>
          </View>
        ) : (
          <View style={styles.cameraPlaceholder}>
            <IconSymbol name="camera" size={64} color="#6b7280" />
          </View>
        )}

        {/* 스캔 오버레이 */}
        <View style={styles.overlay}>
          <View style={styles.scanFrame}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>

      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          QR 코드를 스캔 영역에 맞춰주세요
        </Text>

        {!isScanning ? (
          <TouchableOpacity style={styles.startButton} onPress={startScanning}>
            <Text style={styles.startButtonText}>카메라 시작</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.simulateButton} onPress={simulateScan}>
            <Text style={styles.simulateButtonText}>스캔 시뮬레이션 (데모)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  scannerArea: {
    aspectRatio: 1,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  scanningContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  scanningText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 12,
  },
  cameraPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 128,
    height: 128,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#2563eb',
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  instructions: {
    alignItems: 'center',
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  startButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  simulateButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});