import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SearchCurvedBoldIcon component
 */
export const SearchCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M11.5136 2.20215C6.51764 2.20215 2.45264 6.26715 2.45264 11.2641C2.45264 16.2601 6.51764 20.3241 11.5136 20.3241C16.5096 20.3241 20.5746 16.2601 20.5746 11.2641C20.5746 6.26715 16.5096 2.20215 11.5136 2.20215Z"
      fill={color}
    />
    <Path
      d="M20.1371 17.9765C19.0831 17.9765 18.2251 18.8325 18.2251 19.8865C18.2251 20.9405 19.0831 21.7975 20.1371 21.7975C21.1901 21.7975 22.0471 20.9405 22.0471 19.8865C22.0471 18.8325 21.1901 17.9765 20.1371 17.9765Z"
      fill={color}
    />
  </Svg>
);

export default SearchCurvedBoldIcon;
