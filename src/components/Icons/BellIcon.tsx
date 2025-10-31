/**
 * Custom Bell/Notification Icon SVG
 */

import Svg, { Path } from 'react-native-svg';

interface BellIconProps {
  color?: string;
  size?: number;
}

export function BellIcon({ color = '#767676', size = 22 }: BellIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M0.782473 13.5196C0.558631 14.9136 1.5594 15.8812 2.78471 16.3634C7.48235 18.2122 14.0196 18.2122 18.7172 16.3634C19.9425 15.8812 20.9433 14.9136 20.7195 13.5196C20.5819 12.6629 19.9017 11.9495 19.3977 11.2529C18.7376 10.3293 18.672 9.3218 18.6719 8.25C18.6719 4.10786 15.1256 0.75 10.751 0.75C6.37637 0.75 2.83006 4.10786 2.83006 8.25C2.82996 9.3218 2.76437 10.3293 2.10425 11.2529C1.60028 11.9495 0.920041 12.6629 0.782473 13.5196Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M6.54004 17.75C7.02266 19.4752 8.72477 20.75 10.7506 20.75C12.7764 20.75 14.4785 19.4752 14.9611 17.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
