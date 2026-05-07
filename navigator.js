const consoleEl = document.getElementById('console');
const codeEditor = document.getElementById('codeEditor');
const shipImage = document.getElementById('shipImage');
const winModal = document.getElementById('winModal');
const levelIndicators = document.getElementById('levelIndicators');
const missionTitle = document.getElementById('missionTitle');
const missionDesc = document.getElementById('missionDesc');

// Status Elements
const lifeSupportBar = document.getElementById('lifeSupportBar');
const lifeSupportText = document.getElementById('lifeSupportText');
const enginePowerBar = document.getElementById('enginePowerBar');
const enginePowerText = document.getElementById('enginePowerText');
const energyBar = document.getElementById('energyBar');
const energyText = document.getElementById('energyText');
const velocityBar = document.getElementById('velocityBar');
const velocityText = document.getElementById('velocityText');
const fuelBar = document.getElementById('fuelBar');
const fuelText = document.getElementById('fuelText');
const shieldBar = document.getElementById('shieldBar');
const shieldText = document.getElementById('shieldText');
const distanceText = document.getElementById('distanceText');

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
    const progress = getProgress();
    const startLevel = (progress.levels.navigator || 1) - 1;
    loadLevel(startLevel);
}

function renderLevelIndicators() {
    levelIndicators.innerHTML = '';
    LEVELS.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === currentLevelIndex ? 'active' : ''}`;
        dot.style.width = '20px';
        dot.style.height = '20px';
        dot.style.borderRadius = '50%';
        dot.style.background = i === currentLevelIndex ? '#10b981' : 'rgba(255,255,255,0.1)';
        dot.style.display = 'flex';
        dot.style.justifyContent = 'center';
        dot.style.alignItems = 'center';
        dot.style.fontSize = '0.6rem';
        dot.style.color = i === currentLevelIndex ? '#020617' : '#64748b';
        dot.style.cursor = 'pointer';
        dot.onclick = () => loadLevel(i);
        dot.innerText = i + 1;
        levelIndicators.appendChild(dot);
    });
}

function loadLevel(index) {
    currentLevelIndex = index;
    
    // Save progress: only update if we reached a NEW level
    const progress = getProgress();
    if (index + 1 > progress.levels.navigator) {
        progress.levels.navigator = index + 1;
        saveProgress(progress);
    }
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

function showWin() {
    if (currentLevelIndex === LEVELS.length - 1) completeMission('navigator', 500);
    winModal.style.display = 'flex';
}

function nextLevel() {
    winModal.style.display = 'none';
    if (currentLevelIndex < LEVELS.length - 1) loadLevel(currentLevelIndex + 1);
    else location.href = 'dashboard.html';
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
