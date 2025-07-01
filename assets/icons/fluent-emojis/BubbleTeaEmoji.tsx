import * as React from 'react';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

interface BubbleTeaEmojiProps {
  size?: number;
}

export const BubbleTeaEmoji: React.FC<BubbleTeaEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_cup"
          x1="50"
          y1="25"
          x2="50"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="1" stopColor="#E0E0E0" stopOpacity="0.9" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_tea"
          x1="50"
          y1="40"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A1887F" />
          <Stop offset="1" stopColor="#795548" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_lid"
          x1="50"
          y1="20"
          x2="50"
          y2="35"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#E0E0E0" />
          <Stop offset="1" stopColor="#9E9E9E" />
        </LinearGradient>
        
        <LinearGradient
          id="paint3_linear_straw"
          x1="60"
          y1="15"
          x2="60"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#F48FB1" />
          <Stop offset="1" stopColor="#E91E63" />
        </LinearGradient>
        
        <LinearGradient
          id="paint4_linear_bubble"
          x1="50"
          y1="60"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#3E2723" />
          <Stop offset="1" stopColor="#4E342E" />
        </LinearGradient>
      </Defs>

      {/* Gobelet */}
      <Path
        d="M35 35L30 85H70L65 35H35Z"
        fill="url(#paint0_linear_cup)"
        stroke="#BDBDBD"
        strokeWidth="1"
      />
      
      {/* Thé au lait à l'intérieur */}
      <Path
        d="M36 40L32 75H68L64 40H36Z"
        fill="url(#paint1_linear_tea)"
      />
      
      {/* Couvercle */}
      <Path
        d="M30 35H70V30C70 25 60 20 50 20C40 20 30 25 30 30V35Z"
        fill="url(#paint2_linear_lid)"
      />
      
      {/* Paille */}
      <Path
        d="M60 15V75"
        stroke="url(#paint3_linear_straw)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      
      {/* Bulles de tapioca */}
      <Circle cx="40" cy="65" r="4" fill="url(#paint4_linear_bubble)" />
      <Circle cx="50" cy="70" r="4" fill="url(#paint4_linear_bubble)" />
      <Circle cx="60" cy="65" r="4" fill="url(#paint4_linear_bubble)" />
      <Circle cx="45" cy="60" r="4" fill="url(#paint4_linear_bubble)" />
      <Circle cx="55" cy="60" r="4" fill="url(#paint4_linear_bubble)" />
      
      {/* Reflets sur le gobelet */}
      <Path
        d="M40 50C40 50 45 52.5 50 52.5C55 52.5 60 50 60 50"
        stroke="#FFFFFF"
        strokeOpacity="0.5"
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Détails du couvercle */}
      <Path
        d="M60 25C60 25 55 27.5 50 27.5C45 27.5 40 25 40 25"
        stroke="#BDBDBD"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default BubbleTeaEmoji;
