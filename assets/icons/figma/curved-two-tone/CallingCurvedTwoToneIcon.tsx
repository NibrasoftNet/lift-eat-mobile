import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallingCurvedTwoToneIcon component
 */
export const CallingCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M14.3525 2.75C18.0535 3.161 20.9775 6.081 21.3935 9.782" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M14.3525 6.29297C16.1235 6.63697 17.5075 8.02197 17.8525 9.79297" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M7.70049 16.299C0.802504 9.40022 1.78338 6.24115 2.51055 5.22316C2.60396 5.05862 4.90647 1.61188 7.37459 3.63407C13.5008 8.67945 5.7451 7.96611 10.8894 13.1113C16.0348 18.2554 15.3203 10.5 20.3659 16.6249C22.3882 19.094 18.9413 21.3964 18.7778 21.4888C17.7598 22.217 14.5995 23.1978 7.70049 16.299Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CallingCurvedTwoToneIcon;
