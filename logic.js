const BUSINESS_DATA = [
    { id: 'retail', name: 'Retail Syndicate', icon: '🏪', baseCost: 100, costMult: 1.15, income: 2 },
    { id: 'startup', name: 'Tech Startup', icon: '💻', baseCost: 2500, costMult: 1.15, income: 60 },
    { id: 'estate', name: 'Real Estate Firm', icon: '🏢', baseCost: 50000, costMult: 1.15, income: 1500 },
    { id: 'corp', name: 'Mega Corporation', icon: '🌐', baseCost: 1000000, costMult: 1.15, income: 40000 }
];

const RESTORE_TIME_MS = 30000;
const REPAIR_TIME_EXTENSION_MS = 15000;
const REPAIR_COST = 300;
const FAULT_CHANCE = 0.15;
const LICENSE_COST = 2500;
const TAX_RATE = 0.005; // 0.5%
const TAX_INTERVAL_MS = 60000;

const CAR_NAMES = ['2018 Sedan', '1994 Coupe', '2012 Hatchback', '2020 SUV', '2005 Truck', '2015 Sports Car'];
const CAR_ICONS = ['🚗', '🚘', '🚙', '🏎️', '🛻', '🚕'];

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
window.stockMultiplier = '1'; // '1' or 'max'
MARKET_DATA.forEach(s => {
    stockPrices[s.id] = s.basePrice;
    stockHistory[s.id] = 0;
});


