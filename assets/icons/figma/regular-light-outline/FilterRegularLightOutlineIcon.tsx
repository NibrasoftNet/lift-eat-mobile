import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FilterRegularLightOutlineIcon component
 */
export const FilterRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M10.0803 18.5928H3.7793C3.3653 18.5928 3.0293 18.2568 3.0293 17.8428C3.0293 17.4288 3.3653 17.0928 3.7793 17.0928H10.0803C10.4943 17.0928 10.8303 17.4288 10.8303 17.8428C10.8303 18.2568 10.4943 18.5928 10.0803 18.5928Z"
      fill={color}
    />
    <Path
      d="M17.3879 16.208C16.4979 16.208 15.7739 16.924 15.7739 17.804C15.7739 18.685 16.4979 19.4 17.3879 19.4C18.2769 19.4 18.9999 18.685 18.9999 17.804C18.9999 16.924 18.2769 16.208 17.3879 16.208ZM17.3879 20.9C15.6709 20.9 14.2739 19.511 14.2739 17.804C14.2739 16.097 15.6709 14.708 17.3879 14.708C19.1039 14.708 20.4999 16.097 20.4999 17.804C20.4999 19.511 19.1039 20.9 17.3879 20.9Z"
      fill={color}
    />
    <Path
      d="M19.1911 8.90039H12.8911C12.4771 8.90039 12.1411 8.56439 12.1411 8.15039C12.1411 7.73639 12.4771 7.40039 12.8911 7.40039H19.1911C19.6051 7.40039 19.9411 7.73639 19.9411 8.15039C19.9411 8.56439 19.6051 8.90039 19.1911 8.90039Z"
      fill={color}
    />
    <Path d="M3 5.00049H9.2258V11.1921H3V5.00049Z" fill={'white'} />
    <Path
      d="M6.113 6.5C5.224 6.5 4.5 7.216 4.5 8.097C4.5 8.977 5.224 9.692 6.113 9.692C7.003 9.692 7.726 8.977 7.726 8.097C7.726 7.216 7.003 6.5 6.113 6.5ZM6.113 11.192C4.397 11.192 3 9.804 3 8.097C3 6.39 4.397 5 6.113 5C7.83 5 9.226 6.39 9.226 8.097C9.226 9.804 7.83 11.192 6.113 11.192Z"
      fill={color}
    />
  </Svg>
);

export default FilterRegularLightOutlineIcon;
