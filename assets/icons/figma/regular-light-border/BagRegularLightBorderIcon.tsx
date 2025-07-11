import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagRegularLightBorderIcon component
 */
export const BagRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.5139 21.4999H8.16604C5.09968 21.4999 2.74727 20.3924 3.41547 15.9347L4.1935 9.89351C4.6054 7.66925 6.02416 6.81799 7.26901 6.81799H17.4475C18.7107 6.81799 20.047 7.73332 20.523 9.89351L21.3011 15.9347C21.8686 19.8889 19.5802 21.4999 16.5139 21.4999Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2965 11.1018H15.2507"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.4659 11.1018H9.42013"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.6512 6.59836C16.6512 4.21229 14.7169 2.27799 12.3309 2.27799V2.27799C11.1819 2.27312 10.0782 2.72615 9.26406 3.53691C8.44987 4.34766 7.99218 5.44935 7.99219 6.59836H7.99219"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagRegularLightBorderIcon;
