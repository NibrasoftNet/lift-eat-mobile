export enum WeightUnitEnum {
    KG = 'KG',
    LBS = 'LBS',
    ST = 'ST',
}

export const WeightUnitTypeArray = Object.values(WeightUnitEnum) as unknown as Readonly<[WeightUnitEnum, ...WeightUnitEnum[]]>;


export enum HeightUnitEnum {
    CM = 'CM',
    IN = 'IN',
    FT = 'FT',
}

export const HeightUnitTypeArray = Object.values(HeightUnitEnum) as unknown as Readonly<[HeightUnitEnum, ...HeightUnitEnum[]]>;


export enum GoalEnum {
    WEIGHT_LOSS = 'WEIGHT_LOSS',
    MAINTAIN = 'MAINTAIN',
    GAIN_MUSCLE = 'GAIN_MUSCLE',
}

export const GoalTypeArray = Object.values(GoalEnum) as unknown as Readonly<[GoalEnum, ...GoalEnum[]]>;
