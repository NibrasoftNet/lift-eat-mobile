import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CarrotEmojiProps {
  size?: number;
}

export const CarrotEmoji: React.FC<CarrotEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_carrot"
          x1="50"
          y1="30"
          x2="50"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF9A3D" />
          <Stop offset="1" stopColor="#E57714" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_carrot_green"
          x1="50"
          y1="10"
          x2="50"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#70AD47" />
          <Stop offset="1" stopColor="#507E32" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear_carrot_highlight"
          x1="40"
          y1="40"
          x2="40"
          y2="70"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFBE7D" />
          <Stop offset="1" stopColor="#FFBE7D" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de la carotte */}
      <Path
        d="M65 40C65 35 60 30 55 30H45C40 30 35 35 35 40C35 40 32.5 45 30 50C27.5 55 25 65 30 75C35 85 45 85 50 85C55 85 65 85 70 75C75 65 72.5 55 70 50C67.5 45 65 40 65 40Z"
        fill="url(#paint0_linear_carrot)"
      />

      {/* Détails de la texture de la carotte */}
      <Path
        d="M57.5 40C57.5 40 55 45 55 50C55 55 57.5 60 57.5 65C57.5 70 55 75 50 80"
        stroke="#C96813"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M42.5 40C42.5 40 45 45 45 50C45 55 42.5 60 42.5 65C42.5 70 45 75 50 80"
        stroke="#C96813"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M50 30C50 30 45 45 50 60C55 75 50 85 50 85"
        stroke="#C96813"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Feuilles de la carotte */}
      <Path
        d="M45 30C45 30 35 25 30 15C25 5 35 10 40 15C45 20 45 30 45 30Z"
        fill="url(#paint1_linear_carrot_green)"
      />

      <Path
        d="M55 30C55 30 65 25 70 15C75 5 65 10 60 15C55 20 55 30 55 30Z"
        fill="url(#paint1_linear_carrot_green)"
      />

      <Path
        d="M50 30C50 30 50 25 50 15C50 5 45 10 45 15C45 20 50 30 50 30Z"
        fill="url(#paint1_linear_carrot_green)"
      />

      {/* Reflet sur la carotte */}
      <Path
        d="M35 40C35 40 37.5 45 40 50C42.5 55 45 65 40 75C40 75 45 65 45 55C45 45 40 40 35 40Z"
        fill="url(#paint2_linear_carrot_highlight)"
      />
    </Svg>
  );
};

export default CarrotEmoji;
