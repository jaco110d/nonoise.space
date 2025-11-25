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
let currentPersona = 'indieHacker';

// Reference date (January 1, 2000 - same as app)
const referenceDate = new Date(2000, 0, 1);

// Elements
const heroSection = document.getElementById('hero-section');
const timeline3d = document.getElementById('timeline-3d');
const dateMarkersContainer = document.getElementById('date-markers');

// Helper function to get future date (matching Swift app's calendar.date(byAdding:))
function getFutureDate(monthsFromNow) {
    const now = new Date();
    const future = new Date(now);
    future.setMonth(future.getMonth() + monthsFromNow);
    return future;
}

// Helper function to format date as 'YYYY-MM-DD'
function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Helper function to format date display text
function formatDisplayText(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Persona Milestones Data - EXACT from Persona.swift (lines 206-276)
const personaMilestones = {
    indieHacker: [
        { date: formatDateString(getFutureDate(14)), emoji: '🚀', title: 'Launch MVP', text: formatDisplayText(getFutureDate(14)) },
        { date: formatDateString(getFutureDate(28)), emoji: '💰', title: 'First Paying Customer', text: formatDisplayText(getFutureDate(28)) },
        { date: formatDateString(getFutureDate(44)), emoji: '👥', title: 'Hire First Employee', text: formatDisplayText(getFutureDate(44)) },
        { date: formatDateString(getFutureDate(60)), emoji: '📈', title: '10K MRR', text: formatDisplayText(getFutureDate(60)) },
        { date: formatDateString(getFutureDate(76)), emoji: '🏆', title: 'Exit/Acquisition', text: formatDisplayText(getFutureDate(76)) }
    ],
    softwareDeveloper: [
        { date: formatDateString(getFutureDate(12)), emoji: '🐛', title: 'Ship Major Feature', text: formatDisplayText(getFutureDate(12)) },
        { date: formatDateString(getFutureDate(26)), emoji: '📚', title: 'Learn New Framework', text: formatDisplayText(getFutureDate(26)) },
        { date: formatDateString(getFutureDate(40)), emoji: '💼', title: 'Senior Developer', text: formatDisplayText(getFutureDate(40)) },
        { date: formatDateString(getFutureDate(55)), emoji: '🎯', title: 'Tech Lead', text: formatDisplayText(getFutureDate(55)) },
        { date: formatDateString(getFutureDate(70)), emoji: '🏆', title: 'Engineering Manager', text: formatDisplayText(getFutureDate(70)) }
    ],
    contentCreator: [
        { date: formatDateString(getFutureDate(13)), emoji: '📸', title: '1K Followers', text: formatDisplayText(getFutureDate(13)) },
        { date: formatDateString(getFutureDate(27)), emoji: '🎬', title: '10K Followers', text: formatDisplayText(getFutureDate(27)) },
        { date: formatDateString(getFutureDate(42)), emoji: '💰', title: 'First Brand Deal', text: formatDisplayText(getFutureDate(42)) },
        { date: formatDateString(getFutureDate(57)), emoji: '📊', title: '100K Followers', text: formatDisplayText(getFutureDate(57)) },
        { date: formatDateString(getFutureDate(73)), emoji: '🏆', title: 'Full-Time Creator', text: formatDisplayText(getFutureDate(73)) }
    ],
    employee: [
        { date: formatDateString(getFutureDate(13)), emoji: '📊', title: 'Q1 Performance Review', text: formatDisplayText(getFutureDate(13)) },
        { date: formatDateString(getFutureDate(27)), emoji: '🎯', title: 'Complete Certification', text: formatDisplayText(getFutureDate(27)) },
        { date: formatDateString(getFutureDate(42)), emoji: '📈', title: 'Promotion', text: formatDisplayText(getFutureDate(42)) },
        { date: formatDateString(getFutureDate(57)), emoji: '💼', title: 'Team Lead Role', text: formatDisplayText(getFutureDate(57)) },
        { date: formatDateString(getFutureDate(72)), emoji: '🏆', title: 'Manager Position', text: formatDisplayText(getFutureDate(72)) }
    ],
    adhdWarrior: [
        { date: formatDateString(getFutureDate(12)), emoji: '🎯', title: 'Consistent Routine - 30 days', text: formatDisplayText(getFutureDate(12)) },
        { date: formatDateString(getFutureDate(26)), emoji: '📚', title: 'Complete Project', text: formatDisplayText(getFutureDate(26)) },
        { date: formatDateString(getFutureDate(40)), emoji: '💪', title: 'Manage Overwhelm Better', text: formatDisplayText(getFutureDate(40)) },
        { date: formatDateString(getFutureDate(55)), emoji: '🧠', title: 'Find Working System', text: formatDisplayText(getFutureDate(55)) },
        { date: formatDateString(getFutureDate(70)), emoji: '🏆', title: 'Thrive, Not Just Survive', text: formatDisplayText(getFutureDate(70)) }
    ],
    anxietyManager: [
        { date: formatDateString(getFutureDate(13)), emoji: '🧘', title: 'Daily Meditation - 30 days', text: formatDisplayText(getFutureDate(13)) },
        { date: formatDateString(getFutureDate(27)), emoji: '🌱', title: 'Anxiety Tools Mastered', text: formatDisplayText(getFutureDate(27)) },
        { date: formatDateString(getFutureDate(42)), emoji: '💪', title: 'Handle Stress Better', text: formatDisplayText(getFutureDate(42)) },
        { date: formatDateString(getFutureDate(57)), emoji: '🎯', title: 'Social Situation Victory', text: formatDisplayText(getFutureDate(57)) },
        { date: formatDateString(getFutureDate(73)), emoji: '🏆', title: 'Anxiety Under Control', text: formatDisplayText(getFutureDate(73)) }
    ],
    burnoutRecovery: [
        { date: formatDateString(getFutureDate(12)), emoji: '😴', title: 'Regular Sleep Schedule', text: formatDisplayText(getFutureDate(12)) },
        { date: formatDateString(getFutureDate(26)), emoji: '🌱', title: 'Energy Returning', text: formatDisplayText(getFutureDate(26)) },
        { date: formatDateString(getFutureDate(40)), emoji: '💼', title: 'Work 4h Comfortably', text: formatDisplayText(getFutureDate(40)) },
        { date: formatDateString(getFutureDate(55)), emoji: '💪', title: 'Feel Like Myself Again', text: formatDisplayText(getFutureDate(55)) },
        { date: formatDateString(getFutureDate(70)), emoji: '🏆', title: 'Fully Recovered', text: formatDisplayText(getFutureDate(70)) }
    ],
    goalCrusher: [
        { date: formatDateString(getFutureDate(13)), emoji: '💪', title: 'Fitness Milestone', text: formatDisplayText(getFutureDate(13)) },
        { date: formatDateString(getFutureDate(27)), emoji: '📚', title: 'Complete Side Project', text: formatDisplayText(getFutureDate(27)) },
        { date: formatDateString(getFutureDate(42)), emoji: '🎯', title: 'Master New Skill', text: formatDisplayText(getFutureDate(42)) },
        { date: formatDateString(getFutureDate(57)), emoji: '🏋️', title: 'Peak Physical Form', text: formatDisplayText(getFutureDate(57)) },
        { date: formatDateString(getFutureDate(73)), emoji: '🏆', title: 'Ultimate Goal Achieved', text: formatDisplayText(getFutureDate(73)) }
    ]
};

let milestones = [];

// Helper function to convert RGB to hex (for colors from Swift app)
function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(x * 255).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

// Persona Habits Data - EXACT from Persona.swift (lines 69-203)
const personaHabits = {
    indieHacker: [
        { emoji: '☕', name: 'Morning Coffee', start: 6, end: 6.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '📧', name: 'Email Inbox Zero', start: 7, end: 8, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '👥', name: 'Team Standup', start: 9, end: 9.5, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '🚀', name: 'Product Development', start: 10, end: 12, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '🍱', name: 'Lunch Break', start: 12, end: 13, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '💰', name: 'Business Meetings', start: 13, end: 15, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '📊', name: 'Analytics Review', start: 15, end: 16, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '🎯', name: 'Strategic Planning', start: 16, end: 17.5, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '🏃', name: 'Gym', start: 18, end: 19, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '🍽️', name: 'Dinner', start: 19, end: 20, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '📚', name: 'Learning Time', start: 20, end: 21.5, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '😴', name: 'Sleep', start: 22, end: 6, color: rgbToHex(0.2, 0.2, 0.4) }
    ],
    softwareDeveloper: [
        { emoji: '☕', name: 'Morning Coffee', start: 7, end: 7.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '📧', name: 'Check Messages', start: 7.5, end: 8, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '👥', name: 'Daily Standup', start: 9, end: 9.25, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '💻', name: 'Deep Code Work', start: 9.5, end: 12.5, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '🍱', name: 'Lunch Break', start: 12.5, end: 13.5, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '🔍', name: 'Code Review', start: 13.5, end: 14.5, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '🐛', name: 'Bug Fixing', start: 14.5, end: 16.5, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '📚', name: 'Learning Time', start: 16.5, end: 17.5, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '🏃', name: 'Exercise', start: 18, end: 19, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '🍽️', name: 'Dinner', start: 19, end: 20, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '🎮', name: 'Relax/Gaming', start: 20, end: 22, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '😴', name: 'Sleep', start: 23, end: 7, color: rgbToHex(0.2, 0.2, 0.4) }
    ],
    contentCreator: [
        { emoji: '🌅', name: 'Morning Routine', start: 7, end: 8, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '💡', name: 'Content Planning', start: 8, end: 9.5, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '📸', name: 'Filming/Shooting', start: 9.5, end: 12.5, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '🍱', name: 'Lunch', start: 12.5, end: 13.5, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '✂️', name: 'Editing', start: 13.5, end: 16.5, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '📱', name: 'Social Engagement', start: 16.5, end: 17.5, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '📊', name: 'Analytics Review', start: 17.5, end: 18.5, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '🍽️', name: 'Dinner', start: 18.5, end: 19.5, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '📝', name: 'Script Writing', start: 19.5, end: 21, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '📚', name: 'Learning/Inspiration', start: 21, end: 22.5, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '😴', name: 'Sleep', start: 23, end: 7, color: rgbToHex(0.5, 0.4, 0.6) }
    ],
    employee: [
        { emoji: '🌅', name: 'Morning Routine', start: 6.5, end: 7.5, color: rgbToHex(0.2, 0.2, 0.4) },
        { emoji: '🚗', name: 'Commute', start: 7.5, end: 8.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '☕', name: 'Coffee & Prep', start: 8.5, end: 9, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '💼', name: 'Deep Work', start: 9, end: 12, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '🍱', name: 'Lunch Break', start: 12, end: 13, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '📞', name: 'Meetings', start: 13, end: 15, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '✉️', name: 'Email & Tasks', start: 15, end: 16.5, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '📊', name: 'Wrap Up', start: 16.5, end: 17, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '🚗', name: 'Commute Home', start: 17, end: 18, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '🍽️', name: 'Dinner', start: 18.5, end: 19.5, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '📺', name: 'Personal Time', start: 19.5, end: 21.5, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '😴', name: 'Sleep', start: 22.5, end: 6.5, color: rgbToHex(0.5, 0.4, 0.6) }
    ],
    adhdWarrior: [
        { emoji: '🌅', name: 'Wake Up Gentle', start: 7, end: 7.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '💊', name: 'Medication', start: 7.5, end: 7.75, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '☕', name: 'Breakfast', start: 7.75, end: 8.25, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '🎯', name: 'Focus Block 1', start: 8.5, end: 10, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '🚶', name: 'Break Walk', start: 10, end: 10.25, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '💻', name: 'Focus Block 2', start: 10.25, end: 11.75, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '🍱', name: 'Lunch', start: 12, end: 13, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '🎯', name: 'Focus Block 3', start: 13.25, end: 14.75, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '🧘', name: 'Mindful Break', start: 14.75, end: 15, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '📝', name: 'Admin/Light Tasks', start: 15, end: 16, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '🏃', name: 'Movement', start: 17, end: 18, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '🍽️', name: 'Dinner', start: 18.5, end: 19.5, color: rgbToHex(0.2, 0.2, 0.4) },
        { emoji: '📱', name: 'Chill Time', start: 19.5, end: 21.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '😴', name: 'Sleep', start: 22.5, end: 7, color: rgbToHex(0.8, 0.3, 0.3) }
    ],
    anxietyManager: [
        { emoji: '🌅', name: 'Gentle Wake Up', start: 7, end: 7.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '🧘', name: 'Morning Meditation', start: 7.5, end: 8, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '☕', name: 'Calm Breakfast', start: 8, end: 8.75, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '📝', name: 'Planning/Journal', start: 8.75, end: 9.25, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '💼', name: 'Light Work', start: 9.5, end: 11.5, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '🍱', name: 'Mindful Lunch', start: 12, end: 13, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '🚶', name: 'Nature Walk', start: 13, end: 13.75, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '💻', name: 'Focused Work', start: 14, end: 16, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '☕', name: 'Tea Break', start: 16, end: 16.5, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '🎨', name: 'Creative Outlet', start: 17, end: 18, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '🍽️', name: 'Dinner', start: 18.5, end: 19.5, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '📚', name: 'Reading', start: 19.5, end: 21, color: rgbToHex(0.2, 0.2, 0.4) },
        { emoji: '🧘', name: 'Evening Wind Down', start: 21, end: 21.5, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '😴', name: 'Sleep', start: 22, end: 7, color: rgbToHex(0.8, 0.3, 0.3) }
    ],
    burnoutRecovery: [
        { emoji: '🌅', name: 'Sleep In', start: 8, end: 9, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '☕', name: 'Slow Breakfast', start: 9, end: 10, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '🧘', name: 'Meditation', start: 10, end: 10.5, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '💻', name: 'Light Work (2h max)', start: 11, end: 13, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '🍱', name: 'Nourishing Lunch', start: 13, end: 14, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '😴', name: 'Rest/Nap', start: 14, end: 15.5, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '🚶', name: 'Gentle Walk', start: 15.5, end: 16.5, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '🎨', name: 'Creative Hobby', start: 16.5, end: 18, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '🍽️', name: 'Easy Dinner', start: 18, end: 19, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '📺', name: 'Relaxation', start: 19, end: 21, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '📚', name: 'Light Reading', start: 21, end: 22, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '😴', name: 'Early Sleep', start: 22, end: 8, color: rgbToHex(0.2, 0.2, 0.4) }
    ],
    goalCrusher: [
        { emoji: '🌅', name: 'Early Rise', start: 5.5, end: 6, color: rgbToHex(0.3, 0.5, 0.7) },
        { emoji: '💧', name: 'Hydrate', start: 6, end: 6.25, color: rgbToHex(0.8, 0.3, 0.3) },
        { emoji: '🏋️', name: 'Morning Workout', start: 6.25, end: 7.5, color: rgbToHex(0.6, 0.4, 0.2) },
        { emoji: '🥗', name: 'Protein Breakfast', start: 7.5, end: 8.25, color: rgbToHex(0.4, 0.3, 0.7) },
        { emoji: '🎯', name: 'Goal Work Session', start: 8.5, end: 11.5, color: rgbToHex(0.3, 0.7, 0.5) },
        { emoji: '🍱', name: 'Meal Prep Lunch', start: 11.5, end: 12.5, color: rgbToHex(0.5, 0.3, 0.6) },
        { emoji: '💼', name: 'Work/Study', start: 13, end: 16, color: rgbToHex(0.7, 0.5, 0.3) },
        { emoji: '📚', name: 'Learning Time', start: 16, end: 17.5, color: rgbToHex(0.9, 0.4, 0.3) },
        { emoji: '💪', name: 'Evening Exercise', start: 18, end: 19, color: rgbToHex(0.6, 0.5, 0.3) },
        { emoji: '🍽️', name: 'Healthy Dinner', start: 19, end: 20, color: rgbToHex(0.4, 0.5, 0.7) },
        { emoji: '📝', name: 'Review & Plan', start: 20, end: 21, color: rgbToHex(0.5, 0.4, 0.6) },
        { emoji: '📖', name: 'Reading', start: 21, end: 22, color: rgbToHex(0.2, 0.2, 0.4) },
        { emoji: '😴', name: 'Sleep', start: 22, end: 5.5, color: rgbToHex(0.3, 0.5, 0.7) }
    ]
};

// Persona Vision Board Data - EXACT from Persona.swift lines 280-330
const personaVisions = {
    indieHacker: [
        { title: "Workspace", imageURL: "https://i.pinimg.com/1200x/9c/0f/ea/9c0fea32ebc989bf3ffe9f04da22b3b6.jpg", order: 0 },
        { title: "Dream car", imageURL: "https://i.pinimg.com/1200x/e4/9a/47/e49a47f664b8a8c59eb2897362f1bd5e.jpg", order: 1 },
        { title: "Family goals", imageURL: "https://i.pinimg.com/1200x/c3/96/0f/c3960f8b344a546a6e5df19a23ed898c.jpg", order: 2 }
    ],
    softwareDeveloper: [
        { title: "Dream setup", imageURL: "https://i.pinimg.com/1200x/19/21/c5/1921c5400fe0a867433e346548887a7d.jpg", order: 0 },
        { title: "Happy family", imageURL: "https://i.pinimg.com/736x/cd/aa/93/cdaa93feb14200b6df76a9a5d9eff885.jpg", order: 1 },
        { title: "Work remotely", imageURL: "https://i.pinimg.com/1200x/92/82/df/9282dfcf02a29efbee8e68aa785565d7.jpg", order: 2 }
    ],
    contentCreator: [
        { title: "Studio dreams", imageURL: "https://i.pinimg.com/1200x/5e/d6/f6/5ed6f6160f99e48563aca2a34039ccdd.jpg", order: 0 },
        { title: "Freedom to travel", imageURL: "https://i.pinimg.com/736x/be/18/6b/be186bd76ee4815dad861f543a42cdf0.jpg", order: 1 },
        { title: "Win big award", imageURL: "https://i.pinimg.com/736x/3d/59/7a/3d597ae549f7c9f3c7fcf74430bb9047.jpg", order: 2 }
    ],
    employee: [
        { title: "Exciting job", imageURL: "https://i.pinimg.com/736x/f8/c5/ef/f8c5ef5e69be14200ff3672ea2a98bf2.jpg", order: 0 },
        { title: "Weekend freedom", imageURL: "https://i.pinimg.com/736x/92/1c/9d/921c9d2571f74851bc7c34170b0f2830.jpg", order: 1 },
        { title: "Financial goals", imageURL: "https://i.pinimg.com/736x/86/ae/a9/86aea9715d102b51d81db6c7e9bee84d.jpg", order: 2 }
    ],
    adhdWarrior: [
        { title: "Organized space", imageURL: "https://i.pinimg.com/1200x/f2/b2/41/f2b2413644da4f99e28e6f8f6aac9805.jpg", order: 0 },
        { title: "Focus time", imageURL: "https://i.pinimg.com/736x/cc/26/6d/cc266d35262e6ac66c7e6f953e39d130.jpg", order: 1 },
        { title: "Appreciate life", imageURL: "https://i.pinimg.com/736x/e8/62/23/e8622378f7775508ee8de9fff1f24d50.jpg", order: 2 }
    ],
    anxietyManager: [
        { title: "Safe space", imageURL: "https://i.pinimg.com/1200x/1f/ea/c2/1feac2015b81b77adbcce6e180c4a6d7.jpg", order: 0 },
        { title: "Inner peace", imageURL: "https://i.pinimg.com/736x/b5/e9/17/b5e917941175d4dc94066462edd75162.jpg", order: 1 },
        { title: "Appreciate life", imageURL: "https://i.pinimg.com/1200x/93/19/de/9319de625a134b257e64efa5ab858665.jpg", order: 2 }
    ],
    burnoutRecovery: [
        { title: "Rest deeply", imageURL: "https://i.pinimg.com/736x/6e/d7/ef/6ed7efd0e7dbeda502a402c096887ebf.jpg", order: 0 },
        { title: "Walk in nature", imageURL: "https://i.pinimg.com/736x/7a/50/1f/7a501f94bdd5b801671c36f0888abb92.jpg", order: 1 },
        { title: "Slow living", imageURL: "https://i.pinimg.com/736x/09/91/58/099158ccfa65c3f778425e9a1aed6789.jpg", order: 2 }
    ],
    goalCrusher: [
        { title: "Dream physique", imageURL: "https://i.pinimg.com/736x/c5/33/c6/c533c688e504be6fc6a28486d3594079.jpg", order: 0 },
        { title: "Productive morning", imageURL: "https://i.pinimg.com/1200x/29/5a/03/295a03fd990f58ae00a8a69573e67f89.jpg", order: 1 },
        { title: "Eat real food", imageURL: "https://i.pinimg.com/736x/47/d1/57/47d15763cabfd6b919d8b2201e9be385.jpg", order: 2 }
    ]
};

let habitCompletions = {};
let currentHabitClock = null;
let clockUpdateInterval = null;

// Get timeline container size (NOT window size - matches Swift's geometry.size)
function getTimelineSize() {
    const timeline = document.getElementById('timeline-3d');
    if (timeline) {
        return {
            width: timeline.offsetWidth,
            height: timeline.offsetHeight
        };
    }
    return {
    width: window.innerWidth,
    height: window.innerHeight
};
}

let screenSize = getTimelineSize();

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

// depthTransform - EXACT copy from TimelineShowcaseView.swift lines 172-215
function depthTransform(zPosition, size) {
    const distance = Math.abs(zPosition);
    
    // Scale - EXACT from line 175-186
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
    
    // Opacity - EXACT from line 188-198
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
    
    // Blur - EXACT from line 200-208
    let blur;
    if (distance < 100) {
        blur = 0;
    } else if (distance < 500) {
        blur = (distance - 100) / 400 * 4;
    } else {
        blur = 4 + (distance - 500) / 500 * 4;
    }
    
    // Offsets - EXACT from line 210-212
    const xOffset = (size.width * 0.6) * (zPosition / 400);
    const yOffset = -(size.height * 0.45) * (zPosition / 400) - 40;
    
    return { scale, opacity, blur, xOffset, yOffset };
}

// Apply transform to element - matches Swift's .position() + .scaleEffect()
function applyDepthTransform(element, zPosition) {
    const size = getTimelineSize();
    const transform = depthTransform(zPosition, size);
    const distance = Math.abs(zPosition);
    
    // EXACT from TimelineShowcaseView.swift line 164:
    // .position(x: size.width / 2 + transform.xOffset, y: size.height / 2 + transform.yOffset)
    const x = size.width / 2 + transform.xOffset;
    const y = size.height / 2 + transform.yOffset;
    
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    element.style.transform = `translate(-50%, -50%) scale(${transform.scale})`;
    element.style.opacity = transform.opacity;
    element.style.filter = `blur(${transform.blur}px)`;
    element.style.zIndex = Math.round(1000 - distance);
    
    // Update selected state (focused card)
    const card = element.querySelector('.milestone-card');
    const isFocused = distance < depthSpacing / 2;
    
    if (card) {
    if (isFocused) {
        card.classList.add('selected');
    } else {
        card.classList.remove('selected');
        }
    }
    
    return transform;
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

// yearMarkerView - EXACT from TimelineShowcaseView.swift lines 132-152
function renderDateMarkers() {
    const markers = generateVisibleMarkers();
    const size = getTimelineSize();
    
    dateMarkersContainer.innerHTML = '';
    
    markers.forEach(marker => {
        const distance = Math.abs(marker.zPos);
        
        // Same depth transform as milestones - EXACT from line 138
        const transform = depthTransform(marker.zPos, size);
        
        const markerEl = document.createElement('div');
        markerEl.className = 'date-marker';
        markerEl.innerHTML = `
            <div class="marker-dot"></div>
            <span>${marker.year}</span>
        `;
        
        // EXACT from line 149:
        // .position(x: size.width / 2 + transform.xOffset, y: size.height / 2 + transform.yOffset + 150)
        const x = size.width / 2 + transform.xOffset;
        const y = size.height / 2 + transform.yOffset + 150;
        
        markerEl.style.left = `${x}px`;
        markerEl.style.top = `${y}px`;
        markerEl.style.transform = `translate(-50%, -50%) scale(${transform.scale})`;
        markerEl.style.opacity = distance < 3000 ? transform.opacity : 0;
        
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

// milestoneView - EXACT from TimelineShowcaseView.swift lines 155-169
function updateMilestones() {
    milestones.forEach((milestone) => {
        const dateStr = milestone.dataset.date;
        const date = parseDate(dateStr);
        const milestoneZ = zPositionForDate(date);
        const zPosition = milestoneZ - scrollOffset;
        
        // EXACT from line 158
        const distance = Math.abs(zPosition);
        
        // EXACT from line 166: opacity check
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
    
    // Release when reaching 2035 or later
    if (currentDate >= new Date(2035, 0, 1)) {
        isTimelineActive = false;
        document.body.style.overflow = 'auto';
        setTimeout(() => {
            document.getElementById('habits').scrollIntoView({ behavior: 'smooth' });
        }, 300);
    }
    // Release when reaching 2025 or earlier
    else if (currentDate <= new Date(2025, 0, 1)) {
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
    if (currentDate >= new Date(2035, 0, 1) || currentDate <= new Date(2025, 0, 1)) {
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
        screenSize = getTimelineSize();
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

// No email form needed - app is now available on Mac App Store

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
        let endMinutes = habit.end * 60;
        
        // Handle habits that cross midnight - EXACT from Swift app (HabitClockComponents.swift line 149-157)
        if (endMinutes < startMinutes) {
            // Add 24 hours (1440 minutes) to end time to handle midnight crossing
            endMinutes += 24 * 60;
        }
        
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
        let start = habit.start;
        let end = habit.end;
        
        // Handle habits that cross midnight
        if (end < start) {
            // If current time is after start (e.g., 23:00), it matches
            if (currentTime >= start) {
                return true;
            }
            // If current time is before end (e.g., 2:00), it matches
            if (currentTime < end) {
                return true;
            }
            return false;
        }
        
        // Normal case: habit doesn't cross midnight
        return currentTime >= start && currentTime < end;
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
        let endMinutes = habit.end * 60;
        
        // Handle habits that cross midnight
        if (endMinutes < startMinutes) {
            endMinutes += 24 * 60;
        }
        
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

// Load and render vision board for persona - EXACT from VisionShowcaseView.swift
function loadPersonaVisionBoard(persona) {
    const visions = personaVisions[persona];
    const container = document.getElementById('vision-cards');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    // HStack with spacing: 30 (from VisionShowcaseView.swift line 34)
    visions.forEach(vision => {
        const card = document.createElement('div');
        card.className = 'vision-card';
        
        card.innerHTML = `
            <div class="vision-card-image">
                <img src="${vision.imageURL}" alt="${vision.title}" loading="lazy">
                <div class="vision-card-title">
                    <span>${vision.title}</span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
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
            
            // Load new persona milestones, habits, and visions
            currentPersona = persona;
            loadPersonaMilestones(persona);
            loadPersonaHabitClock(persona);
            loadPersonaVisionBoard(persona);
        });
    });
}

// Mobile Menu Toggle
function setupMobileMenu() {
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!hamburgerMenu || !mobileMenuOverlay) return;
    
    // Toggle menu
    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenuOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on overlay background
    mobileMenuOverlay.addEventListener('click', (e) => {
        if (e.target === mobileMenuOverlay) {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close menu when clicking on a nav link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    // Update screenSize now that DOM is loaded
    screenSize = getTimelineSize();
    
    // Load initial persona
    loadPersonaMilestones(currentPersona);
    loadPersonaHabitClock(currentPersona);
    loadPersonaVisionBoard(currentPersona);
    
    // Setup persona selector
    setupPersonaSelector();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Initialize timeline
    initTimeline();
    
    // Start time indicator immediately
    updateTimeIndicator();
});
