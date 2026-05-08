let consoleEl, codeEditor, shipImage, winModal, levelIndicators, missionTitle, missionDesc;
let lifeSupportBar, lifeSupportText, enginePowerBar, enginePowerText, energyBar, energyText, velocityBar, velocityText, fuelBar, fuelText, shieldBar, shieldText, distanceText;

function initElements() {
    consoleEl = document.getElementById('console');
    codeEditor = document.getElementById('codeEditor');
    shipImage = document.getElementById('shipImage');
    winModal = document.getElementById('winModal');
    levelIndicators = document.getElementById('levelIndicators');
    missionTitle = document.getElementById('missionTitle');
    missionDesc = document.getElementById('missionDesc');
    
    lifeSupportBar = document.getElementById('lifeSupportBar');
    lifeSupportText = document.getElementById('lifeSupportText');
    enginePowerBar = document.getElementById('enginePowerBar');
    enginePowerText = document.getElementById('enginePowerText');
    energyBar = document.getElementById('energyBar');
    energyText = document.getElementById('energyText');
    velocityBar = document.getElementById('velocityBar');
    velocityText = document.getElementById('velocityText');
    fuelBar = document.getElementById('fuelBar');
    fuelText = document.getElementById('fuelText');
    shieldBar = document.getElementById('shieldBar');
    shieldText = document.getElementById('shieldText');
    distanceText = document.getElementById('distanceText');
}

let currentLevelIndex = 0;
let shipStatus = {
    engine: 0,
    lifeSupport: 10,
    energy: 50,
    velocity: 0,
    fuel: 100,
    shields: 0,
    distance: 1000,
    warp: false
};

const LEVELS = [
    {
        title: "Mission 1: Logical Restoration",
        desc: "CRITICAL: Systems offline. Reboot life support to 100%. Note: The reactor requires engines to be online first.",
        initialStatus: { engine: 0, lifeSupport: 10, energy: 50, velocity: 0, fuel: 100, shields: 0, distance: 1000 },
        goalCondition: (s) => s.engine === 100 && s.lifeSupport === 100,
        functions: ["ship.repair_engine()", "ship.reboot_life_support()"]
    },
    {
        title: "Mission 2: Orbital Escape",
        desc: "PHYSICS: Escape velocity is exactly 200 km/s. Each 1-second burst provides 40 km/s. Calculate the thrust needed.",
        initialStatus: { engine: 100, lifeSupport: 100, energy: 50, velocity: 0, fuel: 100, shields: 0, distance: 1000 },
        goalCondition: (s) => s.velocity === 200,
        functions: ["ship.thrust(seconds)"]
    },
    {
        title: "Mission 3: Warp Jump",
        desc: "ANIMATION: Trigger the Hyperdrive. Requirements: Velocity must be 200 km/s and Energy must be 100%.",
        initialStatus: { engine: 100, lifeSupport: 100, energy: 100, velocity: 200, fuel: 100, shields: 0, distance: 1000 },
        goalCondition: (s) => s.warp === true,
        functions: ["ship.activate_hyperdrive()"]
    },
    {
        title: "Mission 4: Deep Space Braking",
        desc: "OBSTACLE: Asteroid at 0km. You are moving at 200 km/s from 1000km away. Use reverse thrust to stop at the target.",
        initialStatus: { engine: 100, lifeSupport: 100, energy: 100, velocity: 200, fuel: 100, shields: 100, distance: 1000 },
        goalCondition: (s) => s.velocity === 0 && s.distance === 0,
        functions: ["ship.thrust(seconds) # Note: Use negative for reverse"]
    },
    {
        title: "Mission 5: Solar Flare Defense",
        desc: "DEFENSE: Flare incoming in T-minus 5 seconds. Maximize shields to 100% to protect the crew.",
        initialStatus: { engine: 100, lifeSupport: 100, energy: 100, velocity: 0, fuel: 100, shields: 0, distance: 0 },
        goalCondition: (s) => s.shields === 100,
        functions: ["ship.set_shields(percentage)"]
    },
    {
        title: "Mission 6: Final Integration",
        desc: "CHALLENGE: Systems unstable. You must reach 200 km/s, then activate shields, then jump to Warp.",
        initialStatus: { engine: 100, lifeSupport: 100, energy: 100, velocity: 0, fuel: 100, shields: 0, distance: 2000 },
        goalCondition: (s) => s.velocity === 200 && s.shields === 100 && s.warp === true,
        functions: ["ship.thrust(s)", "ship.set_shields(p)", "ship.activate_hyperdrive()"]
    }
];

function log(message, type = 'info') {
    const entry = document.createElement('div');
    entry.className = `console-entry console-${type}`;
    entry.innerText = `> ${message}`;
    consoleEl.appendChild(entry);
    consoleEl.scrollTop = consoleEl.scrollHeight;
}

