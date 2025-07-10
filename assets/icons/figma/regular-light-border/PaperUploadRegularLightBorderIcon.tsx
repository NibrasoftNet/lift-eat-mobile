import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperUploadRegularLightBorderIcon component
 */
export const PaperUploadRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M14.7364 2.76187H8.0844C6.0044 2.75387 4.3004 4.41087 4.2504 6.49087V17.2279C4.2054 19.3299 5.8734 21.0699 7.9744 21.1149C8.0114 21.1149 8.0484 21.1159 8.0844 21.1149H16.0724C18.1624 21.0409 19.8144 19.3189 19.8024 17.2279V8.03787L14.7364 2.76187Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M11.6406 9.90881V15.9498"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M13.9864 12.2643L11.6414 9.9093L9.29639 12.2643"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M14.4746 2.75012V5.65912C14.4746 7.07912 15.6236 8.23012 17.0436 8.23412H19.7976"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default PaperUploadRegularLightBorderIcon;
