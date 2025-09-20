import { IconSymbol } from '@/components/ui/icon-symbol';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface QRScannerProps {
  onScan: (data: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    onScan(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera" size={64} color="#6b7280" />
          <Text style={styles.permissionText}>카메라 권한을 확인하는 중...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <IconSymbol name="camera.fill" size={64} color="#ef4444" />
          <Text style={styles.permissionText}>카메라 권한이 필요합니다</Text>
          <Text style={styles.permissionSubtext}>
            설정에서 카메라 접근 권한을 허용해주세요
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}
          >
            <Text style={styles.permissionButtonText}>권한 요청</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'pdf417'],
          }}
        />

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

        {scanned && (
          <TouchableOpacity
            style={styles.scanAgainButton}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainButtonText}>다시 스캔하기</Text>
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
  cameraContainer: {
    aspectRatio: 1,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  permissionContainer: {
    aspectRatio: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  permissionSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  permissionButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  permissionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
    width: 200,
    height: 200,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
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
  scanAgainButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  scanAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});