const ship = {
    repair_engine: () => {
        shipStatus.engine = 100;
        log("Systems: Engines online.", "success");
        updateUI();
    },
    reboot_life_support: () => {
        if (shipStatus.engine < 100) {
            log("Critical Error: Engines must be active first!", "error");
            return;
        }
        shipStatus.lifeSupport = 100;
        log("Systems: Life support restored.", "success");
        updateUI();
    },
    thrust: (duration) => {
        if (shipStatus.fuel <= 0 && duration > 0) {
            log("Physics Error: Out of fuel!", "error");
            return;
        }
        shipStatus.velocity += duration * 40;
        if (shipStatus.velocity < 0) shipStatus.velocity = 0;
        
        if (duration > 0) shipStatus.distance = Math.max(0, shipStatus.distance - (duration * 100));
        else shipStatus.distance = Math.max(0, shipStatus.distance + (duration * 200));

        shipStatus.fuel = Math.max(0, shipStatus.fuel - Math.abs(duration * 5));
        log(`Physics: Velocity ${shipStatus.velocity} km/s. Distance ${shipStatus.distance} km.`, "info");
        updateUI();
    },
    set_shields: (level) => {
        shipStatus.shields = Math.min(100, level);
        shipStatus.energy = Math.max(0, shipStatus.energy - level);
        log(`Energy: Shields set to ${shipStatus.shields}%.`, "success");
        updateUI();
    },
    activate_hyperdrive: () => {
        if (shipStatus.velocity < 200 || shipStatus.energy < 100) {
            log("Animation Error: Warp requirements not met!", "error");
            return;
        }
        shipStatus.warp = true;
        shipImage.classList.add('warping');
        log("Animation: HYPERDRIVE INITIATED.", "success");
        document.body.style.animation = "shake 0.5s infinite";
        setTimeout(() => {
            document.body.style.animation = "none";
            updateUI();
        }, 2000);
    }
};

function initGame() {
    initElements();
    
    let attempts = 0;
    const maxAttempts = 8;

    function tryLoadProgress() {
        attempts++;
        let progress;
        try {
            progress = getProgress();
            if (!progress.levels) progress.levels = {};
            if (progress.levels.navigator === undefined) progress.levels.navigator = 1;
        } catch (e) {
            progress = { levels: { navigator: 1 } };
        }

        // Wait until USER_KEY is confirmed set in localStorage, or give up after maxAttempts
        const user = typeof getUserProfile === 'function' ? getUserProfile() : null;
        const userReady = !user || !user.email || localStorage.getItem('codeverse_user') !== null;

        if (!userReady && attempts < maxAttempts) {
            console.log(`⏳ Waiting for user session... attempt ${attempts}`);
            setTimeout(tryLoadProgress, 200);
            return;
        }

        // Re-read progress after confirming user is set
        try { progress = getProgress(); } catch(e) {}
        if (!progress.levels) progress.levels = {};
        if (progress.levels.navigator === undefined) progress.levels.navigator = 1;

        console.log(`✅ Navigator ready (attempt ${attempts}). Level: ${progress.levels.navigator}`);
        const startLevel = Math.max(0, (progress.levels.navigator || 1) - 1);
        loadLevel(Math.min(startLevel, LEVELS.length - 1));
    }
    
    setTimeout(tryLoadProgress, 300);
}

