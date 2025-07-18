import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowDownRegularLightOutlineIcon component
 */
export const ArrowDownRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M12.2739 4C12.6536 4 12.9674 4.28215 13.0171 4.64823L13.0239 4.75V19.75C13.0239 20.1642 12.6881 20.5 12.2739 20.5C11.8942 20.5 11.5804 20.2178 11.5308 19.8518L11.5239 19.75V4.75C11.5239 4.33579 11.8597 4 12.2739 4Z"
      fill={color}
    />
    <Path
      d="M17.767 13.171C18.0593 12.8775 18.5342 12.8765 18.8277 13.1687C19.0945 13.4344 19.1196 13.851 18.9024 14.1451L18.83 14.2294L12.806 20.2794C12.5395 20.547 12.1214 20.5714 11.8273 20.3524L11.7431 20.2794L5.71808 14.2294C5.4258 13.9359 5.42678 13.4611 5.72028 13.1688C5.9871 12.9031 6.40381 12.8797 6.69697 13.0982L6.78094 13.171L12.2748 18.687L17.767 13.171Z"
      fill={color}
    />
  </Svg>
);

export default ArrowDownRegularLightOutlineIcon;
