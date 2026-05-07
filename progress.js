const PROGRESS_KEY = 'codeverse_progress';
const USER_KEY = 'codeverse_user';

// --- Google Sheets Sync Logic ---
// IMPORTANT: Replace this with your Google Apps Script Web App URL after deployment
const SHEETS_API_URL = 'https://script.google.com/macros/s/AKfycbwlFbkGFdmLHA0olAwITzqUhCvD2bmfVkQRIN5XHAlAU8cyoQFmtgyQnBsbKKLExFEoJg/exec';

async function syncWithSheets(action, extraData = {}) {
    if (!SHEETS_API_URL) return null;

    const user = getUserProfile();
    const email = user ? user.email : 'guest';

    try {
        const response = await fetch(SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action,
                email,
                ...extraData
            })
        });
        return response;
    } catch (error) {
        console.error('Sheets Sync Error:', error);
        return null;
    }
}

async function syncNow() {
    const user = getUserProfile();
    const progress = getProgress();
    if (!user || !user.email || !SHEETS_API_URL) return { status: 'error', message: 'Sync unavailable' };
    
    try {
        const response = await syncWithSheets('sync_progress', { 
            progress,
            name: user.name,
            avatar: user.avatar,
            color: user.color || ""
        });
        if (response) {
            return { status: 'success', message: 'Cloud Synced' };
        }
    } catch (e) {
        return { status: 'error', message: 'Sync failed' };
    }
    return { status: 'error', message: 'Sync failed' };
}

// Function to specifically load progress (needs a regular fetch, not no-cors)
async function loadProgressFromSheets(email) {
    if (!SHEETS_API_URL || !email || email === 'guest') return null;

    try {
        const response = await fetch(SHEETS_API_URL, {
            method: 'POST',
            body: JSON.stringify({
                action: 'load_progress',
                email: email
            })
        });
        const result = await response.json();
        if (result.status === 'success') {
            return {
                progress: result.progress,
                name: result.name,
                avatar: result.avatar,
                color: result.color
            };
        }
    } catch (error) {
        console.warn('Could not load progress from sheets:', error);
    }
    return null;
}

// --- User Profile Logic ---
function getUserProfile() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

function getUserId() {
    const user = getUserProfile();
    if (user && user.email) {
        return user.email.replace(/[^a-zA-Z0-9]/g, '');
    }
    return 'guest';
}

function getProgressKey() {
    return `codeverse_progress_${getUserId()}`;
}

function getLevelKey(course) {
    return `codeverse_${course}_level_${getUserId()}`;
}

const defaultProgress = {
    xp: 0,
    missions: {
        explorer: false,
        navigator: false,
        commander: false,
        architect: false,
        data_analytic: false,
        ai_ml: false,
        vision: false
    },
    levels: {
        explorer: 1,
        navigator: 1,
        commander: 1,
        architect: 1,
        data_analytic: 1,
        ai_ml: 1,
        vision: 1
    },
    badges: []
};

// --- Progress Logic ---
function getProgress() {
    const data = localStorage.getItem(getProgressKey());
    return data ? JSON.parse(data) : defaultProgress;
}

function saveProgress(progress) {
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    window.dispatchEvent(new Event('progressUpdated'));

    // Sync to Google Sheets in background
    const user = getUserProfile();
    if (user && user.email && SHEETS_API_URL) {
        syncWithSheets('sync_progress', { 
            progress,
            name: user.name,
            avatar: user.avatar,
            color: user.color || ""
        });
    }
}

// --- User Auth Logic ---

async function loginUser(name, email, avatar) {
    const profile = { name, email, avatar };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));

    // 1. Log login to Sheets
    if (SHEETS_API_URL) {
        syncWithSheets('login', { name });
    }

    // 2. Try to load progress and profile from Sheets
    const remoteData = await loadProgressFromSheets(email);
    if (remoteData) {
        // Restore Name, Avatar, Color
        if (remoteData.name) profile.name = remoteData.name;
        if (remoteData.avatar) profile.avatar = remoteData.avatar;
        if (remoteData.color) profile.color = remoteData.color;
        localStorage.setItem(USER_KEY, JSON.stringify(profile));

        // Restore Progress
        const localProgress = getProgress();
        if (remoteData.progress && remoteData.progress.xp >= localProgress.xp) {
            console.log('Restoring progress from Google Sheets...');
            localStorage.setItem(`codeverse_progress_${email.replace(/[^a-zA-Z0-9]/g, '')}`, JSON.stringify(remoteData.progress));
        }
    }

    window.dispatchEvent(new Event('userStateChanged'));
    window.dispatchEvent(new Event('progressUpdated'));
    return profile;
}

function logoutUser() {
    localStorage.removeItem(USER_KEY);
    window.dispatchEvent(new Event('userStateChanged'));
}

function completeMission(missionId, xpReward) {
    const progress = getProgress();
    if (!progress.missions[missionId]) {
        progress.missions[missionId] = true;
        progress.xp += xpReward;

        // Add badge if not already there
        const badgeName = missionId.charAt(0).toUpperCase() + missionId.slice(1) + " Wings";
        if (!progress.badges.includes(badgeName)) {
            progress.badges.push(badgeName);
        }

        saveProgress(progress);
        console.log(`Mission ${missionId} completed! Reward: ${xpReward} XP`);
    }
}

// Global UI Updater for progress bars (if they exist on the page)
function updateGlobalProgressUI() {
    const progress = getProgress();
    const xpElements = document.querySelectorAll('.global-xp-value');
    xpElements.forEach(el => el.innerText = progress.xp);

    const barElements = document.querySelectorAll('.global-xp-bar');
    barElements.forEach(bar => {
        const percentage = Math.min(100, (progress.xp / 2950) * 100); // Max XP is 2950
        bar.style.width = percentage + '%';
    });
}

document.addEventListener('DOMContentLoaded', updateGlobalProgressUI);
window.addEventListener('progressUpdated', updateGlobalProgressUI);

