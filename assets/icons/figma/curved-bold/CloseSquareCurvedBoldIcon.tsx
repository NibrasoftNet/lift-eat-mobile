import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

/**
 * CloseSquareCurvedBoldIcon component
 */
export const CloseSquareCurvedBoldIcon = ({
  color = '#212121',
  size = 24,
  ...props
}: IconProps) => (
  <Svg width={size} height={size} viewBox="0 0 25 25" fill="none" {...props}>
    <Path
      d="M15.181 15.4577C15.035 15.6037 14.843 15.6777 14.651 15.6777C14.458 15.6777 14.267 15.6037 14.12 15.4577L12.247 13.5847L10.38 15.4517C10.234 15.5987 10.042 15.6717 9.85 15.6717C9.659 15.6717 9.466 15.5987 9.32 15.4517C9.027 15.1587 9.027 14.6847 9.32 14.3917L11.186 12.5237L9.32 10.6577C9.027 10.3647 9.027 9.89067 9.32 9.59767C9.613 9.30467 10.087 9.30467 10.38 9.59767L12.246 11.4637L14.11 9.59967C14.403 9.30667 14.877 9.30667 15.17 9.59967C15.463 9.89267 15.463 10.3667 15.17 10.6597L13.307 12.5237L15.181 14.3967C15.474 14.6897 15.474 15.1647 15.181 15.4577ZM12.25 2.78467C5.052 2.78467 2.5 5.33667 2.5 12.5347C2.5 19.7327 5.052 22.2847 12.25 22.2847C19.449 22.2847 22 19.7327 22 12.5347C22 5.33667 19.449 2.78467 12.25 2.78467Z"
      fill={color}
    />
  </Svg>
);

export default CloseSquareCurvedBoldIcon;
