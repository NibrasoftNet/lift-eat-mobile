import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * WalletSharpBoldIcon component
 */
export const WalletSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 24" fill="none" {...props}>
    <Path
      d="M6.55914 11.169H13.4921V9.669H6.55914V11.169ZM3.49414 3.625L18.6231 3.626V5.351H3.49414V3.625ZM17.9311 17.584C16.0251 17.583 14.4741 16.141 14.4721 14.369C14.4721 12.596 16.0241 11.154 17.9311 11.153H22.5051V5.351H20.1231V2.126L1.99414 2.125V21.87H2.24414V21.875H22.5051V17.584H17.9311Z"
      fill={color}
    />
    <Path
      d="M15.9723 14.3687C15.9723 15.3137 16.8523 16.0837 17.9313 16.0847H22.5053V12.6537H17.9313C16.8513 12.6537 15.9723 13.4237 15.9723 14.3687Z"
      fill={color}
    />
  </Svg>
);

export default WalletSharpBoldIcon;
