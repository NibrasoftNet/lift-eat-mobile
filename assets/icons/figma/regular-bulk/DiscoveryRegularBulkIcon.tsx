import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscoveryRegularBulkIcon component
 */
export const DiscoveryRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M22 11.9999C22 17.5229 17.523 21.9999 12 21.9999C6.477 21.9999 2 17.5229 2 11.9999C2 6.47788 6.477 1.99988 12 1.99988C17.523 1.99988 22 6.47788 22 11.9999Z"
      fill={color}
    />
    <Path
      d="M15.8597 8.70493L14.2397 13.8249C14.1797 14.0349 14.0097 14.2049 13.7997 14.2659L8.69972 15.8649C8.35972 15.9759 8.02972 15.6449 8.13972 15.3049L9.73972 10.1749C9.79972 9.96493 9.96972 9.80493 10.1797 9.73493L15.2997 8.13493C15.6497 8.02493 15.9697 8.35493 15.8597 8.70493Z"
      fill={color}
    />
  </Svg>
);

export default DiscoveryRegularBulkIcon;
