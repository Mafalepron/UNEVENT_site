// ==== MAIN JAVASCRIPT FILE ====

// DOM Elements
const header = document.querySelector('.header');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Slideshow elements
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Video elements
const videoCards = document.querySelectorAll('.video-card');
const videoModal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.querySelector('.video-modal-close');

// Form elements
const contactForm = document.querySelector('.form');

// Current slide index
let currentSlide = 0;

// ==== INITIALIZATION ====
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initSlideshow();
    initVideoCards();
    initContactForm();
    initScrollAnimations();
    initSmoothScrolling();
    initHeaderScrollEffect();
});

// ==== NAVIGATION ====
function initNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', toggleMobileMenu);
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
}

function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// ==== HEADER SCROLL EFFECT ====
function initHeaderScrollEffect() {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ==== SLIDESHOW ====
function initSlideshow() {
    if (slides.length === 0) return;

    // Initialize first slide
    showSlide(0);

    // Navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });

    // Auto-play slideshow
    setInterval(() => {
        currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
        showSlide(currentSlide);
    }, 5000); // Change slide every 5 seconds

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(currentSlide);
        } else if (e.key === 'ArrowRight') {
            currentSlide = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
            showSlide(currentSlide);
        }
    });
}

function showSlide(index) {
    // Hide all slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) {
            dots[i].classList.remove('active');
        }
    });

    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
}

// ==== VIDEO MODAL ====
function initVideoCards() {
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            const videoSrc = this.getAttribute('data-video') || 'https://www.w3schools.com/html/mov_bbb.mp4';
            openVideoModal(videoSrc);
        });
    });

    // Close modal events
    if (modalClose) {
        modalClose.addEventListener('click', closeVideoModal);
    }

    if (videoModal) {
        videoModal.addEventListener('click', function(e) {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
        }
    });
}

function openVideoModal(videoSrc) {
    if (videoModal && modalVideo) {
        modalVideo.src = videoSrc;
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeVideoModal() {
    if (videoModal && modalVideo) {
        videoModal.classList.remove('active');
        modalVideo.pause();
        modalVideo.src = '';
        document.body.style.overflow = '';
    }
}

// ==== CONTACT FORM ====
function initContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const formFields = {};
    
    // Get form data
    for (let [key, value] of formData.entries()) {
        formFields[key] = value;
    }
    
    // Simple validation
    const requiredFields = ['name', 'email', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        if (!input || !input.value.trim()) {
            isValid = false;
            if (input) {
                input.style.borderColor = '#ef4444';
                setTimeout(() => {
                    input.style.borderColor = '';
                }, 3000);
            }
        }
    });
    
    if (!isValid) {
        showNotification('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailInput = contactForm.querySelector('[name="email"]');
    if (emailInput && !emailPattern.test(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
        showNotification('Пожалуйста, введите корректный email', 'error');
        setTimeout(() => {
            emailInput.style.borderColor = '';
        }, 3000);
        return;
    }
    
    // Simulate form submission
    showNotification('Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', 'success');
    contactForm.reset();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 2000;
        max-width: 400px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ==== SMOOTH SCROLLING ====
function initSmoothScrolling() {
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Smooth scroll for buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ==== SCROLL ANIMATIONS ====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Add staggered animation for grid items
                if (entry.target.closest('.services-grid') || 
                    entry.target.closest('.team-grid') || 
                    entry.target.closest('.video-grid')) {
                    const siblings = Array.from(entry.target.parentNode.children);
                    const index = siblings.indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    const animatedElements = document.querySelectorAll('.service-card, .team-member, .video-card, .contact-item');
    animatedElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
    
    // Observe section titles
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('scroll-reveal');
        observer.observe(title);
    });
}

// ==== UTILITY FUNCTIONS ====

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Add active class to current navigation item
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + header.offsetHeight + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`a[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

// Add scroll event listener with throttling
window.addEventListener('scroll', throttle(updateActiveNavigation, 100));

// ==== ACCESSIBILITY ENHANCEMENTS ====

// Skip to main content link
function addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#home';
    skipLink.textContent = 'Перейти к основному содержанию';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: var(--primary-blue);
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1000;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Initialize accessibility features
addSkipLink();

// ==== ERROR HANDLING ====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// ==== PERFORMANCE MONITORING ====
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart + 'ms');
        }, 0);
    });
}

// ==== SERVICE WORKER REGISTRATION (for future PWA features) ====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}
