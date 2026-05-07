const modules = [
    {
        name: "What is AI?",
        type: "choice",
        description: "Before we build, we must understand. What exactly is Artificial Intelligence?",
        choices: [
            { text: "A computer that can think and learn like a human", correct: true },
            { text: "A robot that only follows strict rules", correct: false },
            { text: "A fancy calculator", correct: false }
        ],
        feedback: "Correct! AI allows computers to learn from patterns, not just rules."
    },
    {
        name: "Training Data",
        type: "drag",
        description: "AI learns from data. Drag the FRUITS into the Green box and SPACESHIPS into the Blue box.",
        items: [
            { id: "f1", text: "🍎", category: "fruit" },
            { id: "s1", text: "🚀", category: "ship" },
            { id: "f2", text: "🍌", category: "fruit" },
            { id: "s2", text: "🛸", category: "ship" }
        ],
        categories: [
            { id: "fruit", name: "Green Box", color: "#10b981" },
            { id: "ship", name: "Blue Box", color: "#3b82f6" }
        ],
        feedback: "Great sorting! This 'Labeled Data' is how we train supervised models."
    },
    {
        name: "Neural Wakeup",
        type: "choice",
        description: "An AI needs fuel to wake up. What is the 'food' that makes an AI grow smarter?",
        choices: [
            { text: "Electric batteries", correct: false },
            { text: "Lots and lots of DATA", correct: true },
            { text: "Rocket fuel", correct: false }
        ],
        visualAction: () => updateNet(1, 0, 0),
        feedback: "Correct! Data is the fuel of the AI world."
    },
    {
        name: "Building Connections",
        type: "drag_weight",
        description: "Information needs to travel! Drag the 'Connection Wire' to the nodes to link them.",
        weights: [
            { val: 0.5, label: "Short Wire" },
            { val: 0.9, label: "Core Connection", correct: true }
        ],
        feedback: "Nodes linked! Information is flowing."
    },
    {
        name: "Setting Weights",
        type: "drag_weight",
        description: "Drag the HIGHER WEIGHT (0.9) to the connection to make the signal stronger.",
        weights: [
            { val: 0.1, label: "Weak (0.1)" },
            { val: 0.9, label: "Strong (0.9)", correct: true }
        ],
        feedback: "Perfect. High weights mean the AI pays more attention to that data."
    },
    {
        name: "Learning Speed",
        type: "choice",
        description: "If the Learning Rate is too high, the AI 'jumps' over the answer. Which rate is best for stability?",
        choices: [
            { text: "0.01 (Slow and steady)", correct: true },
            { text: "100.0 (Super fast jump)", correct: false },
            { text: "0.0 (Don't learn anything)", correct: false }
        ],
        feedback: "Correct! Smaller steps lead to better accuracy."
    },
    {
        name: "Deep Thinking",
        type: "choice",
        description: "Why do we add 'Hidden Layers' to our brain mapping?",
        choices: [
            { text: "To make the computer heavy", correct: false },
            { text: "To help the AI learn complex patterns", correct: true },
            { text: "To change the color of the screen", correct: false }
        ],
        visualAction: () => updateNet(3, 4, 1),
        feedback: "Yes! More layers allow for deeper 'thinking' capacity."
    },
    {
        name: "Friend or Foe?",
        type: "drag",
        description: "AI can recognize faces! Sort these into 'ROBOTS' and 'HUMANS'.",
        items: [
            { id: "r1", text: "🤖", category: "bot" },
            { id: "h1", text: "👩", category: "human" },
            { id: "r2", text: "🦾", category: "bot" },
            { id: "h2", text: "👨", category: "human" }
        ],
        categories: [
            { id: "bot", name: "Robots", color: "#8b5cf6" },
            { id: "human", name: "Humans", color: "#f59e0b" }
        ],
        feedback: "Identification complete. Your vision model is accurate!"
    },
    {
        name: "Confidence Levels",
        type: "choice",
        description: "The AI is 95% confident it sees a STAR. Should the system trust this prediction?",
        choices: [
            { text: "Yes, 95% is high confidence!", correct: true },
            { text: "No, wait for 1000%", correct: false },
            { text: "Maybe, flip a coin", correct: false }
        ],
        visualAction: () => { updateNet(3, 4, 1, true); showPrediction('⭐'); },
        feedback: "Correct! High probability means a reliable model."
    },
    {
        name: "Final Validation",
        type: "choice",
        description: "Behold the Accuracy Report! Your AI has tested 1000 missions. Look at the chart: Success is high, but 'Edge Cases' (Errors) are at 8%. Is the model ready for deployment?",
        choices: [
            { text: "Yes, 92% is mission-ready!", correct: true },
            { text: "No, we need 0% errors", correct: false }
        ],
        visualAction: () => { updateNet(5, 8, 3, true); showValidationChart([92, 8]); },
        feedback: "Correct! 92% is an elite score for real-world AI."
    },
    {
        name: "Learning Types",
        type: "choice",
        description: "If we give the AI a teacher (labeled data), it's called Supervised Learning. What if we just let the AI find its own groups?",
        choices: [
            { text: "Unsupervised Learning", correct: true },
            { text: "Lazy Learning", correct: false },
            { text: "Robot Dreaming", correct: false }
        ],
        feedback: "Correct! Unsupervised learning is like discovering patterns in the dark."
    },
    {
        name: "The Bias Trap",
        type: "drag",
        description: "Our AI thinks only RED ships are friendly because our data is biased! Drag the BLUE ships into the Training Set to fix it.",
        items: [
            { id: "b1", text: "🟦🚀", category: "train" },
            { id: "b2", text: "🟦🛸", category: "train" },
            { id: "r1", text: "🟥🚀", category: "already" }
        ],
        categories: [
            { id: "train", name: "Training Set", color: "#3b82f6" }
        ],
        feedback: "Bias reduced! A diverse dataset makes a fair AI."
    },
    {
        name: "Data Augmentation",
        type: "code",
        description: "We only have 5 images. Type 'mirror()' to flip our images and double our dataset instantly!",
        objectives: [{ id: "mirror", text: "Type mirror()", regex: /mirror\(\)/i }],
        validate: (code) => code.includes("mirror"),
        visualAction: () => { pulseNodes(); showPrediction('🔄'); },
        feedback: "Dataset doubled! More data means a smarter brain."
    },
    {
        name: "The Overfit Problem",
        type: "choice",
        description: "Your AI got 100% on the training test, but 40% on new data. This is called 'Overfitting'. What happened?",
        choices: [
            { text: "The AI memorized the answers instead of learning", correct: true },
            { text: "The AI is too smart for the data", correct: false },
            { text: "The computer is too hot", correct: false }
        ],
        feedback: "Exactly. Memorization is not intelligence!"
    },
    {
        name: "Reducing Loss",
        type: "drag_weight",
        description: "The 'Loss' represents how wrong the AI is. Drag the LOWEST loss value (0.02) to the optimizer.",
        weights: [
            { val: 0.8, label: "High Loss (0.8)" },
            { val: 0.02, label: "Low Loss (0.02)", correct: true }
        ],
        feedback: "Loss minimized! Your AI is getting very accurate."
    },
    {
        name: "Sentiment Analysis",
        type: "drag",
        description: "Can AI read feelings? Sort these messages into 'POSITIVE' and 'NEGATIVE'.",
        items: [
            { id: "p1", text: "I love space!", category: "pos" },
            { id: "n1", text: "This orbit is boring.", category: "neg" },
            { id: "p2", text: "Amazing views!", category: "pos" }
        ],
        categories: [
            { id: "pos", name: "Positive", color: "#10b981" },
            { id: "neg", name: "Negative", color: "#ef4444" }
        ],
        feedback: "NLP Master! You just built a sentiment analyzer."
    },
    {
        name: "Vision Filters",
        type: "code",
        description: "To see shapes, AI uses 'Feature Extraction'. Type 'find_edges()' to detect the outline of the planet.",
        objectives: [{ id: "edge", text: "Type find_edges()", regex: /find_edges\(\)/i }],
        validate: (code) => code.includes("find_edges"),
        visualAction: () => recolorNodes('#f59e0b'),
        feedback: "Edges found. The AI can now see the planet's shape."
    },
    {
        name: "The 80/20 Split",
        type: "drag",
        description: "We must never test on the same data we train on. Drag 4 items to TRAINING and 1 item to TESTING.",
        items: [
            { id: "d1", text: "📊", category: "train" },
            { id: "d2", text: "📊", category: "train" },
            { id: "d3", text: "📊", category: "train" },
            { id: "d4", text: "📊", category: "train" },
            { id: "d5", text: "🧪", category: "test" }
        ],
        categories: [
            { id: "train", name: "Training (80%)", color: "#8b5cf6" },
            { id: "test", name: "Testing (20%)", color: "#ec4899" }
        ],
        feedback: "Perfect split! Now we can verify our AI properly."
    },
    {
        name: "Hyperparameters",
        type: "choice",
        description: "How many 'Epochs' (training rounds) should we run? Too few is bad, too many is slow.",
        choices: [
            { text: "50 Rounds (Optimal)", correct: true },
            { text: "1 Round (Too lazy)", correct: false },
            { text: "1,000,000 Rounds (Overkill)", correct: false }
        ],
        feedback: "Correct! Balance is key in machine learning."
    },
    {
        name: "The Universal AI",
        type: "code",
        description: "FINAL MISSION: You have mastered Data, Bias, NLP, and Vision. Type 'super_init()' to launch the ultimate AI.",
        objectives: [{ id: "super", text: "Type super_init()", regex: /super_init\(\)/i }],
        validate: (code) => code.includes("super_init"),
        visualAction: () => finalGlow(),
        feedback: "CONGRATULATIONS! You are a certified AI Architect."
    }
];

