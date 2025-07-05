import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * EditRegularTwotoneIcon component
 */
export const EditRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M13.6992 19.8979H20.0762"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.8547 4.95561C13.5917 4.01661 14.7827 4.06561 15.7227 4.80261L17.1127 5.89261C18.0527 6.62961 18.3857 7.77261 17.6487 8.71361L9.35972 19.2886C9.08272 19.6426 8.65972 19.8516 8.20972 19.8566L5.01272 19.8976L4.28872 16.7826C4.18672 16.3456 4.28872 15.8856 4.56572 15.5306L12.8547 4.95561Z"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.3022 6.93604L16.0962 10.694"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default EditRegularTwotoneIcon;
