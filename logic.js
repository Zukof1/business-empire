const BUSINESS_DATA = [
    // A shop has a ceiling: income grows by the same step each level up to maxLevel
    { id: 'retail', name: 'Retail Shop', icon: '🏪', baseCost: 100, costMult: 1.15, income: 2, maxOwn: 3, maxLevel: 10, upgradeStep: 100 },
    // Hidden until each is rebuilt with its own gameplay. Ones already owned keep working.
    { id: 'startup', name: 'Tech Startup', icon: '💻', baseCost: 2500, costMult: 1.15, income: 60, maxOwn: 2, hidden: true },
    { id: 'estate', name: 'Real Estate Firm', icon: '🏢', baseCost: 50000, costMult: 1.15, income: 1500, maxOwn: 2, hidden: true },
    { id: 'corp', name: 'Mega Corporation', icon: '🌐', baseCost: 1000000, costMult: 1.15, income: 40000, maxOwn: 1, hidden: true }
];

const TAXI_OPEN_COST = 10000;
const TAXI_CARS = [
    { id: 'hatchback', name: 'Cheap hatchback', label: 'Cheap', price: 4000, perSecond: 15, maxKm: 100000, breakChance: 0.20, breakdowns: 'Often' },
    { id: 'sedan', name: 'Reliable sedan', label: 'Reliable', price: 20000, perSecond: 40, maxKm: 300000, breakChance: 0.05, breakdowns: 'Rare' },
    { id: 'luxury', name: 'Luxury saloon', label: 'Luxury', price: 80000, perSecond: 200, maxKm: 150000, breakChance: 0.10, breakdowns: 'Sometimes, costly' }
];
const TAXI_KM_PER_MS = 12500 / 60000;
const TAXI_REPAIR_RATE = 0.10;
const TAXI_SELL_RATE = 0.5;
const TAXI_START_SPACES = 3;
const TAXI_MAX_SPACES = 6;
const TAXI_SPACE_COST = 25000;
const DISPATCHER_COST = 25000;

const RENTAL_OPEN_COST = 150000;
const HOME_TYPES = [
    // repair is the price of fixing a completely wrecked home
    { id: 'studio', name: 'Studio flat', short: 'Studio', price: 40000, rent: 60, repair: 4000, repairs: 'Cheap' },
    { id: 'house', name: 'Family house', short: 'House', price: 150000, rent: 250, repair: 22500, repairs: 'Medium' },
    { id: 'villa', name: 'Villa', short: 'Villa', price: 600000, rent: 1100, repair: 120000, repairs: 'Costly' }
];
// wear is condition points a minute; a tenant who stays twice as long has stay 2
const TENANT_TYPES = [
    { id: 'careful', label: 'Careful', pay: 0.85, wear: 2, stay: 2, lateChance: 0, note: 'Half the wear, stays twice as long' },
    { id: 'average', label: 'Average', pay: 1, wear: 4, stay: 1, lateChance: 0, note: 'No surprises' },
    { id: 'late', label: 'Rich but late', pay: 1.3, wear: 4, stay: 1, lateChance: 0.2, note: 'Pays nothing 1 minute in 5' },
    { id: 'rough', label: 'Rough', pay: 1.4, wear: 10, stay: 1, lateChance: 0, note: 'Wears the home fast' }
];
const RENT_LEVELS = [
    { id: 'low', label: 'Low', pay: 0.8, leaveChance: 0.03, waitMs: 30000 },
    { id: 'fair', label: 'Fair', pay: 1, leaveChance: 0.08, waitMs: 60000 },
    { id: 'high', label: 'High', pay: 1.25, leaveChance: 0.20, waitMs: 90000 }
];
const TENANT_NAMES = ['Alex', 'Sam', 'Jordan', 'Priya', 'Maria', 'Chen', 'Omar', 'Lucy', 'Diego', 'Aisha', 'Noah', 'Yuki'];
const APPLICANT_COUNT = 3;
const MAX_HOMES = 4;
const AGENT_COST = 100000;
const HOME_SELL_FEE = 0.10;
const RENT_LOST_PER_DAMAGE = 0.005; // for each point of condition below 100
const HOME_MARKET_MS = 60000;
const HOME_MARKET_STEP = 5;
const HOME_MARKET_MIN = 80;
const HOME_MARKET_MAX = 125;

const RESTORE_TIME_MS = 30000;
const REPAIR_TIME_EXTENSION_MS = 15000;
const LICENSE_COST = 2500;
const TAX_RATE = 0.005; // 0.5%
const TAX_INTERVAL_MS = 60000;

const AWAY_GRACE_MS = 60 * 1000;
const AWAY_CAP_MS = 2 * 60 * 60 * 1000;
const AWAY_RATE = 0.25;
// Longest step the tax, dividend and market timers take in one frame, so time away is not replayed
const MAX_FRAME_MS = 1000;

const SLOT_SEVENS_PAYOUT = 30;
const SLOT_TRIPLE_PAYOUT = 10;
const ROULETTE_GREEN_PAYOUT = 14;

const PRESTIGE_EARNINGS = 1000000;

// Things to spend money on for fun. They earn nothing.
const LIFESTYLE_ITEMS = [
    { id: 'wardrobe', name: 'Designer wardrobe', type: 'Style', price: 5000, icon: 'shirt' },
    { id: 'watch', name: 'Luxury watch', type: 'Style', price: 25000, icon: 'watch' },
    { id: 'diamond-watch', name: 'Diamond watch', type: 'Style', price: 250000, icon: 'gem' },
    { id: 'apartment', name: 'City apartment', type: 'Homes', price: 100000, icon: 'building' },
    { id: 'beach-house', name: 'Beach house', type: 'Homes', price: 750000, icon: 'sun' },
    { id: 'mansion', name: 'Mansion', type: 'Homes', price: 5000000, icon: 'home' },
    { id: 'sports-car', name: 'Sports car', type: 'Toys', price: 50000, icon: 'car' },
    { id: 'yacht', name: 'Yacht', type: 'Toys', price: 2000000, icon: 'boat' },
    { id: 'jet', name: 'Private jet', type: 'Toys', price: 50000000, icon: 'plane' },
    { id: 'getaway', name: 'Weekend getaway', type: 'Experiences', price: 10000, icon: 'sun', repeatable: true },
    { id: 'party', name: 'Huge party', type: 'Experiences', price: 100000, icon: 'party', repeatable: true },
    { id: 'world-tour', name: 'World tour', type: 'Experiences', price: 1000000, icon: 'globe', repeatable: true }
];
const LIFESTYLE_LEVELS = [
    { from: 0, name: 'Getting by' },
    { from: 10000, name: 'Comfortable' },
    { from: 100000, name: 'Well off' },
    { from: 1000000, name: 'Luxury living' },
    { from: 10000000, name: 'High society' },
    { from: 50000000, name: 'Living legend' }
];

const MANAGER_COST_MULT = 10;
const MILESTONE_LEVELS = [5, 10, 15, 20]; // income doubles at each

const CAR_TIERS = [
    { id: 'common', label: 'Common', chance: 0.70, min: 500, max: 1200, markup: 0.30, fault: 0.15,
      models: [['2018 Sedan', '🚗'], ['2012 Hatchback', '🚙'], ['2005 Truck', '🛻'], ['2020 SUV', '🚙']] },
    { id: 'rare', label: 'Rare', chance: 0.25, min: 3000, max: 8000, markup: 0.45, fault: 0.25,
      models: [['1994 Coupe', '🚘'], ['2015 Sports Car', '🏎️']] },
    { id: 'classic', label: 'Classic', chance: 0.05, min: 20000, max: 50000, markup: 0.70, fault: 0.35,
      models: [['1967 Fastback', '🏎️'], ['1955 Roadster', '🚘']] }
];
const INSPECT_RATE = 0.05;
const HAGGLE_DISCOUNT = 0.10;
const HAGGLE_CHANCE = 0.5;
const REPAIR_RATE = 0.20;
const DEMAND_MIN = 0.8;
const DEMAND_MAX = 1.3;
const DEMAND_INTERVAL_MS = 60000;
const AUCTION_COOLDOWN_MS = 30000;

const MARKET_UPDATE_MS = 5000;
const DIVIDEND_INTERVAL_MS = 120000;

