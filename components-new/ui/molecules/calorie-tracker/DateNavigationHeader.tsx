import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../themeNew';
import { ArrowLeft3CurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ArrowLeft3CurvedBoldIcon';
import { ArrowRight3CurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/ArrowRight3CurvedBoldIcon';
import { CalendarCurvedBoldIcon } from '../../../../assets/icons/figma/curved-bold/CalendarCurvedBoldIcon';

interface DateNavigationHeaderProps {
  date: Date;
  onDateChange?: (date: Date) => void;
  onCalendarPress?: () => void;
  isDarkMode?: boolean;
}

const DateNavigationHeader: React.FC<DateNavigationHeaderProps> = ({
  date,
  onDateChange,
  onCalendarPress,
  isDarkMode = false,
}) => {
  const theme = useTheme();

  // Texte pour l'affichage de la date
  const isToday = new Date().toDateString() === date.toDateString();
  const formattedDate = isToday
    ? `Today, ${date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })}`
    : date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

  // Couleurs exactes du design Figma
  const textColor = isDarkMode ? '#FFFFFF' : '#212121';
  const backIconColor = isDarkMode ? '#FFFFFF' : '#212121';
  const forwardIconColor = isDarkMode ? '#9E9E9E' : '#9E9E9E';

  // Fonctions pour naviguer entre les dates
  const goToPreviousDay = () => {
    if (onDateChange) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() - 1);
      onDateChange(newDate);
    }
  };

  const goToNextDay = () => {
    if (onDateChange) {
      const newDate = new Date(date);
      newDate.setDate(date.getDate() + 1);
      onDateChange(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={goToPreviousDay} style={styles.arrowButton}>
        <ArrowLeft3CurvedBoldIcon
          width={24}
          height={24}
          color={backIconColor}
        />
      </TouchableOpacity>

      <View style={styles.dateContainer}>
        <Text
          style={[
            styles.dateText,
            {
              color: textColor,
              fontFamily: theme.typography.urbanist.h3.fontFamily,
            },
          ]}
        >
          {formattedDate}
        </Text>
        <TouchableOpacity
          onPress={onCalendarPress}
          style={styles.calendarButton}
        >
          <CalendarCurvedBoldIcon
            width={20}
            height={20}
            color={backIconColor}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={goToNextDay} style={styles.arrowButton}>
        <ArrowRight3CurvedBoldIcon
          width={24}
          height={24}
          color={forwardIconColor}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'stretch',
    width: '100%',
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 18,
    lineHeight: 25.2, // 1.4 * 18
    fontWeight: '600',
    textAlign: 'center',
  },
  calendarButton: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateNavigationHeader;
