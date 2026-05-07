// Scroll Reveal Animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

// Interactive Elements
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        // Add subtle hover sound or effect if needed
    });
});

// Live Sandbox Logic
const codeInput = document.getElementById('codeInput');
const previewMascot = document.getElementById('previewMascot');
const statusText = document.getElementById('statusText');

if (codeInput) {
    codeInput.addEventListener('input', (e) => {
        const code = e.target.value;
        
        // Extract CSS properties using regex
        const scaleMatch = code.match(/scale\(([^)]+)\)/);
        const rotateMatch = code.match(/rotate\(([^)]+)\)/);
        const brightnessMatch = code.match(/brightness\(([^)]+)\)/);

        let transformStr = "";
        if (scaleMatch) transformStr += `scale(${scaleMatch[1]}) `;
        if (rotateMatch) transformStr += `rotate(${rotateMatch[1]}) `;

        if (transformStr) {
            previewMascot.style.transform = transformStr;
            statusText.innerText = "System Status: Updating...";
            statusText.style.color = "var(--primary)";
        }

        if (brightnessMatch) {
            previewMascot.style.filter = `brightness(${brightnessMatch[1]})`;
        }

        // Reset status after a delay
        setTimeout(() => {
            statusText.innerText = "System Status: Stable";
            statusText.style.color = "var(--accent)";
        }, 1000);
    });
}
