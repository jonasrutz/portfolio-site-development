/**
 * Material-System
 * Verwaltet das Sammeln und Verwenden von Materialien
 */

import GameState from './models/gameState.js';
import UI from './utils/ui.js';

const MaterialsSystem = {
  materialsTab: null,
  
  init() {
    this.materialsTab = document.getElementById('materials-tab');
    
    // Event-Listener für Tab-Änderungen
    GameState.events.subscribe('tabChanged', ({ detail }) => {
      if (detail.tabId === 'materials-tab') {
        this.renderMaterials();
      }
    });
    
    // Ressourcen-Updates überwachen
    GameState.events.subscribe(GameState.EVENT_TYPES.RESOURCES_UPDATED, () => {
      this.updateGatherButtons();
    });
    
    // Level-Ups überwachen für neue Materialfreischaltungen
    GameState.events.subscribe(GameState.EVENT_TYPES.LEVEL_UP, () => {
      this.checkUnlocks();
      this.renderMaterials();
    });
    
    // Initiale Darstellung
    document.querySelector('[data-tab="materials-tab"]').addEventListener('click', () => {
      this.renderMaterials();
    });
  },
  
  renderMaterials() {
    if (!this.materialsTab) return;
    
    // Tab leeren
    this.materialsTab.innerHTML = '';
    
    // Einführungstext hinzufügen
    const materialsIntro = document.createElement('div');
    materialsIntro.className = 'tab-intro';
    materialsIntro.innerHTML = `
      <h3>Materialien</h3>
      <p>Sammle verschiedene Materialien, um bessere Gegenstände herzustellen.</p>
    `;
    this.materialsTab.appendChild(materialsIntro);
    
    // Container für Materialien erstellen
    const materialsContainer = document.createElement('div');
    materialsContainer.className = 'materials-container';
    
    // Basismetalle-Sektion
    const basicSection = document.createElement('div');
    basicSection.className = 'material-section';
    basicSection.innerHTML = `<h3>Basismetalle</h3>`;
    
    const basicGrid = document.createElement('div');
    basicGrid.className = 'materials-grid';
    
    // Eisen und Kupfer sind immer verfügbar
    basicGrid.innerHTML = `
      <div class="material">
        <h4>Eisen</h4>
        <p><i class="fas fa-cubes"></i> <span id="iron-amount">${GameState.materials.iron}</span></p>
        <button class="gather-btn" data-material="iron" data-cost="5">Sammeln (5 <i class="fas fa-coins"></i>)</button>
      </div>
      
      <div class="material">
        <h4>Kupfer</h4>
        <p><i class="fas fa-cubes"></i> <span id="copper-amount">${GameState.materials.copper}</span></p>
        <button class="gather-btn" data-material="copper" data-cost="8">Sammeln (8 <i class="fas fa-coins"></i>)</button>
      </div>
    `;
    
    basicSection.appendChild(basicGrid);
    materialsContainer.appendChild(basicSection);
    
    // Fortgeschrittene Metalle-Sektion
    if (GameState.level >= 2) {
      const advancedSection = document.createElement('div');
      advancedSection.className = 'material-section';
      advancedSection.innerHTML = `<h3>Fortgeschrittene Materialien</h3>`;
      
      const advancedGrid = document.createElement('div');
      advancedGrid.className = 'materials-grid';
      
      // Silber ist ab Level 2 verfügbar
      advancedGrid.innerHTML = `
        <div class="material">
          <h4>Silber</h4>
          <p><i class="fas fa-cubes"></i> <span id="silver-amount">${GameState.materials.silver}</span></p>
          <button class="gather-btn" data-material="silver" data-cost="15">Sammeln (15 <i class="fas fa-coins"></i>)</button>
        </div>
      `;
      
      // Mythril ist ab Level 5 verfügbar
      if (GameState.level >= 5) {
        advancedGrid.innerHTML += `
          <div class="material">
            <h4>Mythril</h4>
            <p><i class="fas fa-cubes"></i> <span id="mythril-amount">${GameState.materials.mythril}</span></p>
            <button class="gather-btn" data-material="mythril" data-cost="30">Sammeln (30 <i class="fas fa-coins"></i>)</button>
          </div>
        `;
      }
      
      advancedSection.appendChild(advancedGrid);
      materialsContainer.appendChild(advancedSection);
    }
    
    // Premium Materialien-Sektion
    if (GameState.level >= 10) {
      const premiumSection = document.createElement('div');
      premiumSection.className = 'material-section';
      premiumSection.innerHTML = `<h3>Premium Materialien</h3>`;
      
      const premiumGrid = document.createElement('div');
      premiumGrid.className = 'materials-grid';
      
      // Drachenschuppen sind ab Level 10 verfügbar
      premiumGrid.innerHTML = `
        <div class="material">
          <h4>Drachenschuppen</h4>
          <p><i class="fas fa-cubes"></i> <span id="dragonscale-amount">${GameState.materials.dragonscale}</span></p>
          <button class="gather-btn" data-material="dragonscale" data-cost="50">Sammeln (50 <i class="fas fa-coins"></i>)</button>
        </div>
      `;
      
      premiumSection.appendChild(premiumGrid);
      materialsContainer.appendChild(premiumSection);
    }
    
    this.materialsTab.appendChild(materialsContainer);
    
    // Event-Listener für Sammel-Buttons hinzufügen
    const gatherButtons = this.materialsTab.querySelectorAll('.gather-btn');
    gatherButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const material = e.target.getAttribute('data-material');
        const cost = parseInt(e.target.getAttribute('data-cost'));
        this.gatherMaterial(material, cost);
      });
    });
    
    // Button-Status aktualisieren
    this.updateGatherButtons();
  },
  
  gatherMaterial(material, cost) {
    // Prüfen, ob genug Gold vorhanden ist
    if (GameState.resources.gold < cost) {
      UI.showNotification(`Nicht genug Gold zum Sammeln von ${this.formatMaterialName(material)}`, "error");
      return;
    }
    
    // Gold abziehen
    GameState.updateResources('gold', -cost);
    
    // Zufällige Materialmenge basierend auf Ressourcen-Multiplikator
    const resourceMultiplier = GameState.upgrades.resourceGain.effect;
    const amount = Math.floor((1 + Math.random() * 2) * resourceMultiplier);
    
    // Material hinzufügen
    GameState.updateMaterials(material, amount);
    
    // Material-Anzeige aktualisieren
    const materialDisplay = document.getElementById(`${material}-amount`);
    if (materialDisplay) {
      materialDisplay.textContent = GameState.materials[material];
    }
    
    // Benachrichtigung anzeigen
    UI.showNotification(`${amount} ${this.formatMaterialName(material)} gesammelt`, "success");
    
    // Ressourcenanzeigen aktualisieren
    UI.updateResourceDisplays();
    
    // Button-Status aktualisieren
    this.updateGatherButtons();
    
    // Achievements prüfen
    this.checkAchievements();
  },
  
  updateGatherButtons() {
    const gatherButtons = this.materialsTab ? this.materialsTab.querySelectorAll('.gather-btn') : [];
    
    gatherButtons.forEach(button => {
      const cost = parseInt(button.getAttribute('data-cost'));
      const canAfford = GameState.resources.gold >= cost;
      
      button.disabled = !canAfford;
      
      // Text aktualisieren
      if (canAfford) {
        button.innerHTML = `Sammeln (${cost} <i class="fas fa-coins"></i>)`;
      } else {
        button.textContent = 'Nicht genug Gold';
      }
    });
  },
  
  checkUnlocks() {
    // Prüfen, ob neue Materialien basierend auf dem Level freigeschaltet werden
    // Silber wird bei Level 2 freigeschaltet, Mythril bei Level 5, Drachenschuppen bei Level 10
    if (GameState.level === 2 || GameState.level === 5 || GameState.level === 10) {
      UI.showNotification(`Neue Materialien freigeschaltet!`, "success");
    }
  },
  
  checkAchievements() {
    // Materialsammler-Achievement prüfen
    const totalMaterials = Object.values(GameState.materials).reduce((sum, amount) => sum + amount, 0);
    
    if (!GameState.achievements.materialCollector.earned && 
        totalMaterials >= GameState.achievements.materialCollector.requirement) {
      GameState.completeAchievement('materialCollector');
      
      // Belohnung
      GameState.updateResources('gold', 40);
      GameState.updateResources('experience', 10);
      
      UI.showNotification("Achievement freigeschaltet: Materialsammler!", "success");
      
      // Achievement-Sound
      GameState.events.dispatch('playSound', { type: 'achievement' });
    }
  },
  
  formatMaterialName(material) {
    const names = {
      iron: 'Eisen',
      copper: 'Kupfer',
      silver: 'Silber',
      mythril: 'Mythril',
      dragonscale: 'Drachenschuppen'
    };
    
    return names[material] || material;
  }
};

export default MaterialsSystem;
