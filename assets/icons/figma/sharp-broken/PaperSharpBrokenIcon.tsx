import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperSharpBrokenIcon component
 */
export const PaperSharpBrokenIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M14.3434 16.2866H8.89941"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M12.2814 12.5039H8.89844"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.4412 21.25H19.9252V8.068L14.8182 2.75H4.5752V21.25"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3423 5.30469V8.64969H19.4493"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperSharpBrokenIcon;
