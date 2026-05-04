#!/usr/bin/env node
/**
 * gen-catalog.js
 * Generates catalog.json with 260 canonical plants.
 */

const fs = require('fs');
const path = require('path');

// ── 1. Canonical plant list ──────────────────────────────────────────────────
const CANONICAL = [
  'ABELIA', 'ABETO', 'ACER JAPONICO', 'ACHIRA', 'AGAPANTO', 'AGATEA', 'AGAVE', 'AJI',
  'ALAMO', 'ALBAHACA', 'ALEGRIA DEL HOGAR', 'ALEGRIA DOBLE', 'ALEGRIA NUEVA GUINEA',
  'ALELI', 'ALGARROBO', 'ALISSUM', 'ALMENDRO', 'ALOCASIA', 'ALOE VERA', 'ALSTROEMERIA',
  'AMARYLLIS', 'ANEMONA', 'ANIGOZANTHO', 'ANISODONTEA', 'ANTURIO', 'APHELANDRA',
  'AQUILEGIA', 'ARALIA', 'ARANDANO', 'ARGYRANTHEMUM', 'ARMERIA', 'ARRAYAN',
  'ARREGLO FLORAL', 'ASPIDISTRA', 'ASPLENIUM', 'ASTER', 'AUCUBA', 'AZALEA', 'BACOPA',
  'BANANERO', 'BEGONIA', 'BELLOTO', 'BENJAMINA', 'BIDENS', 'BIGNONIA', 'BOJ', 'BOLDO',
  'BOUGAMBILIA', 'BRACHYCHITON', 'BRACHYSCOME', 'BUDDLEJA', 'CACTUS', 'CALA', 'CALADIUM',
  'CALAMANDRINA', 'CALATHEA', 'CALCEOLARIA', 'CALENDULA', 'CALIBRACHOA', 'CALLE',
  'CALLISIA', 'CALOCEPHALUS', 'CAMELIA', 'CANELO', 'CARDENAL', 'CAREX', 'CEANOTHUS',
  'CEDRO', 'CEDRON', 'CELOSIA', 'CEREZO', 'CHAMADOREA', 'CHILCO', 'CHOISYA', 'CIBOULETTE',
  'CILANTRO', 'CINERARIA', 'CINTA', 'CIRUELO', 'CISSUS', 'CITRICO', 'CLAVEL',
  'CLAVELINA', 'CLAVELON', 'CLEMATIDES', 'COLEUS', 'CONVOLVULUS', 'COPROSMA', 'COREOPSIS',
  'CORREA', 'COTONEASTER', 'COTULA', 'CRESPON', 'CRISANTEMO', 'CROCUS', 'CROTON',
  'CUPHEA', 'CYCA', 'CYCLAMEN', 'DALIA', 'DIANTHUS', 'DIETES', 'DIFFENBACHIA',
  'DIGITALIS', 'DIOSMA', 'DIPLADENIA', 'DRACENA', 'DURAZNO', 'ECHEVERIA', 'ECHINACEA',
  'EQUISETUM', 'ESCALONIA', 'ESPARRAGUERA', 'ESPINO', 'EUCALYPTUS', 'EUGENIA', 'EXACUM',
  'FICUS', 'FICUS ALI', 'FRAMBUESA', 'FRUTILLA', 'FUCSIA', 'GALLARDIA', 'GARDENIA',
  'GAURA', 'GAZANIA', 'GERANIO', 'GERBERA', 'GEUM', 'GIRASOL', 'GLOXINIA', 'GOMERO',
  'HEBE', 'HELECHO', 'HELIOTROPO', 'HELLEBORUS', 'HEMEROCALLIS', 'HEUCHERA', 'HIBISCO',
  'HIEDRA', 'HORTENSIA', 'HYPOESTES', 'INCIENSO', 'IRIS', 'JACARANDA', 'JACINTO',
  'JADE', 'JAZMIN', 'JUNCUS', 'JUNIPERO', 'KALANCHOE', 'KENTIA', 'KOKEDAMA', 'KUMQUAT',
  'LAMIUM', 'LANTANA', 'LAUREL', 'LAURENTINA', 'LAVANDA', 'LEPTOSPERMUM', 'LEUCANTHEMUM',
  'LEUCOPHYTA', 'LIGUSTRINA', 'LIGUSTRO', 'LILIUM', 'LIMON', 'LIMONIUM', 'LIQUIDAMBAR',
  'LISIANTHUS', 'LITHODORA', 'LOBELIA', 'LONICERA', 'LYSIMACHIA', 'MADRONO', 'MAGNOLIO',
  'MAITEN', 'MANDARINO', 'MANZANO', 'MARANTA', 'MARIGOLD', 'MELISA', 'MEMBRILLO',
  'MENTA', 'MIOPORO', 'MONSTERA', 'MURTA', 'MUSA', 'NANDINA', 'NARANJO', 'NARCISO',
  'NEANTHE', 'NICOLAI', 'NOGAL', 'OLIVO', 'OREGANO', 'ORNITHOGALUM', 'ORQUIDEA',
  'OSMANTHUS', 'OSTEOSPERMUM', 'PALMERA ABANICO', 'PALMERA ARECA', 'PALMERA COCOS PLUMOSA',
  'PALMERA KENTIA', 'PALMERA NEANTHE BELLA', 'PALO DE AGUA', 'PAPIRO', 'PAQUERETTE',
  'PARKINSONIA', 'PASSIFLORA', 'PATA DE GUANACO', 'PATA DE JAIBA', 'PELARGONIO',
  'PENNISETUM', 'PEPEROMIA', 'PERAL', 'PEREJIL', 'PEROVSKIA', 'PETUNIA', 'PEUMO',
  'PHILODENDRO', 'PILEA', 'PIMENTON', 'PINO', 'PITOSPORO', 'PLATYCODON', 'PLECTRANTHUS',
  'PLUMBAGO', 'POINSETTIA', 'POMELO', 'POTHUS', 'PRIMULA', 'QUEBRACHO', 'QUILLAY',
  'RANUNCULO', 'RHAPHIDOPHORA', 'RHUS', 'ROBLE', 'RODODENDRO', 'ROMERO', 'ROSA',
  'ROSARIO', 'RUDA', 'SALVIA', 'SANSEVIERIA', 'SARCOCOCCA', 'SAXIFRAGA', 'SCHEFFLERA',
  'SCINDAPSUS', 'SEDUM', 'SELAGINELLA', 'SENECIO', 'SOLANUM', 'SPATHIPHYLLUM',
  'STENOCARPO', 'STEPHANOTIS', 'STIPA', 'STRELITZIA', 'SUCULENTA', 'SYNGONIO', 'TAGETE',
  'TANGELO', 'TARA', 'TAXUS', 'THUJA', 'TILO', 'TOBIRA', 'TOMATE', 'TOMILLO',
  'TORONJIL', 'TRADESCANTIA', 'TULIPAN', 'TULIPERO', 'VERBENA', 'VERONICA', 'VINCA',
  'VIOLA', 'WESTRINGIA', 'YUCA', 'YUCCA',
];

