import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftSquareRegularLightOutlineIcon component
 */
export const ArrowLeftSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.084 3.5C18.767 3.5 20.5 5.135 20.5 7.665V16.334C20.5 18.864 18.767 20.5 16.084 20.5H7.916C5.233 20.5 3.5 18.864 3.5 16.334V7.665C3.5 5.135 5.233 3.5 7.916 3.5H16.084ZM7.916 22H16.084C19.622 22 22 19.723 22 16.334V7.665C22 4.276 19.622 2 16.084 2H7.916C4.378 2 2 4.276 2 7.665V16.334C2 19.723 4.378 22 7.916 22Z"
      fill={color}
    />
    <Path
      d="M7.91394 12.75H16.0859C16.4999 12.75 16.8359 12.414 16.8359 12C16.8359 11.586 16.4999 11.25 16.0859 11.25H7.91394C7.49994 11.25 7.16394 11.586 7.16394 12C7.16394 12.414 7.49994 12.75 7.91394 12.75Z"
      fill={color}
    />
    <Path
      d="M11.6779 16.4979C11.8699 16.4979 12.0629 16.4249 12.2089 16.2769C12.5009 15.9829 12.4999 15.5089 12.2069 15.2169L8.97687 11.9999L12.2069 8.78295C12.4999 8.49095 12.5009 8.01695 12.2089 7.72295C11.9169 7.42895 11.4429 7.42895 11.1489 7.72095L7.38487 11.4689C7.24287 11.6089 7.16387 11.8009 7.16387 11.9999C7.16387 12.1989 7.24287 12.3909 7.38487 12.5309L11.1489 16.2789C11.2949 16.4249 11.4869 16.4979 11.6779 16.4979Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftSquareRegularLightOutlineIcon;
