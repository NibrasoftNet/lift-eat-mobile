import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * FolderRegularLightOutlineIcon component
 */
export const FolderRegularLightOutlineIcon = ({ color = "#212121", size = 24, ...props }: IconProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <Path d="M2 2H22.6966V22.6689H2V2Z" fill={"white"} />
    <Path d="M7.64251 3.5C4.73851 3.5 3.49951 4.976 3.49951 8.433V16.232C3.49951 19.416 5.25751 21.169 8.44951 21.169H16.2315C19.4155 21.169 21.1685 19.416 21.1685 16.232V16.229L21.1965 11.264C21.1965 7.865 20.0305 6.54 17.0355 6.54H14.2055C13.2565 6.539 12.3505 6.086 11.7805 5.328L10.8675 4.114C10.5805 3.729 10.1215 3.501 9.64151 3.5H7.64251ZM16.2315 22.669H8.44951C4.47151 22.669 1.99951 20.202 1.99951 16.232V8.433C1.99951 4.164 3.89851 2 7.64251 2H9.64251C10.5935 2.001 11.4995 2.455 12.0675 3.214L12.9785 4.426C13.2675 4.81 13.7265 5.039 14.2065 5.04H17.0355C20.8975 5.04 22.6965 7.019 22.6965 11.268L22.6685 16.235C22.6675 20.203 20.2015 22.669 16.2315 22.669Z" fill={color} />
    <Path d="M16.716 15.7129H7.98096C7.56696 15.7129 7.23096 15.3769 7.23096 14.9629C7.23096 14.5489 7.56696 14.2129 7.98096 14.2129H16.716C17.13 14.2129 17.466 14.5489 17.466 14.9629C17.466 15.3769 17.13 15.7129 16.716 15.7129Z" fill={color} />
  </Svg>
);

export default FolderRegularLightOutlineIcon;
