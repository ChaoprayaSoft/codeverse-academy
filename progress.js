const PROGRESS_KEY = 'codeverse_progress';
const USER_KEY = 'codeverse_user';
const LAST_ACTIVITY_KEY = 'codeverse_last_activity';
const SESSION_TIMEOUT_MS = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

// --- Backend API Sync Logic ---
// Secure Vercel API endpoint for CodeVerse
const BACKEND_API_URL = '/api/codeverse';

async function syncWithSheets(action, extraData = {}) {
    if (!BACKEND_API_URL) return null;

    const user = getUserProfile();
    const email = user ? user.email : 'guest';
    const token = localStorage.getItem('codeverse_google_token');
    
    if (!token) return null;

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                action,
                email,
                ...extraData
            })
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Backend Sync Error:', error);
        return null;
    }
}

async function syncNow() {
    const user = getUserProfile();
    const progress = getProgress();
    if (!user || !user.email || !BACKEND_API_URL) return { status: 'error', message: 'Sync unavailable' };

    try {
        const result = await syncWithSheets('sync', {
            progress,
            name: user.name,
            avatar: user.avatar,
            color: user.color || "",
            role: user.role || ""
        });

        if (result && result.status === 'success') {
            // Update local profile with server-side role and data
            if (result.role || result.name || result.avatar || result.color) {
                const updatedUser = getUserProfile();
                if (updatedUser) {
                    if (result.role) updatedUser.role = result.role;
                    if (result.name) updatedUser.name = result.name;
                    if (result.avatar) updatedUser.avatar = result.avatar;
                    if (result.color) updatedUser.color = result.color;
                    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
                }
            }
            // Update local progress with server-side progress
            if (result.progress) {
                localStorage.setItem(getProgressKey(), JSON.stringify(result.progress));
            }
            window.dispatchEvent(new Event('userStateChanged'));
            window.dispatchEvent(new Event('progressUpdated'));
            return { status: 'success', message: 'Cloud Synced' };
        }
    } catch (e) {
        return { status: 'error', message: 'Sync failed' };
    }
    return { status: 'error', message: 'Sync failed' };
}

// Function to specifically load progress (needs a regular fetch, not no-cors)
// Returns: { status, name, avatar, color, role, progress } or null
async function loadProgressFromSheets(email) {
    if (!BACKEND_API_URL || !email || email === 'guest') return null;
    const token = localStorage.getItem('codeverse_google_token');
    if (!token) return null;

    try {
        const response = await fetch(BACKEND_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ action: 'load', email })
        });
        const result = await response.json();
        return result.status === 'success' ? result : null;
    } catch (e) {
        console.error('Progress Load Error:', e);
        return null;
    }
}

// --- User Profile Logic ---
function getUserProfile() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
}

/**
 * Returns the current user's role: 'Admin', 'Teacher', 'Student', 'Guest', or null.
 */
function getUserRole() {
    const user = getUserProfile();
    return user ? (user.role || null) : null;
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
        vision: false,
        prompt_eng: false,
        robotics: false
    },
    levels: {
        explorer: 1,
        navigator: 1,
        commander: 1,
        architect: 1,
        data_analytic: 1,
        ai_ml: 1,
        vision: 1,
        prompt_eng: 1,
        robotics: 1
    },
    badges: []
};

// --- Progress Logic ---
function getProgress() {
    try {
        const data = localStorage.getItem(getProgressKey());
        if (!data) return JSON.parse(JSON.stringify(defaultProgress));

        const parsed = JSON.parse(data);

        // --- DEEP MERGE FAILSAFE ---
        const safeProgress = JSON.parse(JSON.stringify(defaultProgress));

        if (parsed.xp !== undefined) safeProgress.xp = parsed.xp;
        if (parsed.badges) safeProgress.badges = parsed.badges;

        // Merge Missions
        if (parsed.missions) {
            for (const key in safeProgress.missions) {
                if (parsed.missions[key] !== undefined) {
                    safeProgress.missions[key] = parsed.missions[key];
                }
            }
        }

        // Merge Levels
        if (parsed.levels) {
            for (const key in safeProgress.levels) {
                if (parsed.levels[key] !== undefined) {
                    safeProgress.levels[key] = parsed.levels[key];
                }
            }
        }

        return safeProgress;
    } catch (e) {
        console.error("Progress Corruption Detected. Resetting to defaults.", e);
        return JSON.parse(JSON.stringify(defaultProgress));
    }
}

function saveProgress(progress) {
    localStorage.setItem(getProgressKey(), JSON.stringify(progress));
    window.dispatchEvent(new Event('progressUpdated'));

    // Sync to backend
    const user = getUserProfile();
    if (user && user.email && BACKEND_API_URL) {
        syncWithSheets('sync', {
            progress,
            name: user.name,
            avatar: user.avatar,
            color: user.color || ""
        });
    }
}

// --- User Auth Logic ---

// =============================================================
// --- Session Timeout Logic (1-hour inactivity auto-logout) ---
// =============================================================

