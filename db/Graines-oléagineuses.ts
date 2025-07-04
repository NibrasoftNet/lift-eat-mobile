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

const grainesOleagineuses: MealEntry[] = [
  {
    name: 'Amande Sèche Grillée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 597,
    carbs: 8.29,
    fat: 52.83,
    protein: 22.09,
    image: '../assets/images/seed/Graines-oléagineuses/Amande_Sèche_Grillée.jpg',
  },

  {
    name: 'Amande Sèche Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 578,
    carbs: 9.30,
    fat: 50.64,
    protein: 21.26,
    image: '../assets/images/seed/Graines-oléagineuses/Amande_Sèche_Naturelle.jpg',
  },

  {
    name: 'Cacahuète Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 585,
    carbs: 10.84,
    fat: 49.66,
    protein: 23.68,
    image: '../assets/images/seed/Graines-oléagineuses/Cacahuète_Grillée_Salée.jpg',
  },

  {
    name: 'Cacahuète Grillée Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 585,
    carbs: 10.84,
    fat: 49.66,
    protein: 23.68,
    image: '../assets/images/seed/Graines-oléagineuses/Cacahuète_Grillée_Sans_Sel.jpg',
  },

  {
    name: 'Mélange de Fruits Secs Grillés',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 594,
    carbs: 15.44,
    fat: 51.45,
    protein: 17.30,
    image: '../assets/images/seed/Graines-oléagineuses/Mélange_de_Fruits_Secs_Grillés.jpg',
  },

  {
    name: 'Noisette Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 628,
    carbs: 5.36,
    fat: 60.75,
    protein: 14.95,
    image: '../assets/images/seed/Graines-oléagineuses/Noisette_Naturelle.jpg',
  },

  {
    name: 'Noix Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 654,
    carbs: 13.71,
    fat: 65.21,
    protein: 15.23,
    image: '../assets/images/seed/Graines-oléagineuses/Noix_Naturelle.jpg',
  },

  {
    name: 'Noix de Cajou Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 574,
    carbs: 23.90,
    fat: 46.35,
    protein: 15.31,
    image: '../assets/images/seed/Graines-oléagineuses/Noix_de_Cajou_Grillée_Salée.jpg',
  },

  {
    name: 'Noix de Cajou Grillée Non Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 574,
    carbs: 23.90,
    fat: 46.35,
    protein: 15.31,
    image: '../assets/images/seed/Graines-oléagineuses/Noix_de_Cajou_Grillée_Non_Salée.jpg',
  },

  {
    name: 'Noix de Coco Sèche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 660,
    carbs: 12.93,
    fat: 64.53,
    protein: 6.88,
    image: '../assets/images/seed/Graines-oléagineuses/Noix_de_Coco_Sèche.jpg',
  },

  {
    name: 'Pâte d\'Amande',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 410,
    carbs: 54.38,
    fat: 18.10,
    protein: 7.40,
    image: '../assets/images/seed/Graines-oléagineuses/Pâte_d_Amande.jpg',
  },

  {
    name: 'Pâte d\'Arachide',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 589,
    carbs: 10.36,
    fat: 49.70,
    protein: 25.07,
    image: '../assets/images/seed/Graines-oléagineuses/Pâte_d_Arachide.jpg',
  },

  {
    name: 'Pistache Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 568,
    carbs: 17.22,
    fat: 45.97,
    protein: 21.35,
    image: '../assets/images/seed/Graines-oléagineuses/Pistache_Grillée_Salée.jpg',
  },

  {
    name: 'Pistache Grillée Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 571,
    carbs: 17.97,
    fat: 45.97,
    protein: 21.35,
    image: '../assets/images/seed/Graines-oléagineuses/Pistache_Grillée_Sans_Sel.jpg',
  },

  {
    name: 'Pruneau Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 163,
    carbs: 40.00,
    fat: 0.30,
    protein: 2.50,
    image: '../assets/images/seed/Graines-oléagineuses/Pruneau_Sec.jpg',
  },

  {
    name: 'Raisin Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 316,
    carbs: 79.20,
    fat: 0.40,
    protein: 3.30,
    image: '../assets/images/seed/Graines-oléagineuses/Raisin_Sec.jpg',
  },

  {
    name: 'Sésame Graine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 573,
    carbs: 13.76,
    fat: 49.67,
    protein: 17.73,
    image: '../assets/images/seed/Graines-oléagineuses/Sésame_Graine.jpg',
  },

  {
    name: 'Tournesol Graine Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 582,
    carbs: 14.12,
    fat: 49.80,
    protein: 19.33,
    image: '../assets/images/seed/Graines-oléagineuses/Tournesol_Graine_Salée.jpg',
  },
];

export default grainesOleagineuses;