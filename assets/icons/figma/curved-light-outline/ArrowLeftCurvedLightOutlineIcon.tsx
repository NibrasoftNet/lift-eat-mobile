import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowLeftCurvedLightOutlineIcon component
 */
export const ArrowLeftCurvedLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.195 18.6838C10.307 18.7458 10.429 18.7738 10.549 18.7738C10.817 18.7738 11.074 18.6308 11.21 18.3798C11.406 18.0148 11.271 17.5598 10.906 17.3638C9.0248 16.3488 6.19506 14.3571 5.44049 12.7495L19.5005 12.7495C19.9145 12.7495 20.2505 12.4135 20.2505 11.9995C20.2505 11.5855 19.9145 11.2495 19.5005 11.2495L5.4421 11.2495C6.19909 9.64036 9.02614 7.64995 10.906 6.63481C11.271 6.43781 11.406 5.98381 11.21 5.61881C11.013 5.25481 10.556 5.11981 10.195 5.31481C9.534 5.66981 3.75 8.87881 3.75 12.0018C3.75 15.1208 9.534 18.3288 10.195 18.6838Z"
      fill={color}
    />
  </Svg>
);

export default ArrowLeftCurvedLightOutlineIcon;
