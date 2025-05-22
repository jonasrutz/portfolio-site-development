/**
 * Recipe Data Model
 * Enthält alle Handwerksrezepte für das Spiel
 */

// Rezeptkategorien
export const RECIPE_CATEGORIES = {
  WEAPONS: {
    id: 'weapons',
    name: 'Waffen',
    description: 'Schwerter, Äxte und andere Waffen',
    icon: 'fa-sword'
  },
  ARMOR: {
    id: 'armor',
    name: 'Rüstungen',
    description: 'Schützende Gegenstände wie Helme, Brustplatten und Schilde',
    icon: 'fa-shield'
  },
  TOOLS: {
    id: 'tools',
    name: 'Werkzeuge',
    description: 'Nützliche Werkzeuge für Handwerker und Abenteurer',
    icon: 'fa-hammer'
  },
  JEWELRY: {
    id: 'jewelry',
    name: 'Schmuck',
    description: 'Wertvolle Schmuckstücke aus edlen Metallen',
    icon: 'fa-gem'
  },
  SPECIAL: {
    id: 'special',
    name: 'Spezial',
    description: 'Besondere Gegenstände mit einzigartigen Eigenschaften',
    icon: 'fa-star'
  }
};

// Schwierigkeitsgrade für Rezepte
export const DIFFICULTY = {
  SIMPLE: 1,   // Sehr einfach herzustellen
  EASY: 2,     // Einfach herzustellen
  MEDIUM: 3,   // Mittlere Schwierigkeit
  HARD: 4,     // Schwer herzustellen
  EXPERT: 5,   // Erfordert Expertise
  MASTER: 6    // Nur für Meister
};

