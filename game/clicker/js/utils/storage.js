/**
 * Storage Utility
 * Verwaltet und prüft die Speichermöglichkeiten des Browsers
 */

import UI from './ui.js';

const StorageUtils = {
  isLocalStorageAvailable() {
    try {
      // Feature detection für localStorage
      if (typeof localStorage === 'undefined') {
        return false;
      }
      
      // Testschreibzugriff
      localStorage.setItem('__storage_test__', 'test');
      localStorage.removeItem('__storage_test__');
      
      return true;
    } catch (e) {
      return false;
    }
  },
  
  checkStorageQuota() {
    try {
      const testString = 'A'.repeat(1024); // 1KB String
      let iterations = 0;
      
      // Versuche bis zu 5MB zu speichern (auf localStorage beschränkt)
      while (iterations < 5000) {
        localStorage.setItem(`__quota_test_${iterations}`, testString);
        iterations++;
      }
    } catch (e) {
      // Cleanup
      for (let i = 0; i < 5000; i++) {
        localStorage.removeItem(`__quota_test_${i}`);
      }
      
      // Use name property instead of deprecated code property for broader compatibility
      if (e instanceof DOMException && 
          (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        return false;
      }
    }
    
    // Cleanup
    for (let i = 0; i < 5000; i++) {
      localStorage.removeItem(`__quota_test_${i}`);
    }
    
    return true;
  },
  
  // Initialisiert den Storage Service und prüft Verfügbarkeit
  init() {
    // Prüfe, ob localStorage verfügbar ist
    if (!this.isLocalStorageAvailable()) {
      console.error('localStorage ist nicht verfügbar. Spielstände können nicht gespeichert werden.');
      UI.showStorageWarning('storage_blocked');
      return false;
    }
    
    // Überprüfe, ob genug Speicherplatz vorhanden ist
    if (!this.checkStorageQuota()) {
      console.warn('Speicherplatz könnte begrenzt sein. Möglicherweise können nicht alle Daten gespeichert werden.');
      // Keine Warnung hier, da der Test nicht 100% zuverlässig ist
    }
    
    // Versuche beim Speichern das Speicherlimit zu erkennen
    window.addEventListener('error', (event) => {
      if (event.message && 
         (event.message.includes('quota') || 
          event.message.includes('storage') || 
          event.message.includes('localStorage'))) {
        UI.showStorageWarning('quota_exceeded');
      }
    });
    
    return true;
  }
};

export default StorageUtils;
