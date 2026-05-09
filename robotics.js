const LEVELS = [
    {
        title: "What is a Robot?",
        desc: "A robot is a machine that can do work by itself. Does a robot need a brain?",
        type: "mc",
        question: "What acts as the 'brain' of a robot?",
        options: ["A Battery", "A Computer", "A Wheel", "A Sensor"],
        answer: 1
    },
    {
        title: "The Three Laws",
        desc: "Robots follow rules. Should a robot help people?",
        type: "tf",
        question: "A robot's first priority is to protect humans.",
        answer: true
    },
    {
        title: "Robot Parts: Sensors",
        desc: "Sensors help robots 'see' and 'feel'. Drag the part that helps a robot see.",
        type: "drag",
        question: "Match the 'Eye' sensor:",
        items: ["Camera", "Battery", "Motor"],
        answer: ["Camera"]
    },
    {
        title: "Power Source",
        desc: "Just like us, robots need energy to move.",
        type: "mc",
        question: "Where do most mobile robots get their energy?",
        options: ["Solar Panels", "Gasoline", "Batteries", "Eating Food"],
        answer: 2
    },
    {
        title: "Movement: Actuators",
        desc: "Actuators are like muscles for robots. They help them move.",
        type: "tf",
        question: "A motor is a type of actuator.",
        answer: true
    },
    {
        title: "The Industrial Robot",
        desc: "Some robots work in factories to build cars.",
        type: "mc",
        question: "What is a robot arm called in engineering?",
        options: ["A Leg", "A Manipulator", "A Tail", "A Wing"],
        answer: 1
    },
    {
        title: "Autonomous vs Remote",
        desc: "Some robots think for themselves, others are like remote-controlled cars.",
        type: "tf",
        question: "An 'Autonomous' robot needs a human to press every button.",
        answer: false
    },
    {
        title: "Robot Parts: Logic",
        desc: "Drag the part that stores instructions for the robot.",
        type: "drag",
        question: "Match the 'Memory':",
        items: ["Code", "Wheels", "Screws"],
        answer: ["Code"]
    },
    {
        title: "Wheels vs Legs",
        desc: "Robots move in different ways depending on the ground.",
        type: "mc",
        question: "Which robot would be best for climbing stairs?",
        options: ["A Wheeled Robot", "A Legged Robot", "A Flat Robot", "A Heavy Robot"],
        answer: 1
    },
    {
        title: "Humanoid Robots",
        desc: "Some robots look just like us!",
        type: "tf",
        question: "A Humanoid robot is shaped like a human.",
        answer: true
    },
    {
        title: "Mars Rovers",
        desc: "We send robots to other planets because it is safer.",
        type: "mc",
        question: "Which famous robot lives on Mars?",
        options: ["Roomba", "Curiosity", "Asimo", "Spot"],
        answer: 1
    },
    {
        title: "Robot Senses: Touch",
        desc: "How does a robot know it hit a wall?",
        type: "mc",
        question: "Which sensor detects if a robot touches something?",
        options: ["Microphone", "Thermometer", "Bumper Switch", "Light Sensor"],
        answer: 2
    },
    {
        title: "Medical Robots",
        desc: "Robots can even help doctors perform surgery!",
        type: "tf",
        question: "Robots are too shaky to help in hospitals.",
        answer: false
    },
    {
        title: "Underwater Robots",
        desc: "Drag the feature needed for a robot to work in the ocean.",
        type: "drag",
        question: "Match the 'Ocean' feature:",
        items: ["Waterproof", "Heater", "Wheels"],
        answer: ["Waterproof"]
    },
    {
        title: "Domestic Robots",
        desc: "Some robots help us clean our houses.",
        type: "mc",
        question: "What does a 'Roomba' robot do?",
        options: ["Cooks Dinner", "Vacuums Floors", "Walks the Dog", "Does Homework"],
        answer: 1
    },
    {
        title: "Drones: Flying Robots",
        desc: "Drones are robots that can fly in the sky.",
        type: "tf",
        question: "A drone is a type of robot.",
        answer: true
    },
    {
        title: "Artificial Intelligence",
        desc: "AI helps robots learn from their mistakes.",
        type: "mc",
        question: "What does AI stand for?",
        options: ["Always Interesting", "Automatic Input", "Artificial Intelligence", "Angry Insects"],
        answer: 2
    },
    {
        title: "Robot Teamwork",
        desc: "When many robots work together, it is called a swarm.",
        type: "tf",
        question: "A swarm of robots can solve big problems together.",
        answer: true
    },
    {
        title: "The Future of Robots",
        desc: "Drag the goal for future robots.",
        type: "drag",
        question: "Match the 'Goal':",
        items: ["Helpful", "Dangerous", "Heavy"],
        answer: ["Helpful"]
    },
    {
        title: "The Master Engineer",
        desc: "You have learned the basics of robotics!",
        type: "mc",
        question: "What do you call someone who builds robots?",
        options: ["Chef", "Roboticist", "Gardener", "Pilot"],
        answer: 1
    }
];

let currentLevelIndex = 0;

function initGame() {
    const progress = getProgress();
    currentLevelIndex = (progress.levels.robotics || 1) - 1;
    if (currentLevelIndex >= LEVELS.length) currentLevelIndex = LEVELS.length - 1;
    
    renderLevelIndicators();
    loadLevel(currentLevelIndex);
}

function renderLevelIndicators() {
    const indicators = document.getElementById('levelIndicators');
    indicators.innerHTML = '';
    const progress = getProgress();
    const maxUnlocked = progress.levels.robotics || 1;

    LEVELS.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = `level-dot ${i === currentLevelIndex ? 'active' : ''}`;
        dot.style.cssText = `
            width: 12px; height: 12px; border-radius: 50%;
            background: ${i === currentLevelIndex ? '#ef4444' : (i < maxUnlocked ? '#1e293b' : 'rgba(255,255,255,0.1)')};
            border: 2px solid ${i === currentLevelIndex ? '#ef4444' : '#334155'};
            cursor: ${i < maxUnlocked ? 'pointer' : 'not-allowed'};
        `;
        if (i < maxUnlocked) {
            dot.onclick = () => loadLevel(i);
        }
        indicators.appendChild(dot);
    });
}

function loadLevel(index) {
    currentLevelIndex = index;
    const level = LEVELS[index];
    document.getElementById('levelTitle').innerText = `Level ${index + 1}: ${level.title}`;
    document.getElementById('levelDesc').innerText = level.desc;
    document.getElementById('feedback').innerText = '';
    
    renderQuiz(level);
    renderLevelIndicators();
}

function renderQuiz(level) {
    const container = document.getElementById('quizContainer');
    container.innerHTML = `<h3 style="margin-bottom: 1.5rem;">${level.question}</h3>`;

    if (level.type === 'mc') {
        level.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(i === level.answer, btn);
            container.appendChild(btn);
        });
    } else if (level.type === 'tf') {
        const btnT = document.createElement('button');
        btnT.className = 'option-btn';
        btnT.innerText = 'True';
        btnT.onclick = () => checkAnswer(level.answer === true, btnT);
        
        const btnF = document.createElement('button');
        btnF.className = 'option-btn';
        btnF.innerText = 'False';
        btnF.onclick = () => checkAnswer(level.answer === false, btnF);
        
        container.appendChild(btnT);
        container.appendChild(btnF);
    } else if (level.type === 'drag') {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.id = 'dropZone';
        dropZone.innerText = 'Drop correct part here';
        
        const dragZone = document.createElement('div');
        dragZone.className = 'drag-zone';
        
        level.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'drag-item';
            div.innerText = item;
            div.draggable = true;
            div.ondragstart = (e) => e.dataTransfer.setData('text', item);
            dragZone.appendChild(div);
        });

        dropZone.ondragover = (e) => e.preventDefault();
        dropZone.ondrop = (e) => {
            const val = e.dataTransfer.getData('text');
            dropZone.innerText = val;
            checkAnswer(level.answer.includes(val), dropZone);
        };

        container.appendChild(dropZone);
        container.appendChild(dragZone);
    }
}

function checkAnswer(isCorrect, element) {
    const feedback = document.getElementById('feedback');
    if (isCorrect) {
        element.classList.add('correct');
        feedback.innerText = 'Correct! Great job! 🤖';
        feedback.style.color = '#10b981';
        logMission(`Level ${currentLevelIndex + 1} completed.`, 'success');
        
        // Save Progress
        const progress = getProgress();
        if (currentLevelIndex + 2 > progress.levels.robotics) {
            progress.levels.robotics = currentLevelIndex + 2;
            saveProgress(progress);
            awardXP(50);
        }

        setTimeout(showWin, 1000);
    } else {
        element.classList.add('wrong');
        feedback.innerText = 'Try again! You can do it!';
        feedback.style.color = '#ef4444';
        logMission(`Incorrect attempt on Level ${currentLevelIndex + 1}.`, 'error');
    }
}

function showWin() {
    const isFinal = currentLevelIndex === LEVELS.length - 1;
    const modal = document.getElementById('winModal');
    
    if (isFinal) {
        completeMission('robotics', 500);
        modal.querySelector('h1').innerText = "COURSE GRADUATE! 🏆";
        modal.querySelector('p').innerText = "You are now a certified Robotics Engineer. The future is yours!";
        modal.querySelectorAll('button')[1].innerText = "Return to Dashboard";
        modal.querySelectorAll('button')[1].onclick = () => location.href = 'dashboard.html';
    } else {
        modal.querySelector('h1').innerText = "MISSION SUCCESS! 🎉";
        modal.querySelector('p').innerText = "Level completed. Ready for the next one?";
        modal.querySelectorAll('button')[1].innerText = "Next Level";
        modal.querySelectorAll('button')[1].onclick = nextLevel;
    }
    
    modal.style.display = 'flex';
}

function nextLevel() {
    document.getElementById('winModal').style.display = 'none';
    if (currentLevelIndex < LEVELS.length - 1) {
        loadLevel(currentLevelIndex + 1);
    }
}

function logMission(msg, type = 'info') {
    const log = document.getElementById('missionLog');
    const color = type === 'success' ? '#10b981' : (type === 'error' ? '#ef4444' : '#94a3b8');
    log.innerHTML = `> <span style="color: ${color}">${msg}</span><br>` + log.innerHTML;
}

document.addEventListener('DOMContentLoaded', initGame);
