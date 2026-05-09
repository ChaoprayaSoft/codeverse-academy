const htmlEditor = document.getElementById('htmlEditor');
const cssEditor = document.getElementById('cssEditor');
const visionEditor = document.getElementById('visionEditor');
const serverEditor = document.getElementById('serverEditor');
const threeEditor = document.getElementById('threeEditor');
const previewFrame = document.getElementById('preview-frame');
const planetImage = document.querySelector('.preview-panel img');
const winModal = document.getElementById('winModal');
const nextMissionBtn = document.getElementById('nextMissionBtn');
const levelIndicators = document.getElementById('levelIndicators');
const missionTitle = document.getElementById('missionTitle');
const guide = document.getElementById('guide');

let currentLevelIndex = 0;
let currentTab = 'html';

function stripComments(code) {
    return code.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*|#.*/g, '$1');
}

const LEVELS = [
    {
        title: "Mission 1: Frontier UI",
        tasks: [
            { text: "Create an <h1> with text 'Colony Alpha'", check: (h,c) => h.includes('<h1>Colony Alpha</h1>') },
            { text: "Style it with a green color in style.css", check: (h,c) => stripComments(c).includes('color') }
        ],
        hints: ["Use <h1>...</h1>", "Add 'color: #10b981;' to your h1 block."],
        tabs: ['html', 'css'],
        initialHtml: "<!-- Type your code here -->\n",
        initialCss: "h1 {\n\n}",
        validate: (h, c) => h.includes('Colony Alpha') && stripComments(c).includes('color')
    },
    {
        title: "Mission 2: Resource API",
        tasks: [
            { text: "Create a POST route named '/energy'", check: (h,c,v,s) => stripComments(s).includes("@app.post('/energy')") },
            { text: "Return the string 'Power Grid Active'", check: (h,c,v,s) => stripComments(s).includes("Power Grid Active") }
        ],
        hints: ["@app.post('/your_path')", "return 'Your string message'"],
        tabs: ['server'],
        initialServer: "from flask import Flask\napp = Flask(__name__)\n\n# Implement your route below\n",
        validate: (h, c, v, s) => stripComments(s).includes("@app.post('/energy')") && stripComments(s).includes("Power Grid Active")
    },
    {
        title: "Mission 3: Scanner Vision",
        tasks: [
            { text: "Import the cv2 library", check: (h,c,v) => stripComments(v).includes('import cv2') },
            { text: "Apply a blur filter: cv2.blur(img, (5,5))", check: (h,c,v) => stripComments(v).includes('cv2.blur') }
        ],
        hints: ["import cv2", "cv2.blur(img, (5,5))"],
        tabs: ['vision'],
        initialVision: "import cv2\n\nimg = cv2.imread('planet.jpg')\n# Your processing here:\n",
        validate: (h, c, v) => stripComments(v).includes('import cv2') && stripComments(v).includes('cv2.blur')
    },
    {
        title: "Mission 4: AI Predictor",
        tasks: [
            { text: "Create a function: predict_oxygen(count)", check: (h,c,v,s) => stripComments(s).includes('def predict_oxygen') },
            { text: "Return count * 1.5", check: (h,c,v,s) => stripComments(s).includes('count * 1.5') }
        ],
        hints: ["def your_function(param):", "return param * 1.5"],
        tabs: ['server'],
        initialServer: "# AI Prediction Engine\n",
        validate: (h, c, v, s) => stripComments(s).includes('def predict_oxygen') && stripComments(s).includes('count * 1.5')
    },
    {
        title: "Mission 5: Habitat Dome",
        tasks: [
            { text: "Add a SphereGeometry to the scene", check: (h,c,v,s,t) => stripComments(t).includes('SphereGeometry') },
            { text: "Set the color to '#10b981'", check: (h,c,v,s,t) => stripComments(t).includes('#10b981') }
        ],
        hints: ["new SphereGeometry(5)", "color: '#10b981'"],
        tabs: ['three'],
        initialThree: "// 3D Mesh setup\nconst dome = new Mesh(\n    // Add geometry & material\n);\nscene.add(dome);",
        validate: (h, c, v, s, t) => stripComments(t).includes('SphereGeometry') && stripComments(t).includes('#10b981')
    }
];

