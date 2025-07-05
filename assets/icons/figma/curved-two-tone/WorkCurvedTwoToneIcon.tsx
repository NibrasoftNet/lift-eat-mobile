import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WorkCurvedTwoToneIcon component
 */
export const WorkCurvedTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.9609 16.5167V13.8887"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.089 11.4775L21.06 11.4985C18.638 12.9905 15.44 13.8915 11.956 13.8915C8.47203 13.8915 5.28303 12.9905 2.86203 11.4985L2.83203 11.4775"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M2.75 13.3505C2.75 7.19846 5.053 5.14746 11.961 5.14746C18.87 5.14746 21.172 7.19846 21.172 13.3505C21.172 19.5025 18.87 21.5535 11.961 21.5535C5.053 21.5535 2.75 19.5025 2.75 13.3505Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.2237 5.3692V4.7392C15.2237 3.4752 14.3007 2.4502 13.1637 2.4502H10.7587C9.62173 2.4502 8.69873 3.4752 8.69873 4.7392V5.3692"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default WorkCurvedTwoToneIcon;
