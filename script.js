// Timeline Landing Page - Exact copy of Timeline3DView.swift behavior

// Configuration (from Timeline3DView.swift)
const depthSpacing = 150;
const scrollSensitivity = 2.0;
const zUnitsPerDay = 0.5; // Year scale from app

// State
let scrollOffset = 0;
let velocity = 0;
let isInertiaActive = false;
let isTimelineActive = true;
let animationFrameId = null;

// Reference date (January 1, 2000 - same as app)
const referenceDate = new Date(2000, 0, 1);

// Elements
const heroSection = document.getElementById('hero-section');
const timeline3d = document.getElementById('timeline-3d');
const dateMarkersContainer = document.getElementById('date-markers');
const milestones = document.querySelectorAll('.milestone-3d');

// Get screen size
const screenSize = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Parse date from data attribute
function parseDate(dateStr) {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
}

// Calculate z-position for date (from Timeline3DView.swift line 151-160)
function zPositionForDate(date) {
    const daysDifference = (date - referenceDate) / (24 * 60 * 60 * 1000);
    return daysDifference * zUnitsPerDay;
}

// Calculate date for z-position (reverse)
function dateForZPosition(zPos) {
    const days = zPos / zUnitsPerDay;
    return new Date(referenceDate.getTime() + days * 24 * 60 * 60 * 1000);
}

// DepthTransform (from Timeline3DView.swift line 386-449)
function applyDepthTransform(element, zPosition) {
    const distance = Math.abs(zPosition);
    
    // Scale (line 390-404)
    const maxScale = 1.5;
    const minScale = 0.15;
    const focusRange = 800;
    
    let scale;
    if (distance < focusRange) {
        const t = distance / focusRange;
        scale = minScale + (maxScale - minScale) * (1.0 - t);
    } else {
        scale = minScale;
    }
    
    // Opacity (line 406-418)
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
    
    // Blur (line 420-430)
    let blur;
    if (distance < 100) {
        blur = 0;
    } else if (distance < 500) {
        blur = (distance - 100) / 400 * 4;
    } else {
        blur = 4 + (distance - 500) / 500 * 4;
    }
    
    // Offsets (line 432-440)
    const xOffset = (screenSize.width * 0.6) * (zPosition / 400);
    const yOffset = -(screenSize.height * 0.45) * (zPosition / 400) - 40;
    
    // Apply transform
    element.style.transform = `
        translate(-50%, -50%)
        translateX(${xOffset}px)
        translateY(${yOffset}px)
        scale(${scale})
    `;
    element.style.opacity = opacity;
    element.style.filter = `blur(${blur}px)`;
    element.style.zIndex = Math.round(1000 - distance);
    
    // Update selected state (focused card)
    const card = element.querySelector('.milestone-card');
    const isFocused = distance < depthSpacing / 2;
    
    if (isFocused) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
    }
    
    return { scale, opacity, blur, distance };
}

// Generate visible markers (from Timeline3DView.swift line 170-225)
function generateVisibleMarkers() {
    const visibleRange = 2000;
    const startDate = dateForZPosition(scrollOffset - visibleRange);
    const endDate = dateForZPosition(scrollOffset + visibleRange);
    
    const markers = [];
    let currentYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // Generate yearly markers
    for (let year = currentYear; year <= endYear && markers.length < 50; year++) {
        const yearDate = new Date(year, 0, 1);
        const zPos = zPositionForDate(yearDate) - scrollOffset;
        
        if (Math.abs(zPos) < visibleRange) {
            markers.push({ year, zPos });
        }
    }
    
    return markers;
}

// Render date markers
function renderDateMarkers() {
    const markers = generateVisibleMarkers();
    
    dateMarkersContainer.innerHTML = '';
    
    markers.forEach(marker => {
        const distance = Math.abs(marker.zPos);
        
        // Same depth transform as milestones
        const maxScale = 1.5;
        const minScale = 0.15;
        const focusRange = 800;
        
        let scale;
        if (distance < focusRange) {
            const t = distance / focusRange;
            scale = minScale + (maxScale - minScale) * (1.0 - t);
        } else {
            scale = minScale;
        }
        
        let opacity;
        if (distance < 100) {
            opacity = 1.0;
        } else if (distance < 400) {
            opacity = 1.0 - (distance - 100) / 300 * 0.3;
        } else if (distance < 1000) {
            opacity = 0.7 - (distance - 400) / 600 * 0.5;
        } else {
            opacity = 0.2;
        }
        
        const xOffset = (screenSize.width * 0.6) * (marker.zPos / 400);
        const yOffset = -(screenSize.height * 0.45) * (marker.zPos / 400) + 150;
        
        const markerEl = document.createElement('div');
        markerEl.className = 'date-marker';
        markerEl.innerHTML = `
            <div class="marker-dot"></div>
            <span>${marker.year}</span>
        `;
        markerEl.style.transform = `
            translate(-50%, -50%)
            translateX(${xOffset}px)
            translateY(${yOffset}px)
            scale(${scale})
        `;
        markerEl.style.opacity = opacity;
        
        dateMarkersContainer.appendChild(markerEl);
    });
}

