import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleRegularLightOutlineIcon component
 */
export const ArrowUpCircleRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12 3.5C7.313 3.5 3.5 7.313 3.5 12C3.5 16.687 7.313 20.5 12 20.5C16.687 20.5 20.5 16.687 20.5 12C20.5 7.313 16.687 3.5 12 3.5ZM12 22C6.486 22 2 17.514 2 12C2 6.486 6.486 2 12 2C17.514 2 22 6.486 22 12C22 17.514 17.514 22 12 22Z"
      fill={color}
    />
    <Path
      d="M15.4716 14.1924C15.2796 14.1924 15.0866 14.1194 14.9406 13.9714L11.9996 11.0184L9.06056 13.9714C8.76856 14.2654 8.29356 14.2654 7.99956 13.9734C7.70656 13.6814 7.70456 13.2074 7.99756 12.9134L11.4686 9.42636C11.7496 9.14336 12.2496 9.14336 12.5316 9.42636L16.0026 12.9134C16.2946 13.2074 16.2936 13.6814 16.0006 13.9734C15.8546 14.1194 15.6626 14.1924 15.4716 14.1924Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleRegularLightOutlineIcon;
