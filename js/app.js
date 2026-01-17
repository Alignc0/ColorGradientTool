/**
 * Gradient Flow - Application Logic
 * Handles HTML5 Inputs, State Management, and CSS Generation
 */

// Utility: Convert HSL to Hex
const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
};

// Utility: Random Integer
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// State
const state = {
    c1: { h: 240, s: 70, l: 50 },
    c2: { h: 280, s: 80, l: 60 },
    deg: 135,
    type: 'linear' // 'linear' or 'radial'
};

// DOM Elements
const inputs = {
    h1: document.getElementById('h1'),
    s1: document.getElementById('s1'),
    l1: document.getElementById('l1'),
    h2: document.getElementById('h2'),
    s2: document.getElementById('s2'),
    l2: document.getElementById('l2'),
    deg: document.getElementById('deg'),
};

const display = {
    h1: document.getElementById('val-h1'),
    s1: document.getElementById('val-s1'),
    l1: document.getElementById('val-l1'),
    h2: document.getElementById('val-h2'),
    s2: document.getElementById('val-s2'),
    l2: document.getElementById('val-l2'),
    deg: document.getElementById('val-deg'),
    hex1: document.getElementById('color1-hex'),
    hex2: document.getElementById('color2-hex'),
    dot1: document.getElementById('color1-dot'),
    dot2: document.getElementById('color2-dot'),
    preview: document.getElementById('preview-box'),
    glow: document.getElementById('glow-bg'),
    output: document.getElementById('css-output'),
    copyBtn: document.getElementById('copy-btn'),
    randomBtn: document.getElementById('random-btn'),
    typeBtn: document.getElementById('type-btn'),
    presets: document.querySelectorAll('.preset-btn')
};

// Core Function: Update UI and State
function update() {
    // Read from inputs if triggered by user input
    // But we also sync inputs to state for presets/random

    // Generate Values
    const color1CSS = `hsl(${state.c1.h}, ${state.c1.s}%, ${state.c1.l}%)`;
    const color2CSS = `hsl(${state.c2.h}, ${state.c2.s}%, ${state.c2.l}%)`;

    let gradientCSS = '';
    if (state.type === 'linear') {
        gradientCSS = `linear-gradient(${state.deg}deg, ${color1CSS}, ${color2CSS})`;
        display.deg.parentElement.parentElement.classList.remove('hidden'); // Show Angle control
    } else {
        gradientCSS = `radial-gradient(circle, ${color1CSS}, ${color2CSS})`;
        display.deg.parentElement.parentElement.classList.add('hidden'); // Hide Angle control for Radial
    }

    const hex1 = hslToHex(state.c1.h, state.c1.s, state.c1.l);
    const hex2 = hslToHex(state.c2.h, state.c2.s, state.c2.l);

    // Apply to DOM
    display.preview.style.background = gradientCSS;
    display.glow.style.background = gradientCSS;

    // Update Text Labels
    display.h1.innerText = state.c1.h; display.s1.innerText = state.c1.s + '%'; display.l1.innerText = state.c1.l + '%';
    display.h2.innerText = state.c2.h; display.s2.innerText = state.c2.s + '%'; display.l2.innerText = state.c2.l + '%';
    display.deg.innerText = state.deg + '°';

    display.hex1.innerText = hex1.toUpperCase();
    display.hex2.innerText = hex2.toUpperCase();

    display.dot1.style.background = color1CSS;
    display.dot2.style.background = color2CSS;
    display.dot1.style.boxShadow = `0 0 10px ${color1CSS}`;
    display.dot2.style.boxShadow = `0 0 10px ${color2CSS}`;

    display.output.innerText = `background: ${gradientCSS};`;
    display.typeBtn.innerText = state.type === 'linear' ? 'Switch to Radial' : 'Switch to Linear';

    // Sync Inputs to State
    inputs.h1.value = state.c1.h;
    inputs.s1.value = state.c1.s;
    inputs.l1.value = state.c1.l;
    inputs.h2.value = state.c2.h;
    inputs.s2.value = state.c2.s;
    inputs.l2.value = state.c2.l;
    inputs.deg.value = state.deg;
}

// Event Listeners for Sliders
function handleInput(e) {
    const id = e.target.id;
    const val = parseInt(e.target.value);

    if (id === 'deg') state.deg = val;
    else if (id === 'h1') state.c1.h = val;
    else if (id === 's1') state.c1.s = val;
    else if (id === 'l1') state.c1.l = val;
    else if (id === 'h2') state.c2.h = val;
    else if (id === 's2') state.c2.s = val;
    else if (id === 'l2') state.c2.l = val;

    update();
}

Object.values(inputs).forEach(input => {
    input.addEventListener('input', handleInput);
});

// Logic: Randomizer
function randomize() {
    state.c1.h = randomInt(0, 360);
    state.c1.s = randomInt(40, 100); // Keep it colorful
    state.c1.l = randomInt(40, 70);

    // Make Color 2 complementary or analogous for better looking results
    state.c2.h = (state.c1.h + randomInt(30, 180)) % 360;
    state.c2.s = randomInt(40, 100);
    state.c2.l = randomInt(30, 80);

    state.deg = randomInt(0, 360);

    update();
}

display.randomBtn.addEventListener('click', randomize);

// Logic: Toggle Type
display.typeBtn.addEventListener('click', () => {
    state.type = state.type === 'linear' ? 'radial' : 'linear';
    update();
});

// Logic: Copy
display.copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(display.output.innerText).then(() => {
        const originalText = display.copyBtn.innerHTML;
        display.copyBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Copied!`;
        display.copyBtn.classList.add('bg-green-600', 'text-white');
        display.copyBtn.classList.remove('bg-gray-800');

        setTimeout(() => {
            display.copyBtn.innerHTML = originalText;
            display.copyBtn.classList.remove('bg-green-600', 'text-white');
            display.copyBtn.classList.add('bg-gray-800');
        }, 2000);
    });
});

// Logic: Presets
document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Parse data attributes
        const h1 = parseInt(btn.dataset.h1);
        const s1 = parseInt(btn.dataset.s1);
        const l1 = parseInt(btn.dataset.l1);
        const h2 = parseInt(btn.dataset.h2);
        const s2 = parseInt(btn.dataset.s2);
        const l2 = parseInt(btn.dataset.l2);
        const type = btn.dataset.type || 'linear';
        const deg = parseInt(btn.dataset.deg) || 135;

        state.c1 = { h: h1, s: s1, l: l1 };
        state.c2 = { h: h2, s: s2, l: l2 };
        state.type = type;
        state.deg = deg;

        update();
    });
});

// Initial Call
update();
