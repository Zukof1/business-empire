// Game State
let state = {
    balance: 0,
    retailStores: 0,
    businesses: [],
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

            // Migration: Count-based to Array of Objects
            if (state.businesses && !Array.isArray(state.businesses)) {
                let newBiz = [];
                if (state.retailStores > 0 && !state.businesses.retail) {
                    state.businesses.retail = state.retailStores;
                }
                for (const [id, count] of Object.entries(state.businesses)) {
                    const bData = window.BUSINESS_DATA ? window.BUSINESS_DATA.find(x => x.id === id) : null;
                    const baseIncome = bData ? bData.income : 0;
                    for (let i = 0; i < count; i++) {
                        newBiz.push({
                            id: id,
                            level: 1,
                            incomePerHour: baseIncome * 3600,
                            lastPayout: Date.now()
                        });
                    }
                }
                state.businesses = newBiz;
            } else if (!state.businesses) {
                state.businesses = [];
                if (state.retailStores > 0) {
                    const bData = window.BUSINESS_DATA ? window.BUSINESS_DATA.find(x => x.id === 'retail') : null;
                    const baseIncome = bData ? bData.income : 2;
                    for (let i = 0; i < state.retailStores; i++) {
                        state.businesses.push({
                            id: 'retail',
                            level: 1,
                            incomePerHour: baseIncome * 3600,
                            lastPayout: Date.now()
                        });
                    }
                }
            }
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
