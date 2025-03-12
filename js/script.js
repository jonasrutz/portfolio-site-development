      // Set current year for copyright
      document.getElementById("current-year").textContent =
        new Date().getFullYear();

      // Toggle navigation on hamburger menu click
      document
        .querySelector(".hamburger-menu")
        .addEventListener("click", function () {
          document.querySelector(".main-nav").classList.toggle("active");
        });

      // Contact form submission
      const contactForm = document.getElementById("contactForm");
      const formSubmitMessage = document.getElementById("formSubmitMessage");

      if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
          e.preventDefault();

          const formData = new FormData(contactForm);

          fetch(contactForm.action, {
            method: "POST",
            body: formData,
            headers: {
              Accept: "application/json",
            },
          })
            .then((response) => {
              if (response.ok) {
                // Clear the form
                contactForm.reset();
                // Show the thank you message
                formSubmitMessage.classList.add("show");
                // Hide the form
                contactForm.style.display = "none";
              } else {
                throw new Error("Form submission failed");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              alert(
                "There was a problem submitting your form. Please try again."
              );
            });
        });
      }

      // CV Password Protection
      const cvDownloadBtn = document.getElementById("cvDownloadBtn");
      const passwordModal = document.getElementById("passwordModal");
      const closeModal = document.querySelector(".close-modal");
      const submitPasswordBtn = document.getElementById("submitPassword");
      const passwordInput = document.getElementById("cvPassword");
      const passwordError = document.getElementById("passwordError");

      // Password verification
      function checkPassword() {
        const input = passwordInput.value;

        if (input === "ims_2025") {
          // Password is correct, download the CV
          passwordModal.style.display = "none";
          window.location.href = "CV/Lebenslauf_Jonas.pdf";
        } else {
          // Password is incorrect, show error
          passwordError.textContent =
            "Falsches Passwort. Bitte versuchen Sie es erneut.";
          passwordInput.value = "";
        }
      }

      // Show the modal when the download button is clicked
      cvDownloadBtn.addEventListener("click", function (e) {
        e.preventDefault();
        passwordModal.style.display = "flex";
        passwordInput.value = ""; // Clear any previous input
        passwordError.textContent = ""; // Clear any previous error
      });

      // Close the modal when the X is clicked
      closeModal.addEventListener("click", function () {
        passwordModal.style.display = "none";
      });

      // Close the modal when clicking outside of it
      window.addEventListener("click", function (e) {
        if (e.target === passwordModal) {
          passwordModal.style.display = "none";
        }
      });

      // Handle password submission
      submitPasswordBtn.addEventListener("click", checkPassword);
      passwordInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          checkPassword();
        }
      });

      // Scroll animation observer
      const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -100px 0px",
      };

      // Observer for when elements enter the viewport
      const appearOnScroll = new IntersectionObserver(function (
        entries,
        appearOnScroll
      ) {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          } else {
            entry.target.classList.add("appear");
          }
        });
      },
      appearOptions);

      // Observer for when elements leave the viewport
      const disappearOnScroll = new IntersectionObserver(
        function (entries) {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              // Reset animation when element is out of view
              entry.target.classList.remove("appear");
            }
          });
        },
        {
          threshold: 0,
          rootMargin: "0px 0px 0px 0px",
        }
      );

      // Get all elements with animation classes
      const animatedElements = document.querySelectorAll(
        ".fade-in, .slide-in-left, .slide-in-right, .scale-in"
      );

      // Observe elements for both appearing and disappearing
      animatedElements.forEach((element) => {
        appearOnScroll.observe(element);
        disappearOnScroll.observe(element);
      });

      // Add appear class to initial visible elements
      function handleInitialAnimations() {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;

        animatedElements.forEach((element) => {
          const elementTop = element.getBoundingClientRect().top + scrollTop;
          if (elementTop < scrollTop + windowHeight * 0.85) {
            element.classList.add("appear");
          }
        });
      }

      // Run on page load after a small delay
      setTimeout(handleInitialAnimations, 100);

      // Reset animations when scrolling back to top
      window.addEventListener("scroll", function () {
        if (window.scrollY < 100) {
          // When near the top of the page, ensure home section animations are visible
          const homeElements = document.querySelectorAll(
            "#home .fade-in, #home .slide-in-left, #home .slide-in-right, #home .scale-in"
          );
          homeElements.forEach((element) => {
            element.classList.add("appear");
          });
        }
      });

      // Dropdown functionality for portfolio sections
      const dropdownHeaders = document.querySelectorAll(".dropdown-header");

      dropdownHeaders.forEach((header) => {
        header.addEventListener("click", function () {
          const section = this.parentElement;

          section.classList.toggle("active");

          const icon = this.querySelector("i");

          if (section.classList.contains("active")) {
            icon.style.transform = "rotate(180deg)";
          } else {
            icon.style.transform = "rotate(0deg)";
          }
        });
      });

      // Card click functionality
      document.addEventListener("DOMContentLoaded", function () {
        const cards = document.querySelectorAll(".card");

        cards.forEach((card) => {
          card.addEventListener("click", function () {
            // Remove active class from all cards
            cards.forEach((c) => c.classList.remove("active"));

            // Add active class to the clicked card
            this.classList.add("active");
          });
        });
      });