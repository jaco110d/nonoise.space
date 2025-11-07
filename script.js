// Timeline Landing Page JavaScript

// Smooth scroll for anchor links
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

// Navbar background on scroll
let lastScroll = 0;
const nav = document.querySelector('.nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        nav.style.background = 'rgba(11, 11, 12, 0.9)';
        nav.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(11, 11, 12, 0.7)';
        nav.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Email signup form
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = signupForm.querySelector('input[type="email"]').value;
        const submitBtn = signupForm.querySelector('button');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Signing up...';
        submitBtn.disabled = true;
        
        // Simulate API call (replace with actual endpoint)
        setTimeout(() => {
            // Success state
            submitBtn.textContent = '✓ Signed up!';
            submitBtn.style.background = 'rgba(76, 217, 100, 0.2)';
            signupForm.querySelector('input').value = '';
            
            // Reset after 3 seconds
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);
            
            // You can add your email collection logic here
            console.log('Email signup:', email);
        }, 1000);
    });
}

// Parallax effect for milestone cards
const milestoneCards = document.querySelectorAll('.milestone-card');

window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    milestoneCards.forEach((card, index) => {
        const depth = index === 1 ? 30 : 15; // Center card moves more
        const moveX = (clientX - centerX) / centerX * depth;
        const moveY = (clientY - centerY) / centerY * depth;
        
        card.style.transform = card.style.transform.split('translate(')[0] + 
            `translate(${moveX}px, ${moveY}px)`;
    });
});

// Intersection Observer for fade-in animations
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

// Observe feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
});

// Add keyboard navigation hint
let keyHintShown = false;
document.addEventListener('keydown', (e) => {
    if (!keyHintShown && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        keyHintShown = true;
        // Could show a subtle hint about keyboard navigation
    }
});

// Prevent default scroll behavior on specific keys if needed
document.addEventListener('keydown', (e) => {
    if (['Space', 'ArrowUp', 'ArrowDown'].indexOf(e.code) > -1 && 
        e.target === document.body) {
        // Allow default behavior for smooth scrolling
    }
});

// Enhanced 3D card interactions
milestoneCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});

// Animate hero title on load
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 100);
    }
    
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    if (heroButtons) {
        heroButtons.style.opacity = '0';
        heroButtons.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroButtons.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            heroButtons.style.opacity = '1';
            heroButtons.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Performance optimization: Debounce scroll events
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

// Optimized scroll handler
const optimizedScroll = debounce(() => {
    // Add any scroll-based animations here
}, 100);

window.addEventListener('scroll', optimizedScroll);
