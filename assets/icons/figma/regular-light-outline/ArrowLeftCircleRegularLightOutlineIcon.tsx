import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleRegularLightOutlineIcon component
 */
export const ArrowLeftCircleRegularLightOutlineIcon = ({
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
      d="M13.4425 16.2208C13.2515 16.2208 13.0595 16.1478 12.9135 16.0018L9.42654 12.5318C9.28554 12.3908 9.20654 12.1998 9.20654 11.9998C9.20654 11.8008 9.28554 11.6098 9.42654 11.4688L12.9135 7.9978C13.2065 7.7058 13.6805 7.7058 13.9735 7.9998C14.2665 8.2938 14.2645 8.7688 13.9715 9.0608L11.0195 11.9998L13.9715 14.9398C14.2645 15.2318 14.2665 15.7058 13.9735 15.9998C13.8275 16.1478 13.6345 16.2208 13.4425 16.2208Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCircleRegularLightOutlineIcon;
