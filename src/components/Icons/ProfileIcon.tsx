/**
 * Custom Profile/User Icon SVG
 */

import Svg, { Path } from 'react-native-svg';

interface ProfileIconProps {
  color?: string;
  size?: number;
  filled?: boolean;
}

export function ProfileIcon({ color = '#767676', size = 22, filled = false }: ProfileIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4.72509 14.2316C3.15312 15.074 -0.968488 16.7941 1.54185 18.9466C2.76813 19.998 4.13389 20.75 5.85098 20.75H15.649C17.3661 20.75 18.7319 19.998 19.9581 18.9466C22.4685 16.7941 18.3469 15.074 16.7749 14.2316C13.0887 12.2561 8.41134 12.2561 4.72509 14.2316Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
      <Path
        d="M15.75 5.25C15.75 7.73528 13.5115 9.75 10.75 9.75C7.98858 9.75 5.75 7.73528 5.75 5.25C5.75 2.76472 7.98858 0.75 10.75 0.75C13.5115 0.75 15.75 2.76472 15.75 5.25Z"
        stroke={color}
        strokeWidth="1.5"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
    </Svg>
  );
}
