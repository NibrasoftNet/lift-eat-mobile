import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { ArrowLeft2RegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowLeft2RegularBoldIcon';
import { ArrowRight2RegularBoldIcon } from '../../../../assets/icons/figma/regular-bold/ArrowRight2RegularBoldIcon';
import { useTheme } from '../../../../themeNew';

// Configuration de la locale pour le calendrier
LocaleConfig.locales['fr'] = {
  monthNames: [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
  today: "Aujourd'hui"
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'Today'
};

// Définir la locale par défaut
LocaleConfig.defaultLocale = 'en';

// Interface pour définir la structure d'une date marquée
interface MarkedDate {
  selected?: boolean;
  marked?: boolean;
  dotColor?: string;
  selectedColor?: string;
}

// Interface pour définir la structure de l'objet markedDates
interface MarkedDates {
  [date: string]: MarkedDate;
}

// Interface pour le jour sélectionné
interface CalendarDay {
  dateString: string;
  day: number;
  month: number;
  year: number;
  timestamp: number;
}

// Interface pour le changement de mois
interface CalendarMonth {
  month: number;
  year: number;
  dateString: string;
}

interface NutrioCalendarProps {
  initialDate?: string;
  markedDates?: MarkedDates;
  onDayPress?: (day: CalendarDay) => void;
  minDate?: string;
  maxDate?: string;
  locale?: 'en' | 'fr';
  onMonthChange?: (month: CalendarMonth) => void;
}

const NutrioCalendar: React.FC<NutrioCalendarProps> = ({
  initialDate = new Date().toISOString().split('T')[0],
  markedDates = {},
  onDayPress,
  minDate,
  maxDate,
  locale = 'en',
  onMonthChange,
}) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  
  // Configurer la locale
  LocaleConfig.defaultLocale = locale;
  
  // Format de date: YYYY-MM-DD
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Obtenir le mois et l'année au format "December, 2024"
  const getMonthYearHeader = (date: string): string => {
    const [year, month] = date.split('-');
    const monthIndex = parseInt(month) - 1;
    return `${LocaleConfig.locales[locale].monthNames[monthIndex]}, ${year}`;
  };

  // Composant personnalisé pour l'en-tête du calendrier
  const CustomHeader = ({ date }: { date: Date }) => {
    const formattedDate = date.toISOString().split('T')[0];
    const headerText = getMonthYearHeader(formattedDate);
    
    const goToPreviousMonth = () => {
      const [year, month] = currentMonth.split('-');
      const prevMonth = new Date(parseInt(year), parseInt(month) - 2, 1);
      const formatted = formatDate(prevMonth);
      setCurrentMonth(formatted);
      if (onMonthChange) {
        // Créer un objet CalendarMonth compatible
        const calendarMonth: CalendarMonth = {
          month: prevMonth.getMonth() + 1,
          year: prevMonth.getFullYear(),
          dateString: formatted
        };
        onMonthChange(calendarMonth);
      }
    };
    
    const goToNextMonth = () => {
      const [year, month] = currentMonth.split('-');
      const nextMonth = new Date(parseInt(year), parseInt(month), 1);
      const formatted = formatDate(nextMonth);
      setCurrentMonth(formatted);
      if (onMonthChange) {
        // Créer un objet CalendarMonth compatible
        const calendarMonth: CalendarMonth = {
          month: nextMonth.getMonth() + 1,
          year: nextMonth.getFullYear(),
          dateString: formatted
        };
        onMonthChange(calendarMonth);
      }
    };
    
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={goToPreviousMonth} style={styles.arrowButton}>
          <ArrowLeft2RegularBoldIcon width={24} height={24} color="#212121" />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>{headerText}</Text>
        
        <TouchableOpacity onPress={goToNextMonth} style={styles.arrowButton}>
          <ArrowRight2RegularBoldIcon width={24} height={24} color="#212121" />
        </TouchableOpacity>
      </View>
    );
  };

  // Préparation des styles pour le thème du calendrier
  const calendarTheme = {
    backgroundColor: '#FAFAFA',
    calendarBackground: '#FAFAFA',
    textSectionTitleColor: '#9E9E9E',
    textSectionTitleDisabledColor: '#BDBDBD',
    selectedDayBackgroundColor: '#81A540',
    selectedDayTextColor: '#FFFFFF',
    todayTextColor: '#81A540',
    dayTextColor: '#212121',
    textDisabledColor: '#BDBDBD',
    dotColor: '#81A540',
    selectedDotColor: '#FFFFFF',
    arrowColor: 'transparent', // Masquer les flèches par défaut
    monthTextColor: '#212121',
    textMonthFontFamily: 'Urbanist-Bold',
    textMonthFontWeight: '700',
    textMonthFontSize: 20,
    textDayFontFamily: 'Urbanist-Regular',
    textDayFontSize: 14,
    textDayHeaderFontFamily: 'Urbanist-Medium',
    textDayHeaderFontSize: 12,
    'stylesheet.calendar.header': {
      header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
      },
      week: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 8,
      },
      dayHeader: {
        width: 32,
        textAlign: 'center',
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        color: '#9E9E9E',
      },
    },
    'stylesheet.day.basic': {
      base: {
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
      },
      text: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        color: '#212121',
        textAlign: 'center',
      },
      selected: {
        backgroundColor: '#81A540',
        borderRadius: 16,
      },
      today: {
        backgroundColor: 'rgba(129, 165, 64, 0.1)',
        borderRadius: 16,
      },
      todayText: {
        color: '#81A540',
        fontWeight: 'bold',
      },
      selectedText: {
        color: '#FFFFFF',
      },
      disabledText: {
        color: '#BDBDBD',
      },
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        current={currentMonth}
        initialDate={initialDate}
        minDate={minDate}
        maxDate={maxDate}
        onDayPress={onDayPress}
        monthFormat={'MMMM yyyy'}
        hideArrows={true}
        renderHeader={(date: Date) => <CustomHeader date={date} />}
        enableSwipeMonths={false}
        theme={calendarTheme}
        markedDates={markedDates}
        markingType={'dot'}
        firstDay={0} // Dimanche comme premier jour
        onMonthChange={(month: CalendarMonth) => {
          const formattedMonth = `${month.year}-${String(month.month).padStart(2, '0')}-01`;
          setCurrentMonth(formattedMonth);
          onMonthChange && onMonthChange(month);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    width: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  headerText: {
    fontFamily: 'Urbanist-Bold',
    fontSize: 20,
    color: '#212121',
    fontWeight: '700',
    textAlign: 'center',
    flex: 1,
  },
  arrowButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    width: '100%',
    marginVertical: 12,
  },
});

export default NutrioCalendar;
