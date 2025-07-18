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
    image: '../assets/images/seed/cereales_et_pates/amidon_de_mais.jpg',
  },

  {
    name: 'Biscotte Toast',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 390,
    carbs: 76.6,
    fat: 6.3,
    protein: 12.1,
    image: '../assets/images/seed/cereales_et_pates/biscotte_toast.jpg',
  },

  {
    name: 'Toast Sans Sel',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 390,
    carbs: 76.6,
    fat: 6.3,
    protein: 12.1,
    image: '../assets/images/seed/cereales_et_pates/toast_sans_sel.jpg',
  },

  {
    name: 'Blé en Graines',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 327,
    carbs: 65.68,
    fat: 1.54,
    protein: 12.61,
    image: '../assets/images/seed/cereales_et_pates/ble_en_graines.jpg',
  },

  {
    name: 'Brioche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 406,
    carbs: 45.8,
    fat: 21.0,
    protein: 8.2,
    image: '../assets/images/seed/cereales_et_pates/brioche.jpg',
  },

  {
    name: 'Couscous Sec',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 350,
    carbs: 73.98,
    fat: 1.5,
    protein: 13.44,
    image: '../assets/images/seed/cereales_et_pates/couscous_sec.jpg',
  },

  {
    name: 'Farine Blanche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 364,
    carbs: 74.7,
    fat: 1.2,
    protein: 11.0,
    image: '../assets/images/seed/cereales_et_pates/farine_blanche.jpg',
  },

  {
    name: 'Farine Orge',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 380,
    carbs: 76.0,
    fat: 4.0,
    protein: 12.0,
    image: '../assets/images/seed/cereales_et_pates/farine_orge.jpg',
  },

  {
    name: 'Maïs Graines Séche',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 365,
    carbs: 74.26,
    fat: 4.74,
    protein: 9.42,
    image: '../assets/images/seed/cereales_et_pates/mais_graines_seche.jpg',
  },

  {
    name: 'Orge Perlé Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 352,
    carbs: 77.72,
    fat: 1.16,
    protein: 9.91,
    image: '../assets/images/seed/cereales_et_pates/orge_perle_cru.jpg',
  },

  {
    name: 'Pain au Chocolat',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 418,
    carbs: 44.05,
    fat: 24.43,
    protein: 8.41,
    image: '../assets/images/seed/cereales_et_pates/pain_au_chocolat.jpg',
  },

  {
    name: 'Pain de Mie(Beba)',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 269,
    carbs: 50.0,
    fat: 3.85,
    protein: 7.69,
    image: '../assets/images/seed/cereales_et_pates/pain_de_mie_beba.jpg',
  },

  {
    name: 'Pain Baguette',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 274,
    carbs: 51.9,
    fat: 3.0,
    protein: 8.8,
    image: '../assets/images/seed/cereales_et_pates/pain_baguette.jpg',
  },

  {
    name: 'Pain Complet',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 250,
    carbs: 46.4,
    fat: 3.8,
    protein: 10.0,
    image: '../assets/images/seed/cereales_et_pates/pain_complet.jpg',
  },

  {
    name: 'Pain Mbassess',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 305,
    carbs: 49.31,
    fat: 7.85,
    protein: 8.36,
    image: '../assets/images/seed/cereales_et_pates/pain_mbassess.jpg',
  },

  {
    name: 'Pain Mlaoui',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 262,
    carbs: 44.26,
    fat: 5.68,
    protein: 7.1,
    image: '../assets/images/seed/cereales_et_pates/pain_mlaoui.jpg',
  },

  {
    name: 'Pain Orge',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 233,
    carbs: 46.06,
    fat: 2.4,
    protein: 7.94,
    image: '../assets/images/seed/cereales_et_pates/pain_orge.jpg',
  },

  {
    name: 'Pain Tabouna',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 244,
    carbs: 44.53,
    fat: 3.16,
    protein: 8.01,
    image: '../assets/images/seed/cereales_et_pates/pain_tabouna.jpg',
  },

  {
    name: 'Pain Tajine',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 266,
    carbs: 44.16,
    fat: 5.63,
    protein: 8.15,
    image: '../assets/images/seed/cereales_et_pates/pain_tajine.jpg',
  },

  {
    name: 'Pâtes Alimentaire Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 371,
    carbs: 74.69,
    fat: 1.58,
    protein: 12.78,
    image: '../assets/images/seed/cereales_et_pates/pates_alimentaire_cru.jpg',
  },

  {
    name: 'Pâte Feuilletée Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 551,
    carbs: 45.1,
    fat: 38.1,
    protein: 7.3,
    image: '../assets/images/seed/cereales_et_pates/pate_feuilletee_cru.jpg',
  },

  {
    name: 'Riz Cru',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 360,
    carbs: 79.34,
    fat: 0.58,
    protein: 6.61,
    image: '../assets/images/seed/cereales_et_pates/riz_cru.jpg',
  },

  {
    name: 'Farine de Semoule',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 360,
    carbs: 72.83,
    fat: 1.05,
    protein: 12.68,
    image: '../assets/images/seed/cereales_et_pates/farine_de_semoule.jpg',
  },

  {
    name: 'Dro3',
    unit: MealUnitEnum.GRAMMES,
    quantity: 100,
    calories: 339,
    carbs: 66.03,
    fat: 3.3,
    protein: 11.3,
    image: '../assets/images/seed/cereales_et_pates/dro3.jpg',
  },
];

export default cerealesEtPates;
