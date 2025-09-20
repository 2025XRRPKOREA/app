import React from 'react';
import { View, StyleSheet } from 'react-native';

interface QRGeneratorProps {
  data: string;
  size?: number;
}

export function QRGenerator({ data, size = 200 }: QRGeneratorProps) {
  // QR 코드 생성을 위한 간단한 패턴
  const generateQRPattern = () => {
    const pattern = [];
    for (let i = 0; i < 21; i++) {
      const row = [];
      for (let j = 0; j < 21; j++) {
        // 간단한 패턴 생성 (실제 QR 코드 아님)
        const isBlack = (i + j + data.length) % 3 === 0 ||
                       (i === 0 || i === 20 || j === 0 || j === 20) ||
                       (i < 7 && j < 7) || (i < 7 && j > 13) || (i > 13 && j < 7);
        row.push(isBlack);
      }
      pattern.push(row);
    }
    return pattern;
  };

  const pattern = generateQRPattern();
  const cellSize = size / 21;

  return (
    <View style={styles.container}>
      <View style={[
        styles.qrContainer,
        {
          width: size + 32,
          height: size + 32
        }
      ]}>
        <View style={[
          styles.qrCode,
          {
            width: size,
            height: size
          }
        ]}>
          {pattern.map((row, i) =>
            row.map((cell, j) => (
              <View
                key={`${i}-${j}`}
                style={[
                  styles.qrCell,
                  {
                    width: cellSize,
                    height: cellSize,
                    left: j * cellSize,
                    top: i * cellSize,
                    backgroundColor: cell ? '#000000' : '#ffffff',
                  }
                ]}
              />
            ))
          )}
        </View>
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
  qrCode: {
    position: 'relative',
  },
  qrCell: {
    position: 'absolute',
  },
});