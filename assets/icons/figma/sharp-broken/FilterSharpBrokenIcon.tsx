import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterSharpBrokenIcon component
 */
export const FilterSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M11.0053 17.4707H5.36328"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.9902 17.4093C14.9902 15.9673 16.1672 14.7983 17.6202 14.7983C19.0722 14.7983 20.2502 15.9673 20.2502 17.4093C20.2502 18.8513 19.0722 20.0213 17.6202 20.0213C16.1672 20.0213 14.9902 18.8513 14.9902 17.4093Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.4951 7.85742H19.1371"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.51 7.79752C9.51 6.35552 8.333 5.18652 6.88 5.18652C5.428 5.18652 4.25 6.35552 4.25 7.79752C4.25 9.23952 5.428 10.4085 6.88 10.4085C8.333 10.4085 9.51 9.23952 9.51 7.79752Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FilterSharpBrokenIcon;
