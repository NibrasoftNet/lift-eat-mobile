import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * Image3SharpTwoToneIcon component
 */
export const Image3SharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M3.38574 21.3324L7.39523 16.0017H7.5089L10.3352 18.5382H10.5399L14.8562 12.2573H15.0135L21.2693 21.0817"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.9531 9.1792C10.9531 10.315 10.0333 11.2349 8.89746 11.2349C7.76273 11.2349 6.8418 10.315 6.8418 9.1792C6.8418 8.04335 7.76273 7.12354 8.89746 7.12354C10.0322 7.12465 10.952 8.04446 10.9531 9.1792Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5 21.854L21.5 3.354L3 3.354L3 21.854L21.5 21.854Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default Image3SharpTwoToneIcon;