const MARKET_DATA = [
    { id: 'GOL', name: 'Goldman Trust', basePrice: 100, minVol: -0.02, maxVol: 0.02 },
    { id: 'TEC', name: 'Cyberdyne Sys', basePrice: 150, minVol: -0.05, maxVol: 0.05 },
    { id: 'VOL', name: 'Volatile X', basePrice: 50, minVol: -0.15, maxVol: 0.15 },
    { id: 'EXE', name: 'Exertion Tech', basePrice: 75, minVol: -0.12, maxVol: 0.12 },
    { id: 'WAN', name: 'Wander Elec', basePrice: 120, minVol: -0.05, maxVol: 0.05 },
    { id: 'CAN', name: 'Cansed Motors', basePrice: 90, minVol: -0.03, maxVol: 0.03 },
    { id: '4XS', name: '4X Streaming', basePrice: 110, minVol: -0.04, maxVol: 0.04 },
    { id: 'FLN', name: 'Fellas Banking', basePrice: 40, minVol: -0.17, maxVol: 0.17 },
    { id: 'HBS', name: 'Hakke Building Sys', basePrice: 80, minVol: -0.04, maxVol: 0.04 }
];

let stockPrices = {};
let stockHistory = {};
let stockTrails = {}; // recent prices, for the charts
const PRICE_TRAIL_LENGTH = 24;

const RANKS = [
    { from: 0, name: 'Novice Hustler' },
    { from: 10000, name: 'Local Operator' },
    { from: 50000, name: 'Regional Manager' },
    { from: 250000, name: 'Elite Investor' },
    { from: 1000000, name: 'Billionaire Tycoon' }
];
window.stockMultiplier = '1'; // '1' or 'max'
MARKET_DATA.forEach(s => {
    stockPrices[s.id] = s.basePrice;
    stockHistory[s.id] = 0;
    stockTrails[s.id] = [s.basePrice];
});


