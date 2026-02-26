// ========================================
// MODERN WEDDING WEBSITE - JAVASCRIPT
// ========================================

// ========================================
// CUSTOM CURSOR (DESKTOP ONLY)
// ========================================
if (!('ontouchstart' in window) && window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    const cursorDot = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);
    
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });
    
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Cursor effects on hover
    document.querySelectorAll('a, button, .gallery-item, .detail-card, .story-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

// ========================================
// FLOATING PARTICLES BACKGROUND
// ========================================
function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    document.querySelector('.hero')?.appendChild(particlesContainer);
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}
createFloatingParticles();

// ========================================
// TEXT REVEAL ANIMATION
// ========================================
function initTextReveal() {
    const textElements = document.querySelectorAll('.section-title, .couple-names');
    
    textElements.forEach(element => {
        const text = element.textContent;
        element.innerHTML = '';
        
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.animation = `revealText 0.5s ease forwards ${i * 0.03}s`;
            element.appendChild(span);
        });
    });
}

const textRevealStyle = document.createElement('style');
textRevealStyle.textContent = `
    @keyframes revealText {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(textRevealStyle);

setTimeout(initTextReveal, 500);

// ========================================
// PERFORMANCE: PRELOAD HERO IMAGE
// ========================================
(function() {
    // Preload hero background image
    const isMobile = window.innerWidth <= 768;
    const heroImage = new Image();
    heroImage.src = isMobile ? 
        'images/optimized/hero-bg-mobile.jpg' : 
        'images/optimized/hero-bg.jpg';
    
    heroImage.onload = function() {
        document.querySelector('.hero')?.classList.add('loaded');
    };
    
    // Fallback: show image after 2 seconds even if not fully loaded
    setTimeout(() => {
        document.querySelector('.hero')?.classList.add('loaded');
    }, 2000);
})();

// ========================================
// SMOOTH SCROLLING
// ========================================

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navMenu.classList.remove('active');
        }
    });
});

// ========================================
// NAVIGATION
// ========================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Show navbar on scroll
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function updateActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(l => l.classList.remove('active'));
            link?.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ========================================
// COUNTDOWN TIMER
// ========================================
function updateCountdown() {
    const weddingDate = new Date('2026-04-11T18:00:00').getTime();
    const now = new Date().getTime();
    const distance = weddingDate - now;
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Check if elements exist
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) {
        console.error('Countdown elements not found');
        return;
    }
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p style="color: #8b7355; font-size: 1.5rem;">The big day is here! 🎉</p>';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    // Store old values for animation
    const oldSeconds = secondsEl.textContent;
    const oldMinutes = minutesEl.textContent;
    const oldHours = hoursEl.textContent;
    const oldDays = daysEl.textContent;
    
    // Update values
    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Animate if changed
    if (oldSeconds !== secondsEl.textContent) animateCountdownNumber(secondsEl);
    if (oldMinutes !== minutesEl.textContent) animateCountdownNumber(minutesEl);
    if (oldHours !== hoursEl.textContent) animateCountdownNumber(hoursEl);
    if (oldDays !== daysEl.textContent) animateCountdownNumber(daysEl);
}

// Initialize countdown when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
} else {
    // DOM already loaded
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ========================================
// MUSIC PLAYER
// ========================================
const musicToggle = document.getElementById('musicToggle');
let isPlaying = false;

// Background music setup
const audio = new Audio('https://www.bensound.com/bensound-music/bensound-memories.mp3');
audio.loop = true;
audio.volume = 0.5; // Set volume to 50%

// Auto-play music on page load (with user interaction fallback)
document.addEventListener('DOMContentLoaded', () => {
    // Try to auto-play
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
        playPromise.then(() => {
            isPlaying = true;
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(() => {
            // Auto-play blocked, wait for user interaction
            document.body.addEventListener('click', () => {
                if (!isPlaying) {
                    audio.play();
                    isPlaying = true;
                    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
                }
            }, { once: true });
        });
    }
});

musicToggle?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
        audio.pause();
        musicToggle.innerHTML = '<i class="fas fa-music"></i>';
        isPlaying = false;
    } else {
        audio.play();
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        isPlaying = true;
    }
});

// ========================================
// ENHANCED GALLERY WITH TOUCH SUPPORT
// ========================================
const galleryGrid = document.getElementById('galleryGrid');
const galleryToggle = document.getElementById('galleryToggle');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
const images = Array.from(galleryItems).map(item => item.querySelector('img').src);

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

galleryToggle?.addEventListener('click', () => {
    const isCollapsed = galleryGrid?.classList.contains('is-collapsed');
    if (!galleryGrid) return;
    galleryGrid.classList.toggle('is-collapsed');
    const expanded = !isCollapsed;
    galleryToggle.setAttribute('aria-expanded', String(expanded));
    galleryToggle.textContent = expanded ? 'Show Fewer Photos' : 'View All Photos';
});

// Add hover effect for gallery items (desktop)
galleryItems.forEach((item, index) => {
    // Click to open lightbox
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(images[index]);
    });
    
    // Hover zoom effect (desktop only)
    if (!('ontouchstart' in window)) {
        item.addEventListener('mouseenter', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1.1)';
            img.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
        
        item.addEventListener('mouseleave', () => {
            const img = item.querySelector('img');
            img.style.transform = 'scale(1)';
        });
    }
});

function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.9)';
    setTimeout(() => {
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
        lightboxImage.style.transition = 'all 0.3s ease-out';
    }, 10);
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateLightboxImage();
}

function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateLightboxImage();
}

function updateLightboxImage() {
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.95)';
    setTimeout(() => {
        lightboxImage.src = images[currentImageIndex];
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 150);
}

lightboxClose?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

lightboxPrev?.addEventListener('click', showPrevImage);
lightboxNext?.addEventListener('click', showNextImage);

// Touch swipe for lightbox (mobile)
lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next image
            showNextImage();
        } else {
            // Swipe right - previous image
            showPrevImage();
        }
    }
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
    }
});

// ========================================
// RSVP FORM
// ========================================
const rsvpForm = document.getElementById('rsvpForm');
const rsvpMessage = document.getElementById('rsvpMessage');

// Security: Rate limiting for form submission
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 60000; // 1 minute cooldown

rsvpForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Security: Rate limiting check
    const now = Date.now();
    if (now - lastSubmitTime < SUBMIT_COOLDOWN) {
        const waitTime = Math.ceil((SUBMIT_COOLDOWN - (now - lastSubmitTime)) / 1000);
        rsvpMessage.className = 'rsvp-message error';
        rsvpMessage.textContent = `⏱️ Please wait ${waitTime} seconds before submitting again.`;
        return;
    }
    
    // Get form data
    const formData = new FormData(rsvpForm);
    const data = Object.fromEntries(formData);
    
    // Security: Sanitize all form inputs
    for (const key in data) {
        if (typeof data[key] === 'string') {
            const tempDiv = document.createElement('div');
            tempDiv.textContent = data[key];
            data[key] = tempDiv.innerHTML;
        }
    }
    
    // Show loading state
    const submitButton = rsvpForm.querySelector('.submit-button');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;
    
    // Update last submit time
    lastSubmitTime = now;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Success message
        rsvpMessage.className = 'rsvp-message success';
        rsvpMessage.textContent = '✨ Thank you for your RSVP! We look forward to celebrating with you!';
        
        // Reset form
        rsvpForm.reset();
        
        // Reset button
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            rsvpMessage.className = 'rsvp-message';
        }, 5000);
    }, 2000);
    
    // For actual implementation, use fetch API:
    /*
    try {
        const response = await fetch('YOUR_API_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            rsvpMessage.className = 'rsvp-message success';
            rsvpMessage.textContent = '✨ Thank you for your RSVP!';
            rsvpForm.reset();
        } else {
            throw new Error('Failed to submit');
        }
    } catch (error) {
        rsvpMessage.className = 'rsvp-message error';
        rsvpMessage.textContent = '❌ Something went wrong. Please try again.';
    } finally {
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }
    */
});

// ========================================
// ENHANCED INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

// Different animation types
const animationTypes = {
    fadeUp: { opacity: '0', transform: 'translateY(50px)' },
    fadeDown: { opacity: '0', transform: 'translateY(-50px)' },
    fadeLeft: { opacity: '0', transform: 'translateX(-50px)' },
    fadeRight: { opacity: '0', transform: 'translateX(50px)' },
    scaleUp: { opacity: '0', transform: 'scale(0.9)' },
    rotateIn: { opacity: '0', transform: 'rotate(-5deg) scale(0.95)' }
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Staggered animation delay
            setTimeout(() => {
                entry.target.classList.add('animate-in');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) translateX(0) scale(1) rotate(0)';
            }, index * 100); // 100ms delay between each element
            
            // Unobserve after animation
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply animations to elements
document.addEventListener('DOMContentLoaded', () => {
    // Story cards - make them visible immediately, no animation hiding
    document.querySelectorAll('.story-card').forEach((el, i) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Detail cards - scale up
    document.querySelectorAll('.detail-card').forEach((el, i) => {
        Object.assign(el.style, animationTypes.scaleUp);
        el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.transitionDelay = `${i * 0.15}s`;
        observer.observe(el);
    });
    
    // Timeline items - alternating left/right
    document.querySelectorAll('.timeline-item').forEach((el, i) => {
        const anim = i % 2 === 0 ? animationTypes.fadeLeft : animationTypes.fadeRight;
        Object.assign(el.style, anim);
        el.style.transition = 'all 0.7s ease-out';
        el.style.transitionDelay = `${i * 0.1}s`;
        observer.observe(el);
    });
    
    // Gallery items - staggered fade up
    document.querySelectorAll('.gallery-item').forEach((el, i) => {
        Object.assign(el.style, animationTypes.fadeUp);
        el.style.transition = 'all 0.5s ease-out';
        el.style.transitionDelay = `${i * 0.05}s`;
        observer.observe(el);
    });
    
    // Section headers - always visible
    document.querySelectorAll('.section-header').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'none';
    });
    
    // Story image container - make visible
    const storyImageContainer = document.querySelector('.story-image-container');
    if (storyImageContainer) {
        storyImageContainer.style.opacity = '1';
        storyImageContainer.style.transform = 'none';
    }
});

// ========================================
// ENHANCED PARALLAX & SCROLL EFFECTS
// ========================================
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const heroContent = document.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
                heroContent.style.opacity = 1 - scrolled / 600;
            }
            
            // Floating ornaments
            const ornaments = document.querySelectorAll('.ornament-top, .ornament-bottom');
            ornaments.forEach((ornament, i) => {
                if (ornament) {
                    const speed = i % 2 === 0 ? 0.3 : -0.3;
                    ornament.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
                }
            });
            
            // Image parallax for story section
            const storyImage = document.querySelector('.story-image');
            if (storyImage) {
                const rect = storyImage.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    const offset = (window.innerHeight - rect.top) * 0.1;
                    storyImage.style.transform = `translateY(${offset}px) scale(1.05)`;
                }
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// ========================================
// PRELOADER (Optional)
// ========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ========================================
// CONSOLE MESSAGE
// ========================================
console.log('%c💍 Congratulations to Vijay & Bindiya! 💍', 
    'font-size: 20px; font-weight: bold; color: #8b7355;');
console.log('%cWebsite designed with love ❤️', 
    'font-size: 14px; color: #6b6b6b;');

// ========================================
// CARD TILT EFFECT (Desktop Only)
// ========================================
if (!('ontouchstart' in window)) {
    document.querySelectorAll('.detail-card, .story-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'transform 0.1s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            card.style.transition = 'transform 0.5s ease';
        });
    });
}

// ========================================
// MOBILE: PULL-TO-REFRESH INDICATOR
// ========================================
if ('ontouchstart' in window) {
    let pullStartY = 0;
    let pullMoveY = 0;
    
    document.addEventListener('touchstart', (e) => {
        if (window.pageYOffset === 0) {
            pullStartY = e.touches[0].screenY;
        }
    }, { passive: true });
    
    document.addEventListener('touchmove', (e) => {
        if (window.pageYOffset === 0 && pullStartY > 0) {
            pullMoveY = e.touches[0].screenY;
            const pullDistance = pullMoveY - pullStartY;
            
            if (pullDistance > 0 && pullDistance < 100) {
                document.body.style.transform = `translateY(${pullDistance * 0.3}px)`;
                document.body.style.transition = 'none';
            }
        }
    }, { passive: true });
    
    document.addEventListener('touchend', () => {
        document.body.style.transform = 'translateY(0)';
        document.body.style.transition = 'transform 0.3s ease';
        pullStartY = 0;
        pullMoveY = 0;
    }, { passive: true });
}

// ========================================
// COUNTDOWN ANIMATION HELPER
// ========================================
function animateCountdownNumber(element) {
    element.style.transform = 'scale(1.2)';
    element.style.color = 'var(--secondary-color)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

// ========================================
// BUTTON RIPPLE EFFECT
// ========================================
document.querySelectorAll('button, .btn, .detail-button, .save-date-button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            top: ${y}px;
            left: ${x}px;
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// SMOOTH SCROLL PROGRESS INDICATOR
// ========================================
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
    z-index: 9999;
    transition: width 0.2s ease;
    box-shadow: 0 2px 5px rgba(139, 115, 85, 0.3);
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
}, { passive: true });

// ========================================
// ACTIVE SECTION HIGHLIGHT
// ========================================
const navLinksArray = document.querySelectorAll('.nav-link');
const sectionsArray = document.querySelectorAll('section[id]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset + 150;
    
    sectionsArray.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinksArray.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightActiveSection, { passive: true });

// ========================================
// MAGNETIC BUTTONS (DESKTOP ONLY)
// ========================================
if (!('ontouchstart' in window)) {
    document.querySelectorAll('.save-date-button, .detail-button, .cta-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ========================================
// GRADIENT ANIMATION ON SCROLL
// ========================================
let gradientOffset = 0;
function animateGradients() {
    gradientOffset += 0.5;
    document.querySelectorAll('.story-icon, .timeline-icon').forEach(icon => {
        icon.style.backgroundPosition = `${gradientOffset}% 50%`;
    });
    requestAnimationFrame(animateGradients);
}
animateGradients();

// ========================================
// SMOOTH SECTION TRANSITIONS
// ========================================
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
    sectionObserver.observe(section);
});

// ========================================
// PARALLAX MOUSE MOVEMENT (DESKTOP)
// ========================================
if (!('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.querySelectorAll('.story-icon, .detail-icon').forEach((icon, i) => {
            const speed = (i % 2 === 0) ? 1 : -1;
            icon.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
        });
    });
}

// ========================================
// IMAGE LAZY LOAD WITH BLUR EFFECT
// ========================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.filter = 'blur(0)';
            img.style.opacity = '1';
            imageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.gallery-item img, .story-image').forEach(img => {
    img.style.filter = 'blur(10px)';
    img.style.transition = 'filter 0.8s ease, opacity 0.8s ease';
    imageObserver.observe(img);
});

// ========================================
// LOADING ANIMATION
// ========================================
window.addEventListener('load', () => {
    const loader = document.createElement('div');
    loader.className = 'page-loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="loader-ring"></div>
            <div class="loader-text">V & B</div>
        </div>
    `;
    document.body.insertBefore(loader, document.body.firstChild);
    
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }, 1500);
});

// ========================================
// 3D TILT EFFECT ON CARDS (DESKTOP)
// ========================================
if (!('ontouchstart' in window)) {
    document.querySelectorAll('.detail-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
        });
    });
}

// ========================================
// SMOOTH REVEAL ON SCROLL
// ========================================
const revealElements = document.querySelectorAll('.detail-card, .gallery-item');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
    revealObserver.observe(el);
});