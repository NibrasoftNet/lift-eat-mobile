import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategoryCurvedBrokenIcon component
 */
export const CategoryCurvedBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M3.484 19.1181C3.176 18.5811 3 17.9581 3 17.2951C3 15.2661 4.645 13.6211 6.673 13.6211C8.702 13.6211 10.347 15.2661 10.347 17.2951C10.347 19.3231 8.702 20.9681 6.673 20.9681"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.0003 17.2941C21.0003 19.3231 19.3553 20.9671 17.3273 20.9671C15.2983 20.9671 13.6543 19.3231 13.6543 17.2941C13.6543 15.2651 15.2983 13.6201 17.3273 13.6201C19.3553 13.6201 21.0003 15.2651 21.0003 17.2941Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.0003 6.70623C21.0003 8.73523 19.3553 10.3802 17.3273 10.3802C15.2983 10.3802 13.6543 8.73523 13.6543 6.70623C13.6543 4.67723 15.2983 3.03223 17.3273 3.03223C18.0643 3.03223 18.7513 3.25023 19.3263 3.62423"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M10.347 6.70623C10.347 8.73523 8.702 10.3802 6.673 10.3802C4.645 10.3802 3 8.73523 3 6.70623C3 4.67723 4.645 3.03223 6.673 3.03223C8.702 3.03223 10.347 4.67723 10.347 6.70623Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default CategoryCurvedBrokenIcon;
