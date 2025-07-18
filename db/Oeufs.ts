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

const Oeufs: MealEntry[] = [
  {
    name: "Jaune d'uf_cru_unit_mealunitenum_grammes_quantity_100_calories_322_carbs_3_59_fat_26_54_protein_15_86_image./assets/images/seed/oeufs/jaune_d'Œuf_Cru.jpg",
  },
  {
    name: 'Œuf Frais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 147,
    carbs: 0.86,
    fat: 9.94,
    protein: 12.58,
    image: '../assets/images/seed/oeufs/uf_frais.jpg',
  },
];

export default Oeufs;
