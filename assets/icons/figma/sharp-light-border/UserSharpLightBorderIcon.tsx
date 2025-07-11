import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UserSharpLightBorderIcon component
 */
export const UserSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2317 14.6231C15.2618 14.6153 17.8382 16.0066 18.7852 19.0014C16.8763 20.1651 14.6295 20.6133 12.2317 20.6074C9.83388 20.6133 7.58704 20.1651 5.67822 19.0014C6.62632 16.0033 9.19836 14.6153 12.2317 14.6231Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.6558 13.773C19.7801 13.7675 21.5864 14.7429 22.2504 16.8426C21.5257 17.2844 20.7315 17.5791 19.8886 17.7558"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.84473 13.773C4.72036 13.7675 2.91407 14.7429 2.25013 16.8426C2.97482 17.2844 3.769 17.5791 4.61185 17.7558"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.7333 6.05034C17.0229 5.95247 17.3331 5.89941 17.6558 5.89941C19.2464 5.89941 20.5358 7.18883 20.5358 8.7794C20.5358 10.37 19.2464 11.6594 17.6558 11.6594C16.8828 11.6594 16.1809 11.3548 15.6636 10.8591"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.50078 5.97445C7.29007 5.92537 7.07048 5.89941 6.84483 5.89941C5.25426 5.89941 3.96484 7.18883 3.96484 8.7794C3.96484 10.37 5.25426 11.6594 6.84483 11.6594C7.53805 11.6594 8.17407 11.4145 8.67107 11.0064"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="12.2498" cy="7.49102" r="4.09844" fill='none' stroke={color} />
  </Svg>
);

export default UserSharpLightBorderIcon;
