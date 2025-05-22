/**
 * Idle-System
 * Ermöglicht automatische Ressourcengenerierung über Zeit
 */

import GameState from './models/gameState.js';
import UI from './utils/ui.js';

const IdleSystem = {
  idleInterval: null,
  lastTimestamp: 0,
  
  init() {
    console.log('Idle-System wird initialisiert...');
    
    // Speichere den aktuellen Zeitstempel
    this.lastTimestamp = Date.now();
    
    // Starte den Idle-Prozess
    this.startIdleProcess();
    
    // Berechne Offline-Fortschritt beim Laden des Spiels
    GameState.events.subscribe(GameState.EVENT_TYPES.GAME_LOADED, () => {
      this.calculateOfflineProgress();
    });
  },
  
  startIdleProcess() {
    // Stoppe bestehenden Intervall
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
    }
    
    // Starte neuen Intervall (alle 10 Sekunden)
    this.idleInterval = setInterval(() => {
      this.generateIdleResources();
    }, 10000);
  },
  
  generateIdleResources() {
    // Idle-Rate basiert auf Upgrades und Level
    const baseIdleRate = GameState.level * 0.1; // 0.1 Ressourcen pro Level
    const idleMultiplier = GameState.upgrades.resourceGain.effect;
    const idleEfficiency = GameState.upgrades.idleEfficiency.effect;
    
    // Berechne Ressourcen basierend auf der Idle-Rate und Effizienz
    const goldGained = Math.floor(baseIdleRate * idleMultiplier * idleEfficiency);
    const materialsGained = Math.floor(baseIdleRate * idleMultiplier * 0.5 * idleEfficiency);
    
    // Füge nur Ressourcen hinzu, wenn es einen Gewinn gibt
    if (goldGained > 0) {
      GameState.updateResources('gold', goldGained);
    }
    
    if (materialsGained > 0) {
      GameState.updateResources('materials', materialsGained);
    }
    
    // Aktualisiere die UI nur wenn tatsächlich Ressourcen generiert wurden
    if (goldGained > 0 || materialsGained > 0) {
      UI.updateResourceDisplays();
      
      // Aktualisiere den Zeitstempel
      this.lastTimestamp = Date.now();
    }
  },
  
  calculateOfflineProgress() {
    // Hole den gespeicherten Zeitstempel
    const savedTimestamp = localStorage.getItem('blacksmithLastTimestamp');
    
    if (!savedTimestamp) {
      // Kein Zeitstempel gefunden, nichts zu berechnen
      localStorage.setItem('blacksmithLastTimestamp', Date.now().toString());
      return;
    }
    
    // Berechne die vergangene Zeit in Minuten
    const currentTime = Date.now();
    const lastTime = parseInt(savedTimestamp);
    const minutesPassed = Math.floor((currentTime - lastTime) / (1000 * 60));
    
    // Maximal 12 Stunden Offline-Fortschritt (720 Minuten)
    const cappedMinutes = Math.min(minutesPassed, 720);
    
    if (cappedMinutes <= 0) {
      return;
    }
    
    // Berechne die Offline-Ressourcen
    const baseIdleRate = GameState.level * 0.1;
    const idleMultiplier = GameState.upgrades.resourceGain.effect;
    const idleEfficiency = GameState.upgrades.idleEfficiency.effect;
    
    const goldGained = Math.floor(baseIdleRate * idleMultiplier * idleEfficiency * cappedMinutes);
    const materialsGained = Math.floor(baseIdleRate * idleMultiplier * 0.5 * idleEfficiency * cappedMinutes);
    
    // Füge Ressourcen hinzu
    if (goldGained > 0) {
      GameState.updateResources('gold', goldGained);
    }
    
    if (materialsGained > 0) {
      GameState.updateResources('materials', materialsGained);
    }
    
    // Aktualisiere die UI
    UI.updateResourceDisplays();
    
    // Zeige eine Benachrichtigung an
    UI.showNotification(`Während deiner Abwesenheit (${this.formatTime(cappedMinutes)}) wurden ${goldGained} Gold und ${materialsGained} Materialien gesammelt.`, 'success');
    
    // Aktualisiere den Zeitstempel
    localStorage.setItem('blacksmithLastTimestamp', currentTime.toString());
    this.lastTimestamp = currentTime;
  },
  
  formatTime(minutes) {
    if (minutes < 60) {
      return `${minutes} Minuten`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} Stunden`;
    }
    
    return `${hours} Stunden und ${remainingMinutes} Minuten`;
  },
  
  cleanup() {
    // Speichere den aktuellen Zeitstempel beim Beenden
    localStorage.setItem('blacksmithLastTimestamp', Date.now().toString());
    
    // Stoppe den Intervall
    if (this.idleInterval) {
      clearInterval(this.idleInterval);
      this.idleInterval = null;
    }
  }
};

export default IdleSystem;
