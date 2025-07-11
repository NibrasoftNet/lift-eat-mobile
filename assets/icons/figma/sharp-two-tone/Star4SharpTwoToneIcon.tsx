import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Star4SharpTwoToneIcon component
 */
export const Star4SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.6301 8.1499C17.2516 9.8417 19.251 11.1678 21.5 12C19.251 12.8322 17.2516 14.1583 15.6301 15.8501M8.86987 15.8501C7.24838 14.1583 5.24904 12.8322 3 12C5.24904 11.1678 7.24838 9.8417 8.86987 8.1499"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.6304 8.14991C14.1622 6.61807 13.0038 4.7864 12.2502 2.75C11.4967 4.7864 10.3383 6.61807 8.87012 8.14991M15.6304 15.8501C14.1622 17.3819 13.0038 19.2136 12.2502 21.25C11.4967 19.2136 10.3383 17.3819 8.87012 15.8501"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Star4SharpTwoToneIcon;