function switchTab(tab) {
    currentTab = tab;
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`${tab}Tab`).classList.add('active');
    
    htmlEditor.style.display = tab === 'html' ? 'block' : 'none';
    cssEditor.style.display = tab === 'css' ? 'block' : 'none';
    visionEditor.style.display = tab === 'vision' ? 'block' : 'none';
    serverEditor.style.display = tab === 'server' ? 'block' : 'none';
    threeEditor.style.display = tab === 'three' ? 'block' : 'none';
}

function updatePreview() {
    const h = htmlEditor.value;
    const c = cssEditor.value;
    const v = visionEditor.value;
    const s = serverEditor.value;
    const t = threeEditor.value;
    
    const currentTasks = LEVELS[currentLevelIndex].tasks;
    const taskElements = document.querySelectorAll('.task-item');
    
    let allDone = true;
    currentTasks.forEach((task, index) => {
        const isDone = task.check(h, c, v, s, t);
        if (isDone) {
            taskElements[index].classList.add('done');
            taskElements[index].classList.remove('active');
        } else {
            taskElements[index].classList.remove('done');
            taskElements[index].classList.add('active');
            allDone = false;
        }
    });

    if (stripComments(v).includes('cv2.blur')) {
        planetImage.style.filter = 'blur(4px) brightness(0.7)';
    } else {
        planetImage.style.filter = 'brightness(0.7)';
    }

    const content = `
        <style>body { margin: 0; padding: 1rem; color: #0f172a; font-family: sans-serif; } ${c}</style>
        ${h}
        ${stripComments(t).includes('SphereGeometry') ? '<div style="width:80px; height:80px; border-radius:50%; background:#10b981; margin: 20px auto; box-shadow: 0 0 15px #10b981;"></div>' : ''}
    `;
    previewFrame.srcdoc = content;

    if (allDone) {
        nextMissionBtn.style.display = 'block';
        // Still show modal for final celebration
        if (currentLevelIndex === LEVELS.length - 1) {
            setTimeout(showWin, 1500);
        }
    } else {
        nextMissionBtn.style.display = 'none';
    }
}

function initGame() {
    let attempts = 0;
    function tryLoad() {
        attempts++;
        const userReady = localStorage.getItem('codeverse_user') !== null || attempts >= 8;
        if (!userReady) { setTimeout(tryLoad, 200); return; }
        const progress = getProgress();
        if (!progress.levels) progress.levels = {};
        if (!progress.levels.commander) progress.levels.commander = 1;
        const startLevel = Math.min(Math.max(0, progress.levels.commander - 1), LEVELS.length - 1);
        console.log(`✅ Commander ready. Level: ${progress.levels.commander}`);
        loadLevel(startLevel);
    }
    setTimeout(tryLoad, 300);
}

