const spinBtn = document.getElementById('spin-btn');
const chips = document.querySelectorAll('.chip');
const display = document.getElementById('result-display');
const title = document.getElementById('activity-title');
const diff = document.getElementById('activity-difficulty');
const cost = document.getElementById('activity-cost');

let data = null;
let vibe = 'all';

async function init() {
    const res = await fetch('data.json');
    const json = await res.json();
    data = json.categories;
}

chips.forEach(c => {
    c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'));
        c.classList.add('active');
        vibe = c.dataset.vibe;
    });
});

spinBtn.addEventListener('click', () => {
    if (!data) return;

    let items = vibe === 'all' ? Object.values(data).flat() : data[vibe];
    const item = items[Math.floor(Math.random() * items.length)];

    // UI Feedback Loop
    display.style.opacity = '0';
    
    setTimeout(() => {
        title.innerText = item.title;
        diff.innerText = item.difficulty;
        cost.innerText = item.cost;
        display.style.opacity = '1';
        
        // Add a "pop" effect
        display.classList.add('pop');
        setTimeout(() => display.classList.remove('pop'), 300);
    }, 200);
});

init();