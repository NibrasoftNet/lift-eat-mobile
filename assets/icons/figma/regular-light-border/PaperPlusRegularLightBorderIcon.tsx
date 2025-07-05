import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusRegularLightBorderIcon component
 */
export const PaperPlusRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7366 2.76187H8.08455C6.00455 2.75387 4.29955 4.41087 4.25055 6.49087V17.3399C4.21555 19.3899 5.84855 21.0809 7.89955 21.1169C7.96055 21.1169 8.02255 21.1169 8.08455 21.1149H16.0726C18.1416 21.0939 19.8056 19.4089 19.8026 17.3399V8.03987L14.7366 2.76187Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.2936 12.9142H9.39355"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.8442 15.3639V10.4639"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4741 2.75012V5.65912C14.4741 7.07912 15.6231 8.23012 17.0431 8.23412H19.7971"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperPlusRegularLightBorderIcon;
