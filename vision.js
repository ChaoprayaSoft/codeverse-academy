const levels = [
    {
        id: 1,
        title: "Pixel Basics",
        type: "mcq",
        question: "What are the three primary colors used in digital images (RGB)?",
        options: ["Red, Green, Black", "Red, Green, Blue", "Real, Great, Blue", "Red, Grey, Blue"],
        answer: 1,
        explanation: "Digital screens use Red, Green, and Blue light to create all other colors!",
        hint: "Think about the acronym RGB.",
        filter: "none"
    },
    {
        id: 2,
        title: "The Power of Grey",
        type: "tf",
        question: "Converting an image to Greyscale removes all color information but keeps the light intensity.",
        answer: true,
        explanation: "Greyscale simplifies images by focusing only on how bright each pixel is.",
        hint: "Does a black and white photo have colors?",
        filter: "grayscale(1)"
    },
    {
        id: 3,
        title: "Digital Brightness",
        type: "drag",
        question: "Drag the code block that would make the image BRIGHTER.",
        items: ["image + 50", "image - 50", "image / 2"],
        answer: "image + 50",
        explanation: "Adding a value to pixels makes them closer to white (255), increasing brightness.",
        hint: "Higher numbers in digital color mean more light.",
        filter: "brightness(1.5)"
    },
    {
        id: 4,
        title: "Thresholding Barrier",
        type: "code",
        code: "cv2.threshold(img, <input>, 255, cv2.THRESH_BINARY)",
        question: "Enter the threshold value (0-255) to turn pixels darker than middle-grey into total black.",
        answer: "127",
        explanation: "A threshold of 127 splits the range (0-255) right in the middle.",
        hint: "What is half of 255?",
        filter: "contrast(10) grayscale(1)"
    },
    {
        id: 5,
        title: "Smoothing the Noise",
        type: "drag",
        question: "Drag the correct function name to BLUR an image.",
        items: ["GaussianBlur", "SharpEdges", "ColorBoost"],
        answer: "GaussianBlur",
        explanation: "GaussianBlur is used to reduce noise and detail in an image.",
        hint: "It sounds like a type of blur!",
        filter: "blur(5px)"
    },
    {
        id: 6,
        title: "Finding Edges",
        type: "mcq",
        question: "Which algorithm is famous for finding the outlines (edges) of objects?",
        options: ["Canny", "Candy", "Canyon", "Cannon"],
        answer: 0,
        explanation: "The Canny Edge Detector is a legendary tool in OpenCV for finding edges.",
        hint: "It's named after John F. Canny.",
        filter: "invert(1) grayscale(1) contrast(5)"
    },
    {
        id: 7,
        title: "The Mirror Effect",
        type: "code",
        code: "cv2.flip(img, <input>)",
        question: "Enter '1' to flip the image horizontally (like a mirror).",
        answer: "1",
        explanation: "In OpenCV, flipCode 1 is horizontal.",
        hint: "The answer is 1.",
        transform: "scaleX(-1)"
    },
    {
        id: 8,
        title: "Shape of You",
        type: "mcq",
        question: "What function do we use to find the outer shapes of objects in a binary image?",
        options: ["findContours", "findShapes", "drawLines", "cropCircle"],
        answer: 0,
        explanation: "Contours are continuous lines that follow the boundary of an object.",
        hint: "It starts with 'find' and ends with 'tours'.",
        filter: "sepia(1) contrast(1.5)"
    },
    {
        id: 9,
        title: "Cropping the View",
        type: "code",
        code: "cropped = img[<input>]",
        question: "How do we select a region of pixels in Python? (Use: 0:100, 0:100)",
        answer: "0:100, 0:100",
        explanation: "We use array slicing [y_start:y_end, x_start:x_end] to crop images.",
        hint: "Use colon and comma.",
        filter: "none",
        clip: "inset(0 50% 50% 0)"
    },
    {
        id: 10,
        title: "HSV vs RGB",
        type: "tf",
        question: "HSV color space is often better than RGB for detecting specific colors.",
        answer: true,
        explanation: "HSV (Hue, Saturation, Value) separates 'Hue' from brightness.",
        hint: "Hue is the actual color.",
        filter: "hue-rotate(180deg)"
    },
    {
        id: 11,
        title: "Pixel Max",
        type: "mcq",
        question: "What is the maximum value a standard 8-bit pixel can have?",
        options: ["100", "255", "512", "1024"],
        answer: 1,
        explanation: "Pixels range from 0 (black) to 255 (white).",
        hint: "255.",
        filter: "brightness(2)"
    },
    {
        id: 12,
        title: "Dilation Effect",
        type: "drag",
        question: "Drag the operation that makes white areas 'grow' or get thicker.",
        items: ["Dilation", "Erosion", "Blur"],
        answer: "Dilation",
        explanation: "Dilation adds pixels to boundaries, while Erosion removes them.",
        hint: "Dilation.",
        filter: "blur(1px) contrast(2)"
    },
    {
        id: 13,
        title: "Drawing Borders",
        type: "code",
        code: "cv2.rectangle(img, (0,0), (50,50), <input>, 2)",
        question: "Enter a color tuple for RED (B, G, R).",
        answer: "(0, 0, 255)",
        explanation: "OpenCV uses BGR order, so Red is (0, 0, 255).",
        hint: "0, 0, 255.",
        filter: "drop-shadow(0 0 10px red)"
    },
    {
        id: 14,
        title: "Pattern Hunting",
        type: "mcq",
        question: "Which technique is used to find a small image within a larger one?",
        options: ["Template Matching", "Coloring", "Resizing", "Blurring"],
        answer: 0,
        explanation: "Template matching slides a 'template' across the image.",
        hint: "Template Matching.",
        filter: "saturate(5)"
    },
    {
        id: 15,
        title: "Face Detection",
        type: "tf",
        question: "Haar Cascades are a fast way to detect faces in real-time video.",
        answer: true,
        explanation: "Haar Cascades were the first fast way to find faces!",
        hint: "Yes, it is true.",
        filter: "brightness(1.2) contrast(1.2)"
    }
];

