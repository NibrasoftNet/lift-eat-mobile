import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightSquareCurvedLightOutlineIcon component
 */
export const ArrowRightSquareCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.3313 7.49793C12.4753 7.49793 12.6203 7.53893 12.7493 7.62593C13.9783 8.45293 16.8403 10.5349 16.8403 11.9999C16.8403 13.4649 13.9783 15.5449 12.7483 16.3709C12.4043 16.6019 11.9383 16.5099 11.7083 16.1659C11.4773 15.8219 11.5683 15.3559 11.9123 15.1249C13.0875 14.335 14.1933 13.4176 14.8178 12.75L7.91984 12.75C7.50584 12.75 7.16984 12.414 7.16984 12C7.16984 11.586 7.50584 11.25 7.91984 11.25L14.8259 11.25C14.2028 10.5879 13.0923 9.66463 11.9113 8.86993C11.5673 8.63893 11.4773 8.17293 11.7083 7.82893C11.8523 7.61393 12.0903 7.49793 12.3313 7.49793Z"
      fill={color}
    />
    <Path
      d="M22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12ZM20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightSquareCurvedLightOutlineIcon;
