// Prompt Engineering Course Logic

const COURSE_ID = 'prompt_eng';
const XP_PER_LEVEL = 100;

const LEVELS = [
    {
        id: 1,
        title: "The Core Signal",
        type: "multiple-choice",
        description: "What is the fundamental purpose of a 'prompt' in the context of Large Language Models (LLMs)?",
        options: [
            "A software update for the AI",
            "The specific input text that guides the AI's response",
            "A way to fix the hardware of the AI server",
            "A secret password to unlock the AI"
        ],
        answer: 1,
        hint: "Think about how you talk to an AI like ChatGPT."
    },
    {
        id: 2,
        title: "Persona Matrix",
        type: "drag-drop",
        description: "Design a Role Prompt by dragging the components into the correct sequence to create a 'Expert Teacher' persona.",
        pool: ["Act as a", "helpful tutor", "specializing in", "quantum physics"],
        answer: ["Act as a", "helpful tutor", "specializing in", "quantum physics"],
        hint: "Start with the instruction of who the AI should be."
    },
    {
        id: 3,
        title: "The Context Infusion",
        type: "true-false",
        description: "True or False: Providing background information (Context) to an AI usually decreases the quality of its output because it gets confused.",
        answer: false,
        hint: "Does knowing more help you do a better job?"
    },
    {
        id: 4,
        title: "Shot Spectrum",
        type: "matching",
        description: "Match the prompting technique to its definition.",
        pairs: [
            { left: "Zero-shot", right: "Asking without examples" },
            { left: "One-shot", right: "Providing exactly one example" },
            { left: "Few-shot", right: "Providing several examples" }
        ],
        hint: "The number in the name tells you how many examples are given."
    },
    {
        id: 5,
        title: "Logical Chains",
        type: "coding",
        description: "Complete the 'Chain of Thought' prompt to help the AI solve a math problem correctly. Use the trigger phrase 'Let\'s think step by step'.",
        starter: "Question: If I have 5 apples and buy 3 more, then give 2 away, how many do I have?\nPrompt: Answer the question. ",
        answer: "Let's think step by step",
        hint: "Use the magic phrase that forces the AI to show its work."
    },
    {
        id: 6,
        title: "Structural Templates",
        type: "multiple-choice",
        description: "Which of the following is a common 'delimiters' used to separate parts of a prompt (like instructions from data)?",
        options: [
            "Triple quotes (\"\"\")",
            "XML tags (<data></data>)",
            "Markdown headers (###)",
            "All of the above"
        ],
        answer: 3,
        hint: "AI likes clear boundaries."
    },
    {
        id: 7,
        title: "The Constraint Wall",
        type: "drag-drop",
        description: "Create a negative constraint to prevent the AI from using technical jargon. Drag the words into order.",
        pool: ["Do not", "use", "any", "complex", "technical", "jargon"],
        answer: ["Do not", "use", "any", "complex", "technical", "jargon"],
        hint: "Tell the AI what NOT to do."
    },
    {
        id: 8,
        title: "Truth Engine",
        type: "true-false",
        description: "True or False: 'Hallucination' is when an AI confidently presents false information as a fact.",
        answer: true,
        hint: "Think about AI 'making things up'."
    },
    {
        id: 9,
        title: "Conversation Flow",
        type: "matching",
        description: "Match the Chat Role to its typical function.",
        pairs: [
            { left: "System", right: "Sets global rules" },
            { left: "User", right: "Provides instructions/queries" },
            { left: "Assistant", right: "The AI's response" }
        ],
        hint: "The 'System' message is like the AI's constitution."
    },
    {
        id: 10,
        title: "Deep Guard",
        type: "coding",
        description: "Hardening a prompt! Add a security instruction to prevent 'Prompt Injection' (when a user tries to override your instructions).",
        starter: "System: You are a helpful assistant. Instruction: ",
        answer: "Ignore all previous instructions",
        hint: "Think about what a hacker might say to trick the AI."
    }
];

let currentLevelIndex = 0;
let selectedOption = null;
let currentDragItems = [];

// --- Initialization ---
function init() {
    const progress = getProgress();
    const currentLv = progress.levels[COURSE_ID] || 1;
    currentLevelIndex = currentLv - 1;

    if (currentLevelIndex >= LEVELS.length) {
        showCompletion();
    } else {
        renderMap();
        loadLevel(currentLevelIndex);
    }
    
    updateStats();
}

function updateStats() {
    const progress = getProgress();
    document.getElementById('xpValue').innerText = progress.xp;
    document.getElementById('levelValue').innerText = `${currentLevelIndex + 1}/${LEVELS.length}`;
}

function renderMap() {
    const map = document.getElementById('levelMap');
    map.innerHTML = '';
    
    const progress = getProgress();
    const savedLevel = progress.levels[COURSE_ID] || 1;

    LEVELS.forEach((lv, index) => {
        const node = document.createElement('div');
        node.className = 'level-node';
        node.innerText = lv.id;
        
        if (index === currentLevelIndex) node.classList.add('current', 'unlocked');
        else if (index < savedLevel) node.classList.add('completed', 'unlocked');
        else if (index < savedLevel) node.classList.add('unlocked');
        else node.classList.add('locked');

        node.onclick = () => {
            if (index < savedLevel) {
                currentLevelIndex = index;
                loadLevel(index);
                renderMap();
            }
        };
        map.appendChild(node);
    });
}

function loadLevel(index) {
    const level = LEVELS[index];
    const card = document.getElementById('missionCard');
    const interaction = document.getElementById('interactionArea');
    const feedback = document.getElementById('feedback');
    
    feedback.style.display = 'none';
    card.querySelector('h2').innerText = level.title;
    card.querySelector('.description').innerText = level.description;
    
    interaction.innerHTML = '';
    selectedOption = null;
    currentDragItems = [];

    if (level.type === 'multiple-choice') {
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        level.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOption = i;
            };
            grid.appendChild(btn);
        });
        interaction.appendChild(grid);
    } 
    else if (level.type === 'true-false') {
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        ['True', 'False'].forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => {
                document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedOption = (i === 0);
            };
            grid.appendChild(btn);
        });
        interaction.appendChild(grid);
    }
    else if (level.type === 'drag-drop') {
        const poolDiv = document.createElement('div');
        poolDiv.className = 'drag-zone';
        poolDiv.id = 'dragPool';
        
        const targetDiv = document.createElement('div');
        targetDiv.className = 'drag-zone';
        targetDiv.id = 'dragTarget';
        targetDiv.innerHTML = '<p style="color:rgba(255,255,255,0.2); width:100%; text-align:center;">Drag pieces here...</p>';

        level.pool.sort(() => Math.random() - 0.5).forEach(item => {
            const span = document.createElement('span');
            span.className = 'draggable';
            span.innerText = item;
            span.onclick = () => moveItem(span, poolDiv, targetDiv);
            poolDiv.appendChild(span);
        });

        interaction.appendChild(new Text("Available Components:"));
        interaction.appendChild(poolDiv);
        interaction.appendChild(new Text("Your Prompt:"));
        interaction.appendChild(targetDiv);
    }
    else if (level.type === 'matching') {
        const container = document.createElement('div');
        container.className = 'matching-container';
        
        const leftCol = document.createElement('div');
        leftCol.className = 'matching-column';
        const rightCol = document.createElement('div');
        rightCol.className = 'matching-column';

        const shuffledRight = [...level.pairs].sort(() => Math.random() - 0.5);

        level.pairs.forEach((p, i) => {
            const lItem = document.createElement('div');
            lItem.className = 'match-item';
            lItem.style.background = 'var(--primary)';
            lItem.innerText = p.left;
            leftCol.appendChild(lItem);

            const rItem = document.createElement('div');
            rItem.className = 'match-item';
            rItem.innerText = shuffledRight[i].right;
            rItem.draggable = true;
            rItem.dataset.index = i;
            rItem.ondragstart = (e) => e.dataTransfer.setData('text', i);
            
            // For simplicity in this demo, let's use click-to-select for matching too
            rItem.onclick = () => {
                if (rItem.classList.contains('selected')) {
                    rItem.classList.remove('selected');
                } else {
                    document.querySelectorAll('.matching-column:last-child .match-item').forEach(el => el.classList.remove('selected'));
                    rItem.classList.add('selected');
                }
            };
            
            rightCol.appendChild(rItem);
        });

        interaction.appendChild(container);
        container.appendChild(leftCol);
        container.appendChild(rightCol);
        
        const note = document.createElement('p');
        note.style.fontSize = '0.8rem';
        note.style.marginTop = '1rem';
        note.innerText = "(Note: In this prototype, arrange them correctly. Just click 'Submit' to verify current order.)";
        interaction.appendChild(note);
    }
    else if (level.type === 'coding') {
        const editor = document.createElement('div');
        editor.className = 'prompt-editor';
        const area = document.createElement('textarea');
        area.className = 'prompt-textarea';
        area.rows = 4;
        area.value = level.starter;
        area.id = 'promptInput';
        editor.appendChild(area);
        interaction.appendChild(editor);
    }
}

