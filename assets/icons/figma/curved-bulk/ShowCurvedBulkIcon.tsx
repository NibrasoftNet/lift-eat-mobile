import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShowCurvedBulkIcon component
 */
export const ShowCurvedBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.25 4.80176C6.84805 4.80176 2.49805 9.06976 2.49805 12.6038C2.49805 16.1378 6.84805 20.4058 12.25 20.4058C17.652 20.4058 22.002 16.1378 22.002 12.6038C22.002 9.06976 17.652 4.80176 12.25 4.80176Z"
      fill={color}
    />
    <Path
      d="M12.2499 16.5154C10.0929 16.5154 8.33789 14.7604 8.33789 12.6034C8.33789 10.4464 10.0929 8.69141 12.2499 8.69141C14.4069 8.69141 16.1619 10.4464 16.1619 12.6034C16.1619 14.7604 14.4069 16.5154 12.2499 16.5154ZM9.83789 12.6031C9.83789 11.2731 10.9199 10.1911 12.2499 10.1911C13.5799 10.1911 14.6619 11.2731 14.6619 12.6031C14.6619 13.9331 13.5799 15.0151 12.2499 15.0151C10.9199 15.0151 9.83789 13.9331 9.83789 12.6031Z"
      fill={color}
    />
  </Svg>
);

export default ShowCurvedBulkIcon;
