import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * HideSharpBulkIcon component
 */
export const HideSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.3035 13.0737L16.7056 17.904L14.7848 18.4615L13.3828 13.6312L15.3035 13.0737Z"
      fill={color}
    />
    <Path
      d="M9.19597 13.0737L7.79396 17.904L9.71468 18.4615L11.1167 13.6312L9.19597 13.0737Z"
      fill={color}
    />
    <Path
      d="M22.4035 8.50859C20.2695 12.9996 16.4745 15.6816 12.2525 15.6836H12.2485C8.02548 15.6816 4.23048 12.9996 2.09648 8.50859L1.66748 7.60559L3.47448 6.74659L3.90348 7.65059C5.69748 11.4276 8.81748 13.6826 12.2505 13.6836C15.6825 13.6826 18.8025 11.4276 20.5965 7.65059L21.0265 6.74659L22.8325 7.60559L22.4035 8.50859Z"
      fill={color}
    />
    <Path
      d="M18.8795 10.4907L22.4049 14.016L20.9907 15.4303L17.4653 11.9049L18.8795 10.4907Z"
      fill={color}
    />
    <Path
      d="M5.62094 10.4907L2.09562 14.016L3.50984 15.4303L7.03516 11.9049L5.62094 10.4907Z"
      fill={color}
    />
  </Svg>
);

export default HideSharpBulkIcon;
