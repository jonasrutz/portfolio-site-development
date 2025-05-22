/**
 * Sound-Manager
 * Verwaltet die Erzeugung und Steuerung von Spielsounds
 */

import GameState from '../models/gameState.js';

const SoundManager = {
  audioContext: null,
  initialized: false,
  
  init() {
    // Web Audio API initialisieren
    try {
      // Use a proper type handling approach for webkitAudioContext
      const AudioContextClass = window.AudioContext || 
        // @ts-ignore - webkitAudioContext exists in older browsers but TypeScript doesn't recognize it
        window.webkitAudioContext;
      
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        this.initialized = true;
      } else {
        throw new Error('AudioContext not supported');
      }
    } catch (e) {
      console.warn('Web Audio API wird in diesem Browser nicht unterstützt.');
      this.initialized = false;
    }
    
    // Sound-Toggle-Button einrichten
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        this.toggleSound();
      });
      
      // Initial-Zustand setzen
      this.updateSoundToggle();
    }
    
    // Event-Listener für Sound-Anfragen
    GameState.events.subscribe('playSound', ({ detail }) => {
      if (detail && detail.type) {
        this.playSound(detail.type);
      }
    });
  },
  
  toggleSound() {
    GameState.isSoundOn = !GameState.isSoundOn;
    this.updateSoundToggle();
    
    // Nach Änderung der Einstellung speichern
    GameState.saveGame();
  },
  
  updateSoundToggle() {
    const soundToggle = document.getElementById('sound-toggle');
    if (soundToggle) {
      soundToggle.innerHTML = GameState.isSoundOn ? 
        '<i class="fas fa-volume-up"></i> Sound An' : 
        '<i class="fas fa-volume-mute"></i> Sound Aus';
    }
  },
  
  playSound(type) {
    // Kein Sound, wenn Sound deaktiviert oder AudioContext nicht verfügbar
    if (!GameState.isSoundOn || !this.audioContext || !this.initialized) return;
    
    try {
      switch (type) {
        case 'forge':
          this.playForgeSound();
          break;
        case 'success':
          this.playSuccessSound();
          break;
        case 'error':
          this.playErrorSound();
          break;
        case 'achievement':
          this.playAchievementSound();
          break;
        case 'levelUp':
          this.playLevelUpSound();
          break;
        default:
          console.warn(`Unbekannter Sound-Typ: ${type}`);
      }
    } catch (error) {
      console.error(`Fehler beim Abspielen des Sounds: ${error.message}`);
    }
  },
  
  createOscillator(typeArg = 'sine') {
    if (!this.audioContext) return null;
    
    try {
      const oscillator = this.audioContext.createOscillator();
      if (oscillator) {
        oscillator.type = typeArg;
      }
      return oscillator;
    } catch (e) {
      console.warn('Fehler beim Erstellen des Oszillators:', e);
      return null;
    }
  },
  
  createGainNode() {
    if (!this.audioContext) return null;
    
    try {
      return this.audioContext.createGain();
    } catch (e) {
      console.warn('Fehler beim Erstellen des Gain-Nodes:', e);
      return null;
    }
  },
  
  playForgeSound() {
    const oscillator = this.createOscillator('square');
    if (!oscillator) return;
    
    const gainNode = this.createGainNode();
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  },
  
  playSuccessSound() {
    const oscillator = this.createOscillator();
    if (!oscillator) return;
    
    const gainNode = this.createGainNode();
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    oscillator.frequency.setValueAtTime(660, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(880, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.5);
  },
  
  playErrorSound() {
    const oscillator = this.createOscillator();
    if (!oscillator) return;
    
    const gainNode = this.createGainNode();
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
    oscillator.frequency.setValueAtTime(196, this.audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.3);
  },
  
  playAchievementSound() {
    const oscillator = this.createOscillator();
    if (!oscillator) return;
    
    const gainNode = this.createGainNode();
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    // Fanfare-artiger Sound
    oscillator.type = 'triangle';
    
    // Kleine Melodie
    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    oscillator.frequency.setValueAtTime(1046.50, now + 0.3); // C6
    
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 0.8);
  },
  
  playLevelUpSound() {
    const oscillator = this.createOscillator();
    if (!oscillator) return;
    
    const gainNode = this.createGainNode();
    if (!gainNode) {
      oscillator.disconnect();
      return;
    }
    
    // Aufsteigende Fanfare für Level-Ups
    oscillator.type = 'sine';
    
    const now = this.audioContext.currentTime;
    oscillator.frequency.setValueAtTime(440, now); // A4
    oscillator.frequency.setValueAtTime(493.88, now + 0.1); // B4
    oscillator.frequency.setValueAtTime(523.25, now + 0.2); // C5
    oscillator.frequency.setValueAtTime(587.33, now + 0.3); // D5
    oscillator.frequency.setValueAtTime(659.25, now + 0.4); // E5
    oscillator.frequency.setValueAtTime(698.46, now + 0.5); // F5
    
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.1, now + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.start();
    oscillator.stop(now + 1);
  },
  
  // Safe cleanup method for page unloads or context destruction
  cleanup() {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch (e) {
        console.warn('Error closing audio context:', e);
      }
    }
    
    this.initialized = false;
    this.audioContext = null;
  }
};

// Export des Moduls
export default SoundManager;
