import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Filter3SharpBulkIcon component
 */
export const Filter3SharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15 14.69V19.663L12.25 20.738V3.39502H21.75V7.80302L15 14.69Z"
      fill={color}
    />
    <Path
      d="M2.75 7.80302V3.39502H12.25V20.738L9.5 21.813V14.69L2.75 7.80302Z"
      fill={color}
    />
  </Svg>
);

export default Filter3SharpBulkIcon;
