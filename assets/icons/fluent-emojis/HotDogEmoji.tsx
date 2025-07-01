import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface HotDogEmojiProps {
  size?: number;
}

export const HotDogEmoji: React.FC<HotDogEmojiProps> = ({ size = 64 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Pain inférieur - gradient principal */}
      <Path
        d="M86.5 47.9c0 9.8-16.3 17.7-36.4 17.7s-36.4-7.9-36.4-17.7c0 0 16.3 12.8 36.4 12.8s36.4-12.8 36.4-12.8z"
        fill="#F2C28D"
      />
      {/* Pain supérieur - gradient principal */}
      <Path
        d="M13.7 39.4c0-9.8 16.3-17.7 36.4-17.7s36.4 7.9 36.4 17.7c0 0-16.3-12.8-36.4-12.8s-36.4 12.8-36.4 12.8z"
        fill="#F2C28D"
      />
      {/* Saucisse */}
      <Path
        d="M86.5 39.4v8.5c0 9.8-16.3 17.7-36.4 17.7s-36.4-7.9-36.4-17.7v-8.5c0 9.8 16.3 17.7 36.4 17.7s36.4-7.9 36.4-17.7z"
        fill="#E83F0F"
      />
      {/* Saucisse - effet brillant */}
      <Path 
        d="M78.8 43.2c-6.6 5.9-20.3 10-36.3 10-8.1 0-15.7-1.3-22-3.6 6.3 5.8 20 9.9 35.9 9.9 16.3 0 30.1-4.3 36.2-10.3-3.2-2.4-7.8-4.5-13.8-6z"
        fill="#C82D05"
        opacity="0.7"
      />
      {/* Pain - effets d'ombre et de relief */}
      <Path 
        d="M13.7 39.4c0 9.8 16.3 17.7 36.4 17.7s36.4-7.9 36.4-17.7"
        fill="#E7B07E"
        opacity="0.3"
      />
      <Path 
        d="M86.5 39.4c0 9.8-16.3 17.7-36.4 17.7S13.7 49.2 13.7 39.4"
        fill="#DC945A"
        opacity="0.2"
      />
      {/* Moutarde - tracés */}
      <Path
        d="M39.2 44.5c-0.9-0.2-1.7-0.6-2.6-0.9 0 0 3.3 1.3 8.1 2.4 5.5 1.5 12.4 2.8 18.7 2.8 13.5 0 27.9-4.4 30.3-5.5-2.4 1.1-16.8 5.5-30.3 5.5-11.1 0-20.5-3.3-24.2-4.3z"
        fill="#E8BF1C"
      />
      <Path
        d="M28 41.2c2 0.9 6.3 2.4 12.4 3.7 5.5 1.3 12.6 2.8 19 2.8 13.5 0 27.2-4.4 29.6-5.5-2.4 1.1-16.1 5.5-29.6 5.5-6.5 0-13.5-1.5-19-2.8-6.1-1.3-10.5-2.8-12.4-3.7z"
        fill="#E8C83E"
      />
    </Svg>
  );
};

export default HotDogEmoji;
