import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareCurvedBulkIcon component
 */
export const ArrowDownSquareCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 2.25C5.052 2.25 2.5 4.802 2.5 12C2.5 19.198 5.052 21.75 12.25 21.75C19.448 21.75 22 19.198 22 12C22 4.802 19.448 2.25 12.25 2.25Z"
      fill={color}
    />
    <Path
      d="M12.2502 16.8361C13.7122 16.8361 15.7952 13.9711 16.6222 12.7401C16.8532 12.3971 16.7622 11.9301 16.4192 11.7001C16.0742 11.4681 15.6082 11.5601 15.3782 11.9031C14.5812 13.0881 13.6622 14.1901 13.0002 14.8131V7.91406C13.0002 7.50006 12.6642 7.16406 12.2502 7.16406C11.8362 7.16406 11.5002 7.50006 11.5002 7.91406V14.8061C10.8312 14.1811 9.91516 13.0831 9.12216 11.9031C8.89316 11.5611 8.42816 11.4681 8.08116 11.7001C7.73816 11.9301 7.64616 12.3971 7.87816 12.7401C8.70516 13.9711 10.7882 16.8361 12.2502 16.8361Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareCurvedBulkIcon;