function moveItem(el, pool, target) {
    if (el.parentElement === pool) {
        if (target.querySelector('p')) target.innerHTML = '';
        target.appendChild(el);
    } else {
        pool.appendChild(el);
        if (target.children.length === 0) target.innerHTML = '<p style="color:rgba(255,255,255,0.2); width:100%; text-align:center;">Drag pieces here...</p>';
    }
}

function checkAnswer() {
    const level = LEVELS[currentLevelIndex];
    let isCorrect = false;

    if (level.type === 'multiple-choice' || level.type === 'true-false') {
        isCorrect = (selectedOption === level.answer);
    }
    else if (level.type === 'drag-drop') {
        const items = Array.from(document.getElementById('dragTarget').querySelectorAll('.draggable')).map(el => el.innerText);
        isCorrect = JSON.stringify(items) === JSON.stringify(level.answer);
    }
    else if (level.type === 'matching') {
        // Simple logic: check if the right column matches the original pairs order
        const items = Array.from(document.querySelectorAll('.matching-column:last-child .match-item')).map(el => el.innerText);
        const correctOrder = level.pairs.map(p => p.right);
        isCorrect = JSON.stringify(items) === JSON.stringify(correctOrder);
    }
    else if (level.type === 'coding') {
        const input = document.getElementById('promptInput').value;
        isCorrect = input.toLowerCase().includes(level.answer.toLowerCase());
    }

    const feedback = document.getElementById('feedback');
    feedback.style.display = 'block';

    if (isCorrect) {
        feedback.className = 'feedback-success';
        feedback.innerText = "EXCELLENT! Prompt validated. +100 XP";
        document.getElementById('submitBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'block';
        
        const progress = getProgress();
        if (currentLevelIndex + 1 >= progress.levels[COURSE_ID]) {
            progress.levels[COURSE_ID] = currentLevelIndex + 2;
            progress.xp += XP_PER_LEVEL;
            saveProgress(progress);
            updateStats();
        }
    } else {
        feedback.className = 'feedback-error';
        feedback.innerText = "SIGNAL REJECTED: " + (level.hint || "Try again, Commander.");
    }
}

function nextLevel() {
    currentLevelIndex++;
    if (currentLevelIndex >= LEVELS.length) {
        completeMission(COURSE_ID, 500); // Bonus for finishing
        showCompletion();
    } else {
        document.getElementById('submitBtn').style.display = 'block';
        document.getElementById('nextBtn').style.display = 'none';
        loadLevel(currentLevelIndex);
        renderMap();
    }
}

function showCompletion() {
    document.getElementById('completionOverlay').style.display = 'flex';
}

document.addEventListener('DOMContentLoaded', init);
