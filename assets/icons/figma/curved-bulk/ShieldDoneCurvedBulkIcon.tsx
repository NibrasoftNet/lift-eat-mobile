import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * ShieldDoneCurvedBulkIcon component
 */
export const ShieldDoneCurvedBulkIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 25 25"
    fill="none"
    {...props}
  >
    <Path d="M19.9377 5.42878C19.3317 4.82178 16.0037 2.67578 12.2497 2.67578C8.49369 2.67578 5.16769 4.82178 4.56169 5.42878C3.98069 6.01078 3.98969 6.46378 4.03369 8.97778C4.05269 9.99778 4.07769 11.3858 4.07769 13.3038C4.07769 19.8238 9.39969 22.5308 12.2497 22.5308C15.0987 22.5308 20.4217 19.8238 20.4217 13.3038C20.4217 11.3848 20.4467 9.99578 20.4657 8.97678C20.5107 6.46278 20.5187 6.01078 19.9377 5.42878Z" fill={color} />
    <Path d="M12.073 14.7237L15.971 10.8247C16.264 10.5317 16.264 10.0567 15.971 9.7637C15.678 9.4707 15.203 9.4707 14.91 9.7637L11.543 13.1327L10.181 11.7687C9.88802 11.4757 9.41302 11.4757 9.12102 11.7687C8.82702 12.0607 8.82702 12.5367 9.12002 12.8297L11.012 14.7237C11.153 14.8647 11.344 14.9437 11.543 14.9437C11.742 14.9437 11.932 14.8647 12.073 14.7237Z" fill={color} />
  </Svg>
);

export default ShieldDoneCurvedBulkIcon;