let currentModuleIndex = 0;
const editor = document.getElementById('pythonEditor');
const outputDisplay = document.getElementById('outputDisplay');
const feedbackEl = document.getElementById('visualFeedback');
const interactiveZone = document.getElementById('interactiveZone');

function init() {
    const progress = getProgress();
    const startLevel = (progress.levels.ai_ml || 1) - 1;
    loadModule(startLevel);
    editor.addEventListener('input', validateCode);
}

function loadModule(index) {
    currentModuleIndex = index;
    
    // Save progress: only update if we reached a NEW level
    const progress = getProgress();
    if (index + 1 > progress.levels.ai_ml) {
        progress.levels.ai_ml = index + 1;
        saveProgress(progress);
    }
    
    const m = modules[index];
    document.getElementById('currentModuleName').textContent = `Module: ${m.name}`;
    document.getElementById('moduleStepIndicator').textContent = `${(index + 1).toString().padStart(2, '0')} / ${modules.length}`;
    document.getElementById('missionDesc').textContent = m.description;
    editor.value = "";
    feedbackEl.textContent = '';
    
    // Reset Interactive Zone
    interactiveZone.style.display = 'none';
    interactiveZone.innerHTML = '';

    const objList = document.getElementById('objectives');
    objList.innerHTML = '';
    
    if (m.type === 'code') {
        document.querySelector('.editor-mini').style.display = 'block';
        m.objectives.forEach(obj => {
            const div = document.createElement('div');
            div.className = 'objective';
            div.id = `obj-${obj.id}`;
            div.innerHTML = `<div class="objective-check"></div><span>${obj.text}</span>`;
            objList.appendChild(div);
        });
    } else {
        document.querySelector('.editor-mini').style.display = 'none';
        const div = document.createElement('div');
        div.className = 'objective';
        div.innerHTML = `<div class="objective-check"></div><span>Complete Interactive Task</span>`;
        objList.appendChild(div);
        setupInteractiveTask(m);
    }

    document.getElementById('nextModuleBtn').style.display = 'none';
    outputDisplay.innerHTML = '<div>System ready.</div>';
    renderLevelIndicators();
    if (m.visualAction) m.visualAction();
}