// Update all milestones
function updateMilestones() {
    milestones.forEach((milestone) => {
        const dateStr = milestone.dataset.date;
        const date = parseDate(dateStr);
        const milestoneZ = zPositionForDate(date);
        const zPosition = milestoneZ - scrollOffset;
        
        // Only render if within visible range
        const distance = Math.abs(zPosition);
        if (distance < 3000) {
            milestone.style.display = 'block';
            applyDepthTransform(milestone, zPosition);
        } else {
            milestone.style.display = 'none';
        }
    });
    
    renderDateMarkers();
}

// Handle inertia (from Timeline3DView.swift line 263-272)
function handleInertia() {
    if (!isInertiaActive || Math.abs(velocity) <= 0.001) {
        isInertiaActive = false;
        velocity = 0;
        return;
    }
    
    scrollOffset += velocity * 60;
    velocity *= 0.95;
    
    updateMilestones();
    
    if (isInertiaActive) {
        animationFrameId = requestAnimationFrame(handleInertia);
    }
}

// Scroll wheel handler (from Timeline3DView.swift line 276-295)
function handleScrollWheel(event) {
    if (!isTimelineActive) return;
    
    event.preventDefault();
    
    isInertiaActive = false;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    
    const scrollDelta = event.deltaY;
    
    if (event.deltaMode === 1) {
        // Line mode
        scrollOffset -= scrollDelta * scrollSensitivity * 20;
    } else {
        // Pixel mode
        scrollOffset -= scrollDelta * scrollSensitivity;
    }
    
    velocity = -scrollDelta * scrollSensitivity * 0.01;
    
    updateMilestones();
    
    // Check if we should release scroll
    const currentDate = dateForZPosition(scrollOffset);
    if (currentDate >= new Date(2041, 0, 1)) {
        isTimelineActive = false;
        // Allow normal page scroll
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
}

// Touch support
let touchStartY = 0;
let touchStartOffset = 0;

function handleTouchStart(event) {
    if (!isTimelineActive) return;
    touchStartY = event.touches[0].clientY;
    touchStartOffset = scrollOffset;
    isInertiaActive = false;
}

function handleTouchMove(event) {
    if (!isTimelineActive) return;
    event.preventDefault();
    
    const touchY = event.touches[0].clientY;
    const deltaY = touchStartY - touchY;
    
    scrollOffset = touchStartOffset - deltaY * scrollSensitivity;
    updateMilestones();
    
    // Check if we should release
    const currentDate = dateForZPosition(scrollOffset);
    if (currentDate >= new Date(2041, 0, 1)) {
        isTimelineActive = false;
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
}

function handleTouchEnd() {
    isInertiaActive = true;
    animationFrameId = requestAnimationFrame(handleInertia);
}

// Keyboard navigation (from Timeline3DView.swift line 307-381)
function handleKeyDown(event) {
    if (!isTimelineActive) return;
    
    const today = new Date();
    const todayZ = zPositionForDate(today);
    
    if (event.code === 'ArrowLeft' || event.code === 'ArrowUp') {
        event.preventDefault();
        scrollOffset -= 100;
        updateMilestones();
    } else if (event.code === 'ArrowRight' || event.code === 'ArrowDown') {
        event.preventDefault();
        scrollOffset += 100;
        updateMilestones();
    } else if (event.code === 'KeyT' && event.metaKey) {
        // Jump to today (Cmd+T like in app)
        event.preventDefault();
        scrollOffset = todayZ;
        updateMilestones();
    }
}

// Initialize
function initTimeline() {
    // Start at today
    const today = new Date();
    scrollOffset = zPositionForDate(today);
    
    // Allow normal scroll initially so user can scroll to top
    document.body.style.overflow = 'auto';
    isTimelineActive = false;
    
    // Initial render
    updateMilestones();
    
    // Add event listeners
    window.addEventListener('wheel', handleScrollWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('keydown', handleKeyDown);
    
    // Handle window resize
    window.addEventListener('resize', () => {
        screenSize.width = window.innerWidth;
        screenSize.height = window.innerHeight;
        updateMilestones();
    });
    
    // Check scroll position to activate timeline only when at very top
    let scrollCheckTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollCheckTimeout);
        scrollCheckTimeout = setTimeout(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Activate timeline only when scrolled to very top (within 50px)
            if (scrollTop < 50 && !isTimelineActive) {
                isTimelineActive = true;
                document.body.style.overflow = 'hidden';
                scrollOffset = zPositionForDate(new Date());
                updateMilestones();
            }
            // Deactivate when scrolling down past hero
            else if (scrollTop > window.innerHeight * 0.5 && isTimelineActive) {
                isTimelineActive = false;
                document.body.style.overflow = 'auto';
            }
        }, 50);
    });
}

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

// Feature intersection observer
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

document.querySelectorAll('.feature').forEach((feature, index) => {
    feature.style.opacity = '0';
    feature.style.transform = 'translateY(30px)';
    feature.style.transition = `all 0.6s ease ${index * 0.1}s`;
    featureObserver.observe(feature);
});

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initTimeline();
});