// ── 2. Overrides: canonical → folderSlug ────────────────────────────────────
const OVERRIDES = {
  'ALEGRIA DEL HOGAR': 'IMPATIENS',
  'ALEGRIA DOBLE': 'IMPATIENS_DOBLE',
  'ALEGRIA NUEVA GUINEA': 'NEW_GUINEA',
  'ALOE VERA': 'ALOE',
  'AMARYLLIS': 'AMARILIS',
  'ANIGOZANTHO': 'ANIGOZANTO',
  'AQUILEGIA': 'AGUILEÑA',
  'ARREGLO FLORAL': null,
  'DURAZNO': 'DURAZNERO',
  'ECHINACEA': 'EQUINACEA',
  'ESCALONIA': 'ESCALLONIA',
  'FICUS ALI': null,
  'HELLEBORUS': null,
  'MADRONO': 'MADROÑO',
  'MAGNOLIO': 'MAGNOLIA',
  'MURTA': 'MURTILLA',
  'ORNITHOGALUM': 'ORNITOGALO',
  'PALMERA ABANICO': 'WASHINGTONIA',
  'PALMERA ARECA': null,
  'PALMERA COCOS PLUMOSA': null,
  'PALMERA KENTIA': null,
  'PALMERA NEANTHE BELLA': 'CHAMADOREA',
  'PALO DE AGUA': null,
  'ORQUIDEA': 'PHALAENOPSIS',
  'CALLE': null,
  'CARDENAL': null,
  'ESPINO': null,
  'LAURENTINA': null,
  'NEANTHE': 'CHAMADOREA',
  'NICOLAI': null,
  'PAPIRO': null,
  'PARKINSONIA': null,
  'PATA DE GUANACO': null,
  'PATA DE JAIBA': null,
  'QUEBRACHO': null,
  'QUILLAY': null,
  'STENOCARPO': null,
  'STIPA': null,
  'TARA': null,
};