let progressData, currentLevel;
let score = 0;

function initLevel() {
    setTimeout(() => {
        progressData = getProgress();
        currentLevel = (progressData.levels.vision || 1) - 1;
        
        // Clamp to available levels
        if (currentLevel < 0) currentLevel = 0;
        if (currentLevel >= levels.length) currentLevel = levels.length - 1;

        const level = levels[currentLevel];
    document.getElementById('levelTitle').innerText = level.title;
    document.getElementById('levelNum').innerText = `Level ${level.id} / 15`;
    document.getElementById('question').innerText = level.question;
    
    // Update Progress Bar
    renderProgressBar();

    const challengeArea = document.getElementById('challengeArea');
    challengeArea.innerHTML = '';
    
    // Visuals: BEFORE stays clean, AFTER shows the target process
    const beforeImg = document.getElementById('beforeImage');
    const afterImg = document.getElementById('afterImage');
    
    beforeImg.style.filter = 'none';
    beforeImg.style.transform = 'none';
    beforeImg.style.clipPath = 'none';

    afterImg.style.filter = level.filter || 'none';
    afterImg.style.transform = level.transform || 'none';
    afterImg.style.clipPath = level.clip || 'none';

    // Game Mode Setup
    if (level.type === 'mcq') {
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        level.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.innerText = opt;
            btn.onclick = () => checkAnswer(idx);
            grid.appendChild(btn);
        });
        challengeArea.appendChild(grid);
    } else if (level.type === 'tf') {
        const grid = document.createElement('div');
        grid.className = 'options-grid';
        ['True', 'False'].forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'btn-option';
            btn.innerText = val;
            btn.onclick = () => checkAnswer(val === 'True');
            grid.appendChild(btn);
        });
        challengeArea.appendChild(grid);
    } else if (level.type === 'drag') {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.id = 'dropZone';
        dropZone.innerText = "Drop answer here...";
        
        const dragContainer = document.createElement('div');
        dragContainer.className = 'drag-container';
        
        level.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'drag-item';
            div.innerText = item;
            div.draggable = true;
            div.ondragstart = (e) => e.dataTransfer.setData('text', item);
            dragContainer.appendChild(div);
        });
        
        dropZone.ondragover = (e) => e.preventDefault();
        dropZone.ondrop = (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text');
            dropZone.innerText = data;
            setTimeout(() => checkAnswer(data), 500);
        };
        
        challengeArea.appendChild(dragContainer);
        challengeArea.appendChild(dropZone);
    } else if (level.type === 'code') {
        const snippet = document.createElement('div');
        snippet.className = 'code-snippet';
        snippet.innerHTML = level.code.replace('<input>', '<input type="text" id="codeInput" style="background: #0f172a; color: #10b981; border: 1px solid #334155; border-radius: 4px; padding: 2px 8px; font-family: monospace; width: 80px;">');
        
        const btn = document.createElement('button');
        btn.className = 'btn-option';
        btn.style.width = '100%';
        btn.style.marginTop = '1rem';
        btn.innerText = "Run Code 🚀";
        btn.onclick = () => checkAnswer(document.getElementById('codeInput').value.trim());
        
        challengeArea.appendChild(snippet);
        challengeArea.appendChild(btn);
    }
}

