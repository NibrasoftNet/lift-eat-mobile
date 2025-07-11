import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategorySharpBrokenIcon component
 */
export const CategorySharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M2.85693 21.3936V14.3936H9.85693V21.3936H6.31793"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.8569 21.3931H20.8569V14.3931H13.8569V21.3931Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.85693 10.3931H9.85693V3.39307H2.85693V10.3931Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.4598 3.56545L21.6428 4.41845L19.8318 11.1794L13.0698 9.36845L14.8818 2.60645"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CategorySharpBrokenIcon;
