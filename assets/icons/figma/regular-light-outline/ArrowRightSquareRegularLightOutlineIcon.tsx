import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareRegularLightOutlineIcon component
 */
export const ArrowRightSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.916 3.5C5.233 3.5 3.5 5.135 3.5 7.665V16.334C3.5 18.864 5.233 20.5 7.916 20.5H16.084C18.767 20.5 20.5 18.864 20.5 16.334V7.665C20.5 5.135 18.767 3.5 16.084 3.5H7.916ZM16.084 22H7.916C4.378 22 2 19.723 2 16.334V7.665C2 4.276 4.378 2 7.916 2H16.084C19.622 2 22 4.276 22 7.665V16.334C22 19.723 19.622 22 16.084 22Z"
      fill={color}
    />
    <Path
      d="M16.0861 12.75H7.91406C7.50006 12.75 7.16406 12.414 7.16406 12C7.16406 11.586 7.50006 11.25 7.91406 11.25H16.0861C16.5001 11.25 16.8361 11.586 16.8361 12C16.8361 12.414 16.5001 12.75 16.0861 12.75Z"
      fill={color}
    />
    <Path
      d="M12.3221 16.4979C12.1301 16.4979 11.9371 16.4249 11.7911 16.2769C11.4991 15.9829 11.5001 15.5089 11.7931 15.2169L15.0231 11.9999L11.7931 8.78295C11.5001 8.49095 11.4991 8.01695 11.7911 7.72295C12.0831 7.42895 12.5571 7.42895 12.8511 7.72095L16.6151 11.4689C16.7571 11.6089 16.8361 11.8009 16.8361 11.9999C16.8361 12.1989 16.7571 12.3909 16.6151 12.5309L12.8511 16.2789C12.7051 16.4249 12.5131 16.4979 12.3221 16.4979Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSquareRegularLightOutlineIcon;
