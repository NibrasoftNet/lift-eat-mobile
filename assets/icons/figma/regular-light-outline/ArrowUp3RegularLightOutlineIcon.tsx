import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3RegularLightOutlineIcon component
 */
export const ArrowUp3RegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M11.751 11.5498C11.337 11.5498 11.001 11.8858 11.001 12.2998V21.2498C11.001 21.6638 11.337 21.9998 11.751 21.9998C12.165 21.9998 12.501 21.6638 12.501 21.2498V12.2998C12.501 11.8858 12.165 11.5498 11.751 11.5498Z"
      fill={color}
    />
    <Path d="M6 13.0498H17.502V3.61331H6V13.0498Z" fill={'white'} />
    <Path
      d="M8.10955 11.5498L11.7516 5.7708L15.3926 11.5498H8.10955ZM11.7516 3.6128C11.4936 3.6128 11.2546 3.7448 11.1166 3.9638L6.11555 11.9008C5.96955 12.1308 5.96155 12.4228 6.09355 12.6618C6.22555 12.9018 6.47655 13.0498 6.75055 13.0498H16.7526C17.0256 13.0498 17.2766 12.9018 17.4086 12.6618C17.5416 12.4228 17.5326 12.1308 17.3866 11.9008L12.3856 3.9638C12.2486 3.7448 12.0086 3.6128 11.7516 3.6128Z"
      fill={color}
    />
  </Svg>
);

export default ArrowUp3RegularLightOutlineIcon;
