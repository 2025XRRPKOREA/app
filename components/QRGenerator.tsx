import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRGeneratorProps {
  data: string;
  size?: number;
}

export function QRGenerator({ data, size = 200 }: QRGeneratorProps) {
  return (
    <View className="items-center">
      <View 
        className="bg-white p-4 rounded-lg shadow-sm shadow-black/10 elevation-1"
        style={{
          width: size + 32,
          height: size + 32
        }}>
        <QRCode
          value={data}
          size={size}
          color="black"
          backgroundColor="white"
          logoSize={30}
          logoBackgroundColor="transparent"
        />
      </View>
    </View>
  );
}