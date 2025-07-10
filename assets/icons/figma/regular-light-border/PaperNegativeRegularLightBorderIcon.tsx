import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeRegularLightBorderIcon component
 */
export const PaperNegativeRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7366 2.76188H8.08455C6.00455 2.75288 4.29955 4.41088 4.25055 6.49088V17.3399C4.21555 19.3899 5.84855 21.0809 7.89955 21.1169C7.96055 21.1169 8.02255 21.1169 8.08455 21.1149H16.0726C18.1416 21.0939 19.8056 19.4089 19.8026 17.3399V8.03988L14.7366 2.76188Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.2926 13.7472H9.39258"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4731 2.75012V5.65912C14.4731 7.07912 15.6221 8.23012 17.0421 8.23412H19.7961"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperNegativeRegularLightBorderIcon;
