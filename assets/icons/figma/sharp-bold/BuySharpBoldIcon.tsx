import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BuySharpBoldIcon component
 */
export const BuySharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M7.85451 19.279C7.15151 19.279 6.58051 19.85 6.58051 20.553C6.58051 21.256 7.15151 21.828 7.85451 21.828C8.55651 21.828 9.12751 21.256 9.12751 20.553C9.12751 19.85 8.55651 19.279 7.85451 19.279Z"
      fill={color}
    />
    <Path
      d="M18.7217 19.279C18.0187 19.279 17.4477 19.85 17.4477 20.553C17.4477 21.256 18.0187 21.828 18.7217 21.828C19.4247 21.828 19.9957 21.256 19.9957 20.553C19.9957 19.85 19.4247 19.279 18.7217 19.279Z"
      fill={color}
    />
    <Path
      d="M13.8253 11.7117H17.9953V10.2117H13.8253V11.7117ZM6.39531 6.3017L6.09531 3.2417H2.19531V4.7417H4.73531L6.01531 17.4417H20.8353L22.3053 6.3017H6.39531Z"
      fill={color}
    />
  </Svg>
);

export default BuySharpBoldIcon;
