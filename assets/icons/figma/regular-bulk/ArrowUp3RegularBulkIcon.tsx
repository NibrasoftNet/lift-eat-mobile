import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ArrowUp3RegularBulkIcon component
 */
export const ArrowUp3RegularBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M11.3412 20.2891L11.3412 11.8111C11.3412 11.4189 11.6595 11.1006 12.0517 11.1006C12.4439 11.1006 12.7622 11.4189 12.7622 11.8111L12.7622 20.2891C12.7622 20.6813 12.4439 20.9996 12.0517 20.9996C11.6595 20.9996 11.3412 20.6813 11.3412 20.2891Z" fill={color} />
    <Path d="M17.5 12.5215L6.6036 12.5215L6.6036 3.58202L17.5 3.58202V12.5215Z" fill={"white"} />
    <Path d="M6.60332 11.811C6.60332 11.6783 6.64027 11.5476 6.71227 11.432L11.4501 3.9137C11.5808 3.70717 11.8072 3.58117 12.0516 3.58117C12.2961 3.58117 12.5225 3.70717 12.6532 3.9137L17.391 11.432C17.5284 11.6509 17.5369 11.9275 17.4109 12.1539C17.2858 12.3813 17.0481 12.5215 16.7894 12.5215L7.31384 12.5215C7.05521 12.5215 6.81742 12.3813 6.69237 12.1539C6.63269 12.0469 6.60332 11.9284 6.60332 11.811Z" fill={color} />
  </Svg>
);

export default ArrowUp3RegularBulkIcon;
