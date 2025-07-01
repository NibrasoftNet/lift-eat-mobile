import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface MartialArtsUniformEmojiProps {
  size?: number;
}

export const MartialArtsUniformEmoji: React.FC<MartialArtsUniformEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_gi"
          x1="50"
          y1="15"
          x2="50"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E0E0E0" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_belt"
          x1="50"
          y1="45"
          x2="50"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#212121" />
          <Stop offset="1" stopColor="#000000" />
        </LinearGradient>
      </Defs>

      {/* Corps principal du kimono */}
      <Path
        d="M30 35V75C30 80 35 85 40 85H60C65 85 70 80 70 75V35L60 32L50 30L40 32L30 35Z"
        fill="url(#paint0_linear_gi)"
      />
      
      {/* Col du kimono */}
      <Path
        d="M30 35V45L40 42L50 40L60 42L70 45V35L60 32L50 30L40 32L30 35Z"
        fill="url(#paint0_linear_gi)"
        stroke="#BDBDBD"
        strokeWidth="1"
      />
      
      {/* Partie gauche du kimono */}
      <Path
        d="M30 35L20 25C20 25 25 15 35 15H45L50 30L40 32L30 35Z"
        fill="url(#paint0_linear_gi)"
      />
      
      {/* Partie droite du kimono */}
      <Path
        d="M70 35L80 25C80 25 75 15 65 15H55L50 30L60 32L70 35Z"
        fill="url(#paint0_linear_gi)"
      />
      
      {/* Revers gauche */}
      <Path
        d="M40 32L45 15L50 30L40 32Z"
        stroke="#BDBDBD"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Revers droit */}
      <Path
        d="M60 32L55 15L50 30L60 32Z"
        stroke="#BDBDBD"
        strokeWidth="1"
        fill="none"
      />
      
      {/* Ceinture */}
      <Path
        d="M30 50H70V52C70 52 60 55 50 55C40 55 30 52 30 52V50Z"
        fill="url(#paint1_linear_belt)"
      />
      
      {/* Noeud de la ceinture */}
      <Path
        d="M45 50C45 50 50 48 55 50C55 50 53 55 50 55C47 55 45 50 45 50Z"
        fill="url(#paint1_linear_belt)"
      />
      
      <Path
        d="M40 52V60"
        stroke="url(#paint1_linear_belt)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <Path
        d="M60 52V60"
        stroke="url(#paint1_linear_belt)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Plis du tissu */}
      <Path
        d="M35 60C35 60 40 62 40 65C40 68 35 70 35 70"
        stroke="#BDBDBD"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      <Path
        d="M65 60C65 60 60 62 60 65C60 68 65 70 65 70"
        stroke="#BDBDBD"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      <Path
        d="M45 75C45 75 50 72 55 75"
        stroke="#BDBDBD"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default MartialArtsUniformEmoji;
