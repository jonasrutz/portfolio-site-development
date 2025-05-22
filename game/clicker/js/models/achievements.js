/**
 * Achievement Data Model
 * Contains all achievement definitions for the game
 */

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  BEGINNER: {
    id: 'beginner',
    name: 'Anfänger',
    description: 'Errungenschaften für Einsteiger',
    icon: 'fa-star'
  },
  CRAFTING: {
    id: 'crafting',
    name: 'Handwerk',
    description: 'Meistere die Kunst des Schmiedens',
    icon: 'fa-hammer'
  },
  COLLECTOR: {
    id: 'collector',
    name: 'Sammler',
    description: 'Sammle verschiedene Materialien',
    icon: 'fa-cubes'
  },
  ECONOMY: {
    id: 'economy',
    name: 'Wirtschaft',
    description: 'Gold verdienen und ausgeben',
    icon: 'fa-coins'
  },
  PROGRESS: {
    id: 'progress',
    name: 'Fortschritt',
    description: 'Erreiche neue Levels und Meilensteine',
    icon: 'fa-trophy'
  },
  MASTERY: {
    id: 'mastery',
    name: 'Meisterschaft',
    description: 'Zeige deine Expertise als Schmied',
    icon: 'fa-crown'
  },
  SPECIAL: {
    id: 'special',
    name: 'Spezial',
    description: 'Besondere Herausforderungen',
    icon: 'fa-gem'
  },
  HIDDEN: {
    id: 'hidden',
    name: 'Geheim',
    description: 'Versteckte Herausforderungen',
    icon: 'fa-question'
  }
};

// Achievement Types
export const ACHIEVEMENT_TYPES = {
  CLICKS: 'clicks',               // Total clicks
  CRAFTING: 'crafting',           // Items crafted
  MATERIALS: 'materials',         // Materials collected
  UPGRADES: 'upgrades',           // Upgrades purchased
  GOLD: 'gold',                   // Gold earned or accumulated
  EXPERIENCE: 'experience',       // XP earned or accumulated
  LEVEL: 'level',                 // Level reached
  QUALITY: 'quality',             // Quality items crafted
  SESSION: 'session',             // Session time
  SPECIAL: 'special',             // Special requirements
  PATTERNS: 'patterns',           // Click patterns
  COMBINATIONS: 'combinations',   // Specific combinations
  TIME: 'time',                   // Time-related (day/night, etc.)
  SECRET: 'secret'                // Hidden achievements
};

