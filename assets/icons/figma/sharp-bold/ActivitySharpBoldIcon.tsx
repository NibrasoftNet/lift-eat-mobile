import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ActivitySharpBoldIcon component
 */
export const ActivitySharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M13.2848 15.7046L10.0848 13.1946L7.28484 16.8346L6.10484 15.9146L9.82484 11.0746L13.0248 13.5946L15.7648 10.0546L16.9548 10.9746L13.2848 15.7046ZM15.2048 4.93464C15.2048 4.73464 15.2148 4.53464 15.2448 4.34464H2.46484V22.5546H20.6748V9.21464C20.3448 9.30464 19.9848 9.34464 19.6248 9.34464C17.1848 9.34464 15.2048 7.36464 15.2048 4.93464Z"
      fill={color}
    />
    <Path
      d="M19.6248 2.51465C18.4948 2.51465 17.5448 3.29465 17.2848 4.34465C17.2348 4.53465 17.2048 4.73465 17.2048 4.93465C17.2048 6.26465 18.2948 7.34465 19.6248 7.34465C19.9948 7.34465 20.3548 7.25465 20.6748 7.10465C21.4748 6.71465 22.0348 5.88465 22.0348 4.93465C22.0348 3.59465 20.9548 2.51465 19.6248 2.51465Z"
      fill={color}
    />
  </Svg>
);

export default ActivitySharpBoldIcon;
