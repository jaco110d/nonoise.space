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
let currentPersona = 'student';

// Reference date (January 1, 2000 - same as app)
const referenceDate = new Date(2000, 0, 1);

// Elements
const heroSection = document.getElementById('hero-section');
const timeline3d = document.getElementById('timeline-3d');
const dateMarkersContainer = document.getElementById('date-markers');

// Persona Milestones Data
const personaMilestones = {
    student: [
        { date: '2006-09-01', emoji: '🎒', title: 'Started School', text: 'Sep 2006' },
        { date: '2010-06-15', emoji: '🏆', title: 'First Award', text: 'Jun 2010' },
        { date: '2014-09-01', emoji: '📚', title: 'High School', text: 'Sep 2014' },
        { date: '2018-06-10', emoji: '🎓', title: 'Graduated HS', text: 'Jun 2018' },
        { date: '2018-09-01', emoji: '🎓', title: 'Started College', text: 'Sep 2018' },
        { date: '2020-03-15', emoji: '💻', title: 'First Coding Project', text: 'Mar 2020' },
        { date: '2021-08-20', emoji: '🚀', title: 'Internship', text: 'Aug 2021' },
        { date: '2022-06-15', emoji: '🎉', title: 'Graduated College', text: 'Jun 2022' },
        { date: '2022-09-01', emoji: '💼', title: 'First Job', text: 'Sep 2022' },
        { date: '2024-03-10', emoji: '📈', title: 'Promotion', text: 'Mar 2024' },
        { date: '2025-06-01', emoji: '🏠', title: 'First Apartment', text: 'Jun 2025' },
        { date: '2027-01-15', emoji: '✈️', title: 'Study Abroad', text: 'Jan 2027' },
        { date: '2028-05-20', emoji: '🎯', title: 'Masters Degree', text: 'May 2028' },
        { date: '2030-09-10', emoji: '🌟', title: 'Dream Job', text: 'Sep 2030' },
        { date: '2035-12-01', emoji: '📚', title: 'PhD Complete', text: 'Dec 2035' },
        { date: '2040-06-15', emoji: '🏆', title: 'Professor', text: 'Jun 2040' }
    ],
    professional: [
        { date: '2008-09-01', emoji: '🎓', title: 'Graduated', text: 'Sep 2008' },
        { date: '2009-01-15', emoji: '💼', title: 'First Job', text: 'Jan 2009' },
        { date: '2012-06-20', emoji: '📈', title: 'Promotion', text: 'Jun 2012' },
        { date: '2015-03-10', emoji: '🏢', title: 'Senior Role', text: 'Mar 2015' },
        { date: '2017-08-15', emoji: '💰', title: 'Big Raise', text: 'Aug 2017' },
        { date: '2019-11-01', emoji: '🎯', title: 'Team Lead', text: 'Nov 2019' },
        { date: '2021-04-20', emoji: '🚀', title: 'VP Position', text: 'Apr 2021' },
        { date: '2023-09-15', emoji: '🏆', title: 'Industry Award', text: 'Sep 2023' },
        { date: '2025-02-10', emoji: '💡', title: 'C-Level', text: 'Feb 2025' },
        { date: '2027-06-01', emoji: '🌍', title: 'Global Role', text: 'Jun 2027' },
        { date: '2029-03-15', emoji: '📊', title: 'Board Member', text: 'Mar 2029' },
        { date: '2032-01-20', emoji: '🎤', title: 'Keynote Speaker', text: 'Jan 2032' },
        { date: '2035-08-10', emoji: '📚', title: 'Published Book', text: 'Aug 2035' },
        { date: '2038-05-15', emoji: '🏅', title: 'Lifetime Achievement', text: 'May 2038' },
        { date: '2040-11-01', emoji: '🌟', title: 'Retirement', text: 'Nov 2040' },
        { date: '2042-03-20', emoji: '🎯', title: 'Consulting', text: 'Mar 2042' }
    ],
    entrepreneur: [
        { date: '2010-03-15', emoji: '💡', title: 'First Idea', text: 'Mar 2010' },
        { date: '2012-06-01', emoji: '💻', title: 'Started Coding', text: 'Jun 2012' },
        { date: '2015-09-10', emoji: '🚀', title: 'Launched MVP', text: 'Sep 2015' },
        { date: '2016-02-20', emoji: '👥', title: 'First Customer', text: 'Feb 2016' },
        { date: '2017-07-15', emoji: '💰', title: 'Seed Funding', text: 'Jul 2017' },
        { date: '2018-11-01', emoji: '📈', title: 'Revenue Milestone', text: 'Nov 2018' },
        { date: '2020-04-10', emoji: '🎯', title: 'Series A', text: 'Apr 2020' },
        { date: '2022-01-15', emoji: '🏢', title: 'Opened Office', text: 'Jan 2022' },
        { date: '2024-08-20', emoji: '🌍', title: 'Global Expansion', text: 'Aug 2024' },
        { date: '2026-03-05', emoji: '💎', title: 'Series B', text: 'Mar 2026' },
        { date: '2028-10-10', emoji: '🏆', title: 'Profitable', text: 'Oct 2028' },
        { date: '2030-06-15', emoji: '📊', title: 'IPO', text: 'Jun 2030' },
        { date: '2033-02-20', emoji: '🤝', title: 'Major Partnership', text: 'Feb 2033' },
        { date: '2036-09-01', emoji: '🌟', title: 'Unicorn Status', text: 'Sep 2036' },
        { date: '2039-05-15', emoji: '🎯', title: 'Acquired', text: 'May 2039' },
        { date: '2041-12-01', emoji: '💡', title: 'New Venture', text: 'Dec 2041' }
    ],
    parent: [
        { date: '2008-06-15', emoji: '💍', title: 'Got Married', text: 'Jun 2008' },
        { date: '2010-03-20', emoji: '🏠', title: 'Bought House', text: 'Mar 2010' },
        { date: '2012-08-15', emoji: '👶', title: 'First Child', text: 'Aug 2012' },
        { date: '2014-11-10', emoji: '👶', title: 'Second Child', text: 'Nov 2014' },
        { date: '2017-09-01', emoji: '🎒', title: 'First Day School', text: 'Sep 2017' },
        { date: '2019-05-20', emoji: '🎉', title: 'Family Vacation', text: 'May 2019' },
        { date: '2021-12-25', emoji: '🎄', title: 'New Tradition', text: 'Dec 2021' },
        { date: '2024-06-15', emoji: '🏆', title: "Kid's Achievement", text: 'Jun 2024' },
        { date: '2026-09-01', emoji: '🎓', title: 'High School Starts', text: 'Sep 2026' },
        { date: '2029-03-10', emoji: '🚗', title: "Driver's License", text: 'Mar 2029' },
        { date: '2031-06-20', emoji: '🎓', title: 'Graduation Day', text: 'Jun 2031' },
        { date: '2033-09-01', emoji: '🏠', title: 'Empty Nest', text: 'Sep 2033' },
        { date: '2036-02-14', emoji: '💑', title: 'Renewed Vows', text: 'Feb 2036' },
        { date: '2038-12-25', emoji: '👴👵', title: 'Grandparents', text: 'Dec 2038' },
        { date: '2041-08-15', emoji: '🌍', title: 'World Tour', text: 'Aug 2041' },
        { date: '2043-06-01', emoji: '🏡', title: 'Retirement Home', text: 'Jun 2043' }
    ],
    creative: [
        { date: '2009-03-15', emoji: '🎨', title: 'First Artwork', text: 'Mar 2009' },
        { date: '2011-08-20', emoji: '📷', title: 'Bought Camera', text: 'Aug 2011' },
        { date: '2013-05-10', emoji: '🖌️', title: 'Art School', text: 'May 2013' },
        { date: '2015-11-01', emoji: '🎬', title: 'First Exhibition', text: 'Nov 2015' },
        { date: '2017-06-15', emoji: '🏆', title: 'Won Award', text: 'Jun 2017' },
        { date: '2019-02-20', emoji: '💼', title: 'Freelance Career', text: 'Feb 2019' },
        { date: '2021-09-05', emoji: '🎭', title: 'Major Project', text: 'Sep 2021' },
        { date: '2023-04-10', emoji: '🌟', title: 'Gallery Feature', text: 'Apr 2023' },
        { date: '2025-12-01', emoji: '📚', title: 'Published Book', text: 'Dec 2025' },
        { date: '2027-07-15', emoji: '🎪', title: 'Solo Show', text: 'Jul 2027' },
        { date: '2029-03-20', emoji: '🏅', title: 'International Recognition', text: 'Mar 2029' },
        { date: '2031-10-10', emoji: '🎨', title: 'Opened Studio', text: 'Oct 2031' },
        { date: '2034-05-15', emoji: '🎬', title: 'Documentary', text: 'May 2034' },
        { date: '2037-01-20', emoji: '🌍', title: 'World Tour', text: 'Jan 2037' },
        { date: '2040-08-25', emoji: '🏛️', title: 'Museum Retrospective', text: 'Aug 2040' },
        { date: '2042-12-15', emoji: '🎯', title: 'Legacy Project', text: 'Dec 2042' }
    ]
};

