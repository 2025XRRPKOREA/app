import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const ArrowUpRightIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line
      x1="7"
      y1="17"
      x2="17"
      y2="7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M7 7H17V17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);