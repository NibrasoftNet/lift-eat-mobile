import * as React from 'react';
import Svg, {
  Path,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
} from 'react-native-svg';

interface LemonEmojiProps {
  size?: number;
}

export const LemonEmoji: React.FC<LemonEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_lemon"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(45) scale(35 25)"
        >
          <Stop stopColor="#FFF176" />
          <Stop offset="1" stopColor="#FFC107" />
        </RadialGradient>

        <LinearGradient
          id="paint1_linear_lemon_highlight"
          x1="35"
          y1="35"
          x2="55"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Corps principal du citron */}
      <Path
        d="M25 50C25 35 35 25 50 25C65 25 75 35 75 50C75 65 65 75 50 75C35 75 25 65 25 50Z"
        fill="url(#paint0_radial_lemon)"
        transform="rotate(45 50 50)"
      />

      {/* Extrémités du citron */}
      <Path
        d="M20 50C20 50 25 40 30 35"
        stroke="#FFA000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M80 50C80 50 75 60 70 65"
        stroke="#FFA000"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Reflet sur le citron */}
      <Path
        d="M35 35C35 35 40 40 45 42.5C50 45 55 45 60 42.5"
        stroke="url(#paint1_linear_lemon_highlight)"
        strokeWidth="10"
        strokeLinecap="round"
      />

      {/* Texture du citron */}
      <Path
        d="M35 35L65 65"
        stroke="#FFD54F"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <Path
        d="M30 50H70"
        stroke="#FFD54F"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <Path
        d="M35 65L65 35"
        stroke="#FFD54F"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      <Path
        d="M50 30V70"
        stroke="#FFD54F"
        strokeWidth="0.5"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default LemonEmoji;
