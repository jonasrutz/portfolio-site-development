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
      });
    });
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
          // This is a simplified version
        }
      });
    }
  }
  
  function updateProgress() {
    let completedItems = 0;
    const totalItems = tenseCards.length + document.querySelectorAll(".exercise").length;
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
    // In a full implementation, this would save to localStorage
    // Example:
    // localStorage.setItem("tensesProgress", JSON.stringify({
    //   completedItems: completedItems,
    //   viewedCards: Array.from(document.querySelectorAll(".tense-card[data-viewed='true']")).map(card => card.querySelector("h3").textContent)
    // }));
  }
  
  function loadUserProgress() {
    // In a full implementation, this would load from localStorage
    // Example:
    // const savedProgress = JSON.parse(localStorage.getItem("tensesProgress"));
    // if (savedProgress) {
    //   completedItems = savedProgress.completedItems;
    //   updateProgress();
    // }
  }
  
  function playSound(type) {
    // In a full implementation, this would play success/error sounds
    // This is a simplified version
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
            if (nav.getAttribute("data-target") === sectionId) {
              nav.classList.add("active");
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
        overlay.classList.toggle("active");
        document.body.classList.toggle("menu-open");
      });
      
      // Close menu when clicking overlay
      overlay.addEventListener("click", function() {
        hamburgerIcon.classList.remove("active");
        navLinks.classList.remove("show");
        overlay.classList.remove("active");
        document.body.classList.remove("menu-open");
      });
      
      // Close menu when clicking a link
      navLinks.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function() {
          hamburgerIcon.classList.remove("active");
          navLinks.classList.remove("show");
          overlay.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });
    }
  }
});