function renderLevelIndicators() {
    const dotsContainer = document.getElementById('levelDots');
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    dotsContainer.style.flexWrap = 'wrap';
    
    const progress = getProgress();
    const maxUnlocked = (progress.levels.ai_ml || 1) - 1;
    
    modules.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.style.width = '20px';
        dot.style.height = '10px';
        dot.style.borderRadius = '4px';
        dot.style.transition = 'all 0.3s';
        dot.style.border = '1px solid rgba(255,255,255,0.1)';
        
        dot.style.cursor = 'pointer';
        dot.onclick = () => loadModule(i);

        if (isActive) {
            dot.style.background = '#8b5cf6';
            dot.style.width = '30px';
            dot.style.boxShadow = '0 0 10px #8b5cf6';
        } else if (i < (progress.levels.ai_ml || 1)) {
            dot.style.background = '#d8b4fe';
        } else {
            dot.style.background = '#334155';
            dot.style.opacity = '0.8';
        }
        
        dotsContainer.appendChild(dot);
    });
}

function setupInteractiveTask(m) {
    interactiveZone.style.display = 'flex';
    
    if (m.type === 'choice') {
        const title = document.createElement('h3');
        title.textContent = "Select the correct answer:";
        interactiveZone.appendChild(title);
        
        m.choices.forEach(c => {
            const btn = document.createElement('button');
            btn.className = 'run-btn';
            btn.style.width = '100%';
            btn.style.marginTop = '10px';
            btn.textContent = c.text;
            btn.onclick = () => {
                if (c.correct) {
                    handleSuccess(m.feedback);
                } else {
                    outputDisplay.innerHTML = '<div style="color:#ef4444;">Not quite! Try another answer.</div>';
                }
            };
            interactiveZone.appendChild(btn);
        });
    } else if (m.type === 'drag') {
        const title = document.createElement('h3');
        title.textContent = "Drag items to correct category:";
        interactiveZone.appendChild(title);
        
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.gap = '20px';
        container.style.marginTop = '20px';
        
        const itemBox = document.createElement('div');
        itemBox.style.display = 'flex';
        itemBox.style.flexDirection = 'column';
        itemBox.style.gap = '10px';

        const bins = {};
        m.categories.forEach(cat => {
            const bin = document.createElement('div');
            bin.style.cssText = `width:100px; height:100px; border:3px dashed ${cat.color}; border-radius:15px; display:flex; flex-direction:column; align-items:center; justify-content:center; font-size:0.7rem; text-align:center; padding:5px;`;
            bin.innerHTML = `<strong>${cat.name}</strong>`;
            bin.ondragover = (e) => e.preventDefault();
            bin.ondrop = (e) => {
                const id = e.dataTransfer.getData("text");
                const item = m.items.find(i => i.id === id);
                if (item.category === cat.id) {
                    const el = document.getElementById(id);
                    bin.appendChild(el);
                    checkDragComplete(m);
                } else {
                    outputDisplay.innerHTML = '<div style="color:#ef4444;">Oops! Wrong category.</div>';
                }
            };
            container.appendChild(bin);
        });

        m.items.forEach(item => {
            const el = document.createElement('div');
            el.id = item.id;
            el.draggable = true;
            el.style.cssText = "font-size:2rem; cursor:grab; background:rgba(255,255,255,0.1); padding:5px; border-radius:10px; text-align:center;";
            el.textContent = item.text;
            el.ondragstart = (e) => e.dataTransfer.setData("text", item.id);
            itemBox.appendChild(el);
        });

        interactiveZone.appendChild(itemBox);
        interactiveZone.appendChild(container);
    } else if (m.type === 'drag_weight') {
        const title = document.createElement('h3');
        title.textContent = "Adjust Connection Strength:";
        interactiveZone.appendChild(title);
        
        const bin = document.createElement('div');
        bin.style.cssText = "width:150px; height:60px; border:3px solid #8b5cf6; border-radius:30px; margin-top:20px; display:flex; align-items:center; justify-content:center; color:#a78bfa; font-weight:800;";
        bin.textContent = "Drop Weight Here";
        bin.ondragover = (e) => e.preventDefault();
        bin.ondrop = (e) => {
            const id = e.dataTransfer.getData("text");
            if (id === 'w-correct') {
                handleSuccess(m.feedback);
                updateNet(1, 0, 1, true);
            } else {
                outputDisplay.innerHTML = '<div style="color:#ef4444;">That weight is too weak!</div>';
            }
        };

        const weightBox = document.createElement('div');
        weightBox.style.display = 'flex';
        weightBox.style.gap = '15px';
        weightBox.style.marginTop = '20px';

        m.weights.forEach((w, i) => {
            const el = document.createElement('div');
            el.draggable = true;
            el.id = w.correct ? 'w-correct' : `w-${i}`;
            el.style.cssText = "padding:10px 15px; background:var(--primary); border-radius:20px; font-weight:800; cursor:grab;";
            el.textContent = w.label;
            el.ondragstart = (e) => e.dataTransfer.setData("text", el.id);
            weightBox.appendChild(el);
        });

        interactiveZone.appendChild(weightBox);
        interactiveZone.appendChild(bin);
    }
}

