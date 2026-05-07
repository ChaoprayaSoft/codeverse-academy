const modules = [
    {
        id: 'data-1',
        name: 'Variables & Datasets',
        description: 'Data analytics starts with datasets. Let\'s define a simple list of numbers representing daily visitors.',
        objectives: [
            { id: 'list', text: 'Create visitors = [20, 45, 60]', completed: false }
        ],
        startingCode: '# Define the dataset\n',
        solution: (code) => {
            const hasList = /visitors\s*=\s*\[\s*20\s*,\s*45\s*,\s*60\s*\]/.test(code);
            return {
                list: hasList,
                all: hasList
            };
        },
        chartData: [20, 45, 60]
    },
    {
        id: 'data-2',
        name: 'Appending Data',
        description: 'New data just arrived! Add 85 to your list using the .append() method.',
        objectives: [
            { id: 'list', text: 'Define visitors = [20, 45, 60]', completed: false },
            { id: 'append', text: 'Call visitors.append(85)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60]\n\n# Add new data\n',
        solution: (code) => {
            const hasList = /visitors\s*=\s*\[\s*20\s*,\s*45\s*,\s*60\s*\]/.test(code);
            const hasAppend = /visitors\.append\(\s*85\s*\)/.test(code);
            return {
                list: hasList,
                append: hasAppend,
                all: hasList && hasAppend
            };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-3',
        name: 'Data Filtering',
        description: 'We only care about high-traffic days. Create a list "high_traffic" containing only numbers greater than 50.',
        objectives: [
            { id: 'filter', text: 'Create high_traffic = [60, 85]', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Filter for > 50\n',
        solution: (code) => {
            const hasFilter = /high_traffic\s*=\s*\[\s*60\s*,\s*85\s*\]/.test(code);
            return {
                filter: hasFilter,
                all: hasFilter
            };
        },
        chartData: [60, 85]
    },
    {
        id: 'data-4',
        name: 'Visualizing Data',
        description: 'Let\'s plot the data! We provided a function draw_chart(data). Pass your filtered data to it.',
        objectives: [
            { id: 'draw', text: 'Call draw_chart([60, 85])', completed: false }
        ],
        startingCode: '# Filtered Data\nhigh_traffic = [60, 85]\n\n# Draw the chart\n',
        solution: (code) => {
            const hasDraw = /draw_chart\(\s*(high_traffic|\[\s*60\s*,\s*85\s*\])\s*\)/.test(code);
            return {
                draw: hasDraw,
                all: hasDraw
            };
        },
        chartData: [60, 85]
    },
    {
        id: 'data-5',
        name: 'Finding the Minimum',
        description: 'What was our worst day? Use the min() function to find the lowest number of visitors.',
        objectives: [
            { id: 'min', text: 'Create worst_day = min(visitors)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Find the minimum\n',
        solution: (code) => {
            const hasMin = /worst_day\s*=\s*min\(\s*visitors\s*\)/.test(code);
            return { min: hasMin, all: hasMin };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-6',
        name: 'Finding the Maximum',
        description: 'What was our best day? Use the max() function to find the highest number of visitors.',
        objectives: [
            { id: 'max', text: 'Create best_day = max(visitors)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Find the maximum\n',
        solution: (code) => {
            const hasMax = /best_day\s*=\s*max\(\s*visitors\s*\)/.test(code);
            return { max: hasMax, all: hasMax };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-7',
        name: 'Total Sum',
        description: 'How many total visitors did we have? Use the sum() function to calculate the total.',
        objectives: [
            { id: 'sum', text: 'Create total = sum(visitors)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Calculate the total\n',
        solution: (code) => {
            const hasSum = /total\s*=\s*sum\(\s*visitors\s*\)/.test(code);
            return { sum: hasSum, all: hasSum };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-8',
        name: 'Counting Data',
        description: 'How many days of data do we have? Use the len() function to find the length of the list.',
        objectives: [
            { id: 'len', text: 'Create days = len(visitors)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Count the days\n',
        solution: (code) => {
            const hasLen = /days\s*=\s*len\(\s*visitors\s*\)/.test(code);
            return { len: hasLen, all: hasLen };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-9',
        name: 'Sorting Data',
        description: 'Let\'s organize our data from smallest to largest using the sorted() function.',
        objectives: [
            { id: 'sort', text: 'Create ordered = sorted(visitors)', completed: false }
        ],
        startingCode: 'visitors = [85, 20, 60, 45]\n\n# Sort the data\n',
        solution: (code) => {
            const hasSort = /ordered\s*=\s*sorted\(\s*visitors\s*\)/.test(code);
            return { sort: hasSort, all: hasSort };
        },
        chartData: [20, 45, 60, 85]
    },
    {
        id: 'data-10',
        name: 'Calculating Average',
        description: 'The final challenge! Calculate the average by dividing the sum() by the len().',
        objectives: [
            { id: 'avg', text: 'Create avg = sum(visitors) / len(visitors)', completed: false }
        ],
        startingCode: 'visitors = [20, 45, 60, 85]\n\n# Calculate the average\n',
        solution: (code) => {
            const hasAvg = /avg\s*=\s*sum\(\s*visitors\s*\)\s*\/\s*len\(\s*visitors\s*\)/.test(code);
            return { avg: hasAvg, all: hasAvg };
        },
        chartData: [20, 45, 60, 85]
    }
];

let currentModuleIndex = 0;
const editor = document.getElementById('pythonEditor');
const outputDisplay = document.getElementById('outputDisplay');

function init() {
    const progress = getProgress();
    const startLevel = (progress.levels.data_analytic || 1) - 1;
    loadModule(startLevel);
    editor.addEventListener('input', validateCode);
}

function loadModule(index) {
    currentModuleIndex = index;
    
    // Save progress: only update if we reached a NEW level
    const progress = getProgress();
    if (index + 1 > progress.levels.data_analytic) {
        progress.levels.data_analytic = index + 1;
        saveProgress(progress);
    }
    
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

    document.getElementById('nextModuleBtn').style.display = 'none';
    
    outputDisplay.innerHTML = '<div>System ready. Waiting for run...</div>';
    renderChart([]);
    renderLevelIndicators();
}

function renderLevelIndicators() {
    const dotsContainer = document.getElementById('levelDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const progress = getProgress();
    const maxUnlocked = (progress.levels.data_analytic || 1) - 1;
    
    modules.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.style.cursor = 'pointer';
        dot.onclick = () => loadModule(i);
        
        if (i === currentModuleIndex) {
            dot.style.background = '#FF9F1C';
        } else if (i < (progress.levels.data_analytic || 1)) {
            dot.style.background = '#F6E05E';
        } else {
            dot.style.background = '#E2E8F0';
            dot.style.opacity = '0.8';
        }
        dotsContainer.appendChild(dot);
    });
}

function renderChart(data) {
    const container = document.getElementById('chartContainer');
    if (!data || data.length === 0) {
        container.innerHTML = '<div class="empty-chart">Waiting for data...</div>';
        return;
    }
    
    container.innerHTML = '';
    const maxVal = Math.max(...data, 100);
    
    data.forEach(val => {
        const heightPercent = (val / maxVal) * 100;
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.style.height = `${heightPercent}%`;
        bar.innerHTML = `<span>${val}</span>`;
        container.appendChild(bar);
    });
}

function validateCode() {
    const m = modules[currentModuleIndex];
    const results = m.solution(editor.value);
    
    m.objectives.forEach(obj => {
        const el = document.getElementById(`obj-${obj.id}`);
        if (results[obj.id]) {
            el.classList.add('completed');
        } else {
            el.classList.remove('completed');
        }
    });
}

function executeCode() {
    const m = modules[currentModuleIndex];
    const results = m.solution(editor.value);
    
    outputDisplay.innerHTML = `<div>> Executing module ${m.id}...</div>`;
    
    setTimeout(() => {
        if (results.all) {
            outputDisplay.innerHTML += '<div style="color: #48BB78;">> Analysis Complete. Results valid.</div>';
            renderChart(m.chartData);
            document.getElementById('nextModuleBtn').style.display = 'inline-block';
            if (currentModuleIndex === modules.length - 1) {
                completeMission('data_analytic', 300);
            }
        } else {
            outputDisplay.innerHTML += '<div class="error">> Error: Syntax invalid or objectives not met.</div>';
        }
    }, 500);
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
        <div class="modal">
            <h1 style="font-size: 4rem; margin: 0;">🐼</h1>
            <h1>MASTER ANALYST</h1>
            <p>You've successfully completed the Data Analytic course!</p>
            <p style="margin-bottom: 2rem;">You unlocked the Panda Stamp and earned 300 XP.</p>
            <button class="run-btn" style="width: 100%; box-sizing: border-box;" onclick="location.href='dashboard.html'">VIEW DASHBOARD</button>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
