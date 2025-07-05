import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * UploadSharpBoldIcon component
 */
export const UploadSharpBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M13 10.969V17.229H11.5V10.969H2.5V22.489H22V10.969H13Z"
      fill={color}
    />
    <Path
      d="M13 6.16757C13.99 7.21257 15.371 7.88857 16.85 7.88857H17.6V6.38857H16.85C14.835 6.38857 13 4.55557 13 2.54257V1.78857H11.5V2.54257C11.5 4.55557 9.67003 6.38857 7.66003 6.38857H6.91003V7.88857H7.66003C9.13503 7.88857 10.512 7.21457 11.5 6.17057L11.5 10.969H13L13 6.16757Z"
      fill={color}
    />
  </Svg>
);

export default UploadSharpBoldIcon;
