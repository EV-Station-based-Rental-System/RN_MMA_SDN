/**
 * Custom Bookmark/Mail Icon SVG
 */

import Svg, { Path } from 'react-native-svg';

interface BookmarkIconProps {
  color?: string;
  size?: number;
  filled?: boolean;
}

export function BookmarkIcon({ color = '#fff', size = 22, filled = false }: BookmarkIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M0.75 3.6875L7.66302 8.2957C10.2116 9.99456 11.2884 9.99456 13.837 8.2957L20.75 3.6875"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Path
        d="M0.76577 12.486C0.83114 16.0926 0.86383 17.8958 1.99496 19.2316C3.12608 20.5674 4.70033 20.6139 7.84883 20.7069C9.7893 20.7644 11.7107 20.7644 13.6512 20.7069C16.7997 20.6139 18.3739 20.5674 19.5051 19.2316C20.6362 17.8958 20.6689 16.0926 20.7342 12.486C20.7553 11.3264 20.7553 10.1736 20.7342 9.014C20.6689 5.40748 20.6362 3.60422 19.5051 2.26842C18.3739 0.932625 16.7997 0.886096 13.6512 0.793025C11.7107 0.73566 9.7893 0.73566 7.84882 0.793013C4.70033 0.886072 3.12608 0.932601 1.99495 2.26841C0.86382 3.60421 0.83114 5.40747 0.76576 9.014C0.74474 10.1736 0.74475 11.3264 0.76577 12.486Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill={filled ? color : 'none'}
        fillOpacity={filled ? 0.2 : 0}
      />
    </Svg>
  );
}
