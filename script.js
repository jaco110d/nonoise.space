// Timeline Landing Page - Interactive 3D Timeline

// Timeline scroll state
let timelineProgress = 0;
let isTimelineActive = true;
let lastScrollTime = 0;

// Get elements
const heroSection = document.getElementById('hero-section');
const timeline3d = document.getElementById('timeline-3d');
const yearIndicator = document.getElementById('year-indicator');
const milestones = document.querySelectorAll('.milestone-3d');
const featuresSection = document.getElementById('features');

// Timeline configuration
const START_YEAR = 2020;
const END_YEAR = 2040;
const YEAR_RANGE = END_YEAR - START_YEAR;

// Milestone positions (years)
const milestoneYears = [2020, 2022, 2024, 2026, 2028, 2032, 2036, 2040];

// Update timeline based on progress (0-1)
function updateTimeline(progress) {
    timelineProgress = Math.max(0, Math.min(1, progress));
    
    // Update year indicator
    const currentYear = Math.round(START_YEAR + (YEAR_RANGE * timelineProgress));
    yearIndicator.textContent = currentYear;
    
    // Calculate scroll position in timeline space
    const scrollZ = timelineProgress * 4000 - 2000; // -2000 to 2000
    
    // Update each milestone
    milestones.forEach((milestone, index) => {
        const milestoneYear = milestoneYears[index];
        const yearProgress = (milestoneYear - START_YEAR) / YEAR_RANGE;
        
        // Position in 3D space
        const milestoneZ = yearProgress * 4000 - 2000;
        const relativeZ = milestoneZ - scrollZ;
        
        // Calculate depth effects (like Timeline3DView.swift)
        const distance = Math.abs(relativeZ);
        
        // Scale based on distance (maxScale 1.5, minScale 0.15, focusRange 800)
        let scale;
        if (distance < 800) {
            const t = distance / 800;
            scale = 0.15 + (1.5 - 0.15) * (1.0 - t);
        } else {
            scale = 0.15;
        }
        
        // Opacity
        let opacity;
        if (distance < 100) {
            opacity = 1.0;
        } else if (distance < 400) {
            opacity = 1.0 - (distance - 100) / 300 * 0.3;
        } else if (distance < 1000) {
            opacity = 0.7 - (distance - 400) / 600 * 0.6;
        } else {
            opacity = 0.1;
        }
        
        // Offsets (perspective movement)
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const xOffset = (screenWidth * 0.6) * (relativeZ / 400);
        const yOffset = -(screenHeight * 0.45) * (relativeZ / 400) - 40;
        
        // Apply transform
        milestone.style.transform = `
            translate(-50%, -50%)
            translateX(${xOffset}px)
            translateY(${yOffset}px)
            translateZ(${relativeZ}px)
            scale(${scale})
        `;
        milestone.style.opacity = opacity;
        milestone.style.zIndex = Math.round(1000 - distance);
        
        // Update selected state (focused card)
        const card = milestone.querySelector('.milestone-card');
        if (distance < 100) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
}

// Handle scroll event
let scrollRAF = null;
function handleScroll(e) {
    if (!isTimelineActive) return;
    
    const now = Date.now();
    const delta = e.deltaY;
    
    // Cancel any pending animation frame
    if (scrollRAF) {
        cancelAnimationFrame(scrollRAF);
    }
    
    scrollRAF = requestAnimationFrame(() => {
        // Update progress
        const sensitivity = 0.0005;
        timelineProgress += delta * sensitivity;
        
        // Check if we've reached the end
        if (timelineProgress >= 1) {
            isTimelineActive = false;
            timelineProgress = 1;
            updateTimeline(1);
            
            // Scroll to features section
            setTimeout(() => {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }, 300);
        } else {
            e.preventDefault();
            updateTimeline(timelineProgress);
        }
        
        lastScrollTime = now;
    });
}

// Initialize timeline
function initTimeline() {
    // Start at beginning
    updateTimeline(0);
    
    // Add scroll listener
    let scrollTimeout;
    window.addEventListener('wheel', (e) => {
        if (isTimelineActive) {
            e.preventDefault();
            handleScroll(e);
        }
    }, { passive: false });
    
    // Touch support for mobile
    let touchStartY = 0;
    let touchStartProgress = 0;
    
    window.addEventListener('touchstart', (e) => {
        if (isTimelineActive) {
            touchStartY = e.touches[0].clientY;
            touchStartProgress = timelineProgress;
        }
    }, { passive: true });
    
    window.addEventListener('touchmove', (e) => {
        if (isTimelineActive) {
            e.preventDefault();
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            const sensitivity = 0.001;
            
            timelineProgress = touchStartProgress + deltaY * sensitivity;
            
            if (timelineProgress >= 1) {
                isTimelineActive = false;
                timelineProgress = 1;
                updateTimeline(1);
                setTimeout(() => {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                updateTimeline(timelineProgress);
            }
        }
    }, { passive: false });
    
    // Reset when scrolling back up
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target === heroSection) {
                isTimelineActive = true;
                timelineProgress = 0;
                updateTimeline(0);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(heroSection);
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        isTimelineActive = false;
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

// Intersection Observer for features fade-in
const featureObserver = new IntersectionObserver((entries) => {
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
    featureObserver.observe(feature);
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
    
    // Smooth entry animation
    setTimeout(() => {
        document.querySelector('.hero-content h1').style.opacity = '1';
        document.querySelector('.hero-content h1').style.transform = 'translateY(0)';
    }, 100);
});

// Keyboard shortcuts (like the app)
document.addEventListener('keydown', (e) => {
    if (isTimelineActive) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            timelineProgress += 0.05;
            if (timelineProgress >= 1) {
                isTimelineActive = false;
                timelineProgress = 1;
                updateTimeline(1);
                setTimeout(() => {
                    featuresSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            } else {
                updateTimeline(timelineProgress);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            timelineProgress -= 0.05;
            updateTimeline(timelineProgress);
        }
    }
});
