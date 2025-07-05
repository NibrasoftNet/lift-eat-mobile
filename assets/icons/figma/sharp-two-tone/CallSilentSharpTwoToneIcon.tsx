import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallSilentSharpTwoToneIcon component
 */
export const CallSilentSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M11.0589 14.7798C12.606 16.0212 14.0726 16.4232 14.0726 16.4232L16.9267 14.7798L21.5374 18.1798C20.6797 19.7123 19.5982 20.7938 18.0657 21.6515C14.2626 21.8256 10.8631 20.135 8.25684 17.7363"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.30437 15.6331C3.87762 12.5766 2.60428 9.01789 3.04979 6.63582C3.91833 5.14337 5.0316 4.03798 6.52155 3.16406L9.76207 7.6153L8.11867 10.4694C8.11867 10.4694 8.33819 11.3911 9.04649 12.527"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M4.26458 21.9482L18.8793 6.35913"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallSilentSharpTwoToneIcon;
