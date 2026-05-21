/**
 * Saadias Saloon - Premium Beauty & Hair Salon Website Controller
 * Developed with vanilla JS for high performance, smooth animations, and zero dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Components
    initSpaRouter();
    initMobileDrawer();
    initScrollHeader();
    initBeforeAfterSlider();
    initServiceFilters();
    initFaqAccordion();
    initAppointmentForm();
    initWhatsAppWidget();
    initBookingShortcuts();
    initAutoScroll();
    initProductFilters();
});

/* ==========================================================================
   1. VANILLA SPA ROUTER
   ========================================================================== */
function initSpaRouter() {
    class SpaRouter {
        constructor() {
            this.routes = ['home', 'about', 'services', 'products', 'book', 'contact'];
            this.defaultRoute = 'home';
            this.handleRouting();
            
            // Listen to route changes
            window.addEventListener('hashchange', () => this.handleRouting());
        }

        handleRouting() {
            let hash = window.location.hash.substring(1) || this.defaultRoute;
            
            // Fallback for invalid hashes
            if (!this.routes.includes(hash)) {
                hash = this.defaultRoute;
                window.location.hash = '#' + this.defaultRoute;
                return;
            }

            // Hide all sections, show target section
            this.routes.forEach(route => {
                const section = document.getElementById(route);
                if (section) {
                    section.classList.remove('active');
                }
            });

            const activeSection = document.getElementById(hash);
            if (activeSection) {
                activeSection.classList.add('active');
                // Scroll to top immediately on page change
                window.scrollTo({ top: 0, behavior: 'instant' });
            }

            // Update Navigation Menu items
            this.updateNavState(hash);
        }

        updateNavState(activeHash) {
            // Update desktop nav
            const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
            desktopLinks.forEach(link => {
                const route = link.getAttribute('href').substring(1);
                if (route === activeHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update mobile drawer link highlights
            const mobileLinks = document.querySelectorAll('.mobile-link');
            mobileLinks.forEach(link => {
                const route = link.getAttribute('href').substring(1);
                if (route === activeHash) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });

            // Update mobile bottom nav bar
            const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
            bottomNavItems.forEach(item => {
                const route = item.getAttribute('href').substring(1);
                if (route === activeHash) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }

        // Method to switch views and trigger service filters automatically
        setServiceFilter(filterName) {
            // Wait brief moment for DOM routing to complete
            setTimeout(() => {
                const filterBtn = document.querySelector(`.tab-btn[data-filter="${filterName}"]`);
                if (filterBtn) {
                    filterBtn.click();
                }
            }, 100);
        }
    }

    // Attach to global window object so HTML inline onclick handlers can call it
    window.appRouter = new SpaRouter();
}

/* ==========================================================================
   2. MOBILE NAV DRAWER TOGGLE
   ========================================================================== */
function initMobileDrawer() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const openDrawer = () => {
        mobileDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Stop background scrolling
    };

    const closeDrawer = () => {
        mobileDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
        document.body.style.overflow = ''; // Restore scrolling
    };

    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
    if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

    // Close drawer upon clicking any links
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });
}

/* ==========================================================================
   3. STICKY HEADER SCROLL OBSERVER
   ========================================================================== */
function initScrollHeader() {
    const mainHeader = document.getElementById('mainHeader');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });
}

/* ==========================================================================
   4. BEFORE/AFTER INTERACTIVE SLIDER
   ========================================================================== */
