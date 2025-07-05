import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * SwapSharpTwoToneIcon component
 */
export const SwapSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.3093 15.5547C14.6718 15.5547 16.9048 17.6353 16.9048 20.1502"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.9048 20.1494L16.9048 6.21014"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.5003 15.5547C19.1378 15.5547 16.9048 17.6353 16.9048 20.1502"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M3.00019 8.44531C5.36267 8.44531 7.5957 6.3647 7.5957 3.8498"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M7.5957 3.84961L7.5957 17.7889"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.1912 8.44531C9.82873 8.44531 7.5957 6.3647 7.5957 3.8498"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default SwapSharpTwoToneIcon;
