// Game State
let state = {
    balance: 0,
    retailStores: 0,
    activeTab: 'vault',
    auctionCar: null,
    carDealership: null,
    hasDealerLicense: false,
    hasCasinoMembership: false,
    lifetimeEarnings: 0,
    totalClicks: 0,
    casinoProfitLoss: 0,
    rank: 'Novice Hustler',
    logs: [],
    portfolio: {},
    blackjack: { active: false, playerHand: [], dealerHand: [], status: '' }
};

// Timers
let timeSinceLastIncome = 0;
let timeSinceLastTax = 0;
let timeSinceLastMarketUpdate = 0;
let timeSinceLastDividend = 0;

// Persistence
function saveGame() {
    localStorage.setItem('businessEmpireState', JSON.stringify(state));

    if (window.ui && typeof window.ui.showSaveIndicator === 'function') {
        window.ui.showSaveIndicator();
    }
}

function loadGame() {
    const saved = localStorage.getItem('businessEmpireState');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            state = { ...state, ...parsed };
        } catch (e) {
            console.error("Failed to load save:", e);
        }
    }
}

function hardReset() {
    if (confirm("HARD RESET: Are you sure you want to wipe all progress?")) {
        localStorage.removeItem('businessEmpireState');
        location.reload();
    }
}

window.state = state;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.hardReset = hardReset;
