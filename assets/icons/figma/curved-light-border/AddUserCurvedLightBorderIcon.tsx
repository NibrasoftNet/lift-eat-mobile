import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * AddUserCurvedLightBorderIcon component
 */
export const AddUserCurvedLightBorderIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.9221 21.8087C6.1081 21.8087 2.8501 21.2317 2.8501 18.9217C2.8501 16.6117 6.0871 14.5107 9.9221 14.5107C13.7361 14.5107 16.9941 16.5917 16.9941 18.9007C16.9941 21.2097 13.7571 21.8087 9.9221 21.8087Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M19.1309 8.12988V12.1399"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M21.1774 10.1348H17.0874"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
    <Path
      d="M9.92219 11.2164C12.4252 11.2164 14.4552 9.18639 14.4552 6.68339C14.4552 4.17939 12.4252 2.15039 9.92219 2.15039C7.41919 2.15039 5.38919 4.17939 5.38919 6.68339C5.38019 9.17739 7.39619 11.2074 9.89019 11.2164H9.92219Z"
      fill='none'
      stroke={color}
      strokeWidth="1.5"
    />
  </Svg>
);

export default AddUserCurvedLightBorderIcon;