function renderProgressBar() {
    const container = document.getElementById('progressBar');
    container.innerHTML = '';
    
    levels.forEach((lvl, idx) => {
        const dot = document.createElement('div');
        dot.className = 'progress-dot';
        if (idx === currentLevel) dot.classList.add('active');
        if (idx + 1 < (progressData.levels.vision || 1)) dot.classList.add('completed');
        
        dot.onclick = () => {
            currentLevel = idx;
            initLevel();
        };
        
        container.appendChild(dot);
    });
}

function checkAnswer(val) {
    const level = levels[currentLevel];
    let isCorrect = val === level.answer;
    
    if (isCorrect) {
        showFeedback(true, level.explanation);
        score += 100;
        
        // Update Highest Level reached
        if (currentLevel + 2 > (progressData.levels.vision || 1)) {
            progressData.levels.vision = currentLevel + 2;
            saveProgress(progressData);
        }
    } else {
        showFeedback(false, "Not quite! " + level.hint);
    }
}

function showFeedback(success, text) {
    const modal = document.getElementById('feedbackModal');
    const content = modal.querySelector('.success-content');
    content.innerHTML = `
        <h2 style="color: ${success ? '#10b981' : '#ef4444'}">${success ? 'MISSION SUCCESS!' : 'CALIBRATION NEEDED'}</h2>
        <p>${text}</p>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; justify-content: center;">
            <button onclick="closeFeedback(${success})" style="background: var(--primary); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; cursor: pointer; font-weight: bold;">
                ${success ? 'Next Level ➔' : 'Try Again'}
            </button>
        </div>
    `;
    modal.style.display = 'flex';
}

function closeFeedback(success) {
    document.getElementById('feedbackModal').style.display = 'none';
    if (success) {
        currentLevel++;
        if (currentLevel < levels.length) {
            initLevel();
        } else {
            finishGame();
        }
    }
}

async function finishGame() {
    progressData.missions.vision = true;
    progressData.xp += score;
    if (!progressData.badges.includes("Vision Specialist")) {
        progressData.badges.push("Vision Specialist");
    }
    saveProgress(progressData);
    
    document.querySelector('.mission-card').innerHTML = `
        <div style="text-align: center;">
            <h1 style="font-size: 3rem; color: #10b981;">MISSION COMPLETE</h1>
            <p style="font-size: 1.2rem; margin-bottom: 2rem;">You are now a certified Computer Vision Specialist!</p>
            <div style="font-size: 5rem; margin-bottom: 2rem;">🖥️</div>
            <button onclick="location.href='dashboard.html'" style="background: var(--primary); color: white; border: none; padding: 1rem 2rem; border-radius: 12px; cursor: pointer; font-weight: bold;">Return to Dashboard</button>
        </div>
    `;
    
    await syncNow();
}

document.addEventListener('DOMContentLoaded', initLevel);
