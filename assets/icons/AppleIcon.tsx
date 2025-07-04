import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AppleIconProps {
  size?: number;
}

export default function AppleIcon({ size = 24 }: AppleIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M17.05 19.327C16.25 20.127 15.45 19.927 14.7 19.527C13.9 19.127 13.2 19.077 12.35 19.527C11.25 20.127 10.65 19.877 9.95 19.327C6.3 15.827 6.95 10.327 11.05 10.127C12.05 10.177 12.75 10.727 13.35 10.777C14.25 10.677 15.1 10.077 16.05 10.177C17.25 10.327 18.1 10.877 18.7 11.827C15.55 13.527 16.1 17.677 19 18.827C18.55 19.077 17.8 19.727 17.05 19.327ZM13.2 10.027C13.05 8.077 14.65 6.477 16.45 6.327C16.7 8.577 14.45 10.277 13.2 10.027Z"
        fill="black"
      />
    </Svg>
  );
}