function initBeforeAfterSlider() {
    const slider = document.getElementById('baSlider');
    const afterImgContainer = document.getElementById('afterImgContainer');
    const handle = document.getElementById('sliderHandle');

    if (!slider || !afterImgContainer || !handle) return;

    let isDragging = false;

    const moveSlider = (clientX) => {
        const rect = slider.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        let percentage = (offsetX / rect.width) * 100;

        // Constraint boundaries
        if (percentage < 0) percentage = 0;
        if (percentage > 100) percentage = 100;

        // Apply visual updates via custom property
        slider.style.setProperty('--slider-pos', `${percentage}%`);
    };

    // Mouse events
    slider.addEventListener('mousedown', (e) => {
        isDragging = true;
        moveSlider(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        moveSlider(e.clientX);
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Touch events for mobile screens
    slider.addEventListener('touchstart', (e) => {
        isDragging = true;
        moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        moveSlider(e.touches[0].clientX);
    });

    window.addEventListener('touchend', () => {
        isDragging = false;
    });
}

/* ==========================================================================
   5. SERVICES TAB FILTER SYSTEM
   ========================================================================== */
/* ==========================================================================
   5. SERVICES TAB FILTER SYSTEM & MAKEUP PALETTE INTERACTION
   ========================================================================== */
function initServiceFilters() {
    const tabBtns = document.querySelectorAll('#servicesTabs .tab-btn');
    const serviceCards = document.querySelectorAll('#serviceCardsGrid .service-card');
    const paletteMirror = document.getElementById('paletteMirror');

    if (tabBtns.length === 0 || serviceCards.length === 0) return;

    // Function to update the center mirror with details of a chosen card
    function updateMirror(card) {
        if (!paletteMirror) return;
        
        // Remove active-pan class from all cards
        serviceCards.forEach(c => c.classList.remove('active-pan'));
        
        // Add active-pan class to selected card
        card.classList.add('active-pan');

        // Extract detail elements from HTML structures inside the card
        const title = card.querySelector('h3').textContent;
        const price = card.querySelector('.price-tag').textContent;
        const desc = card.querySelector('.service-desc').textContent;
        const duration = card.querySelector('.duration').textContent;
        const bookBtn = card.querySelector('.btn-outline');
        const serviceName = bookBtn ? bookBtn.getAttribute('data-service') : title;
        const imgSrc = card.querySelector('.service-card-img img').getAttribute('src');

        // Render mirror content with a reflection image inside the vanity border
        paletteMirror.innerHTML = `
            <img class="mirror-bg-image fade-in" src="${imgSrc}" alt="${title} preview">
            <div class="mirror-content fade-in">
                <span class="mirror-price">${price}</span>
                <h3>${title}</h3>
                <span class="mirror-duration"><i class="far fa-clock"></i> ${duration}</span>
                <p>${desc}</p>
                <a href="#book" class="btn btn-primary btn-sm mirror-book-btn" onclick="document.querySelector('#appointmentService').value = '${serviceName}'; window.location.hash = '#book';">Book Now</a>
            </div>
        `;
    }

    // Radial arrangement logic for desktop
    function arrangePans() {
        if (window.innerWidth <= 768) {
            // On mobile: force all cards back into normal grid flow
            // (override any inline styles set by the desktop orbit logic)
            serviceCards.forEach(card => {
                card.style.position = 'relative';
                card.style.left = '';
                card.style.top = '';
                card.style.transform = '';
            });
            return;
        }

        const visiblePans = Array.from(serviceCards).filter(card => card.style.display !== 'none');
        const count = visiblePans.length;
        const radius = 220; // Coordinates layout radius from center mirror

        visiblePans.forEach((pan, index) => {
            // angle is divided by total items. Offset by -90deg (Math.PI / 2) so first is at top
            const angle = (index * 2 * Math.PI) / count - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            pan.style.position = 'absolute';
            // Align center of 120px diameter pan to coordinate points
            pan.style.left = `calc(50% + ${x}px - 60px)`;
            pan.style.top = `calc(50% + ${y}px - 60px)`;
        });
    }

    // Set first card active as initial state
    const initialActive = Array.from(serviceCards).find(c => c.style.display !== 'none');
    if (initialActive) {
        updateMirror(initialActive);
    }

    // Listeners for hover/click on the pans
    serviceCards.forEach(card => {
        // Desktop updates mirror on hover for rich interactive preview feel
        card.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                updateMirror(card);
            }
        });

        // Mobile & Desktop update mirror on click
        card.addEventListener('click', (e) => {
            // Don't trigger if click is on the booking button itself
            if (e.target.classList.contains('mirror-book-btn')) return;
            updateMirror(card);
        });
    });

    // Filtering tabs event handlers
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class on tab buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            serviceCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.animate([
                        { opacity: 0, transform: 'scale(0.92)' },
                        { opacity: 1, transform: 'scale(1)' }
                    ], {
                        duration: 350,
                        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        fill: 'forwards'
                    });
                } else {
                    card.style.display = 'none';
                }
            });

            // Recalculate orbits after CSS display changes apply
            setTimeout(arrangePans, 50);

            // Re-select first visible card in filtered set to populate the mirror
            setTimeout(() => {
                const firstVisible = Array.from(serviceCards).find(c => c.style.display !== 'none');
                if (firstVisible) {
                    updateMirror(firstVisible);
                }
            }, 100);
        });
    });

    // Run arrangement initially and update on screen size resize events
    arrangePans();
    window.addEventListener('resize', arrangePans);
}

