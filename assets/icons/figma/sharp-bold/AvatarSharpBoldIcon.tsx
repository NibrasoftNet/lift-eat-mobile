import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AvatarSharpBoldIcon component
 */
export const AvatarSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M17.396 12.0627H15.896L15.886 10.5627H17.396V12.0627ZM14.294 15.9607H9.528L8.958 15.0127L11.179 7.48367L12.618 7.90867L10.685 14.4607H14.294V15.9607ZM7.943 12.0627H6.443L6.433 10.5627H7.943V12.0627ZM12.25 2.38867C6.874 2.38867 2.5 6.76267 2.5 12.1387C2.5 17.5147 6.874 21.8887 12.25 21.8887C17.626 21.8887 22 17.5147 22 12.1387C22 6.76267 17.626 2.38867 12.25 2.38867Z"
      fill={color}
    />
  </Svg>
);

export default AvatarSharpBoldIcon;
