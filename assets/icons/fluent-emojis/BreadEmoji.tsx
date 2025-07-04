import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BreadEmojiProps {
  size?: number;
}

export const BreadEmoji: React.FC<BreadEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_bread_crust"
          x1="50"
          y1="20"
          x2="50"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#D4A161" />
          <Stop offset="1" stopColor="#A67A44" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_bread_inside"
          x1="50"
          y1="30"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0B2" />
          <Stop offset="1" stopColor="#FFCC80" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_bread_slice"
          x1="35"
          y1="40"
          x2="35"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFE0B2" />
          <Stop offset="1" stopColor="#FFCC80" />
        </LinearGradient>
      </Defs>

      {/* Pain entier (arrière-plan) */}
      <Path
        d="M20 40C20 30 30 20 50 20C70 20 80 30 80 40V65H20V40Z"
        fill="url(#paint0_linear_bread_crust)"
      />
      
      {/* Intérieur du pain */}
      <Path
        d="M30 40C30 35 35 30 50 30C65 30 70 35 70 40V80H30V40Z"
        fill="url(#paint1_linear_bread_inside)"
      />
      
      {/* Tranche de pain */}
      <Path
        d="M20 50C20 50 25 45 35 45C45 45 50 50 50 50V80H20V50Z"
        fill="url(#paint2_linear_bread_slice)"
      />
      
      {/* Détails de la croûte sur le dessus */}
      <Path
        d="M30 25C30 25 40 30 50 30C60 30 70 25 70 25"
        stroke="#8D6E63"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <Path
        d="M40 22C40 22 45 25 50 25C55 25 60 22 60 22"
        stroke="#8D6E63"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Détails de la tranche */}
      <Path
        d="M25 60C25 60 30 62 35 62C40 62 45 60 45 60"
        stroke="#FFCC80"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      <Path
        d="M25 70C25 70 30 72 35 72C40 72 45 70 45 70"
        stroke="#FFCC80"
        strokeOpacity="0.7"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Ligne de séparation entre le pain entier et la tranche */}
      <Path
        d="M20 50V80"
        stroke="#A67A44"
        strokeWidth="1"
      />
    </Svg>
  );
};

export default BreadEmoji;
