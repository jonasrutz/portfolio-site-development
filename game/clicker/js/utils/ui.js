/**
 * UI-Hilfsfunktionen
 * Enthält gemeinsame UI-Funktionalitäten
 */

import GameState from '../models/gameState.js';

const UI = {
  init() {
    // Event-Listener für Benachrichtigungen
    GameState.events.subscribe('showNotification', ({ detail }) => {
      if (detail && (detail.message || detail.type)) {
        this.showNotification(detail.message || 'Benachrichtigung', detail.type);
      }
    });
    
    // Event-Listener für Speicheranzeige
    GameState.events.subscribe(GameState.EVENT_TYPES.GAME_SAVED, () => {
      this.showSaveIndicator();
    });
    
    // Tab-Navigation einrichten
    this.setupTabNavigation();
  },
  
  showNotification(message, type = "info") {
    if (!message) return;
    
    try {
      const notification = document.createElement("div");
      notification.className = `notification ${type || 'info'}`;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      // Benachrichtigung nach Animation entfernen
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 3000);
    } catch (error) {
      console.error('Fehler beim Anzeigen einer Benachrichtigung:', error);
    }
  },
  
  showSaveIndicator() {
    try {
      // Bestehende Speicheranzeige entfernen
      const existingIndicator = document.querySelector('.save-indicator');
      if (existingIndicator && existingIndicator.parentNode) {
        existingIndicator.parentNode.removeChild(existingIndicator);
      }
      
      // Neue Speicheranzeige erstellen
      const saveIndicator = document.createElement("div");
      saveIndicator.className = "save-indicator";
      saveIndicator.innerHTML = '<i class="fas fa-save"></i> Spielstand gespeichert';
      
      document.body.appendChild(saveIndicator);
      
      // Nach Animation entfernen
      setTimeout(() => {
        if (saveIndicator.parentNode) {
          saveIndicator.parentNode.removeChild(saveIndicator);
        }
      }, 2000);
    } catch (error) {
      console.error('Fehler beim Anzeigen der Speicherindikation:', error);
    }
  },
  
  setupTabNavigation() {
    try {
      const tabButtons = document.querySelectorAll(".tab-button");
      const tabs = document.querySelectorAll(".tab");
      
      if (!tabButtons.length || !tabs.length) {
        console.warn('Tab-Navigation konnte nicht initialisiert werden - fehlende Elemente');
        return;
      }
      
      tabButtons.forEach(button => {
        if (!button) return;
        
        button.addEventListener("click", function(_) { // Renamed parameter to '_' to indicate it's intentionally unused
          if (!this || !this.getAttribute) return;
          
          const tabId = this.getAttribute("data-tab");
          if (!tabId) return;
          
          const targetTab = document.getElementById(tabId);
          if (!targetTab) {
            console.warn(`Tab mit ID "${tabId}" nicht gefunden`);
            return;
          }
          
          // Aktive Klassen zurücksetzen
          tabButtons.forEach(btn => btn && btn.classList && btn.classList.remove("active"));
          tabs.forEach(tab => tab && tab.classList && tab.classList.remove("active"));
          
          // Ausgewählten Tab aktivieren
          this.classList.add("active");
          targetTab.classList.add("active");
          
          // Event auslösen, dass ein Tab gewechselt wurde
          GameState.events.dispatch('tabChanged', { tabId });
        });
      });
    } catch (error) {
      console.error('Fehler beim Einrichten der Tab-Navigation:', error);
    }
  },
  
  updateResourceDisplays() {
    try {
      // Ressourcenanzeigen aktualisieren
      const goldDisplay = document.getElementById("gold-amount");
      const materialsDisplay = document.getElementById("materials-amount");
      const experienceDisplay = document.getElementById("experience-amount");
      const levelDisplay = document.getElementById("level-display");
      
      if (goldDisplay) {
        goldDisplay.textContent = GameState.resources.gold;
      }
      
      if (materialsDisplay) {
        materialsDisplay.textContent = GameState.resources.materials;
      }
      
      if (experienceDisplay) {
        experienceDisplay.textContent = GameState.resources.experience;
      }
      
      if (levelDisplay) {
        levelDisplay.textContent = GameState.level;
      }
    } catch (error) {
      console.error('Fehler beim Aktualisieren der Ressourcenanzeigen:', error);
    }
  },
  
  // Zeigt eine spezielle Warnung für Speicherprobleme an
  showStorageWarning(errorType) {
    let message = 'Es gibt ein Problem mit dem Spielspeicher.';
    
    switch(errorType) {
      case 'quota_exceeded':
        message = 'Der Speicherplatz für dieses Spiel ist voll. Bitte setze das Spiel zurück oder lösche andere Website-Daten.';
        break;
      case 'validation_failed':
        message = 'Der geladene Spielstand ist möglicherweise beschädigt. Bei weiteren Problemen setze das Spiel zurück.';
        break;
      case 'storage_blocked':
        message = 'Der Browser hat den Zugriff auf den lokalen Speicher blockiert. Aktiviere Cookies und lokalen Speicher für diese Website.';
        break;
    }
    
    const warningBox = document.createElement('div');
    warningBox.className = 'storage-warning';
    warningBox.innerHTML = `
      <div class="warning-content">
        <i class="fas fa-exclamation-triangle"></i>
        <p>${message}</p>
        <button class="warning-close">Verstanden</button>
      </div>
    `;
    
    document.body.appendChild(warningBox);
    
    // Warnung nach Klick entfernen
    const closeButton = warningBox.querySelector('.warning-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        if (warningBox.parentNode) {
          warningBox.parentNode.removeChild(warningBox);
        }
      });
    }
    
    // Automatisches Entfernen nach 20 Sekunden
    setTimeout(() => {
      if (warningBox.parentNode) {
        warningBox.parentNode.removeChild(warningBox);
      }
    }, 20000);
  },
  
  // Hilfsfunktion zum sicheren Zugriff auf DOM-Elemente
  getElement(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn(`Element nicht gefunden: ${selector}`, error);
      return null;
    }
  },
  
  // Hilfsfunktion zum sicheren Aktualisieren von Elementtext
  updateElementText(selector, text) {
    const element = this.getElement(selector);
    if (element) {
      element.textContent = text;
      return true;
    }
    return false;
  }
};

// Export des Moduls
export default UI;
