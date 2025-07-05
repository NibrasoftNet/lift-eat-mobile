import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareRegularLightOutlineIcon component
 */
export const CloseSquareRegularLightOutlineIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M9.60229 15.1367C9.41029 15.1367 9.21829 15.0637 9.07229 14.9167C8.77929 14.6237 8.77929 14.1497 9.07229 13.8567L13.8643 9.06472C14.1573 8.77172 14.6313 8.77172 14.9243 9.06472C15.2173 9.35772 15.2173 9.83172 14.9243 10.1247L10.1323 14.9167C9.98629 15.0637 9.79429 15.1367 9.60229 15.1367Z"
      fill={color}
    />
    <Path
      d="M14.3963 15.1395C14.2043 15.1395 14.0123 15.0665 13.8663 14.9195L9.07034 10.1225C8.77734 9.82952 8.77734 9.35552 9.07034 9.06252C9.36434 8.76952 9.83834 8.76952 10.1303 9.06252L14.9263 13.8595C15.2193 14.1525 15.2193 14.6265 14.9263 14.9195C14.7803 15.0665 14.5873 15.1395 14.3963 15.1395Z"
      fill={color}
    />
    <Path
      d="M7.665 3.5C5.135 3.5 3.5 5.233 3.5 7.916V16.084C3.5 18.767 5.135 20.5 7.665 20.5H16.333C18.864 20.5 20.5 18.767 20.5 16.084V7.916C20.5 5.233 18.864 3.5 16.334 3.5H7.665ZM16.333 22H7.665C4.276 22 2 19.622 2 16.084V7.916C2 4.378 4.276 2 7.665 2H16.334C19.723 2 22 4.378 22 7.916V16.084C22 19.622 19.723 22 16.333 22Z"
      fill={color}
    />
  </Svg>
);

export default CloseSquareRegularLightOutlineIcon;
