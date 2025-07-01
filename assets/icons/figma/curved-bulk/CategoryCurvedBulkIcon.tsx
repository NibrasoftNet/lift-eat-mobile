import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CategoryCurvedBulkIcon component
 */
export const CategoryCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 24"
    fill="none"
    {...props}
  >
    <Path d="M10.5386 6.64673C10.5386 8.65806 8.90806 10.2886 6.89673 10.2886C4.88539 10.2886 3.25488 8.65806 3.25488 6.64673C3.25488 4.63539 4.88539 3.00488 6.89673 3.00488C8.90806 3.00488 10.5386 4.63539 10.5386 6.64673Z" fill={color} />
    <Path d="M21.2448 17.353C21.2448 19.3643 19.6143 20.9948 17.6029 20.9948C15.5916 20.9948 13.9611 19.3643 13.9611 17.353C13.9611 15.3416 15.5916 13.7111 17.6029 13.7111C19.6143 13.7111 21.2448 15.3416 21.2448 17.353Z" fill={color} />
    <Path d="M21.2448 6.64673C21.2448 8.65806 19.6143 10.2886 17.6029 10.2886C15.5916 10.2886 13.9611 8.65806 13.9611 6.64673C13.9611 4.63539 15.5916 3.00488 17.6029 3.00488C19.6143 3.00488 21.2448 4.63539 21.2448 6.64673Z" fill={color} />
    <Path d="M10.5386 17.353C10.5386 19.3643 8.90806 20.9948 6.89673 20.9948C4.88539 20.9948 3.25488 19.3643 3.25488 17.353C3.25488 15.3416 4.88539 13.7111 6.89673 13.7111C8.90806 13.7111 10.5386 15.3416 10.5386 17.353Z" fill={color} />
  </Svg>
);

export default CategoryCurvedBulkIcon;
