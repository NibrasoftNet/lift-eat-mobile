import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCircleCurvedLightOutlineIcon component
 */
export const ArrowLeftCircleCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.0167 16.0896C13.1467 16.1786 13.2937 16.2206 13.4397 16.2206C13.6787 16.2206 13.9147 16.1066 14.0597 15.8946C14.2937 15.5526 14.2067 15.0856 13.8647 14.8516C12.2757 13.7646 10.7957 12.4176 10.6987 12.0316C10.7957 11.5846 12.2757 10.2376 13.8647 9.14764C14.2067 8.91364 14.2937 8.44764 14.0587 8.10564C13.8277 7.76464 13.3607 7.67764 13.0167 7.90964C11.5907 8.88764 9.20068 10.7176 9.20068 12.0006C9.20068 13.2846 11.5917 15.1136 13.0167 16.0896Z"
      fill={color}
    />
    <Path
      d="M2 12C2 19.383 4.617 22 12 22C19.383 22 22 19.383 22 12C22 4.617 19.383 2 12 2C4.617 2 2 4.617 2 12ZM3.5 12C3.5 5.486 5.486 3.5 12 3.5C18.514 3.5 20.5 5.486 20.5 12C20.5 18.514 18.514 20.5 12 20.5C5.486 20.5 3.5 18.514 3.5 12Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCircleCurvedLightOutlineIcon;
