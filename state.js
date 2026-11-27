// Game State
let state = {
    balance: 0,
    retailStores: 0,
    businesses: [],
    activeTab: 'vault',
    auctionCar: null,
    carDealership: null,
    hasDealerLicense: false,
    lifetimeEarnings: 0,
    totalClicks: 0,
    rank: 'Novice Hustler',
    logs: [],
    portfolio: {}
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

// The whole game as text, with the share prices that live outside the state
function snapshot() {
    state.stockPrices = { ...window.stockPrices };
    state.stockTrails = { ...window.stockTrails };
    return JSON.stringify(state);
}

function saveGame() {
    if (savingDisabled) return;

    let saved = true;
    try {
        localStorage.setItem(SAVE_KEY, snapshot());
    } catch (e) {
        saved = false;
        console.error("Failed to save game:", e);
    }

    if (window.ui && typeof window.ui.showSaveIndicator === 'function') {
        window.ui.showSaveIndicator(saved);
    }
}

// Asks the browser not to throw the save away when the phone runs short of space
function protectStorage() {
    window.navigator?.storage?.persist?.().catch(() => {});
}

function startAutosave() {
    protectStorage();
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
                window.logic.returnCasinoMoney();
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

// ---- Backup codes ----

const BACKUP_PREFIX = 'BE1:';

function makeBackupCode() {
    // btoa only takes plain characters, so any others are written as JSON escapes
    const json = snapshot().replace(/[\u007f-\uffff]/g, c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'));
    return BACKUP_PREFIX + btoa(json);
}

// Takes a code apart. `problem` says in plain words why it was refused, or is null.
function inspectBackupCode(text) {
    const refuse = problem => ({ save: null, problem });
    const code = String(text ?? '').replace(/\s+/g, ''); // notes apps like to add line breaks
    const length = `${code.length.toLocaleString('en-US')} characters`;
    if (!code) return refuse('Nothing was pasted.');
    if (!code.startsWith(BACKUP_PREFIX)) {
        return refuse(`It doesn't start with ${BACKUP_PREFIX} but with "${code.slice(0, 8)}".`);
    }

    const body = code.slice(BACKUP_PREFIX.length);
    const stray = body.search(/[^A-Za-z0-9+/=]/);
    if (stray >= 0) {
        const number = body.charCodeAt(stray).toString(16).toUpperCase().padStart(4, '0');
        const position = BACKUP_PREFIX.length + stray + 1;
        return refuse(`It has a character that doesn't belong (U+${number} at position ${position} of ${code.length}).`);
    }

    // Saved text is drawn on screen, and a code can come from someone else, so no markup
    const markup = /[<>"`]/;
    let unsafeKey = null;
    let save;
    try {
        save = JSON.parse(atob(body), (key, value) => {
            if (markup.test(key) || (typeof value === 'string' && markup.test(value))) unsafeKey = key;
            return value;
        });
    } catch (e) {
        return refuse(`It looks cut off or changed: ${length}, ending "${code.slice(-6)}".`);
    }

    const isObject = value => !!value && typeof value === 'object' && !Array.isArray(value);
    if (!isObject(save)) return refuse('It reads fine but is not a game save.');
    const wrong = Object.entries({
        balance: Number.isFinite(save.balance), businesses: Array.isArray(save.businesses),
        logs: Array.isArray(save.logs), portfolio: isObject(save.portfolio)
    }).find(([, fine]) => !fine);
    if (wrong) return refuse(`It reads fine but is not a game save (problem with ${wrong[0]}).`);
    if (unsafeKey !== null) return refuse(`It contains text the game won't accept (in "${unsafeKey}").`);
    return { save, problem: null };
}

// The saved game inside a code, or null if it is not a whole, sensible code
function readBackupCode(text) {
    return inspectBackupCode(text).save;
}

// Puts a saved game in place of this one and restarts. False if the phone could not store it.
function restoreGame(save) {
    // The time since the backup was made earns nothing
    const now = Date.now();
    save.businesses.forEach(business => { business.lastPayout = now; });
    if (save.rentals) save.rentals.lastPayout = now;

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (e) {
        console.error("Failed to restore game:", e);
        return false;
    }
    savingDisabled = true; // otherwise the game on screen is saved over it as the page closes
    location.reload();
    return true;
}

window.state = state;
window.saveGame = saveGame;
window.makeBackupCode = makeBackupCode;
window.readBackupCode = readBackupCode;
window.inspectBackupCode = inspectBackupCode;
window.restoreGame = restoreGame;
window.startAutosave = startAutosave;
window.loadGame = loadGame;
window.hardReset = hardReset;