function checkDragComplete(m) {
    const totalItems = m.items.length;
    let placedCount = 0;
    interactiveZone.querySelectorAll('[id^="f"], [id^="s"], [id^="c"]').forEach(el => {
        if (el.parentElement.style.borderStyle === 'solid' || el.parentElement.style.borderStyle === 'dashed') {
            placedCount++;
        }
    });
    if (placedCount >= totalItems) {
        handleSuccess(m.feedback);
    }
}

function handleSuccess(msg) {
    outputDisplay.innerHTML = `<div style="color:#10b981;">> SUCCESS: ${msg}</div>`;
    feedbackEl.textContent = msg;
    document.getElementById('nextModuleBtn').style.display = 'block';
    if (document.querySelector('.objective-check')) {
        document.querySelector('.objective-check').style.background = '#10b981';
    }
    
    // If it's the final level, show the celebration!
    if (currentModuleIndex === modules.length - 1) {
        finalGlow();
    }
}

function validateCode() {
    const m = modules[currentModuleIndex];
    if (m.type !== 'code') return;
    
    const code = editor.value;
    let completedCount = 0;
    m.objectives.forEach(obj => {
        const element = document.getElementById(`obj-${obj.id}`);
        if (obj.regex.test(code)) {
            element.classList.add('completed');
            completedCount++;
        } else {
            element.classList.remove('completed');
        }
    });

    if (completedCount === m.objectives.length) {
        document.getElementById('nextModuleBtn').style.display = 'block';
    } else {
        document.getElementById('nextModuleBtn').style.display = 'none';
    }
}

