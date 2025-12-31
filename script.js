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
        }
    });
});

// Active navigation highlighting
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('#navbar a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// RSVP Form Handling
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        guests: document.getElementById('guests').value,
        attendance: document.getElementById('attendance').value,
        message: document.getElementById('message').value
    };
    
    // Display success message
    const form = e.target;
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        padding: 20px;
        background: #4CAF50;
        color: white;
        border-radius: 8px;
        margin-top: 20px;
        text-align: center;
        font-weight: bold;
    `;
    successMessage.textContent = 'Thank you for your RSVP! We look forward to celebrating with you! 💕';
    
    // Clear form
    form.reset();
    
    // Insert success message
    form.appendChild(successMessage);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
    
    // Here you would typically send the data to a server
    console.log('RSVP Data:', formData);
    
    // You can integrate with services like:
    // - Google Forms
    // - Formspree
    // - EmailJS
    // - Your own backend server
});

// Add animation to gallery items on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe gallery items
document.querySelectorAll('.gallery-item').forEach(item => {
    observer.observe(item);
});

// Countdown Timer (Optional - uncomment and set your wedding date)
/*
function updateCountdown() {
    const weddingDate = new Date('2025-12-31T18:00:00'); // Set your wedding date here
    const now = new Date();
    const diff = weddingDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        document.querySelector('.date-info').textContent = 
            `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    } else {
        document.querySelector('.date-info').textContent = 'The big day is here! 🎉';
    }
}

// Update countdown every second
setInterval(updateCountdown, 1000);
updateCountdown();
*/
