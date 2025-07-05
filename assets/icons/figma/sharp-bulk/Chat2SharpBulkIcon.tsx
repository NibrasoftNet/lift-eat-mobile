import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Chat2SharpBulkIcon component
 */
export const Chat2SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M19.1555 5.25809C17.3205 3.42309 14.8795 2.41309 12.2795 2.41309C9.68049 2.41309 7.23749 3.42409 5.40249 5.25909C3.56249 7.09909 2.55049 9.54309 2.55249 12.1441C2.55549 15.4951 2.50449 21.3381 2.50449 21.3381L2.50049 21.8471L3.00849 21.8431C3.06649 21.8421 8.81749 21.7911 12.0685 21.8621C12.1425 21.8631 12.2155 21.8641 12.2895 21.8641C14.8825 21.8641 17.3135 20.8571 19.1555 19.0151C22.9475 15.2221 22.9475 9.05109 19.1555 5.25809Z"
      fill={color}
    />
    <Path d="M16.7872 13.27H15.1892V11.77H16.7872V13.27Z" fill={color} />
    <Path d="M13.0532 13.27H11.4542V11.77H13.0532V13.27Z" fill={color} />
    <Path d="M9.31921 13.27H7.72021V11.77H9.31921V13.27Z" fill={color} />
  </Svg>
);

export default Chat2SharpBulkIcon;
