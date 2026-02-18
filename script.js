// ========================================
// MODERN WEDDING WEBSITE - JAVASCRIPT
// ========================================

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
    
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '';
        return;
    }
    
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second
updateCountdown();
setInterval(updateCountdown, 1000);

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
// GALLERY LIGHTBOX
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

galleryToggle?.addEventListener('click', () => {
    const isCollapsed = galleryGrid?.classList.contains('is-collapsed');
    if (!galleryGrid) return;
    galleryGrid.classList.toggle('is-collapsed');
    const expanded = !isCollapsed;
    galleryToggle.setAttribute('aria-expanded', String(expanded));
    galleryToggle.textContent = expanded ? 'Show Fewer Photos' : 'View All Photos';
});

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(images[index]);
    });
});

function openLightbox(src) {
    lightboxImage.src = src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose?.addEventListener('click', closeLightbox);

lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

lightboxPrev?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    lightboxImage.src = images[currentImageIndex];
});

lightboxNext?.addEventListener('click', () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    lightboxImage.src = images[currentImageIndex];
});

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') lightboxPrev.click();
        if (e.key === 'ArrowRight') lightboxNext.click();
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
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.story-card, .detail-card, .timeline-item, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ========================================
// PARALLAX EFFECT
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    
    if (heroContent) {
        heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        heroContent.style.opacity = 1 - scrolled / 600;
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
// WEDDING RUNNER GAME (Wedding Subway Theme)
// ========================================
(function() {
  // DOM Elements
  const canvas = document.getElementById('weddingGameCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const startUI = document.getElementById('weddingGameStart');
  const overUI = document.getElementById('weddingGameOver');
  const startBtn = document.getElementById('weddingGameStartBtn');
  const restartBtn = document.getElementById('weddingGameRestartBtn');
  const playerInput = document.getElementById('weddingGamePlayer');
  const scoreSpan = document.getElementById('weddingGameScore');
  const highScoreSpan = document.getElementById('weddingGameHighScore');
  const finalScoreSpan = document.getElementById('weddingGameFinalScore');

  if (!canvas || !ctx) return;

  // Game State
  let gameState = 'start'; // start, running, over
  let playerName = '';
  let score = 0;
  let highScore = 0;
  let groom, bride, obstacles, collectibles, speed, frame, isJumping, jumpY, jumpV, groundY;

  // Load high score from localStorage
  function loadHighScore() {
    const hs = localStorage.getItem('weddingGameHighScore');
    return hs ? parseInt(hs, 10) : 0;
  }
  function saveHighScore(val) {
    localStorage.setItem('weddingGameHighScore', val);
  }

  // UI State
  function showStart() {
    startUI.classList.add('active');
    overUI.classList.remove('active');
    canvas.blur();
  }
  function showOver() {
    overUI.classList.add('active');
    startUI.classList.remove('active');
    finalScoreSpan.textContent = score;
    canvas.blur();
  }
  function hideUI() {
    startUI.classList.remove('active');
    overUI.classList.remove('active');
    canvas.focus();
  }

  // Game Entities
  function resetGame() {
    score = 0;
    speed = 6;
    frame = 0;
    isJumping = false;
    jumpY = 0;
    jumpV = 0;
    groundY = canvas.height - 80;
    groom = { x: 120, y: groundY, w: 48, h: 64, vy: 0 };
    bride = { x: 40, y: groundY, w: 48, h: 64, anim: 0 };
    obstacles = [];
    collectibles = [];
  }

  // Drawing helpers (SVG-like, but with canvas)
  function drawGroom(x, y) {
    // Body
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = '#2d3e50'; // suit
    ctx.fillRect(10, 20, 28, 36);
    ctx.fillStyle = '#fff'; // shirt
    ctx.fillRect(18, 20, 12, 36);
    ctx.fillStyle = '#c9a97e'; // face
    ctx.beginPath(); ctx.arc(24, 12, 12, 0, Math.PI*2); ctx.fill();
    // Bow tie
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(20, 32, 8, 6);
    // Legs
    ctx.fillStyle = '#2d3e50';
    ctx.fillRect(14, 56, 6, 16);
    ctx.fillRect(26, 56, 6, 16);
    ctx.restore();
  }
  function drawBride(x, y, anim) {
    ctx.save();
    ctx.translate(x, y);
    // Dress
    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.ellipse(24, 48, 22, 24, 0, 0, Math.PI*2); ctx.fill();
    // Face
    ctx.fillStyle = '#f7c9b6';
    ctx.beginPath(); ctx.arc(24, 16, 12, 0, Math.PI*2); ctx.fill();
    // Hair
    ctx.fillStyle = '#8b7355';
    ctx.beginPath(); ctx.arc(24, 10, 13, Math.PI, 2*Math.PI); ctx.fill();
    // Flower chain (animated)
    ctx.strokeStyle = '#d4a574';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(24, 32, 18 + Math.sin(anim/8)*2, Math.PI*0.7, Math.PI*0.3, false);
    ctx.stroke();
    ctx.restore();
  }
  function drawObstacle(obs) {
    ctx.save();
    ctx.translate(obs.x, obs.y);
    ctx.fillStyle = '#e6c9a8';
    ctx.fillRect(0, 0, obs.w, obs.h);
    ctx.fillStyle = '#fff';
    ctx.fillRect(4, 4, obs.w-8, obs.h-8);
    ctx.fillStyle = '#d4a574';
    ctx.fillRect(8, obs.h-12, obs.w-16, 8); // cake base
    ctx.restore();
  }
  function drawCollectible(col) {
    ctx.save();
    ctx.translate(col.x, col.y);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(12, 12, 10, 0, Math.PI*2);
    ctx.stroke();
    ctx.fillStyle = '#fffbe9';
    ctx.beginPath();
    ctx.arc(12, 12, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Game Loop
  function gameLoop() {
    if (gameState !== 'running') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Background
    ctx.fillStyle = '#fffbe9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Road
    ctx.fillStyle = '#e6c9a8';
    ctx.fillRect(0, groundY+60, canvas.width, 20);
    // Obstacles
    for (let obs of obstacles) drawObstacle(obs);
    // Collectibles
    for (let col of collectibles) drawCollectible(col);
    // Groom
    drawGroom(groom.x, groom.y + jumpY);
    // Bride (chasing)
    drawBride(bride.x, bride.y, frame);
    // Score
    ctx.font = 'bold 22px Montserrat, Arial';
    ctx.fillStyle = '#8b7355';
    ctx.fillText('Score: ' + score, 24, 36);
    ctx.fillText('High: ' + highScore, 680, 36);
    // Animate
    updateGame();
    frame++;
    requestAnimationFrame(gameLoop);
  }

  // Game Logic
  function updateGame() {
    // Move obstacles and collectibles
    for (let obs of obstacles) obs.x -= speed;
    for (let col of collectibles) col.x -= speed;
    // Remove off-screen
    obstacles = obstacles.filter(o => o.x + o.w > 0);
    collectibles = collectibles.filter(c => c.x + 24 > 0);
    // Add new obstacles
    if (frame % 90 === 0) {
      const h = 40 + Math.random()*40;
      obstacles.push({ x: 820, y: groundY+24-h, w: 36, h });
    }
    // Add collectibles
    if (frame % 150 === 0) {
      collectibles.push({ x: 820, y: groundY-24-Math.random()*60, r: 12 });
    }
    // Jump physics
    if (isJumping) {
      jumpY += jumpV;
      jumpV += 0.7;
      if (jumpY >= 0) {
        jumpY = 0;
        isJumping = false;
      }
    }
    // Collision with obstacles
    for (let obs of obstacles) {
      if (
        groom.x + groom.w > obs.x && groom.x < obs.x + obs.w &&
        groom.y + jumpY + groom.h > obs.y && groom.y + jumpY < obs.y + obs.h
      ) {
        endGame();
        return;
      }
    }
    // Collect collectibles
    for (let i = collectibles.length-1; i >= 0; i--) {
      let col = collectibles[i];
      if (
        groom.x + groom.w > col.x && groom.x < col.x + 24 &&
        groom.y + jumpY + groom.h > col.y && groom.y + jumpY < col.y + 24
      ) {
        score += 10;
        collectibles.splice(i, 1);
      }
    }
    // Bride chases groom
    if (bride.x < groom.x - 60) bride.x += 1.5;
    // Score and speed
    score += 1;
    if (score % 200 === 0) speed += 0.3;
    // Update UI
    scoreSpan.textContent = score;
    if (score > highScore) {
      highScore = score;
      highScoreSpan.textContent = highScore;
      saveHighScore(highScore);
    }
  }

  // Controls
  function jump() {
    if (!isJumping) {
      isJumping = true;
      jumpV = -13;
    }
  }
  canvas.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.key === ' ' || e.key === 'ArrowUp') {
      jump();
    }
  });
  canvas.addEventListener('touchstart', function(e) {
    jump();
  });
  canvas.addEventListener('mousedown', function(e) {
    jump();
  });

  // UI Events
  startBtn.addEventListener('click', function() {
    // Security: Sanitize and validate player name input
    const rawName = playerInput.value.trim();
    if (rawName.length < 2) {
      alert('Please enter at least 2 characters for your name');
      playerInput.focus();
      return;
    }
    if (rawName.length > 20) {
      alert('Name must be 20 characters or less');
      playerInput.focus();
      return;
    }
    
    // Security: Remove any HTML tags and special characters
    const tempDiv = document.createElement('div');
    tempDiv.textContent = rawName;
    playerName = tempDiv.innerHTML.replace(/[<>"'`]/g, '');
    
    highScore = loadHighScore();
    highScoreSpan.textContent = highScore;
    scoreSpan.textContent = 0;
    gameState = 'running';
    hideUI();
    resetGame();
    canvas.focus();
    requestAnimationFrame(gameLoop);
  });
  restartBtn.addEventListener('click', function() {
    gameState = 'running';
    hideUI();
    resetGame();
    canvas.focus();
    requestAnimationFrame(gameLoop);
  });

  function endGame() {
    gameState = 'over';
    showOver();
  }

  // Initial UI
  showStart();
})();
