import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivitySharpBulkIcon component
 */
export const ActivitySharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.2048 4.93473C15.2048 4.73473 15.2148 4.53473 15.2448 4.34473H2.46484V22.5547H20.6748V9.21473C20.3448 9.30473 19.9848 9.34473 19.6248 9.34473C17.1848 9.34473 15.2048 7.36473 15.2048 4.93473Z"
      fill={color}
    />
    <Path
      d="M10.085 13.1947L13.285 15.7047L16.955 10.9747L15.765 10.0547L13.025 13.5947L9.82498 11.0747L6.10498 15.9147L7.28498 16.8347L10.085 13.1947Z"
      fill={color}
    />
    <Path
      d="M19.6246 2.51465C18.4946 2.51465 17.5446 3.29465 17.2846 4.34465C17.2346 4.53465 17.2046 4.73465 17.2046 4.93465C17.2046 6.26465 18.2946 7.34465 19.6246 7.34465C19.9946 7.34465 20.3546 7.25465 20.6746 7.10465C21.4746 6.71465 22.0346 5.88465 22.0346 4.93465C22.0346 3.59465 20.9546 2.51465 19.6246 2.51465Z"
      fill={color}
    />
  </Svg>
);

export default ActivitySharpBulkIcon;
