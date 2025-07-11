import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * VideoRegularLightBorderIcon component
 */
export const VideoRegularLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M16.2998 9.97984L19.5928 7.28484C20.4088 6.61684 21.6328 7.19884 21.6318 8.25184L21.6198 15.6008C21.6188 16.6538 20.3938 17.2308 19.5798 16.5628L16.2998 13.8678"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M16.2966 15.5383C16.3775 17.3704 14.8989 18.9196 12.9944 18.9975C12.8541 19.0034 6.01507 18.9896 6.01507 18.9896C4.11972 19.1335 2.46091 17.7715 2.31141 15.9463C2.30014 15.8103 2.30322 8.47219 2.30322 8.47219C2.21925 6.63815 3.6958 5.08499 5.60139 5.00418C5.74372 4.99728 12.5735 5.01009 12.5735 5.01009C14.4781 4.86818 16.142 6.24001 16.2895 8.07405C16.2997 8.2061 16.2966 15.5383 16.2966 15.5383Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default VideoRegularLightBorderIcon;