// Define all game achievements
const Achievements = {
  // BEGINNER ACHIEVEMENTS
  clickMaster: {
    id: 'clickMaster',
    name: 'Klick-Meister',
    description: 'Klicke 100 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 100,
    reward: {
      gold: 25,
      experience: 5
    },
    earned: false
  },
  craftingNovice: {
    id: 'craftingNovice',
    name: 'Handwerks-Novize',
    description: 'Stelle 10 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 10,
    reward: {
      gold: 30,
      experience: 8
    },
    earned: false
  },
  materialCollector: {
    id: 'materialCollector',
    name: 'Materialsammler',
    description: 'Sammle insgesamt 500 Materialien',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-cubes',
    requirement: 500,
    reward: {
      gold: 40,
      experience: 10
    },
    earned: false
  },
  upgradeEnthusiast: {
    id: 'upgradeEnthusiast',
    name: 'Upgrade-Enthusiast',
    description: 'Kaufe 5 Upgrades',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.UPGRADES,
    icon: 'fa-arrow-up',
    requirement: 5,
    reward: {
      gold: 50,
      experience: 10
    },
    earned: false
  },
  goldHoarder: {
    id: 'goldHoarder',
    name: 'Goldhorter',
    description: 'Sammle insgesamt 1.000 Gold',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 1000,
    reward: {
      experience: 15
    },
    earned: false
  },
  
  // CLICKING ACHIEVEMENTS
  clickApprentice: {
    id: 'clickApprentice',
    name: 'Klick-Lehrling',
    description: 'Klicke 500 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.BEGINNER.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 500,
    reward: {
      gold: 50,
      experience: 10
    },
    earned: false
  },
  clickJourneyman: {
    id: 'clickJourneyman',
    name: 'Klick-Geselle',
    description: 'Klicke 1.000 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 1000,
    reward: {
      gold: 100,
      experience: 20
    },
    earned: false
  },
  clickAdept: {
    id: 'clickAdept',
    name: 'Klick-Adept',
    description: 'Klicke 5.000 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 5000,
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false
  },
  clickMaster2: {
    id: 'clickMaster2',
    name: 'Klick-Meister II',
    description: 'Klicke 10.000 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 10000,
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false
  },
  clickGrandmaster: {
    id: 'clickGrandmaster',
    name: 'Klick-Großmeister',
    description: 'Klicke 50.000 Mal auf den Hammer',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.CLICKS,
    icon: 'fa-hand-pointer',
    requirement: 50000,
    reward: {
      gold: 1000,
      experience: 200
    },
    earned: false
  },
  
  // CRAFTING ACHIEVEMENTS
  craftingApprentice: {
    id: 'craftingApprentice',
    name: 'Handwerks-Lehrling',
    description: 'Stelle 25 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.CRAFTING.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 25,
    reward: {
      gold: 75,
      experience: 15
    },
    earned: false
  },
  craftingJourneyman: {
    id: 'craftingJourneyman',
    name: 'Handwerks-Geselle',
    description: 'Stelle 50 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.CRAFTING.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 50,
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false
  },
  craftingAdept: {
    id: 'craftingAdept',
    name: 'Handwerks-Adept',
    description: 'Stelle 100 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.CRAFTING.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 100,
    reward: {
      gold: 300,
      experience: 60
    },
    earned: false
  },
  craftingMaster: {
    id: 'craftingMaster',
    name: 'Handwerks-Meister',
    description: 'Stelle 250 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 250,
    reward: {
      gold: 600,
      experience: 120
    },
    earned: false
  },
  craftingGrandmaster: {
    id: 'craftingGrandmaster',
    name: 'Handwerks-Großmeister',
    description: 'Stelle 500 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.CRAFTING,
    icon: 'fa-hammer',
    requirement: 500,
    reward: {
      gold: 1200,
      experience: 240
    },
    earned: false
  },
  
  // Add 90+ more achievements here...
  // MATERIALS ACHIEVEMENTS
  ironCollector: {
    id: 'ironCollector',
    name: 'Eisensammler',
    description: 'Sammle 100 Eisen',
    category: ACHIEVEMENT_CATEGORIES.COLLECTOR.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-cubes',
    requirement: 100,
    requirementType: 'iron',
    reward: {
      gold: 50,
      experience: 10
    },
    earned: false
  },
  copperCollector: {
    id: 'copperCollector',
    name: 'Kupfersammler',
    description: 'Sammle 100 Kupfer',
    category: ACHIEVEMENT_CATEGORIES.COLLECTOR.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-cubes',
    requirement: 100,
    requirementType: 'copper',
    reward: {
      gold: 80,
      experience: 15
    },
    earned: false
  },
  silverCollector: {
    id: 'silverCollector',
    name: 'Silbersammler',
    description: 'Sammle 100 Silber',
    category: ACHIEVEMENT_CATEGORIES.COLLECTOR.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-cubes',
    requirement: 100,
    requirementType: 'silver',
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false
  },
  mythrilCollector: {
    id: 'mythrilCollector',
    name: 'Mythrilsammler',
    description: 'Sammle 50 Mythril',
    category: ACHIEVEMENT_CATEGORIES.COLLECTOR.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-cubes',
    requirement: 50,
    requirementType: 'mythril',
    reward: {
      gold: 300,
      experience: 60
    },
    earned: false
  },
  dragonscaleCollector: {
    id: 'dragonscaleCollector',
    name: 'Drachenschuppensammler',
    description: 'Sammle 25 Drachenschuppen',
    category: ACHIEVEMENT_CATEGORIES.COLLECTOR.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-dragon',
    requirement: 25,
    requirementType: 'dragonscale',
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false
  },
  
  // ECONOMY ACHIEVEMENTS
  saver: {
    id: 'saver',
    name: 'Sparer',
    description: 'Habe 500 Gold gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 500,
    requirementType: 'current',
    reward: {
      experience: 20
    },
    earned: false
  },
  wealthyBeginnings: {
    id: 'wealthyBeginnings',
    name: 'Wohlhabender Anfang',
    description: 'Habe 1.000 Gold gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 1000,
    requirementType: 'current',
    reward: {
      experience: 40
    },
    earned: false
  },
  merchant: {
    id: 'merchant',
    name: 'Händler',
    description: 'Habe 2.500 Gold gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 2500,
    requirementType: 'current',
    reward: {
      experience: 100
    },
    earned: false
  },
  banker: {
    id: 'banker',
    name: 'Banker',
    description: 'Habe 5.000 Gold gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 5000,
    requirementType: 'current',
    reward: {
      experience: 200
    },
    earned: false
  },
  goldMagnate: {
    id: 'goldMagnate',
    name: 'Gold-Magnat',
    description: 'Habe 10.000 Gold gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 10000,
    requirementType: 'current',
    reward: {
      experience: 400
    },
    earned: false
  },
  
  // TOTAL GOLD EARNED
  goldEarner: {
    id: 'goldEarner',
    name: 'Goldverdiener',
    description: 'Verdiene insgesamt 5.000 Gold',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 5000,
    requirementType: 'total',
    reward: {
      experience: 50
    },
    earned: false
  },
  goldTycoon: {
    id: 'goldTycoon',
    name: 'Gold-Tycoon',
    description: 'Verdiene insgesamt 25.000 Gold',
    category: ACHIEVEMENT_CATEGORIES.ECONOMY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 25000,
    requirementType: 'total',
    reward: {
      experience: 250
    },
    earned: false
  },
  goldBaron: {
    id: 'goldBaron',
    name: 'Gold-Baron',
    description: 'Verdiene insgesamt 100.000 Gold',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.GOLD,
    icon: 'fa-coins',
    requirement: 100000,
    requirementType: 'total',
    reward: {
      experience: 1000
    },
    earned: false
  },
  
  // UPGRADE ACHIEVEMENTS
  upgrader: {
    id: 'upgrader',
    name: 'Verbesserer',
    description: 'Kaufe 10 Upgrades',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.UPGRADES,
    icon: 'fa-arrow-up',
    requirement: 10,
    reward: {
      gold: 100,
      experience: 20
    },
    earned: false
  },
  upgradeFanatic: {
    id: 'upgradeFanatic',
    name: 'Upgrade-Fanatiker',
    description: 'Kaufe 25 Upgrades',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.UPGRADES,
    icon: 'fa-arrow-up',
    requirement: 25,
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false
  },
  upgradeAddict: {
    id: 'upgradeAddict',
    name: 'Upgrade-Süchtiger',
    description: 'Kaufe 50 Upgrades',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.UPGRADES,
    icon: 'fa-arrow-up',
    requirement: 50,
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false
  },
  
  // LEVEL ACHIEVEMENTS
  apprenticeBlacksmith: {
    id: 'apprenticeBlacksmith',
    name: 'Schmied-Lehrling',
    description: 'Erreiche Level 5',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.LEVEL,
    icon: 'fa-level-up-alt',
    requirement: 5,
    reward: {
      gold: 200,
      experience: 0
    },
    earned: false
  },
  journeymanBlacksmith: {
    id: 'journeymanBlacksmith',
    name: 'Schmied-Geselle',
    description: 'Erreiche Level 10',
    category: ACHIEVEMENT_CATEGORIES.PROGRESS.id,
    type: ACHIEVEMENT_TYPES.LEVEL,
    icon: 'fa-level-up-alt',
    requirement: 10,
    reward: {
      gold: 500,
      experience: 0
    },
    earned: false
  },
  masterBlacksmith: {
    id: 'masterBlacksmith',
    name: 'Schmiedemeister',
    description: 'Erreiche Level 20',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.LEVEL,
    icon: 'fa-level-up-alt',
    requirement: 20,
    reward: {
      gold: 1000,
      experience: 0
    },
    earned: false
  },
  legendaryBlacksmith: {
    id: 'legendaryBlacksmith',
    name: 'Legendärer Schmied',
    description: 'Erreiche Level 50',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.LEVEL,
    icon: 'fa-level-up-alt',
    requirement: 50,
    reward: {
      gold: 5000,
      experience: 0
    },
    earned: false
  },
  
  // QUALITY ACHIEVEMENTS
  qualityFocus: {
    id: 'qualityFocus',
    name: 'Qualitätsbewusst',
    description: 'Stelle 10 Gegenstände guter Qualität her',
    category: ACHIEVEMENT_CATEGORIES.CRAFTING.id,
    type: ACHIEVEMENT_TYPES.QUALITY,
    icon: 'fa-certificate',
    requirement: 10,
    requirementType: 'good',
    reward: {
      gold: 100,
      experience: 20
    },
    earned: false
  },
  excellencePursuit: {
    id: 'excellencePursuit',
    name: 'Streben nach Exzellenz',
    description: 'Stelle 10 Gegenstände ausgezeichneter Qualität her',
    category: ACHIEVEMENT_CATEGORIES.CRAFTING.id,
    type: ACHIEVEMENT_TYPES.QUALITY,
    icon: 'fa-certificate',
    requirement: 10,
    requirementType: 'excellent',
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false
  },
  legendaryQuest: {
    id: 'legendaryQuest',
    name: 'Legendäre Suche',
    description: 'Stelle 5 Gegenstände legendärer Qualität her',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.QUALITY,
    icon: 'fa-certificate',
    requirement: 5,
    requirementType: 'legendary',
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false
  },
  qualityMaster: {
    id: 'qualityMaster',
    name: 'Meister der Qualität',
    description: 'Stelle 25 Gegenstände legendärer Qualität her',
    category: ACHIEVEMENT_CATEGORIES.MASTERY.id,
    type: ACHIEVEMENT_TYPES.QUALITY,
    icon: 'fa-certificate',
    requirement: 25,
    requirementType: 'legendary',
    reward: {
      gold: 2500,
      experience: 500
    },
    earned: false
  },
  
  // SPECIAL ACHIEVEMENTS
  oneHourPlayed: {
    id: 'oneHourPlayed',
    name: 'Erste Stunde',
    description: 'Spiele das Spiel für eine Stunde',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL.id,
    type: ACHIEVEMENT_TYPES.SESSION,
    icon: 'fa-clock',
    requirement: 60, // in minutes
    reward: {
      gold: 100,
      experience: 25
    },
    earned: false
  },
  dayLongBlacksmith: {
    id: 'dayLongBlacksmith',
    name: 'Tagesschmied',
    description: 'Spiele das Spiel für insgesamt 24 Stunden',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL.id,
    type: ACHIEVEMENT_TYPES.SESSION,
    icon: 'fa-clock',
    requirement: 1440, // in minutes
    reward: {
      gold: 2400,
      experience: 240
    },
    earned: false
  },
  eveningCrafter: {
    id: 'eveningCrafter',
    name: 'Abendschmied',
    description: 'Stelle zwischen 18 und 22 Uhr 10 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL.id,
    type: ACHIEVEMENT_TYPES.SPECIAL,
    icon: 'fa-moon',
    requirement: 10,
    requirementType: 'eveningCrafting',
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false
  },
  morningBlacksmith: {
    id: 'morningBlacksmith',
    name: 'Morgenschmied',
    description: 'Stelle zwischen 6 und 10 Uhr 10 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL.id,
    type: ACHIEVEMENT_TYPES.SPECIAL,
    icon: 'fa-sun',
    requirement: 10,
    requirementType: 'morningCrafting',
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false
  },
  weekendWarrior: {
    id: 'weekendWarrior',
    name: 'Wochenend-Krieger',
    description: 'Spiele am Wochenende und stelle 25 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.SPECIAL.id,
    type: ACHIEVEMENT_TYPES.SPECIAL,
    icon: 'fa-calendar',
    requirement: 25,
    requirementType: 'weekendCrafting',
    reward: {
      gold: 300,
      experience: 60
    },
    earned: false
  },
  
  // ==================== HIDDEN ACHIEVEMENTS ====================
  // These 20 achievements are initially hidden with "???" as name and description
  luckyStrike: {
    id: 'luckyStrike',
    name: '???',
    realName: 'Glückstreffer',
    description: '???',
    realDescription: 'Erhalte bei einem Klick 3x die normalen Ressourcen',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-dice',
    requirement: 1,
    reward: {
      gold: 100,
      experience: 20
    },
    earned: false,
    secret: true
  },
  midnightForger: {
    id: 'midnightForger',
    name: '???',
    realName: 'Mitternachtsschmied',
    description: '???',
    realDescription: 'Schmiede etwas um Mitternacht (00:00 - 01:00)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.TIME,
    icon: 'fa-question',
    realIcon: 'fa-moon',
    requirement: 1,
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false,
    secret: true
  },
  sundayBlacksmith: {
    id: 'sundayBlacksmith',
    name: '???',
    realName: 'Sonntagsschmied',
    description: '???',
    realDescription: 'Stelle am Sonntag 5 Gegenstände her',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.TIME,
    icon: 'fa-question',
    realIcon: 'fa-calendar-day',
    requirement: 5,
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false,
    secret: true
  },
  preciseLevelUp: {
    id: 'preciseLevelUp',
    name: '???',
    realName: 'Exaktes Level-Up',
    description: '???',
    realDescription: 'Erreiche genau die benötigte XP für ein Level-Up ohne Überschuss',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-bullseye',
    requirement: 1,
    reward: {
      gold: 200,
      experience: 0
    },
    earned: false,
    secret: true
  },
  perfectCraft: {
    id: 'perfectCraft',
    name: '???',
    realName: 'Perfekte Herstellung',
    description: '???',
    realDescription: 'Stelle 3 legendäre Gegenstände in Folge her',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.COMBINATIONS,
    icon: 'fa-question',
    realIcon: 'fa-award',
    requirement: 3,
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false,
    secret: true
  },
  speedCrafter: {
    id: 'speedCrafter',
    name: '???',
    realName: 'Schnellschmied',
    description: '???',
    realDescription: 'Stelle 5 Gegenstände in weniger als 1 Minute her',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.COMBINATIONS,
    icon: 'fa-question',
    realIcon: 'fa-fast-forward',
    requirement: 5,
    reward: {
      gold: 300,
      experience: 60
    },
    earned: false,
    secret: true
  },
  luckyNumber7: {
    id: 'luckyNumber7',
    name: '???',
    realName: 'Glückszahl 7',
    description: '???',
    realDescription: 'Habe genau 777 Gold',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-7',
    requirement: 777,
    reward: {
      gold: 777,
      experience: 77
    },
    earned: false,
    secret: true
  },
  patienceTest: {
    id: 'patienceTest',
    name: '???',
    realName: 'Geduldsprobe',
    description: '???',
    realDescription: 'Warte 5 Minuten ohne zu klicken während das Spiel aktiv ist',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-hourglass',
    requirement: 300, // 300 seconds
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false,
    secret: true
  },
  allPossessions: {
    id: 'allPossessions',
    name: '???',
    realName: 'All meine Besitztümer',
    description: '???',
    realDescription: 'Gib all dein Gold aus (mindestens 1000)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-money-bill-wave-alt',
    requirement: 1000,
    reward: {
      gold: 500,
      experience: 100
    },
    earned: false,
    secret: true
  },
  equilibrium: {
    id: 'equilibrium',
    name: '???',
    realName: 'Gleichgewicht',
    description: '???',
    realDescription: 'Habe die gleiche Menge an Gold und Materialien (mindestens 500 von jedem)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-balance-scale',
    requirement: 500,
    reward: {
      gold: 250,
      experience: 50
    },
    earned: false,
    secret: true
  },
  upgradeTier: {
    id: 'upgradeTier',
    name: '???',
    realName: 'Symmetrische Verbesserung',
    description: '???',
    realDescription: 'Bringe alle Upgrades auf die gleiche Stufe (mindestens Stufe 5)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.UPGRADES,
    icon: 'fa-question',
    realIcon: 'fa-th',
    requirement: 5,
    reward: {
      gold: 1000,
      experience: 200
    },
    earned: false,
    secret: true
  },
  evenStevens: {
    id: 'evenStevens',
    name: '???',
    realName: 'Alles gerade Zahlen',
    description: '???',
    realDescription: 'Habe eine gerade Anzahl Gold, Materialien, Level und Klicks gleichzeitig',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-equals',
    requirement: 2,
    reward: {
      gold: 222,
      experience: 22
    },
    earned: false,
    secret: true
  },
  primeSpecimen: {
    id: 'primeSpecimen',
    name: '???',
    realName: 'Primzahl-Experte',
    description: '???',
    realDescription: 'Habe eine Primzahl an Gold (über 100)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-superscript',
    requirement: 1,
    reward: {
      gold: 101,
      experience: 23
    },
    earned: false,
    secret: true
  },
  fibonacci: {
    id: 'fibonacci',
    name: '???',
    realName: 'Fibonacci-Schmied',
    description: '???',
    realDescription: 'Habe eine Fibonacci-Zahl an Gold (mindestens 89)',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-calculator',
    requirement: 89,
    reward: {
      gold: 144,
      experience: 55
    },
    earned: false,
    secret: true
  },
  hammertime: {
    id: 'hammertime',
    name: '???',
    realName: 'Hammertime',
    description: '???',
    realDescription: 'Klicke genau um 04:20 Uhr',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-clock',
    requirement: 1,
    reward: {
      gold: 420,
      experience: 42
    },
    earned: false,
    secret: true
  },
  resourceHacker: {
    id: 'resourceHacker',
    name: '???',
    realName: 'Ressourcen-Hacker',
    description: '???',
    realDescription: 'Sammle in einer Minute mehr als 1000 Ressourcen',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-terminal',
    requirement: 1000,
    reward: {
      gold: 1000,
      experience: 150
    },
    earned: false,
    secret: true
  },
  morningPerson: {
    id: 'morningPerson',
    name: '???',
    realName: 'Morgenmensch',
    description: '???',
    realDescription: 'Spiele das Spiel vor 7 Uhr morgens',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.TIME,
    icon: 'fa-question',
    realIcon: 'fa-sun',
    requirement: 1,
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false,
    secret: true
  },
  nightOwl: {
    id: 'nightOwl',
    name: '???',
    realName: 'Nachteule',
    description: '???',
    realDescription: 'Spiele das Spiel nach 23 Uhr',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.TIME,
    icon: 'fa-question',
    realIcon: 'fa-moon',
    requirement: 1,
    reward: {
      gold: 150,
      experience: 30
    },
    earned: false,
    secret: true
  },
  dragonSlayer: {
    id: 'dragonSlayer',
    name: '???',
    realName: 'Drachentöter',
    description: '???',
    realDescription: 'Sammle mindestens 100 Drachenschuppen',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.MATERIALS,
    icon: 'fa-question',
    realIcon: 'fa-dragon',
    requirement: 100,
    reward: {
      gold: 1000,
      experience: 200
    },
    earned: false,
    secret: true
  },
  ragequit: {
    id: 'ragequit',
    name: '???',
    realName: 'Ragequit',
    description: '???',
    realDescription: 'Schließe das Spiel innerhalb von 5 Sekunden nach einem verlorenen Gegenstand',
    category: ACHIEVEMENT_CATEGORIES.HIDDEN.id,
    type: ACHIEVEMENT_TYPES.SECRET,
    icon: 'fa-question',
    realIcon: 'fa-angry',
    requirement: 1,
    reward: {
      gold: 50,
      experience: 10
    },
    earned: false,
    secret: true
  }
};

export default Achievements;
