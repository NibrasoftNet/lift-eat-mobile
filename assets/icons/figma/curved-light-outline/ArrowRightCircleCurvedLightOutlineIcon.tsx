import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowRightCircleCurvedLightOutlineIcon component
 */
export const ArrowRightCircleCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.9833 7.91036C10.8533 7.82136 10.7063 7.77936 10.5603 7.77936C10.3213 7.77936 10.0853 7.89336 9.94031 8.10536C9.70631 8.44736 9.79331 8.91436 10.1353 9.14836C11.7243 10.2354 13.2043 11.5824 13.3013 11.9684C13.2043 12.4154 11.7243 13.7624 10.1353 14.8524C9.79332 15.0864 9.70632 15.5524 9.94132 15.8944C10.1723 16.2354 10.6393 16.3224 10.9833 16.0904C12.4093 15.1124 14.7993 13.2824 14.7993 11.9994C14.7993 10.7154 12.4083 8.88636 10.9833 7.91036Z"
      fill={color}
    />
    <Path
      d="M22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12ZM20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12Z"
      fill={color}
    />
  </Svg>
);

export default ArrowRightCircleCurvedLightOutlineIcon;
