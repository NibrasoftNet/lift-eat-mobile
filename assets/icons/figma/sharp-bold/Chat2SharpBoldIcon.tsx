import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Chat2SharpBoldIcon component
 */
export const Chat2SharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.1895 13.2701H16.7875V11.7701H15.1895V13.2701ZM11.4545 13.2701H13.0535V11.7701H11.4545V13.2701ZM7.72049 13.2701H9.31949V11.7701H7.72049V13.2701ZM19.1555 5.25809C17.3205 3.42309 14.8795 2.41309 12.2795 2.41309C9.68049 2.41309 7.23749 3.42409 5.40249 5.25909C3.56249 7.09909 2.55049 9.54309 2.55249 12.1441C2.55549 15.4951 2.50449 21.3381 2.50449 21.3381L2.50049 21.8471L3.00849 21.8431C3.06649 21.8421 8.81749 21.7911 12.0685 21.8621C12.1425 21.8631 12.2155 21.8641 12.2895 21.8641C14.8825 21.8641 17.3135 20.8571 19.1555 19.0151C22.9475 15.2221 22.9475 9.05109 19.1555 5.25809Z"
      fill={color}
    />
  </Svg>
);

export default Chat2SharpBoldIcon;