// Definition aller Rezepte
const Recipes = [
  // WAFFEN
  {
    id: 'sword',
    name: 'Eisenschwert',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.EASY,
    materials: { iron: 5 },
    timeNeeded: 10,
    cost: 30,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein einfaches Schwert aus Eisen. Robust und zuverlässig.',
    rewardMultiplier: 1.5,
    experience: 5,
    icon: 'fa-sword'
  },
  {
    id: 'axe',
    name: 'Streitaxt',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.MEDIUM,
    materials: { iron: 7, wood: 3 },
    timeNeeded: 15,
    cost: 45,
    unlocked: true,
    levelRequired: 2,
    description: 'Eine schwere Axt mit großer Durchschlagskraft.',
    rewardMultiplier: 1.7,
    experience: 7,
    icon: 'fa-axe'
  },
  {
    id: 'dagger',
    name: 'Kupferdolch',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.EASY,
    materials: { copper: 4 },
    timeNeeded: 8,
    cost: 25,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein leichter Dolch aus Kupfer. Ideal für schnelle Angriffe.',
    rewardMultiplier: 1.4,
    experience: 4,
    icon: 'fa-dagger'
  },
  {
    id: 'silverSword',
    name: 'Silberschwert',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.HARD,
    materials: { silver: 8, iron: 3 },
    timeNeeded: 20,
    cost: 80,
    unlocked: false,
    levelRequired: 4,
    description: 'Ein elegantes Schwert aus Silber. Besonders effektiv gegen magische Kreaturen.',
    rewardMultiplier: 2.0,
    experience: 12,
    icon: 'fa-sword'
  },
  {
    id: 'mythrilBlade',
    name: 'Mythrilklinge',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.EXPERT,
    materials: { mythril: 8, silver: 4 },
    timeNeeded: 30,
    cost: 200,
    unlocked: false,
    levelRequired: 5,
    description: 'Eine leuchtende Klinge aus dem seltenen Mythril. Extrem scharf und leicht.',
    rewardMultiplier: 2.5,
    experience: 20,
    icon: 'fa-sword'
  },
  {
    id: 'dragonHammer',
    name: 'Drachenhammer',
    category: RECIPE_CATEGORIES.WEAPONS.id,
    difficulty: DIFFICULTY.MASTER,
    materials: { dragonscale: 2, mythril: 5, iron: 10 },
    timeNeeded: 45,
    cost: 350,
    unlocked: false,
    levelRequired: 8,
    description: 'Ein gewaltiger Kriegshammer verziert mit Drachenschuppen. Verursacht verheerende Schäden.',
    rewardMultiplier: 3.0,
    experience: 35,
    icon: 'fa-hammer'
  },
  
  // RÜSTUNGEN
  {
    id: 'shield',
    name: 'Eisenschild',
    category: RECIPE_CATEGORIES.ARMOR.id,
    difficulty: DIFFICULTY.EASY,
    materials: { iron: 8, copper: 3 },
    timeNeeded: 15,
    cost: 50,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein robuster Schild, der guten Schutz bietet.',
    rewardMultiplier: 1.5,
    experience: 6,
    icon: 'fa-shield'
  },
  {
    id: 'helmet',
    name: 'Ritterhelm',
    category: RECIPE_CATEGORIES.ARMOR.id,
    difficulty: DIFFICULTY.MEDIUM,
    materials: { iron: 6, silver: 2 },
    timeNeeded: 12,
    cost: 40,
    unlocked: false,
    levelRequired: 3,
    description: 'Ein solider Helm mit Gesichtsschutz. Schützt vor den meisten Hieben.',
    rewardMultiplier: 1.6,
    experience: 8,
    icon: 'fa-helmet'
  },
  {
    id: 'armor',
    name: 'Plattenrüstung',
    category: RECIPE_CATEGORIES.ARMOR.id,
    difficulty: DIFFICULTY.HARD,
    materials: { iron: 15, silver: 5 },
    timeNeeded: 25,
    cost: 100,
    unlocked: false,
    levelRequired: 5,
    description: 'Eine vollständige Plattenrüstung, die umfassenden Schutz bietet.',
    rewardMultiplier: 2.0,
    experience: 15,
    icon: 'fa-shield-alt'
  },
  {
    id: 'dragonShield',
    name: 'Drachenschild',
    category: RECIPE_CATEGORIES.ARMOR.id,
    difficulty: DIFFICULTY.EXPERT,
    materials: { dragonscale: 3, mythril: 5 },
    timeNeeded: 40,
    cost: 350,
    unlocked: false,
    levelRequired: 10,
    description: 'Ein legendärer Schild, gefertigt aus echten Drachenschuppen. Widersteht sogar magischen Angriffen.',
    rewardMultiplier: 3.0,
    experience: 30,
    icon: 'fa-shield'
  },
  
  // WERKZEUGE
  {
    id: 'pickaxe',
    name: 'Spitzhacke',
    category: RECIPE_CATEGORIES.TOOLS.id,
    difficulty: DIFFICULTY.SIMPLE,
    materials: { iron: 4, wood: 2 },
    timeNeeded: 10,
    cost: 25,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein Standardwerkzeug für Bergarbeiter.',
    rewardMultiplier: 1.3,
    experience: 4,
    icon: 'fa-pickaxe'
  },
  {
    id: 'hoe',
    name: 'Eisenhacke',
    category: RECIPE_CATEGORIES.TOOLS.id,
    difficulty: DIFFICULTY.SIMPLE,
    materials: { iron: 3, wood: 2 },
    timeNeeded: 8,
    cost: 20,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein einfaches Werkzeug für Bauern.',
    rewardMultiplier: 1.2,
    experience: 3,
    icon: 'fa-seedling'
  },
  {
    id: 'smithingHammer',
    name: 'Schmiedehammer',
    category: RECIPE_CATEGORIES.TOOLS.id,
    difficulty: DIFFICULTY.MEDIUM,
    materials: { iron: 5, copper: 2, wood: 1 },
    timeNeeded: 12,
    cost: 35,
    unlocked: true,
    levelRequired: 2,
    description: 'Ein qualitativ hochwertiger Hammer für Schmiedearbeiten.',
    rewardMultiplier: 1.4,
    experience: 5,
    icon: 'fa-hammer'
  },
  {
    id: 'silverChisel',
    name: 'Silbermeißel',
    category: RECIPE_CATEGORIES.TOOLS.id,
    difficulty: DIFFICULTY.MEDIUM,
    materials: { silver: 4, iron: 1 },
    timeNeeded: 15,
    cost: 60,
    unlocked: false,
    levelRequired: 3,
    description: 'Ein präzises Werkzeug für Feinarbeiten und Gravuren.',
    rewardMultiplier: 1.7,
    experience: 10,
    icon: 'fa-chisel'
  },
  
  // SCHMUCK
  {
    id: 'copperRing',
    name: 'Kupferring',
    category: RECIPE_CATEGORIES.JEWELRY.id,
    difficulty: DIFFICULTY.SIMPLE,
    materials: { copper: 2 },
    timeNeeded: 5,
    cost: 15,
    unlocked: true,
    levelRequired: 1,
    description: 'Ein einfacher Ring aus Kupfer.',
    rewardMultiplier: 1.2,
    experience: 3,
    icon: 'fa-ring'
  },
  {
    id: 'silverNecklace',
    name: 'Silberkette',
    category: RECIPE_CATEGORIES.JEWELRY.id,
    difficulty: DIFFICULTY.MEDIUM,
    materials: { silver: 5 },
    timeNeeded: 18,
    cost: 70,
    unlocked: false,
    levelRequired: 3,
    description: 'Eine elegant gearbeitete Kette aus reinem Silber.',
    rewardMultiplier: 1.8,
    experience: 12,
    icon: 'fa-gem'
  },
  {
    id: 'goldRing',
    name: 'Goldring',
    category: RECIPE_CATEGORIES.JEWELRY.id,
    difficulty: DIFFICULTY.HARD,
    materials: { gold: 3, silver: 1 },
    timeNeeded: 20,
    cost: 100,
    unlocked: false,
    levelRequired: 6,
    description: 'Ein kostbarer Ring aus purem Gold.',
    rewardMultiplier: 2.2,
    experience: 18,
    icon: 'fa-ring'
  },
  {
    id: 'mythrilAmulet',
    name: 'Mythril-Amulett',
    category: RECIPE_CATEGORIES.JEWELRY.id,
    difficulty: DIFFICULTY.EXPERT,
    materials: { mythril: 4, silver: 2, gold: 1 },
    timeNeeded: 30,
    cost: 250,
    unlocked: false,
    levelRequired: 8,
    description: 'Ein magisches Amulett, das mit der Kraft des Mythrils durchdrungen ist.',
    rewardMultiplier: 2.5,
    experience: 25,
    icon: 'fa-gem'
  },
  
  // SPEZIAL
  {
    id: 'dragonCrest',
    name: 'Drachenwappen',
    category: RECIPE_CATEGORIES.SPECIAL.id,
    difficulty: DIFFICULTY.MASTER,
    materials: { dragonscale: 2, gold: 3, mythril: 3 },
    timeNeeded: 50,
    cost: 500,
    unlocked: false,
    levelRequired: 12,
    description: 'Ein meisterhaft gearbeitetes Königswappen mit echten Drachenschuppen. Symbolisiert höchste Autorität.',
    rewardMultiplier: 4.0,
    experience: 50,
    icon: 'fa-dragon'
  },
  {
    id: 'enchantedBlade',
    name: 'Verzauberte Klinge',
    category: RECIPE_CATEGORIES.SPECIAL.id,
    difficulty: DIFFICULTY.MASTER,
    materials: { mythril: 10, silver: 5, dragonscale: 1 },
    timeNeeded: 60,
    cost: 600,
    unlocked: false,
    levelRequired: 15,
    description: 'Eine seltene Klinge, die mit elementarer Magie versehen wurde. Leuchtet in einem übernatürlichen Blau.',
    rewardMultiplier: 4.5,
    experience: 60,
    icon: 'fa-fire'
  }
];

export default Recipes;
