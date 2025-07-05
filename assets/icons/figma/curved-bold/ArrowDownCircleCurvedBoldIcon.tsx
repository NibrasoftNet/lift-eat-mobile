import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleCurvedBoldIcon component
 */
export const ArrowDownCircleCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M16.338 10.981C15.362 12.405 13.533 14.794 12.25 14.794C10.967 14.794 9.138 12.405 8.162 10.981C7.928 10.639 8.015 10.172 8.357 9.939C8.697 9.705 9.167 9.793 9.399 10.133C10.487 11.72 11.834 13.198 12.28 13.295C12.667 13.198 14.014 11.72 15.102 10.133C15.334 9.793 15.801 9.705 16.144 9.939C16.485 10.172 16.572 10.639 16.338 10.981ZM12.25 2.25C5.052 2.25 2.5 4.801 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.801 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCircleCurvedBoldIcon;
