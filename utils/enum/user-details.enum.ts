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


export enum DietaryRestrictionEnum {
    NONE = 'NONE',
    VEGETARIAN = 'VEGETARIAN',
    VEGAN = 'VEGAN',
    GLUTEN_FREE = 'GLUTEN_FREE',
    DAIRY_FREE = 'DAIRY_FREE',
    PALEO = 'PALEO',
    KETO = 'KETO',
    LOW_CARB = 'LOW_CARB',
    HALAL = 'HALAL',
    KOSHER = 'KOSHER',
}

export const DietaryRestrictionTypeArray = Object.values(DietaryRestrictionEnum) as unknown as Readonly<[DietaryRestrictionEnum, ...DietaryRestrictionEnum[]]>;


export enum AllergyEnum {
    NONE = 'NONE',
    PEANUTS = 'PEANUTS',
    TREE_NUTS = 'TREE_NUTS',
    MILK = 'MILK',
    EGGS = 'EGGS',
    FISH = 'FISH',
    SHELLFISH = 'SHELLFISH',
    SOY = 'SOY',
    WHEAT = 'WHEAT',
}

export const AllergyTypeArray = Object.values(AllergyEnum) as unknown as Readonly<[AllergyEnum, ...AllergyEnum[]]>;
