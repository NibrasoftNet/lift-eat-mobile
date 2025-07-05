import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Setting2SharpBrokenIcon component
 */
export const Setting2SharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2514 14.9886C10.6774 14.9886 9.40137 13.7126 9.40137 12.1386C9.40137 10.5646 10.6774 9.28857 12.2514 9.28857C13.8254 9.28857 15.1014 10.5646 15.1014 12.1386"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.25 3.47852H17.25L22.25 12.1385L17.25 20.7985H7.25L2.25 12.1385L5.316 6.82752"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Setting2SharpBrokenIcon;