function _refreshActivityTimestamp() {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

function _isSessionExpired() {
    const user = getUserProfile();
    if (!user) return false;

    const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
    if (!lastActivity) return false;

    return (Date.now() - lastActivity) >= SESSION_TIMEOUT_MS;
}

async function checkSessionTimeout() {
    if (_isSessionExpired()) {
        console.warn('⏰ Session expired after 1 hour of inactivity. Logging out.');
        await logoutUser();
        window.location.href = 'index.html';
    }
}

function initSessionTimeout() {
    checkSessionTimeout();
    let _throttleTimer = null;
    const THROTTLE_MS = 30 * 1000;
    const _onActivity = () => {
        if (_throttleTimer) return;
        _refreshActivityTimestamp();
        _throttleTimer = setTimeout(() => { _throttleTimer = null; }, THROTTLE_MS);
    };
    ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'].forEach(event => {
        document.addEventListener(event, _onActivity, { passive: true });
    });
    setInterval(checkSessionTimeout, 60 * 1000);
}

document.addEventListener('DOMContentLoaded', initSessionTimeout);

/**
 * Logs in a user.
 */
async function loginUser(name, email, avatar, role = null) {
    const profile = { name, email, avatar, role: role || null };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    _refreshActivityTimestamp();

    const remoteData = await loadProgressFromSheets(email);
    let isNewUser = true;
    if (remoteData) {
        isNewUser = false;
        if (remoteData.name) profile.name = remoteData.name;
        if (remoteData.avatar) profile.avatar = remoteData.avatar;
        if (remoteData.color) profile.color = remoteData.color;
        if (remoteData.role) profile.role = remoteData.role;
        localStorage.setItem(USER_KEY, JSON.stringify(profile));

        const localProgress = getProgress();
        if (remoteData.progress && remoteData.progress.xp >= localProgress.xp) {
            localStorage.setItem(getProgressKey(), JSON.stringify(remoteData.progress));
        }
    }

    const loginResult = await syncWithSheets('login', {
        name: profile.name,
        avatar: profile.avatar,
        status: 'Login',
        role: profile.role || "",
        progress: getProgress()
    });

    // Use server response as authoritative source for role
    if (loginResult && loginResult.status === 'success') {
        if (loginResult.role) {
            profile.role = loginResult.role;
        }
        if (loginResult.progress) {
            localStorage.setItem(getProgressKey(), JSON.stringify(loginResult.progress));
        }
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
    }

    window.dispatchEvent(new Event('userStateChanged'));
    window.dispatchEvent(new Event('progressUpdated'));
    return { profile, isNewUser: isNewUser && !profile.role };
}

async function setUserRole(role) {
    const user = getUserProfile();
    if (!user) return;
    user.role = role;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    await syncNow();
    window.dispatchEvent(new Event('userStateChanged'));
}

async function logoutUser() {
    const user = getUserProfile();
    if (user && user.email) {
        const token = localStorage.getItem('codeverse_google_token');
        if (token) {
            try {
                await fetch(`${BACKEND_API_URL}?action=logout&email=${encodeURIComponent(user.email)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } catch (e) {}
        }
    }
    localStorage.removeItem('codeverse_google_token');
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY);
    window.dispatchEvent(new Event('userStateChanged'));
}

function awardXP(amount) {
    console.warn("awardXP is deprecated. Use secure server progression.");
}

function completeMission(missionId, xpReward) {
    console.warn("completeMission is deprecated. Use secure server progression.");
}

async function secureAdvanceLevel(courseKey, newLevel) {
    const result = await syncWithSheets('advanceLevel', { courseKey, newLevel });
    if (result && result.progress) {
        localStorage.setItem(getProgressKey(), JSON.stringify(result.progress));
        window.dispatchEvent(new Event('progressUpdated'));
    }
}

async function secureCompleteCourse(courseKey) {
    const result = await syncWithSheets('completeCourse', { courseKey });
    if (result && result.progress) {
        localStorage.setItem(getProgressKey(), JSON.stringify(result.progress));
        window.dispatchEvent(new Event('progressUpdated'));
    }
}

function updateGlobalProgressUI() {
    const progress = getProgress();
    const xpElements = document.querySelectorAll('.global-xp-value');
    xpElements.forEach(el => el.innerText = progress.xp);

    const barElements = document.querySelectorAll('.global-xp-bar');
    barElements.forEach(bar => {
        const percentage = Math.min(100, (progress.xp / 11000) * 100);
        bar.style.width = percentage + '%';
    });
}

document.addEventListener('DOMContentLoaded', updateGlobalProgressUI);
window.addEventListener('progressUpdated', updateGlobalProgressUI);

async function refreshRoleFromSheets() {
    const user = getUserProfile();
    if (!user || !user.email) return;

    try {
        const remoteData = await loadProgressFromSheets(user.email);
        if (remoteData && remoteData.role) {
            user.role = remoteData.role;
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            window.dispatchEvent(new Event('userStateChanged'));
        }
    } catch (e) {}
}

document.addEventListener('DOMContentLoaded', refreshRoleFromSheets);