function renderLevelIndicators() {
    const progress = getProgress();
    const isCompleted = progress.missions && progress.missions.commander === true;
    const maxLevel = isCompleted ? LEVELS.length : (progress.levels && progress.levels.commander ? progress.levels.commander : 1);

    levelIndicators.innerHTML = '';
    LEVELS.forEach((_, i) => {
        const isLocked = i >= maxLevel;
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === currentLevelIndex ? 'active' : ''}`;
        dot.style.width = '12px';
        dot.style.height = '12px';
        dot.style.borderRadius = '50%';
        dot.style.background = i === currentLevelIndex ? '#6366f1' : (isLocked ? 'rgba(0,0,0,0.5)' : '#2a2f3a');
        dot.style.cursor = isLocked ? 'not-allowed' : 'pointer';
        if (isLocked) {
            dot.innerText = '🔒';
            dot.style.fontSize = '8px';
            dot.style.display = 'flex';
            dot.style.alignItems = 'center';
            dot.style.justifyContent = 'center';
        }
        if (!isLocked) {
            dot.onclick = () => loadLevel(i);
        }
        levelIndicators.appendChild(dot);
    });
}

function loadLevel(index) {
    currentLevelIndex = index;
    
    const level = LEVELS[index];
    
    missionTitle.innerHTML = `Mission: <span style="color: #6366f1;">${level.title}</span>`;
    nextMissionBtn.style.display = 'none';
    
    guide.innerHTML = '<div style="font-size: 0.75rem; color: #6366f1; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase;">Checklist</div>';
    level.tasks.forEach(task => {
        const item = document.createElement('div');
        item.className = 'task-item active';
        item.innerText = task.text;
        guide.appendChild(item);
    });

    const hintContainer = document.createElement('div');
    hintContainer.style.marginTop = '1rem';
    hintContainer.style.paddingTop = '1rem';
    hintContainer.style.borderTop = '1px solid rgba(255,255,255,0.1)';
    hintContainer.innerHTML = '<div style="font-size: 0.75rem; color: #f59e0b; margin-bottom: 0.5rem; font-weight: 700; text-transform: uppercase;">Command Reference</div>';
    
    level.hints.forEach(hint => {
        const h = document.createElement('div');
        h.style.fontSize = '0.75rem';
        h.style.color = '#94a3b8';
        h.style.marginBottom = '4px';
        h.innerText = '💡 ' + hint;
        hintContainer.appendChild(h);
    });
    guide.appendChild(hintContainer);

    htmlEditor.value = level.initialHtml || "";
    cssEditor.value = level.initialCss || "";
    visionEditor.value = level.initialVision || "";
    serverEditor.value = level.initialServer || "";
    threeEditor.value = level.initialThree || "";

    document.querySelectorAll('.tab').forEach(tabEl => {
        const type = tabEl.id.replace('Tab', '');
        tabEl.style.display = level.tabs.includes(type) ? 'block' : 'none';
    });

    switchTab(level.tabs[0]);
    updatePreview();
    renderLevelIndicators();
}

function showWin() {
    const progress = getProgress();
    const isNewLevel = (currentLevelIndex + 2 > progress.levels.commander);
    
    if (isNewLevel) {
        progress.levels.commander = currentLevelIndex + 2;
        saveProgress(progress);
        awardXP(30); // Award XP for first-time completion of this mission
    }
    
    const isFinal = currentLevelIndex === LEVELS.length - 1;
    if (isFinal) {
        completeMission('commander', 400);
        document.querySelector('#winModal h1').innerText = "COMMANDER GRADUATE! 🏆";
        document.querySelector('#winModal p').innerText = "You have mastered full-stack development and complex system orchestration.";
        document.querySelector('#winModal button[onclick="nextLevel()"]').innerText = "Return to Dashboard";
        
        // Add Revisit Button if not already there
        if (!document.getElementById('revisitBtn')) {
            const revBtn = document.createElement('button');
            revBtn.id = 'revisitBtn';
            revBtn.className = 'run-btn';
            revBtn.style.background = '#1e293b';
            revBtn.style.border = '2px solid #6366f1';
            revBtn.style.marginRight = '10px';
            revBtn.innerText = "Revisit Missions";
            revBtn.onclick = () => { document.getElementById('winModal').style.display = 'none'; };
            document.querySelector('#winModal button[onclick="nextLevel()"]').parentNode.insertBefore(revBtn, document.querySelector('#winModal button[onclick="nextLevel()"]'));
            
            const closeX = document.createElement('button');
            closeX.innerText = '✕';
            closeX.style.cssText = "position:absolute; top:20px; right:20px; background:transparent; border:none; color:white; font-size:2rem; cursor:pointer;";
            closeX.onclick = () => { document.getElementById('winModal').style.display = 'none'; };
            document.querySelector('#winModal > div').style.position = 'relative';
            document.querySelector('#winModal > div').appendChild(closeX);
        }
    }

    winModal.style.display = 'flex';
}

function nextLevel() {
    winModal.style.display = 'none';
    nextMissionBtn.style.display = 'none';
    if (currentLevelIndex < LEVELS.length - 1) {
        loadLevel(currentLevelIndex + 1);
    } else {
        location.href = 'dashboard.html';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initGame();
});
