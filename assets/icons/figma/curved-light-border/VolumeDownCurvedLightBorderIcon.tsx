import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeDownCurvedLightBorderIcon component
 */
export const VolumeDownCurvedLightBorderIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M18.6562 8.63379C19.9096 10.9049 19.9096 13.6765 18.6562 15.9396" fill={none} stroke={color} strokeWidth="1.5" />
    <Path d="M4.66735 12.2869C4.66379 13.5055 4.66735 14.9349 5.67357 15.7891C6.67979 16.6442 7.4789 16.2913 8.78113 16.7197C10.0842 17.1491 11.9091 19.7962 13.9251 18.6006C15.0149 17.8264 15.5287 16.3651 15.5287 12.2869C15.5287 8.20863 15.038 6.7633 13.9251 5.97308C11.9091 4.77841 10.0842 7.42552 8.78113 7.85397C7.4789 8.2833 6.67979 7.93041 5.67357 8.78463C4.66735 9.63885 4.66379 11.0682 4.66735 12.2869Z" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default VolumeDownCurvedLightBorderIcon;
