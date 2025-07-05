import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CameraCurvedTwoToneIcon component
 */
export const CameraCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M15.4385 12.4978C15.4385 10.761 14.0301 9.35254 12.2932 9.35254C10.5564 9.35254 9.14795 10.761 9.14795 12.4978C9.14795 14.2346 10.5564 15.6431 12.2932 15.6431C14.0301 15.6431 15.4385 14.2346 15.4385 12.4978Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2927 20.2002C20.338 20.2002 21.2959 17.7897 21.2959 12.5665C21.2959 8.90545 20.8117 6.94651 17.7622 6.1044C17.4822 6.01598 17.1717 5.84756 16.9201 5.57072C16.5138 5.12545 16.2169 3.75809 15.2359 3.3444C14.2548 2.93177 10.3148 2.95072 9.34955 3.3444C8.38534 3.73914 8.07166 5.12545 7.66534 5.57072C7.41376 5.84756 7.10429 6.01598 6.82324 6.1044C3.77376 6.94651 3.28955 8.90545 3.28955 12.5665C3.28955 17.7897 4.24745 20.2002 12.2927 20.2002Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path d="M17.2045 9H17.2135" fill={none} stroke={color} strokeWidth="1.5" />
  </Svg>
);

export default CameraCurvedTwoToneIcon;
