import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface SandwichEmojiProps {
  size?: number;
}

export const SandwichEmoji: React.FC<SandwichEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_bread_top"
          x1="50"
          y1="20"
          x2="50"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0B2" />
          <Stop offset="1" stopColor="#FFCC80" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_bread_bottom"
          x1="50"
          y1="65"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0B2" />
          <Stop offset="1" stopColor="#FFCC80" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear_lettuce"
          x1="50"
          y1="35"
          x2="50"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8BC34A" />
          <Stop offset="1" stopColor="#558B2F" />
        </LinearGradient>

        <LinearGradient
          id="paint3_linear_meat"
          x1="50"
          y1="45"
          x2="50"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#795548" />
          <Stop offset="1" stopColor="#5D4037" />
        </LinearGradient>

        <LinearGradient
          id="paint4_linear_tomato"
          x1="50"
          y1="55"
          x2="50"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F44336" />
          <Stop offset="1" stopColor="#D32F2F" />
        </LinearGradient>
      </Defs>

      {/* Tranche de pain supérieure */}
      <Path
        d="M25 30C25 25 35 20 50 20C65 20 75 25 75 30V35H25V30Z"
        fill="url(#paint0_linear_bread_top)"
      />

      <Path
        d="M25 35C25 35 35 30 50 30C65 30 75 35 75 35"
        stroke="#D7CCC8"
        strokeWidth="1"
      />

      {/* Salade */}
      <Path d="M25 35H75V45H25V35Z" fill="url(#paint2_linear_lettuce)" />

      <Path
        d="M30 37C30 37 35 42 40 37C45 32 50 37 55 42C60 37 65 32 70 37"
        stroke="#AED581"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M30 40C30 40 35 45 40 40C45 35 50 40 55 45C60 40 65 35 70 40"
        stroke="#AED581"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Viande */}
      <Path d="M25 45H75V55H25V45Z" fill="url(#paint3_linear_meat)" />

      <Path
        d="M30 50C30 50 40 47 50 50C60 53 70 50 70 50"
        stroke="#8D6E63"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tomate */}
      <Path d="M25 55H75V65H25V55Z" fill="url(#paint4_linear_tomato)" />

      <Path
        d="M30 60C30 60 40 57 50 60C60 63 70 60 70 60"
        stroke="#EF9A9A"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Tranche de pain inférieure */}
      <Path
        d="M25 65H75V70C75 75 65 80 50 80C35 80 25 75 25 70V65Z"
        fill="url(#paint1_linear_bread_bottom)"
      />

      <Path
        d="M25 65C25 65 35 70 50 70C65 70 75 65 75 65"
        stroke="#D7CCC8"
        strokeWidth="1"
      />
    </Svg>
  );
};

export default SandwichEmoji;
