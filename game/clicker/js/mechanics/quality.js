/**
 * Quality System
 * Berechnet und verwaltet die Qualität von hergestellten Gegenständen
 */

import GameState from '../models/gameState.js';

const QualitySystem = {
  // Qualitätsstufen und ihre Wahrscheinlichkeiten
  QUALITY_LEVELS: {
    NORMAL: { name: 'Normal', modifier: 1.0, chance: 50, className: 'quality-normal' },
    GOOD: { name: 'Gut', modifier: 1.25, chance: 25, className: 'quality-good' },
    EXCELLENT: { name: 'Exzellent', modifier: 1.5, chance: 15, className: 'quality-excellent' },
    LEGENDARY: { name: 'Legendär', modifier: 2.0, chance: 10, className: 'quality-legendary' }
  },
  
  // Berechnet die Qualität basierend auf Spielerfertigkeiten und Zufallsfaktoren
  calculateQuality() {
    // Basis-Qualitätschancen anpassen basierend auf Upgrades
    const qualityBonus = GameState.upgrades.materialQuality.effect * 5;
    const playerLevel = GameState.level;
    
    // Zufallsgenerator für Qualitätsbestimmung
    const roll = Math.random() * 100;
    
    // Berechne angepasste Chancen basierend auf Spielerfortschritt
    const legendaryChance = this.QUALITY_LEVELS.LEGENDARY.chance + qualityBonus + (playerLevel * 0.5);
    const excellentChance = this.QUALITY_LEVELS.EXCELLENT.chance + qualityBonus + (playerLevel * 0.75);
    const goodChance = this.QUALITY_LEVELS.GOOD.chance + qualityBonus + (playerLevel * 1);
    
    // Bestimme Qualität basierend auf Zufallswurf
    if (roll < legendaryChance) {
      return this.QUALITY_LEVELS.LEGENDARY;
    } else if (roll < legendaryChance + excellentChance) {
      return this.QUALITY_LEVELS.EXCELLENT;
    } else if (roll < legendaryChance + excellentChance + goodChance) {
      return this.QUALITY_LEVELS.GOOD;
    } else {
      return this.QUALITY_LEVELS.NORMAL;
    }
  },
  
  // Erstellt ein HTML-Element zur Anzeige der Qualität
  createQualityBadge(quality) {
    if (!quality) quality = this.QUALITY_LEVELS.NORMAL;
    
    const span = document.createElement('span');
    span.className = `quality-indicator ${quality.className}`;
    span.textContent = quality.name;
    
    return span;
  },
  
  // Berechnet den Multiplikator für Belohnungen basierend auf Qualität
  getRewardMultiplier(quality) {
    return quality ? quality.modifier : this.QUALITY_LEVELS.NORMAL.modifier;
  },
  
  // Aktualisiert die Qualitätsstatistiken
  trackQualityStats(quality) {
    if (!GameState.stats.quality) {
      GameState.stats.quality = {
        normal: 0,
        good: 0,
        excellent: 0,
        legendary: 0
      };
    }
    
    if (quality === this.QUALITY_LEVELS.NORMAL) {
      GameState.stats.quality.normal++;
    } else if (quality === this.QUALITY_LEVELS.GOOD) {
      GameState.stats.quality.good++;
    } else if (quality === this.QUALITY_LEVELS.EXCELLENT) {
      GameState.stats.quality.excellent++;
    } else if (quality === this.QUALITY_LEVELS.LEGENDARY) {
      GameState.stats.quality.legendary++;
    }
    
    // Prüfen, ob Qualitäts-Achievements erreicht wurden
    this.checkQualityAchievements();
  },
  
  // Prüft, ob bestimmte Qualitäts-Achievements freigeschaltet werden können
  checkQualityAchievements() {
    // Diese Funktion würde Achievement-Prüfungen basierend auf Qualitätsstatistiken durchführen
    // Die Implementierung hängt vom Achievement-System ab
  }
};

export default QualitySystem;
