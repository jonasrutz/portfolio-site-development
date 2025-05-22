// Jontech Website JavaScript

// Shopping Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    const cart = {
        items: [],
        total: 0,
        
        // Add item to cart
        addItem(id, name, price, recurring = null, variable = false) {
            // Check if item already exists in cart
            const existingItemIndex = this.items.findIndex(item => item.id === id);
            
            if (existingItemIndex !== -1) {
                // Item already in cart - could increment quantity if needed
                // For now, we'll just show an alert
                alert(`${name} ist bereits in Ihrem Warenkorb.`);
                return false;
            }
            
            // Add item to cart
            this.items.push({
                id,
                name,
                price: parseFloat(price),
                recurring,
                variable,
                note: ''
            });
            
            // Update total
            this.updateTotal();
            return true;
        },
        
        // Remove item from cart
        removeItem(id) {
            this.items = this.items.filter(item => item.id !== id);
            this.updateTotal();
        },
        
        // Update item note
        updateNote(id, note) {
            const itemIndex = this.items.findIndex(item => item.id === id);
            if (itemIndex !== -1) {
                this.items[itemIndex].note = note;
            }
        },
        
        // Calculate total
        updateTotal() {
            this.total = this.items.reduce((sum, item) => {
                if (!item.variable) {
                    return sum + item.price;
                }
                return sum;
            }, 0);
        },
        
        // Format price for display
        formatPrice(price) {
            return price.toFixed(2).replace('.', ',') + ' €';
        }
    };
    
    // DOM Elements
    const cartButton = document.querySelector('.cart-button');
    const cartSidebar = document.querySelector('.shopping-cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCartButton = document.querySelector('.btn-close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutButton = document.querySelector('.btn-checkout');
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    const categoryTabs = document.querySelectorAll('.category-tab');
    const productGrids = document.querySelectorAll('.product-grid');
    const selectedProductsList = document.getElementById('selected-products-list');
    const formTotalAmount = document.getElementById('form-total-amount');
    const totalSection = document.querySelector('.total-section');
    
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const menu = document.querySelector('.menu');
    
    if(mobileMenuBtn && menu) {
        mobileMenuBtn.addEventListener('click', function() {
            menu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking a nav link
    const navLinks = document.querySelectorAll('.menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });
    
    // Sticky Header on Scroll
    const header = document.querySelector('header');
    let scrollPosition = window.scrollY;
    
    function handleScroll() {
        scrollPosition = window.scrollY;
        
        if(scrollPosition > 100) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
      // Toggle cart sidebar
    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }
    
    // Open cart
    if (cartButton) {
        cartButton.addEventListener('click', toggleCart);
    }
    
    // Close cart
    if (closeCartButton) {
        closeCartButton.addEventListener('click', toggleCart);
    }
    
    // Close cart when clicking outside
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }
    
    // Render cart items
    function renderCart() {
        // Update cart count
        if (cartCount) {
            cartCount.textContent = cart.items.length;
        }
        
        // Update total
        if (totalAmount) {
            totalAmount.textContent = cart.formatPrice(cart.total);
        }
        
        // Update form total
        if (formTotalAmount) {
            formTotalAmount.textContent = cart.formatPrice(cart.total);
        }
        
        // Show/hide total section based on cart items
        if (totalSection) {
            totalSection.style.display = cart.items.length > 0 ? 'flex' : 'none';
        }
        
        // Render cart items in sidebar
        if (cartItemsContainer) {
            if (cart.items.length === 0) {
                cartItemsContainer.innerHTML = '<div class="cart-empty">Ihr Warenkorb ist leer.</div>';
            } else {
                cartItemsContainer.innerHTML = '';
                cart.items.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    
                    let priceDisplay = item.variable ? 'Nach Aufwand' : cart.formatPrice(item.price);
                    if (item.recurring) {
                        priceDisplay += item.recurring === 'monthly' ? '/Monat' : '/Jahr';
                    }
                    
                    itemElement.innerHTML = `
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${priceDisplay}</div>
                            <div class="cart-item-note">
                                <textarea placeholder="Bemerkung hinzufügen..." data-id="${item.id}">${item.note}</textarea>
                            </div>
                        </div>
                        <button class="btn-remove-item" data-id="${item.id}">
                            <i class="fas fa-times"></i>
                        </button>
                    `;
                    
                    cartItemsContainer.appendChild(itemElement);
                    
                    // Add event listener for textarea
                    const noteTextarea = itemElement.querySelector('textarea');
                    noteTextarea.addEventListener('input', function() {
                        cart.updateNote(item.id, this.value);
                        renderSelectedProducts();
                    });
                });
                
                // Add event listeners to remove buttons
                document.querySelectorAll('.btn-remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const id = this.getAttribute('data-id');
                        cart.removeItem(id);
                        renderCart();
                        renderSelectedProducts();
                        
                        // Reset add button state
                        const addButton = document.querySelector(`.btn-add-to-cart[data-id="${id}"]`);
                        if (addButton) {
                            addButton.textContent = 'Hinzufügen';
                            addButton.classList.remove('added');
                        }
                    });
                });
            }
        }
        
        // Render selected products in form
        renderSelectedProducts();
    }
    
    // Render selected products in the contact form
    function renderSelectedProducts() {
        if (!selectedProductsList) return;
        
        if (cart.items.length === 0) {
            selectedProductsList.innerHTML = '<div class="empty-cart-message">Sie haben noch keine Produkte ausgewählt.</div>';
        } else {
            selectedProductsList.innerHTML = '';
            cart.items.forEach(item => {
                const productElement = document.createElement('div');
                productElement.className = 'selected-product-item';
                
                let priceDisplay = item.variable ? 'Nach Aufwand' : cart.formatPrice(item.price);
                if (item.recurring) {
                    priceDisplay += item.recurring === 'monthly' ? '/Monat' : '/Jahr';
                }
                
                productElement.innerHTML = `
                    <div class="selected-product-info">
                        <div class="selected-product-name">${item.name}</div>
                        ${item.note ? `<div class="selected-product-note">Bemerkung: ${item.note}</div>` : ''}
                    </div>
                    <div class="selected-product-price">${priceDisplay}</div>
                `;
                
                selectedProductsList.appendChild(productElement);
            });
        }
    }
    
    // Add to cart functionality
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const recurring = this.getAttribute('data-recurring') || null;
            const variable = this.getAttribute('data-variable') === 'true';
            
            const added = cart.addItem(id, name, price, recurring, variable);
            
            if (added) {
                // Visual feedback
                this.textContent = '✓ Hinzugefügt';
                this.classList.add('added');
                
                setTimeout(() => {
                    this.textContent = 'Hinzufügen';
                    this.classList.remove('added');
                }, 2000);
                
                renderCart();
            }
        });
    });
    
    // Category tab functionality
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all product grids
            productGrids.forEach(grid => grid.classList.add('hidden'));
            
            // Show selected product grid
            const category = this.getAttribute('data-category');
            document.getElementById(`${category}-products`).classList.remove('hidden');
        });
    });
    
    // Checkout functionality
    if (checkoutButton) {
        checkoutButton.addEventListener('click', function() {
            toggleCart();
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize cart
    renderCart();    // EmailJS Initialisierung
    // Konfiguration für den E-Mail-Versand an jontech@jonasrutz.ch
    const EMAIL_SERVICE_ID = 'service_662hndu'; // Ihre EmailJS Service-ID - ersetzen Sie diese mit Ihrer tatsächlichen Service-ID
    const EMAIL_TEMPLATE_ID = 'template_29nprlm'; // Ihre EmailJS Template-ID - ersetzen Sie diese mit Ihrer tatsächlichen Template-ID
    const EMAIL_USER_ID = 'DMFUXgBCmZKUjW8Jj'; // Ihr Public Key von EmailJS - ersetzen Sie diesen mit Ihrem tatsächlichen Public Key
    
    // EmailJS initialisieren
    (function() {
        emailjs.init(EMAIL_USER_ID);
    })();
    
    // Form Submission
    const contactForm = document.getElementById('contactForm');
    
    if(contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Submit-Button Status ändern
            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Wird gesendet...';
            submitButton.disabled = true;
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value || 'Keine Angabe';
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;            // Funktion zur Anzeige von Formular-Fehlern (wird später definiert)
            function showFormResponse(message, isSuccess) {
                const responseEl = document.getElementById('formResponseMessage');
                
                // Stil für die Nachrichtenbox
                responseEl.style.padding = '20px';
                responseEl.style.margin = '20px 0';
                responseEl.style.borderRadius = '8px';
                responseEl.style.position = 'relative';
                responseEl.style.animation = 'fadeIn 0.5s ease';
                
                if (isSuccess) {
                    responseEl.style.backgroundColor = '#d4edda';
                    responseEl.style.color = '#155724';
                    responseEl.style.border = '1px solid #c3e6cb';
                } else {
                    responseEl.style.backgroundColor = '#f8d7da';
                    responseEl.style.color = '#721c24';
                    responseEl.style.border = '1px solid #f5c6cb';
                }
                  // HTML für den Nachrichteninhalt
                responseEl.innerHTML = `
                    <div class="close-btn" onclick="closeFormMessage()" style="position: absolute; top: 10px; right: 10px; cursor: pointer; font-size: 16px;">✕</div>
                    <h4 style="margin-top: 0; margin-bottom: 10px;">${isSuccess ? 'Erfolg!' : 'Fehler!'}</h4>
                    <p style="margin-bottom: 0;">${message}</p>
                `;
                
                // Funktion zum Schließen der Meldung 
                window.closeFormMessage = function() {
                    const msgEl = document.getElementById('formResponseMessage');
                    msgEl.style.animation = 'fadeOut 0.3s ease forwards';
                    setTimeout(() => {
                        msgEl.style.display = 'none';
                    }, 300);
                };
                
                // Nachricht anzeigen und zu ihr scrollen
                responseEl.style.display = 'block';
                responseEl.scrollIntoView({behavior: 'smooth', block: 'center'});
                  // Animation für Ein- und Ausblenden
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                    @keyframes fadeIn {
                        0% { opacity: 0; transform: translateY(-10px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes fadeOut {
                        0% { opacity: 1; transform: translateY(0); }
                        100% { opacity: 0; transform: translateY(-10px); }
                    }
                    </style>
                `);
            }
            
            // Erweiterte Formularvalidierung
            if(!name || !email || !subject || !message) {
                showFormResponse('Bitte füllen Sie alle Pflichtfelder aus.', false);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }
            
            // E-Mail-Format validieren
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showFormResponse('Bitte geben Sie eine gültige E-Mail-Adresse ein.', false);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }
            
            // Telefonnummer validieren (wenn eingegeben)
            if (phone && !/^[+\d\s()-]{5,20}$/.test(phone)) {
                showFormResponse('Bitte geben Sie eine gültige Telefonnummer ein oder lassen Sie das Feld leer.', false);
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
                return;
            }
            
            // Prepare order details
            let orderDetails = '';
            let productsHTML = '';
            
            if (cart.items.length > 0) {
                orderDetails = '\n\nAusgewählte Produkte:\n';
                
                cart.items.forEach(item => {
                    let price = item.variable ? 'Nach Aufwand' : cart.formatPrice(item.price);
                    if (item.recurring) {
                        price += item.recurring === 'monthly' ? '/Monat' : '/Jahr';
                    }
                    orderDetails += `- ${item.name}: ${price}`;
                    
                    productsHTML += `<tr>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${price}</td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${item.note || '-'}</td>
                    </tr>`;
                    
                    if (item.note) {
                        orderDetails += `\n  Bemerkung: ${item.note}`;
                    }
                    orderDetails += '\n';
                });
                
                if (cart.total > 0) {
                    orderDetails += `\nGesamtsumme: ${cart.formatPrice(cart.total)}`;
                    productsHTML += `<tr>
                        <td colspan="2" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Gesamtsumme:</td>
                        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${cart.formatPrice(cart.total)}</td>
                    </tr>`;
                }
            }
            
            // Complete message with order details
            const completeMessage = message + orderDetails;
              // Prepare email template parameters
            const templateParams = {
                from_name: name,
                from_email: email,
                from_phone: phone,
                subject: `Neue Anfrage von ${name}: ${subject}`,
                message: message,
                products_table: cart.items.length > 0 ? 
                    `<table style="width: 100%; border-collapse: collapse; margin-top: 20px; border: 1px solid #ddd;">
                        <tr style="background-color: #f2f2f2;">
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Produkt</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Preis</th>
                            <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Bemerkung</th>
                        </tr>
                        ${productsHTML}
                    </table>` : 'Keine Produkte ausgewählt',
                products_count: cart.items.length,
                total_amount: cart.formatPrice(cart.total),
                to_email: 'jontech@jonasrutz.ch' // Explizites Hinzufügen der Ziel-E-Mail-Adresse
            };            // showFormResponse wurde bereits oben definiert
            
            // Senden der E-Mail mit EmailJS
            emailjs.send(EMAIL_SERVICE_ID, EMAIL_TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('E-Mail erfolgreich gesendet!', response.status, response.text);
                    
                    // Erfolgsbenachrichtigung mit schönem Dialog
                    showFormResponse(`Vielen Dank für Ihre Anfrage!<br><br>
                    Ihre Nachricht wurde erfolgreich an jontech@jonasrutz.ch gesendet.<br>
                    Wir werden uns so schnell wie möglich bei Ihnen melden.<br><br>
                    Bei Rückfragen erreichen Sie uns auch telefonisch.`, true);
                    
                    // Reset form and cart
                    contactForm.reset();
                    cart.items = [];
                    cart.total = 0;
                    renderCart();
                    
                    // Submit-Button zurücksetzen
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }, function(error) {
                    console.log('E-Mail konnte nicht gesendet werden', error);
                    
                    // Fehlerbenachrichtigung mit schönem Dialog
                    showFormResponse('Es ist ein Fehler beim Senden Ihrer Nachricht aufgetreten. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns telefonisch.', false);
                    
                    // Submit-Button zurücksetzen
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                });
        });
    }
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            
            if(target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerHeight;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animation on Scroll (simple version)
    const animatedElements = document.querySelectorAll('.service-card, .advantage-card, .price-card');
    
    function checkIfInView() {
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150; // how many pixels of the element should be visible
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkIfInView);
    checkIfInView(); // Initial check
});
