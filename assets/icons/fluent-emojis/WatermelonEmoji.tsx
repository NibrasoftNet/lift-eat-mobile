import * as React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface WatermelonEmojiProps {
  size?: number;
}

export const WatermelonEmoji: React.FC<WatermelonEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_watermelon_rind"
          x1="50"
          y1="20"
          x2="50"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#2E7D32" />
          <Stop offset="1" stopColor="#1B5E20" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_watermelon_flesh"
          x1="50"
          y1="40"
          x2="50"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FF5252" />
          <Stop offset="1" stopColor="#D32F2F" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_watermelon_pattern"
          x1="50"
          y1="25"
          x2="50"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#81C784" />
          <Stop offset="1" stopColor="#4CAF50" />
        </LinearGradient>
      </Defs>

      {/* Forme principale de la pastèque (section) */}
      <Path
        d="M20 50C20 32.5 32.5 20 50 20C67.5 20 80 32.5 80 50C80 67.5 67.5 80 50 80C32.5 80 20 67.5 20 50Z"
        fill="url(#paint1_linear_watermelon_flesh)"
      />
      
      {/* Écorce de la pastèque (contour extérieur) */}
      <Path
        d="M20 50C20 32.5 32.5 20 50 20C67.5 20 80 32.5 80 50"
        stroke="url(#paint0_linear_watermelon_rind)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      
      {/* Motifs sur l'écorce */}
      <Path
        d="M24 40C24 40 27 35 30 33"
        stroke="url(#paint2_linear_watermelon_pattern)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <Path
        d="M34 27C34 27 37 25 40 24"
        stroke="url(#paint2_linear_watermelon_pattern)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <Path
        d="M50 22C50 22 53 23 56 24"
        stroke="url(#paint2_linear_watermelon_pattern)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      <Path
        d="M66 28C66 28 69 30 72 33"
        stroke="url(#paint2_linear_watermelon_pattern)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      
      {/* Pépins de la pastèque */}
      <Circle cx="35" cy="45" r="2" fill="#311B92" />
      <Circle cx="45" cy="55" r="2" fill="#311B92" />
      <Circle cx="55" cy="45" r="2" fill="#311B92" />
      <Circle cx="65" cy="55" r="2" fill="#311B92" />
      <Circle cx="40" cy="65" r="2" fill="#311B92" />
      <Circle cx="60" cy="65" r="2" fill="#311B92" />
      <Circle cx="50" cy="75" r="2" fill="#311B92" />
    </Svg>
  );
};

export default WatermelonEmoji;
