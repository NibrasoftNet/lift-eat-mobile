import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UserSharpBrokenIcon component
 */
export const UserSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M12.2322 20.5749C9.83422 20.5799 7.58722 20.1319 5.67822 18.9689C6.62622 15.9699 9.19822 14.5819 12.2322 14.5899C15.2622 14.5819 17.8382 15.9739 18.7852 18.9689C17.7662 19.5899 16.6512 20.0069 15.4682 20.2599"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.6562 13.7398C19.7803 13.7348 21.5862 14.7098 22.2502 16.8098C21.8612 17.0478 21.4512 17.2418 21.0252 17.3988"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.845 13.7398C4.72 13.7348 2.914 14.7098 2.25 16.8098C2.613 17.0308 2.992 17.2148 3.387 17.3658"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M17.6562 5.8667C19.2463 5.8667 20.5363 7.1557 20.5363 8.7467C20.5363 10.3367 19.2463 11.6267 17.6562 11.6267"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M6.84533 5.8667C5.25433 5.8667 3.96533 7.1557 3.96533 8.7467C3.96533 10.3367 5.25433 11.6267 6.84533 11.6267"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.9829 3.4248C14.8969 3.7698 16.3489 5.4448 16.3489 7.4578C16.3489 9.7218 14.5139 11.5568 12.2499 11.5568C9.98686 11.5568 8.15186 9.7218 8.15186 7.4578C8.15186 6.2088 8.71086 5.0898 9.59286 4.3378"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default UserSharpBrokenIcon;
