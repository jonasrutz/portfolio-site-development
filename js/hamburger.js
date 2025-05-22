document.addEventListener('DOMContentLoaded', function() {
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  
  if (hamburgerIcon && navLinks) {
    hamburgerIcon.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      if (navOverlay) {
        navOverlay.classList.toggle('active');
      }
      
      document.body.classList.toggle('menu-open');
    });
  }
  
  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('active');
      }
      
      if (navLinks) {
        navLinks.classList.remove('active');
      }
      
      this.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }
  
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      if (hamburgerIcon) {
        hamburgerIcon.classList.remove('active');
      }
      
      if (navLinks) {
        navLinks.classList.remove('active');
      }
      
      if (navOverlay) {
        navOverlay.classList.remove('active');
      }
      
      document.body.classList.remove('menu-open');
    });
  });
});
