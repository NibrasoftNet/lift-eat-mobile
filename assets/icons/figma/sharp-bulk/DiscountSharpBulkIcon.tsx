import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * DiscountSharpBulkIcon component
 */
export const DiscountSharpBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M21.8019 12.1365C19.9299 10.7165 18.9669 8.38952 19.2859 6.06252L19.3759 5.40952L18.7219 5.49952C16.4019 5.81952 14.0679 4.85452 12.6479 2.98252L12.2499 2.45752L11.8509 2.98252C10.4309 4.85452 8.09785 5.82052 5.77685 5.49952L5.12385 5.40952L5.21385 6.06252C5.53285 8.38952 4.56885 10.7165 2.69785 12.1365L2.17285 12.5345L2.69785 12.9335C4.56885 14.3525 5.53285 16.6795 5.21385 19.0075L5.12385 19.6605L5.77685 19.5705C8.09685 19.2525 10.4309 20.2145 11.8509 22.0865L12.2499 22.6115L12.6479 22.0865C14.0679 20.2145 16.4029 19.2535 18.7219 19.5705L19.3759 19.6605L19.2859 19.0075C18.9669 16.6795 19.9299 14.3525 21.8019 12.9335L22.3269 12.5345L21.8019 12.1365Z"
      fill={color}
    />
    <Path
      d="M8.84717 14.6683L9.90817 15.7293L15.4432 10.1943L14.3832 9.1333L8.84717 14.6683Z"
      fill={color}
    />
    <Path
      d="M13.5742 15.3563H15.0742V13.8563H13.5662L13.5742 15.3563Z"
      fill={color}
    />
    <Path
      d="M10.7212 11.0033V9.5033H9.21517L9.22117 11.0033H10.7212Z"
      fill={color}
    />
  </Svg>
);

export default DiscountSharpBulkIcon;
