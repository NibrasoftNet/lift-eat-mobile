import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * PaperNegativeRegularBulkIcon component
 */
export const PaperNegativeRegularBulkIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M18.8089 9.021C18.3574 9.021 17.7594 9.011 17.0149 9.011C15.199 9.011 13.7059 7.508 13.7059 5.675V2.459C13.7059 2.206 13.503 2 13.2525 2H7.96337C5.49604 2 3.5 4.026 3.5 6.509V17.284C3.5 19.889 5.59109 22 8.1703 22H16.0455C18.5059 22 20.5 19.987 20.5 17.502V9.471C20.5 9.217 20.298 9.012 20.0465 9.013C19.6238 9.016 19.1168 9.021 18.8089 9.021Z"
      fill={color}
    />
    <Path
      d="M14.3672 14.5693H9.4242C9.0132 14.5693 8.6792 14.2363 8.6792 13.8253C8.6792 13.4143 9.0132 13.0803 9.4242 13.0803H14.3672C14.7782 13.0803 15.1122 13.4143 15.1122 13.8253C15.1122 14.2363 14.7782 14.5693 14.3672 14.5693Z"
      fill={color}
    />
    <Path
      d="M16.0837 2.56725C15.7857 2.25625 15.2627 2.47025 15.2627 2.90125V5.53825C15.2627 6.64425 16.1737 7.55425 17.2797 7.55425C17.9767 7.56225 18.9447 7.56425 19.7677 7.56225C20.1877 7.56125 20.4017 7.05825 20.1097 6.75425C19.0547 5.65725 17.1657 3.69125 16.0837 2.56725Z"
      fill={color}
    />
  </Svg>
);

export default PaperNegativeRegularBulkIcon;
