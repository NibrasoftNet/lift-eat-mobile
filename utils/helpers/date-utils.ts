import { DayEnum } from '@/utils/enum/general.enum';

/**
 * Obtient le nom complet d'un jour en français à partir de son enum
 * @param day - Enum représentant le jour de la semaine
 * @returns Nom complet du jour en français
 */
export const getDayFullName = (day: DayEnum): string => {
  const dayNames: Record<DayEnum, string> = {
    [DayEnum.MONDAY]: 'Lundi',
    [DayEnum.TUESDAY]: 'Mardi',
    [DayEnum.WEDNESDAY]: 'Mercredi',
    [DayEnum.THURSDAY]: 'Jeudi',
    [DayEnum.FRIDAY]: 'Vendredi',
    [DayEnum.SATURDAY]: 'Samedi',
    [DayEnum.SUNDAY]: 'Dimanche',
  };
  
  return dayNames[day] || day;
};

/**
 * Obtient le nom abrégé d'un jour en français à partir de son enum
 * @param day - Enum représentant le jour de la semaine
 * @returns Nom abrégé du jour en français (3 premières lettres)
 */
export const getDayShortName = (day: DayEnum): string => {
  return getDayFullName(day).substring(0, 3);
};