/* ==========================================================================
   6. FAQ ACCORDION COLLAPSE/REVEAL
   ========================================================================== */
function initFaqAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const isActive = item.classList.contains('active');

            // Close all items
            document.querySelectorAll('.accordion-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.accordion-content').style.maxHeight = null;
            });

            // Toggle selected item
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
}

/* ==========================================================================
   7. RESERVATION FORM HANDLING & WHATSAPP REDIRECTION
   ========================================================================== */
function initAppointmentForm() {
    const form = document.getElementById('appointmentForm');
    const whatsappSubmitBtn = document.getElementById('whatsappSubmitBtn');
    
    // Modal Selectors
    const successModalOverlay = document.getElementById('successModalOverlay');
    const successClientName = document.getElementById('successClientName');
    const successServiceName = document.getElementById('successServiceName');
    const successDate = document.getElementById('successDate');
    const successTime = document.getElementById('successTime');
    const successWhatsappBtn = document.getElementById('successWhatsappBtn');
    const successCloseBtn = document.getElementById('successCloseBtn');

    if (!form) return;

    const salonPhone = '923001234567'; // WhatsApp Phone Placeholder

    // Function to generate the prefilled WhatsApp API message
    const generateWhatsAppUrl = (data) => {
        const dateObj = new Date(data.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        
        let messageText = `🌸 *Saadias Saloon - Appointment Booking* 🌸\n\n`;
        messageText += `*Client Name:* ${data.name}\n`;
        messageText += `*Phone Number:* ${data.phone}\n`;
        messageText += `*Requested Service:* ${data.service}\n`;
        messageText += `*Preferred Date:* ${formattedDate}\n`;
        messageText += `*Preferred Time:* ${data.time}\n`;
        
        if (data.notes.trim()) {
            messageText += `*Special Request:* ${data.notes}\n`;
        }
        
        messageText += `\n_Please confirm if this slot is available. Thank you!_`;
        
        return `https://api.whatsapp.com/send?phone=${salonPhone}&text=${encodeURIComponent(messageText)}`;
    };

    // Extract Form Values
    const getFormData = () => {
        return {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            service: document.getElementById('bookingService').value,
            date: document.getElementById('bookingDate').value,
            time: document.getElementById('bookingTime').value,
            notes: document.getElementById('specialNotes').value
        };
    };

    // Standard form submission (Triggers Success Popup)
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const data = getFormData();
        const whatsappUrl = generateWhatsAppUrl(data);

        // Fill data in confirmation modal card
        successClientName.textContent = data.name;
        successServiceName.textContent = data.service;
        
        const dateObj = new Date(data.date);
        successDate.textContent = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        successTime.textContent = data.time;
        
        // Bind WhatsApp redirect link to Modal CTA
        successWhatsappBtn.href = whatsappUrl;

        // Open Modal
        successModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Close Modal event listener
    const closeModal = () => {
        successModalOverlay.classList.remove('open');
        document.body.style.overflow = '';
        form.reset(); // Reset form elements
    };

    if (successCloseBtn) successCloseBtn.addEventListener('click', closeModal);
    if (successWhatsappBtn) successWhatsappBtn.addEventListener('click', closeModal);

    // Direct WhatsApp booking shortcut button
    if (whatsappSubmitBtn) {
        whatsappSubmitBtn.addEventListener('click', () => {
            // Trigger browser form validation first
            if (form.checkValidity()) {
                const data = getFormData();
                const whatsappUrl = generateWhatsAppUrl(data);
                window.open(whatsappUrl, '_blank');
                form.reset();
            } else {
                form.reportValidity();
            }
        });
    }
}

/* ==========================================================================
   8. FLOATING WHATSAPP CHAT WIDGET CONTROL
   ========================================================================== */
function initWhatsAppWidget() {
    const trigger = document.getElementById('whatsappWidgetTrigger');
    const chatBox = document.getElementById('whatsappChatBox');
    const closeBtn = document.getElementById('chatCloseBtn');

    if (!trigger || !chatBox) return;

    trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        chatBox.classList.toggle('open');
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatBox.classList.remove('open');
        });
    }

    // Close chatbox when clicking outside
    document.addEventListener('click', (e) => {
        if (!chatBox.contains(e.target) && e.target !== trigger) {
            chatBox.classList.remove('open');
        }
    });
}

