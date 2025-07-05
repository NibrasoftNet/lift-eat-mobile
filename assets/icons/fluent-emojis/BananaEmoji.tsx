import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BananaEmojiProps {
  size?: number;
}

export const BananaEmoji: React.FC<BananaEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_banana_outer"
          x1="20"
          y1="30"
          x2="75"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE566" />
          <Stop offset="1" stopColor="#FFCE31" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_banana_inner"
          x1="30"
          y1="40"
          x2="65"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear_banana_tip"
          x1="13"
          y1="25"
          x2="20"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8A5D3B" />
          <Stop offset="1" stopColor="#6A4529" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de la banane */}
      <Path
        d="M13 25C13 25 5 35 20 50C35 65 60 80 80 75C87 73 90 65 85 60C80 55 70 55 50 40C30 25 13 25 13 25Z"
        fill="url(#paint0_linear_banana_outer)"
      />

      {/* Reflet sur la banane */}
      <Path
        d="M30 40C30 40 40 55 65 70C65 70 55 55 30 40Z"
        fill="url(#paint1_linear_banana_inner)"
      />

      {/* Pointe de la banane */}
      <Path
        d="M13 25C13 25 10 30 15 32.5C20 35 25 30 20 27.5C15 25 13 25 13 25Z"
        fill="url(#paint2_linear_banana_tip)"
      />
    </Svg>
  );
};

export default BananaEmoji;
