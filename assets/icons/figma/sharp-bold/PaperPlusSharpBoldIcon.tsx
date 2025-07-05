import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperPlusSharpBoldIcon component
 */
export const PaperPlusSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.5401 8.341V3.681L19.0101 8.341H14.5401ZM14.7581 15.176H12.2901V17.646H10.7901V15.176H8.31908V13.676H10.7901V11.206H12.2901V13.676H14.7581V15.176ZM15.0301 2.25H4.08008V21.75H20.4201V7.87L15.0301 2.25Z"
      fill={color}
    />
  </Svg>
);

export default PaperPlusSharpBoldIcon;
