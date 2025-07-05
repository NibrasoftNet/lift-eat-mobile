import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareCurvedBoldIcon component
 */
export const ArrowLeftSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.34 12.75H9.437C10.068 13.417 11.181 14.346 12.348 15.129C12.692 15.359 12.783 15.826 12.553 16.17C12.408 16.386 12.171 16.502 11.929 16.502C11.785 16.502 11.641 16.461 11.512 16.375C10.278 15.548 7.41 13.466 7.41 12C7.41 10.534 10.279 8.455 11.513 7.629C11.857 7.397 12.323 7.49 12.553 7.835C12.783 8.179 12.692 8.645 12.347 8.875C11.165 9.667 10.065 10.582 9.44 11.25H16.34C16.754 11.25 17.09 11.586 17.09 12C17.09 12.414 16.754 12.75 16.34 12.75ZM12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareCurvedBoldIcon;