let milestones = [];

// Persona Habits Data
const personaHabits = {
    student: [
        { emoji: '📚', name: 'Study Session', streak: 12 },
        { emoji: '💪', name: 'Exercise', streak: 8 },
        { emoji: '📝', name: 'Homework', streak: 15 },
        { emoji: '💻', name: 'Code Practice', streak: 5 }
    ],
    professional: [
        { emoji: '💼', name: 'Work Tasks', streak: 22 },
        { emoji: '📧', name: 'Check Emails', streak: 30 },
        { emoji: '🏃', name: 'Morning Run', streak: 18 },
        { emoji: '📖', name: 'Read Industry News', streak: 14 }
    ],
    entrepreneur: [
        { emoji: '💡', name: 'Product Work', streak: 45 },
        { emoji: '📊', name: 'Review Metrics', streak: 27 },
        { emoji: '🤝', name: 'Network', streak: 10 },
        { emoji: '✍️', name: 'Content Creation', streak: 12 }
    ],
    parent: [
        { emoji: '👨‍👩‍👧', name: 'Family Time', streak: 60 },
        { emoji: '🍳', name: 'Cook Healthy Meal', streak: 35 },
        { emoji: '📚', name: 'Bedtime Story', streak: 42 },
        { emoji: '🧘', name: 'Self Care', streak: 8 }
    ],
    creative: [
        { emoji: '🎨', name: 'Create Art', streak: 28 },
        { emoji: '📷', name: 'Photo Session', streak: 16 },
        { emoji: '✍️', name: 'Journal', streak: 22 },
        { emoji: '🎵', name: 'Practice Music', streak: 19 }
    ]
};

