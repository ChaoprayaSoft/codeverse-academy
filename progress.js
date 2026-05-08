const PROGRESS_KEY = 'codeverse_progress';
const USER_KEY = 'codeverse_user';
const LAST_ACTIVITY_KEY = 'codeverse_last_activity';
const SESSION_TIMEOUT_MS = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

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
            mode: 'no-cors', // Force simple request to bypass CORS blocks
            keepalive: true,
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({
                action,
                email,
                ...extraData
            })
        });
        return { status: 'success' };
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
        const result = await syncWithSheets('sync', {
            progress,
            name: user.name,
            avatar: user.avatar,
            color: user.color || "",
            role: user.role || ""
        });

        if (result && result.status === 'success') {
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
    if (!SHEETS_API_URL || !email || email === 'guest') return null;
    try {
        const response = await fetch(SHEETS_API_URL, {
            method: 'POST',
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
 * Returns the current user's role: 'Admin', 'Teacher', 'Student', or null.
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
    try {
        const data = localStorage.getItem(getProgressKey());
        if (!data) return JSON.parse(JSON.stringify(defaultProgress));

        const parsed = JSON.parse(data);

        // --- DEEP MERGE FAILSAFE ---
        // This ensures that even if the user has old data, 
        // the new 'levels' object and all course fields will always exist.
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

        // Merge Levels (Crucial for fixing the 'broken UI' bug)
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

    // Sync to Google Sheets in background
    const user = getUserProfile();
    if (user && user.email && SHEETS_API_URL) {
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
// --- Session Timeout Logic (6-hour inactivity auto-logout) ---
// =============================================================

/**
 * Stamps the current time as the last user-activity moment.
 * Called on every meaningful user interaction.
 */
function _refreshActivityTimestamp() {
    localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
}

/**
 * Returns true if the session has expired (no activity for SESSION_TIMEOUT_MS).
 * Returns false if the user is not logged in (no action needed).
 */
function _isSessionExpired() {
    const user = getUserProfile();
    if (!user) return false; // Not logged in – nothing to expire

    const lastActivity = parseInt(localStorage.getItem(LAST_ACTIVITY_KEY) || '0', 10);
    if (!lastActivity) return false; // No timestamp recorded yet

    return (Date.now() - lastActivity) >= SESSION_TIMEOUT_MS;
}

/**
 * Checks for expiry and, if expired, logs the user out and redirects to the
 * login page. Safe to call from any page.
 */
async function checkSessionTimeout() {
    if (_isSessionExpired()) {
        console.warn('⏰ Session expired after 6 hours of inactivity. Logging out.');
        await logoutUser();
        // Redirect to index/login page (works from any sub-page)
        const loginPage = location.pathname.includes('index.html') ? 'index.html'
            : location.pathname.split('/').map(() => '..').slice(1).join('/') + 'index.html';
        window.location.href = 'index.html';
    }
}

/**
 * Bootstraps the session-timeout watcher. Call once on page load.
 * - Attaches throttled activity listeners.
 * - Runs a periodic check every 60 seconds.
 * - Does an immediate check on load.
 */
function initSessionTimeout() {
    // --- Immediate check on every page load ---
    checkSessionTimeout();

    // --- Throttled activity listeners (refresh at most once per 30 seconds) ---
    let _throttleTimer = null;
    const THROTTLE_MS = 30 * 1000;

    const _onActivity = () => {
        if (_throttleTimer) return; // Already scheduled
        _refreshActivityTimestamp();
        _throttleTimer = setTimeout(() => { _throttleTimer = null; }, THROTTLE_MS);
    };

    ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'].forEach(event => {
        document.addEventListener(event, _onActivity, { passive: true });
    });

    // --- Periodic check every 60 seconds ---
    setInterval(checkSessionTimeout, 60 * 1000);
}

// Auto-init as soon as this script is loaded
document.addEventListener('DOMContentLoaded', initSessionTimeout);

// =============================================================

/**
 * Logs in a user. On first login (no existing role in Sheets), `role` will be
 * null — the caller (index.html) must then prompt with the Role Selection Modal
 * and call setUserRole() once the user picks.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} avatar
 * @param {string|null} [role=null]  – Optional: pre-supply if already known
 * @returns {{ profile, isNewUser: boolean }}
 */
async function loginUser(name, email, avatar, role = null) {
    const profile = { name, email, avatar, role: role || null };
    localStorage.setItem(USER_KEY, JSON.stringify(profile));
    _refreshActivityTimestamp(); // Start the inactivity clock on login

    // 1. Load progress + role from Sheets
    const remoteData = await loadProgressFromSheets(email);
    let isNewUser = true;
    if (remoteData) {
        isNewUser = false;
        if (remoteData.name)  profile.name  = remoteData.name;
        if (remoteData.avatar) profile.avatar = remoteData.avatar;
        if (remoteData.color)  profile.color  = remoteData.color;
        // Respect the server-side role (Admins are assigned server-side only)
        if (remoteData.role)  profile.role   = remoteData.role;
        localStorage.setItem(USER_KEY, JSON.stringify(profile));

        const localProgress = getProgress();
        if (remoteData.progress && remoteData.progress.xp >= localProgress.xp) {
            localStorage.setItem(`codeverse_progress_${email.replace(/[^a-zA-Z0-9]/g, '')}`, JSON.stringify(remoteData.progress));
        }
    }

    // 2. Record LOGIN in Logs and ensure User exists with initial JSON
    await syncWithSheets('login', {
        name,
        avatar,
        status: 'Login',
        role: profile.role || "",
        progress: getProgress() // Send current progress to initialize if new
    });

    window.dispatchEvent(new Event('userStateChanged'));
    window.dispatchEvent(new Event('progressUpdated'));
    return { profile, isNewUser: isNewUser && !profile.role };
}

/**
 * Saves a newly chosen role for the current user and syncs it to Sheets.
 * Should only be called once per new user (from the role-selection modal).
 * @param {'Teacher'|'Student'} role
 */
async function setUserRole(role) {
    const user = getUserProfile();
    if (!user) return;
    user.role = role;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    await syncNow(); // Push the role to Sheets immediately
    window.dispatchEvent(new Event('userStateChanged'));
}

async function logoutUser() {
    const user = getUserProfile();
    if (user && user.email) {
        // Safe URL builder (handles existing '?' if any)
        const separator = SHEETS_API_URL.includes('?') ? '&' : '?';
        const logoutUrl = `${SHEETS_API_URL}${separator}action=logout&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name)}&status=Logout`;

        console.log("🌌 DEEP SPACE SIGNAL SENT:", logoutUrl);
        
        // THE ULTIMATE PING: Browsers will NEVER block an image-style request
        const ping = new Image();
        ping.src = logoutUrl;
        
        // Wait a tiny moment for the signal to leave the ship
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LAST_ACTIVITY_KEY); // Clear timeout clock on logout
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

