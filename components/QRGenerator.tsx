import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

interface QRGeneratorProps {
  data: string;
  size?: number;
}

export function QRGenerator({ data, size = 200 }: QRGeneratorProps) {
  return (
    <View style={styles.container}>
      <View style={[
        styles.qrContainer,
        {
          width: size + 32,
          height: size + 32
        }
      ]}>
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  qrContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});