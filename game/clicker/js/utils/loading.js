/**
 * Loading Screen Manager
 * Verwaltet den Ladebildschirm des Spiels
 */

const LoadingManager = {
  loadingScreen: null,
  
  init() {
    this.loadingScreen = document.getElementById('loading-screen');
    if (!this.loadingScreen) {
      console.warn('Loading screen element not found');
      return;
    }
    
    // Ensure loading screen is visible during initialization
    this.showLoading();
    
    // Add event listener to hide loading screen when all assets are loaded
    window.addEventListener('load', () => {
      // Add a small delay to make the loading screen more noticeable
      setTimeout(() => {
        this.hideLoading();
      }, 500);
    });
  },
  
  showLoading() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.remove('hidden');
    }
  },
  
  hideLoading() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add('hidden');
      
      // Remove from DOM after animation completes
      setTimeout(() => {
        if (this.loadingScreen && this.loadingScreen.parentNode) {
          this.loadingScreen.parentNode.removeChild(this.loadingScreen);
        }
      }, 500); // Match the CSS transition duration
    }
  }
};

export default LoadingManager;
