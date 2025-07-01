import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

interface GreenAppleEmojiProps {
  size?: number;
}

export const GreenAppleEmoji: React.FC<GreenAppleEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_greenapple"
          x1="50"
          y1="15"
          x2="50"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8BC249" />
          <Stop offset="1" stopColor="#5D8C3A" />
        </LinearGradient>
        
        <RadialGradient
          id="paint1_radial_greenapple"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(65 35) rotate(90) scale(30)"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.6" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        
        <LinearGradient
          id="paint2_linear_greenapple"
          x1="50"
          y1="12"
          x2="50"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#7F502F" />
          <Stop offset="1" stopColor="#694023" />
        </LinearGradient>
        
        <LinearGradient
          id="paint3_linear_greenapple"
          x1="50"
          y1="10"
          x2="50"
          y2="25"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#8BC249" />
          <Stop offset="1" stopColor="#5D8C3A" />
        </LinearGradient>
      </Defs>

      {/* Corps principal de la pomme verte */}
      <Path
        d="M77 50C77 36.5 68 25 55 25C50 25 45.5 26.5 42 29C38.5 26.5 34 25 29 25C16 25 7 36.5 7 50C7 63.5 18 85 42 85C66 85 77 63.5 77 50Z"
        fill="url(#paint0_linear_greenapple)"
      />
      
      {/* Reflet sur la pomme */}
      <Path
        d="M55 30C50 35 48 45 50 55C52 65 58 70 65 70C68 65 70 60 70 50C70 40 64 33 55 30Z"
        fill="url(#paint1_radial_greenapple)"
      />
      
      {/* Tige */}
      <Path
        d="M50 12C47 12 45 15 45 18C45 21 47 23 50 23C53 23 55 21 55 18C55 15 53 12 50 12Z"
        fill="url(#paint2_linear_greenapple)"
      />
      
      {/* Feuille */}
      <Path
        d="M63 18C63 18 55 10 45 15C45 15 48 25 55 25C62 25 63 18 63 18Z"
        fill="url(#paint3_linear_greenapple)"
      />
    </Svg>
  );
};

export default GreenAppleEmoji;