// Core Logic Setup
const logic = {
    // Asks in the game's own box; the action runs only if the player agrees.
    // Some in-app browsers silently refuse the built-in pop-up, so it is only a fallback.
    ask(options, action) {
        if (window.ui) window.ui.ask(options, action);
        else if (confirm(options.message)) action();
    },

    // Formatted amount including its dollar sign
    money(amount) {
        return window.ui ? window.ui.formatMoney(amount) : '$' + amount.toFixed(2);
    },

    getPrestigeMultiplier() {
        const count = window.state.prestigeCount || 0;
        return 1 + (count * 0.10); // +10% per prestige
    },

    getPrestigeRemaining() {
        return Math.max(0, PRESTIGE_EARNINGS - (window.state.lifetimeEarnings || 0));
    },

    getClickValue() {
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        const retailCount = businesses.filter(b => b.id === 'retail').length || window.state.retailStores || 0;
        const totalBiz = businesses.length || window.state.retailStores || 0;

        const base = Math.floor(retailCount / 10) + Math.floor(totalBiz / 5) + 1;
        return base * this.getPrestigeMultiplier();
    },

    getBusinessCost(id) {
        const b = BUSINESS_DATA.find(x => x.id === id);
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        let count = businesses.filter(biz => biz.id === id).length;

        // Handle legacy retail stores if they exist but haven't been migrated to the businesses object yet
        if (id === 'retail' && count === 0 && window.state.retailStores > 0) {
            count = window.state.retailStores;
        }

        return b.baseCost * Math.pow(b.costMult, count);
    },

    getBusinessUpgradeCost(businessObj) {
        const bData = BUSINESS_DATA.find(x => x.id === businessObj.id);
        if (bData.upgradeStep) return bData.upgradeStep * (businessObj.level || 1);
        const baseUpgrade = bData.baseCost * 0.5;
        return baseUpgrade * Math.pow(1.8, (businessObj.level || 1) - 1);
    },

    isMaxLevel(businessObj) {
        const bData = BUSINESS_DATA.find(x => x.id === businessObj.id);
        return !!bData.maxLevel && (businessObj.level || 1) >= bData.maxLevel;
    },

    getBusinessIncome(businessObj) {
        const bData = BUSINESS_DATA.find(x => x.id === businessObj.id);
        const level = businessObj.level || 1;
        if (bData.maxLevel) return bData.income * Math.min(level, bData.maxLevel) * 3600;
        return (bData.income * 3600) * Math.pow(1.6, level - 1) * this.getMilestone(level).multiplier;
    },

    getMilestone(level) {
        const reached = MILESTONE_LEVELS.filter(l => level >= l);
        const next = MILESTONE_LEVELS.find(l => level < l) || null;
        const from = reached.length ? reached[reached.length - 1] : 1;
        return {
            multiplier: Math.pow(2, reached.length),
            next,
            progress: next ? (level - from) / (next - from) : 1
        };
    },

    // Saved income figures can be out of date when the rules change
    refreshBusinessIncome() {
        if (!Array.isArray(window.state.businesses)) return;
        window.state.businesses.forEach(b => {
            const bData = BUSINESS_DATA.find(x => x.id === b.id);
            if (!bData) return;
            if (bData.maxLevel) b.level = Math.min(b.level || 1, bData.maxLevel);
            b.incomePerHour = this.getBusinessIncome(b);
        });
    },

    hasManager(id) {
        return !!(window.state.managers && window.state.managers[id]);
    },

    getManagerCost(id) {
        return BUSINESS_DATA.find(x => x.id === id).baseCost * MANAGER_COST_MULT;
    },

    buyManager(id) {
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        if (this.hasManager(id) || !businesses.some(b => b.id === id)) return;

        const cost = this.getManagerCost(id);
        if (window.state.balance < cost) return;

        window.state.balance -= cost;
        window.state.managers = { ...window.state.managers, [id]: true };
        const bData = BUSINESS_DATA.find(x => x.id === id);
        this.logEvent(`Hired a manager for ${bData.name}`, "text-amber-400");
        this.collectIncome(id);

        if (window.ui) {
            window.ui.renderBusinesses();
            window.ui.updateUI();
        }
    },

    upgradeBusiness(index) {
        if (!Array.isArray(window.state.businesses)) return;
        const b = window.state.businesses[index];
        if (!b || this.isMaxLevel(b)) return;

        const cost = this.getBusinessUpgradeCost(b);
        if (window.state.balance >= cost) {
            window.state.balance -= cost;
            b.level = (b.level || 1) + 1;
            b.incomePerHour = this.getBusinessIncome(b);
            
            const bData = BUSINESS_DATA.find(x => x.id === b.id);
            this.logEvent(`Upgraded ${bData.name} to Level ${b.level}`, "text-amber-400");
            
            if (window.ui) {
                window.ui.renderBusinesses();
                window.ui.updateUI();
            }
        } else {
            if (window.ui) window.ui.showToast(`Not enough funds. Need ${this.money(cost - window.state.balance)} more.`);
        }
    },

    collectIncomeByIndex(index) {
        if (!Array.isArray(window.state.businesses)) return;
        const b = window.state.businesses[index];
        if (b && (b.accumulated || 0) > 0) {
            const amount = b.accumulated;
            b.accumulated = 0;
            this.addMoney(amount);
            
            const bData = BUSINESS_DATA.find(x => x.id === b.id);
            this.logEvent(`Collected ${this.money(amount)} from ${bData.name} Lvl ${b.level || 1}`, "text-emerald-400");
            
            if (window.ui) {
                window.ui.triggerBalancePulse('green');
                window.ui.updateUI();
            }
        }
    },

    getPassiveIncome() {
        let income = 0;
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        
        businesses.forEach(b => {
            if (b.incomePerHour) {
                income += (b.incomePerHour / 3600);
            }
        });

        if (businesses.length === 0 && window.state.retailStores > 0) {
            const retailData = BUSINESS_DATA.find(x => x.id === 'retail');
            income += window.state.retailStores * retailData.income;
        }

        return income * this.getPrestigeMultiplier() + this.getTaxiRate() + this.getRentRate();
    },

    processBusinessIncome(now = Date.now()) {
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        const prestigeMulti = this.getPrestigeMultiplier();
        let awayEarned = 0;
        let longestGap = 0;
        let managedEarned = 0;

        businesses.forEach(b => {
            if (!b.incomePerHour || !b.lastPayout) {
                if (!b.lastPayout) b.lastPayout = now;
                return;
            }
            const gap = now - b.lastPayout;
            b.lastPayout = now; // also recovers from a clock that was moved backwards
            if (gap <= 0) return;

            const perMs = (b.incomePerHour / 3600 / 1000) * prestigeMulti;
            if (gap <= AWAY_GRACE_MS) {
                if (this.hasManager(b.id)) managedEarned += perMs * gap;
                else b.accumulated = (b.accumulated || 0) + perMs * gap;
            } else {
                // Away: a short interruption is paid in full, the rest at a reduced rate up to a limit
                const reducedMs = Math.min(gap, AWAY_CAP_MS) - AWAY_GRACE_MS;
                awayEarned += perMs * (AWAY_GRACE_MS + reducedMs * AWAY_RATE);
                longestGap = Math.max(longestGap, gap);
            }
        });

        // Rent follows the same clock, so one welcome back total covers everything
        const rent = this.settleRent(now);
        managedEarned += rent.managed;
        awayEarned += rent.away;
        longestGap = Math.max(longestGap, rent.gap);

        // Added quietly: this runs every frame, so no glow or log
        if (managedEarned > 0) {
            window.state.balance += managedEarned;
            window.state.lifetimeEarnings += managedEarned;
            this.updateRank();
        }

        if (awayEarned > 0) {
            const waiting = window.state.away || { amount: 0, ms: 0 };
            window.state.away = { amount: waiting.amount + awayEarned, ms: waiting.ms + longestGap };
        }
    },

    collectAway() {
        const away = window.state.away;
        if (!away) return;
        window.state.away = null;
        this.addMoney(away.amount);
        this.logEvent(`Collected ${this.money(away.amount)} earned while away`, "text-emerald-400");
        if (window.ui) {
            window.ui.triggerBalancePulse('green');
            window.ui.updateUI();
        }
        window.saveGame();
    },

    collectIncome(id) {
        if (!Array.isArray(window.state.businesses)) return;
        let totalCollected = 0;
        window.state.businesses.forEach(b => {
            if (b.id === id && b.accumulated > 0) {
                totalCollected += b.accumulated;
                b.accumulated = 0;
            }
        });

        if (totalCollected > 0) {
            this.addMoney(totalCollected);
            const bData = BUSINESS_DATA.find(x => x.id === id);
            const name = bData ? bData.name : 'Business';
            this.logEvent(`Collected ${this.money(totalCollected)} from ${name}`, "text-emerald-400");
            if (window.ui) {
                window.ui.triggerBalancePulse('green');
                window.ui.updateUI();
            }
        }
    },

    collectAllIncome() {
        this.collectFares();
        this.collectRent();
        if (!Array.isArray(window.state.businesses)) return;
        let totalCollected = 0;
        window.state.businesses.forEach(b => {
            if (b.accumulated > 0) {
                totalCollected += b.accumulated;
                b.accumulated = 0;
            }
        });

        if (totalCollected > 0) {
            this.addMoney(totalCollected);
            this.logEvent(`Collected ${this.money(totalCollected)} from All Portfolios`, "text-emerald-400");
            if (window.ui) {
                window.ui.triggerBalancePulse('green');
                window.ui.updateUI();
            }
        }
    },

    getPortfolioValue() {
        let total = 0;
        if (!window.state.portfolio) return 0;
        for (const [sym, data] of Object.entries(window.state.portfolio)) {
            total += data.shares * (stockPrices[sym] || 0);
        }
        return total;
    },

    logEvent(msg, colorClass) {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
        window.state.logs.unshift({ msg, colorClass, time });
        if (window.state.logs.length > 3) window.state.logs.pop();
        if (window.ui && window.ui.renderLogs) window.ui.renderLogs();
    },

    updateMarketPrices() {
        MARKET_DATA.forEach(s => {
            const range = s.maxVol - s.minVol;
            const change = Math.random() * range + s.minVol;
            const oldPrice = stockPrices[s.id];
            stockPrices[s.id] = Math.max(1, oldPrice * (1 + change));

            if (stockPrices[s.id] > oldPrice) stockHistory[s.id] = 1;
            else if (stockPrices[s.id] < oldPrice) stockHistory[s.id] = -1;
            else stockHistory[s.id] = 0;

            const trail = stockTrails[s.id];
            trail.push(stockPrices[s.id]);
            if (trail.length > PRICE_TRAIL_LENGTH) trail.splice(0, trail.length - PRICE_TRAIL_LENGTH);
        });
    },

    getPriceChange(id) {
        const trail = stockTrails[id];
        if (!trail || trail.length < 2) return 0;
        const [before, now] = trail.slice(-2);
        return (now - before) / before * 100;
    },

    buyStock(sym, amount = 1) {
        const price = stockPrices[sym];
        let buyAmount = amount;

        if (amount === 'max') {
            buyAmount = Math.floor(window.state.balance / price);
            if (buyAmount <= 0) return;
        }

        const cost = price * buyAmount;

        if (window.state.balance >= cost) {
            window.state.balance -= cost;
            if (!window.state.portfolio[sym]) {
                window.state.portfolio[sym] = { shares: 0, totalSpent: 0 };
            }
            window.state.portfolio[sym].shares += buyAmount;
            window.state.portfolio[sym].totalSpent += cost;

            if (window.ui && window.ui.triggerBalancePulse) window.ui.triggerBalancePulse('red');
            if (window.ui && window.ui.renderMarket) window.ui.renderMarket();
            if (window.ui && window.ui.updateUI) window.ui.updateUI();
        }
    },

    sellStock(sym, amount = 1) {
        if (!window.state.portfolio[sym] || window.state.portfolio[sym].shares <= 0) return;

        const price = stockPrices[sym];
        const port = window.state.portfolio[sym];

        let sellAmount = amount;
        if (amount === 'max') {
            sellAmount = port.shares;
        }

        if (sellAmount > port.shares) sellAmount = port.shares;

        const returns = price * sellAmount;

        // Add money to balance
        window.state.balance += returns;

        // Calculate average price before selling to correctly adjust totalSpent
        const avgPrice = port.totalSpent / port.shares;

        // Decrement shares
        port.shares -= sellAmount;
        port.totalSpent -= (avgPrice * sellAmount); // Reduce totalSpent proportionally

        // Clean up empty portfolios
        if (port.shares <= 0) {
            delete window.state.portfolio[sym];
        }

        if (window.ui && window.ui.triggerBalancePulse) window.ui.triggerBalancePulse('green');
        if (window.ui && window.ui.renderMarket) window.ui.renderMarket();
        if (window.ui && window.ui.updateUI) window.ui.updateUI();
    },

    doWork(e) {
        const yieldVal = this.getClickValue();
        this.addMoney(yieldVal);
        window.state.totalClicks++;

        if (window.ui) {
            window.ui.triggerBalancePulse('green');
            window.ui.updateUI();
            window.ui.createParticle(e, `+$${yieldVal.toFixed(2)}`);
            if (window.threeEffects && window.threeEffects.triggerClickPulse) {
                window.threeEffects.triggerClickPulse(e.clientX, e.clientY);
            }
        }
    },

    addMoney(amount) {
        window.state.balance += amount;
        window.state.lifetimeEarnings += amount;
        this.updateRank();
        
        if (window.threeEffects && window.threeEffects.triggerBalanceGlow) {
            window.threeEffects.triggerBalanceGlow();
        }
    },

    toggleStockMultiplier() {
        if (window.stockMultiplier === '1') window.stockMultiplier = 'max';
        else window.stockMultiplier = '1';
        if (window.ui) window.ui.renderMarket();
    },

    updateRank() {
        const earned = window.state.lifetimeEarnings;
        window.state.rank = RANKS.filter(r => earned >= r.from).pop().name;
    },

    getRankProgress() {
        const earned = window.state.lifetimeEarnings || 0;
        const current = RANKS.filter(r => earned >= r.from).pop();
        const next = RANKS.find(r => r.from > earned);
        if (!next) return { next: null, remaining: 0, progress: 1 };
        return {
            next: next.name,
            remaining: next.from - earned,
            progress: (earned - current.from) / (next.from - current.from)
        };
    },

    prestige() {
        if (this.getPrestigeRemaining() > 0) return;
        this.ask({
            title: 'Prestige?',
            message: 'You lose your money, businesses, managers, taxis, rental homes, stocks, cars, dealer license and casino pass. '
                + 'Your Lifestyle collection stays, and you get an extra permanent +10% income bonus.',
            yes: 'Prestige',
            danger: true
        }, () => {
            if (this.getPrestigeRemaining() > 0) return;
            window.state.prestigeCount = (window.state.prestigeCount || 0) + 1;
            window.state.balance = 0;
            window.state.businesses = [];
            window.state.retailStores = 0;
            window.state.portfolio = {};
            window.state.dealerCars = [];
            window.state.carDealership = null;
            window.state.hasDealerLicense = false;
            window.state.hasCasinoMembership = false;
            window.state.lifetimeEarnings = 0;
            window.state.totalClicks = 0;
            window.state.casinoProfitLoss = 0;
            window.state.pendingPayout = 0;
            window.state.blackjack = { active: false, playerHand: [], dealerHand: [], status: 'Ready to play', bet: 0 };
            window.state.rouletteHistory = [];
            window.state.away = null;
            window.state.managers = {};
            window.state.taxi = null;
            window.state.rentals = null;
            window.state.auctionCars = [];
            window.state.nextAuctionAt = 0;
            window.state.garageSlots = 1;
            window.state.rank = 'Novice Hustler';

            this.logEvent(`Prestiged to Level ${window.state.prestigeCount}!`, "text-amber-400");
            window.saveGame();
            location.reload();
        });
    },

    buyBusiness(id) {
        try {
            if (!Array.isArray(window.state.businesses)) window.state.businesses = [];

            const b = BUSINESS_DATA.find(x => x.id === id);
            if (b.hidden) return;
            let count = window.state.businesses.filter(biz => biz.id === id).length;

            if (b.maxOwn && count >= b.maxOwn) {
                if (window.ui) window.ui.showToast(`Maximum ${b.name} limit reached.`);
                return;
            }

            const cost = this.getBusinessCost(id);
            if (window.state.balance >= cost) {
                window.state.balance -= cost;
                
                const b = BUSINESS_DATA.find(x => x.id === id);
                
                window.state.businesses.push({
                    id: id,
                    level: 1,
                    incomePerHour: b.income * 3600,
                    lastPayout: Date.now()
                });

                // Sync legacy
                if (id === 'retail') window.state.retailStores = window.state.businesses.filter(biz => biz.id === 'retail').length;

                this.logEvent(`Acquired ${b.name} for ${this.money(cost)}`, "text-amber-400");

                if (window.ui) {
                    window.ui.renderBusinesses();
                    window.ui.updateUI();
                }
            } else {
                if (window.ui) window.ui.showToast(`Not enough funds. Need ${this.money(cost - window.state.balance)} more.`);
            }
        } catch (e) {
            if (window.ui) window.ui.showToast('Error: ' + e.message);
            console.error("buyBusiness error:", e);
        }
    },

    getLicenseCost() {
        return LICENSE_COST;
    },

    buyLicense() {
        if (!window.state.hasDealerLicense && window.state.balance >= LICENSE_COST) {
            window.state.balance -= LICENSE_COST;
            window.state.hasDealerLicense = true;
            this.logEvent(`Purchased Dealer License ($2,500)`, "text-amber-400");
            if (window.ui) {
                window.ui.updateUI();
                window.ui.showBusiness('dealer');
            }
        }
    },

    buyCasinoMembership() {
        if (window.state.balance >= 10000 && !window.state.hasCasinoMembership) {
            window.state.balance -= 10000;
            window.state.hasCasinoMembership = true;
            this.logEvent(`Purchased High Roller Membership ($10,000)`, "text-fuchsia-400");
            if (window.ui) {
                window.ui.updateUI();
                window.ui.switchTab('casino');
            }
        }
    },

    // Winnings are decided before the animation ends. They are held in the save
    // until then, so closing the game mid-spin does not lose them.
    holdPayout(amount) {
        window.state.pendingPayout = (window.state.pendingPayout || 0) + amount;
    },

    releasePayout(amount) {
        window.state.pendingPayout = Math.max(0, (window.state.pendingPayout || 0) - amount);
        this.addMoney(amount);
        window.state.casinoProfitLoss += amount;
    },

    settlePendingPayouts() {
        if (window.state.pendingPayout > 0) this.releasePayout(window.state.pendingPayout);
    },

    // Which games are mid-animation. Not saved: a reload ends any spin.
    spinning: { slots: false, roulette: false },

    spinSlots(bet = 100) {
        if (!this.spinning.slots && window.state.balance >= bet && bet >= 10) {
            this.spinning.slots = true;
            window.state.balance -= bet;
            window.state.casinoProfitLoss -= bet;
            const symbols = ['🎰', '💎', '🍒', '7️⃣'];
            const r1 = symbols[Math.floor(Math.random() * symbols.length)];
            const r2 = symbols[Math.floor(Math.random() * symbols.length)];
            const r3 = symbols[Math.floor(Math.random() * symbols.length)];

            let winText = "No luck.";
            let color = "text-slate-400";

            let payout = 0;
            let logMsg = '';
            let logColor = '';

            if (r1 === r2 && r2 === r3) {
                if (r1 === '7️⃣') {
                    payout = bet * SLOT_SEVENS_PAYOUT;
                    winText = `JACKPOT! +$${payout.toLocaleString()}`;
                    color = "text-fuchsia-400";
                    logMsg = `Casino Jackpot! +$${payout.toLocaleString()}`;
                    logColor = "text-fuchsia-400";
                } else {
                    payout = bet * SLOT_TRIPLE_PAYOUT;
                    winText = `WINNER! +$${payout.toLocaleString()}`;
                    color = "text-emerald-400";
                    logMsg = `Casino slots win! +$${payout.toLocaleString()}`;
                    logColor = "text-emerald-400";
                }
            }

            this.holdPayout(payout);

            if (window.ui) {
                window.ui.renderSlotsResult(r1, r2, r3, winText, color);
                window.ui.updateUI();
            }

            setTimeout(() => {
                this.spinning.slots = false;
                if (payout > 0) {
                    this.releasePayout(payout);
                    this.logEvent(logMsg, logColor);
                    if (window.ui) window.ui.triggerBalancePulse('green');
                } else {
                    if (window.ui) window.ui.triggerBalancePulse('red');
                }
                if (window.ui) window.ui.updateUI();
            }, 3500);
        }
    },

    playRoulette(color, bet = 500) {
        if (!this.spinning.roulette && window.state.balance >= bet && bet >= 10) {
            this.spinning.roulette = true;
            window.state.balance -= bet;
            window.state.casinoProfitLoss -= bet;

            const pattern = ['R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'R', 'B', 'G'];
            const resultIdx = Math.floor(Math.random() * pattern.length);
            const resultColorCode = pattern[resultIdx];
            let resultColorName = resultColorCode === 'R' ? 'Red' : (resultColorCode === 'B' ? 'Black' : 'Green');

            const win = color === resultColorName;

            let msg = '';
            let tColor = '';

            let payout = 0;
            let logMsg = '';
            let logColor = '';

            if (win) {
                payout = color === 'Green' ? bet * ROULETTE_GREEN_PAYOUT : bet * 2;
                msg = `Won! +$${(payout - bet).toLocaleString()} (${color})`;
                tColor = "text-emerald-400";
                logMsg = `Roulette Win: +$${payout.toLocaleString()}`;
                logColor = "text-emerald-400";
            } else {
                msg = `Lost $${bet.toLocaleString()} (${resultColorName})`;
                tColor = "text-red-400";
                logMsg = `Roulette Loss: -$${bet.toLocaleString()}`;
                logColor = "text-red-400";
            }

            this.holdPayout(payout);

            if (window.ui) {
                window.ui.renderRouletteResult(msg, tColor, resultColorName);
                window.ui.updateUI();
            }

            setTimeout(() => {
                this.spinning.roulette = false;
                if (payout > 0) {
                    this.releasePayout(payout);
                    this.logEvent(logMsg, logColor);
                    if (window.ui) window.ui.triggerBalancePulse('green');
                } else {
                    this.logEvent(logMsg, logColor);
                    if (window.ui) window.ui.triggerBalancePulse('red');
                }
                if (window.ui) window.ui.updateUI();
            }, 6000);
        }
    },

    // Simplified Blackjack
    getCard() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const v = values[Math.floor(Math.random() * values.length)];
        const s = suits[Math.floor(Math.random() * suits.length)];
        return { value: v, suit: s };
    },

    calcHand(hand) {
        let sum = 0;
        let aces = 0;
        hand.forEach(c => {
            if (['J', 'Q', 'K'].includes(c.value)) sum += 10;
            else if (c.value === 'A') { sum += 11; aces += 1; }
            else sum += parseInt(c.value);
        });
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces -= 1;
        }
        return sum;
    },

    bjDeal(bet = 1000) {
        if (!window.state.blackjack) {
            window.state.blackjack = { active: false, playerHand: [], dealerHand: [], status: 'Ready to play', bet: 0 };
        }
        if (window.state.balance >= bet && bet >= 10 && !window.state.blackjack.active) {
            window.state.balance -= bet;
            window.state.casinoProfitLoss -= bet;
            if (window.ui) window.ui.triggerBalancePulse('red');
            window.state.blackjack = {
                active: true,
                playerHand: [this.getCard(), this.getCard()],
                dealerHand: [this.getCard()],
                status: 'Playing',
                bet: bet
            };

            const pScore = this.calcHand(window.state.blackjack.playerHand);
            if (pScore === 21) {
                window.state.blackjack.active = false;
                const payout = bet * 2.5;
                this.addMoney(payout);
                window.state.casinoProfitLoss += payout;
                window.state.blackjack.status = `BLACKJACK! +$${payout.toLocaleString()}`;
                this.logEvent(`Blackjack dealt! +$${payout.toLocaleString()}`, "text-fuchsia-400");
                if (window.ui) window.ui.triggerBalancePulse('green');
            }

            if (window.ui) {
                window.ui.renderBlackjack();
                window.ui.updateUI();
            }
        }
    },

    bjHit() {
        if (!window.state.blackjack || !window.state.blackjack.active) return;
        
        window.state.blackjack.playerHand.push(this.getCard());
        const pScore = this.calcHand(window.state.blackjack.playerHand);
        
        if (pScore > 21) {
            this.bjBust();
        } else if (pScore === 21) {
            this.bjStand(); // Auto stand on 21
            return;
        }

        if (window.ui) {
            window.ui.renderBlackjack();
            window.ui.updateUI();
        }
    },

    bjBust() {
        window.state.blackjack.active = false;
        const bet = window.state.blackjack.bet;
        window.state.blackjack.status = `Bust! Lost $${bet.toLocaleString()}`;
        this.logEvent(`Blackjack Bust! -$${bet.toLocaleString()}`, "text-red-400");
    },

    canDouble() {
        const bj = window.state.blackjack;
        return !!bj && bj.active && bj.playerHand.length === 2 && window.state.balance >= bj.bet;
    },

    // Double the bet, take exactly one more card, then stand
    bjDouble() {
        if (!this.canDouble()) return;
        const bj = window.state.blackjack;

        window.state.balance -= bj.bet;
        window.state.casinoProfitLoss -= bj.bet;
        bj.bet *= 2;
        bj.playerHand.push(this.getCard());

        if (this.calcHand(bj.playerHand) <= 21) {
            this.bjStand();
            return;
        }
        this.bjBust();
        if (window.ui) {
            window.ui.renderBlackjack();
            window.ui.updateUI();
        }
    },

    bjStand() {
        if (!window.state.blackjack || !window.state.blackjack.active) return;

        let dHand = window.state.blackjack.dealerHand;
        while (this.calcHand(dHand) < 17) {
            dHand.push(this.getCard());
        }

        const pScore = this.calcHand(window.state.blackjack.playerHand);
        const dScore = this.calcHand(dHand);
        const bet = window.state.blackjack.bet;

        window.state.blackjack.active = false;
        let payout = 0;
        if (dScore > 21 || pScore > dScore) {
            payout = bet * 2;
            this.addMoney(payout);
            window.state.casinoProfitLoss += payout;
            window.state.blackjack.status = `You Win! +$${payout.toLocaleString()}`;
            this.logEvent(`Blackjack Win! +$${payout.toLocaleString()}`, "text-emerald-400");
            if (window.ui) window.ui.triggerBalancePulse('green');
        } else if (pScore === dScore) {
            payout = bet;
            this.addMoney(payout);
            window.state.casinoProfitLoss += payout;
            window.state.blackjack.status = `Push. Refunded $${payout.toLocaleString()}`;
        } else {
            window.state.blackjack.status = `Dealer Wins. Lost $${bet.toLocaleString()}`;
            this.logEvent(`Blackjack Loss! -$${bet.toLocaleString()}`, "text-red-400");
        }

        if (window.ui) {
            window.ui.renderBlackjack();
            window.ui.updateUI();
        }
    },

    bjReset() {
        const hand = window.state.blackjack;
        if (hand && hand.active) {
            this.ask({
                title: 'Reset the table?',
                message: `You will lose your $${hand.bet.toLocaleString()} bet.`,
                yes: 'Reset',
                danger: true
            }, () => this.clearBlackjack());
            return;
        }
        this.clearBlackjack();
    },

    clearBlackjack() {
        window.state.blackjack = {
            active: false,
            playerHand: [],
            dealerHand: [],
            status: 'Ready to play',
            bet: 0
        };
        if (window.ui) {
            window.ui.renderBlackjack();
            window.ui.updateUI();
        }
    },

    pickCarTier(roll = Math.random()) {
        let total = 0;
        return CAR_TIERS.find(t => roll < (total += t.chance)) || CAR_TIERS[CAR_TIERS.length - 1];
    },

    getCarTier(car) {
        return CAR_TIERS.find(t => t.id === car.tier) || CAR_TIERS[0];
    },

    // Cars bought before classes existed only have the price paid
    getCarValue(car) {
        return car.value || car.buyPrice;
    },

    getDemand(car) {
        const demand = window.state.carDemand;
        return (demand && demand[this.getCarTier(car).id]) || 1;
    },

    getSalePrice(car) {
        return Math.round(this.getCarValue(car) * (1 + this.getCarTier(car).markup) * this.getDemand(car));
    },

    getRepairCost(car) {
        return Math.round(this.getCarValue(car) * REPAIR_RATE);
    },

    getInspectCost(car) {
        return Math.round(car.price * INSPECT_RATE);
    },

    // Milliseconds left on a saved wall-clock timer. A clock moved backwards cannot stretch it.
    getWaitLeft(until, length, now = Date.now()) {
        const left = (until || 0) - now;
        return left > 0 && left <= length ? left : 0;
    },

    updateCarDemand(now = Date.now()) {
        if (window.state.carDemand && this.getWaitLeft(window.state.demandNextAt, DEMAND_INTERVAL_MS, now)) return false;

        const demand = {};
        CAR_TIERS.forEach(t => {
            demand[t.id] = Math.round((DEMAND_MIN + Math.random() * (DEMAND_MAX - DEMAND_MIN)) * 100) / 100;
        });
        window.state.carDemand = demand;
        window.state.demandNextAt = now + DEMAND_INTERVAL_MS;
        return true;
    },

    browseAuctions(now = Date.now()) {
        if (this.getWaitLeft(window.state.nextAuctionAt, AUCTION_COOLDOWN_MS, now)) return;

        window.state.nextAuctionAt = now + AUCTION_COOLDOWN_MS;
        window.state.auctionCars = [];
        for (let i = 0; i < 3; i++) {
            const tier = this.pickCarTier();
            const price = Math.floor(Math.random() * (tier.max - tier.min + 1)) + tier.min;
            const [name, icon] = tier.models[Math.floor(Math.random() * tier.models.length)];

            window.state.auctionCars.push({
                id: Math.floor(Math.random() * 9000 + 1000),
                tier: tier.id,
                name,
                icon,
                value: price,
                price,
                inspected: false,
                haggled: false,
                hasHiddenFault: Math.random() < tier.fault
            });
        }

        this.refreshDealership();
    },

    // Listings saved before classes existed lack the details needed to show them
    refreshAuction() {
        window.state.auctionCars = (window.state.auctionCars || []).filter(car => car.tier);
    },

    refreshDealership() {
        if (window.ui) {
            window.ui.renderGarage();
            window.ui.renderAuction();
            window.ui.updateUI();
        }
    },

    inspectCar(index) {
        const car = window.state.auctionCars && window.state.auctionCars[index];
        if (!car || car.inspected) return;
        const cost = this.getInspectCost(car);
        if (window.state.balance < cost) return;

        window.state.balance -= cost;
        car.inspected = true;
        this.logEvent(`Inspected ${car.name}: ${car.hasHiddenFault ? 'engine fault' : 'no faults'}`, car.hasHiddenFault ? "text-red-400" : "text-emerald-400");
        this.refreshDealership();
    },

    haggleCar(index) {
        const car = window.state.auctionCars && window.state.auctionCars[index];
        if (!car || car.haggled) return;

        if (Math.random() < HAGGLE_CHANCE) {
            car.haggled = true;
            car.price = Math.round(car.price * (1 - HAGGLE_DISCOUNT));
            this.logEvent(`Haggled 10% off the ${car.name}`, "text-emerald-400");
        } else {
            window.state.auctionCars.splice(index, 1);
            this.logEvent(`The seller of the ${car.name} walked away`, "text-red-400");
            if (window.ui) window.ui.showToast(`The seller of the ${car.name} walked away.`);
        }
        this.refreshDealership();
    },

    getGarageSlots() {
        return window.state.garageSlots || 1;
    },

    getGarageExpansionCost() {
        const slots = this.getGarageSlots();
        return 10000 * Math.pow(5, slots - 1);
    },

    buyGarageExpansion() {
        const cost = this.getGarageExpansionCost();
        if (window.state.balance >= cost) {
            window.state.balance -= cost;
            window.state.garageSlots = (window.state.garageSlots || 1) + 1;
            this.logEvent(`Expanded Garage Capacity for ${this.money(cost)}`, "text-amber-400");
            this.refreshDealership();
        }
    },

    buyAuction(index) {
        const car = window.state.auctionCars && window.state.auctionCars[index];
        const slotsAvailable = this.getGarageSlots();
        if (!window.state.dealerCars) window.state.dealerCars = [];
        if (window.state.carDealership) {
            window.state.dealerCars.push(window.state.carDealership);
            window.state.carDealership = null;
        }

        if (car && window.state.balance >= car.price && window.state.dealerCars.length < slotsAvailable) {
            window.state.balance -= car.price;
            this.logEvent(`Bought ${car.name} for $${car.price.toLocaleString()}`, "text-amber-400");

            window.state.dealerCars.push({
                tier: car.tier,
                name: car.name,
                icon: car.icon,
                value: car.value,
                buyPrice: car.price,
                totalRestoreTimeMs: RESTORE_TIME_MS,
                restoreEndTime: Date.now() + RESTORE_TIME_MS,
                status: 'restoring',
                hasHiddenFault: car.hasHiddenFault
            });

            // Remove car from auction list
            window.state.auctionCars.splice(index, 1);
            this.refreshDealership();
        }
    },

    payForRepair(index) {
        if (!window.state.dealerCars || !window.state.dealerCars[index]) return;
        const car = window.state.dealerCars[index];
        const cost = this.getRepairCost(car);

        if (car.status === 'needs_repair' && window.state.balance >= cost) {
            window.state.balance -= cost;
            if (window.ui) window.ui.triggerBalancePulse('red');

            car.repairPaid = cost;
            car.totalRestoreTimeMs = REPAIR_TIME_EXTENSION_MS;
            car.restoreEndTime = Date.now() + REPAIR_TIME_EXTENSION_MS;
            car.status = 'restoring';
            car.hasHiddenFault = false;

            this.logEvent(`Paid $${cost.toLocaleString()} for Engine Repair`, "text-red-400");
            this.refreshDealership();
        }
    },

    sellCar(index) {
        if (!window.state.dealerCars || !window.state.dealerCars[index]) return;
        const car = window.state.dealerCars[index];

        if (car.status === 'ready') {
            const price = this.getSalePrice(car);
            window.state.balance += price;
            this.logEvent(`Sold ${car.name} for $${price.toLocaleString()}`, "text-emerald-400");

            window.state.dealerCars.splice(index, 1);

            if (window.ui) window.ui.triggerBalancePulse('green');
            this.refreshDealership();
        }
    },

    // ---- Taxi Company ----

    getTaxiType(id) {
        return TAXI_CARS.find(t => t.id === id);
    },

    getTaxiCar(id) {
        return window.state.taxi?.cars.find(c => c.id === id);
    },

    getTaxiRate() {
        const cars = window.state.taxi?.cars || [];
        const perSecond = cars.filter(c => !c.broken).reduce((sum, c) => sum + this.getTaxiType(c.type).perSecond, 0);
        return perSecond * this.getPrestigeMultiplier();
    },

    // Takes the money if it is there
    spend(cost) {
        if (window.state.balance < cost) {
            if (window.ui) window.ui.showToast(`Not enough funds. Need ${this.money(cost - window.state.balance)} more.`);
            return false;
        }
        window.state.balance -= cost;
        return true;
    },

    refreshBusinessScreen() {
        if (window.ui) {
            window.ui.renderBusinesses();
            window.ui.updateUI();
        }
    },

    openTaxiCompany() {
        if (window.state.taxi || !this.spend(TAXI_OPEN_COST)) return;
        window.state.taxi = { fares: 0, spaces: TAXI_START_SPACES, dispatcher: false, cars: [], nextId: 1 };
        this.logEvent('Opened your Taxi Company', "text-amber-400");
        this.refreshBusinessScreen();
    },

    buyTaxi(typeId) {
        const taxi = window.state.taxi;
        const type = this.getTaxiType(typeId);
        if (!taxi || !type || taxi.cars.length >= taxi.spaces || !this.spend(type.price)) return;

        taxi.cars.push({ id: taxi.nextId++, type: type.id, km: 0, broken: false });
        this.logEvent(`Bought a ${type.name} taxi`, "text-amber-400");
        this.refreshBusinessScreen();
    },

    // Runs with the capped frame time, so time away never counts
    processTaxi(ms) {
        const taxi = window.state.taxi;
        if (!taxi || !(ms > 0)) return;

        let earned = 0;
        let changed = false;
        const multiplier = this.getPrestigeMultiplier();

        taxi.cars = taxi.cars.filter(car => {
            if (car.broken) return true;
            const type = this.getTaxiType(car.type);
            const driveMs = Math.min(ms, Math.max(0, type.maxKm - car.km) / TAXI_KM_PER_MS);
            car.km += driveMs * TAXI_KM_PER_MS;
            earned += type.perSecond * (driveMs / 1000) * multiplier;

            if (car.km >= type.maxKm - 0.001) {
                changed = true;
                const message = `Your ${type.name} reached ${type.maxKm.toLocaleString('en-US')} km and was scrapped`;
                this.logEvent(message, "text-red-400");
                if (window.ui) window.ui.showToast(message);
                return false;
            }
            // The odds are given per minute, whatever the frame length
            if (Math.random() < 1 - Math.pow(1 - type.breakChance, driveMs / 60000)) {
                car.broken = true;
                changed = true;
                this.logEvent(`Your ${type.name} broke down`, "text-red-400");
                if (window.ui) window.ui.showToast(`Your ${type.name} broke down.`);
            }
            return true;
        });

        if (taxi.dispatcher) {
            // Added quietly: this runs every frame
            window.state.balance += earned;
            window.state.lifetimeEarnings += earned;
            this.updateRank();
        } else {
            taxi.fares += earned;
        }

        if (changed && window.ui) window.ui.renderBusinesses();
    },

    getTaxiRepairCost(car) {
        return Math.round(this.getTaxiType(car.type).price * TAXI_REPAIR_RATE);
    },

    repairTaxi(id) {
        const car = this.getTaxiCar(id);
        if (!car || !car.broken || !this.spend(this.getTaxiRepairCost(car))) return;
        car.broken = false;
        this.logEvent(`Repaired your ${this.getTaxiType(car.type).name}`, "text-emerald-400");
        this.refreshBusinessScreen();
    },

    getTaxiSellValue(car) {
        const type = this.getTaxiType(car.type);
        return Math.round(type.price * TAXI_SELL_RATE * Math.max(0, 1 - car.km / type.maxKm));
    },

    sellTaxi(id) {
        const car = this.getTaxiCar(id);
        if (!car) return;
        const type = this.getTaxiType(car.type);
        this.ask({
            title: 'Sell this taxi?',
            message: `Sell your ${type.name} for about $${this.getTaxiSellValue(car).toLocaleString()}?`,
            yes: 'Sell'
        }, () => {
            // The car keeps driving while the question is open, and may even be scrapped
            const current = this.getTaxiCar(id);
            if (!current) return;

            const value = this.getTaxiSellValue(current);
            window.state.taxi.cars = window.state.taxi.cars.filter(c => c.id !== id);
            window.state.balance += value;
            this.logEvent(`Sold your ${type.name} for ${this.money(value)}`, "text-emerald-400");
            this.refreshBusinessScreen();
        });
    },

    getTaxiSpaceCost() {
        return TAXI_SPACE_COST;
    },

    getDispatcherCost() {
        return DISPATCHER_COST;
    },

    getTaxiOpenCost() {
        return TAXI_OPEN_COST;
    },

    canExpandFleet() {
        return !!window.state.taxi && window.state.taxi.spaces < TAXI_MAX_SPACES;
    },

    expandTaxiFleet() {
        if (!this.canExpandFleet() || !this.spend(TAXI_SPACE_COST)) return;
        window.state.taxi.spaces += 1;
        this.logEvent('Added a space to your taxi fleet', "text-amber-400");
        this.refreshBusinessScreen();
    },

    hireDispatcher() {
        const taxi = window.state.taxi;
        if (!taxi || taxi.dispatcher || !this.spend(DISPATCHER_COST)) return;
        taxi.dispatcher = true;
        this.logEvent('Hired a taxi dispatcher', "text-amber-400");
        this.collectFares();
        this.refreshBusinessScreen();
    },

    collectFares() {
        const taxi = window.state.taxi;
        if (!taxi || !(taxi.fares > 0)) return;
        const amount = taxi.fares;
        taxi.fares = 0;
        this.addMoney(amount);
        this.logEvent(`Collected ${this.money(amount)} in taxi fares`, "text-emerald-400");
        if (window.ui) {
            window.ui.triggerBalancePulse('green');
            window.ui.updateUI();
        }
    },

    // ---- Rental Properties ----

    getHomeType(id) {
        return HOME_TYPES.find(t => t.id === id);
    },

    getHome(id) {
        return window.state.rentals?.homes.find(h => h.id === id);
    },

    getTenantType(id) {
        return TENANT_TYPES.find(t => t.id === id);
    },

    getRentLevel(id) {
        return RENT_LEVELS.find(level => level.id === id);
    },

    getRentalOpenCost() {
        return RENTAL_OPEN_COST;
    },

    getAgentCost() {
        return AGENT_COST;
    },

    getMaxHomes() {
        return MAX_HOMES;
    },

    openRentals() {
        if (window.state.rentals || !this.spend(RENTAL_OPEN_COST)) return;
        const everyType = value => Object.fromEntries(HOME_TYPES.map(t => [t.id, value]));
        window.state.rentals = {
            rent: 0, agent: false, homes: [], nextId: 1, lastPayout: Date.now(),
            market: everyType(100), change: everyType(0), marketMs: 0
        };
        this.logEvent('Opened Rental Properties', "text-amber-400");
        this.refreshBusinessScreen();
    },

    // What a home of this type sells for today
    getHomePrice(typeId) {
        const percent = window.state.rentals?.market[typeId] ?? 100;
        return Math.round(this.getHomeType(typeId).price * percent / 100);
    },

    buyHome(typeId) {
        const rentals = window.state.rentals;
        if (!rentals || !this.getHomeType(typeId) || rentals.homes.length >= MAX_HOMES) return;
        if (!this.spend(this.getHomePrice(typeId))) return;

        rentals.homes.push({
            id: rentals.nextId++, type: typeId, condition: 100, rentLevel: 'fair',
            tenant: null, late: false, minuteMs: 0, applicants: this.makeApplicants(), waitUntil: null
        });
        this.logEvent(`Bought a ${this.getHomeType(typeId).name}`, "text-amber-400");
        this.refreshBusinessScreen();
    },

    // Different people of different types
    makeApplicants() {
        const types = TENANT_TYPES.map(t => t.id);
        while (types.length > APPLICANT_COUNT) types.splice(Math.floor(Math.random() * types.length), 1);
        const names = [...TENANT_NAMES];
        return types.map(type => ({ name: names.splice(Math.floor(Math.random() * names.length), 1)[0], type }));
    },

    chooseTenant(homeId, index) {
        const home = this.getHome(homeId);
        const applicant = home?.applicants?.[index];
        if (!applicant || home.tenant) return;

        home.tenant = { name: applicant.name, type: applicant.type };
        home.applicants = null;
        home.minuteMs = 0;
        home.late = Math.random() < this.getTenantType(applicant.type).lateChance;
        this.logEvent(`${applicant.name} moved into your ${this.getHomeType(home.type).name}`, "text-emerald-400");
        if (window.ui?.businessScreen === 'tenants') window.ui.showBusiness('rentals');
        else this.refreshBusinessScreen();
    },

    setRentLevel(homeId, levelId) {
        const home = this.getHome(homeId);
        if (!home || !this.getRentLevel(levelId)) return;
        home.rentLevel = levelId;
        this.refreshBusinessScreen();
    },

    // Each point of damage takes a little off the rent
    getConditionFactor(home) {
        return 1 - (100 - home.condition) * RENT_LOST_PER_DAMAGE;
    },

    // Rent a second from this kind of tenant, when they are paying
    getRentFor(home, tenantTypeId, levelPay = this.getRentLevel(home.rentLevel).pay) {
        return this.getHomeType(home.type).rent * this.getTenantType(tenantTypeId).pay * levelPay
            * this.getConditionFactor(home) * this.getPrestigeMultiplier();
    },

    getHomeRate(home) {
        if (!home.tenant || home.late) return 0;
        return this.getRentFor(home, home.tenant.type);
    },

    getRentRate() {
        return (window.state.rentals?.homes || []).reduce((sum, home) => sum + this.getHomeRate(home), 0);
    },

    // While away, High counts as Fair and late payers pay their average
    getAwayRentRate() {
        return (window.state.rentals?.homes || []).filter(home => home.tenant).reduce((sum, home) => {
            const levelPay = Math.min(this.getRentLevel(home.rentLevel).pay, this.getRentLevel('fair').pay);
            const paid = 1 - this.getTenantType(home.tenant.type).lateChance;
            return sum + this.getRentFor(home, home.tenant.type, levelPay) * paid;
        }, 0);
    },

    // Rent by the wall clock, like shop income. Returns what the caller still has to hand over.
    settleRent(now) {
        const result = { managed: 0, away: 0, gap: 0 };
        const rentals = window.state.rentals;
        if (!rentals) return result;

        const gap = now - rentals.lastPayout;
        rentals.lastPayout = now;
        if (!(gap > 0)) return result;

        if (gap <= AWAY_GRACE_MS) {
            const earned = this.getRentRate() * gap / 1000;
            if (rentals.agent) result.managed = earned;
            else rentals.rent += earned;
        } else {
            const reducedMs = Math.min(gap, AWAY_CAP_MS) - AWAY_GRACE_MS;
            result.away = this.getAwayRentRate() * (AWAY_GRACE_MS + reducedMs * AWAY_RATE) / 1000;
            if (result.away > 0) result.gap = gap;
        }
        return result;
    },

    // Prices, wear and tenants. Runs with the capped frame time, so time away never counts.
    processRentals(ms, now = Date.now()) {
        const rentals = window.state.rentals;
        if (!rentals || !(ms > 0)) return;
        let changed = false;

        rentals.marketMs += ms;
        if (rentals.marketMs >= HOME_MARKET_MS) {
            rentals.marketMs -= HOME_MARKET_MS;
            this.updateHomeMarket();
            changed = true;
        }

        rentals.homes.forEach(home => {
            if (home.tenant) {
                if (this.processTenant(home, ms, now)) changed = true;
            } else if (!home.applicants && !this.getApplicantWait(home, now)) {
                home.applicants = this.makeApplicants();
                home.waitUntil = null;
                changed = true;
            }
        });

        if (changed) window.ui?.renderBusinesses();
    },

    // Returns true when the screen needs redrawing
    processTenant(home, ms, now) {
        const tenant = this.getTenantType(home.tenant.type);
        const level = this.getRentLevel(home.rentLevel);
        let changed = false;

        home.condition = Math.max(0, home.condition - tenant.wear * ms / 60000);
        home.minuteMs += ms;
        if (home.minuteMs >= 60000) {
            home.minuteMs -= 60000;
            const late = Math.random() < tenant.lateChance;
            changed = late !== home.late;
            home.late = late;
        }

        // The odds are given per minute, whatever the frame length
        const chance = level.leaveChance / tenant.stay;
        if (Math.random() < 1 - Math.pow(1 - chance, ms / 60000)) {
            const message = `${home.tenant.name} left your ${this.getHomeType(home.type).name}`;
            home.tenant = null;
            home.late = false;
            home.waitUntil = now + level.waitMs;
            this.logEvent(message, "text-red-400");
            window.ui?.showToast(message);
            changed = true;
        }
        return changed;
    },

    updateHomeMarket() {
        const rentals = window.state.rentals;
        HOME_TYPES.forEach(({ id }) => {
            const step = Math.floor(Math.random() * (HOME_MARKET_STEP * 2 + 1)) - HOME_MARKET_STEP;
            const before = rentals.market[id];
            rentals.market[id] = Math.min(HOME_MARKET_MAX, Math.max(HOME_MARKET_MIN, before + step));
            rentals.change[id] = rentals.market[id] - before;
        });
    },

    // Milliseconds until an empty home has applicants again
    getApplicantWait(home, now = Date.now()) {
        const longest = Math.max(...RENT_LEVELS.map(level => level.waitMs));
        return this.getWaitLeft(home.waitUntil, longest, now);
    },

    collectRent() {
        const rentals = window.state.rentals;
        if (!rentals || !(rentals.rent > 0)) return;
        const amount = rentals.rent;
        rentals.rent = 0;
        this.addMoney(amount);
        this.logEvent(`Collected ${this.money(amount)} in rent`, "text-emerald-400");
        if (window.ui) {
            window.ui.triggerBalancePulse('green');
            window.ui.updateUI();
        }
    },

    hireAgent() {
        const rentals = window.state.rentals;
        if (!rentals || rentals.agent || !this.spend(AGENT_COST)) return;
        rentals.agent = true;
        this.logEvent('Hired a property agent', "text-amber-400");
        this.collectRent();
        this.refreshBusinessScreen();
    },

    // The whole points shown on screen, so a fresh repair does not read 99% a moment later
    getConditionPercent(home) {
        return Math.ceil(home.condition);
    },

    getHomeRepairCost(home) {
        return Math.round(this.getHomeType(home.type).repair * (100 - this.getConditionPercent(home)) / 100);
    },

    repairHome(id) {
        const home = this.getHome(id);
        if (!home) return;
        const cost = this.getHomeRepairCost(home);
        if (!cost || !this.spend(cost)) return;
        home.condition = 100;
        this.logEvent(`Repaired your ${this.getHomeType(home.type).name}`, "text-emerald-400");
        this.refreshBusinessScreen();
    },

    // Today's price, less the agent's fee and the repairs the buyer will need
    getHomeSellValue(home) {
        return Math.round(this.getHomePrice(home.type) * (1 - HOME_SELL_FEE)) - this.getHomeRepairCost(home);
    },

    sellHome(id) {
        const home = this.getHome(id);
        if (!home) return;
        const { name } = this.getHomeType(home.type);
        const leaving = home.tenant ? ' Your tenant will leave.' : '';
        this.ask({
            title: 'Sell this home?',
            message: `Sell your ${name} for about $${this.getHomeSellValue(home).toLocaleString('en-US')}?${leaving}`,
            yes: 'Sell'
        }, () => {
            // Prices and condition keep moving while the question is open
            const current = this.getHome(id);
            if (!current) return;

            const value = this.getHomeSellValue(current);
            window.state.rentals.homes = window.state.rentals.homes.filter(h => h.id !== id);
            // Not counted as earnings, so buying and selling cannot farm Prestige
            window.state.balance += value;
            this.logEvent(`Sold your ${name} for ${this.money(value)}`, "text-emerald-400");
            this.refreshBusinessScreen();
        });
    },

    // ---- Lifestyle ----

    getLifestyleSpent() {
        return LIFESTYLE_ITEMS.reduce((sum, item) => sum + item.price * (window.state.lifestyle?.[item.id] || 0), 0);
    },

    getLifestyleLevel() {
        const spent = this.getLifestyleSpent();
        const current = LIFESTYLE_LEVELS.filter(level => spent >= level.from).pop();
        const next = LIFESTYLE_LEVELS.find(level => level.from > spent);
        return {
            name: current.name,
            next: next ? next.name : null,
            remaining: next ? next.from - spent : 0,
            progress: next ? (spent - current.from) / (next.from - current.from) : 1
        };
    },

    buyLifestyle(id) {
        const item = LIFESTYLE_ITEMS.find(x => x.id === id);
        if (!item || (window.state.lifestyle?.[id] && !item.repeatable)) return;
        if (window.state.balance < item.price) {
            this.spend(item.price); // shows how much more is needed
            return;
        }

        this.ask({
            title: `Buy ${item.name}?`,
            message: `It costs $${item.price.toLocaleString('en-US')}. There are no refunds.`,
            yes: 'Buy'
        }, () => {
            if (window.state.lifestyle?.[id] && !item.repeatable) return;
            if (!this.spend(item.price)) return;

            window.state.lifestyle = { ...window.state.lifestyle, [id]: (window.state.lifestyle?.[id] || 0) + 1 };
            this.logEvent(`Treated yourself: ${item.name}`, "text-fuchsia-400");
            if (window.ui) {
                window.ui.renderLifestyle();
                window.ui.showToast(`Enjoy your ${item.name.toLowerCase()}!`, 'good');
                window.ui.updateUI();
            }
        });
    },

    // Saved as "off", so older saves keep paying tax. Prestige leaves the choice alone.
    taxesOn() {
        return !window.state.taxesOff;
    },

    toggleTaxes() {
        window.state.taxesOff = this.taxesOn();
        window.ui?.renderProfile();
        window.saveGame();
    },

    startGameLoop() {
        let lastFrameTime = performance.now();

        const loop = (currentTime) => {
            const deltaTime = Math.min(currentTime - lastFrameTime, MAX_FRAME_MS);
            lastFrameTime = currentTime;

            // Optional safeguard
            if (!window.state) return;

            // Operations & Taxes. Held at zero while off, so switching back on starts a fresh minute.
            timeSinceLastTax = this.taxesOn() ? timeSinceLastTax + deltaTime : 0;
            if (timeSinceLastTax >= TAX_INTERVAL_MS) {
                timeSinceLastTax = 0;
                if (window.state.balance > 0) {
                    const tax = window.state.balance * TAX_RATE;
                    window.state.balance -= tax;
                    this.logEvent(`Operations Tax Paid: $${tax.toFixed(2)}`, "text-red-400");
                    if (window.ui) {
                        window.ui.showToast(`Tax Paid: -$${tax.toFixed(2)}`);
                        window.ui.triggerBalancePulse('red');
                    }
                }
            }

            // Market Update
            timeSinceLastMarketUpdate += deltaTime;
            if (timeSinceLastMarketUpdate >= MARKET_UPDATE_MS) {
                timeSinceLastMarketUpdate -= MARKET_UPDATE_MS;
                this.updateMarketPrices();
                if (window.state.activeTab === 'invest' && window.ui) window.ui.renderMarket();
            }

            // Dividends
            timeSinceLastDividend += deltaTime;
            if (timeSinceLastDividend >= DIVIDEND_INTERVAL_MS) {
                timeSinceLastDividend -= DIVIDEND_INTERVAL_MS;
                const portValue = this.getPortfolioValue();
                if (portValue > 0) {
                    const div = portValue * 0.005; // 0.5%
                    this.addMoney(div);
                    this.logEvent(`Stock Dividend Paid: $${div.toFixed(2)}`, "text-emerald-400");
                    if (window.ui) {
                        window.ui.showToast(`Dividend: +$${div.toFixed(2)}`, 'good');
                        window.ui.triggerBalancePulse('green');
                    }
                }
            }

            // Accrue Passive Income internally
            this.processBusinessIncome();
            this.processTaxi(deltaTime);
            this.processRentals(deltaTime);

            // Sync visual progress bars for businesses that produce income
            const incomePerSecond = this.getPassiveIncome();
            if (incomePerSecond > 0) {
                timeSinceLastIncome += deltaTime;
                if (timeSinceLastIncome >= 1000) timeSinceLastIncome -= 1000;

                if (window.ui && window.ui.updateBusinessProgressBars) {
                    const progressPercent = (timeSinceLastIncome / 1000) * 100;
                    window.ui.updateBusinessProgressBars(progressPercent);
                }
            } else {
                if (window.ui && window.ui.updateBusinessProgressBars) {
                    window.ui.updateBusinessProgressBars(0);
                }
            }

            if (window.ui) window.ui.syncVisualsSilently();

            if (this.updateCarDemand() && window.ui?.isDealerOpen?.()) {
                window.ui.renderGarage();
            }

            // Dealership Timer Logic
            if (window.state.dealerCars && window.state.dealerCars.length > 0) {
                window.state.dealerCars.forEach((car, index) => {
                    if (car.status === 'restoring') {
                        const now = Date.now();
                        if (now >= car.restoreEndTime) {
                            if (car.hasHiddenFault) {
                                car.status = 'needs_repair';
                                this.logEvent(`Hidden fault discovered in ${car.name}!`, "text-red-400");
                            } else {
                                car.status = 'ready';
                            }
                            if (window.ui) window.ui.renderGarage();
                        } else {
                            const timeLeftMs = car.restoreEndTime - now;
                            const tTotal = car.totalRestoreTimeMs || RESTORE_TIME_MS;
                            const progressPercent = ((tTotal - timeLeftMs) / tTotal) * 100;
                            // Update individual progress bars via UI
                            if (window.ui?.isDealerOpen?.() && window.ui.updateCarProgressBar) {
                                window.ui.updateCarProgressBar(index, (timeLeftMs / 1000).toFixed(1), progressPercent);
                            }
                        }
                    }
                });
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
};

window.logic = logic;
window.BUSINESS_DATA = BUSINESS_DATA;
window.MARKET_DATA = MARKET_DATA;
window.CAR_TIERS = CAR_TIERS;
window.TAXI_CARS = TAXI_CARS;
window.HOME_TYPES = HOME_TYPES;
window.TENANT_TYPES = TENANT_TYPES;
window.RENT_LEVELS = RENT_LEVELS;
window.LIFESTYLE_ITEMS = LIFESTYLE_ITEMS;
window.stockPrices = stockPrices;
window.stockHistory = stockHistory;
window.stockTrails = stockTrails;
