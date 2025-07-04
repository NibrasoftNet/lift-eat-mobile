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

const cerealesEtPates: MealEntry[] = [
  {
    name: 'Amidon de Maïs',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 381,
    carbs: 91.27,
    fat: 0.05,
    protein: 0.26,
    image: '../assets/images/seed/Céréales-et-Pâtes/Amidon_de_Maïs.jpg',
  },

  {
    name: 'Biscotte Toast',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 390,
    carbs: 76.60,
    fat: 6.30,
    protein: 12.10,
    image: '../assets/images/seed/Céréales-et-Pâtes/Biscotte_Toast.jpg',
  },

  {
    name: 'Toast Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 390,
    carbs: 76.60,
    fat: 6.30,
    protein: 12.10,
    image: '../assets/images/seed/Céréales-et-Pâtes/Toast_Sans_Sel.jpg',
  },

  {
    name: 'Blé en Graines',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 327,
    carbs: 65.68,
    fat: 1.54,
    protein: 12.61,
    image: '../assets/images/seed/Céréales-et-Pâtes/Blé_en_Graines.jpg',
  },

  {
    name: 'Brioche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 406,
    carbs: 45.80,
    fat: 21.00,
    protein: 8.20,
    image: '../assets/images/seed/Céréales-et-Pâtes/Brioche.jpg',
  },

  {
    name: 'Couscous Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 350,
    carbs: 73.98,
    fat: 1.50,
    protein: 13.44,
    image: '../assets/images/seed/Céréales-et-Pâtes/Couscous_Sec.jpg',
  },

  {
    name: 'Farine Blanche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 364,
    carbs: 74.70,
    fat: 1.20,
    protein: 11.00,
    image: '../assets/images/seed/Céréales-et-Pâtes/Farine_Blanche.jpg',
  },

  {
    name: 'Farine Orge',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 380,
    carbs: 76.00,
    fat: 4.00,
    protein: 12.00,
    image: '../assets/images/seed/Céréales-et-Pâtes/Farine Orge.jpg',
  },

  {
    name: 'Maïs Graines Séche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 365,
    carbs: 74.26,
    fat: 4.74,
    protein: 9.42,
    image: '../assets/images/seed/Céréales-et-Pâtes/Maïs_Graines_Séche.jpg',
  },

  {
    name: 'Orge Perlé Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 352,
    carbs: 77.72,
    fat: 1.16,
    protein: 9.91,
    image: '../assets/images/seed/Céréales-et-Pâtes/Orge_Perlé_Cru.jpg',
  },

  {
    name: 'Pain au Chocolat',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 418,
    carbs: 44.05,
    fat: 24.43,
    protein: 8.41,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_au_Chocolat.jpg',
  },

  {
    name: 'Pain de Mie(Beba)',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 269,
    carbs: 50.00,
    fat: 3.85,
    protein: 7.69,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_de_Mie(Beba).jpg',
  },

  {
    name: 'Pain Baguette',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 274,
    carbs: 51.90,
    fat: 3.00,
    protein: 8.80,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Baguette.jpg',
  },

  {
    name: 'Pain Complet',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 250,
    carbs: 46.40,
    fat: 3.80,
    protein: 10.00,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Complet.jpg',
  },

  {
    name: 'Pain Mbassess',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 305,
    carbs: 49.31,
    fat: 7.85,
    protein: 8.36,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Mbassess.jpg',
  },

  {
    name: 'Pain Mlaoui',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 262,
    carbs: 44.26,
    fat: 5.68,
    protein: 7.10,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Mlaoui.jpg',
  },

  {
    name: 'Pain Orge',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 233,
    carbs: 46.06,
    fat: 2.40,
    protein: 7.94,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Orge.jpg',
  },

  {
    name: 'Pain Tabouna',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 244,
    carbs: 44.53,
    fat: 3.16,
    protein: 8.01,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Tabouna.jpg',
  },

  {
    name: 'Pain Tajine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 266,
    carbs: 44.16,
    fat: 5.63,
    protein: 8.15,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pain_Tajine.jpg',
  },

  {
    name: 'Pâtes Alimentaire Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 371,
    carbs: 74.69,
    fat: 1.58,
    protein: 12.78,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pâtes_Alimentaire_Cru.jpg',
  },

  {
    name: 'Pâte Feuilletée Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 551,
    carbs: 45.10,
    fat: 38.10,
    protein: 7.30,
    image: '../assets/images/seed/Céréales-et-Pâtes/Pâte_Feuilletée_Cru.jpg',
  },

  {
    name: 'Riz Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 360,
    carbs: 79.34,
    fat: 0.58,
    protein: 6.61,
    image: '../assets/images/seed/Céréales-et-Pâtes/Riz_Cru.jpg',
  },

  {
    name: 'Farine de Semoule',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 360,
    carbs: 72.83,
    fat: 1.05,
    protein: 12.68,
    image: '../assets/images/seed/Céréales-et-Pâtes/Farine_de_Semoule.jpg',
  },

  {
    name: 'Dro3',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 339,
    carbs: 66.03,
    fat: 3.30,
    protein: 11.30,
    image: '../assets/images/seed/Céréales-et-Pâtes/Dro3.jpg',
  },
]

export default cerealesEtPates;