/* ==========================================================================
   9. QUICK SERVICE TO BOOKING SHORCUT FLOW
   ========================================================================== */
function initBookingShortcuts() {
    const shortcuts = document.querySelectorAll('.book-shortcut');
    const serviceSelect = document.getElementById('bookingService');

    shortcuts.forEach(button => {
        button.addEventListener('click', () => {
            const serviceName = button.getAttribute('data-service');
            if (serviceSelect && serviceName) {
                // Find matching option in select
                for (let option of serviceSelect.options) {
                    if (option.value === serviceName) {
                        option.selected = true;
                        break;
                    }
                }
            }
        });
    });
}

/* ==========================================================================
   10. AUTO-SCROLL FOR MOBILE CAROUSELS (SERVICES & TESTIMONIALS)
   ========================================================================== */
function initAutoScroll() {
    const carousels = [
        { element: document.querySelector('.services-teaser') },
        { element: document.querySelector('.testimonials-container') }
    ];

    carousels.forEach(carousel => {
        const el = carousel.element;
        if (!el) return;

        let scrollSpeed = 1; // Pixels to scroll per tick
        let direction = 1; // 1 = right, -1 = left
        let isUserInteracting = false;
        let autoScrollInterval = null;

        const startAutoScroll = () => {
            autoScrollInterval = setInterval(() => {
                if (isUserInteracting) return;
                
                // Only auto scroll on mobile screen sizes (when overflow layout is active)
                if (window.innerWidth > 768) return;

                const maxScrollLeft = el.scrollWidth - el.clientWidth;
                
                // Bounce back-and-forth at ends
                if (el.scrollLeft >= maxScrollLeft - 1 && direction === 1) {
                    direction = -1;
                } else if (el.scrollLeft <= 1 && direction === -1) {
                    direction = 1;
                }

                el.scrollLeft += scrollSpeed * direction;
            }, 35); // Smooth scrolling step duration
        };

        const stopAutoScroll = () => {
            clearInterval(autoScrollInterval);
        };

        // Event listeners to pause scroll during manual swipe
        const handleInteractionStart = () => {
            isUserInteracting = true;
            stopAutoScroll();
        };

        const handleInteractionEnd = () => {
            isUserInteracting = false;
            startAutoScroll();
        };

        el.addEventListener('touchstart', handleInteractionStart, { passive: true });
        el.addEventListener('touchend', handleInteractionEnd, { passive: true });
        el.addEventListener('mousedown', handleInteractionStart);
        el.addEventListener('mouseup', handleInteractionEnd);
        el.addEventListener('mouseleave', handleInteractionEnd);

        // Start scrolling on load
        startAutoScroll();
    });
}

/* ==========================================================================
   PRODUCT FILTER TABS
   ========================================================================== */
function initProductFilters() {
    const tabBtns = document.querySelectorAll('.prod-tab-btn');
    const cards   = document.querySelectorAll('#productsGrid .product-card');

    if (!tabBtns.length || !cards.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active tab highlight
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            cards.forEach(card => {
                const cat  = card.getAttribute('data-prod-category');
                const show = filter === 'all' || cat === filter;

                if (show) {
                    card.style.display = '';
                    card.animate(
                        [{ opacity: 0, transform: 'scale(0.94)' },
                         { opacity: 1, transform: 'scale(1)' }],
                        { duration: 320, easing: 'cubic-bezier(0.16,1,0.3,1)', fill: 'forwards' }
                    );
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
