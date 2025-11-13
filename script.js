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

// Persona Habits Data with time ranges (24-hour format)
const personaHabits = {
    student: [
        { emoji: '🏃', name: 'Morning Run', start: 7, end: 8, color: '#FF6B6B' },
        { emoji: '📚', name: 'Study Session', start: 9, end: 12, color: '#4ECDC4' },
        { emoji: '🍱', name: 'Lunch Break', start: 12, end: 13, color: '#95E1D3' },
        { emoji: '💻', name: 'Code Practice', start: 14, end: 17, color: '#F38181' },
        { emoji: '💪', name: 'Gym', start: 18, end: 19, color: '#AA96DA' },
        { emoji: '📝', name: 'Homework', start: 20, end: 22, color: '#FCBAD3' }
    ],
    professional: [
        { emoji: '☕', name: 'Morning Coffee', start: 7, end: 8, color: '#FFB347' },
        { emoji: '💼', name: 'Deep Work', start: 9, end: 12, color: '#6C5CE7' },
        { emoji: '🥗', name: 'Lunch', start: 12, end: 13, color: '#00D2A0' },
        { emoji: '📧', name: 'Emails & Meetings', start: 14, end: 17, color: '#74B9FF' },
        { emoji: '🏃', name: 'Evening Run', start: 18, end: 19, color: '#FF6B6B' },
        { emoji: '📖', name: 'Read & Unwind', start: 21, end: 22, color: '#A29BFE' }
    ],
    entrepreneur: [
        { emoji: '🧘', name: 'Morning Routine', start: 6, end: 7, color: '#FD79A8' },
        { emoji: '💡', name: 'Strategy Time', start: 8, end: 10, color: '#FDCB6E' },
        { emoji: '🚀', name: 'Product Work', start: 10, end: 13, color: '#6C5CE7' },
        { emoji: '🤝', name: 'Meetings', start: 14, end: 16, color: '#74B9FF' },
        { emoji: '📊', name: 'Review Metrics', start: 17, end: 18, color: '#00B894' },
        { emoji: '✍️', name: 'Content Creation', start: 19, end: 21, color: '#A29BFE' }
    ],
    parent: [
        { emoji: '👨‍👩‍👧', name: 'Morning Routine', start: 7, end: 8, color: '#FFB6C1' },
        { emoji: '💼', name: 'Work', start: 9, end: 15, color: '#87CEEB' },
        { emoji: '🚗', name: 'School Pickup', start: 15, end: 16, color: '#FFD700' },
        { emoji: '🍳', name: 'Cook Dinner', start: 17, end: 18, color: '#FF6B6B' },
        { emoji: '👨‍👩‍👧', name: 'Family Time', start: 18, end: 20, color: '#98D8C8' },
        { emoji: '📚', name: 'Bedtime Story', start: 20, end: 21, color: '#F7DC6F' }
    ],
    creative: [
        { emoji: '☕', name: 'Morning Coffee', start: 8, end: 9, color: '#FFB347' },
        { emoji: '🎨', name: 'Create Art', start: 9, end: 13, color: '#E17055' },
        { emoji: '🍲', name: 'Lunch', start: 13, end: 14, color: '#00D2A0' },
        { emoji: '📷', name: 'Photo Session', start: 15, end: 17, color: '#74B9FF' },
        { emoji: '✍️', name: 'Journal', start: 18, end: 19, color: '#FDCB6E' },
        { emoji: '🎵', name: 'Practice Music', start: 20, end: 22, color: '#A29BFE' }
    ]
};

