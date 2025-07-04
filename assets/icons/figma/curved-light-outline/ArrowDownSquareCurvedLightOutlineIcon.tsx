import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownSquareCurvedLightOutlineIcon component
 */
export const ArrowDownSquareCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.5021 12.3313C16.5021 12.4753 16.4611 12.6203 16.3741 12.7493C15.5471 13.9783 13.4651 16.8403 12.0001 16.8403C10.5351 16.8403 8.45507 13.9783 7.62907 12.7483C7.39807 12.4043 7.49007 11.9383 7.83407 11.7083C8.17807 11.4773 8.64407 11.5683 8.87507 11.9123C9.66499 13.0875 10.5824 14.1933 11.25 14.8178L11.25 7.91984C11.25 7.50584 11.586 7.16984 12 7.16984C12.414 7.16984 12.75 7.50584 12.75 7.91984L12.75 14.8259C13.4121 14.2028 14.3354 13.0923 15.1301 11.9113C15.3611 11.5673 15.8271 11.4773 16.1711 11.7083C16.3861 11.8523 16.5021 12.0903 16.5021 12.3313Z"
      fill={color}
    />
    <Path
      d="M12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12C2 19.383 4.617 22 12 22ZM12 20.5C5.486 20.5 3.5 18.514 3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownSquareCurvedLightOutlineIcon;
