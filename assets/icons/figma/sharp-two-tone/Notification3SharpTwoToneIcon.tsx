import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification3SharpTwoToneIcon component
 */
export const Notification3SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M5.94101 10.6055C5.94101 7.12136 8.76549 4.29688 12.2497 4.29688C15.7338 4.29688 18.5583 7.12135 18.5583 10.6055V13.3987C18.5583 15.285 19.1317 17.1267 20.2025 18.6797H4.29688C5.36762 17.1267 5.94101 15.285 5.94101 13.3987V10.6055Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4785 18.6797V18.9101C15.4785 20.6932 14.0331 22.1386 12.25 22.1386C10.4669 22.1386 9.02148 20.6932 9.02148 18.9101V18.6797"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.25 4.29724V2.13867"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Notification3SharpTwoToneIcon;