// ── 3. Interior plants set ───────────────────────────────────────────────────
const INTERIOR_SET = new Set([
  'ALOCASIA', 'ANTURIO', 'APHELANDRA', 'ASPIDISTRA', 'CALATHEA', 'CALLISIA',
  'CHAMADOREA', 'CINTA', 'CISSUS', 'CROTON', 'DIFFENBACHIA', 'DRACENA', 'EXACUM',
  'FICUS', 'FICUS ALI', 'GLOXINIA', 'HELECHO', 'HIEDRA', 'HYPOESTES', 'JADE',
  'KENTIA', 'MARANTA', 'MONSTERA', 'NEANTHE', 'NICOLAI', 'ORQUIDEA', 'PALMERA KENTIA',
  'PALMERA NEANTHE BELLA', 'PEPEROMIA', 'PHILODENDRO', 'PILEA', 'POTHUS',
  'RHAPHIDOPHORA', 'SANSEVIERIA', 'SCHEFFLERA', 'SCINDAPSUS', 'SELAGINELLA',
  'SYNGONIO', 'SPATHIPHYLLUM',
]);

// ── 4. Helpers ───────────────────────────────────────────────────────────────
function normalizeForSlug(str) {
  // Remove diacritics, uppercase, spaces→_, keep letters and underscores
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\s+/g, '_');
}

function toId(str) {
  // lowercase, spaces→hyphens, remove diacritics
  return str
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function normalize(str) {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
}

// ── 5. Load plantas.json for group/subrubro lookup ───────────────────────────
const plantasRaw = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'plantas.json'), 'utf8')
);

// Build lookup: first word (normalized) → { grupo, subrubro }
const plantasByFirstWord = {};
for (const p of plantasRaw) {
  const normalizedName = normalize(p.nombre);
  const firstWord = normalizedName.split(/\s+/)[0];
  if (!plantasByFirstWord[firstWord]) {
    plantasByFirstWord[firstWord] = { grupo: p.grupo, subrubro: p.subrubro };
  }
}

function lookupGrupoSubrubro(canonicalName) {
  // First check if in interior set
  const subrubro = INTERIOR_SET.has(canonicalName)
    ? 'PLANTAS DE INTERIOR'
    : 'PLANTAS DE EXTERIOR';

  // Try matching by first word of canonical
  const firstWord = normalize(canonicalName.split(/\s+/)[0]);
  const match = plantasByFirstWord[firstWord];

  if (match) {
    return { grupo: match.grupo, subrubro: match.subrubro };
  }

  // Default grupo based on subrubro
  const defaultGrupo = INTERIOR_SET.has(canonicalName)
    ? 'PLANTA INTERIOR FOLL'
    : 'ARBUSTIVA FOLLAJE';

  return { grupo: defaultGrupo, subrubro };
}

// ── 6. Check image existence ─────────────────────────────────────────────────
const PLANTAS_DIR = path.join(__dirname, '..', 'public', 'plantas');

function getFotoUrl(folderSlug) {
  if (!folderSlug) return null;
  const imgPath = path.join(PLANTAS_DIR, folderSlug, 'image.webp');
  if (fs.existsSync(imgPath)) {
    return `plantas/${folderSlug}/image.webp`;
  }
  return null;
}

// ── 7. Build catalog entries ─────────────────────────────────────────────────
let conImagen = 0;
let sinImagen = 0;

const catalog = CANONICAL.map((nombre) => {
  // Determine folderSlug
  let folderSlug;
  if (Object.prototype.hasOwnProperty.call(OVERRIDES, nombre)) {
    folderSlug = OVERRIDES[nombre]; // may be null
  } else {
    folderSlug = normalizeForSlug(nombre);
  }

  const fotoUrl = getFotoUrl(folderSlug);
  if (fotoUrl) conImagen++;
  else sinImagen++;

  const { grupo, subrubro } = lookupGrupoSubrubro(nombre);
  const id = toId(nombre);

  // fotoPlaceholder: warm hsl for exterior, cool for interior
  const isInterior = subrubro === 'PLANTAS DE INTERIOR';
  const fotoPlaceholder = isInterior
    ? 'hsl(150 18% 92%)'
    : 'hsl(80 22% 90%)';

  return {
    id,
    nombre,
    folderSlug,
    fotoUrl,
    subrubro,
    grupo,
    fotoPlaceholder,
  };
});

// ── 8. Sort A-Z by nombre ────────────────────────────────────────────────────
catalog.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));

// ── 9. Save ──────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, 'catalog.json');
fs.writeFileSync(outPath, JSON.stringify(catalog, null, 2), 'utf8');

console.log('✅ catalog.json generado');
console.log(`   Total:      ${catalog.length} plantas`);
console.log(`   Con imagen: ${conImagen}`);
console.log(`   Sin imagen: ${sinImagen}`);
console.log(`   Guardado en: ${outPath}`);
