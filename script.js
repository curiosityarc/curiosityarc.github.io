// Countdown Timer
const launchDate = new Date('2025-06-01T00:00:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

    if (distance < 0) {
        clearInterval(countdownTimer);
        document.querySelector('.countdown-timer').innerHTML = '<h3>We Are Live!</h3>';
    }
}

// Initialize countdown
const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

// Email Subscription Form
document.getElementById('subscribe-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    // Here you would typically send this to your backend
    console.log('Subscription request:', email);
    
    // Show success message
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Subscribed!';
    button.style.backgroundColor = 'var(--secondary-color)';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = 'var(--primary-color)';
        this.reset();
    }, 3000);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// Performance Optimizations
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for lazy loading and animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Stop observing once animation is triggered
        }
    });
}, observerOptions);

// Add animation classes to elements
document.querySelectorAll('.involvement-card, .countdown-item').forEach(el => {
    observer.observe(el);
});

// Handle form submission errors gracefully
window.addEventListener('error', function(e) {
    console.error('Global error handler:', e.error);
    // Prevent default error alerts
    return false;
});

// Add loading state to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        if (!this.closest('form') || this.closest('form').checkValidity()) {
            this.classList.add('loading');
        }
    });
});