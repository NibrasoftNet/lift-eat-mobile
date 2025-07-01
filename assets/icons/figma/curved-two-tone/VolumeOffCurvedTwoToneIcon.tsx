import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeOffCurvedTwoToneIcon component
 */
export const VolumeOffCurvedTwoToneIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M8.40374 16.5533C7.32111 16.3028 6.58742 16.4996 5.68374 15.7391C4.67269 14.8801 4.66374 13.4396 4.67269 12.2138C4.66374 10.988 4.67269 9.54751 5.68374 8.68856C6.69479 7.82961 7.50006 8.17856 8.81532 7.74909C10.1216 7.31961 11.9558 4.6533 13.9869 5.85224C14.8101 6.43382 15.2932 7.38224 15.4901 9.46698" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M15.5798 13.6719C15.4635 16.6782 14.9445 17.8861 13.9872 18.5661C12.9493 19.1835 11.9561 18.7808 11.0703 18.1813" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M20.2857 4.6709L4.94092 20.0156" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeOffCurvedTwoToneIcon;
