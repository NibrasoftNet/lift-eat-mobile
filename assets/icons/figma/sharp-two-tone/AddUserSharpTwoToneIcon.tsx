import * as React from 'react';
import Svg, { SvgProps, Path, Circle } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserSharpTwoToneIcon component
 */
export const AddUserSharpTwoToneIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M10.205 14.8189C13.4614 14.8106 16.2302 16.3057 17.2479 19.5242C15.1965 20.7748 12.7819 21.2564 10.205 21.2501C7.62812 21.2564 5.21348 20.7748 3.16211 19.5242C4.18101 16.3022 6.94514 14.8105 10.205 14.8189Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.293 8.66895V12.6789"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.338 10.6738H17.248"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Circle cx="10.1697" cy="7.16973" r="4.41973" fill='none' stroke={color} />
  </Svg>
);

export default AddUserSharpTwoToneIcon;