function showValidationChart(data) {
    const zone = document.getElementById('interactiveZone');
    const chart = document.createElement('div');
    chart.style.cssText = "display:flex; align-items:flex-end; gap:20px; height:120px; margin-top:15px; border-bottom:2px solid var(--border); padding-bottom:10px; width:80%;";
    
    const labels = ['SUCCESS', 'ERRORS'];
    const colors = ['#10b981', '#ef4444'];
    
    data.forEach((val, i) => {
        const barCol = document.createElement('div');
        barCol.style.cssText = "flex:1; display:flex; flex-direction:column; align-items:center; gap:5px;";
        
        const bar = document.createElement('div');
        bar.style.cssText = `width:100%; height:0%; background:${colors[i]}; border-radius:4px 4px 0 0; transition: height 1s ease-out;`;
        setTimeout(() => bar.style.height = `${val}%`, 100);
        
        const label = document.createElement('div');
        label.style.cssText = "font-size:0.6rem; font-weight:800; color:#94a3b8;";
        label.textContent = `${labels[i]} (${val}%)`;
        
        barCol.appendChild(bar);
        barCol.appendChild(label);
        chart.appendChild(barCol);
    });
    
    zone.appendChild(chart);
}

function executeCode() {
    const m = modules[currentModuleIndex];
    const code = editor.value;
    if (m.type !== 'code') return;
    
    outputDisplay.innerHTML = '<div>Running Logic...</div>';
    setTimeout(() => {
        if (m.validate(code)) {
            handleSuccess(m.feedback);
            if (m.visualAction) m.visualAction();
        } else {
            outputDisplay.innerHTML += '<div style="color:#ef4444;">> ERROR: Command not recognized.</div>';
        }
    }, 600);
}

// --- Visual Logic (The "Fun" part) ---

