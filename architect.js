const modules = [
    {
        id: 'python-1',
        name: 'Basic Python Foundations',
        description: 'Initialize the core system by defining the power grid parameters. Use variables to store the energy levels and a loop to distribute it across the station.',
        objectives: [
            { id: 'var', text: 'Define energy_level = 100', completed: false },
            { id: 'print', text: 'Print "System Initialized"', completed: false },
            { id: 'loop', text: 'Create a loop for 5 modules', completed: false }
        ],
        startingCode: '# Define the power grid\nenergy_level = \n\n# Notify the crew\n\n\n# Distribute energy\nfor i in range(3):\n    print(f"Powering module {i}...")',
        solution: (code) => {
            const hasVar = /energy_level\s*=\s*100/.test(code);
            const hasPrint = /print\(["']System Initialized["']\)/.test(code);
            const hasLoop = /for\s+i\s+in\s+range\(5\):/.test(code);
            return {
                var: hasVar,
                print: hasPrint,
                loop: hasLoop,
                all: hasVar && hasPrint && hasLoop
            };
        }
    },
    {
        id: 'python-2',
        name: 'Architectural Patterns',
        description: 'Design a reusable function to handle oxygen filtration. The function should take a room_id and efficiency_rate as arguments.',
        objectives: [
            { id: 'def', text: 'Define filter_oxygen function', completed: false },
            { id: 'param', text: 'Accept room_id and rate', completed: false },
            { id: 'call', text: 'Call the function for "Bridge"', completed: false }
        ],
        startingCode: '# Design the filtration logic\n\n\n\n# Test the system\n',
        solution: (code) => {
            const hasDef = /def\s+filter_oxygen/.test(code);
            const hasParam = /room_id/.test(code) && /rate/.test(code);
            const hasCall = /filter_oxygen\(["']Bridge["']/.test(code);
            return {
                def: hasDef,
                param: hasParam,
                call: hasCall,
                all: hasDef && hasParam && hasCall
            };
        }
    },
    {
        id: 'python-3',
        name: 'Neural Data Processing',
        description: 'The station sensors are detecting multiple anomalies. Store these values in a list and use a loop to filter out any signal above 50.',
        objectives: [
            { id: 'list', text: 'Create signals = [23, 88, 44, 92, 15]', completed: false },
            { id: 'filter', text: 'Create filtered_signals list', completed: false },
            { id: 'logic', text: 'Loop and append if signal < 50', completed: false }
        ],
        startingCode: '# Raw sensor data\nsignals = \n\n# Filter signals\nfiltered_signals = []\n\n\n\nprint(f"Safe signals: {filtered_signals}")',
        solution: (code) => {
            const hasList = /signals\s*=\s*\[.*\]/.test(code);
            const hasFilter = /filtered_signals\s*=\s*\[\]/.test(code);
            const hasLogic = /for\s+.*\s+in\s+signals:/.test(code) && /if\s+.*\s*<\s*50:/.test(code);
            return {
                list: hasList,
                filter: hasFilter,
                logic: hasLogic,
                all: hasList && hasFilter && hasLogic
            };
        }
    },
    {
        id: 'python-4',
        name: 'AI Decision Logic',
        description: 'Implement a basic neural decision system. If the stability index is below 0.5, activate "Protocol Red". Otherwise, maintain "Protocol Blue".',
        objectives: [
            { id: 'input', text: 'Define stability = 0.3', completed: false },
            { id: 'if', text: 'Check if stability < 0.5', completed: false },
            { id: 'else', text: 'Add else for Protocol Blue', completed: false }
        ],
        startingCode: '# AI Core Stability Index\nstability = \n\n# Decision Matrix\nif \n\n\nelse:\n    ',
        solution: (code) => {
            const hasInput = /stability\s*=\s*0\.3/.test(code);
            const hasIf = /if\s+stability\s*<\s*0\.5:/.test(code);
            const hasElse = /else:/.test(code) && /Protocol Blue/.test(code);
            return {
                input: hasInput,
                if: hasIf,
                else: hasElse,
                all: hasInput && hasIf && hasElse
            };
        }
    },
    {
        id: 'python-5',
        name: 'Distributed System Integration',
        description: 'The final step in the Architect certification. Create a dictionary to map station sectors to their status, then use a for-loop to print only the active sectors.',
        objectives: [
            { id: 'dict', text: 'Create sectors = {"Lab": "Active", "Bio": "Offline"}', completed: false },
            { id: 'items', text: 'Use sectors.items() in loop', completed: false },
            { id: 'print', text: 'Print if status == "Active"', completed: false }
        ],
        startingCode: '# Global Sector Map\nsectors = \n\n# Integrity Scan\nfor sector, status in \n    if \n        print(f"Sector {sector}: ONLINE")',
        solution: (code) => {
            const hasDict = /sectors\s*=\s*\{.*"Lab":\s*"Active".*"Bio":\s*"Offline".*\}/s.test(code);
            const hasItems = /sectors\.items\(\)/.test(code);
            const hasPrint = /if\s+status\s*==\s*["']Active["']:/.test(code);
            return {
                dict: hasDict,
                items: hasItems,
                print: hasPrint,
                all: hasDict && hasItems && hasPrint
            };
        }
    },
    {
        id: 'python-6',
        name: 'Object Blueprinting',
        description: 'Learn to define custom objects. Create a Satellite class with a name and fuel level, then initialize an instance for "Voyager-1".',
        objectives: [
            { id: 'class', text: 'Define class Satellite', completed: false },
            { id: 'init', text: 'Define __init__ with name and fuel', completed: false },
            { id: 'inst', text: 'Create s = Satellite("Voyager-1", 85)', completed: false }
        ],
        startingCode: '# Define the satellite blueprint\n\n\n\n# Launch instance\ns = ',
        solution: (code) => {
            const hasClass = /class\s+Satellite/.test(code);
            const hasInit = /def\s+__init__\(self,/.test(code);
            const hasInst = /Satellite\(["']Voyager-1["'],\s*85\)/.test(code);
            return {
                class: hasClass,
                init: hasInit,
                inst: hasInst,
                all: hasClass && hasInit && hasInst
            };
        }
    },
    {
        id: 'python-7',
        name: 'System Inheritance',
        description: 'Create specialized systems. Define a DeepSpaceProbe that inherits from Satellite and adds a "scanner_type" attribute.',
        objectives: [
            { id: 'inherit', text: 'Class DeepSpaceProbe(Satellite)', completed: false },
            { id: 'super', text: 'Call super().__init__', completed: false },
            { id: 'attr', text: 'Add self.scanner = "Infrared"', completed: false }
        ],
        startingCode: '# Specialized probe logic\nclass DeepSpaceProbe(\n    def __init__(self, name, fuel, scanner):\n        \n        ',
        solution: (code) => {
            const hasInherit = /class\s+DeepSpaceProbe\(Satellite\)/.test(code);
            const hasSuper = /super\(\)\.__init__/.test(code);
            const hasAttr = /self\.scanner\s*=/.test(code);
            return {
                inherit: hasInherit,
                super: hasSuper,
                attr: hasAttr,
                all: hasInherit && hasSuper && hasAttr
            };
        }
    },
    {
        id: 'python-8',
        name: 'Neural Network Mockup',
        description: 'Simulate a simple neural node. Define a function that calculates a weighted sum of inputs [0.5, 0.8, 0.2] with weights [0.1, 0.5, 0.9].',
        objectives: [
            { id: 'inputs', text: 'Define inputs = [0.5, 0.8, 0.2]', completed: false },
            { id: 'weights', text: 'Define weights = [0.1, 0.5, 0.9]', completed: false },
            { id: 'calc', text: 'Calculate sum(i * w for i, w in zip(inputs, weights))', completed: false }
        ],
        startingCode: '# Neural layer logic\ninputs = \nweights = \n\n# Calculate weighted sum\nresult = ',
        solution: (code) => {
            const hasInputs = /inputs\s*=\s*\[0\.5,\s*0\.8,\s*0\.2\]/.test(code);
            const hasWeights = /weights\s*=\s*\[0\.1,\s*0\.5,\s*0\.9\]/.test(code);
            const hasCalc = /sum\(/.test(code) && /zip\(/.test(code);
            return {
                inputs: hasInputs,
                weights: hasWeights,
                calc: hasCalc,
                all: hasInputs && hasWeights && hasCalc
            };
        }
    },
    {
        id: 'python-10',
        name: 'Asynchronous Handlers',
        description: 'Systems must wait for response. Use the time.sleep() function to simulate a 2-second delay in a data fetch operation.',
        objectives: [
            { id: 'import', text: 'import time', completed: false },
            { id: 'sleep', text: 'time.sleep(2)', completed: false },
            { id: 'print', text: 'Print "Data Synchronized"', completed: false }
        ],
        startingCode: '# Import system clock\n\n\ndef sync_data():\n    print("Starting sync...")\n    \n    \n\nsync_data()',
        solution: (code) => {
            const hasImport = /import\s+time/.test(code);
            const hasSleep = /time\.sleep\(2\)/.test(code);
            const hasPrint = /print\(["']Data Synchronized["']\)/.test(code);
            return {
                import: hasImport,
                sleep: hasSleep,
                print: hasPrint,
                all: hasImport && hasSleep && hasPrint
            };
        }
    },
    {
        id: 'python-11',
        name: 'Data API Design',
        description: 'Design a mock API response. Create a JSON-like dictionary with "status": 200 and "data": "Access Granted".',
        objectives: [
            { id: 'dict', text: 'Create response = {"status": 200}', completed: false },
            { id: 'data', text: 'Add "data": "Access Granted"', completed: false },
            { id: 'print', text: 'Print(response["data"])', completed: false }
        ],
        startingCode: '# API Endpoint Logic\ndef get_status():\n    \n    return response\n\n# Run call\n',
        solution: (code) => {
            const hasDict = /"status":\s*200/.test(code);
            const hasData = /"data":\s*["']Access Granted["']/.test(code);
            const hasPrint = /print\(response\[["']data["']\]\)/.test(code);
            return {
                dict: hasDict,
                data: hasData,
                print: hasPrint,
                all: hasDict && hasData && hasPrint
            };
        }
    },
    {
        id: 'python-12',
        name: 'Grand Architect Challenge',
        description: 'The final mission. Create a class "Mainframe" that stores an API response and has a method "execute" to print the status.',
        objectives: [
            { id: 'class', text: 'Define class Mainframe', completed: false },
            { id: 'method', text: 'Define execute(self) method', completed: false },
            { id: 'inst', text: 'Instantiate and call execute()', completed: false }
        ],
        startingCode: '# INTEGRATE ALL ARCHITECT CONCEPTS\n\n\n\n# Final System Boot\n',
        solution: (code) => {
            const hasClass = /class\s+Mainframe/.test(code);
            const hasMethod = /def\s+execute\(self\):/.test(code);
            const hasInst = /Mainframe\(/.test(code) && /\.execute\(/.test(code);
            return {
                class: hasClass,
                method: hasMethod,
                inst: hasInst,
                all: hasClass && hasMethod && hasInst
            };
        }
    }
];

const secretModule = {
    id: 'python-9',
    name: 'CORE OVERRIDE: Quantum Encryption',
    description: 'CRITICAL ERROR: Unlocked hidden core. Implement a Caesar Cipher encryption with a shift of 3 to secure the station data.',
    objectives: [
        { id: 'def', text: 'def encrypt(text, shift)', completed: false },
        { id: 'logic', text: 'Handle character wrapping', completed: false },
        { id: 'call', text: 'Encrypt "S.O.S"', completed: false }
    ],
    startingCode: '# Quantum override initiated\ndef encrypt(text, shift):\n    result = ""\n    for char in text:\n        \n        \n    return result\n\n# Secure transmission\n',
    solution: (code) => {
        const hasDef = /def\s+encrypt/.test(code);
        const hasLogic = /ord\(/.test(code) && /chr\(/.test(code);
        const hasCall = /encrypt\(["']S\.O\.S["']/.test(code);
        return {
            def: hasDef,
            logic: hasLogic,
            call: hasCall,
            all: hasDef && hasLogic && hasCall
        };
    }
};

let currentModuleIndex = 0;
const editor = document.getElementById('pythonEditor');
const lineNumbers = document.getElementById('lineNumbers');
const outputDisplay = document.getElementById('outputDisplay');
const diagnostics = document.getElementById('diagnostics');

function init() {
    // Register event listeners once
    editor.addEventListener('input', () => {
        updateLineNumbers();
        validateCode();
    });

    editor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            editor.value = editor.value.substring(0, start) + "    " + editor.value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 4;
            updateLineNumbers();
        }
    });

    document.getElementById('terminalInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = e.target.value;
            handleTerminalCommand(input);
            e.target.value = '';
        }
    });

    updateSystemMap();

    // Smart polling: wait for user session before loading saved level
    let attempts = 0;
    function tryLoad() {
        attempts++;
        const userReady = localStorage.getItem('codeverse_user') !== null || attempts >= 8;
        if (!userReady) { setTimeout(tryLoad, 200); return; }
        const progress = getProgress();
        if (!progress.levels) progress.levels = {};
        if (!progress.levels.architect) progress.levels.architect = 1;
        const startLevel = Math.min(Math.max(0, progress.levels.architect - 1), modules.length - 1);
        console.log(`✅ Architect ready. Level: ${progress.levels.architect}`);
        loadModule(startLevel);
        updateLineNumbers();
    }
    setTimeout(tryLoad, 300);
}

function switchTab(tabId) {
    const containers = ['editorContainer', 'mapContainer', 'terminalContainer', 'logContainer'];
    containers.forEach(c => document.getElementById(c).style.display = 'none');

    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));

    if (tabId === 'editor') {
        document.getElementById('editorContainer').style.display = 'flex';
        document.querySelector('[data-file="main.py"]').classList.add('active');
    } else if (tabId === 'map') {
        document.getElementById('mapContainer').style.display = 'flex';
        document.querySelector('[data-file="system.map"]').classList.add('active');
    } else if (tabId === 'terminal') {
        document.getElementById('terminalContainer').style.display = 'flex';
        document.querySelector('[data-file="terminal"]').classList.add('active');
    } else if (tabId === 'log') {
        document.getElementById('logContainer').style.display = 'block';
        document.querySelector('[data-file="mission.log"]').classList.add('active');
        renderMissionLog();
    }
}

let terminalHistory = [];

function handleTerminalCommand(cmd) {
    const log = document.getElementById('terminalLog');
    terminalHistory.push(cmd);

    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = `<span style="color: #6366f1;">$ ${cmd}</span>`;
    log.appendChild(line);

    const response = document.createElement('div');
    response.className = 'terminal-line';

    const command = cmd.toLowerCase().trim();
    if (command === 'help') {
        response.innerHTML = 'Available commands: help, status, scan, clear, about, history, unlock [target]';
    } else if (command === 'status') {
        response.innerHTML = `System: ARCHITECT OS 2.4<br>Module: ${modules[currentModuleIndex].name}<br>XP: ${getProgress().xp}`;
    } else if (command === 'scan') {
        response.innerHTML = 'Scanning for network vulnerabilities... [CLEAN]';
    } else if (command === 'clear') {
        log.innerHTML = '';
        return;
    } else if (command === 'history') {
        response.innerHTML = terminalHistory.join('<br>');
    } else if (command === 'unlock core') {
        if (modules.length === 8) {
            modules.push(secretModule);
            response.innerHTML = 'CORE OVERRIDE SUCCESSFUL. New module injected.';
            response.style.color = '#10b981';
            updateSystemMap();
        } else {
            response.innerHTML = 'CORE ALREADY UNLOCKED.';
        }
    } else if (command === 'about') {
        response.innerHTML = 'CodeVerse Architect OS - Built for the next generation of engineers.';
    } else {
        response.innerHTML = `Command not found: ${cmd}`;
        response.style.color = '#ef4444';
    }

    log.appendChild(response);
    log.scrollTop = log.scrollHeight;
}

let completedMissions = [];

function recordMission(m) {
    completedMissions.push({
        ...m,
        timestamp: new Date().toLocaleTimeString(),
        status: 'SUCCESS'
    });
}

function renderMissionLog() {
    const log = document.getElementById('missionLog');
    if (completedMissions.length === 0) {
        log.innerHTML = '<div class="terminal-line" style="color: #475569;">No completed missions in current session.</div>';
        return;
    }

    log.innerHTML = completedMissions.map(m => `
        <div style="background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 8px; border-left: 4px solid #10b981;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="color: #10b981; font-weight: 800; font-size: 0.8rem;">${m.id} - ${m.name}</span>
                <span style="color: #475569; font-size: 0.7rem;">${m.timestamp}</span>
            </div>
            <div style="color: #94a3b8; font-size: 0.85rem;">${m.description}</div>
        </div>
    `).join('');
}

function updateSystemMap() {
    const map = document.getElementById('systemMap');
    map.innerHTML = '';

    // Ensure nodes fit in the container
    const spacing = Math.min(120, (map.clientWidth - 200) / (modules.length - 1));
    const maxUnlocked = parseInt(localStorage.getItem(getLevelKey('architect')) || '0');

    modules.forEach((m, i) => {
        const isCurrent = i === currentModuleIndex;
        const isCompleted = i < maxUnlocked;

        const node = document.createElement('div');
        node.className = `map-node ${isCurrent ? 'pulsing-current' : ''}`;
        node.style.cssText = `
            width: 50px; height: 50px;
            border: 2px solid ${isCurrent ? '#f59e0b' : (isCompleted ? 'var(--arch-primary)' : '#1e293b')};
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 0.6rem; color: ${isCurrent || isCompleted ? 'white' : '#475569'};
            background: ${isCompleted ? 'rgba(6, 182, 212, 0.2)' : (isCurrent ? 'rgba(245, 158, 11, 0.1)' : 'transparent')};
            position: absolute;
            left: ${50 + i * spacing}px;
            top: ${100 + (i % 2 === 0 ? 40 : -40)}px;
            transition: all 0.5s ease;
            z-index: 2;
            box-shadow: ${isCurrent ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none'};
        `;
        node.textContent = isCurrent ? 'NOW' : `M${(i + 1).toString().padStart(2, '0')}`;

        node.style.cursor = 'pointer';
        node.onclick = () => {
            currentModuleIndex = i;
            loadModule(i);
            switchTab('editor');
            updateSystemMap();
        };

        map.appendChild(node);

        if (i > 0) {
            const line = document.createElement('div');
            line.style.cssText = `
                position: absolute;
                height: 2px;
                background: ${i <= maxUnlocked ? 'var(--arch-primary)' : '#1e293b'};
                width: ${spacing}px;
                left: ${50 + (i - 1) * spacing + 25}px;
                top: ${125 + ((i - 1) % 2 === 0 ? 40 : -40)}px;
                transform-origin: left;
                transform: rotate(${((i % 2 === 0 ? 40 : -40) - ((i - 1) % 2 === 0 ? 40 : -40)) / spacing * 57.3}deg);
                z-index: 1;
                opacity: 0.5;
            `;
            map.appendChild(line);
        }
    });
}

function loadModule(index) {
    currentModuleIndex = index;
    
    const m = modules[index];
    document.getElementById('currentModuleName').textContent = `Module: ${m.name}`;
    document.getElementById('moduleStepIndicator').textContent = `${(index + 1).toString().padStart(2, '0')} / ${modules.length}`;
    document.getElementById('missionDesc').textContent = m.description;
    editor.value = m.startingCode;

    const objList = document.getElementById('objectives');
    objList.innerHTML = '';
    m.objectives.forEach(obj => {
        const div = document.createElement('div');
        div.className = 'objective';
        div.id = `obj-${obj.id}`;
        div.innerHTML = `<div class="objective-check"></div><span>${obj.text}</span>`;
        objList.appendChild(div);
    });

    outputDisplay.innerHTML = '<div class="terminal-line">> Awaiting execution...</div>';
    document.getElementById('nextModuleBtn').style.display = 'none';
    document.getElementById('moduleProgress').style.width = `${((index) / modules.length) * 100}%`;

    diagnostics.textContent = `Module ${index + 1} initialized. Waiting for logic input...`;
    renderLevelIndicators();
}

function renderLevelIndicators() {
    const dotsContainer = document.getElementById('levelDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const progress = getProgress();

    modules.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.style.width = '14px';
        dot.style.height = '14px';
        dot.style.borderRadius = '50%';
        dot.style.cursor = 'pointer';
        dot.onclick = () => {
            currentModuleIndex = i;
            loadModule(i);
            switchTab('editor');
            updateSystemMap();
        };

        if (i === currentModuleIndex) {
            dot.style.background = 'var(--arch-primary)';
        } else if (i < (progress.levels.architect || 1)) {
            dot.style.background = 'rgba(6, 182, 212, 0.6)';
        } else {
            dot.style.background = '#1e293b';
            dot.style.opacity = '0.8';
        }
        dotsContainer.appendChild(dot);
    });
}

function updateLineNumbers() {
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

function validateCode() {
    const m = modules[currentModuleIndex];
    const results = m.solution(editor.value);

    m.objectives.forEach(obj => {
        const el = document.getElementById(`obj-${obj.id}`);
        if (results[obj.id]) {
            el.classList.add('complete');
        } else {
            el.classList.remove('complete');
        }
    });

    if (results.all) {
        diagnostics.textContent = "Logic validated. System ready for deployment.";
        diagnostics.style.color = "#10b981";
    } else {
        diagnostics.textContent = "Logic incomplete. Check requirements.";
        diagnostics.style.color = "#64748b";
    }
}

function executeCode() {
    const m = modules[currentModuleIndex];
    const results = m.solution(editor.value);

    outputDisplay.innerHTML = '';
    addTerminalLine(`Executing ${m.id}...`, 'input');

    setTimeout(() => {
        if (results.all) {
            const progress = getProgress();
            if (currentModuleIndex + 2 > progress.levels.architect) {
                progress.levels.architect = currentModuleIndex + 2;
                saveProgress(progress);
            }
            addTerminalLine("Python Core: Execution Successful", "success");
            addTerminalLine("Variables mapped correctly.", "success");
            addTerminalLine("Memory allocation: 1.2MB", "success");

            // Visual feedback
            triggerVisualization(true);

            document.getElementById('nextModuleBtn').style.display = 'inline-block';
            recordMission(m);
            if (currentModuleIndex === modules.length - 1) {
                completeMission('architect', 500);
            }
        } else {
            addTerminalLine("Python Core: Execution Failed", "error");
            addTerminalLine("System requirements not met.", "error");
            triggerVisualization(false);
        }
    }, 800);
}

function addTerminalLine(text, type) {
    const line = document.createElement('div');
    line.className = `terminal-line ${type || ''}`;
    line.textContent = `> ${text}`;
    outputDisplay.appendChild(line);
    outputDisplay.scrollTop = outputDisplay.scrollHeight;
}

function triggerVisualization(success) {
    const container = document.getElementById('vizContainer');
    container.innerHTML = '';

    if (success) {
        for (let i = 0; i < 8; i++) {
            const node = document.createElement('div');
            node.className = 'viz-node';
            node.style.left = Math.random() * 80 + 10 + '%';
            node.style.top = Math.random() * 80 + 10 + '%';
            node.style.animationDelay = Math.random() * 2 + 's';
            container.appendChild(node);
        }

        const circle = document.createElement('div');
        circle.style.cssText = `
            width: 150px;
            height: 150px;
            border: 4px solid var(--arch-primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            color: var(--arch-primary);
            box-shadow: var(--glow);
            z-index: 10;
            background: rgba(2, 6, 23, 0.8);
        `;
        circle.className = 'pulsing';
        circle.textContent = 'SYSTEM STABLE';
        container.appendChild(circle);

        updateSystemMap();
    } else {
        container.innerHTML = '<div class="glitch-text" style="color: #ef4444; font-weight: 800; font-size: 2rem;">SYSTEM FAILURE</div>';
    }
}

function nextModule() {
    currentModuleIndex++;
    if (currentModuleIndex < modules.length) {
        loadModule(currentModuleIndex);
    } else {
        triggerGraduation();
    }
}

function triggerGraduation() {
    const overlay = document.getElementById('completionOverlay');
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="modal graduation" style="border-color: #f59e0b; background: radial-gradient(circle at center, #1e1b4b, #0a0f18);">
            <div class="medal pulsing" style="font-size: 5rem; margin-bottom: 2rem;">🏆</div>
            <h1 class="text-glow" style="color: #f59e0b; text-shadow: 0 0 20px rgba(245, 158, 11, 0.5);">MASTER ARCHITECT</h1>
            <p>You have successfully completed the most advanced engineering track in the CodeVerse.</p>
            <div class="stats">
                <div class="stat-card">
                    <span class="label">Total XP</span>
                    <span class="value">${getProgress().xp + 1000}</span>
                </div>
                <div class="stat-card">
                    <span class="label">Rank</span>
                    <span class="value">System Architect Elite</span>
                </div>
            </div>
            <p style="font-size: 0.9rem; margin-bottom: 2rem;">Your expertise in Python logic, neural systems, and distributed architecture is now certified.</p>
            <button class="run-btn" style="background: #f59e0b;" onclick="location.href='index.html'">RETURN TO COMMAND CENTER</button>
        </div>
    `;

    // Final progress update
    completeMission('architect', 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
