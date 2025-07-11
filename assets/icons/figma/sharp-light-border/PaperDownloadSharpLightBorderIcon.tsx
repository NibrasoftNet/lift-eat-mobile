import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadSharpLightBorderIcon component
 */
export const PaperDownloadSharpLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M14.8179 2.88867L4.5752 2.88867V21.3887H19.9245V8.20693L14.8179 2.88867Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.1133 17.6719L11.1133 9.8255"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M8.52648 15.085C9.85632 15.085 11.1133 16.2561 11.1133 17.6718"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.7001 15.085C12.3702 15.085 11.1133 16.2561 11.1133 17.6718"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.3418 3.44336V8.78878H19.4489"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperDownloadSharpLightBorderIcon;
