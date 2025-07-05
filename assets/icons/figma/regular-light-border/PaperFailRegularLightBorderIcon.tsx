import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperFailRegularLightBorderIcon component
 */
export const PaperFailRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.737 2.76196H7.979C5.919 2.76196 4.25 4.43196 4.25 6.49096V17.34C4.262 19.439 5.973 21.13 8.072 21.117C8.112 21.117 8.151 21.116 8.19 21.115H16.073C18.141 21.094 19.806 19.409 19.802 17.34V8.03996L14.737 2.76196Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.5759 14.6481L10.1099 11.1821"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.1108 14.6481L13.5768 11.1821"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4736 2.75024V5.65924C14.4736 7.07924 15.6216 8.23024 17.0416 8.23424H19.7966"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperFailRegularLightBorderIcon;
