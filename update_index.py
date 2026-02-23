import sys

with open(r'C:\Users\faizy\.gemini\antigravity\scratch\business-empire\index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Invest HTML
invest_nav_old = """                    <!-- Investments Tab (Disabled) -->
                    <button class="flex flex-col items-center gap-1 group opacity-20 cursor-not-allowed hidden sm:flex">
                        <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Invest</span>
                    </button>"""
invest_nav_new = """                    <!-- Investments Tab -->
                    <button id="navInvest" class="flex flex-col items-center gap-1 group nav-btn opacity-40 hover:opacity-100 transition-opacity flex">
                        <svg class="w-6 h-6 nav-icon text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider nav-text transition-colors">Trade</span>
                    </button>"""
content = content.replace(invest_nav_old, invest_nav_new)

invest_main_old = """            </div>
        </main>

        <!-- Fixed Footer / Nav -->"""
invest_main_new = """            </div>
        </main>

        <!-- Main Content (Invest / Stock Market) -->
        <main id="investView" class="hidden flex-1 overflow-y-auto px-6 py-2 pb-24 space-y-6 no-scrollbar relative z-10">
            <section>
                <div class="flex items-center justify-between px-1 mb-2">
                    <h2 class="text-slate-500 text-xs font-bold uppercase tracking-widest">Equities Exchange</h2>
                    <span id="portfolioValueDisplay" class="text-emerald-500 font-mono text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Port: $0.00</span>
                </div>
                
                <div id="stockListContainer" class="space-y-3">
                    <!-- Stocks rendered via JS -->
                </div>
            </section>
        </main>

        <!-- Fixed Footer / Nav -->"""
content = content.replace(invest_main_old, invest_main_new)

# 2. State
state_old = """        // Game State
        let state = {
            balance: 0,
            retailStores: 0,
            activeTab: 'vault',
            auctionCar: null,
            carDealership: null, // { name, buyPrice, sellPrice, restoreEndTime, status, icon, totalRestoreTimeMs, hasHiddenFault }
            hasDealerLicense: false,
            logs: [] // max 3
        };"""
state_new = """        // Game State
        let state = {
            balance: 0,
            retailStores: 0,
            activeTab: 'vault',
            auctionCar: null,
            carDealership: null,
            hasDealerLicense: false,
            logs: [],
            portfolio: {}
        };

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

        const MARKET_UPDATE_MS = 5000;
        const DIVIDEND_INTERVAL_MS = 120000;"""
content = content.replace(state_old, state_new)

# 3. Timers
timers_old = """        let timeSinceLastIncome = 0;
        let timeSinceLastTax = 0;"""
timers_new = """        let timeSinceLastIncome = 0;
        let timeSinceLastTax = 0;
        let timeSinceLastMarketUpdate = 0;
        let timeSinceLastDividend = 0;"""
content = content.replace(timers_old, timers_new)

# 4. UI Elements
ui_old = """        const navVault = document.getElementById('navVault');
        const navMarket = document.getElementById('navMarket');
        const vaultView = document.getElementById('vaultView');
        const marketView = document.getElementById('marketView');"""
ui_new = """        const navVault = document.getElementById('navVault');
        const navMarket = document.getElementById('navMarket');
        const navInvest = document.getElementById('navInvest');
        const vaultView = document.getElementById('vaultView');
        const marketView = document.getElementById('marketView');
        const investView = document.getElementById('investView');
        const stockListContainer = document.getElementById('stockListContainer');
        const portfolioValueDisplay = document.getElementById('portfolioValueDisplay');"""
content = content.replace(ui_old, ui_new)

# 5. Listeners
nav_l_old = """            // Nav Interactions
            navVault.addEventListener('click', () => switchTab('vault'));
            navMarket.addEventListener('click', () => switchTab('market'));"""
nav_l_new = """            // Nav Interactions
            navVault.addEventListener('click', () => switchTab('vault'));
            navMarket.addEventListener('click', () => switchTab('market'));
            navInvest.addEventListener('click', () => switchTab('invest'));"""
content = content.replace(nav_l_old, nav_l_new)

# 6. Game Loop
loop_old = """                // Operations & Taxes
                timeSinceLastTax += deltaTime;
                if (timeSinceLastTax >= TAX_INTERVAL_MS) {
                    timeSinceLastTax = 0;
                    if (state.balance > 0) {
                        const tax = state.balance * TAX_RATE;
                        state.balance -= tax;
                        logEvent(`Operations Tax Paid: $${tax.toFixed(2)}`, "text-red-400");
                        showToast(`Tax Paid: -$${tax.toFixed(2)}`);
                        triggerBalancePulse('red');
                    }
                }"""
loop_new = """                // Operations & Taxes
                timeSinceLastTax += deltaTime;
                if (timeSinceLastTax >= TAX_INTERVAL_MS) {
                    timeSinceLastTax = 0;
                    if (state.balance > 0) {
                        const tax = state.balance * TAX_RATE;
                        state.balance -= tax;
                        logEvent(`Operations Tax Paid: $${tax.toFixed(2)}`, "text-red-400");
                        showToast(`Tax Paid: -$${tax.toFixed(2)}`);
                        triggerBalancePulse('red');
                    }
                }

                // Market Update
                timeSinceLastMarketUpdate += deltaTime;
                if (timeSinceLastMarketUpdate >= MARKET_UPDATE_MS) {
                    timeSinceLastMarketUpdate -= MARKET_UPDATE_MS;
                    updateMarketPrices();
                    if (state.activeTab === 'invest') renderMarket();
                }

                // Dividends
                timeSinceLastDividend += deltaTime;
                if (timeSinceLastDividend >= DIVIDEND_INTERVAL_MS) {
                    timeSinceLastDividend -= DIVIDEND_INTERVAL_MS;
                    const portValue = getPortfolioValue();
                    if (portValue > 0) {
                        const div = portValue * 0.005; // 0.5%
                        state.balance += div;
                        logEvent(`Stock Dividend Paid: $${div.toFixed(2)}`, "text-emerald-400");
                        showToast(`Dividend: +$${div.toFixed(2)}`);
                        triggerBalancePulse('green');
                    }
                }"""
content = content.replace(loop_old, loop_new)

# 7. Switch Tabs
tab_reset_old = """            // Reset nav styles
            [navVault, navMarket].forEach(btn => {
                btn.classList.remove('active', 'opacity-100');
                btn.classList.add('opacity-40');
                btn.querySelector('.nav-icon').classList.replace('text-white', 'text-slate-400');
                btn.querySelector('.nav-text').classList.replace('text-white', 'text-slate-400');
            });

            vaultView.classList.add('hidden');
            marketView.classList.add('hidden');"""
tab_reset_new = """            // Reset nav styles
            [navVault, navMarket, navInvest].forEach(btn => {
                if(!btn) return;
                btn.classList.remove('active', 'opacity-100');
                btn.classList.add('opacity-40');
                btn.querySelector('.nav-icon').classList.replace('text-white', 'text-slate-400');
                btn.querySelector('.nav-text').classList.replace('text-white', 'text-slate-400');
            });

            vaultView.classList.add('hidden');
            marketView.classList.add('hidden');
            if(investView) investView.classList.add('hidden');"""
content = content.replace(tab_reset_old, tab_reset_new)

tab_logic_old = """                } else {
                    licenseGate.classList.remove('hidden');
                    marketContent.classList.add('hidden');
                }
            }
        }"""
tab_logic_new = """                } else {
                    licenseGate.classList.remove('hidden');
                    marketContent.classList.add('hidden');
                }
            } else if (tabId === 'invest') {
                navInvest.classList.add('active', 'opacity-100');
                navInvest.classList.remove('opacity-40');
                navInvest.querySelector('.nav-icon').classList.replace('text-slate-400', 'text-white');
                navInvest.querySelector('.nav-text').classList.replace('text-slate-400', 'text-white');
                if(investView) investView.classList.remove('hidden');
                headerTitle.innerText = "Equities Portfolio";
                renderMarket();
            }
        }"""
content = content.replace(tab_logic_old, tab_logic_new)

market_logic = """        function getPortfolioValue() {
            let total = 0;
            if(!state.portfolio) return 0;
            for(const [sym, data] of Object.entries(state.portfolio)) {
                total += data.shares * (stockPrices[sym] || 0);
            }
            return total;
        }

        function updateMarketPrices() {
            MARKET_DATA.forEach(s => {
                const vol = Math.random() * (s.maxVol + s.minVol) + (Math.random() < 0.5 ? -Math.random()*s.maxVol : Math.random()*s.maxVol);
                // Correct vol approach: user specified bounds e.g. -0.02 to +0.02
                const range = s.maxVol - s.minVol;
                const change = Math.random() * range + s.minVol;
                const oldPrice = stockPrices[s.id];
                stockPrices[s.id] = Math.max(1, oldPrice * (1 + change));
                if (stockPrices[s.id] > oldPrice) stockHistory[s.id] = 1;
                else if (stockPrices[s.id] < oldPrice) stockHistory[s.id] = -1;
                else stockHistory[s.id] = 0;
            });
        }

        window.buyStock = function(sym) {
            const price = stockPrices[sym];
            if(state.balance >= price) {
                state.balance -= price;
                if(!state.portfolio[sym]) {
                    state.portfolio[sym] = { shares: 0, totalSpent: 0 };
                }
                state.portfolio[sym].shares += 1;
                state.portfolio[sym].totalSpent += price;
                triggerBalancePulse('red');
                renderMarket();
                updateUI();
            }
        }

        function renderMarket() {
            if(!stockListContainer) return;
            portfolioValueDisplay.innerText = 'Port: ' + formatMoney(getPortfolioValue());
            
            let html = '';
            if (!state.portfolio) state.portfolio = {};

            MARKET_DATA.forEach(s => {
                const price = stockPrices[s.id];
                const hist = stockHistory[s.id];
                const port = state.portfolio[s.id] || { shares: 0, totalSpent: 0 };
                
                let icon = '';
                let colorClass = 'text-slate-200';
                if(hist === 1) { icon = '▲'; colorClass = 'text-emerald-400'; }
                else if (hist === -1) { icon = '▼'; colorClass = 'text-red-400'; }
                
                let plHtml = '';
                if(port.shares > 0) {
                    const avg = port.totalSpent / port.shares;
                    const val = port.shares * price;
                    const diff = val - port.totalSpent;
                    const diffPerc = (diff / port.totalSpent) * 100;
                    const plClass = diff >= 0 ? 'text-emerald-500' : 'text-red-500';
                    const plSign = diff >= 0 ? '+' : '';
                    plHtml = `<div class="mt-2 text-[10px] sm:text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                        Avg: ${formatMoney(avg)} | 
                        P/L: <span class="font-bold font-mono ${plClass}">${plSign}${formatMoney(diff)} (${plSign}${diffPerc.toFixed(1)}%)</span>
                    </div>`;
                }

                html += `
                <div class="bg-slate-850 p-4 rounded-xl border border-slate-700/80 shadow">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col">
                            <span class="text-xs font-bold text-slate-400 tracking-wider">$${s.id}</span>
                            <span class="text-sm sm:text-base font-bold text-white">${s.name}</span>
                            <span class="text-[10px] text-slate-500">Own: ${port.shares} shares</span>
                        </div>
                        <div class="flex flex-col items-end">
                            <div class="font-mono text-sm sm:text-base font-bold ${colorClass} transition-colors">
                                ${icon} ${formatMoney(price)}
                            </div>
                            <button onclick="buyStock('${s.id}')" class="mt-1 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded shadow-sm text-xs font-bold text-white transition-all disabled:opacity-50" ${state.balance < price ? 'disabled' : ''}>
                                BUY
                            </button>
                        </div>
                    </div>
                    ${plHtml}
                </div>
                `;
            });
            stockListContainer.innerHTML = html;
        }

"""
content = content.replace("        function renderLogs() {", market_logic + "        function renderLogs() {")


ui_update_old = """            if (state.auctionCar) buyAuctionBtn.disabled = state.balance < state.auctionCar.price;
            
            if (state.carDealership && state.carDealership.status === 'needs_repair') {
                payForRepairBtn.disabled = state.balance < REPAIR_COST;
            }
        }"""
ui_update_new = """            if (state.auctionCar) buyAuctionBtn.disabled = state.balance < state.auctionCar.price;
            
            if (state.carDealership && state.carDealership.status === 'needs_repair') {
                payForRepairBtn.disabled = state.balance < REPAIR_COST;
            }
            if (state.activeTab === 'invest') renderMarket();
        }"""
content = content.replace(ui_update_old, ui_update_new)

with open(r'C:\Users\faizy\.gemini\antigravity\scratch\business-empire\index.html', 'w', encoding='utf-8') as f:
    f.write(content)
