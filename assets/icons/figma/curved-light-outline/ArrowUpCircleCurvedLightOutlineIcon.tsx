import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCircleCurvedLightOutlineIcon component
 */
export const ArrowUpCircleCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.0896 13.0167C16.1786 13.1467 16.2206 13.2937 16.2206 13.4397C16.2206 13.6787 16.1066 13.9147 15.8946 14.0597C15.5526 14.2937 15.0856 14.2067 14.8516 13.8647C13.7646 12.2757 12.4176 10.7957 12.0316 10.6987C11.5846 10.7957 10.2376 12.2757 9.14764 13.8647C8.91364 14.2067 8.44764 14.2937 8.10564 14.0587C7.76464 13.8277 7.67764 13.3607 7.90964 13.0167C8.88764 11.5907 10.7176 9.20068 12.0006 9.20068C13.2846 9.20068 15.1136 11.5917 16.0896 13.0167Z"
      fill={color}
    />
    <Path
      d="M12 2C19.383 2 22 4.617 22 12C22 19.383 19.383 22 12 22C4.617 22 2 19.383 2 12C2 4.617 4.617 2 12 2ZM12 3.5C5.486 3.5 3.5 5.486 3.5 12C3.5 18.514 5.486 20.5 12 20.5C18.514 20.5 20.5 18.514 20.5 12C20.5 5.486 18.514 3.5 12 3.5Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCircleCurvedLightOutlineIcon;
