/**
 * Maps plant folder slug → video filename (no extension).
 * Only plants that have a corresponding .mp4 in /public/videos/.
 */
export const PLANT_VIDEO_MAP: Record<string, string> = {
  ABEDUL:               'abedul',
  ABELIA:               'abelia',
  ABETO:                'abeto',
  ACER_JAPONICO:        'acer',
  ACER_PALMADO:         'maple',
  ACHIRA:               'cana',
  AGAPANTO:             'agapanto',
  BEGONIA:              'begonia',
  CHAMADOREA:           'chamaedorea',
  CHILE_ORNAMENTAL:     'chile',
  IMPATIENS:            'impatiens',
  IMPATIENS_DOBLE:      'impatiens-doble',
  MARGARITA_AZUL:       'margarita',
  NANDINA:              'nandina',
  NARCISO:              'narciso',
  NARANJO:              'naranjo',
  NEW_GUINEA:           'new-guinea',
  NOGAL:                'nogal',
  OLIVO:                'olivo',
  OREGANO:              'oregano',
  ORNITOGALO:           'ornitogalo',
  OSMANTHUS:            'osmanthus',
  OSTEOSPERMUM:         'osteospermum',
  PHALAENOPSIS:         'orquidea',
  WASHINGTONIA:         'washingtonia',
};

/** Derive folder slug from a plant's fotoUrl ("plantas/ABELIA/image.webp" → "ABELIA") */
export function slugFromFotoUrl(fotoUrl?: string): string | undefined {
  if (!fotoUrl) return undefined;
  return fotoUrl.split('/')[1];
}

/** Get video filename for a plant, or undefined if none exists. */
export function getPlantVideo(fotoUrl?: string): string | undefined {
  const slug = slugFromFotoUrl(fotoUrl);
  if (!slug) return undefined;
  return PLANT_VIDEO_MAP[slug];
}

/** Get video filename directly from a folder slug (used by catalog entries). */
export function getPlantVideoBySlug(folderSlug?: string | null): string | undefined {
  if (!folderSlug) return undefined;
  return PLANT_VIDEO_MAP[folderSlug];
}
