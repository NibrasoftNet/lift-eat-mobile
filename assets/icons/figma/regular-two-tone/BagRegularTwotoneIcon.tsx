import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * BagRegularTwotoneIcon component
 */
export const BagRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.5139 21.5H8.16604C5.09968 21.5 2.74727 20.3925 3.41547 15.9348L4.1935 9.89363C4.6054 7.66937 6.02416 6.81812 7.26901 6.81812H17.4475C18.7107 6.81812 20.047 7.73345 20.523 9.89363L21.3011 15.9348C21.8686 19.8891 19.5802 21.5 16.5139 21.5Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2965 11.102H15.2507"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.4659 11.102H9.42013"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.6512 6.59848C16.6512 4.21241 14.7169 2.27812 12.3309 2.27812V2.27812C11.1819 2.27325 10.0782 2.72628 9.26406 3.53703C8.44987 4.34778 7.99218 5.44947 7.99219 6.59848H7.99219"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default BagRegularTwotoneIcon;
