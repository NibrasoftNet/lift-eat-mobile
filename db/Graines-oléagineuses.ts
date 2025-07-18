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
    image:
      '../assets/images/seed/graines_oleagineuses/amande_seche_grillee.jpg',
  },

  {
    name: 'Amande Sèche Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 578,
    carbs: 9.3,
    fat: 50.64,
    protein: 21.26,
    image:
      '../assets/images/seed/graines_oleagineuses/amande_seche_naturelle.jpg',
  },

  {
    name: 'Cacahuète Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 585,
    carbs: 10.84,
    fat: 49.66,
    protein: 23.68,
    image:
      '../assets/images/seed/graines_oleagineuses/cacahuete_grillee_salee.jpg',
  },

  {
    name: 'Cacahuète Grillée Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 585,
    carbs: 10.84,
    fat: 49.66,
    protein: 23.68,
    image:
      '../assets/images/seed/graines_oleagineuses/cacahuete_grillee_sans_sel.jpg',
  },

  {
    name: 'Mélange de Fruits Secs Grillés',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 594,
    carbs: 15.44,
    fat: 51.45,
    protein: 17.3,
    image:
      '../assets/images/seed/graines_oleagineuses/melange_de_fruits_secs_grilles.jpg',
  },

  {
    name: 'Noisette Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 628,
    carbs: 5.36,
    fat: 60.75,
    protein: 14.95,
    image: '../assets/images/seed/graines_oleagineuses/noisette_naturelle.jpg',
  },

  {
    name: 'Noix Naturelle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 654,
    carbs: 13.71,
    fat: 65.21,
    protein: 15.23,
    image: '../assets/images/seed/graines_oleagineuses/noix_naturelle.jpg',
  },

  {
    name: 'Noix de Cajou Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 574,
    carbs: 23.9,
    fat: 46.35,
    protein: 15.31,
    image:
      '../assets/images/seed/graines_oleagineuses/noix_de_cajou_grillee_salee.jpg',
  },

  {
    name: 'Noix de Cajou Grillée Non Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 574,
    carbs: 23.9,
    fat: 46.35,
    protein: 15.31,
    image:
      '../assets/images/seed/graines_oleagineuses/noix_de_cajou_grillee_non_salee.jpg',
  },

  {
    name: 'Noix de Coco Sèche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 660,
    carbs: 12.93,
    fat: 64.53,
    protein: 6.88,
    image: '../assets/images/seed/graines_oleagineuses/noix_de_coco_seche.jpg',
  },

  {
    name: "Pâte d'Amande",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 410,
    carbs: 54.38,
    fat: 18.1,
    protein: 7.4,
    image: '../assets/images/seed/graines_oleagineuses/pate_d_amande.jpg',
  },

  {
    name: "Pâte d'Arachide",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 589,
    carbs: 10.36,
    fat: 49.7,
    protein: 25.07,
    image: '../assets/images/seed/graines_oleagineuses/pate_d_arachide.jpg',
  },

  {
    name: 'Pistache Grillée Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 568,
    carbs: 17.22,
    fat: 45.97,
    protein: 21.35,
    image:
      '../assets/images/seed/graines_oleagineuses/pistache_grillee_salee.jpg',
  },

  {
    name: 'Pistache Grillée Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 571,
    carbs: 17.97,
    fat: 45.97,
    protein: 21.35,
    image:
      '../assets/images/seed/graines_oleagineuses/pistache_grillee_sans_sel.jpg',
  },

  {
    name: 'Pruneau Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 163,
    carbs: 40.0,
    fat: 0.3,
    protein: 2.5,
    image: '../assets/images/seed/graines_oleagineuses/pruneau_sec.jpg',
  },

  {
    name: 'Raisin Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 316,
    carbs: 79.2,
    fat: 0.4,
    protein: 3.3,
    image: '../assets/images/seed/graines_oleagineuses/raisin_sec.jpg',
  },

  {
    name: 'Sésame Graine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 573,
    carbs: 13.76,
    fat: 49.67,
    protein: 17.73,
    image: '../assets/images/seed/graines_oleagineuses/sesame_graine.jpg',
  },

  {
    name: 'Tournesol Graine Salée',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 582,
    carbs: 14.12,
    fat: 49.8,
    protein: 19.33,
    image:
      '../assets/images/seed/graines_oleagineuses/tournesol_graine_salee.jpg',
  },
];

export default grainesOleagineuses;
