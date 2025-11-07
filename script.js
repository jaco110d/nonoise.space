// Timeline Landing Page - Minimal JavaScript

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Email form
const emailForm = document.getElementById('emailForm');
if (emailForm) {
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = emailForm.querySelector('input');
        const button = emailForm.querySelector('button span');
        const originalText = button.textContent;
        
        button.textContent = 'Submitted!';
        input.value = '';
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 2000);
    });
}

// Parallax effect for milestone cards
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

function animate() {
    const cards = document.querySelectorAll('.milestone-card');
    cards.forEach((card, index) => {
        const depth = card.dataset.depth;
        let multiplier = 1;
        
        if (depth === 'back') multiplier = 0.5;
        if (depth === 'front') multiplier = 1.5;
        
        const x = mouseX * 20 * multiplier;
        const y = mouseY * 20 * multiplier;
        
        card.style.transform = `translate(${x}px, ${y}px) scale(${card.dataset.depth === 'center' ? 1 : 0.85})`;
    });
    
    requestAnimationFrame(animate);
}

animate();

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Observe features
document.querySelectorAll('.feature').forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateY(30px)';
    feature.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(feature);
});

// Prevent body scroll when hovering timeline
const timeline = document.querySelector('.timeline-preview');
if (timeline) {
    timeline.addEventListener('wheel', (e) => {
        e.stopPropagation();
    }, { passive: true });
}
