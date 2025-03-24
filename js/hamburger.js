document.addEventListener('DOMContentLoaded', function() {
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  const navLinks = document.querySelector('.nav-links');
  const navOverlay = document.querySelector('.nav-overlay');
  
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      navOverlay.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }
  
  if (navOverlay) {
    navOverlay.addEventListener('click', function() {
      hamburgerIcon.classList.remove('active');
      navLinks.classList.remove('active');
      this.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  }
  
  const navLinkItems = document.querySelectorAll('.nav-links a');
  navLinkItems.forEach(link => {
    link.addEventListener('click', function() {
      hamburgerIcon.classList.remove('active');
      navLinks.classList.remove('active');
      navOverlay.classList.remove('active');
      document.body.classList.remove('menu-open');
    });
  });
});
