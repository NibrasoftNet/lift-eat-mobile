import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleRegularLightOutlineIcon component
 */
export const ArrowRightCircleRegularLightOutlineIcon = ({
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
      d="M10.5585 16.2208C10.3665 16.2208 10.1735 16.1478 10.0275 15.9998C9.73546 15.7058 9.73646 15.2318 10.0295 14.9398L12.9815 11.9998L10.0295 9.0608C9.73646 8.7688 9.73546 8.2938 10.0275 7.9998C10.3195 7.7048 10.7935 7.7068 11.0875 7.9978L14.5735 11.4688C14.7145 11.6098 14.7935 11.8008 14.7935 11.9998C14.7935 12.1998 14.7145 12.3908 14.5735 12.5318L11.0875 16.0018C10.9415 16.1478 10.7495 16.2208 10.5585 16.2208Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCircleRegularLightOutlineIcon;
