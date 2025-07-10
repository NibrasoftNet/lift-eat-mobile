import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ProfileSharpBrokenIcon component
 */
export const ProfileSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.25 21.2494C9.67303 21.2564 7.25803 20.7744 5.20703 19.5234C6.22603 16.3014 8.99003 14.8104 12.25 14.8184C15.506 14.8104 18.275 16.3054 19.293 19.5234C18.143 20.2254 16.877 20.6854 15.534 20.9524"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2149 2.75C14.6559 2.75 16.6349 4.729 16.6349 7.17C16.6349 9.611 14.6559 11.589 12.2149 11.589C9.77392 11.589 7.79492 9.611 7.79492 7.17C7.79492 6.318 8.03592 5.523 8.45292 4.848"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default ProfileSharpBrokenIcon;
