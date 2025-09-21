import { IconSymbol } from '@/components/ui/icon-symbol';
import { Camera, CameraView } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
    if (scanned) return; // 중복 스캔 방지
    
    console.log('QR 스캔됨:', { type, data });
    setScanned(true);
    
    // QR 코드 데이터가 UUID 형태인지 확인
    if (data && data.trim().length > 0) {
      console.log('QR 데이터 전송:', data.trim());
      onScan(data.trim());
      
      // 3초 후 다시 스캔 가능하도록
      setTimeout(() => {
        setScanned(false);
      }, 3000);
    } else {
      console.log('빈 QR 데이터');
      // 1초 후 다시 스캔 가능하도록
      setTimeout(() => {
        setScanned(false);
      }, 1000);
    }
  };

  if (hasPermission === null) {
    return (
      <View className="gap-4">
        <View className="aspect-square bg-gray-100 rounded-lg justify-center items-center p-5">
          <IconSymbol name="camera" size={64} color="#6b7280" />
          <Text className="text-base font-semibold text-gray-800 mt-4 text-center">카메라 권한을 확인하는 중...</Text>
        </View>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="gap-4">
        <View className="aspect-square bg-gray-100 rounded-lg justify-center items-center p-5">
          <IconSymbol name="camera.fill" size={64} color="#ef4444" />
          <Text className="text-base font-semibold text-gray-800 mt-4 text-center">카메라 권한이 필요합니다</Text>
          <Text className="text-sm text-gray-500 mt-2 text-center">
            설정에서 카메라 접근 권한을 허용해주세요
          </Text>
          <TouchableOpacity
            className="bg-blue-600 py-3 px-6 rounded-lg mt-4"
            onPress={async () => {
              const { status } = await Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
            }}
          >
            <Text className="text-white text-base font-semibold">권한 요청</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View className="aspect-square rounded-lg overflow-hidden relative">
        <CameraView
          className="flex-1"
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
        />

        {/* 스캔 오버레이 */}
        <View className="absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
          <View className="w-50 h-50 relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-blue-600 border-4 border-r-0 border-b-0 rounded-tl-lg" />
            <View className="absolute top-0 right-0 w-10 h-10 border-blue-600 border-4 border-l-0 border-b-0 rounded-tr-lg" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-blue-600 border-4 border-r-0 border-t-0 rounded-bl-lg" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-blue-600 border-4 border-l-0 border-t-0 rounded-br-lg" />
          </View>
        </View>
      </View>

      <View className="items-center gap-3">
        {scanned ? (
          <View className="items-center gap-1">
            <Text className="text-base font-semibold text-green-600 text-center">✅ QR 코드 인식됨!</Text>
            <Text className="text-sm text-gray-500 text-center">송금을 처리하는 중...</Text>
          </View>
        ) : (
          <Text className="text-sm text-gray-500 text-center">
            QR 코드를 스캔 영역에 맞춰주세요
          </Text>
        )}

        <TouchableOpacity
          className="bg-blue-600 py-3 px-6 rounded-lg w-full items-center"
          onPress={() => setScanned(false)}
        >
          <Text className="text-white text-base font-semibold">
            {scanned ? '처리 중...' : '스캔 대기 중'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

