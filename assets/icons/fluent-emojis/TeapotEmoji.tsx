import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface TeapotEmojiProps {
  size?: number;
}

export const TeapotEmoji: React.FC<TeapotEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_teapot_body"
          x1="50"
          y1="30"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4E342E" />
          <Stop offset="1" stopColor="#3E2723" />
        </LinearGradient>

        <LinearGradient
          id="paint1_linear_teapot_lid"
          x1="50"
          y1="20"
          x2="50"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4E342E" />
          <Stop offset="1" stopColor="#3E2723" />
        </LinearGradient>

        <LinearGradient
          id="paint2_linear_teapot_handle"
          x1="75"
          y1="35"
          x2="85"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4E342E" />
          <Stop offset="1" stopColor="#3E2723" />
        </LinearGradient>

        <LinearGradient
          id="paint3_linear_teapot_spout"
          x1="25"
          y1="45"
          x2="15"
          y2="60"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#4E342E" />
          <Stop offset="1" stopColor="#3E2723" />
        </LinearGradient>

        <LinearGradient
          id="paint4_linear_steam"
          x1="50"
          y1="5"
          x2="50"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de la théière */}
      <Path
        d="M30 45C30 37.5 40 30 50 30C60 30 70 37.5 70 45V70C70 72.5 60 75 50 75C40 75 30 72.5 30 70V45Z"
        fill="url(#paint0_linear_teapot_body)"
      />

      {/* Couvercle */}
      <Path
        d="M40 30C40 27.5 45 25 50 25C55 25 60 27.5 60 30C60 32.5 55 35 50 35C45 35 40 32.5 40 30Z"
        fill="url(#paint1_linear_teapot_lid)"
      />

      <Path
        d="M45 25C45 22.5 47.5 20 50 20C52.5 20 55 22.5 55 25H45Z"
        fill="url(#paint1_linear_teapot_lid)"
      />

      {/* Poignée */}
      <Path
        d="M70 45C70 45 80 45 85 55C90 65 80 65 80 65C80 65 75 60 75 55C75 50 70 50 70 50"
        fill="url(#paint2_linear_teapot_handle)"
      />

      {/* Bec verseur */}
      <Path
        d="M30 45C30 45 20 45 15 55C10 65 20 65 20 65C20 65 25 60 25 55C25 50 30 50 30 50"
        fill="url(#paint3_linear_teapot_spout)"
      />

      {/* Détails sur la théière */}
      <Path
        d="M40 55C40 55 45 57.5 50 57.5C55 57.5 60 55 60 55"
        stroke="#5D4037"
        strokeWidth="1"
        strokeLinecap="round"
      />

      <Path
        d="M40 65C40 65 45 67.5 50 67.5C55 67.5 60 65 60 65"
        stroke="#5D4037"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Base de la théière */}
      <Path
        d="M35 70C35 70 40 72.5 50 72.5C60 72.5 65 70 65 70"
        stroke="#5D4037"
        strokeWidth="1"
        strokeLinecap="round"
      />

      {/* Vapeur */}
      <Path
        d="M50 5C50 5 45 10 50 15C55 20 45 20 45 20"
        stroke="url(#paint4_linear_steam)"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <Path
        d="M55 10C55 10 60 15 55 20C50 25 60 25 60 25"
        stroke="url(#paint4_linear_steam)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default TeapotEmoji;
