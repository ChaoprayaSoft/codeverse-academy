let currentLevelIndex = 0;
let sequence = [];
let isRunning = false;
let astronautPos = { x: 0, y: 0 };
let lastDirection = 'right';
const GRID_SIZE = 5;
const CELL_SIZE = 78;

const astronaut = document.getElementById('astronaut');
const sequenceList = document.getElementById('sequenceList');
const runBtn = document.getElementById('runBtn');
const winModal = document.getElementById('winModal');
const grid = document.getElementById('grid');
const levelIndicators = document.getElementById('levelIndicators');
const missionTitle = document.getElementById('missionTitle');
const missionDesc = document.getElementById('missionDesc');

const LEVELS = [
    {
        title: "The Golden Star",
        desc: "Course: Sequential Thinking. Help your hero reach the star!",
        start: { x: 0, y: 0 },
        goal: { x: 4, y: 2 },
        walls: []
    },
    {
        title: "The Great Wall",
        desc: "Course: Problem Solving. Use 'Space Jump' to fly OVER the asteroid belt!",
        start: { x: 0, y: 2 },
        goal: { x: 4, y: 2 },
        walls: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }, { x: 2, y: 4 }]
    },
    {
        title: "The Loop Nebula",
        desc: "Course: Loops & Patterns. Use 'Repeat 2x' to double your next moves!",
        start: { x: 0, y: 2 },
        goal: { x: 4, y: 2 },
        walls: []
    },
    {
        title: "Asteroid Field",
        desc: "Course: Problem Solving. Navigate around or jump over the space walls!",
        start: { x: 0, y: 0 },
        goal: { x: 4, y: 4 },
        walls: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 3, y: 3 }, { x: 3, y: 4 }]
    },
    {
        title: "Binary Stars",
        desc: "Final Challenge! Use loops, jumps, and logic to reach the goal.",
        start: { x: 0, y: 4 },
        goal: { x: 4, y: 0 },
        walls: [{ x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }]
    }
];

const CHARACTERS = [
    { id: 'astronaut', emoji: '👨‍🚀', label: 'Astronaut' },
    { id: 'alien',     emoji: '👾', label: 'Alien' },
    { id: 'robot',     emoji: '🤖', label: 'Robot' },
    { id: 'duck',      emoji: '🐥', label: 'Rubber Duck' },
    { id: 'panda',     emoji: '🐼', label: 'Cute Panda' },
    { id: 'tiger',     emoji: '🐯', label: 'Little Tiger' },
    { id: 'unicorn',   emoji: '🦄', label: 'Unicorn' },
    { id: 'dino',      emoji: '🦖', label: 'Dino-Bot' },
    { id: 'dragon',    emoji: '🐲', label: 'Fire Dragon' },
    { id: 'cat',       emoji: '🐱', label: 'Space Cat' },
    { id: 'dog',       emoji: '🐶', label: 'Cyber Dog' },
    { id: 'bee',       emoji: '🐝', label: 'Busy Bee' },
];

let selectedCharId  = null;   // highlighted in the picker
let activeCharEmoji = '👨‍🚀'; // what actually appears on the grid

function getCharKey() {
    return `codeverse_explorer_char_${getUserId()}`;
}

