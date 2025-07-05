import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUpCurvedLightOutlineIcon component
 */
export const ArrowUpCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.6843 10.195C18.7463 10.307 18.7743 10.429 18.7743 10.549C18.7743 10.817 18.6313 11.074 18.3803 11.21C18.0153 11.406 17.5603 11.271 17.3643 10.906C16.3493 9.0248 14.3576 6.19506 12.75 5.44049L12.75 19.5005C12.75 19.9145 12.414 20.2505 12 20.2505C11.586 20.2505 11.25 19.9145 11.25 19.5005L11.25 5.4421C9.64085 6.19909 7.65043 9.02614 6.63529 10.906C6.43829 11.271 5.98429 11.406 5.61929 11.21C5.25529 11.013 5.12029 10.556 5.31529 10.195C5.67029 9.534 8.87929 3.75 12.0023 3.75C15.1213 3.75 18.3293 9.534 18.6843 10.195Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUpCurvedLightOutlineIcon;
