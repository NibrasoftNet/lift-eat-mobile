import React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface FacebookIconProps {
  size?: number;
}

export default function FacebookIcon({ size = 24 }: FacebookIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22.5 12C22.5 6.75 18.25 2.5 13 2.5C7.75 2.5 3.5 6.75 3.5 12C3.5 16.7812 7.0625 20.7188 11.6562 21.4062V14.9688H9.3125V12H11.6562V9.79375C11.6562 7.29375 13.0938 6 15.3438 6C16.4375 6 17.5938 6.20625 17.5938 6.20625V8.5H16.3125C15.0625 8.5 14.75 9.33125 14.75 10.1875V12H17.4688L16.9688 14.9688H14.75V21.4062C19.3438 20.7188 22.5 16.7812 22.5 12Z"
        fill="url(#paint0_linear_facebook)"
      />
      <Defs>
        <LinearGradient
          id="paint0_linear_facebook"
          x1="3.5"
          y1="2.5"
          x2="22.5"
          y2="21.5"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2AA4F4" />
          <Stop offset="1" stopColor="#007AD9" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}
