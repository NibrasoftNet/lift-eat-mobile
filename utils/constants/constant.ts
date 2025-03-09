import { PhysicalActivityEnum } from '@/utils/enum/user-gender-activity.enum';
import { bed, bodyBuilder, hiking, worker } from '@/utils/constants/icons';

export const activityOptions = [
  {
    level: PhysicalActivityEnum.LOW,
    icon: bed,
  },
  {
    level: PhysicalActivityEnum.SEDENTARY,
    icon: worker,
  },
  {
    level: PhysicalActivityEnum.MODERATE,
    icon: hiking,
  },
  {
    level: PhysicalActivityEnum.HIGH,
    icon: bodyBuilder,
  },
];
