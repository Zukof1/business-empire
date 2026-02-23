// Core Constants
const BASE_STORE_COST = 100;
const STORE_COST_MULTIPLIER = 1.15;
const STORE_INCOME = 2;

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
MARKET_DATA.forEach(s => {
    stockPrices[s.id] = s.basePrice;
    stockHistory[s.id] = 0;
});


// Core Logic Setup
const logic = {
    getClickValue() {
        return Math.floor(window.state.retailStores / 10) + 1;
    },

    getStoreCost() {
        return BASE_STORE_COST * Math.pow(STORE_COST_MULTIPLIER, window.state.retailStores);
    },

    getPassiveIncome() {
        return window.state.retailStores * STORE_INCOME;
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

    buyStock(sym) {
        const price = stockPrices[sym];
        if (window.state.balance >= price) {
            window.state.balance -= price;
            if (!window.state.portfolio[sym]) {
                window.state.portfolio[sym] = { shares: 0, totalSpent: 0 };
            }
            window.state.portfolio[sym].shares += 1;
            window.state.portfolio[sym].totalSpent += price;

            if (window.ui && window.ui.triggerBalancePulse) window.ui.triggerBalancePulse('red');
            if (window.ui && window.ui.renderMarket) window.ui.renderMarket();
            if (window.ui && window.ui.updateUI) window.ui.updateUI();
        }
    },

    sellStock(sym) {
        if (!window.state.portfolio[sym] || window.state.portfolio[sym].shares <= 0) return;

        const price = stockPrices[sym];
        const port = window.state.portfolio[sym];

        // Add money to balance
        window.state.balance += price;

        // Calculate average price before selling to correctly adjust totalSpent
        const avgPrice = port.totalSpent / port.shares;

        // Decrement shares
        port.shares -= 1;
        port.totalSpent -= avgPrice; // Reduce totalSpent proportionally

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
            window.ui.createParticle(e, `+$${yieldVal}`);
        }
    },

    addMoney(amount) {
        window.state.balance += amount;
        window.state.lifetimeEarnings += amount;
        this.updateRank();
    },

    updateRank() {
        const e = window.state.lifetimeEarnings;
        if (e >= 1000000) window.state.rank = 'Billionaire Tycoon';
        else if (e >= 250000) window.state.rank = 'Elite Investor';
        else if (e >= 50000) window.state.rank = 'Regional Manager';
        else if (e >= 10000) window.state.rank = 'Local Operator';
        else window.state.rank = 'Novice Hustler';
    },

    buyStore() {
        const cost = this.getStoreCost();
        if (window.state.balance >= cost) {
            window.state.balance -= cost;
            window.state.retailStores++;
            this.logEvent(`Acquired Retail Store for $${cost.toFixed(2)}`, "text-emerald-400");
            if (window.ui) window.ui.updateUI();
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
            let resultColorName = resultColorCode === 'R' ? 'Red' : (resultColorCode === 'B' ? 'Black' : 'Gold');

            const win = color === resultColorName;

            let msg = '';
            let tColor = '';

            let payout = 0;
            let logMsg = '';
            let logColor = '';

            if (win) {
                payout = color === 'Gold' ? bet * 7 : bet * 2;
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
            }, 4000);
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
        const price = Math.floor(Math.random() * (1200 - 500 + 1)) + 500;
        const idx = Math.floor(Math.random() * CAR_NAMES.length);

        window.state.auctionCar = {
            name: CAR_NAMES[idx],
            icon: CAR_ICONS[idx],
            price: price
        };

        if (window.ui) {
            window.ui.renderAuction();
            window.ui.updateUI();
        }
    },

    buyAuction() {
        if (window.state.auctionCar && window.state.balance >= window.state.auctionCar.price) {
            window.state.balance -= window.state.auctionCar.price;
            this.logEvent(`Bought ${window.state.auctionCar.name} for $${window.state.auctionCar.price.toFixed(2)}`, "text-amber-400");

            const willHaveFault = Math.random() < FAULT_CHANCE;

            window.state.carDealership = {
                name: window.state.auctionCar.name,
                icon: window.state.auctionCar.icon,
                buyPrice: window.state.auctionCar.price,
                sellPrice: window.state.auctionCar.price * 1.25,
                totalRestoreTimeMs: RESTORE_TIME_MS,
                restoreEndTime: Date.now() + RESTORE_TIME_MS,
                status: 'restoring',
                hasHiddenFault: willHaveFault
            };

            window.state.auctionCar = null;

            if (window.ui) {
                window.ui.renderGarage();
                window.ui.renderAuction();
                window.ui.updateUI();
            }
        }
    },

    payForRepair() {
        if (window.state.carDealership && window.state.carDealership.status === 'needs_repair' && window.state.balance >= REPAIR_COST) {
            window.state.balance -= REPAIR_COST;
            if (window.ui) window.ui.triggerBalancePulse('red');

            window.state.carDealership.totalRestoreTimeMs = REPAIR_TIME_EXTENSION_MS;
            window.state.carDealership.restoreEndTime = Date.now() + REPAIR_TIME_EXTENSION_MS;
            window.state.carDealership.status = 'restoring';
            window.state.carDealership.hasHiddenFault = false;

            this.logEvent(`Paid $${REPAIR_COST} for Engine Repair`, "text-red-400");

            if (window.ui) {
                window.ui.renderGarage();
                window.ui.updateUI();
            }
        }
    },

    sellCar() {
        if (window.state.carDealership && window.state.carDealership.status === 'ready') {
            window.state.balance += window.state.carDealership.sellPrice;
            this.logEvent(`Sold ${window.state.carDealership.name} for $${window.state.carDealership.sellPrice.toFixed(2)}`, "text-emerald-400");
            window.state.carDealership = null;

            if (window.ui) {
                window.ui.triggerBalancePulse('green');
                window.ui.renderGarage();
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
            if (window.state.retailStores > 0) {
                const incomePerSecond = window.state.retailStores * STORE_INCOME;
                this.addMoney(incomePerSecond * (deltaTime / 1000));

                timeSinceLastIncome += deltaTime;
                if (timeSinceLastIncome >= 1000) {
                    timeSinceLastIncome = 0;
                }
                const progressPercent = (timeSinceLastIncome / 1000) * 100;
                if (window.ui && window.ui.elements.storeProgressBar) {
                    window.ui.elements.storeProgressBar.style.width = `${progressPercent}%`;
                }
            } else {
                if (window.ui && window.ui.elements.storeProgressBar) {
                    window.ui.elements.storeProgressBar.style.width = `0%`;
                }
            }

            if (window.ui) window.ui.syncVisualsSilently();

            // Dealership Timer Logic
            if (window.state.carDealership) {
                if (window.state.carDealership.status === 'restoring') {
                    const now = Date.now();
                    if (now >= window.state.carDealership.restoreEndTime) {
                        if (window.state.carDealership.hasHiddenFault) {
                            window.state.carDealership.status = 'needs_repair';
                            this.logEvent(`Hidden fault discovered in ${window.state.carDealership.name}!`, "text-red-400");
                        } else {
                            window.state.carDealership.status = 'ready';
                        }
                        if (window.ui) window.ui.renderGarage();
                    } else {
                        const timeLeftMs = window.state.carDealership.restoreEndTime - now;
                        const tTotal = window.state.carDealership.totalRestoreTimeMs || RESTORE_TIME_MS;
                        const progressPercent = ((tTotal - timeLeftMs) / tTotal) * 100;

                        if (window.state.activeTab === 'market' && window.ui && window.ui.elements.carRestoreTimer) {
                            window.ui.elements.carRestoreTimer.innerText = (timeLeftMs / 1000).toFixed(1) + 's';
                            window.ui.elements.carRestoreBar.style.width = `${progressPercent}%`;
                        }
                    }
                }
            }

            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }
};

window.logic = logic;
window.MARKET_DATA = MARKET_DATA;
window.stockPrices = stockPrices;
window.stockHistory = stockHistory;
