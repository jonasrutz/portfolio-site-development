document.addEventListener("DOMContentLoaded", function () {
  // Core variables
  const tenseNavs = document.querySelectorAll(".tense-nav");
  const tenseSections = document.querySelectorAll(".tense-section");
  const tenseCards = document.querySelectorAll(".tense-card h3");
  const hamburgerIcon = document.querySelector(".hamburger-icon");
  const navLinks = document.querySelector(".nav-links");
  
  // Initialize page with only navigation and tense card toggling
  initializePage();
  
  function initializePage() {
    setupNavigation();
    setupTenseCards();
    setupExerciseButtons();
    setupSearch();
    setupHamburgerMenu();
    addInteractiveHints();
    loadUserProgress();
    highlightActiveNavOnScroll(); // New function for scroll-based navigation highlighting
  }
  
  function setupNavigation() {
    tenseNavs.forEach(nav => {
      nav.addEventListener("click", function(e) {
        e.preventDefault();
        
        // Update active nav
        tenseNavs.forEach(item => item.classList.remove("active"));
        this.classList.add("active");
        
        // Update visible section
        tenseSections.forEach(section => section.classList.remove("active"));
        const targetId = this.getAttribute("data-target");
        document.getElementById(targetId).classList.add("active");
        
        // Close mobile menu when a tense is selected
        const hamburgerIcon = document.querySelector('.hamburger-icon');
        const navLinks = document.querySelector('.nav-links');
        const navOverlay = document.querySelector('.nav-overlay');
        
        if (window.innerWidth <= 768) {
          hamburgerIcon.classList.remove('active');
          navLinks.classList.remove('show');
          navOverlay.classList.remove('active');
          document.body.classList.remove('menu-open');
          
          // Scroll to the top of the newly selected section
          setTimeout(() => {
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      });
    });
  }
  
  // New function to highlight the active navigation item based on scroll position
  function highlightActiveNavOnScroll() {
    // Only activate on larger screens
    if (window.innerWidth > 768) {
      window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 100; // Offset for the header
        
        // Find which section is currently in view
        tenseSections.forEach(section => {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const sectionId = section.getAttribute('id');
            
            // Update active nav
            tenseNavs.forEach(nav => {
              nav.classList.remove('active');
              if (nav.getAttribute('data-target') === sectionId) {
                nav.classList.add('active');
              }
            });
          }
        });
      });
    }
  }
  
  function setupTenseCards() {
    tenseCards.forEach(card => {
      card.addEventListener("click", function() {
        this.parentElement.classList.toggle("expanded");
        
        // Add visual animation
        if (this.parentElement.classList.contains("expanded")) {
          this.parentElement.classList.add("pulse");
          setTimeout(() => {
            this.parentElement.classList.remove("pulse");
          }, 500);
          
          // Update progress if not previously expanded
          if (!this.parentElement.dataset.viewed) {
            this.parentElement.dataset.viewed = "true";
            updateProgress();
            saveUserProgress();
          }
        }
      });
    });
  }
  
  function setupExerciseButtons() {
    const answerBtns = document.querySelectorAll(".answer-btn");
    answerBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        const exercise = this.closest(".exercise");
        const correctFeedback = exercise.querySelector(".feedback.correct");
        const incorrectFeedback = exercise.querySelector(".feedback.incorrect");
        
        // Remove active class from all buttons in this exercise
        exercise.querySelectorAll(".answer-btn").forEach(b => {
          b.classList.remove("active", "correct", "incorrect");
        });
        
        // Add appropriate classes to clicked button
        this.classList.add("active");
        
        if (this.dataset.correct === "true") {
          this.classList.add("correct");
          correctFeedback.style.display = "block";
          incorrectFeedback.style.display = "none";
          
          // Play success sound
          playSound("success");
          
          // Update progress if not previously completed
          if (!exercise.dataset.completed) {
            exercise.dataset.completed = "true";
            updateProgress();
            saveUserProgress();
          }
        } else {
          this.classList.add("incorrect");
          correctFeedback.style.display = "none";
          incorrectFeedback.style.display = "block";
          
          // Play error sound
          playSound("error");
        }
      });
    });
    
    // Next exercise button functionality
    const nextExerciseBtns = document.querySelectorAll(".next-exercise-btn");
    nextExerciseBtns.forEach(btn => {
      btn.addEventListener("click", function() {
        // In a real implementation, this would load new exercises
        alert("In einer vollständigen Version würden hier weitere Übungen geladen.");
      });
    });
  }
  
  function setupSearch() {
    const searchInput = document.getElementById("searchTenses");
    const searchButton = document.getElementById("searchButton");
    
    if (searchButton) {
      searchButton.addEventListener("click", performSearch);
    }
    
    if (searchInput) {
      searchInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
          performSearch();
        }
      });
      
      // Add autosuggest functionality
      searchInput.addEventListener("input", function() {
        const searchTerm = this.value.toLowerCase();
        
        if (searchTerm.length > 2) {
          // In a full implementation, this would show suggestions
        }
      });
    }
  }
  
  function updateProgress() {
    let completedItems = 0;
    const totalItems = tenseCards.length + document.querySelectorAll(".exercise").length;
    
    // Count completed tense cards
    document.querySelectorAll(".tense-card[data-viewed='true']").forEach(() => {
      completedItems++;
    });
    
    // Count completed exercises
    document.querySelectorAll(".exercise[data-completed='true']").forEach(() => {
      completedItems++;
    });
    
    const progressPercent = Math.min(Math.round((completedItems / totalItems) * 100), 100);
    
    const progressValue = document.getElementById("progress-value");
    const progressFill = document.getElementById("progress-fill");
    
    if (progressValue) progressValue.textContent = progressPercent + "%";
    if (progressFill) progressFill.style.width = progressPercent + "%";
    
    // Celebration animation at 100%
    if (progressPercent === 100) {
      document.querySelector(".learning-progress").classList.add("complete");
      
      // Show celebration message
      const celebrationMsg = document.createElement("div");
      celebrationMsg.className = "celebration-message";
      celebrationMsg.innerHTML = "<i class='fas fa-trophy'></i> Gratulation! Du hast alle Zeitformen durchgearbeitet!";
      document.querySelector(".intro").appendChild(celebrationMsg);
      
      setTimeout(() => {
        document.querySelector(".celebration-message").classList.add("show");
      }, 200);
    }
  }
  
  function addInteractiveHints() {
    // Add hover effects to interactive elements
    document.querySelectorAll(".tense-card h3").forEach(header => {
      header.setAttribute("title", "Klicken zum Öffnen/Schließen");
    });
    
    document.querySelectorAll(".answer-btn").forEach(btn => {
      btn.setAttribute("title", "Antwort auswählen");
    });
  }
  
  function saveUserProgress() {
    // Save progress to localStorage
    const completedCards = Array.from(document.querySelectorAll(".tense-card[data-viewed='true']"))
      .map(card => card.querySelector("h3").textContent);
    
    const completedExercises = Array.from(document.querySelectorAll(".exercise[data-completed='true']"))
      .map((exercise, index) => "exercise-" + index);
    
    localStorage.setItem("tensesProgress", JSON.stringify({
      completedCards: completedCards,
      completedExercises: completedExercises,
      lastVisited: Date.now()
    }));
  }
  
  function loadUserProgress() {
    // Load progress from localStorage
    const savedProgress = JSON.parse(localStorage.getItem("tensesProgress"));
    
    if (savedProgress) {
      // Mark cards as viewed
      savedProgress.completedCards.forEach(cardTitle => {
        document.querySelectorAll(".tense-card h3").forEach(card => {
          if (card.textContent === cardTitle) {
            card.parentElement.dataset.viewed = "true";
          }
        });
      });
      
      // Mark exercises as completed
      savedProgress.completedExercises.forEach(exerciseId => {
        const index = parseInt(exerciseId.split("-")[1]);
        const exercises = document.querySelectorAll(".exercise");
        if (exercises[index]) {
          exercises[index].dataset.completed = "true";
        }
      });
      
      // Update the progress bar
      updateProgress();
    }
  }
  
  function playSound(type) {
    // Play sound effects for interactions
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (type === "success") {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
      
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.5);
    } else if (type === "error") {
      const oscillator = audioContext.createOscillator();
      oscillator.type = "square";
      oscillator.frequency.setValueAtTime(220, audioContext.currentTime); // A3
      
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  }
  
  function performSearch() {
    const searchInput = document.getElementById("searchTenses");
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm.length < 2) {
      alert("Bitte gib mindestens 2 Zeichen ein.");
      return;
    }
    
    let found = false;
    
    // Reset highlights
    document.querySelectorAll(".highlight-search").forEach(el => {
      el.classList.remove("highlight-search");
    });
    
    // Enable all tense sections for searching
    tenseSections.forEach(section => {
      section.style.display = "block";
    });
    
    // Search in tense cards
    tenseCards.forEach(card => {
      const cardContent = card.textContent.toLowerCase();
      const tenseCard = card.parentElement;
      
      if (cardContent.includes(searchTerm)) {
        // Expand the card if it contains the search term
        tenseCard.classList.add("expanded");
        card.classList.add("highlight-search");
        
        // Make sure the appropriate tense section is visible
        const sectionId = tenseCard.closest(".tense-section").id;
        tenseSections.forEach(section => section.classList.remove("active"));
        document.getElementById(sectionId).classList.add("active");
        
        // Update nav links
        tenseNavs.forEach(nav => {
          nav.classList.remove("active");
          if (nav.getAttribute("data-target") === sectionId) {
            nav.classList.add("active");
          }
        });
        
        found = true;
        
        // Scroll to the card
        setTimeout(() => {
          tenseCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    });
    
    // Search in tense content
    if (!found) {
      document.querySelectorAll(".tense-content").forEach(content => {
        const contentText = content.textContent.toLowerCase();
        
        if (contentText.includes(searchTerm)) {
          const tenseCard = content.closest(".tense-card");
          tenseCard.classList.add("expanded");
          
          // Highlight matched text
          const regex = new RegExp(`(${searchTerm})`, "gi");
          highlightText(content, regex);
          
          // Make sure the appropriate tense section is visible
          const sectionId = tenseCard.closest(".tense-section").id;
          tenseSections.forEach(section => section.classList.remove("active"));
          document.getElementById(sectionId).classList.add("active");
          
          // Update nav links
          tenseNavs.forEach(nav => {
            nav.classList.remove("active");
            if (nav.getAttribute('data-target') === sectionId) {
              nav.classList.add('active');
            }
          });
          
          found = true;
          
          // Scroll to the first match
          setTimeout(() => {
            document.querySelector(".highlight-search").scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
        }
      });
    }
    
    // Hide sections without matches
    if (found) {
      tenseSections.forEach(section => {
        if (!section.classList.contains("active")) {
          section.style.display = "none";
        }
      });
    }
    
    if (!found) {
      // Display no results message
      const resultsDiv = document.createElement("div");
      resultsDiv.className = "search-results";
      resultsDiv.innerHTML = `<p>Keine Ergebnisse für "${searchTerm}" gefunden.</p>`;
      
      // Remove any existing results message
      const existingResults = document.querySelector(".search-results");
      if (existingResults) existingResults.remove();
      
      document.querySelector(".search-container").appendChild(resultsDiv);
      
      // Show all sections again
      tenseSections.forEach(section => {
        section.classList.remove("active");
      });
      document.getElementById("present-tenses").classList.add("active");
      
      // Update nav links
      tenseNavs.forEach(nav => {
        nav.classList.remove("active");
        if (nav.getAttribute("data-target") === "present-tenses") {
          nav.classList.add("active");
        }
      });
    } else {
      // Remove any existing results message
      const existingResults = document.querySelector(".search-results");
      if (existingResults) existingResults.remove();
    }
  }
  
  function highlightText(element, regex) {
    // Get all text nodes within the element
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.nodeValue.trim() !== "") {
        textNodes.push(node);
      }
    }
    
    // Highlight matches in each text node
    textNodes.forEach(textNode => {
      const parent = textNode.parentNode;
      const content = textNode.nodeValue;
      
      if (regex.test(content)) {
        const highlightedContent = content.replace(regex, '<span class="highlight-search">$1</span>');
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = highlightedContent;
        
        // Replace text node with highlighted content
        const fragment = document.createDocumentFragment();
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild);
        }
        
        parent.replaceChild(fragment, textNode);
      }
    });
  }
  
  // Setup hamburger menu functionality
  function setupHamburgerMenu() {
    if (hamburgerIcon) {
      const overlay = document.querySelector('.nav-overlay');
      
      hamburgerIcon.addEventListener("click", function() {
        this.classList.toggle("active");
        navLinks.classList.toggle("show");
        if (overlay) overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });
      
      // Close menu when clicking overlay
      if (overlay) {
        overlay.addEventListener("click", function() {
          hamburgerIcon.classList.remove("active");
          navLinks.classList.remove("show");
          this.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      }
      
      // Close menu when clicking a link
      if (navLinks) {
        navLinks.querySelectorAll("a").forEach(link => {
          link.addEventListener("click", function() {
            hamburgerIcon.classList.remove("active");
            navLinks.classList.remove("show");
            if (overlay) overlay.classList.remove("active");
            document.body.classList.remove("menu-open");
          });
        });
      }
    }
  }
});
