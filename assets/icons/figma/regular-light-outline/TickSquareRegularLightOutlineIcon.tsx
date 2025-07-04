import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * TickSquareRegularLightOutlineIcon component
 */
export const TickSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
      fill={color}
    />
    <Path
      d="M10.8137 15.1229C10.6227 15.1229 10.4297 15.0499 10.2837 14.9029L7.90969 12.5299C7.61669 12.2369 7.61669 11.7629 7.90969 11.4699C8.20269 11.1769 8.67669 11.1769 8.96969 11.4699L10.8137 13.3119L15.0297 9.09695C15.3227 8.80395 15.7967 8.80395 16.0897 9.09695C16.3827 9.38995 16.3827 9.86395 16.0897 10.1569L11.3437 14.9029C11.1977 15.0499 11.0057 15.1229 10.8137 15.1229Z"
      fill={color}
    />
  </Svg>
);

export default TickSquareRegularLightOutlineIcon;