// Core Logic Setup
const logic = {
    getPrestigeMultiplier() {
        const count = window.state.prestigeCount || 0;
        return 1 + (count * 0.10); // +10% per prestige
    },

    getClickValue() {
        const retailCount = window.state.businesses?.retail || window.state.retailStores || 0;

        let totalBiz = 0;
        if (window.state.businesses) {
            Object.values(window.state.businesses).forEach(v => totalBiz += v);
        } else {
            totalBiz = window.state.retailStores || 0;
        }

        const base = Math.floor(retailCount / 10) + Math.floor(totalBiz / 5) + 1;
        return base * this.getPrestigeMultiplier();
    },

    getBusinessCost(id) {
        const b = BUSINESS_DATA.find(x => x.id === id);
        let count = window.state.businesses?.[id] || 0;
        if (id === 'retail' && count === 0) count = window.state.retailStores || 0;
        return b.baseCost * Math.pow(b.costMult, count);
    },

    getPassiveIncome() {
        let income = 0;
        BUSINESS_DATA.forEach(b => {
            const count = window.state.businesses?.[b.id] || 0;
            if (b.id === 'retail' && count === 0 && window.state.retailStores > 0) {
                income += window.state.retailStores * b.income;
            } else {
                income += count * b.income;
            }
        });
        return income * this.getPrestigeMultiplier();
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
        });
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
        }
    },

    addMoney(amount) {
        window.state.balance += amount;
        window.state.lifetimeEarnings += amount;
        this.updateRank();
    },

    toggleStockMultiplier() {
        if (window.stockMultiplier === '1') window.stockMultiplier = 'max';
        else window.stockMultiplier = '1';
        if (window.ui) window.ui.renderMarket();
    },

    updateRank() {
        const e = window.state.lifetimeEarnings;
        if (e >= 1000000) window.state.rank = 'Billionaire Tycoon';
        else if (e >= 250000) window.state.rank = 'Elite Investor';
        else if (e >= 50000) window.state.rank = 'Regional Manager';
        else if (e >= 10000) window.state.rank = 'Local Operator';
        else window.state.rank = 'Novice Hustler';
    },

    prestige() {
        if (window.state.lifetimeEarnings >= 1000000) {
            if (confirm("Are you incredibly sure? You will lose all money, businesses, stocks, and cars for a permanent +10% income multiplier.")) {
                window.state.prestigeCount = (window.state.prestigeCount || 0) + 1;
                window.state.balance = 0;
                window.state.businesses = {};
                window.state.retailStores = 0;
                window.state.portfolio = {};
                window.state.dealerCars = [];
                window.state.carDealership = null;
                window.state.hasDealerLicense = false;
                window.state.hasCasinoMembership = false;
                window.state.lifetimeEarnings = 0;
                window.state.totalClicks = 0;
                window.state.casinoProfitLoss = 0;
                window.state.garageSlots = 1;
                window.state.rank = 'Novice Hustler';

                this.logEvent(`Prestiged to Level ${window.state.prestigeCount}!`, "text-amber-400");
                window.saveGame();
                location.reload();
            }
        }
    },

    buyBusiness(id) {
        if (!window.state.businesses) window.state.businesses = {};

        // Migration for retail
        if (id === 'retail' && !window.state.businesses.retail && window.state.retailStores > 0) {
            window.state.businesses.retail = window.state.retailStores || 0;
        }

        const cost = this.getBusinessCost(id);
        if (window.state.balance >= cost) {
            window.state.balance -= cost;
            window.state.businesses[id] = (window.state.businesses[id] || 0) + 1;

            // Sync legacy
            if (id === 'retail') window.state.retailStores = window.state.businesses.retail;

            const b = BUSINESS_DATA.find(x => x.id === id);
            this.logEvent(`Acquired ${b.name} for $${this.formatMoney ? this.formatMoney(cost) : cost.toFixed(2)}`, "text-emerald-400");

            if (window.ui) {
                window.ui.renderBusinesses();
                window.ui.updateUI();
            }
        }
    },

    buyLicense() {
        if (window.state.balance >= LICENSE_COST) {
            window.state.balance -= LICENSE_COST;
            window.state.hasDealerLicense = true;
            this.logEvent(`Purchased Dealer License ($2,500)`, "text-amber-400");
            if (window.ui) {
                window.ui.updateUI();
                window.ui.switchTab('market');
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

    spinSlots(bet = 100) {
        if (window.state.balance >= bet && bet >= 10) {
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
                    payout = bet * 50;
                    winText = `JACKPOT! +$${payout.toLocaleString()}`;
                    color = "text-fuchsia-400";
                    logMsg = `Casino Jackpot! +$${payout.toLocaleString()}`;
                    logColor = "text-fuchsia-400";
                } else {
                    payout = bet * 10;
                    winText = `WINNER! +$${payout.toLocaleString()}`;
                    color = "text-emerald-400";
                    logMsg = `Casino slots win! +$${payout.toLocaleString()}`;
                    logColor = "text-emerald-400";
                }
            }

            if (window.ui) {
                window.ui.renderSlotsResult(r1, r2, r3, winText, color);
                window.ui.updateUI();
            }

            setTimeout(() => {
                if (payout > 0) {
                    this.addMoney(payout);
                    window.state.casinoProfitLoss += payout;
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
        if (window.state.balance >= bet && bet >= 10) {
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
                payout = color === 'Green' ? bet * 7 : bet * 2;
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

            if (window.ui) {
                window.ui.renderRouletteResult(msg, tColor, resultColorName);
                window.ui.updateUI();
            }

            setTimeout(() => {
                if (payout > 0) {
                    this.addMoney(payout);
                    window.state.casinoProfitLoss += payout;
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
        if (window.state.balance >= bet && bet >= 10 && (!window.state.blackjack || !window.state.blackjack.active)) {
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

            if (this.calcHand(window.state.blackjack.playerHand) === 21) {
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
        if (window.state.blackjack.active) {
            window.state.blackjack.playerHand.push(this.getCard());
            if (this.calcHand(window.state.blackjack.playerHand) > 21) {
                window.state.blackjack.active = false;
                const bet = window.state.blackjack.bet;
                window.state.blackjack.status = `Bust! Lost $${bet.toLocaleString()}`;
                this.logEvent(`Blackjack Bust! -$${bet.toLocaleString()}`, "text-red-400");
            }
            if (window.ui) {
                window.ui.renderBlackjack();
                window.ui.updateUI();
            }
        }
    },

    bjStand() {
        if (window.state.blackjack.active) {
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
        }
    },

    browseAuctions() {
        window.state.auctionCars = [];
        for (let i = 0; i < 3; i++) {
            const price = Math.floor(Math.random() * (1200 - 500 + 1)) + 500;
            const idx = Math.floor(Math.random() * CAR_NAMES.length);

            window.state.auctionCars.push({
                id: Math.floor(Math.random() * 9000 + 1000),
                name: CAR_NAMES[idx],
                icon: CAR_ICONS[idx],
                price: price
            });
        }

        if (window.ui) {
            window.ui.renderAuction();
            window.ui.updateUI();
        }
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
            this.logEvent(`Expanded Garage Capacity for $${window.ui ? window.ui.formatMoney(cost) : cost.toFixed(2)}`, "text-amber-400");
            if (window.ui) {
                window.ui.renderGarage();
                window.ui.updateUI();
            }
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
            this.logEvent(`Bought ${car.name} for $${car.price.toFixed(2)}`, "text-amber-400");

            const willHaveFault = Math.random() < FAULT_CHANCE;

            window.state.dealerCars.push({
                name: car.name,
                icon: car.icon,
                buyPrice: car.price,
                sellPrice: car.price * 1.25,
                totalRestoreTimeMs: RESTORE_TIME_MS,
                restoreEndTime: Date.now() + RESTORE_TIME_MS,
                status: 'restoring',
                hasHiddenFault: willHaveFault
            });

            // Remove car from auction list
            window.state.auctionCars.splice(index, 1);

            if (window.ui) {
                window.ui.renderGarage();
                window.ui.renderAuction();
                window.ui.updateUI();
            }
        }
    },

    payForRepair(index) {
        if (!window.state.dealerCars || !window.state.dealerCars[index]) return;
        const car = window.state.dealerCars[index];

        if (car.status === 'needs_repair' && window.state.balance >= REPAIR_COST) {
            window.state.balance -= REPAIR_COST;
            if (window.ui) window.ui.triggerBalancePulse('red');

            car.totalRestoreTimeMs = REPAIR_TIME_EXTENSION_MS;
            car.restoreEndTime = Date.now() + REPAIR_TIME_EXTENSION_MS;
            car.status = 'restoring';
            car.hasHiddenFault = false;

            this.logEvent(`Paid $${REPAIR_COST} for Engine Repair`, "text-red-400");

            if (window.ui) {
                window.ui.renderGarage();
                window.ui.updateUI();
            }
        }
    },

    sellCar(index) {
        if (!window.state.dealerCars || !window.state.dealerCars[index]) return;
        const car = window.state.dealerCars[index];

        if (car.status === 'ready') {
            window.state.balance += car.sellPrice;
            this.logEvent(`Sold ${car.name} for $${car.sellPrice.toFixed(2)}`, "text-emerald-400");

            window.state.dealerCars.splice(index, 1);

            if (window.ui) {
                window.ui.triggerBalancePulse('green');
                window.ui.renderGarage();
                window.ui.renderAuction();
                window.ui.updateUI();
            }
        }
    },

    startGameLoop() {
        let lastFrameTime = performance.now();

        const loop = (currentTime) => {
            const deltaTime = currentTime - lastFrameTime;
            lastFrameTime = currentTime;

            // Optional safeguard
            if (!window.state) return;

            // Operations & Taxes
            timeSinceLastTax += deltaTime;
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
                        window.ui.showToast(`Dividend: +$${div.toFixed(2)}`);
                        window.ui.triggerBalancePulse('green');
                    }
                }
            }

            // Passive Income
            const incomePerSecond = this.getPassiveIncome();
            if (incomePerSecond > 0) {
                this.addMoney(incomePerSecond * (deltaTime / 1000));

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
                            if (window.state.activeTab === 'market' && window.ui && window.ui.updateCarProgressBar) {
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
window.stockPrices = stockPrices;
window.stockHistory = stockHistory;
