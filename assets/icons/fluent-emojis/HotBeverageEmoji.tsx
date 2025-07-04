import * as React from 'react';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

interface HotBeverageEmojiProps {
  size?: number;
}

export const HotBeverageEmoji: React.FC<HotBeverageEmojiProps> = ({ size = 100 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <Defs>
        <LinearGradient
          id="paint0_linear_cup"
          x1="50"
          y1="25"
          x2="50"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" />
          <Stop offset="1" stopColor="#E6E6E6" />
        </LinearGradient>
        
        <LinearGradient
          id="paint1_linear_coffee"
          x1="50"
          y1="30"
          x2="50"
          y2="65"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#A67C52" />
          <Stop offset="1" stopColor="#744C24" />
        </LinearGradient>
        
        <LinearGradient
          id="paint2_linear_steam"
          x1="50"
          y1="10"
          x2="50"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor="#FFFFFF" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* La tasse */}
      <Path
        d="M25 30C25 27.5 27.5 25 30 25H70C72.5 25 75 27.5 75 30V65C75 70 70 75 65 75H35C30 75 25 70 25 65V30Z"
        fill="url(#paint0_linear_cup)"
      />
      
      {/* L'anse */}
      <Path
        d="M75 35C75 35 85 35 85 45C85 55 75 55 75 55V50C75 50 80 50 80 45C80 40 75 40 75 40V35Z"
        fill="url(#paint0_linear_cup)"
      />
      
      {/* Café à l'intérieur */}
      <Path
        d="M30 30H70V60C70 62.5 67.5 65 65 65H35C32.5 65 30 62.5 30 60V30Z"
        fill="url(#paint1_linear_coffee)"
      />
      
      {/* Vapeur 1 */}
      <Path
        d="M40 30C40 30 38 20 40 10C40 10 42 20 40 30Z"
        fill="url(#paint2_linear_steam)"
      />
      
      {/* Vapeur 2 */}
      <Path
        d="M50 30C50 30 52 20 50 10C50 10 48 20 50 30Z"
        fill="url(#paint2_linear_steam)"
      />
      
      {/* Vapeur 3 */}
      <Path
        d="M60 30C60 30 58 20 60 10C60 10 62 20 60 30Z"
        fill="url(#paint2_linear_steam)"
      />
    </Svg>
  );
};

export default HotBeverageEmoji;
