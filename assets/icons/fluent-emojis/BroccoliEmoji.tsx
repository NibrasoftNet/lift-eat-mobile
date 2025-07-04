import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BroccoliEmojiProps {
  size?: number;
}

export const BroccoliEmoji: React.FC<BroccoliEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_broccoli_stem"
          x1="50"
          y1="60"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A3CE70" />
          <Stop offset="1" stopColor="#7AAC48" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_broccoli_top"
          x1="50"
          y1="20"
          x2="50"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#53882F" />
          <Stop offset="1" stopColor="#3C6621" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_broccoli_highlight"
          x1="50"
          y1="25"
          x2="50"
          y2="45"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#70A844" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#70A844" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* Tige du brocoli */}
      <Path
        d="M42.5 60C42.5 60 40 70 42.5 75C45 80 55 80 57.5 75C60 70 57.5 60 57.5 60H42.5Z"
        fill="url(#paint0_linear_broccoli_stem)"
      />
      
      {/* Base du brocoli */}
      <Path
        d="M30 50C25 45 20 37.5 25 30C30 22.5 40 25 45 22.5C50 20 55 15 60 20C65 25 67.5 22.5 72.5 25C77.5 27.5 80 35 75 42.5C70 50 60 55 57.5 60H42.5C40 55 35 55 30 50Z"
        fill="url(#paint1_linear_broccoli_top)"
      />
      
      {/* Détails texturés du brocoli */}
      <Path
        d="M30 45C30 45 35 40 40 37.5C45 35 52.5 35 55 30C57.5 25 62.5 27.5 67.5 32.5C72.5 37.5 67.5 45 62.5 47.5C57.5 50 52.5 52.5 50 57.5C47.5 52.5 42.5 50 37.5 47.5C32.5 45 30 45 30 45Z"
        fill="#2F5315"
        fillOpacity="0.4"
      />
      
      {/* Structures en forme de petits bouquets */}
      <Path
        d="M30 37.5C30 37.5 27.5 32.5 30 30C32.5 27.5 35 30 35 30C35 30 37.5 27.5 40 30C42.5 32.5 40 35 40 35C40 35 42.5 37.5 40 40C37.5 42.5 35 40 35 40C35 40 32.5 42.5 30 40C27.5 37.5 30 37.5 30 37.5Z"
        fill="#3C6621"
      />
      
      <Path
        d="M55 27.5C55 27.5 52.5 22.5 55 20C57.5 17.5 60 20 60 20C60 20 62.5 17.5 65 20C67.5 22.5 65 25 65 25C65 25 67.5 27.5 65 30C62.5 32.5 60 30 60 30C60 30 57.5 32.5 55 30C52.5 27.5 55 27.5 55 27.5Z"
        fill="#3C6621"
      />
      
      <Path
        d="M70 35C70 35 67.5 30 70 27.5C72.5 25 75 27.5 75 27.5C75 27.5 77.5 25 80 27.5C82.5 30 80 32.5 80 32.5C80 32.5 82.5 35 80 37.5C77.5 40 75 37.5 75 37.5C75 37.5 72.5 40 70 37.5C67.5 35 70 35 70 35Z"
        fill="#3C6621"
      />
      
      {/* Reflet sur le dessus du brocoli */}
      <Path
        d="M35 30C35 30 40 32.5 45 32.5C50 32.5 55 30 60 32.5C65 35 60 42.5 55 45C50 47.5 45 45 40 42.5C35 40 35 30 35 30Z"
        fill="url(#paint2_linear_broccoli_highlight)"
      />
    </Svg>
  );
};

export default BroccoliEmoji;
