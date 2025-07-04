import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpSquareCurvedLightOutlineIcon component
 */
export const ArrowUpSquareCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M7.49793 11.6687C7.49793 11.5247 7.53893 11.3797 7.62593 11.2507C8.45293 10.0217 10.5349 7.15967 11.9999 7.15967C13.4649 7.15967 15.5449 10.0217 16.3709 11.2517C16.6019 11.5957 16.5099 12.0617 16.1659 12.2917C15.8219 12.5227 15.3559 12.4317 15.1249 12.0877C14.335 10.9125 13.4176 9.80665 12.75 9.18219L12.75 16.0802C12.75 16.4942 12.414 16.8302 12 16.8302C11.586 16.8302 11.25 16.4942 11.25 16.0802L11.25 9.17412C10.5879 9.79716 9.66462 10.9077 8.86993 12.0887C8.63893 12.4327 8.17293 12.5227 7.82893 12.2917C7.61393 12.1477 7.49793 11.9097 7.49793 11.6687Z"
      fill={color}
    />
    <Path
      d="M12 2C4.617 2 2 4.617 2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2ZM12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12C3.5 5.486 5.486 3.5 12 3.5Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpSquareCurvedLightOutlineIcon;
