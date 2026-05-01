import type { GrupoCuidado } from '@/types/data';
import type { IconName } from './icons';

export const GRUPO_ICON: Record<GrupoCuidado, IconName> = {
  'HERBACEAS PERENES': 'flower2',
  'ARBUSTIVA DE FLOR': 'flower',
  'PLANTA INTERIOR FOLL': 'leaf',
  'PLANTA INTERIOR FLOR': 'flower',
  'PLANTA INTERIOR COLG': 'leaf',
  'PLANTIN PRIMAV/VERAN': 'sprout',
  'PLANTIN OTOÑ/INVIER': 'sprout',
  'ARBUSTIVA FOLLAJE': 'leaf',
  'ARBUSTIVA TREPADORAS': 'leaf',
  'ARBOLES FOLLAJE': 'tree',
  'ARBOLES FRUTALES': 'fruit',
  'ARBOLES PALMERAS': 'palm',
  'HERBACEAS CACTUS': 'wheat',
  'HERBACEAS AROMÁTICAS': 'leaf',
  'FLORALES': 'flower',
  'PLANTA INTERIOR CORT': 'leaf',
};

export const GRUPO_LABEL: Record<GrupoCuidado, string> = {
  'HERBACEAS PERENES': 'Herbáceas perennes',
  'ARBUSTIVA DE FLOR': 'Arbustivas de flor',
  'PLANTA INTERIOR FOLL': 'Interior follaje',
  'PLANTA INTERIOR FLOR': 'Interior con flor',
  'PLANTA INTERIOR COLG': 'Interior colgantes',
  'PLANTIN PRIMAV/VERAN': 'Plantines primavera/verano',
  'PLANTIN OTOÑ/INVIER': 'Plantines otoño/invierno',
  'ARBUSTIVA FOLLAJE': 'Arbustivas de follaje',
  'ARBUSTIVA TREPADORAS': 'Trepadoras',
  'ARBOLES FOLLAJE': 'Árboles de follaje',
  'ARBOLES FRUTALES': 'Árboles frutales',
  'ARBOLES PALMERAS': 'Palmeras',
  'HERBACEAS CACTUS': 'Cactus y suculentas',
  'HERBACEAS AROMÁTICAS': 'Aromáticas',
  'FLORALES': 'Florales',
  'PLANTA INTERIOR CORT': 'Interior gran porte',
};
