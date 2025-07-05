import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification3SharpBoldIcon component
 */
export const Notification3SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2507 21.0142C10.9767 21.0142 9.9367 20.0442 9.7997 18.8052H14.7027C14.5657 20.0442 13.5247 21.0142 12.2507 21.0142ZM21.1547 18.8052L20.6147 18.0212C19.5967 16.5442 19.0587 14.8162 19.0587 13.0242V10.2312C19.0587 6.73018 16.4027 3.84018 13.0007 3.46518V1.76318H11.5007V3.46518C8.0987 3.84018 5.4417 6.73018 5.4417 10.2312V13.0242C5.4417 14.8182 4.9037 16.5462 3.8857 18.0212L3.3457 18.8052H8.2997C8.4417 20.8712 10.1497 22.5142 12.2507 22.5142C14.3517 22.5142 16.0607 20.8712 16.2027 18.8052H21.1547Z"
      fill={color}
    />
  </Svg>
);

export default Notification3SharpBoldIcon;
