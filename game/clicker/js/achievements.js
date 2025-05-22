/**
 * Achievement-System
 * Verwaltet die Errungenschaften und Fortschrittsanzeigen
 */

import GameState from './models/gameState.js';
import AllAchievements, { ACHIEVEMENT_CATEGORIES } from './models/achievements.js';

const AchievementSystem = {
  achievementsTab: null,
  activeFilter: 'all',
  searchQuery: '',
  
  init() {
    this.achievementsTab = document.getElementById('achievements-tab');
    
    // Event-Listener für Tab-Änderungen
    GameState.events.subscribe('tabChanged', ({ detail }) => {
      if (detail.tabId === 'achievements-tab') {
        this.renderAchievements();
      }
    });
    
    // Achievements überwachen
    GameState.events.subscribe(GameState.EVENT_TYPES.ACHIEVEMENT_EARNED, ({ detail }) => {
      this.renderAchievements();
      this.showAchievementNotification(detail.id);
    });
    
    // Event-Listener für den Tab hinzufügen
    document.querySelector('[data-tab="achievements-tab"]').addEventListener('click', () => {
      this.renderAchievements();
    });
    
    // Initialisiere fehlende Achievements im GameState, wenn sie dort noch nicht existieren
    this.initializeAchievements();
  },
  
  initializeAchievements() {
    // Übertrage alle Achievements aus dem Achievements-Modell ins GameState, falls noch nicht vorhanden
    Object.entries(AllAchievements).forEach(([id, achievement]) => {
      if (!GameState.achievements[id]) {
        GameState.achievements[id] = { ...achievement };
      }
    });
  },
  
  renderAchievements() {
    if (!this.achievementsTab) return;
    
    // Tab leeren
    this.achievementsTab.innerHTML = '';
    
    // Einführungstext hinzufügen
    const achievementsIntro = document.createElement('div');
    achievementsIntro.className = 'tab-intro';
    achievementsIntro.innerHTML = `
      <h3>Errungenschaften</h3>
      <p>Schließe verschiedene Herausforderungen ab, um zusätzliche Belohnungen zu erhalten.</p>
    `;
    this.achievementsTab.appendChild(achievementsIntro);
    
    // Achievement-Zusammenfassung hinzufügen
    this.addAchievementSummary();
    
    // Filter- und Suchoptionen hinzufügen
    this.addAchievementFilters();
    
    // Gruppe Achievements nach Kategorien
    const achievementsByCategory = this.groupAchievementsByCategory();
    
    // Container für Achievements erstellen
    const achievementsContainer = document.createElement('div');
    achievementsContainer.className = 'achievements-container';
    
    // Für jede Kategorie einen Abschnitt erstellen
    Object.entries(ACHIEVEMENT_CATEGORIES).forEach(([_, category]) => {
      // Überspringe Kategorien ohne Achievements oder versteckte Kategorien für neue Spieler
      const categoryAchievements = this.filterAchievements(achievementsByCategory[category.id] || []);
      if (categoryAchievements.length === 0) return;
      
      // Berechne Statistiken für diese Kategorie
      const earnedCount = categoryAchievements.filter(([_, achievement]) => achievement.earned).length;
      const totalCount = categoryAchievements.length;
      
      // Kategorie-Header erstellen
      const categorySection = document.createElement('div');
      categorySection.className = 'achievement-category';
      categorySection.innerHTML = `
        <h3 class="category-header">
          <div>
            <i class="fas ${category.icon}"></i> ${category.name}
          </div>
          <span class="category-stats">${earnedCount}/${totalCount}</span>
        </h3>
        <p class="category-description">${category.description}</p>
      `;
      
      // Achievement-Liste für diese Kategorie erstellen
      const achievementsList = document.createElement('div');
      achievementsList.className = 'achievements-list';
      
      // Achievements in dieser Kategorie anzeigen
      categoryAchievements.forEach(([id, achievement]) => {
        // Fortschritt berechnen
        const { currentValue, progress } = this.calculateAchievementProgress(id, achievement);
        
        // Name und Beschreibung anpassen, wenn es sich um ein geheimes Achievement handelt
        const displayName = achievement.secret && !achievement.earned ? '???' : (achievement.realName || achievement.name);
        const displayDescription = achievement.secret && !achievement.earned ? '???' : (achievement.realDescription || achievement.description);
        const displayIcon = achievement.secret && !achievement.earned ? 'fa-question' : (achievement.realIcon || achievement.icon || this.getIconForAchievement(id));
        
        // Belohnungsanzeige erstellen
        let rewardHtml = '';
        if (achievement.reward && !achievement.secret) {
          rewardHtml = '<div class="achievement-reward">';
          if (achievement.reward.gold) {
            rewardHtml += `<span><i class="fas fa-coins"></i> ${achievement.reward.gold}</span>`;
          }
          if (achievement.reward.experience) {
            rewardHtml += `<span><i class="fas fa-star"></i> ${achievement.reward.experience}</span>`;
          }
          rewardHtml += '</div>';
        }
        
        // Achievement-Karte erstellen
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement ${achievement.earned ? 'earned' : ''} ${achievement.secret && !achievement.earned ? 'secret' : ''}`;
        achievementCard.innerHTML = `
          <div class="achievement-icon">
            <i class="fas ${displayIcon}"></i>
          </div>
          <div class="achievement-content">
            <h3>${displayName} ${rewardHtml}</h3>
            <p>${displayDescription}</p>
            <div class="achievement-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
              </div>
              <span>${achievement.secret && !achievement.earned ? '?' : currentValue}/${achievement.secret && !achievement.earned ? '?' : achievement.requirement}</span>
            </div>
          </div>
          ${achievement.earned ? '<div class="achievement-completed"><i class="fas fa-check-circle"></i> Abgeschlossen</div>' : ''}
        `;
        
        achievementsList.appendChild(achievementCard);
      });
      
      categorySection.appendChild(achievementsList);
      achievementsContainer.appendChild(categorySection);
    });
    
    this.achievementsTab.appendChild(achievementsContainer);
    
    // Add event listeners for filters and search
    this.addFilterListeners();
  },
  
  addAchievementSummary() {
    // Calculate totals
    let totalAchievements = 0;
    let earnedAchievements = 0;
    
    Object.values(GameState.achievements).forEach(achievement => {
      totalAchievements++;
      if (achievement.earned) earnedAchievements++;
    });
    
    // Create summary element
    const summaryElement = document.createElement('div');
    summaryElement.className = 'achievement-summary';
    summaryElement.innerHTML = `
      <div class="achievement-total">
        Errungenschaften: <span>${earnedAchievements}</span> von <span>${totalAchievements}</span> freigeschaltet
        (${Math.round((earnedAchievements / totalAchievements) * 100)}%)
      </div>
      <div class="achievement-search">
        <i class="fas fa-search"></i>
        <input type="text" id="achievement-search-input" placeholder="Suche nach Errungenschaften...">
      </div>
    `;
    
    this.achievementsTab.appendChild(summaryElement);
    
    // Add search event listener
    setTimeout(() => {
      const searchInput = document.getElementById('achievement-search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase();
          this.renderAchievements();
        });
        
        // Set value from previous search if any
        if (this.searchQuery) {
          searchInput.value = this.searchQuery;
        }
      }
    }, 0);
  },
  
  addAchievementFilters() {
    const filterOptions = [
      { id: 'all', name: 'Alle', icon: 'fa-th' },
      { id: 'earned', name: 'Freigeschaltet', icon: 'fa-check-circle' },
      { id: 'unearned', name: 'Ausstehend', icon: 'fa-clock' },
      { id: 'secret', name: 'Geheim', icon: 'fa-question' }
    ];
    
    const filtersElement = document.createElement('div');
    filtersElement.className = 'achievement-filters';
    
    filterOptions.forEach(filter => {
      const button = document.createElement('button');
      button.className = `filter-button ${this.activeFilter === filter.id ? 'active' : ''}`;
      button.setAttribute('data-filter', filter.id);
      button.innerHTML = `<i class="fas ${filter.icon}"></i> ${filter.name}`;
      filtersElement.appendChild(button);
    });
    
    this.achievementsTab.appendChild(filtersElement);
  },
  
  addFilterListeners() {
    const filterButtons = this.achievementsTab.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const filterId = button.getAttribute('data-filter');
        this.activeFilter = filterId;
        this.renderAchievements();
      });
    });
  },
  
  filterAchievements(achievements) {
    // First apply search filter if there is a search query
    let filtered = achievements;
    
    if (this.searchQuery) {
      filtered = achievements.filter(([_, achievement]) => {
        const name = achievement.realName || achievement.name;
        const description = achievement.realDescription || achievement.description;
        return name.toLowerCase().includes(this.searchQuery) || 
               description.toLowerCase().includes(this.searchQuery);
      });
    }
    
    // Then apply category filter
    switch (this.activeFilter) {
      case 'earned':
        return filtered.filter(([_, achievement]) => achievement.earned);
      case 'unearned':
        return filtered.filter(([_, achievement]) => !achievement.earned);
      case 'secret':
        return filtered.filter(([_, achievement]) => achievement.secret);
      case 'all':
      default:
        return filtered;
    }
  },
  
  groupAchievementsByCategory() {
    const categories = {};
    
    // Initialisiere leere Arrays für jede Kategorie
    Object.entries(ACHIEVEMENT_CATEGORIES).forEach(([_, category]) => {
      categories[category.id] = [];
    });
    
    // Füge Achievements in die entsprechenden Kategorien ein
    Object.entries(GameState.achievements).forEach(([id, achievement]) => {
      if (achievement.category) {
        categories[achievement.category].push([id, achievement]);
      } else {
        // Fallback für Achievements ohne Kategorie (Legacy-Unterstützung)
        categories[ACHIEVEMENT_CATEGORIES.BEGINNER.id].push([id, achievement]);
      }
    });
    
    return categories;
  },
  
  calculateAchievementProgress(id, achievement) {
    let currentValue = 0;
    
    // Bestimme den aktuellen Wert basierend auf dem Achievement-Typ
    switch (achievement.type) {
      case 'clicks':
        currentValue = GameState.stats.totalClicks;
        break;
      case 'crafting':
        currentValue = GameState.stats.itemsCrafted;
        break;
      case 'materials':
        if (achievement.requirementType) {
          // Spezifisches Material
          currentValue = GameState.materials[achievement.requirementType] || 0;
        } else {
          // Alle Materialien
          currentValue = Object.values(GameState.materials).reduce((sum, amount) => sum + amount, 0);
        }
        break;
      case 'upgrades':
        currentValue = GameState.stats.upgradesPurchased;
        break;
      case 'gold':
        if (achievement.requirementType === 'current') {
          // Aktueller Goldbestand
          currentValue = GameState.resources.gold;
        } else {
          // Gesamtes verdientes Gold
          currentValue = GameState.stats.goldEarned;
        }
        break;
      case 'level':
        currentValue = GameState.level;
        break;
      case 'experience':
        currentValue = GameState.stats.experienceGained;
        break;
      // Füge hier weitere Typen hinzu
      default:
        // Für unbekannte oder spezielle Typen
        if (achievement.earned) {
          currentValue = achievement.requirement;
        }
        break;
    }
    
    // Berechne den Fortschritt in Prozent
    const progress = Math.min(100, (currentValue / achievement.requirement) * 100);
    
    return { currentValue, progress };
  },
  
  showAchievementNotification(achievementId) {
    const achievement = GameState.achievements[achievementId];
    if (!achievement) return;
    
    const notificationElement = document.createElement('div');
    notificationElement.className = 'achievement-notification';
    
    // Bestimme anzuzeigenden Namen und Icon
    const displayName = achievement.realName || achievement.name;
    const displayIcon = achievement.realIcon || achievement.icon || this.getIconForAchievement(achievementId);
    
    // Belohnungsanzeige erstellen
    let rewardHtml = '';
    if (achievement.reward) {
      rewardHtml = '<div class="achievement-notification-reward">';
      if (achievement.reward.gold) {
        rewardHtml += `<span><i class="fas fa-coins"></i> ${achievement.reward.gold} Gold</span>`;
      }
      if (achievement.reward.experience) {
        rewardHtml += `<span><i class="fas fa-star"></i> ${achievement.reward.experience} XP</span>`;
      }
      rewardHtml += '</div>';
    }
    
    notificationElement.innerHTML = `
      <div class="achievement-notification-icon">
        <i class="fas ${displayIcon}"></i>
      </div>
      <div class="achievement-notification-content">
        <h3>Achievement freigeschaltet!</h3>
        <p>${displayName}</p>
        ${rewardHtml}
      </div>
    `;
    
    document.body.appendChild(notificationElement);
    
    // Sound abspielen
    GameState.events.dispatch('playSound', { type: 'achievement' });
    
    // Animation erst starten, wenn Element im DOM ist
    setTimeout(() => {
      notificationElement.classList.add('show');
    }, 10);
    
    // Nach Animation entfernen
    setTimeout(() => {
      notificationElement.classList.remove('show');
      setTimeout(() => {
        notificationElement.remove();
      }, 500);
    }, 5000);
  },
  
  getNameForAchievement(id) {
    // Diese Methode wird jetzt nur als Fallback verwendet
    const names = {
      clickMaster: 'Klick-Meister',
      craftingNovice: 'Handwerks-Novize',
      materialCollector: 'Materialsammler',
      upgradeEnthusiast: 'Upgrade-Enthusiast',
      goldHoarder: 'Goldhorter'
    };
    
    return names[id] || id;
  },
  
  getIconForAchievement(id) {
    // Diese Methode wird jetzt nur als Fallback verwendet
    const icons = {
      clickMaster: 'fa-hand-pointer',
      craftingNovice: 'fa-hammer',
      materialCollector: 'fa-cubes',
      upgradeEnthusiast: 'fa-arrow-up',
      goldHoarder: 'fa-coins'
    };
    
    return icons[id] || 'fa-trophy';
  }
};

export default AchievementSystem;
