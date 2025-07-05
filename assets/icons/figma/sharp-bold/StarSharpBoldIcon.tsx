import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * StarSharpBoldIcon component
 */
export const StarSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M21.625 11.5156C17.265 10.3916 13.858 6.98456 12.734 2.62456L12.25 0.747559L11.766 2.62456C10.642 6.98456 7.23505 10.3916 2.87505 11.5156L0.998047 11.9996L2.87505 12.4846C7.23505 13.6086 10.642 17.0156 11.766 21.3746L12.25 23.2526L12.734 21.3746C13.858 17.0156 17.265 13.6086 21.625 12.4846L23.502 11.9996L21.625 11.5156Z"
      fill={color}
    />
    <Path
      d="M19.0011 7.74697C19.0011 6.58497 20.2751 5.24797 21.5001 5.24797C20.3211 5.24797 19.0011 3.89697 19.0011 2.74997C19.0011 3.89697 17.6931 5.24797 16.5031 5.24797C17.6481 5.24797 19.0011 6.57797 19.0011 7.74697Z"
      fill={color}
    />
  </Svg>
);

export default StarSharpBoldIcon;
