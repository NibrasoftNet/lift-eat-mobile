import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SettingSharpBrokenIcon component
 */
export const SettingSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M15.6035 13.5375C15.8185 13.0695 15.9385 12.5485 15.9385 12.0005C15.9385 9.9635 14.2875 8.3125 12.2505 8.3125C10.2145 8.3125 8.56348 9.9635 8.56348 12.0005C8.56348 14.0375 10.2145 15.6885 12.2505 15.6885"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.03223 9.466V14.535L5.88523 15.676L5.44723 18.716L9.83723 21.25L12.2512 19.351L14.6642 21.25L19.0542 18.716L18.6162 15.675L21.4682 14.535V9.466L18.6172 8.325L19.0552 5.285L14.6652 2.75L12.2512 4.65L9.83623 2.75L5.44623 5.285L5.88423 8.325"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SettingSharpBrokenIcon;
