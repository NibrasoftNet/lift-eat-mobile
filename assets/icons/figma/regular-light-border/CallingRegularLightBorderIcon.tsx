import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallingRegularLightBorderIcon component
 */
export const CallingRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.353 2.5C18.054 2.911 20.978 5.831 21.393 9.532"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.353 6.04297C16.124 6.38697 17.508 7.77197 17.853 9.54297"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.0315 12.4724C15.0205 16.4604 15.9254 11.8467 18.4653 14.3848C20.9138 16.8328 22.3222 17.3232 19.2188 20.4247C18.8302 20.737 16.3613 24.4943 7.68447 15.8197C-0.993406 7.144 2.76157 4.67244 3.07394 4.28395C6.18377 1.17385 6.66682 2.58938 9.11539 5.03733C11.6541 7.5765 7.04254 8.48441 11.0315 12.4724Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallingRegularLightBorderIcon;
