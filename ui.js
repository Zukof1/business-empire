const ui = {
    elements: {},

    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        this.switchTab(window.state.activeTab);
    },

    cacheElements() {
        this.elements = {
            balanceDisplay: document.getElementById('balanceDisplay'),
            passiveIncomeDisplay: document.getElementById('passiveIncomeDisplay'),
            workBtn: document.getElementById('workBtn'),
            clickValueDisplay: document.getElementById('clickValueDisplay'),
            efficiencyDisplay: document.getElementById('efficiencyDisplay'),
            businessListContainer: document.getElementById('businessListContainer'),

            saveIndicator: document.getElementById('saveIndicator'),
            saveDot: document.getElementById('saveDot'),

            navVault: document.getElementById('navVault'),
            navMarket: document.getElementById('navMarket'),
            navInvest: document.getElementById('navInvest'),

            vaultView: document.getElementById('vaultView'),
            marketView: document.getElementById('marketView'),
            investView: document.getElementById('investView'),

            headerTitle: document.getElementById('headerTitle'),
            dealerBadge: document.getElementById('dealerBadge'),
            activityLogList: document.getElementById('activityLogList'),

            navCasino: document.getElementById('navCasino'),
            casinoBadge: document.getElementById('casinoBadge'),
            casinoView: document.getElementById('casinoView'),
            casinoGate: document.getElementById('casinoGate'),
            casinoContent: document.getElementById('casinoContent'),
            buyCasinoBtn: document.getElementById('buyCasinoBtn'),

            slot1: document.getElementById('slot1'),
            slot2: document.getElementById('slot2'),
            slot3: document.getElementById('slot3'),
            slotResult: document.getElementById('slotResult'),
            spinSlotsBtn: document.getElementById('spinSlotsBtn'),
            slotsBetInput: document.getElementById('slotsBetInput'),

            rouletteResult: document.getElementById('rouletteResult'),
            rouletteRail: document.getElementById('rouletteRail'),
            rouletteHistory: document.getElementById('rouletteHistory'),
            rouletteBetInput: document.getElementById('rouletteBetInput'),
            btnBetRed: document.getElementById('btnBetRed'),
            btnBetBlack: document.getElementById('btnBetBlack'),
            btnBetGreen: document.getElementById('btnBetGreen'),

            bjTable: document.getElementById('bjTable'),

            casinoLobby: document.getElementById('casinoLobby'),
            btnOpenSlots: document.getElementById('btnOpenSlots'),
            btnOpenRoulette: document.getElementById('btnOpenRoulette'),
            btnOpenBlackjack: document.getElementById('btnOpenBlackjack'),
            casinoSlotsView: document.getElementById('casinoSlotsView'),
            casinoRouletteView: document.getElementById('casinoRouletteView'),
            casinoBlackjackView: document.getElementById('casinoBlackjackView'),
            btnBackToLobby: document.querySelectorAll('.btnBackToLobby'), // Nodelist
            bjDealerScore: document.getElementById('bjDealerScore'),
            bjDealerHand: document.getElementById('bjDealerHand'),
            bjPlayerScore: document.getElementById('bjPlayerScore'),
            bjPlayerHand: document.getElementById('bjPlayerHand'),
            bjResult: document.getElementById('bjResult'),
            bjControlsDeal: document.getElementById('bjControlsDeal'),
            bjControlsPlay: document.getElementById('bjControlsPlay'),
            btnBjDeal: document.getElementById('btnBjDeal'),
            btnBjHit: document.getElementById('btnBjHit'),
            btnBjStand: document.getElementById('btnBjStand'),
            bjBetInput: document.getElementById('bjBetInput'),

            navProfile: document.getElementById('navProfile'),
            profileView: document.getElementById('profileView'),
            statRank: document.getElementById('statRank'),
            statTotalEarnings: document.getElementById('statTotalEarnings'),
            statTotalClicks: document.getElementById('statTotalClicks'),
            statCasinoPL: document.getElementById('statCasinoPL'),

            licenseGate: document.getElementById('licenseGate'),
            marketContent: document.getElementById('marketContent'),
            buyLicenseBtn: document.getElementById('buyLicenseBtn'),

            browseAuctionsBtn: document.getElementById('browseAuctionsBtn'),
            auctionResultsList: document.getElementById('auctionResultsList'),
            auctionSection: document.getElementById('auctionSection'),

            garageSlot: document.getElementById('garageSlot'),
            garageStatus: document.getElementById('garageStatus'),
            garageEmptyState: document.getElementById('garageEmptyState'),
            garageActiveState: document.getElementById('garageActiveState'),
            garageCarName: document.getElementById('garageCarName'),
            garageCarIcon: document.getElementById('garageCarIcon'),
            garageBuyPrice: document.getElementById('garageBuyPrice'),

            garageRestoring: document.getElementById('garageRestoring'),
            carRestoreTimer: document.getElementById('carRestoreTimer'),
            carRestoreBar: document.getElementById('carRestoreBar'),

            garageNeedsRepair: document.getElementById('garageNeedsRepair'),
            payForRepairBtn: document.getElementById('payForRepairBtn'),

            garageReady: document.getElementById('garageReady'),
            garageSellPrice: document.getElementById('garageSellPrice'),
            sellCarBtn: document.getElementById('sellCarBtn'),

            stockListContainer: document.getElementById('stockListContainer'),
            portfolioValueDisplay: document.getElementById('portfolioValueDisplay'),
            toastContainer: document.getElementById('toastContainer')
        };
    },

    bindEvents() {
        const el = this.elements;
        const l = window.logic;

        el.workBtn?.addEventListener('click', (e) => l.doWork(e));


        el.navVault?.addEventListener('click', () => this.switchTab('vault'));
        el.navMarket?.addEventListener('click', () => this.switchTab('market'));
        el.navInvest?.addEventListener('click', () => this.switchTab('invest'));
        el.navCasino?.addEventListener('click', () => this.switchTab('casino'));
        el.navProfile?.addEventListener('click', () => this.switchTab('profile'));

        el.buyLicenseBtn?.addEventListener('click', () => l.buyLicense());
        el.buyCasinoBtn?.addEventListener('click', () => l.buyCasinoMembership());

        el.spinSlotsBtn?.addEventListener('click', () => {
            const bet = parseInt(el.slotsBetInput?.value) || 10;
            l.spinSlots(bet);
        });
        el.btnBetRed?.addEventListener('click', () => {
            const bet = parseInt(el.rouletteBetInput?.value) || 10;
            l.playRoulette('Red', bet);
        });
        el.btnBetBlack?.addEventListener('click', () => {
            const bet = parseInt(el.rouletteBetInput?.value) || 10;
            l.playRoulette('Black', bet);
        });
        el.btnBetGreen?.addEventListener('click', () => {
            const bet = parseInt(el.rouletteBetInput?.value) || 10;
            l.playRoulette('Green', bet);
        });
        el.btnBjDeal?.addEventListener('click', () => {
            const bet = parseInt(el.bjBetInput?.value) || 10;
            l.bjDeal(bet);
        });
        el.btnBjHit?.addEventListener('click', () => l.bjHit());
        el.btnBjStand?.addEventListener('click', () => l.bjStand());
        el.browseAuctionsBtn?.addEventListener('click', () => l.browseAuctions());
        // Buy buttons are handled dynamically in renderAuction.
        // Repair / Sell buttons are handled dynamically in renderGarage.

        el.saveIndicator?.addEventListener('click', () => window.hardReset());

        // Casino sub-navigation
        el.btnOpenSlots?.addEventListener('click', () => this.showCasinoView('slots'));
        el.btnOpenRoulette?.addEventListener('click', () => {
            this.showCasinoView('roulette');
            this.initRouletteWheel(); // Intentionally recreate the wheel now that the element is unhidden
        });
        el.btnOpenBlackjack?.addEventListener('click', () => this.showCasinoView('blackjack'));

        if (el.btnBackToLobby) {
            el.btnBackToLobby.forEach(btn => btn.addEventListener('click', () => this.showCasinoLobby()));
        }
    },

    showCasinoLobby() {
        const el = this.elements;
        if (el.casinoLobby) el.casinoLobby.classList.remove('hidden');
        if (el.casinoSlotsView) el.casinoSlotsView.classList.add('hidden');
        if (el.casinoRouletteView) el.casinoRouletteView.classList.add('hidden');
        if (el.casinoBlackjackView) el.casinoBlackjackView.classList.add('hidden');
    },

    showCasinoView(viewName) {
        const el = this.elements;
        if (el.casinoLobby) el.casinoLobby.classList.add('hidden');
        if (el.casinoSlotsView) el.casinoSlotsView.classList.add('hidden');
        if (el.casinoRouletteView) el.casinoRouletteView.classList.add('hidden');
        if (el.casinoBlackjackView) el.casinoBlackjackView.classList.add('hidden');

        if (viewName === 'slots' && el.casinoSlotsView) el.casinoSlotsView.classList.remove('hidden');
        if (viewName === 'roulette' && el.casinoRouletteView) el.casinoRouletteView.classList.remove('hidden');
        if (viewName === 'blackjack' && el.casinoBlackjackView) el.casinoBlackjackView.classList.remove('hidden');
    },

    formatMoney(amount) {
        if (amount >= 1000000000000) return '$' + (amount / 1000000000000).toFixed(2) + 'T';
        if (amount >= 1000000000) return '$' + (amount / 1000000000).toFixed(2) + 'B';
        if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
        if (amount >= 10000) return '$' + (amount / 1000).toFixed(1) + 'k';
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    switchTab(tabId) {
        window.state.activeTab = tabId;
        const el = this.elements;

        [el.navVault, el.navMarket, el.navInvest, el.navCasino, el.navProfile].forEach(btn => {
            if (!btn) return;
            btn.classList.remove('active', 'opacity-100');
            btn.classList.add('opacity-40');
            btn.querySelector('.nav-icon')?.classList.replace('text-white', 'text-slate-400');
            btn.querySelector('.nav-icon')?.classList.replace('text-fuchsia-400', 'text-slate-400');
            btn.querySelector('.nav-icon')?.classList.replace('text-sky-400', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-white', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-fuchsia-400', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-sky-400', 'text-slate-400');
        });

        if (el.vaultView) el.vaultView.classList.add('hidden');
        if (el.marketView) el.marketView.classList.add('hidden');
        if (el.investView) el.investView.classList.add('hidden');
        if (el.casinoView) el.casinoView.classList.add('hidden');
        if (el.profileView) el.profileView.classList.add('hidden');

        const appContainer = document.querySelector('.bg-slate-900, .bg-violet-950');
        if (appContainer) {
            if (tabId === 'casino') {
                appContainer.classList.add('bg-violet-950');
                appContainer.classList.remove('bg-slate-900');
            } else {
                appContainer.classList.add('bg-slate-900');
                appContainer.classList.remove('bg-violet-950');
            }
        }

        // The license gate logic handles its own visibility in switchTab('market') and renderMarket()
        // Here we handle the notification dot specifically for the dealer state
        this.updateDealerBadge();

        if (tabId === 'vault') {
            el.navVault?.classList.add('active', 'opacity-100');
            el.navVault?.classList.remove('opacity-40');
            el.navVault?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-white');
            el.navVault?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-white');
            el.vaultView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Vault Balance";
            this.renderBusinesses();
        } else if (tabId === 'market') {
            el.navMarket?.classList.add('active', 'opacity-100');
            el.navMarket?.classList.remove('opacity-40');
            el.navMarket?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-white');
            el.navMarket?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-white');
            el.marketView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Auto Dealership";

            if (window.state.hasDealerLicense) {
                el.licenseGate?.classList.add('hidden');
                el.marketContent?.classList.remove('hidden');
                this.renderAuction();
                this.renderGarage();
            } else {
                el.licenseGate?.classList.remove('hidden');
                el.marketContent?.classList.add('hidden');
            }
        } else if (tabId === 'invest') {
            el.navInvest?.classList.add('active', 'opacity-100');
            el.navInvest?.classList.remove('opacity-40');
            el.navInvest?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-white');
            el.navInvest?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-white');
            el.investView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Equities Portfolio";
            this.renderMarket();
        } else if (tabId === 'casino') {
            el.navCasino?.classList.add('active', 'opacity-100');
            el.navCasino?.classList.remove('opacity-40');
            el.navCasino?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-fuchsia-400');
            el.navCasino?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-fuchsia-400');
            el.casinoView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Neon District Casino";

            if (window.state.hasCasinoMembership) {
                el.casinoBadge?.classList.add('hidden');
                el.casinoGate?.classList.add('hidden');
                el.casinoContent?.classList.remove('hidden');
                this.showCasinoLobby();
                if (!window.state.rouletteHistory) window.state.rouletteHistory = [];
                this.initRouletteWheel();
                this.renderBlackjack();
            } else {
                el.casinoBadge?.classList.remove('hidden');
                el.casinoGate?.classList.remove('hidden');
                el.casinoContent?.classList.add('hidden');
            }
        } else if (tabId === 'profile') {
            el.navProfile?.classList.add('active', 'opacity-100');
            el.navProfile?.classList.remove('opacity-40');
            el.navProfile?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-sky-400');
            el.navProfile?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-sky-400');
            el.profileView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Player Profile";
            this.renderProfile();
        }
    },

    renderBusinesses() {
        const el = this.elements;
        if (!el.businessListContainer) return;

        if (!window.state.businesses) {
            window.state.businesses = {};
            if (window.state.retailStores) {
                window.state.businesses['b_retail'] = window.state.retailStores;
                delete window.state.retailStores;
            }
        }

        let html = '';
        window.BUSINESSES.forEach(b => {
            const count = window.state.businesses[b.id] || 0;
            const cost = window.logic.getStoreCost(b.id);
            const canAfford = window.state.balance >= cost;

            html += `
                <button onclick="window.logic.buyStore('${b.id}')"
                    class="w-full text-left bg-slate-850 border border-slate-800 p-4 rounded-2xl transition-all duration-200 group relative overflow-hidden flex flex-col gap-4 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-600 hover:bg-slate-800 shadow-lg mb-4" ${!canAfford ? 'disabled' : ''}>
                    <div class="flex justify-between items-start relative z-10 w-full">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center text-2xl border border-slate-700/80 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                ${b.icon}</div>
                            <div class="flex flex-col">
                                <h3 class="text-slate-200 font-bold text-base group-hover:text-white transition-colors">
                                    ${b.name} <span class="text-xs bg-slate-700 font-mono text-emerald-400 px-1.5 py-0.5 rounded ml-1">${count}</span></h3>
                                <p class="text-emerald-400 text-xs font-semibold mt-0.5">+$${this.formatMoney(b.income)} /sec</p>
                            </div>
                        </div>
                        <div class="flex flex-col items-end">
                            <span class="text-white font-bold text-lg tracking-tight">${this.formatMoney(cost)}</span>
                            <span class="text-slate-500 text-[10px] mt-1 font-bold uppercase tracking-widest group-hover:text-amber-400 transition-colors">Expand</span>
                        </div>
                    </div>

                    <div class="w-full relative z-10 pt-1">
                        <div class="flex justify-between items-center mb-1.5">
                            <span class="text-slate-600 text-[9px] font-bold uppercase tracking-widest">Income Pulse</span>
                            <span class="text-slate-600 text-[9px] font-bold uppercase tracking-widest font-mono">${b.mult}x Rate</span>
                        </div>
                        <div class="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                            <div id="storeProgressBar_${b.id}"
                                class="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-0 relative rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                <div class="absolute inset-0 bg-white/20 w-1/8 animate-[pulse_1s_infinite]"></div>
                            </div>
                        </div>
                    </div>
                </button>
             `;
        });

        el.businessListContainer.innerHTML = html;
    },

    updateDealerBadge() {
        const el = this.elements;
        if (!el.dealerBadge) return;

        let needsAttention = false;

        if (!window.state.hasDealerLicense) {
            // Red badge if they haven't bought the license yet and have capital
            if (window.state.balance >= 2500) {
                el.dealerBadge.classList.remove('hidden');
                el.dealerBadge.className = "absolute top-[8px] right-[20%] w-2 h-2 bg-red-500 rounded-full border border-slate-900 shadow-[0_0_5px_rgba(239,68,68,0.8)]";
                return;
            }
        } else if (window.state.carDealership && Array.isArray(window.state.carDealership)) {
            // Check if any car is ready or needs repair
            const hasReady = window.state.carDealership.some(c => c.status === 'ready');
            const hasRepair = window.state.carDealership.some(c => c.status === 'needs_repair');

            if (hasReady || hasRepair) {
                needsAttention = true;
                if (!hasRepair && hasReady) {
                    el.dealerBadge.className = "absolute top-[8px] right-[20%] w-2 h-2 bg-emerald-500 rounded-full border border-slate-900 shadow-[0_0_5px_rgba(16,185,129,0.8)]";
                } else if (hasRepair) {
                    el.dealerBadge.className = "absolute top-[8px] right-[20%] w-2 h-2 bg-red-500 rounded-full border border-slate-900 shadow-[0_0_5px_rgba(239,68,68,0.8)] animate-pulse";
                }
            }
        }

        if (needsAttention) {
            el.dealerBadge.classList.remove('hidden');
        } else {
            el.dealerBadge.classList.add('hidden');
        }
    },

    renderAuction() {
        const el = this.elements;
        if (!el.auctionResultsList) return;

        if (window.state.auctionCars && window.state.auctionCars.length > 0) {
            let html = '';
            window.state.auctionCars.forEach((car, index) => {
                const canAfford = window.state.balance >= car.price;
                const isGarageFull = window.state.carDealership && Array.isArray(window.state.carDealership) && window.state.carDealership.length >= 3;
                const disableBtn = !canAfford || isGarageFull;

                html += `
                    <div class="bg-slate-850 p-4 mb-2 rounded-xl border border-slate-700 shadow-md flex-col gap-4 transition-all duration-300">
                        <div class="flex justify-between items-center">
                            <div class="flex flex-col">
                                <span class="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-0.5">Lot
                                    #<span>${car.id}</span></span>
                                <h3 class="text-white font-bold text-base">${car.name}</h3>
                            </div>
                            <div class="text-2xl">${car.icon}</div>
                        </div>

                        <div class="flex items-center justify-between pt-3 border-t border-slate-800">
                            <div class="flex flex-col">
                                <span class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Asking
                                    Price</span>
                                <span class="text-slate-200 font-mono font-bold text-lg">${this.formatMoney(car.price)}</span>
                            </div>
                            <button onclick="window.logic.buyAuction(${index})"
                                class="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-900 font-bold px-5 py-2 rounded-lg text-sm shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all" ${disableBtn ? 'disabled' : ''}>Purchase</button>
                        </div>
                    </div>
                `;
            });
            el.auctionResultsList.innerHTML = html;
        } else {
            el.auctionResultsList.innerHTML = '';
        }

        if (window.state.carDealership && Array.isArray(window.state.carDealership) && window.state.carDealership.length >= 3) {
            el.auctionSection?.classList.add('opacity-50', 'pointer-events-none');
        } else {
            el.auctionSection?.classList.remove('opacity-50', 'pointer-events-none');
        }
    },

    renderGarage() {
        const el = this.elements;
        if (!el.garageListContainer) return;

        if (!window.state.carDealership) window.state.carDealership = [];
        if (!Array.isArray(window.state.carDealership)) {
            window.state.carDealership = [window.state.carDealership];
        }

        // Update the header slots status
        const garageStatus = document.getElementById('garageStatus');
        if (garageStatus) {
            garageStatus.innerText = `${window.state.carDealership.length}/3 Slots`;
        }

        let html = '';

        // Render active cars
        window.state.carDealership.forEach((car, index) => {
            const repairing = car.status === 'restoring';
            const needsRep = car.status === 'needs_repair';
            const ready = car.status === 'ready';

            const now = Date.now();
            const timeRemaining = Math.max(0, car.restoreEndTime - now);
            let percent = 0;
            let timerText = '0.0s';
            if (repairing && car.totalRestoreTimeMs > 0) {
                const total = car.totalRestoreTimeMs;
                const elapsed = total - timeRemaining;
                percent = Math.min(100, Math.max(0, (elapsed / total) * 100));
                timerText = (timeRemaining / 1000).toFixed(1) + 's';
            }

            html += `
              <div class="bg-slate-850 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col gap-4 shadow-lg min-h-[120px]">
                  <div class="flex flex-col">
                      <div class="flex justify-between items-start mb-4">
                          <div>
                              <h3 class="text-slate-200 font-bold text-lg">${car.name} <span class="text-xs text-slate-500 ml-2 border border-slate-700 rounded px-1">Slot ${index + 1}</span></h3>
                              <p class="text-slate-400 text-xs mt-1">Acquired: <span class="text-amber-400 font-mono inline-block ml-1">${this.formatMoney(car.buyPrice)}</span></p>
                          </div>
                          <div class="text-xl pl-2">${car.icon}</div>
                      </div>

                      ${repairing ? `
                      <div class="w-full">
                          <div class="flex justify-between items-center mb-1.5">
                              <span class="text-orange-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                  <div class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                                  Restoring...
                              </span>
                              <span class="text-slate-400 text-[10px] font-bold font-mono" id="rtimer_${index}">${timerText}</span>
                          </div>
                          <div class="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800/50">
                              <div id="rbar_${index}" class="h-full bg-gradient-to-r from-orange-600 to-amber-400 relative rounded-full" style="width: ${percent}%;"></div>
                          </div>
                      </div>
                      ` : ''}

                      ${needsRep ? `
                      <div class="w-full flex-col mt-2 pt-4 border-t border-red-900/50">
                          <div class="flex justify-between items-center mb-2">
                              <span class="text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                  Hidden Engine Fault
                              </span>
                              <span class="text-slate-400 text-xs">Cost: <span class="text-red-400 font-bold font-mono inline-block ml-1">-$300.00</span></span>
                          </div>
                          <p class="text-xs text-slate-400 mb-3">Mechanics found unexpected damage. Fixing it adds 15s.</p>
                          <button onclick="window.logic.payForRepair(${index})" class="w-full py-2.5 bg-red-900/40 hover:bg-red-800/60 border border-red-700 text-red-100 rounded-xl font-bold uppercase tracking-widest text-xs transition-all disabled:opacity-50" ${window.state.balance < 300 ? 'disabled' : ''}>
                              Pay $300 for Repairs
                          </button>
                      </div>
                      ` : ''}

                      ${ready ? `
                      <div class="w-full flex-col mt-2 pt-4 border-t border-slate-800">
                          <div class="flex justify-between items-center mb-3">
                              <span class="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Ready for Sale</span>
                              <span class="text-slate-400 text-xs">Return: <span class="text-emerald-400 font-bold font-mono inline-block ml-1">${this.formatMoney(car.sellPrice)}</span></span>
                          </div>
                          <button onclick="window.logic.sellCar(${index})" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all">
                              Sell Vehicle (+25%)
                          </button>
                      </div>
                      ` : ''}
                  </div>
              </div>
              `;
        });

        // Render empty slots up to 3
        const emptySlots = 3 - window.state.carDealership.length;
        for (let i = 0; i < emptySlots; i++) {
            html += `
              <div class="bg-slate-850/50 border border-slate-800 border-dashed p-5 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center shadow-inner min-h-[120px]">
                  <div class="text-4xl mb-2 opacity-30 text-slate-600">🏢</div>
                  <p class="text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Open Slot</p>
                  <p class="text-xs text-slate-600 mt-2">Acquire a vehicle from auction</p>
              </div>
              `;
        }

        el.garageListContainer.innerHTML = html;
    },

    renderMarket() {
        const el = this.elements;
        if (!el.stockListContainer) return;

        if (el.portfolioValueDisplay) {
            el.portfolioValueDisplay.innerText = 'Port: ' + this.formatMoney(window.logic.getPortfolioValue());
        }

        let html = '';
        if (!window.state.portfolio) window.state.portfolio = {};

        // Add the toggle bar at the top
        const isMax = window.stockMultiplier === 'max';
        html += `
        <div class="flex justify-between items-center bg-slate-850 p-2 px-3 rounded-xl border border-slate-700/80 shadow-sm mb-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Trade Volume</span>
            <div class="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                <button onclick="window.logic.toggleStockMultiplier()" class="px-3 py-1 text-xs font-bold rounded-md transition-colors ${!isMax ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}">x1</button>
                <button onclick="window.logic.toggleStockMultiplier()" class="px-3 py-1 text-xs font-bold rounded-md transition-colors ${isMax ? 'bg-amber-600/80 text-white shadow' : 'text-slate-500 hover:text-slate-300'}">MAX</button>
            </div>
        </div>
        `;

        window.MARKET_DATA.forEach(s => {
            const price = window.stockPrices[s.id];
            const hist = window.stockHistory[s.id];
            const port = window.state.portfolio[s.id] || { shares: 0, totalSpent: 0 };
            const multArg = window.stockMultiplier === 'max' ? "'max'" : "1";
            const btnLabel = window.stockMultiplier === 'max' ? "MAX" : "x1";

            let icon = '';
            let colorClass = 'text-slate-200';
            if (hist === 1) { icon = '▲'; colorClass = 'text-emerald-400'; }
            else if (hist === -1) { icon = '▼'; colorClass = 'text-red-400'; }

            let plHtml = '';
            if (port.shares > 0) {
                const avg = port.totalSpent / port.shares;
                const val = port.shares * price;
                const diff = val - port.totalSpent;
                const diffPerc = (diff / port.totalSpent) * 100;
                const plClass = diff >= 0 ? 'text-emerald-500' : 'text-red-500';
                const plSign = diff >= 0 ? '+' : '';
                plHtml = `<div class="mt-2 text-[10px] sm:text-xs text-slate-400 border-t border-slate-700/50 pt-2 flex justify-between">
                    <span>Avg: ${this.formatMoney(avg)}</span> 
                    <span class="font-bold font-mono ${plClass}">P/L: ${plSign}${this.formatMoney(diff)} (${plSign}${diffPerc.toFixed(1)}%)</span>
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
                        <div class="font-mono text-sm sm:text-base font-bold ${colorClass} transition-colors mb-2">
                            ${icon} ${this.formatMoney(price)}
                        </div>
                        <div class="flex gap-2 w-full justify-end">
                            <button onclick="window.logic.sellStock('${s.id}', ${multArg})" class="flex-1 w-16 py-1.5 bg-red-900/40 hover:bg-red-800/60 border border-red-800/50 rounded shadow-sm text-xs font-bold text-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" ${port.shares <= 0 ? 'disabled' : ''}>
                                SELL ${btnLabel}
                            </button>
                            <button onclick="window.logic.buyStock('${s.id}', ${multArg})" class="flex-1 w-16 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded shadow-sm text-xs font-bold text-white transition-all disabled:opacity-50" ${window.state.balance < price ? 'disabled' : ''}>
                                BUY ${btnLabel}
                            </button>
                        </div>
                    </div>
                </div>
                ${plHtml}
            </div>
            `;
        });
        el.stockListContainer.innerHTML = html;
    },

    renderLogs() {
        const el = this.elements;
        if (!el.activityLogList) return;
        el.activityLogList.innerHTML = '';
        window.state.logs.forEach(log => {
            const div = document.createElement('div');
            div.className = `flex justify-between items-center ${log.colorClass}`;
            div.innerHTML = `<span>${log.msg}</span><span class="text-slate-600 ml-2">${log.time}</span>`;
            el.activityLogList.appendChild(div);
        });
    },

    renderSlotsResult(r1, r2, r3, msg, color) {
        const el = this.elements;
        const containers = [
            { el: document.getElementById('slot1-container'), val: r1, time: 1.5 },
            { el: document.getElementById('slot2-container'), val: r2, time: 2.5 },
            { el: document.getElementById('slot3-container'), val: r3, time: 3.5 }
        ];

        const symbols = ['🎰', '💎', '🍒', '7️⃣'];

        if (el.slotResult) {
            el.slotResult.innerText = "SPINNING...";
            el.slotResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 text-violet-400 animate-pulse`;
        }

        containers.forEach(c => {
            if (!c.el) return;
            // Clean up any old jitter from previous bugs
            if (c.el.parentElement.classList.contains('spinning')) {
                c.el.parentElement.classList.remove('spinning');
            }

            // Calculate number of items for constant velocity across different durations
            const numItems = Math.floor(c.time * 25);
            let reelHtml = '<div class="reel-inner flex flex-col items-center w-full">';
            // Padding item so bounce doesn't expose empty space at the top
            reelHtml += `<span class="h-10 flex items-center justify-center">${symbols[Math.floor(Math.random() * symbols.length)]}</span>`;
            // The actual target symbol
            reelHtml += `<span class="h-10 flex items-center justify-center">${c.val}</span>`;
            // Random blurring items below
            for (let i = 0; i < numItems; i++) {
                reelHtml += `<span class="h-10 flex items-center justify-center">${symbols[Math.floor(Math.random() * symbols.length)]}</span>`;
            }
            reelHtml += '</div>';

            c.el.innerHTML = reelHtml;
            const inner = c.el.querySelector('.reel-inner');
            inner.style.transform = 'translateY(0)';
            inner.style.animation = 'none';
            inner.classList.remove('slot-reel-stop');

            // Apply jitter class directly to the specific slot wrapper, not the whole window
            c.el.classList.add('spinning');

            void inner.offsetWidth;

            const itemHeight = inner.lastElementChild.offsetHeight || 40;
            const containerHeight = c.el.offsetHeight || 48;
            const offset = (containerHeight - itemHeight) / 2;

            // Start at the bottom (showing the last generated random items)
            const startPos = -(inner.scrollHeight - containerHeight);
            // End matching the target (index 1 = itemHeight)
            const endPos = -(itemHeight - offset);

            inner.style.setProperty('--spin-duration', `${c.time}s`);
            inner.style.setProperty('--reel-start-position', `${startPos}px`);
            inner.style.setProperty('--reel-end-position', `${endPos}px`);
            inner.classList.add('slot-reel');
            inner.style.animation = `reelSpin ${c.time}s cubic-bezier(0.1, 0.1, 0.2, 1) forwards`;

            setTimeout(() => {
                inner.classList.remove('slot-reel');
                inner.classList.add('slot-reel-stop');
                inner.style.animation = 'none';
                void inner.offsetWidth;
                inner.style.animation = `slot-clunk 0.3s ease-out forwards`;
                c.el.classList.remove('spinning');
            }, c.time * 1000);
        });

        setTimeout(() => {
            if (el.slotResult) {
                el.slotResult.innerText = msg;
                el.slotResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 ${color}`;
            }
        }, 3500);
    },

    initRouletteWheel() {
        const track = document.getElementById('rouletteRail');
        if (!track) return;
        track.innerHTML = '';
        // 15-tile CSGO pattern (1 Green, 7 Red, 7 Black alternating)
        const wheelSequence = [
            { color: 'G' }, { color: 'R' }, { color: 'B' }, { color: 'R' }, { color: 'B' },
            { color: 'R' }, { color: 'B' }, { color: 'R' }, { color: 'B' }, { color: 'R' },
            { color: 'B' }, { color: 'R' }, { color: 'B' }, { color: 'R' }, { color: 'B' }
        ];

        let fullTrack = [];
        // Repeat the sequence multiple times to create a long track for spinning
        for (let i = 0; i < 5; i++) { // 5 full rotations
            fullTrack = fullTrack.concat(wheelSequence);
        }
        // Add one more full sequence to ensure enough tiles for the ball to land
        fullTrack = fullTrack.concat(wheelSequence);


        fullTrack.forEach((item, idx) => {
            const div = document.createElement('div');
            // Added bg-cover bg-center bg-no-repeat so PNGs appear correctly inside the tile
            div.className = "w-16 h-16 mx-[2px] rounded-lg shadow-inner flex items-center justify-center flex-shrink-0 text-white font-black text-xl border-[2px] border-slate-900/50 roulette-tile bg-cover bg-center bg-no-repeat";

            let imageUrl = '';
            if (item.color === 'R') {
                imageUrl = `./Assets/roulette_red.png`;
            } else if (item.color === 'B') {
                imageUrl = `./Assets/roulette_black.png`;
            } else { // Green (0 or 00)
                imageUrl = `./Assets/roulette_green.png`;
            }
            div.style.backgroundImage = `url('${imageUrl}')`;

            div.dataset.idx = idx;
            div.dataset.color = item.color;
            track.appendChild(div);
        });
        track.style.transform = "translateX(0px)";
    },

    renderRouletteResult(msg, color, resultType) {
        const el = this.elements;
        const track = document.getElementById('rouletteRail');
        if (el.rouletteResult) {
            el.rouletteResult.innerText = "SPINNING...";
            el.rouletteResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 text-violet-400 animate-pulse`;
        }

        if (track && resultType) {
            // Determine target based on resultType (e.g., 'Red', 'Black', 'Green')
            let targetColorCode = '';

            if (resultType === 'Red') targetColorCode = 'R';
            else if (resultType === 'Black') targetColorCode = 'B';
            else if (resultType === '0' || resultType === '00' || resultType === 'Green') targetColorCode = 'G';

            const items = track.children;
            let possibleTargetIndices = [];

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (targetColorCode && item.dataset.color === targetColorCode) {
                    possibleTargetIndices.push(i);
                }
            }

            // Updated tile width: w-16 = 64px + 4px mx margins = 68px total width
            const itemWidth = 68;

            // Start offset is the continuous teleport distance
            let startPos = 0;
            const sequenceWidth = 15 * itemWidth; // 15 tiles per sequence
            let sequencesToShift = 0;
            if (track.dataset.currentDist !== undefined) {
                let prevDist = parseFloat(track.dataset.currentDist);
                // Shift by multiples of full sequences until we are near the front again
                sequencesToShift = Math.floor(Math.abs(prevDist) / sequenceWidth);
                startPos = prevDist + (sequencesToShift * sequenceWidth);
            }

            // To spin forward continuously, the target must be ahead of the startPos
            // The startPos is near index 0. We want to spin ahead by a few sequences.
            // Let's target the exact result item in the 4th sequence from the start.
            const targetSequenceOffset = 3; // Spin 3 full sequences ahead

            // Find all indices perfectly matching the color in the base sequence (0-14)
            let baseIndices = possibleTargetIndices.filter(idx => idx < 15);
            if (baseIndices.length === 0) baseIndices = [0];

            // Pick a random matching index from the base sequence
            let randomBaseIdx = baseIndices[Math.floor(Math.random() * baseIndices.length)];

            // The absolute index is the random base index + the sequences we are spinning past
            let targetIdx = randomBaseIdx + (targetSequenceOffset * 15);

            const randomOffset = Math.floor(Math.random() * 40) - 20;
            // Center calculation: track parent offset / 2, minus half a tile (34)
            const dist = -((targetIdx * itemWidth) + randomOffset) + (track.parentElement.offsetWidth / 2) - 34;

            // Trigger reflow to restart animation
            track.classList.remove('is-spinning');
            void track.offsetWidth;

            track.style.setProperty('--roulette-start-position', `${startPos}px`);
            track.style.setProperty('--roulette-end-position', `${dist}px`);
            track.dataset.currentDist = dist;

            // Add spinning class
            track.classList.add('is-spinning');

            // Track history
            if (!window.state.rouletteHistory) window.state.rouletteHistory = [];

            setTimeout(() => {
                window.state.rouletteHistory.unshift(resultType);
                if (window.state.rouletteHistory.length > 20) {
                    window.state.rouletteHistory.pop();
                }

                // Update History UI
                if (el.rouletteHistory) {
                    el.rouletteHistory.innerHTML = '';
                    window.state.rouletteHistory.forEach(r => {
                        const hDiv = document.createElement('div');
                        hDiv.className = "w-4 h-4 rounded-full flex-shrink-0 shadow-inner";
                        if (r === 'Red') hDiv.classList.add('bg-red-500');
                        else if (r === 'Black') hDiv.classList.add('bg-slate-800');
                        else hDiv.classList.add('bg-emerald-500'); // Green for '0' or '00'

                        el.rouletteHistory.appendChild(hDiv);
                    });
                }
            }, 6000);
        } else if (track) {
            this.initRouletteWheel();
            if (el.rouletteResult) {
                el.rouletteResult.innerText = "Place your bet";
                el.rouletteResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 text-slate-300`;
            }
            return;
        }

        setTimeout(() => {
            if (this.elements.rouletteResult) {
                this.elements.rouletteResult.innerText = msg;
                this.elements.rouletteResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 ${color}`;
            }
        }, 6000);
    },

    renderCardSprite(card, isHidden = false, animDelay = 0) {
        let suitColor = ['♥', '♦'].includes(card.suit) ? 'text-red-500' : 'text-slate-900';
        if (isHidden) {
            return `<div class="w-10 h-14 bg-gradient-to-br from-violet-600 to-violet-800 rounded border border-white/20 shadow-md flex items-center justify-center card-anim opacity-0" style="animation-delay: ${animDelay}s">
                <span class="text-white opacity-50">?</span>
            </div>`;
        }
        return `<div class="w-10 h-14 bg-white rounded border border-slate-300 shadow-md flex flex-col items-center justify-center card-anim py-1 relative opacity-0" style="animation-delay: ${animDelay}s">
            <span class="text-xs font-bold ${suitColor} absolute top-0.5 left-1">${card.value}</span>
            <span class="text-xl ${suitColor}">${card.suit}</span>
        </div>`;
    },

    renderBlackjack() {
        const el = this.elements;
        if (!el.bjTable) return;

        const bj = window.state.blackjack;
        if (!bj.active && bj.playerHand.length === 0) {
            el.bjTable.classList.add('hidden');
            el.bjControlsDeal.classList.remove('hidden');
            el.bjControlsPlay.classList.add('hidden');
            el.bjResult.innerText = 'Bet $1,000';
            el.bjResult.className = 'text-xs font-bold uppercase tracking-widest h-4 mb-4 text-center text-slate-300';
            return;
        }

        el.bjTable.classList.remove('hidden');
        if (bj.active) {
            el.bjControlsDeal.classList.add('hidden');
            el.bjControlsPlay.classList.remove('hidden');
            el.bjDealerHand.innerHTML = this.renderCardSprite(bj.dealerHand[0], false, 0) + this.renderCardSprite({}, true, 0.2);
            el.bjDealerScore.innerText = '?';
        } else {
            el.bjControlsDeal.classList.remove('hidden');
            el.bjControlsPlay.classList.add('hidden');
            el.bjDealerHand.innerHTML = bj.dealerHand.map((c, i) => this.renderCardSprite(c, false, i * 0.1)).join('');
            el.bjDealerScore.innerText = window.logic.calcHand(bj.dealerHand);

            el.bjResult.innerText = bj.status;
            let resColor = 'text-slate-300';
            if (bj.status.includes('Win') || bj.status.includes('BLACKJACK')) resColor = 'text-emerald-400';
            if (bj.status.includes('Lost') || bj.status.includes('Bust')) resColor = 'text-red-400';
            if (bj.status.includes('Push')) resColor = 'text-amber-400';
            el.bjResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 text-center ${resColor}`;
        }

        el.bjPlayerHand.innerHTML = bj.playerHand.map((c, i) => this.renderCardSprite(c, false, i * 0.1)).join('');
        el.bjPlayerScore.innerText = window.logic.calcHand(bj.playerHand);
    },

    renderProfile() {
        const el = this.elements;
        if (!el.statRank) return;

        el.statRank.innerText = window.state.rank || 'Novice Hustler';
        el.statTotalEarnings.innerText = this.formatMoney(window.state.lifetimeEarnings || 0);
        el.statTotalClicks.innerText = window.state.totalClicks || 0;

        const cpl = window.state.casinoProfitLoss || 0;
        if (el.statCasinoPL) {
            el.statCasinoPL.innerText = cpl >= 0 ? `+${this.formatMoney(cpl)}` : `-${this.formatMoney(Math.abs(cpl))}`;
            el.statCasinoPL.className = cpl >= 0 ? 'font-mono text-emerald-400 font-bold' : 'font-mono text-red-400 font-bold';
        }
    },

    updateUI() {
        this.syncVisualsSilently();
        if (window.state.activeTab === 'invest') this.renderMarket();
    },

    syncVisualsSilently() {
        const el = this.elements;
        const l = window.logic;

        if (el.balanceDisplay) el.balanceDisplay.innerText = this.formatMoney(window.state.balance);
        if (el.passiveIncomeDisplay) el.passiveIncomeDisplay.innerText = '+' + this.formatMoney(l.getPassiveIncome()) + ' /s';

        if (window.state.activeTab === 'vault') this.renderBusinesses();

        if (el.buyLicenseBtn) el.buyLicenseBtn.disabled = window.state.balance < 2500;

        // Re-render buttons that depend on balance using logic hooks
        if (window.state.activeTab === 'market' && window.state.carDealership) {
            // The repair buttons inside renderGarage need bal check
            const needsBalRepRender = window.state.carDealership.some(c => c.status === 'needs_repair');
            if (needsBalRepRender) this.renderGarage();
        }

        if (el.buyCasinoBtn) el.buyCasinoBtn.disabled = window.state.balance < 10000;
        const sBet = parseInt(el.slotsBetInput?.value) || 10;
        const rBet = parseInt(el.rouletteBetInput?.value) || 10;
        const bBet = parseInt(el.bjBetInput?.value) || 10;

        if (el.spinSlotsBtn) el.spinSlotsBtn.disabled = window.state.balance < sBet || sBet < 10;
        if (el.btnBetRed) el.btnBetRed.disabled = window.state.balance < rBet || rBet < 10;
        if (el.btnBetBlack) el.btnBetBlack.disabled = window.state.balance < rBet || rBet < 10;
        if (el.btnBetGreen) el.btnBetGreen.disabled = window.state.balance < rBet || rBet < 10;
        if (el.btnBjDeal && (!window.state.blackjack || !window.state.blackjack.active)) {
            el.btnBjDeal.disabled = window.state.balance < bBet || bBet < 10;
        }

        this.updateDealerBadge();
    },

    showSaveIndicator() {
        const el = this.elements;
        if (!el.saveIndicator || !el.saveDot) return;

        el.saveIndicator.childNodes[1].textContent = " Just Saved";
        el.saveDot.classList.replace('bg-slate-600', 'bg-emerald-500');
        el.saveIndicator.classList.replace('text-slate-600', 'text-emerald-500');

        setTimeout(() => {
            el.saveIndicator.childNodes[1].textContent = " Synced";
            el.saveDot.classList.replace('bg-emerald-500', 'bg-slate-600');
            el.saveIndicator.classList.replace('text-emerald-500', 'text-slate-600');
        }, 1500);
    },

    triggerBalancePulse(color) {
        const el = this.elements;
        if (!el.balanceDisplay) return;
        el.balanceDisplay.classList.remove('animate-flash-green', 'animate-flash-red');
        void el.balanceDisplay.offsetWidth;
        el.balanceDisplay.classList.add(color === 'green' ? 'animate-flash-green' : 'animate-flash-red');
    },

    showToast(msg) {
        const el = this.elements;
        if (!el.toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'bg-red-900 border border-red-500 text-white px-4 py-2 rounded-xl shadow-lg font-bold text-sm tracking-wide animate-toast pointer-events-none flex items-center gap-2';
        toast.innerHTML = `<svg class="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>${msg}`;
        el.toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    createParticle(e, text) {
        const particle = document.createElement('div');
        particle.innerText = text;
        particle.className = 'absolute text-amber-500 font-bold text-lg pointer-events-none particle z-50 drop-shadow-md';

        const rect = this.elements.workBtn?.getBoundingClientRect();
        if (!rect) return;

        let startX = e.clientX;
        let startY = e.clientY;

        if (e.clientX === 0 && e.clientY === 0) {
            startX = rect.left + rect.width / 2;
            startY = rect.top + rect.height / 2;
        }

        const rx = (Math.random() - 0.5) * 60;
        const ry = (Math.random() - 0.5) * 30;

        particle.style.left = `${startX + rx}px`;
        particle.style.top = `${startY + ry - 20}px`;

        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
};

window.ui = ui;