function renderLevelIndicators() {
    const indicators = document.getElementById('levelIndicators');
    if (!indicators) {
        // If the element isn't ready yet, try again in 200ms
        setTimeout(renderLevelIndicators, 200);
        return;
    }
    
    const progress = getProgress();
    const isCompleted = progress.missions && progress.missions.navigator === true;
    const maxLevel = isCompleted ? LEVELS.length : (progress.levels && progress.levels.navigator ? progress.levels.navigator : 1);

    indicators.innerHTML = '';
    LEVELS.forEach((_, i) => {
        const isLocked = i >= maxLevel;
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === currentLevelIndex ? 'active' : ''}`;
        dot.style.width = '16px';
        dot.style.height = '16px';
        dot.style.borderRadius = '50%';
        dot.style.background = i === currentLevelIndex ? '#10b981' : (isLocked ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)');
        dot.style.border = '2px solid ' + (i === currentLevelIndex ? '#10b981' : 'rgba(255,255,255,0.2)');
        dot.style.cursor = isLocked ? 'not-allowed' : 'pointer';
        dot.style.transition = 'all 0.3s ease';
        if (isLocked) {
            dot.innerText = '🔒';
            dot.style.fontSize = '10px';
            dot.style.display = 'flex';
            dot.style.alignItems = 'center';
            dot.style.justifyContent = 'center';
        }
        if (!isLocked) {
            dot.onclick = () => loadLevel(i);
        }
        dot.title = isLocked ? `Mission ${i + 1} (Locked)` : `Mission ${i + 1}`;
        indicators.appendChild(dot);
    });
}

function loadLevel(index) {
    // Clamp index to available levels
    if (index < 0) index = 0;
    if (index >= LEVELS.length) index = LEVELS.length - 1;
    
    currentLevelIndex = index;
    const level = LEVELS[index];
    missionTitle.innerHTML = `Mission: <span style="color: #10b981;">${level.title}</span>`;
    missionDesc.innerText = level.desc;
    
    // CHALLENGE MODE: Only provide function list, no solution
    let header = "# MISSION FUNCTION LIBRARY\n";
    level.functions.forEach(f => header += `# - ${f}\n`);
    header += "\n# Write your code below:\n";
    
    codeEditor.value = header;
    shipStatus = { ...level.initialStatus, warp: false };
    shipImage.classList.remove('warping');
    updateUI();
    renderLevelIndicators();
    log(`--- MISSION ${index + 1} LOADED ---`);
}

function updateUI() {
    enginePowerBar.style.width = `${shipStatus.engine}%`;
    enginePowerText.innerText = `${shipStatus.engine}%`;
    lifeSupportBar.style.width = `${shipStatus.lifeSupport}%`;
    lifeSupportText.innerText = `${shipStatus.lifeSupport}%`;
    energyBar.style.width = `${shipStatus.energy}%`;
    energyText.innerText = `${shipStatus.energy}%`;
    velocityBar.style.width = `${Math.min(100, (shipStatus.velocity / 200) * 100)}%`;
    velocityText.innerText = `${shipStatus.velocity} km/s`;
    fuelBar.style.width = `${shipStatus.fuel}%`;
    fuelText.innerText = `${shipStatus.fuel}%`;
    shieldBar.style.width = `${shipStatus.shields}%`;
    shieldText.innerText = `${shipStatus.shields}%`;
    distanceText.innerText = `${shipStatus.distance} km`;

    if (LEVELS[currentLevelIndex].goalCondition(shipStatus)) {
        setTimeout(showWin, 1000);
    }
}

function executeCode() {
    const code = codeEditor.value;
    log("Parsing script...");
    const lines = code.split('\n');
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        try {
            if (trimmed === 'ship.repair_engine()') ship.repair_engine();
            else if (trimmed === 'ship.reboot_life_support()') ship.reboot_life_support();
            else if (trimmed === 'ship.activate_hyperdrive()') ship.activate_hyperdrive();
            else if (trimmed.startsWith('ship.set_shields(')) {
                const val = parseFloat(trimmed.match(/\(([^)]+)\)/)[1]);
                ship.set_shields(val);
            }
            else if (trimmed.startsWith('ship.thrust(')) {
                const val = parseFloat(trimmed.match(/\(([^)]+)\)/)[1]);
                ship.thrust(val);
            }
            else log(`Unknown command: ${trimmed}`, "error");
        } catch (e) { log(`Error: ${e.message}`, "error"); }
    });
}

function nextLevel() {
    winModal.style.display = 'none';
    if (currentLevelIndex < LEVELS.length - 1) {
        loadLevel(currentLevelIndex + 1);
    } else {
        // This shouldn't really be reachable if showWin handled it, 
        // but let's make sure it goes back to dashboard if clicked again
        location.href = 'dashboard.html';
    }
}

function showWin() {
    const progress = getProgress();
    if (currentLevelIndex + 2 > progress.levels.navigator) {
        progress.levels.navigator = currentLevelIndex + 2;
        saveProgress(progress);
    }
    
    const isFinal = currentLevelIndex === LEVELS.length - 1;
    if (isFinal) {
        completeMission('navigator', 500);
        document.getElementById('winModalTitle').innerText = "NAVIGATOR GRADUATE! 🏆";
        document.getElementById('winModalDesc').innerText = "You have mastered Python starship logic and celestial navigation.";
        document.getElementById('nextLevelBtn').innerText = "Return to Dashboard";
        
        // Add Revisit Button if not already there
        if (!document.getElementById('revisitBtn')) {
            const revBtn = document.createElement('button');
            revBtn.id = 'revisitBtn';
            revBtn.className = 'run-btn';
            revBtn.style.background = '#1e293b';
            revBtn.style.border = '2px solid #10b981';
            revBtn.innerText = "Revisit Missions";
            revBtn.onclick = () => { winModal.style.display = 'none'; };
            document.getElementById('nextLevelBtn').parentNode.insertBefore(revBtn, document.getElementById('nextLevelBtn'));
            
            const closeX = document.createElement('button');
            closeX.innerText = '✕';
            closeX.style.cssText = "position:absolute; top:20px; right:20px; background:transparent; border:none; color:white; font-size:2rem; cursor:pointer;";
            closeX.onclick = () => { winModal.style.display = 'none'; };
            winModal.querySelector('div').style.position = 'relative';
            winModal.querySelector('div').appendChild(closeX);
        }
    }
    
    winModal.style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
