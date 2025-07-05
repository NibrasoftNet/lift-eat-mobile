import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownCircleRegularLightOutlineIcon component
 */
export const ArrowDownCircleRegularLightOutlineIcon = ({
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
      d="M12 14.7939C11.801 14.7939 11.609 14.7149 11.469 14.5729L7.99805 11.0869C7.70505 10.7929 7.70705 10.3179 8.00005 10.0259C8.29405 9.73388 8.76905 9.73388 9.06105 10.0279L12 12.9819L14.94 10.0279C15.232 9.73388 15.707 9.73388 16.001 10.0259C16.294 10.3179 16.295 10.7929 16.003 11.0869L12.531 14.5729C12.391 14.7149 12.199 14.7939 12 14.7939Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownCircleRegularLightOutlineIcon;
