/**
 * Performance Optimizer
 * Verbessert die Spielleistung durch verschiedene Optimierungstechniken
 */

const Optimizer = {
  // Animation Frame Request ID für FPS-Begrenzung
  animFrameId: null,
  
  // Debounce-Timer für UI-Updates
  debounceTimers: {},
  
  // Initialisiere Performance-Optimierungen
  init() {
    // Event-Listener für Sichtbarkeitsänderungen hinzufügen
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    // Bildrate optimieren, wenn Browser unterstützt
    this.setupFpsThrottling();
  },
  
  // Verarbeitet Änderungen der Tab-Sichtbarkeit
  handleVisibilityChange() {
    if (document.visibilityState === 'hidden') {
      // Reduziere Aktualisierungsraten, wenn Tab nicht sichtbar
      this.pauseUnneededAnimations();
    } else {
      // Stelle normale Aktualisierungsraten wieder her
      this.resumeAnimations();
    }
  },
  
  // FPS-Begrenzung für bessere Batterieleistung auf mobilen Geräten
  setupFpsThrottling() {
    const targetFps = this.detectOptimalFps();
    
    const throttledRaf = (callback) => {
      const interval = 1000 / targetFps;
      let lastTime = 0;
      
      const animate = (time) => {
        this.animFrameId = requestAnimationFrame(animate);
        
        const delta = time - lastTime;
        if (delta >= interval) {
          lastTime = time - (delta % interval);
          callback(time);
        }
      };
      
      this.animFrameId = requestAnimationFrame(animate);
      return this.animFrameId;
    };
    
    // Store the throttled function on window instead of trying to replace requestAnimationFrame
    window.gameRequestAnimationFrame = throttledRaf;
  },
  
  // Erkennt die optimale Bildrate basierend auf Gerät und Batteriestatus
  detectOptimalFps() {
    // Standard-FPS für Desktop
    let fps = 60;
    
    // Auf mobilen Geräten niedrigere FPS verwenden
    if (this.isMobileDevice()) {
      fps = 30;
    }
    
    // Wenn Batterie-API verfügbar ist, Akku-Status prüfen
    if (navigator.getBattery) {
      navigator.getBattery().then(battery => {
        if (!battery.charging && battery.level < 0.3) {
          // Bei niedrigem Akkustand FPS weiter reduzieren
          fps = 24;
        }
      }).catch(() => {
        // Fehler ignorieren, Standard-FPS beibehalten
      });
    }
    
    return fps;
  },
  
  // Prüft, ob der Nutzer ein mobiles Gerät verwendet
  isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },
  
  // Pause unnötiger Animationen bei Tab-Inaktivität
  pauseUnneededAnimations() {
    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
    
    // Alle laufenden CSS-Animationen pausieren
    document.querySelectorAll('.animated').forEach(el => {
      el.style.animationPlayState = 'paused';
    });
  },
  
  // Animationen fortsetzen, wenn Tab wieder aktiv ist
  resumeAnimations() {
    // Animationen fortsetzen
    document.querySelectorAll('.animated').forEach(el => {
      el.style.animationPlayState = 'running';
    });
    
    // FPS-Throttling neu starten, falls nötig
    if (!this.animFrameId) {
      this.setupFpsThrottling();
    }
  },
  
  // Debounce-Funktion für UI-Updates
  debounce(func, wait, id) {
    return (...args) => {
      clearTimeout(this.debounceTimers[id]);
      this.debounceTimers[id] = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  },
  
  // Speicher optimieren, indem nicht benötigte Objekte bereinigt werden
  cleanupMemory() {
    // Alle nicht mehr benötigten Timers löschen
    Object.keys(this.debounceTimers).forEach(id => {
      clearTimeout(this.debounceTimers[id]);
      delete this.debounceTimers[id];
    });
    
    // Garbage Collection forcieren, falls möglich
    if (window.gc) {
      try {
        window.gc();
      } catch (e) {
        console.warn('Garbage collection nicht möglich');
      }
    }
  }
};

export default Optimizer;
