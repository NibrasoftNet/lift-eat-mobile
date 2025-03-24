export enum ProviderEnum {
  'email' = 'email',
  'oauth_google' = 'oauth_google',
}

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

export enum DayEnum {
  'MONDAY' = 'MONDAY',
  'TUESDAY' = 'TUESDAY',
  'WEDNESDAY' = 'WEDNESDAY',
  'THURSDAY' = 'THURSDAY',
  'FRIDAY' = 'FRIDAY',
  'SATURDAY' = 'SATURDAY',
  'SUNDAY' = 'SUNDAY',
}

export const DayUnitArray = Object.values(DayEnum) as unknown as Readonly<
  [DayEnum, ...DayEnum[]]
>;

export enum DailyPlanGeneratedWithEnum {
  'MANUAL' = 'MANUAL',
  'AI' = 'AI',
  'COMPANY' = 'COMPANY',
}

export const DailyPlanGeneratedWithUnitArray = Object.values(
  DailyPlanGeneratedWithEnum,
) as unknown as Readonly<
  [DailyPlanGeneratedWithEnum, ...DailyPlanGeneratedWithEnum[]]
>;

export enum PlanGeneratedWithEnum {
  'MANUAL' = 'MANUAL',
  'AI' = 'AI',
  'COMPANY' = 'COMPANY',
}

export const PlanGeneratedWithArray = Object.values(
  PlanGeneratedWithEnum,
) as unknown as Readonly<[PlanGeneratedWithEnum, ...PlanGeneratedWithEnum[]]>;

export enum ToastTypeEnum {
  'INFOS' = 'INFOS',
  'SUCCESS' = 'SUCCESS',
  'ERROR' = 'ERROR',
}
