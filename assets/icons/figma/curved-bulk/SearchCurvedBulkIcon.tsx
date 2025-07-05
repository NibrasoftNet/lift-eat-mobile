import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchCurvedBulkIcon component
 */
export const SearchCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.5141 2.20215C6.51813 2.20215 2.45312 6.26715 2.45312 11.2641C2.45312 16.2601 6.51813 20.3241 11.5141 20.3241C16.5101 20.3241 20.5751 16.2601 20.5751 11.2641C20.5751 6.26715 16.5101 2.20215 11.5141 2.20215Z"
      fill={color}
    />
    <Path
      d="M20.1376 17.9766C19.0836 17.9766 18.2256 18.8326 18.2256 19.8866C18.2256 20.9406 19.0836 21.7976 20.1376 21.7976C21.1906 21.7976 22.0476 20.9406 22.0476 19.8866C22.0476 18.8326 21.1906 17.9766 20.1376 17.9766Z"
      fill={color}
    />
  </Svg>
);

export default SearchCurvedBulkIcon;
