// 1. Selectors
const spinBtn = document.getElementById('spin-btn');
const categorySelect = document.getElementById('category-select');
const resultCard = document.getElementById('result-card');
const titleDisplay = document.getElementById('activity-title');
const diffDisplay = document.getElementById('activity-difficulty');
const costDisplay = document.getElementById('activity-cost');

let cachedData = null;
let isSpinning = false;

// 2. Data Initialization
async function initApp() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error("Data source not found");
        const data = await response.json();
        cachedData = data.categories;
        console.log("🚀 IdeaSpark Engine Online");
    } catch (error) {
        console.error("Initialization error:", error);
        showError("Offline Mode: Please check data.json");
    }
}

// 3. Logic: Picking the Suggestion
function getNewSuggestion() {
    if (!cachedData || isSpinning) return;

    const choice = categorySelect.value;
    let selectedActivities = [];

    if (choice === "all") {
        // Pick a random category first for better variety
        const categories = Object.keys(cachedData);
        const randomCat = categories[Math.floor(Math.random() * categories.length)];
        selectedActivities = cachedData[randomCat];
    } else {
        selectedActivities = cachedData[choice];
    }

    if (!selectedActivities || selectedActivities.length === 0) {
        showError("No data for this vibe yet.");
        return;
    }

    const suggestion = selectedActivities[Math.floor(Math.random() * selectedActivities.length)];
    runSpinAnimation(suggestion);
}

// 4. UI: Animation & Display
function runSpinAnimation(activity) {
    isSpinning = true;
    spinBtn.disabled = true;
    spinBtn.innerText = "Finding vibes...";
    
    // Reset and show card
    resultCard.classList.remove('hidden');
    resultCard.style.opacity = "0.6";
    titleDisplay.innerText = "ANALYZING...";
    
    // Visual "Shuffling" effect
    let counter = 0;
    const shuffleInterval = setInterval(() => {
        titleDisplay.innerText = ["SCANNING...", "INDEXING...", "LOCATING...", "MATCHING..."][counter % 4];
        counter++;
    }, 150);

    // Final Reveal
    setTimeout(() => {
        clearInterval(shuffleInterval);
        
        // Update Content
        titleDisplay.innerText = activity.title;
        diffDisplay.innerText = activity.difficulty;
        costDisplay.innerText = activity.cost;
        
        // Re-trigger CSS animation
        resultCard.style.opacity = "1";
        resultCard.style.animation = 'none';
        resultCard.offsetHeight; 
        resultCard.style.animation = null;

        // Reset Button
        spinBtn.disabled = false;
        spinBtn.innerText = "Suggest Something!";
        isSpinning = false;
    }, 800); 
}

function showError(msg) {
    resultCard.classList.remove('hidden');
    titleDisplay.innerText = msg;
    diffDisplay.innerText = "---";
    costDisplay.innerText = "---";
}

// 5. Listeners
spinBtn.addEventListener('click', getNewSuggestion);
initApp();