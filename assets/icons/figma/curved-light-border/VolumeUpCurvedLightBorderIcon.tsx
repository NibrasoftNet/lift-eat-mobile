import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VolumeUpCurvedLightBorderIcon component
 */
export const VolumeUpCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.9888 8.2168C18.2706 10.5395 18.2706 13.3741 16.9888 15.6886"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.4355 5.77441C21.9292 9.49441 21.9365 14.4035 19.4355 18.1317"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.68237 11.953C2.67964 13.1993 2.68237 14.6611 3.71146 15.5348C4.74146 16.4093 5.55783 16.0484 6.88964 16.4866C8.22237 16.9257 10.0887 19.633 12.1506 18.4102C13.2651 17.6184 13.7906 16.1239 13.7906 11.953C13.7906 7.78204 13.2887 6.30386 12.1506 5.49568C10.0887 4.27386 8.22237 6.98113 6.88964 7.41932C5.55783 7.85841 4.74146 7.4975 3.71146 8.37113C2.68237 9.24477 2.67964 10.7066 2.68237 11.953Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VolumeUpCurvedLightBorderIcon;
