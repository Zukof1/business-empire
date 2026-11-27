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
const SAVE_KEY = 'businessEmpireState';
const AUTOSAVE_MS = 5000;
let savingDisabled = false;

function saveGame() {
    if (savingDisabled) return;

    let saved = true;
    try {
        state.stockPrices = { ...window.stockPrices };
        state.stockTrails = { ...window.stockTrails };
        localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
        saved = false;
        console.error("Failed to save game:", e);
    }

    if (window.ui && typeof window.ui.showSaveIndicator === 'function') {
        window.ui.showSaveIndicator(saved);
    }
}

function startAutosave() {
    setInterval(saveGame, AUTOSAVE_MS);
    // Phones often kill a background tab without warning, so save as soon as it is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') saveGame();
    });
    window.addEventListener('pagehide', saveGame);
}

function loadGame() {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Update in place: window.state and `state` must stay the same object
            Object.assign(state, parsed);

            Object.keys(window.stockPrices || {}).forEach(id => {
                const price = state.stockPrices && state.stockPrices[id];
                if (!(price > 0)) return;
                window.stockPrices[id] = price;

                const saved = state.stockTrails && state.stockTrails[id];
                const trail = Array.isArray(saved) ? saved.filter(p => p > 0) : [];
                // Updated in place so the rest of the game keeps seeing the same lists
                window.stockTrails?.[id]?.splice(0, Infinity, ...(trail.length ? trail : [price]));
            });

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
            if (window.logic) {
                window.logic.refreshBusinessIncome();
                window.logic.refreshAuction();
                window.logic.settlePendingPayouts();
            }
        } catch (e) {
            console.error("Failed to load save:", e);
            // Keep a copy, because the next autosave will replace the original
            try {
                localStorage.setItem(SAVE_KEY + '.backup', saved);
            } catch (backupError) {
                console.error("Failed to back up save:", backupError);
            }
        }
    }
}

function hardReset() {
    window.logic.ask({
        title: 'Reset all progress?',
        message: 'This wipes everything, including your Lifestyle collection. It cannot be undone.',
        yes: 'Reset',
        danger: true
    }, () => {
        savingDisabled = true; // otherwise the save on page close restores everything
        localStorage.removeItem(SAVE_KEY);
        location.reload();
    });
}

window.state = state;
window.saveGame = saveGame;
window.startAutosave = startAutosave;
window.loadGame = loadGame;
window.hardReset = hardReset;
