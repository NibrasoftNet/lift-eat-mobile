import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleRegularBulkIcon component
 */
export const ArrowDownCircleRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22 11.9999C22 17.5149 17.514 21.9999 12 21.9999C6.486 21.9999 2 17.5149 2 11.9999C2 6.48588 6.486 1.99988 12 1.99988C17.514 1.99988 22 6.48588 22 11.9999Z"
      fill={color}
    />
    <Path
      d="M16.2206 10.5575C16.2206 10.7485 16.1476 10.9405 16.0016 11.0865L12.5316 14.5735C12.3906 14.7145 12.1996 14.7935 11.9996 14.7935C11.8006 14.7935 11.6096 14.7145 11.4686 14.5735L7.99658 11.0865C7.70458 10.7935 7.70458 10.3195 7.99858 10.0265C8.29258 9.73448 8.76758 9.73548 9.05958 10.0285L11.9996 12.9815L14.9396 10.0285C15.2316 9.73548 15.7056 9.73448 15.9996 10.0265C16.1476 10.1725 16.2206 10.3655 16.2206 10.5575Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCircleRegularBulkIcon;