let habitCompletions = {};
let habitViewMode = 'week';

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

// Load milestones for persona
function loadPersonaMilestones(persona) {
    const milestonesData = personaMilestones[persona];
    
    // Clear existing milestones
    const existingMilestones = timeline3d.querySelectorAll('.milestone-3d');
    existingMilestones.forEach(m => m.remove());
    
    // Create new milestones
    milestones = [];
    milestonesData.forEach((data) => {
        const milestoneEl = document.createElement('div');
        milestoneEl.className = 'milestone-3d';
        milestoneEl.dataset.date = data.date;
        
        milestoneEl.innerHTML = `
            <div class="milestone-card">
                <div class="emoji-container">
                    <span class="emoji">${data.emoji}</span>
                </div>
                <div class="card-title">${data.title}</div>
                <div class="card-date">${data.text}</div>
            </div>
        `;
        
        timeline3d.appendChild(milestoneEl);
        milestones.push(milestoneEl);
    });
    
    // Reset scroll to today
    const today = new Date();
    scrollOffset = zPositionForDate(today);
    
    // Initial update
    updateMilestones();
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
    
    // Check if we should release scroll (both directions)
    const currentDate = dateForZPosition(scrollOffset);
    
    // Release when reaching the future (2041+)
    if (currentDate >= new Date(2041, 0, 1)) {
        isTimelineActive = false;
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    // Release when reaching the past (2003 or earlier)
    else if (currentDate <= new Date(2003, 0, 1)) {
        isTimelineActive = false;
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
    
    // Check if we should release (both directions)
    const currentDate = dateForZPosition(scrollOffset);
    if (currentDate >= new Date(2041, 0, 1) || currentDate <= new Date(2003, 0, 1)) {
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

// Load habits for persona
function loadPersonaHabits(persona) {
    const habits = personaHabits[persona];
    const container = document.getElementById('habit-cards');
    
    container.innerHTML = '';
    
    if (habitViewMode === 'day') {
        // Day view - DayHabitCard from HabitsTimelineView.swift
        habits.forEach((habit, index) => {
            // Generate random completion data for demo
            const completedCount = Math.floor(Math.random() * 4) + 1;
            const isCompleted = completedCount > 2;
            
            const habitCard = document.createElement('div');
            habitCard.className = 'habit-card day-view';
            
            habitCard.innerHTML = `
                <div class="day-card-header">
                    <div class="day-card-date">Wed 8 Oct</div>
                    <div class="day-card-completion">${completedCount}/4 completed</div>
                </div>
                <div class="day-card-divider"></div>
                <div class="day-habits-list">
                    ${habits.map((h, i) => {
                        const completed = i < completedCount;
                        return `
                            <div class="day-habit-row">
                                <div class="day-habit-emoji ${completed ? 'completed' : ''}">${h.emoji}</div>
                                <div class="day-habit-title">${h.name}</div>
                                <div class="day-habit-checkbox ${completed ? 'completed' : ''}" 
                                     data-habit="${i}">
                                    ${completed ? '●' : '○'}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
            
            container.appendChild(habitCard);
        });
    } else {
        // Week view - WeekHabit3DCard from Habits3DView.swift
        const habitCard = document.createElement('div');
        habitCard.className = 'habit-card week-view';
        
        // Get current week info
        const now = new Date();
        const weekNumber = getWeekNumber(now);
        const weekStart = getMonday(now);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        const formatDate = (date) => {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return `${months[date.getMonth()]} ${date.getDate()}`;
        };
        
        habitCard.innerHTML = `
            <div class="week-card-header">
                <div class="week-card-title">Week ${weekNumber}</div>
                <div class="week-card-date-range">${formatDate(weekStart)} - ${formatDate(weekEnd)}</div>
            </div>
            <div class="week-card-divider"></div>
            <div class="week-days-header">
                <div class="emoji-space"></div>
                <div class="title-space"></div>
                ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(day => `
                    <div class="day-label">${day}</div>
                `).join('')}
            </div>
            <div class="week-habits-rows">
                ${habits.map((habit, habitIndex) => `
                    <div class="week-habit-row">
                        <div class="week-habit-emoji">${habit.emoji}</div>
                        <div class="week-habit-title">${habit.name}</div>
                        ${[0, 1, 2, 3, 4, 5, 6].map(dayIndex => {
                            // Random completion for demo (more completed earlier in week)
                            const isPlanned = dayIndex < 6; // Most days planned
                            const isCompleted = isPlanned && dayIndex < 4; // First 4 days completed
                            
                            if (!isPlanned) {
                                return `<div class="week-day-cell empty"></div>`;
                            }
                            
                            return `
                                <div class="week-day-cell ${isCompleted ? 'completed' : ''}" 
                                     data-habit="${habitIndex}" 
                                     data-day="${dayIndex}">
                                    ${isCompleted ? '<span class="checkmark">✓</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `).join('')}
            </div>
        `;
        
        container.appendChild(habitCard);
    }
    
    // Add click handlers
    setupHabitCheckboxes();
}

// Helper functions for week view
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

// Setup habit checkbox click handlers
function setupHabitCheckboxes() {
    // Day view checkboxes
    const dayCheckboxes = document.querySelectorAll('.day-habit-checkbox');
    dayCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', () => {
            const row = checkbox.closest('.day-habit-row');
            const emoji = row.querySelector('.day-habit-emoji');
            
            if (checkbox.classList.contains('completed')) {
                checkbox.classList.remove('completed');
                checkbox.textContent = '○';
                emoji.classList.remove('completed');
            } else {
                checkbox.classList.add('completed');
                checkbox.textContent = '●';
                emoji.classList.add('completed');
            }
            
            // Update completion count
            const card = checkbox.closest('.habit-card');
            const allCheckboxes = card.querySelectorAll('.day-habit-checkbox');
            const completedCount = Array.from(allCheckboxes).filter(cb => cb.classList.contains('completed')).length;
            const totalCount = allCheckboxes.length;
            const completionEl = card.querySelector('.day-card-completion');
            if (completionEl) {
                completionEl.textContent = `${completedCount}/${totalCount} completed`;
            }
        });
    });
    
    // Week view checkboxes
    const weekCells = document.querySelectorAll('.week-day-cell:not(.empty)');
    weekCells.forEach(cell => {
        cell.addEventListener('click', () => {
            if (cell.classList.contains('completed')) {
                cell.classList.remove('completed');
                cell.innerHTML = '';
            } else {
                cell.classList.add('completed');
                cell.innerHTML = '<span class="checkmark">✓</span>';
            }
        });
    });
}

// Time scale toggle handlers
function setupTimeScaleToggle() {
    const timeBtns = document.querySelectorAll('.time-btn');
    
    timeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const scale = btn.dataset.scale;
            
            // Update active state
            timeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update view mode and reload habits
            habitViewMode = scale;
            loadPersonaHabits(currentPersona);
        });
    });
}

// Persona selector handlers
function setupPersonaSelector() {
    const personaBtns = document.querySelectorAll('.persona-btn');
    
    personaBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const persona = btn.dataset.persona;
            
            // Update active state
            personaBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Load new persona milestones and habits
            currentPersona = persona;
            loadPersonaMilestones(persona);
            loadPersonaHabits(persona);
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Load initial persona
    loadPersonaMilestones(currentPersona);
    loadPersonaHabits(currentPersona);
    
    // Setup persona selector
    setupPersonaSelector();
    
    // Setup time scale toggle
    setupTimeScaleToggle();
    
    // Initialize timeline
    initTimeline();
});