function updateNet(inputs, hidden, outputs, boosted = false) {
    const inputLayer = document.getElementById('inputLayer');
    const hiddenLayer = document.getElementById('hiddenLayer');
    const outputLayer = document.getElementById('outputLayer');
    const connLayer = document.getElementById('connectionsLayer');
    
    inputLayer.innerHTML = '';
    hiddenLayer.innerHTML = '';
    outputLayer.innerHTML = '';
    connLayer.innerHTML = '';

    const createNode = (x, y, id) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", x);
        c.setAttribute("cy", y);
        c.setAttribute("r", 8);
        c.setAttribute("fill", "#a78bfa");
        c.setAttribute("id", id);
        c.style.filter = "drop-shadow(0 0 5px #8b5cf6)";
        return c;
    };

    const createLine = (x1, y1, x2, y2) => {
        const l = document.createElementNS("http://www.w3.org/2000/svg", "line");
        l.setAttribute("x1", x1);
        l.setAttribute("y1", y1);
        l.setAttribute("x2", x2);
        l.setAttribute("y2", y2);
        l.setAttribute("stroke", "#334155");
        l.setAttribute("stroke-width", boosted ? 3 : 1);
        if (boosted) l.setAttribute("stroke", "#8b5cf6");
        return l;
    };

    const inNodes = [];
    for(let i=0; i<inputs; i++) {
        const y = 150 + (i - (inputs-1)/2) * 40; // Reduced from 50
        const n = createNode(60, y, `in-${i}`); // Moved right from 50
        inputLayer.appendChild(n);
        inNodes.push({x: 60, y});
    }

    const hiNodes = [];
    for(let i=0; i<hidden; i++) {
        const y = 150 + (i - (hidden-1)/2) * 35; // Reduced from 40
        const n = createNode(200, y, `hi-${i}`);
        hiddenLayer.appendChild(n);
        hiNodes.push({x: 200, y});
    }

    const outNodes = [];
    for(let i=0; i<outputs; i++) {
        const y = 150 + (i - (outputs-1)/2) * 45; // Reduced from 60
        const n = createNode(340, y, `out-${i}`); // Moved left from 350
        outputLayer.appendChild(n);
        outNodes.push({x: 340, y});
    }

    // Draw connections
    if (hidden > 0) {
        inNodes.forEach(iN => {
            hiNodes.forEach(hN => {
                connLayer.appendChild(createLine(iN.x, iN.y, hN.x, hN.y));
            });
        });
        hiNodes.forEach(hN => {
            outNodes.forEach(oN => {
                connLayer.appendChild(createLine(hN.x, hN.y, oN.x, oN.y));
            });
        });
    } else if (outputs > 0) {
        inNodes.forEach(iN => {
            outNodes.forEach(oN => {
                connLayer.appendChild(createLine(iN.x, iN.y, oN.x, oN.y));
            });
        });
    }
}

function showPrediction(emoji) {
    const div = document.createElement('div');
    div.style.cssText = `
        position:absolute; top:20px; right:20px;
        font-size:3rem; background:rgba(16,185,129,0.1);
        padding:10px; border-radius:15px; border:2px solid var(--success);
    `;
    div.textContent = emoji;
    div.id = "tempPred";
    document.getElementById('brainViz').appendChild(div);
}

function startFlow() {
    const lines = document.querySelectorAll('#connectionsLayer line');
    lines.forEach(l => {
        l.style.strokeDasharray = "5,5";
        l.style.animation = "flow 1s linear infinite";
    });
}

function finalGlow() {
    document.querySelectorAll('.brain-viz circle').forEach(c => {
        c.setAttribute('fill', '#a78bfa');
        c.style.animation = "pulseNode 2s infinite";
    });
    startFlow();
    document.getElementById('aiTypeBadge').textContent = "STATUS: SUPER INTELLIGENCE";
    document.getElementById('aiTypeBadge').style.background = "linear-gradient(90deg, #8b5cf6, #ec4899)";
}

function nextModule() {
    if (currentModuleIndex < modules.length - 1) {
        loadModule(currentModuleIndex + 1);
    } else {
        completeMission('ai_ml', 500);
        showCompletion();
    }
}

function showCompletion() {
    const overlay = document.getElementById('completionOverlay');
    overlay.style.display = 'flex';
    overlay.innerHTML = `
        <div class="modal">
            <h1>🧠 UNIVERSE BRAIN</h1>
            <p>You have mastered the principles of AI through data, logic, and neural design!</p>
            <p style="color: #a78bfa; font-weight: bold; margin-top: 1rem;">+500 XP Earned</p>
            <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: center;">
                <button class="run-btn" onclick="location.href='dashboard.html'">Back to Dashboard</button>
            </div>
        </div>
    `;
}

init();
