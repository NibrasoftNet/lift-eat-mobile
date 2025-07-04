import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PlayCurvedLightOutlineIcon component
 */
export const PlayCurvedLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M9.7806 15.6626C9.9956 15.8766 10.2606 15.9556 10.5406 15.9556C10.9026 15.9556 11.2916 15.8246 11.6316 15.6836C12.4316 15.3516 16.1646 13.2986 16.1646 11.8566C16.1646 10.4366 12.5116 8.42256 11.5776 8.03756C11.1996 7.87956 10.3156 7.51556 9.7806 8.04956C9.628 8.20315 9.16558 8.6686 9.1526 11.8346C9.13961 15.0216 9.62245 15.5044 9.7806 15.6626ZM10.8166 14.3996C10.5966 13.3656 10.5996 10.4356 10.8196 9.33856C11.8176 9.68356 14.0956 11.1856 14.6066 11.8596C14.0936 12.5566 11.7866 14.0896 10.8166 14.3996Z" fill={color} />
    <Path d="M2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12ZM3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12Z" fill={color} />
  </Svg>
);

export default PlayCurvedLightOutlineIcon;
