import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface RunningShirtEmojiProps {
  size?: number;
}

export const RunningShirtEmoji: React.FC<RunningShirtEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_shirt"
          x1="50"
          y1="15"
          x2="50"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#64B5F6" />
          <Stop offset="1" stopColor="#1976D2" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_collar"
          x1="50"
          y1="20"
          x2="50"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E0E0E0" />
        </LinearGradient>
      </Defs>

      {/* Corps du T-Shirt */}
      <Path
        d="M25 30V75C25 80 30 85 35 85H65C70 85 75 80 75 75V30L65 35V75H35V35L25 30Z"
        fill="url(#paint0_linear_shirt)"
      />
      
      {/* Manches */}
      <Path
        d="M25 30L15 25C15 25 20 15 30 15H40L35 35L25 30Z"
        fill="url(#paint0_linear_shirt)"
      />
      
      <Path
        d="M75 30L85 25C85 25 80 15 70 15H60L65 35L75 30Z"
        fill="url(#paint0_linear_shirt)"
      />
      
      {/* Col */}
      <Path
        d="M40 15H60C60 15 58 30 50 30C42 30 40 15 40 15Z"
        fill="url(#paint1_linear_collar)"
      />
      
      {/* Numéro */}
      <Path
        d="M45 50H55V60H45V50Z"
        fill="#FFFFFF"
      />
      
      <Path
        d="M43 45H47V65H43V45Z"
        fill="#FFFFFF"
      />
      
      {/* Plis du tissu */}
      <Path
        d="M30 50C30 50 35 52 35 55C35 58 30 60 30 60"
        stroke="#1565C0"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      
      <Path
        d="M70 50C70 50 65 52 65 55C65 58 70 60 70 60"
        stroke="#1565C0"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      
      <Path
        d="M40 75C40 75 50 70 60 75"
        stroke="#1565C0"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
    </Svg>
  );
};

export default RunningShirtEmoji;