let habitCompletions = {};
let currentHabitClock = null;
let clockUpdateInterval = null;

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
            document.getElementById('habits').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    // Release when reaching the past (2003 or earlier)
    else if (currentDate <= new Date(2003, 0, 1)) {
        isTimelineActive = false;
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.getElementById('habits').scrollIntoView({ behavior: 'smooth' });
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
            document.getElementById('habits').scrollIntoView({ behavior: 'smooth' });
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

// 24-Hour Habit Clock Functions

// Render clock ring with hour markers - EXACT from Mac app ClockRing
function renderClockRing() {
    const svg = document.getElementById('clock-ring');
    const clockContainer = document.getElementById('habit-clock');
    
    if (!clockContainer) return;
    
    // Get actual clock size
    const containerSize = clockContainer.offsetWidth;
    const viewBoxSize = 1000; // Use larger viewBox for better precision
    
    svg.setAttribute('viewBox', `0 0 ${viewBoxSize} ${viewBoxSize}`);
    svg.innerHTML = '';
    
    const center = viewBoxSize / 2;
    const radius = (viewBoxSize / 2) - 10; // Slight padding
    
    // Outer ring circle - opacity 0.05 from Mac app (line 90)
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', center);
    circle.setAttribute('cy', center);
    circle.setAttribute('r', radius);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke', 'rgba(255, 255, 255, 0.05)');
    circle.setAttribute('stroke-width', '1');
    svg.appendChild(circle);
    
    // Hour markers and labels
    for (let hour = 0; hour < 24; hour++) {
        const angle = hour * 15; // 15 degrees per hour (360/24)
        const radians = ((angle - 90) * Math.PI) / 180;
        
        // Marker lines
        const isMajor = hour % 6 === 0;
        const markerHeight = isMajor ? 12 : 6;
        const markerWidth = isMajor ? 2 : 1;
        const markerOpacity = isMajor ? 0.3 : 0.1;
        
        // Create marker as a line from edge inward
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        const innerRadius = radius;
        const outerRadius = radius + markerHeight;
        const x1 = center + Math.cos(radians) * innerRadius;
        const y1 = center + Math.sin(radians) * innerRadius;
        const x2 = center + Math.cos(radians) * outerRadius;
        const y2 = center + Math.sin(radians) * outerRadius;
        
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', `rgba(255, 255, 255, ${markerOpacity})`);
        line.setAttribute('stroke-width', markerWidth);
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
    }
    
    // Add ALL hour labels separately to ensure they render on top
    for (let hour = 0; hour < 24; hour++) {
        if (hour % 3 === 0) {
            const angle = hour * 15; // 15 degrees per hour (360/24)
            const radians = ((angle - 90) * Math.PI) / 180;
            
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const labelRadius = radius + 35; // Position labels outside markers
            const labelX = center + Math.cos(radians) * labelRadius;
            const labelY = center + Math.sin(radians) * labelRadius;
            
            // All hours same style now
            text.setAttribute('font-size', '16');
            text.setAttribute('font-weight', 'normal');
            text.setAttribute('fill', 'rgba(255, 255, 255, 0.6)');
            text.setAttribute('x', labelX);
            text.setAttribute('y', labelY);
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            text.setAttribute('font-family', '-apple-system, BlinkMacSystemFont, sans-serif');
            text.textContent = String(hour).padStart(2, '0');
            
            // Add to SVG
            svg.appendChild(text);
        }
    }
}

// Render habit arcs on the clock - EXACT from Mac app HabitArc
function renderHabitArcs(habits) {
    const container = document.getElementById('habit-arcs');
    container.innerHTML = '';
    
    const clockContainer = document.getElementById('habit-clock');
    const containerSize = clockContainer.offsetWidth;
    const viewBoxSize = 1000; // Match clock ring viewBox
    
    habits.forEach((habit, index) => {
        const arcDiv = document.createElement('div');
        arcDiv.className = 'habit-arc';
        arcDiv.dataset.habitIndex = index;
        arcDiv.dataset.habitName = habit.name;
        
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', `0 0 ${viewBoxSize} ${viewBoxSize}`);
        
        // Calculate arc parameters - EXACT from Mac app
        // Mac app uses padding(50) which is 50/size of the total radius
        const center = viewBoxSize / 2;
        const padding = 50 * (viewBoxSize / containerSize); // Scale padding proportionally
        const radius = center - padding;
        
        // Convert time to angles - Mac app uses -90 offset
        const startMinutes = habit.start * 60;
        const endMinutes = habit.end * 60;
        const startAngle = (startMinutes / (24 * 60)) * 360 - 90;
        const endAngle = (endMinutes / (24 * 60)) * 360 - 90;
        
        // Calculate arc path parameters
        const startAngleRad = (startAngle * Math.PI) / 180;
        const endAngleRad = (endAngle * Math.PI) / 180;
        const arcLength = ((endAngle - startAngle) / 360) * (2 * Math.PI * radius);
        
        // Create arc path for better control
        const createArcPath = (r) => {
            const x1 = center + Math.cos(startAngleRad) * r;
            const y1 = center + Math.sin(startAngleRad) * r;
            const x2 = center + Math.cos(endAngleRad) * r;
            const y2 = center + Math.sin(endAngleRad) * r;
            const largeArc = (endAngle - startAngle) > 180 ? 1 : 0;
            return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
        };
        
        // Glow layer - lineWidth: 64 from Mac app, opacity 0.08/0.15
        const glowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        glowPath.setAttribute('d', createArcPath(radius));
        glowPath.setAttribute('class', 'glow');
        glowPath.setAttribute('stroke', habit.color);
        glowPath.setAttribute('stroke-width', 64 * (viewBoxSize / containerSize));
        glowPath.setAttribute('fill', 'none');
        glowPath.setAttribute('stroke-linecap', 'butt');
        glowPath.setAttribute('opacity', '0.15');
        glowPath.style.filter = 'blur(8px)';
        svg.appendChild(glowPath);
        
        // Main arc - lineWidth: 48 from Mac app, opacity 0.15/0.35
        const mainPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        mainPath.setAttribute('d', createArcPath(radius));
        mainPath.setAttribute('class', 'main');
        mainPath.setAttribute('stroke', habit.color);
        mainPath.setAttribute('stroke-width', 48 * (viewBoxSize / containerSize));
        mainPath.setAttribute('fill', 'none');
        mainPath.setAttribute('stroke-linecap', 'butt');
        mainPath.setAttribute('opacity', '0.35');
        svg.appendChild(mainPath);
        
        // Clickable overlay - EXACT from Mac app (opacity 0.001)
        const clickablePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        clickablePath.setAttribute('d', createArcPath(radius));
        clickablePath.setAttribute('class', 'clickable');
        clickablePath.setAttribute('stroke', 'rgba(255, 255, 255, 0.001)');
        clickablePath.setAttribute('stroke-width', 48 * (viewBoxSize / containerSize));
        clickablePath.setAttribute('fill', 'none');
        clickablePath.setAttribute('stroke-linecap', 'butt');
        clickablePath.style.cursor = 'pointer';
        clickablePath.onclick = () => {
            // Toggle completed state - Mac app uses spring animation
            const isCompleted = mainPath.getAttribute('opacity') === '0.15';
            mainPath.setAttribute('opacity', isCompleted ? '0.35' : '0.15');
            glowPath.setAttribute('opacity', isCompleted ? '0.15' : '0.08');
            
            // Update emoji opacity
            const emojiEl = container.querySelector(`[data-habit="${habit.name}"]`);
            if (emojiEl) {
                emojiEl.style.opacity = isCompleted ? '1' : '0.5';
            }
            
            // Add/remove checkmark - EXACT from Mac app (line 218-228)
            const checkmarkId = `checkmark-${habit.name.replace(/\s+/g, '-')}`;
            let checkmark = container.querySelector(`#${checkmarkId}`);
            
            if (!isCompleted && !checkmark) {
                // Add checkmark when completing
                const midAngle = (startAngle + endAngle) / 2;
                const midAngleRad = (midAngle * Math.PI) / 180;
                const checkX = center + Math.cos(midAngleRad) * radius + 12 * (viewBoxSize / containerSize);
                const checkY = center + Math.sin(midAngleRad) * radius - 12 * (viewBoxSize / containerSize);
                
                checkmark = document.createElement('div');
                checkmark.id = checkmarkId;
                checkmark.className = 'habit-checkmark';
                checkmark.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 16 16">
                        <circle cx="8" cy="8" r="8" fill="${habit.color}"/>
                        <path d="M5 8L7 10L11 6" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                `;
                checkmark.style.left = `${(checkX / viewBoxSize) * 100}%`;
                checkmark.style.top = `${(checkY / viewBoxSize) * 100}%`;
                checkmark.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))';
                container.appendChild(checkmark);
            } else if (isCompleted && checkmark) {
                // Remove checkmark when uncompleting
                checkmark.remove();
            }
        };
        svg.appendChild(clickablePath);
        
        arcDiv.appendChild(svg);
        container.appendChild(arcDiv);
        
        // Position emoji at middle of arc - EXACT from Mac app (size/2 - 50)
        const midAngle = (startAngle + endAngle) / 2;
        const midAngleRad = (midAngle * Math.PI) / 180;
        const emojiRadius = radius; // Same as arc radius
        const emojiX = center + Math.cos(midAngleRad) * emojiRadius;
        const emojiY = center + Math.sin(midAngleRad) * emojiRadius;
        
        const emojiDiv = document.createElement('div');
        emojiDiv.className = 'habit-emoji-on-arc';
        emojiDiv.setAttribute('data-habit', habit.name);
        emojiDiv.textContent = habit.emoji;
        emojiDiv.style.left = `${(emojiX / viewBoxSize) * 100}%`;
        emojiDiv.style.top = `${(emojiY / viewBoxSize) * 100}%`;
        emojiDiv.style.fontSize = '20px';
        container.appendChild(emojiDiv);
    });
}

// Update time indicator position - EXACT from Mac app LiveTimeIndicator
function updateTimeIndicator() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    // Mac app uses totalMinutes for angle calculation - but include seconds for smooth movement
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const angle = ((totalSeconds / (24 * 3600)) * 360 - 90) * (Math.PI / 180);
    
    const clockContainer = document.getElementById('habit-clock');
    if (!clockContainer) return;
    
    const containerSize = clockContainer.offsetWidth;
    const viewBoxSize = 1000; // Match clock ring viewBox
    const center = viewBoxSize / 2;
    const radius = center - 10; // Match outer ring radius
    
    const x = center + Math.cos(angle) * radius;
    const y = center + Math.sin(angle) * radius;
    
    const indicator = document.getElementById('time-indicator');
    
    if (indicator) {
        // Calculate position as percentage
        const xPercent = (x / viewBoxSize) * 100;
        const yPercent = (y / viewBoxSize) * 100;
        
        indicator.innerHTML = `
            <div class="time-indicator-pulse" style="left: ${xPercent}%; top: ${yPercent}%;"></div>
            <div class="time-indicator-dot" style="left: ${xPercent}%; top: ${yPercent}%;"></div>
        `;
        
        // Ensure animation is running
        const pulse = indicator.querySelector('.time-indicator-pulse');
        if (pulse && !pulse.classList.contains('animating')) {
            pulse.classList.add('animating');
        }
    }
}

// Get current habit based on time
function getCurrentHabit(habits) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;
    
    return habits.find(habit => {
        return currentTime >= habit.start && currentTime < habit.end;
    });
}

// Get upcoming habits
function getUpcomingHabits(habits) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour + currentMinute / 60;
    
    return habits
        .filter(habit => habit.start > currentTime)
        .sort((a, b) => a.start - b.start)
        .slice(0, 3);
}

// Render center content
function renderClockCenter(habits) {
    const container = document.getElementById('clock-center');
    const now = new Date();
    const currentHabit = getCurrentHabit(habits);
    const upcomingHabits = getUpcomingHabits(habits);
    
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dateStr = `${months[now.getMonth()]} ${now.getDate()}`;
    const weekdayStr = weekdays[now.getDay()];
    
    let centerHTML = `
        <div class="clock-date-header">
            <div class="clock-date">${dateStr}</div>
            <div class="clock-weekday">${weekdayStr}</div>
        </div>
    `;
    
    if (currentHabit) {
        const formatTime = (hour) => {
            const h = Math.floor(hour);
            const m = Math.round((hour - h) * 60);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };
        
        centerHTML += `
            <div class="current-habit-card" onclick="toggleHabitCompletion('${currentHabit.name}')">
                <div class="habit-emoji-container">
                    <span class="emoji">${currentHabit.emoji}</span>
                </div>
                <div class="habit-now-label">NOW</div>
                <div class="habit-title">${currentHabit.name}</div>
                <div class="habit-time-range">${formatTime(currentHabit.start)} — ${formatTime(currentHabit.end)}</div>
                <div class="habit-hint">Demo habit for ${currentPersona}</div>
            </div>
        `;
    } else {
        centerHTML += `
            <div class="free-time-card">
                <div class="habit-emoji-container">
                    <span class="emoji">⏰</span>
                </div>
                <div class="habit-now-label">NOW</div>
                <div class="habit-title">Free Time</div>
            </div>
        `;
    }
    
    if (upcomingHabits.length > 0) {
        const formatTime = (hour) => {
            const h = Math.floor(hour);
            const m = Math.round((hour - h) * 60);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const h12 = h % 12 || 12;
            return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
        };
        
        centerHTML += `
            <div class="upcoming-habits">
                <div class="upcoming-label">UPCOMING</div>
                ${upcomingHabits.map(habit => `
                    <div class="upcoming-habit-item">
                        <div class="upcoming-habit-emoji">${habit.emoji}</div>
                        <div class="upcoming-habit-info">
                            <div class="upcoming-habit-title">${habit.name}</div>
                            <div class="upcoming-habit-time">${formatTime(habit.start)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    container.innerHTML = centerHTML;
}

// Load and render habit clock for persona
function loadPersonaHabitClock(persona) {
    const habits = personaHabits[persona];
    
    // Render all components
    renderClockRing();
    renderHabitArcs(habits);
    updateTimeIndicator();
    renderClockCenter(habits);
    
    // Clear existing interval
    if (clockUpdateInterval) {
        clearInterval(clockUpdateInterval);
    }
    
    // Update time indicator every second for live updates
    clockUpdateInterval = setInterval(() => {
        updateTimeIndicator();
        // Also check if we need to update center content (new habit started)
        const currentHabit = getCurrentHabit(habits);
        const centerEl = document.querySelector('.current-habit-card, .free-time-card');
        if (centerEl) {
            // Check if current habit changed
            const currentTitle = centerEl.querySelector('.habit-title')?.textContent;
            const newTitle = currentHabit ? currentHabit.name : 'Free Time';
            if (currentTitle !== newTitle) {
                renderClockCenter(habits);
            }
        }
    }, 1000);
}

// Toggle habit completion - EXACT from Mac app behavior
function toggleHabitCompletion(habitName) {
    // Find the habit arc for this habit
    const habitArcsContainer = document.getElementById('habit-arcs');
    const habitArc = habitArcsContainer.querySelector(`[data-habit-name="${habitName}"]`);
    
    if (!habitArc) {
        console.log('Could not find habit arc for:', habitName);
        return;
    }
    
    // Find the main path in this habit arc
    const mainPath = habitArc.querySelector('.main');
    const glowPath = habitArc.querySelector('.glow');
    const emojiEl = habitArcsContainer.querySelector(`[data-habit="${habitName}"]`);
    
    if (!mainPath || !glowPath) {
        console.log('Could not find paths for:', habitName);
        return;
    }
    
    // Check current state
    const isCompleted = mainPath.getAttribute('opacity') === '0.15';
    
    // Toggle state with animation - EXACT from Mac app
    mainPath.setAttribute('opacity', isCompleted ? '0.35' : '0.15');
    glowPath.setAttribute('opacity', isCompleted ? '0.15' : '0.08');
    
    // Update emoji opacity
    if (emojiEl) {
        emojiEl.style.opacity = isCompleted ? '1' : '0.5';
    }
    
    // Add/remove checkmark
    const checkmarkId = `checkmark-${habitName.replace(/\s+/g, '-')}`;
    let checkmark = habitArcsContainer.querySelector(`#${checkmarkId}`);
    
    if (!isCompleted && !checkmark) {
        // Find habit data to get color and position
        const habits = personaHabits[currentPersona];
        const habit = habits.find(h => h.name === habitName);
        if (!habit) return;
        
        // Calculate checkmark position
        const clockContainer = document.getElementById('habit-clock');
        const containerSize = clockContainer.offsetWidth;
        const viewBoxSize = 1000;
        const center = viewBoxSize / 2;
        const padding = 50 * (viewBoxSize / containerSize);
        const radius = center - padding;
        
        const startMinutes = habit.start * 60;
        const endMinutes = habit.end * 60;
        const startAngle = (startMinutes / (24 * 60)) * 360 - 90;
        const endAngle = (endMinutes / (24 * 60)) * 360 - 90;
        const midAngle = (startAngle + endAngle) / 2;
        const midAngleRad = (midAngle * Math.PI) / 180;
        
        const checkX = center + Math.cos(midAngleRad) * radius + 12 * (viewBoxSize / containerSize);
        const checkY = center + Math.sin(midAngleRad) * radius - 12 * (viewBoxSize / containerSize);
        
        checkmark = document.createElement('div');
        checkmark.id = checkmarkId;
        checkmark.className = 'habit-checkmark';
        checkmark.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 16 16">
                <circle cx="8" cy="8" r="8" fill="${habit.color}"/>
                <path d="M5 8L7 10L11 6" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        checkmark.style.left = `${(checkX / viewBoxSize) * 100}%`;
        checkmark.style.top = `${(checkY / viewBoxSize) * 100}%`;
        checkmark.style.filter = 'drop-shadow(0 2px 6px rgba(0, 0, 0, 0.4))';
        habitArcsContainer.appendChild(checkmark);
    } else if (isCompleted && checkmark) {
        // Remove checkmark
        checkmark.remove();
    }
    
    // Update center card UI
    const habitCard = document.querySelector('.current-habit-card');
    if (habitCard) {
        const emojiContainer = habitCard.querySelector('.habit-emoji-container');
        const cardEmoji = habitCard.querySelector('.emoji');
        
        if (emojiContainer && cardEmoji) {
            if (!isCompleted) {
                // Mark as completed
                emojiContainer.classList.add('completed');
                cardEmoji.style.opacity = '0.5';
                habitCard.classList.add('completed');
                
                // Add checkmark to card if not exists
                if (!emojiContainer.querySelector('.checkmark-badge')) {
                    const habits = personaHabits[currentPersona];
                    const habit = habits.find(h => h.name === habitName);
                    if (habit) {
                        const badge = document.createElement('div');
                        badge.className = 'checkmark-badge';
                        badge.innerHTML = `
                            <svg width="24" height="24" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="12" fill="${habit.color}"/>
                                <path d="M7 12L10 15L17 8" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        `;
                        emojiContainer.appendChild(badge);
                    }
                }
                
                // Update hint text
                const hint = habitCard.querySelector('.habit-hint');
                if (hint) {
                    hint.textContent = 'Tap to undo';
                }
            } else {
                // Mark as not completed
                emojiContainer.classList.remove('completed');
                cardEmoji.style.opacity = '1';
                habitCard.classList.remove('completed');
                
                // Remove checkmark from card
                const badge = emojiContainer.querySelector('.checkmark-badge');
                if (badge) {
                    badge.remove();
                }
                
                // Update hint text
                const hint = habitCard.querySelector('.habit-hint');
                if (hint) {
                    hint.textContent = `Demo habit for ${currentPersona}`;
                }
            }
        }
    }
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
            loadPersonaHabitClock(persona);
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Load initial persona
    loadPersonaMilestones(currentPersona);
    loadPersonaHabitClock(currentPersona);
    
    // Setup persona selector
    setupPersonaSelector();
    
    // Initialize timeline
    initTimeline();
    
    // Start time indicator immediately
    updateTimeIndicator();
});
