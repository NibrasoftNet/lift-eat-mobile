enum MealUnitEnum {
  GRAMMES = 'GRAMMES',
  MILLILITRES = 'MILLILITRES',
  PIECES = 'PIECES',
}

interface MealEntry {
  name: string;
  unit: MealUnitEnum;
  quantity: number;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
  image?: string | null;
}

const HuilesEtCorpsGras: MealEntry[] = [
  {
    name: 'Beurre',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 717,
    carbs: 0.06,
    fat: 81.11,
    protein: 0.85,
    image: '../assets/images/seed/huiles_et_corps_gras/beurre.jpg',
  },
  {
    name: "Graisse d'agneau_crue_unit_mealunitenum_grammes_quantity_100_calories_665_carbs_0_0_fat_70_61_protein_6_65_image./assets/images/seed/huiles_et_corps_gras/graisse_d'Agneau_Crue.jpg",
  },
  {
    name: 'Huile de Colza',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.0,
    fat: 100.0,
    protein: 0.0,
    image: '../assets/images/seed/huiles_et_corps_gras/huile_de_colza.jpg',
  },
  {
    name: 'Huile de Mais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.0,
    fat: 100.0,
    protein: 0.0,
    image: '../assets/images/seed/huiles_et_corps_gras/huile_de_mais.jpg',
  },
  {
    name: 'Huile de Soja',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.0,
    fat: 100.0,
    protein: 0.0,
    image: '../assets/images/seed/huiles_et_corps_gras/huile_de_soja.jpg',
  },
  {
    name: 'Huile de Tournesol',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 900,
    carbs: 0.0,
    fat: 100.0,
    protein: 0.0,
    image: '../assets/images/seed/huiles_et_corps_gras/huile_de_tournesol.jpg',
  },
  {
    name: "Huile d'olive_unit_mealunitenum_grammes_quantity_100_calories_900_carbs_0_0_fat_100_0_protein_0_0_image./assets/images/seed/huiles_et_corps_gras/huile_d'Olive.jpg",
  },
  {
    name: 'Margarine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 716,
    carbs: 0.9,
    fat: 80.3,
    protein: 0.8,
    image: '../assets/images/seed/huiles_et_corps_gras/margarine.jpg',
  },
  {
    name: 'Smen',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 689,
    carbs: 1.5,
    fat: 77.3,
    protein: 0.85,
    image: '../assets/images/seed/huiles_et_corps_gras/smen.jpg',
  },
];

export default HuilesEtCorpsGras;