function showCharPicker() {
    // Remove any old overlay
    const old = document.getElementById('charSelectOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'charSelectOverlay';
    overlay.style.cssText = `
        position:fixed; inset:0; z-index:2000;
        background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);
        display:flex; align-items:center; justify-content:center;
        pointer-events:all;
    `;

    const saved = localStorage.getItem(getCharKey());
    // Ensure the saved ID still exists in our updated list
    const exists = CHARACTERS.some(c => c.id === saved);
    selectedCharId = exists ? saved : CHARACTERS[0].id;

    function buildOverlayHTML() {
        overlay.innerHTML = `
            <div style="text-align:center;color:white;padding:2rem">
                <div style="font-size:3rem;margin-bottom:0.5rem">🚀</div>
                <h1 style="font-size:2.5rem;margin:0 0 0.5rem;
                    background:linear-gradient(90deg,#06b6d4,#a78bfa);
                    -webkit-background-clip:text;-webkit-text-fill-color:transparent">
                    Choose Your Hero!
                </h1>
                <p style="color:#94a3b8;margin-bottom:2rem">Pick who will guide through the coding galaxy</p>
                <div id="charGrid" style="display:flex;flex-wrap:wrap;justify-content:center;gap:1rem;max-width:620px;margin:0 auto 2rem"></div>
                <button id="confirmBtn" style="
                    background:linear-gradient(90deg,#06b6d4,#a78bfa);
                    border:none;color:white;font-size:1.2rem;font-weight:800;
                    padding:1rem 3rem;border-radius:50px;cursor:pointer;
                    box-shadow:0 8px 30px rgba(6,182,212,0.4);
                ">🎮 Let's Go!</button>
            </div>
        `;

        // Build character cards
        const grid = overlay.querySelector('#charGrid');
        CHARACTERS.forEach(c => {
            const card = document.createElement('div');
            card.style.cssText = `
                width:110px;padding:1rem 0.5rem;border-radius:20px;
                cursor:pointer;text-align:center;user-select:none;
                border:3px solid ${selectedCharId === c.id ? '#06b6d4' : 'transparent'};
                background:${selectedCharId === c.id ? 'rgba(6,182,212,0.2)' : 'rgba(255,255,255,0.06)'};
                transition:all 0.2s;
            `;
            card.innerHTML = `<div style="font-size:3rem">${c.emoji}</div><div style="font-size:0.8rem;margin-top:0.4rem;color:#cbd5e1;font-weight:700">${c.label}</div>`;
            card.addEventListener('click', () => {
                selectedCharId = c.id;
                // Live preview: update the character on the grid immediately
                activeCharEmoji = c.emoji;
                if (typeof astronaut !== 'undefined') {
                    astronaut.innerText = c.emoji;
                }
                buildOverlayHTML(); // rebuild to update highlight
            });
            grid.appendChild(card);
        });

        // Confirm button
        overlay.querySelector('#confirmBtn').addEventListener('click', () => {
            localStorage.setItem(getCharKey(), selectedCharId);
            const found = CHARACTERS.find(c => c.id === selectedCharId);
            activeCharEmoji = found ? found.emoji : '👨‍🚀';
            
            // Update immediately
            if (typeof astronaut !== 'undefined') {
                astronaut.innerText = activeCharEmoji;
            }
            
            overlay.remove();

            // Only initialize game if we are at the very start (no level loaded yet)
            // If currentLevelIndex is -1 or null, we need to init.
            // Let's check if the grid is empty.
            if (grid.innerHTML === '') {
                initGame();
            } else {
                // Just refresh UI for the new character
                updateAstronautUI();
            }
        });
    }

    buildOverlayHTML();
    document.body.appendChild(overlay);
}

function changeHero() {
    showCharPicker();
}

function renderCharGrid() {} // kept for compatibility

function confirmCharacter() {} // kept for compatibility

function initGame() {
    let attempts = 0;
    function tryLoad() {
        attempts++;
        const userReady = localStorage.getItem('codeverse_user') !== null || attempts >= 8;
        if (!userReady) { setTimeout(tryLoad, 200); return; }
        const progress = getProgress();
        if (!progress.levels) progress.levels = {};
        if (!progress.levels.explorer) progress.levels.explorer = 1;
        const startLevel = Math.min(Math.max(0, progress.levels.explorer - 1), LEVELS.length - 1);
        console.log(`✅ Explorer ready. Level: ${progress.levels.explorer}`);
        loadLevel(startLevel);
    }
    setTimeout(tryLoad, 300);
}

function renderLevelIndicators() {
    const indicators = document.getElementById('levelIndicators');
    if (!indicators) {
        setTimeout(renderLevelIndicators, 200);
        return;
    }
    
    indicators.innerHTML = '';
    LEVELS.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === currentLevelIndex ? 'active' : ''}`;
        dot.innerText = i + 1;
        dot.style.background = i === currentLevelIndex ? 'var(--accent)' : 'rgba(255,255,255,0.4)';
        dot.style.color = i === currentLevelIndex ? 'white' : 'rgba(255,255,255,0.6)';
        dot.style.cursor = 'pointer';
        dot.onclick = () => loadLevel(i);
        indicators.appendChild(dot);
    });
}

function loadLevel(index) {
    if (index < 0) index = 0;
    if (index >= LEVELS.length) index = LEVELS.length - 1;
    currentLevelIndex = index;
    
    const level = LEVELS[index];
    missionTitle.innerHTML = `Mission ${index + 1}: <span style="color: var(--accent);">${level.title}</span>`;
    missionDesc.innerText = level.desc;
    astronautPos = { ...level.start };
    lastDirection = 'right';
    updateAstronautUI();
    clearProgram();
    renderGrid(level.goal, level.walls);
    renderLevelIndicators();
}

function renderGrid(goalPos, walls) {
    grid.innerHTML = '';
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            const isWall = walls.some(w => w.x === x && w.y === y);
            if (isWall) cell.classList.add('wall');
            if (x === goalPos.x && y === goalPos.y) cell.innerText = '⭐';
            grid.appendChild(cell);
        }
    }
}

function updateAstronautUI() {
    const offsetX = (astronautPos.x * CELL_SIZE) - (2 * CELL_SIZE);
    const offsetY = (astronautPos.y * CELL_SIZE) - (2 * CELL_SIZE);

    let scaleX = 1;
    if (lastDirection === 'left') scaleX = -1;

    astronaut.style.transform = `translate(${offsetX}px, ${offsetY}px) scaleX(${scaleX})`;
    // Keep emoji in sync in case it was just set
    astronaut.innerText = activeCharEmoji;
}

function addCommand(type, label) {
    if (isRunning || sequence.length >= 10) return;
    const cmd = { type, label, id: Date.now() + Math.random(), children: [] };
    sequence.push(cmd);
    renderSequence();
}

function removeCommand(id) {
    if (isRunning) return;
    sequence = sequence.filter(cmd => cmd.id !== id);
    sequence.forEach(cmd => {
        if (cmd.children) cmd.children = cmd.children.filter(c => c.id !== id);
    });
    renderSequence();
}

function createBlockElement(cmd, isChild = false) {
    const div = document.createElement('div');
    const colorClass = cmd.type.includes('repeat') ? 'block-orange' : 
                      (cmd.type.includes('up') || cmd.type.includes('down') ? 'block-purple' : 
                      (cmd.type.includes('jump') ? 'block-pink' : 'block-blue'));
    
    div.className = `block ${colorClass} ${isChild ? 'loop-child' : ''}`;
    div.draggable = true;
    div.id = `block-${cmd.id}`;
    
    const tooltips = {
        'right': 'Move 1 step right.',
        'left': 'Move 1 step left.',
        'up': 'Move 1 step up.',
        'down': 'Move 1 step down.',
        'jump': 'Leap 2 spaces forward! Can fly over walls.',
        'repeat2': 'Repeat everything inside twice.'
    };
    div.title = tooltips[cmd.type] || '';
    div.innerHTML = `<span>${cmd.label}</span><button class="delete-btn" onclick="removeCommand(${cmd.id})">✕</button>`;
    
    div.addEventListener('dragstart', (e) => {
        div.classList.add('dragging');
        e.dataTransfer.setData('blockId', cmd.id);
    });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    
    return div;
}

function renderSequence() {
    sequenceList.innerHTML = '';
    sequence.forEach((cmd) => {
        if (cmd.type === 'repeat2') {
            const container = document.createElement('div');
            container.className = 'loop-container';
            container.appendChild(createBlockElement(cmd));
            
            const body = document.createElement('div');
            body.className = 'loop-body';
            body.style.minHeight = '40px';
            
            if (cmd.children.length === 0) {
                body.innerHTML = `<div style="padding: 10px; font-size: 0.7rem; color: #64748b; border: 1px dashed #64748b; border-radius: 8px; text-align: center;">Drop blocks here</div>`;
            } else {
                cmd.children.forEach(childCmd => body.appendChild(createBlockElement(childCmd, true)));
            }
            
            body.addEventListener('dragover', e => { e.preventDefault(); body.style.background = 'rgba(251, 146, 60, 0.1)'; });
            body.addEventListener('dragleave', () => body.style.background = 'transparent');
            body.addEventListener('drop', e => {
                e.preventDefault();
                body.style.background = 'transparent';
                const draggedId = parseFloat(e.dataTransfer.getData('blockId'));
                addBlockToLoop(draggedId, cmd.id);
            });

            container.appendChild(body);
            container.appendChild(Object.assign(document.createElement('div'), {className: 'loop-footer'}));
            sequenceList.appendChild(container);
        } else {
            sequenceList.appendChild(createBlockElement(cmd));
        }
    });
}

function addBlockToLoop(blockId, loopId) {
    let blockToMove = null;
    sequence = sequence.filter(cmd => {
        if (cmd.id === blockId) { blockToMove = cmd; return false; }
        return true;
    });
    if (blockToMove) {
        const loop = sequence.find(cmd => cmd.id === loopId);
        if (loop) { loop.children.push(blockToMove); renderSequence(); }
    }
}

function clearProgram() {
    if (isRunning) return;
    sequence = [];
    renderSequence();
    astronautPos = { ...LEVELS[currentLevelIndex].start };
    lastDirection = 'right';
    updateAstronautUI();
    astronaut.style.filter = 'none';
    astronaut.innerText = '👨‍🚀';
}

async function runProgram() {
    if (isRunning || sequence.length === 0) return;
    
    // RESET POSITION BEFORE LAUNCH
    astronautPos = { ...LEVELS[currentLevelIndex].start };
    lastDirection = 'right';
    updateAstronautUI();
    astronaut.style.filter = 'none';
    astronaut.innerText = '👨‍🚀';
    
    isRunning = true;
    runBtn.disabled = true;
    
    let expandedSequence = [];
    sequence.forEach(cmd => {
        if (cmd.type === 'repeat2') {
            for(let r=0; r<2; r++) cmd.children.forEach(child => expandedSequence.push(child.type));
        } else expandedSequence.push(cmd.type);
    });
    
    const goal = LEVELS[currentLevelIndex].goal;
    const walls = LEVELS[currentLevelIndex].walls;

    for (let i = 0; i < expandedSequence.length; i++) {
        const ok = await move(expandedSequence[i], walls);
        if (!ok) {
            astronaut.innerText = '💥';
            setTimeout(clearProgram, 1000);
            break;
        }
        await new Promise(r => setTimeout(r, 600));
        if (astronautPos.x === goal.x && astronautPos.y === goal.y) { showWin(); break; }
    }
    
    isRunning = false;
    runBtn.disabled = false;
}

function move(direction, walls) {
    return new Promise(resolve => {
        let newPos = { ...astronautPos };
        
        if (direction === 'jump') {
            astronaut.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            switch(lastDirection) {
                case 'right': newPos.x = Math.min(4, newPos.x + 2); break;
                case 'left': newPos.x = Math.max(0, newPos.x - 2); break;
                case 'up': newPos.y = Math.max(0, newPos.y - 2); break;
                case 'down': newPos.y = Math.min(4, newPos.y + 2); break;
            }
        } else {
            lastDirection = direction;
            astronaut.style.transition = 'all 0.5s';
            switch(direction) {
                case 'right': if (newPos.x < 4) newPos.x++; break;
                case 'left': if (newPos.x > 0) newPos.x--; break;
                case 'up': if (newPos.y > 0) newPos.y--; break;
                case 'down': if (newPos.y < 4) newPos.y++; break;
            }
        }
        
        const hitWall = walls.some(w => w.x === newPos.x && w.y === newPos.y);
        if (hitWall) resolve(false);
        else {
            astronautPos = newPos;
            updateAstronautUI();
            setTimeout(() => { resolve(true); }, 600);
        }
    });
}

function showWin() {
    const progress = getProgress();
    if (currentLevelIndex + 2 > progress.levels.explorer) {
        progress.levels.explorer = currentLevelIndex + 2;
        saveProgress(progress);
    }
    if (currentLevelIndex === LEVELS.length - 1) completeMission('explorer', 250);
    winModal.classList.add('active');
}

function nextLevel() {
    winModal.classList.remove('active');
    if (currentLevelIndex < LEVELS.length - 1) loadLevel(currentLevelIndex + 1);
    else location.href = 'dashboard.html';
}


// Bootstrap: show character picker, or skip for returning users
document.addEventListener('DOMContentLoaded', () => {
    (function bootstrap() {
        const savedChar = localStorage.getItem(getCharKey());
        if (savedChar) {
            const found = CHARACTERS.find(c => c.id === savedChar);
            activeCharEmoji = found ? found.emoji : '👨‍🚀';
            astronaut.innerText = activeCharEmoji;
            initGame();
        } else {
            showCharPicker();
        }
    })();
});
