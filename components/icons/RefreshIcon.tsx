import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

export const RefreshIcon = ({ size = 24, color = '#000000' }: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 4V10H7"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M23 20V14H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M20.49 9C19.9828 7.56678 19.1209 6.28392 17.9845 5.27493C16.8482 4.26595 15.4745 3.567 13.9917 3.24469C12.5089 2.92238 10.9652 2.98546 9.51511 3.42597C8.06504 3.86648 6.75744 4.66915 5.71 5.75L1 10M23 14L18.29 18.25C17.2426 19.3309 15.935 20.1335 14.4849 20.574C13.0348 21.0145 11.4911 21.0776 10.0083 20.7553C8.52547 20.433 7.1518 19.734 6.01547 18.7251C4.87913 17.7161 4.01717 16.4332 3.51 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);