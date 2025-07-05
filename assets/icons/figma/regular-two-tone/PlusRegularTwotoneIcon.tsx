import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlusRegularTwotoneIcon component
 */
export const PlusRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.7502 8.32715C12.7502 7.91293 12.4144 7.57715 12.0002 7.57715C11.5859 7.57715 11.2502 7.91293 11.2502 8.32715V11.2404H8.3335C7.91928 11.2404 7.5835 11.5762 7.5835 11.9904C7.5835 12.4046 7.91928 12.7404 8.3335 12.7404H11.2502V15.6535C11.2502 16.0677 11.5859 16.4035 12.0002 16.4035C12.4144 16.4035 12.7502 16.0677 12.7502 15.6535V12.7404H15.6668C16.081 12.7404 16.4168 12.4046 16.4168 11.9904C16.4168 11.5762 16.081 11.2404 15.6668 11.2404H12.7502V8.32715Z"
      fill={color}
    />
    <Path
      d="M16.6857 2H7.31429C4.04762 2 2 4.31208 2 7.58516V16.4148C2 19.6879 4.0381 22 7.31429 22H16.6857C19.9619 22 22 19.6879 22 16.4148V7.58516C22 4.31208 19.9619 2 16.6857 2Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PlusRegularTwotoneIcon;
