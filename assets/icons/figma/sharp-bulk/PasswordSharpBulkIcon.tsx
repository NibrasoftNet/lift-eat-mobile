import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PasswordSharpBulkIcon component
 */
export const PasswordSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path d="M2.5 21.75H22V2.25H2.5V21.75Z" fill={color} />
    <Path
      d="M18.0098 14.6019H16.5098V12.7499H15.1818V14.6019H13.6818V12.7499H11.5658C11.2418 13.8179 10.2588 14.6019 9.08684 14.6019C7.65284 14.6019 6.48584 13.4349 6.48584 11.9999C6.48584 10.5659 7.65284 9.39795 9.08684 9.39795C10.2598 9.39995 11.2418 10.1829 11.5658 11.2499H18.0098V14.6019ZM7.98495 12.0002C7.98495 11.3922 8.47995 10.8982 9.08895 10.8982C9.69595 10.8982 10.1899 11.3932 10.1899 12.0002C10.1899 12.6082 9.69495 13.1023 9.08695 13.1023C8.47995 13.1023 7.98495 12.6082 7.98495 12.0002Z"
      fill={color}
    />
  </Svg>
);

export default PasswordSharpBulkIcon;
