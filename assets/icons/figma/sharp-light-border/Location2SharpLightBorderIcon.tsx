import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Location2SharpLightBorderIcon component
 */
export const Location2SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.6504 9.73927C14.6504 8.4133 13.576 7.33887 12.251 7.33887C10.925 7.33887 9.85059 8.4133 9.85059 9.73927C9.85059 11.0643 10.925 12.1387 12.251 12.1387C13.576 12.1387 14.6504 11.0643 14.6504 9.73927Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2495 22.1387C12.2495 18.5358 5.22717 15.4199 5.05023 9.71248C4.92598 5.70495 8.27293 2.13867 12.2495 2.13867C16.2261 2.13867 19.5722 5.70489 19.4497 9.71248C19.2718 15.537 12.2495 18.4394 12.2495 22.1387Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Location2SharpLightBorderIcon;
