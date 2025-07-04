import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerTriangleCurvedBulkIcon component
 */
export const DangerTriangleCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M19.3101 10.6932L19.0981 10.3192C16.1121 5.00916 14.2561 3.03516 12.2501 3.03516C10.2441 3.03516 8.38808 5.00916 5.40208 10.3192L5.19108 10.6932C4.11808 12.5752 1.88808 16.4902 2.30208 18.8262C2.79008 21.5892 5.63508 22.0352 12.2501 22.0352C18.8661 22.0352 21.7111 21.5892 22.1981 18.8262C22.6121 16.4902 20.3821 12.5752 19.3101 10.6932Z" fill={color} />
    <Path d="M11.5005 16.4302C11.5005 16.8442 11.8405 17.1802 12.2545 17.1802C12.6685 17.1802 13.0045 16.8442 13.0045 16.4302C13.0045 16.0162 12.6685 15.6802 12.2545 15.6802H12.2455C11.8315 15.6802 11.5005 16.0162 11.5005 16.4302Z" fill={color} />
    <Path d="M12.2495 8.28516C11.8355 8.28516 11.4995 8.62116 11.4995 9.03516V12.9302C11.4995 13.3442 11.8355 13.6802 12.2495 13.6802C12.6635 13.6802 12.9995 13.3442 12.9995 12.9302V9.03516C12.9995 8.62116 12.6635 8.28516 12.2495 8.28516Z" fill={color} />
  </Svg>
);

export default DangerTriangleCurvedBulkIcon;
