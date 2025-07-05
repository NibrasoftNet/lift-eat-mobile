import * as React from 'react';
import Svg, {
  Circle,
  Path,
  Defs,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface TennisEmojiProps {
  size?: number;
}

export const TennisEmoji: React.FC<TennisEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_tennis"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(90) scale(35)"
        >
          <Stop stopColor="#C5F34C" />
          <Stop offset="1" stopColor="#A3D62F" />
        </RadialGradient>
      </Defs>

      {/* Balle de tennis */}
      <Circle cx="50" cy="50" r="35" fill="url(#paint0_radial_tennis)" />

      {/* Courbes de la balle */}
      <Path
        d="M27 26C32 33 40 37 50 37C60 37 68 33 73 26"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Path
        d="M27 74C32 67 40 63 50 63C60 63 68 67 73 74"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Path
        d="M85 50C85 55 78 60 70 60C62 60 55 55 55 50C55 45 62 40 70 40C78 40 85 45 85 50Z"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <Path
        d="M15 50C15 55 22 60 30 60C38 60 45 55 45 50C45 45 38 40 30 40C22 40 15 45 15 50Z"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Texture */}
      <Path
        d="M35 20C38 22 42 24 46 25"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M35 80C38 78 42 76 46 75"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M65 20C62 22 58 24 54 25"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M65 80C62 78 58 76 54 75"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TennisEmoji;
