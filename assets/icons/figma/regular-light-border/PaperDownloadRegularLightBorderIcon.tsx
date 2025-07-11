import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperDownloadRegularLightBorderIcon component
 */
export const PaperDownloadRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7369 2.76187H8.08489C6.00489 2.75387 4.30089 4.41087 4.25089 6.49087V17.2279C4.20589 19.3299 5.87389 21.0699 7.97489 21.1149C8.01189 21.1149 8.04889 21.1159 8.08489 21.1149H16.0729C18.1629 21.0409 19.8149 19.3189 19.8029 17.2279V8.03787L14.7369 2.76187Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6421 15.9498V9.90881"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.29639 13.5945L11.6414 15.9495L13.9864 13.5945"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4751 2.75012V5.65912C14.4751 7.07912 15.6241 8.23012 17.0441 8.23412H19.7981"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperDownloadRegularLightBorderIcon;
