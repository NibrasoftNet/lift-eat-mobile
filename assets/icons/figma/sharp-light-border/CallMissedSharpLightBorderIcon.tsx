import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CallMissedSharpLightBorderIcon component
 */
export const CallMissedSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M20.9637 5.17773L16.1113 10.0301"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.1113 5.17773L20.9637 10.0301"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M18.0657 21.8417C8.9165 22.2605 2.10318 11.8871 3.04979 6.82576C3.91833 5.33331 5.0316 4.22792 6.52155 3.354L9.76207 7.80524L8.11867 10.6593C8.11867 10.6593 8.57246 12.5647 10.2804 14.2726C12.073 16.0652 14.0727 16.6133 14.0727 16.6133L16.9268 14.9699L21.5375 18.3699C20.6797 19.9025 19.5983 20.9839 18.0657 21.8417Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CallMissedSharpLightBorderIcon;
