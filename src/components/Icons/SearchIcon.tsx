/**
 * Custom Search Icon SVG
 */

import Svg, { Path } from 'react-native-svg';

interface SearchIconProps {
  color?: string;
  size?: number;
  filled?: boolean;
}

export function SearchIcon({ color = '#fff', size = 22, filled = false }: SearchIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M16.25 16.25L20.75 20.75"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M18.75 9.75C18.75 4.77944 14.7206 0.75 9.75 0.75C4.77944 0.75 0.75 4.77944 0.75 9.75C0.75 14.7206 4.77944 18.75 9.75 18.75C14.7206 18.75 18.75 14.7206 18.75 9.75Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
    </Svg>
  );
}
