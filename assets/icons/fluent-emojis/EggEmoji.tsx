import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';

interface EggEmojiProps {
  size?: number;
}

export const EggEmoji: React.FC<EggEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <RadialGradient
          id="paint0_radial_egg"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(50 50) rotate(90) scale(40 30)"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#F5F5F5" />
        </RadialGradient>
        
        <LinearGradient
          id="paint1_linear_egg_yolk"
          x1="50"
          y1="45"
          x2="50"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFC107" />
          <Stop offset="1" stopColor="#FF9800" />
        </LinearGradient>
      </Defs>

      {/* Forme principale de l'œuf */}
      <Path
        d="M50 15C35 15 25 30 20 45C15 60 25 80 50 80C75 80 85 60 80 45C75 30 65 15 50 15Z"
        fill="url(#paint0_radial_egg)"
        stroke="#E0E0E0"
        strokeWidth="1"
      />
      
      {/* Reflet sur l'œuf */}
      <Path
        d="M40 25C40 25 35 35 40 45C45 55 60 55 65 45C70 35 65 30 65 30"
        stroke="#FFFFFF"
        strokeWidth="5"
        strokeLinecap="round"
        strokeOpacity="0.7"
      />
      
      {/* Version cassée avec jaune d'œuf visible */}
      <Path
        d="M55 60C55 62.8 52.8 65 50 65C47.2 65 45 62.8 45 60C45 57.2 47.2 55 50 55C52.8 55 55 57.2 55 60Z"
        fill="url(#paint1_linear_egg_yolk)"
      />
      
      {/* Fissure dans l'œuf (optionnelle) */}
      <Path
        d="M40 40C40 40 45 50 50 45C55 40 60 45 60 45"
        stroke="#E0E0E0"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default EggEmoji;
