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

const fruitsEtJusDeFruits: MealEntry[] = [
  {
    name: 'Abricot',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 48,
    carbs: 11.12,
    fat: 0.39,
    protein: 1.4,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Abricot.jpg',
  },

  {
    name: 'Abricot Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 238,
    carbs: 54.82,
    fat: 0.46,
    protein: 3.65,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Abricot_Sec.jpg',
  },

  {
    name: ' Ananas Frais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 48,
    carbs: 12.63,
    fat: 0.12,
    protein: 0.54,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Ananas_Frais.jpg',
  },

  {
    name: 'Avocat Frais',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 160,
    carbs: 8.53,
    fat: 14.66,
    protein: 2.0,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Avocat_Frais.jpg',
  },

  {
    name: 'Banane',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 89,
    carbs: 22.84,
    fat: 0.33,
    protein: 1.09,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Banane.jpg',
  },

  {
    name: 'Datte',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 275,
    carbs: 65.77,
    fat: 0.45,
    protein: 1.97,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Datte.jpg',
  },

  {
    name: 'Citron',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 29,
    carbs: 5.5,
    fat: 0.3,
    protein: 1.1,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Citron.jpg',
  },

  {
    name: 'Clémentine Mondarine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 44,
    carbs: 11.19,
    fat: 0.19,
    protein: 0.63,
    image:
      '../assets/images/seed/Fruits-et-jus-de-fruits/Clémentine_Mondarine.jpg',
  },

  {
    name: 'Coing',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 57,
    carbs: 15.3,
    fat: 0.1,
    protein: 0.4,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Coing.jpg',
  },

  {
    name: 'Figue de Barbarie',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 41,
    carbs: 9.57,
    fat: 0.51,
    protein: 0.73,
    image:
      '../assets/images/seed/Fruits-et-jus-de-fruits/Figue_de_Barbarie.jpg',
  },

  {
    name: 'Figue Séche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 249,
    carbs: 56.86,
    fat: 0.93,
    protein: 3.3,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Figue_Séche.jpg',
  },

  {
    name: 'Cerise',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 53,
    carbs: 11.2,
    fat: 0.7,
    protein: 1.9,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Cerise.jpg',
  },

  {
    name: 'Melon',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 34,
    carbs: 8.16,
    fat: 0.19,
    protein: 0.84,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Melon.jpg',
  },

  {
    name: 'Fraise',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 32,
    carbs: 7.68,
    fat: 0.3,
    protein: 0.67,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Fraise.jpg',
  },

  {
    name: 'Grenade',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 68,
    carbs: 17.17,
    fat: 0.3,
    protein: 0.95,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Grenade.jpg',
  },

  {
    name: 'Jus de Citron',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 25,
    carbs: 6.63,
    fat: 0.0,
    protein: 0.38,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Jus_de_Citron.jpg',
  },

  {
    name: "Jus D'Orange",
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 45,
    carbs: 10.4,
    fat: 0.2,
    protein: 0.7,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Jus_D_Orange.jpg',
  },

  {
    name: 'Kiwi',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 61,
    carbs: 14.66,
    fat: 0.52,
    protein: 1.14,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Kiwi.jpg',
  },

  {
    name: 'Mangue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 65,
    carbs: 17.0,
    fat: 0.27,
    protein: 0.51,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Mangue.jpg',
  },

  {
    name: 'Figue',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 74,
    carbs: 19.18,
    fat: 0.3,
    protein: 0.75,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Figue.jpg',
  },

  {
    name: 'Mûre Noire',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 43,
    carbs: 9.61,
    fat: 0.49,
    protein: 1.39,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Mûre_Noire.jpg',
  },

  {
    name: 'Nectarine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 49,
    carbs: 11.78,
    fat: 0.46,
    protein: 0.94,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Nectarine.jpg',
  },

  {
    name: 'Nèfle',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 47,
    carbs: 12.14,
    fat: 0.2,
    protein: 0.43,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Nèfle.jpg',
  },

  {
    name: 'Noix de Coco',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 354,
    carbs: 9.82,
    fat: 33.49,
    protein: 3.33,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Noix_de_Coco.jpg',
  },

  {
    name: 'Olive Noire',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 281,
    carbs: 9.36,
    fat: 26.34,
    protein: 1.63,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Olive_Noir.jpg',
  },

  {
    name: 'Olive Verte',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 103,
    carbs: 0.0,
    fat: 11.0,
    protein: 0.9,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Olive_Verte.jpg',
  },

  {
    name: 'Orange Douce',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 40,
    carbs: 11.54,
    fat: 0.21,
    protein: 0.7,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Orange_Douce.jpg',
  },

  {
    name: 'Pamplemousse',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 33,
    carbs: 8.41,
    fat: 0.1,
    protein: 0.69,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Pamplemousse.jpg',
  },

  {
    name: 'Pasteque',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 30,
    carbs: 7.55,
    fat: 0.15,
    protein: 0.61,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Pasteque.jpg',
  },

  {
    name: 'Pêche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 39,
    carbs: 9.54,
    fat: 0.25,
    protein: 0.91,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Pêche.jpg',
  },

  {
    name: 'Poire',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 58,
    carbs: 15.46,
    fat: 0.12,
    protein: 0.38,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Poire.jpg',
  },

  {
    name: 'Pomme',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 43,
    carbs: 12.3,
    fat: 0.0,
    protein: 0.3,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Pomme.jpg',
  },

  {
    name: 'Prune',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 46,
    carbs: 11.42,
    fat: 0.28,
    protein: 0.7,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Prune.jpg',
  },

  {
    name: 'Raisin',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 65,
    carbs: 17.39,
    fat: 0.72,
    protein: 0.72,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Raisin.jpg',
  },

  {
    name: 'Rhubarbe',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 11,
    carbs: 1.9,
    fat: 0.1,
    protein: 0.6,
    image: '../assets/images/seed/Fruits-et-jus-de-fruits/Rhubarbe.jpg',
  },
];

export default fruitsEtJusDeFruits;
