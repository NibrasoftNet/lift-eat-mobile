import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Notification3SharpLightBorderIcon component
 */
export const Notification3SharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M12.2497 4.29702C15.7338 4.29702 18.5583 7.1215 18.5583 10.6057V13.3988C18.5583 15.2851 19.1317 17.1269 20.2025 18.6798H4.29688C5.36762 17.1269 5.94101 15.2851 5.94101 13.3989V10.6057C5.94101 7.1215 8.7655 4.29702 12.2497 4.29702ZM12.2497 4.29702V2.13845"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.4785 18.6797V18.9101C15.4785 20.6932 14.0331 22.1386 12.25 22.1386C10.4669 22.1386 9.02148 20.6932 9.02148 18.9101V18.6797"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Notification3SharpLightBorderIcon;
