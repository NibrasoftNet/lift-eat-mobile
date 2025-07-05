import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DangerRegularTwotoneIcon component
 */
export const DangerRegularTwotoneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.2505 16.2697C11.2505 15.8557 11.5865 15.5137 12.0005 15.5137C12.4145 15.5137 12.7505 15.8447 12.7505 16.2587V16.2697C12.7505 16.6837 12.4145 17.0197 12.0005 17.0197C11.5865 17.0197 11.2505 16.6837 11.2505 16.2697Z"
      fill={color}
    />
    <Path
      d="M4.79584 20.418H19.2778C20.4248 20.358 21.3068 19.381 21.2478 18.234C21.2348 18.002 21.1848 17.773 21.0968 17.559L13.8198 4.82298C13.2638 3.81798 11.9988 3.45398 10.9938 4.01098C10.6518 4.19898 10.3698 4.48098 10.1808 4.82298L2.90384 17.559C2.47184 18.623 2.98384 19.835 4.04684 20.268C4.26284 20.355 4.49084 20.405 4.72284 20.418"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.9902 13.3961V10.2961"
      fill={none}
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default DangerRegularTwotoneIcon;
