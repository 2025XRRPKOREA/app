import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export const WalletIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Ionicons
    name="wallet-outline"
    size={size}
    color={color}
  />
);