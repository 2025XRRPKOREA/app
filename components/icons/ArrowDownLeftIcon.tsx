import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowDownLeftIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="17"
      y1="7"
      x2="7"
      y2="17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M17 17H7V7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);