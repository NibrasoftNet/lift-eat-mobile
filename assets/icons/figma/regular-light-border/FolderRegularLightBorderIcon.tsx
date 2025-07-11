import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderRegularLightBorderIcon component
 */
export const FolderRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M21.419 15.7321C21.419 19.3101 19.31 21.4191 15.732 21.4191H7.95C4.363 21.4191 2.25 19.3101 2.25 15.7321V7.93212C2.25 4.35912 3.564 2.25012 7.143 2.25012H9.143C9.861 2.25112 10.537 2.58812 10.967 3.16312L11.88 4.37712C12.312 4.95112 12.988 5.28912 13.706 5.29012H16.536C20.123 5.29012 21.447 7.11612 21.447 10.7671L21.419 15.7321Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.48096 14.463H16.216"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default FolderRegularLightBorderIcon;
