import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TimeSquareRegularLightOutlineIcon component
 */
export const TimeSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.865 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
      fill={color}
    />
    <Path
      d="M15.39 14.7675C15.259 14.7675 15.127 14.7335 15.006 14.6625L11.615 12.6395C11.389 12.5035 11.249 12.2585 11.249 11.9955V7.63354C11.249 7.21954 11.585 6.88354 11.999 6.88354C12.413 6.88354 12.749 7.21954 12.749 7.63354V11.5695L15.775 13.3725C16.13 13.5855 16.247 14.0455 16.035 14.4015C15.894 14.6365 15.645 14.7675 15.39 14.7675Z"
      fill={color}
    />
  </Svg>
);

export default TimeSquareRegularLightOutlineIcon;
