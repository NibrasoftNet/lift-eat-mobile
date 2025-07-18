import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleRegularBoldIcon component
 */
export const ArrowDownCircleRegularBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 21.9999C6.48 21.9999 2 17.5099 2 11.9999C2 6.47991 6.48 1.99991 12 1.99991C17.51 1.99991 22 6.47991 22 11.9999C22 17.5099 17.51 21.9999 12 21.9999ZM16 10.0199C15.7 9.72991 15.23 9.72991 14.94 10.0299L12 12.9799L9.06 10.0299C8.77 9.72991 8.29 9.72991 8 10.0199C7.7 10.3199 7.7 10.7899 8 11.0799L11.47 14.5699C11.61 14.7099 11.8 14.7899 12 14.7899C12.2 14.7899 12.39 14.7099 12.53 14.5699L16 11.0799C16.15 10.9399 16.22 10.7499 16.22 10.5599C16.22 10.3599 16.15 10.1699 16 10.0199Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCircleRegularBoldIcon;
