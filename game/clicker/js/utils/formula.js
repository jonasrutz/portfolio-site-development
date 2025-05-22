/**
 * Formel-Hilfsfunktionen
 * Berechnungen und mathematische Hilfsfunktionen für das Spiel
 */

const Formula = {
  /**
   * Berechnet erforderliche Erfahrungspunkte für einen Level-Anstieg
   * @param {number} level - Aktuelles Level
   * @return {number} Benötigte XP für das nächste Level
   */
  experienceForNextLevel(level) {
    return Math.floor(10 * Math.pow(level, 1.5));
  },
  
  /**
   * Berechnet den Ressourcengewinn basierend auf Level und Multiplikatoren
   * @param {number} baseAmount - Grundbetrag
   * @param {number} level - Spielerlevel
   * @param {number} multiplier - Multiplikator aus Upgrades
   * @param {number} qualityBonus - Qualitätsbonus (optional)
   * @return {number} Berechneter Ressourcengewinn
   */
  calculateResourceGain(baseAmount, level, multiplier, qualityBonus = 1) {
    const levelBonus = 1 + (level * 0.05);
    return Math.floor(baseAmount * levelBonus * multiplier * qualityBonus);
  },
  
  /**
   * Berechnet die Wahrscheinlichkeit für einen kritischen Treffer
   * @param {number} level - Spielerlevel
   * @param {number} skillBonus - Bonus aus Fertigkeiten
   * @return {number} Wahrscheinlichkeit zwischen 0 und 1
   */
  criticalHitChance(level, skillBonus) {
    const baseChance = 0.05; // Basis 5%
    const levelBonus = level * 0.005; // 0.5% pro Level
    
    return Math.min(0.5, baseChance + levelBonus + skillBonus); // Max 50%
  },
  
  /**
   * Berechnet die Kosten für ein Upgrade basierend auf Level
   * @param {number} basePrice - Grundpreis
   * @param {number} level - Aktuelles Level des Upgrades
   * @param {number} growthRate - Wachstumsrate (default: 1.5)
   * @return {number} Berechneter Preis
   */
  upgradePrice(basePrice, level, growthRate = 1.5) {
    return Math.floor(basePrice * Math.pow(growthRate, level - 1));
  },
  
  /**
   * Berechnet die Handwerkszeit mit Berücksichtigung von Boni
   * @param {number} baseTime - Basisdauer in Sekunden
   * @param {number} speedMultiplier - Geschwindigkeitsmultiplikator
   * @return {number} Berechnete Dauer in Sekunden
   */
  craftingTime(baseTime, speedMultiplier) {
    return Math.max(1, baseTime / speedMultiplier);
  },
  
  /**
   * Berechnet die Ausfallwahrscheinlichkeit beim Handwerk
   * @param {number} itemDifficulty - Schwierigkeit des Gegenstands (1-10)
   * @param {number} playerSkill - Spielerfertigkeit
   * @return {number} Ausfallwahrscheinlichkeit zwischen 0 und 1
   */
  failureChance(itemDifficulty, playerSkill) {
    const baseFail = itemDifficulty * 0.05; // 5-50% Basiswahrscheinlichkeit
    const skillReduction = playerSkill * 0.01; // 1% Reduzierung pro Fertigkeitspunkt
    
    return Math.max(0, Math.min(0.95, baseFail - skillReduction)); // 0-95%
  },
  
  /**
   * Berechnet die Materialkosten mit Rabatt
   * @param {Object} materials - Materialobjekt mit Name/Menge
   * @param {number} discount - Rabatt als Dezimalzahl (0-1)
   * @return {Object} Neue Materialkosten
   */
  applyMaterialDiscount(materials, discount) {
    const result = {};
    
    for (const [material, amount] of Object.entries(materials)) {
      result[material] = Math.max(1, Math.floor(amount * (1 - discount)));
    }
    
    return result;
  },
  
  /**
   * Berechnet die Idle-Produktion pro Minute
   * @param {number} level - Spielerlevel
   * @param {number} efficiencyBonus - Effizienzbonus
   * @return {Object} Generierte Ressourcen pro Minute
   */
  idleProduction(level, efficiencyBonus) {
    const baseRate = level * 0.1;
    const goldPerMinute = Math.floor(baseRate * efficiencyBonus * 6);
    const matsPerMinute = Math.floor(baseRate * 0.5 * efficiencyBonus * 6);
    
    return {
      gold: goldPerMinute,
      materials: matsPerMinute
    };
  },
  
  /**
   * Berechnet eine gleichmäßige Verteilung zwischen min und max
   * @param {number} min - Minimaler Wert
   * @param {number} max - Maximaler Wert
   * @return {number} Zufälliger Wert zwischen min und max
   */
  randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  /**
   * Führt eine gewichtete Zufallsauswahl durch
   * @param {Array} items - Array von Objekten mit weight-Eigenschaft
   * @return {Object} Ausgewähltes Objekt
   */
  weightedRandom(items) {
    if (!items || items.length === 0) return null;
    
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < items.length; i++) {
      random -= (items[i].weight || 1);
      if (random <= 0) {
        return items[i];
      }
    }
    
    return items[items.length - 1];
  },
  
  /**
   * Prüft, ob eine Primzahl vorliegt
   * @param {number} num - Zu prüfende Zahl
   * @return {boolean} True wenn Primzahl
   */
  isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= num) {
      if (num % i === 0 || num % (i + 2) === 0) return false;
      i += 6;
    }
    
    return true;
  },
  
  /**
   * Prüft, ob eine Zahl in der Fibonacci-Folge ist
   * @param {number} num - Zu prüfende Zahl
   * @return {boolean} True wenn Fibonacci-Zahl
   */
  isFibonacci(num) {
    const isPerfectSquare = n => {
      const sqrt = Math.sqrt(n);
      return sqrt === Math.floor(sqrt);
    };
    
    return isPerfectSquare(5 * num * num + 4) || isPerfectSquare(5 * num * num - 4);
  }
};

export default Formula;
