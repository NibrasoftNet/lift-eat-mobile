export enum GenderEnum {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export const GenderTypeArray = Object.values(GenderEnum) as unknown as Readonly<
  [GenderEnum, ...GenderEnum[]]
>;

export enum PhysicalActivityEnum {
  LOW = 'LOW',
  SEDENTARY = 'SEDENTARY',
  MODERATE = 'MODERATE',
  HIGH = 'HIGH',
}

export const PhysicalActivityTypeArray = Object.values(
  PhysicalActivityEnum,
) as unknown as Readonly<[PhysicalActivityEnum, ...PhysicalActivityEnum[]]>;
