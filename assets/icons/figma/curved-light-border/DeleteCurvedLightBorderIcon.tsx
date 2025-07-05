import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DeleteCurvedLightBorderIcon component
 */
export const DeleteCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.8894 9.55371C18.8894 17.5728 20.0437 21.1975 12.2799 21.1975C4.51515 21.1975 5.69324 17.5728 5.69324 9.55371"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M20.3653 6.47912H4.21484"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M15.7148 6.47958C15.7148 6.47958 16.2434 2.71387 12.2891 2.71387C8.33578 2.71387 8.86435 6.47958 8.86435 6.47958"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DeleteCurvedLightBorderIcon;
