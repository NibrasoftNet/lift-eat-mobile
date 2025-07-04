import * as React from 'react';
import Svg, { Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

interface FlexedBicepsEmojiProps {
  size?: number;
}

export const FlexedBicepsEmoji: React.FC<FlexedBicepsEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_biceps_arm"
          x1="45"
          y1="60"
          x2="45"
          y2="84"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFCC66" />
          <Stop offset="1" stopColor="#FFB55F" />
        </LinearGradient>
        
        <RadialGradient
          id="paint1_radial_biceps_highlight"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(44 20) rotate(45) scale(10)"
        >
          <Stop stopColor="#FFD863" />
          <Stop offset="1" stopColor="#F99D45" stopOpacity="0.5" />
        </RadialGradient>

        <LinearGradient
          id="paint2_linear_biceps_shadow"
          x1="40"
          y1="35"
          x2="40"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E5883A" stopOpacity="0.2" />
          <Stop offset="1" stopColor="#E5883A" stopOpacity="0.8" />
        </LinearGradient>
      </Defs>

      {/* Main bicep muscle */}
      <Path
        d="M70.5 20.8C65.4 16.9 61.3 19.9 58.6 22.5C56.4 24.8 53.4 25.8 50.3 25.9C47.2 26.0 44.2 25.0 41.8 22.5C40.1 20.7 37.7 19.5 35.2 19.0C32.8 18.7 30.2 19.5 28.4 21.3C24.8 25.0 24.9 31.3 28.8 34.7C32.1 37.6 37.6 37.6 40.9 34.7C41.5 34.2 42.2 33.9 42.9 33.9C43.6 33.9 44.3 34.2 44.9 34.7C45.5 35.2 45.9 35.9 45.9 36.6C45.9 37.4 45.5 38.1 44.9 38.6C39.0 43.8 29.4 43.3 24.0 37.6C19.2 32.5 18.9 24.2 23.2 19.1C25.8 16.1 29.4 14.4 33.4 15.0C36.4 15.4 39.3 16.9 41.6 19.0C43.2 20.6 45.2 21.5 47.4 21.7C49.6 21.9 51.8 21.4 53.6 20.1C56.9 17.5 62.6 12.8 70.6 19.1C71.5 19.9 71.4 21.2 70.6 22.0C69.9 22.8 68.6 22.7 67.8 21.9C65.8 20.2 63.0 19.6 60.5 20.3C58.0 21.0 56.1 22.9 55.4 25.4C54.7 27.9 55.3 30.7 57.0 32.7C57.9 33.6 57.9 34.9 57.1 35.7C56.3 36.5 55.1 36.6 54.2 35.8C51.5 32.7 50.6 28.5 51.7 24.6C52.8 20.7 55.8 17.6 59.7 16.5C63.5 15.4 67.4 16.3 70.5 20.8Z"
        fill="#FFB55F"
      />

      {/* Highlight on bicep */}
      <Path
        d="M43.5 21C45.7 22.2 47.7 22.2 49.5 21C48.3 19.4 46.9 18.8 45.3 19.2C43.7 19.6 43.1 20.2 43.5 21Z"
        fill="url(#paint1_radial_biceps_highlight)"
      />

      {/* Shadow under bicep */}
      <Path
        d="M37 38C39.8 40.4 42.3 41 44.5 39.8C43.3 36.6 41.7 35 39.5 35C37.3 35 36.2 36 37 38Z"
        fill="url(#paint2_linear_biceps_shadow)"
      />

      {/* Base skin color for arm */}
      <Path
        d="M23.5 77C27.1 81.8 32.5 84.2 39.5 84.2C46.5 84.2 51.8 81.8 55.5 77C59.2 72.2 61.2 65.8 61.5 57.8C61.8 49.8 59.2 43.4 53.5 38.6C47.8 33.8 40.5 33.8 34.8 38.6C29.1 43.4 26.2 49.8 26 57.8C25.8 65.8 27.5 72.2 31.2 77C31.2 77 19.9 72.2 23.5 77Z"
        fill="url(#paint0_linear_biceps_arm)"
      />
    </Svg>
  );
};

export default FlexedBicepsEmoji;
