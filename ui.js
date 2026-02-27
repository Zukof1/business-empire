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
            buyStoreBtn: document.getElementById('buyStoreBtn'),
            storeCostDisplay: document.getElementById('storeCostDisplay'),
            storeCountDisplay: document.getElementById('storeCountDisplay'),
            storeProgressBar: document.getElementById('storeProgressBar'),

            saveIndicator: document.getElementById('saveIndicator'),
            saveDot: document.getElementById('saveDot'),

            navVault: document.getElementById('navVault'),
            navMarket: document.getElementById('navMarket'),
            navInvest: document.getElementById('navInvest'),

            vaultView: document.getElementById('vaultView'),
            marketView: document.getElementById('marketView'),
            investView: document.getElementById('investView'),

            headerTitle: document.getElementById('headerTitle'),
            licenseBadge: document.getElementById('licenseBadge'),
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
            auctionResult: document.getElementById('auctionResult'),
            auctionLot: document.getElementById('auctionLot'),
            auctionCarName: document.getElementById('auctionCarName'),
            auctionCarIcon: document.getElementById('auctionCarIcon'),
            auctionPrice: document.getElementById('auctionPrice'),
            buyAuctionBtn: document.getElementById('buyAuctionBtn'),
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
        el.buyStoreBtn?.addEventListener('click', () => l.buyStore());

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
        el.buyAuctionBtn?.addEventListener('click', () => l.buyAuction());
        el.payForRepairBtn?.addEventListener('click', () => l.payForRepair());
        el.sellCarBtn?.addEventListener('click', () => l.sellCar());

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

        if (window.state.hasDealerLicense) {
            el.licenseBadge?.classList.add('hidden');
        } else {
            el.licenseBadge?.classList.remove('hidden');
        }

        if (tabId === 'vault') {
            el.navVault?.classList.add('active', 'opacity-100');
            el.navVault?.classList.remove('opacity-40');
            el.navVault?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-white');
            el.navVault?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-white');
            el.vaultView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Vault Balance";
        } else if (tabId === 'market') {
            el.navMarket?.classList.add('active', 'opacity-100');
            el.navMarket?.classList.remove('opacity-40');
            el.navMarket?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-white');
            el.navMarket?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-white');
            el.marketView?.classList.remove('hidden');
            if (el.headerTitle) el.headerTitle.innerText = "Available Capital";

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

    renderAuction() {
        const el = this.elements;
        if (!el.auctionResult) return;

        if (window.state.auctionCar) {
            if (el.auctionLot) el.auctionLot.innerText = Math.floor(Math.random() * 9000 + 1000);
            if (el.auctionCarName) el.auctionCarName.innerText = window.state.auctionCar.name;
            if (el.auctionCarIcon) el.auctionCarIcon.innerText = window.state.auctionCar.icon;
            if (el.auctionPrice) el.auctionPrice.innerText = this.formatMoney(window.state.auctionCar.price);

            el.auctionResult.classList.remove('hidden');
            setTimeout(() => {
                el.auctionResult.classList.remove('opacity-0', 'translate-y-2');
                el.auctionResult.classList.add('opacity-100', 'translate-y-0');
            }, 10);
        } else {
            el.auctionResult.classList.add('opacity-0', 'translate-y-2');
            setTimeout(() => {
                el.auctionResult.classList.add('hidden');
            }, 300);
        }

        if (window.state.carDealership) {
            el.auctionSection?.classList.add('opacity-50', 'pointer-events-none');
        } else {
            el.auctionSection?.classList.remove('opacity-50', 'pointer-events-none');
        }
    },

    renderGarage() {
        const el = this.elements;
        if (!el.garageStatus) return;

        if (!window.state.carDealership) {
            el.garageEmptyState?.classList.remove('hidden');
            el.garageActiveState?.classList.add('hidden');
            el.garageStatus.innerText = 'Empty';
            el.garageStatus.classList.replace('text-emerald-400', 'text-slate-500');
            el.garageStatus.classList.replace('text-red-400', 'text-slate-500');
            el.garageStatus.classList.replace('text-orange-400', 'text-slate-500');
        } else {
            el.garageEmptyState?.classList.add('hidden');
            el.garageActiveState?.classList.remove('hidden');

            if (el.garageCarName) el.garageCarName.innerText = window.state.carDealership.name;
            if (el.garageCarIcon) el.garageCarIcon.innerText = window.state.carDealership.icon;
            if (el.garageBuyPrice) el.garageBuyPrice.innerText = this.formatMoney(window.state.carDealership.buyPrice);
            if (el.garageSellPrice) el.garageSellPrice.innerText = this.formatMoney(window.state.carDealership.sellPrice);

            el.garageRestoring?.classList.add('hidden');
            el.garageReady?.classList.add('hidden');
            el.garageNeedsRepair?.classList.add('hidden');

            if (window.state.carDealership.status === 'restoring') {
                el.garageStatus.innerText = 'Restoring';
                el.garageStatus.classList.replace('text-emerald-400', 'text-orange-400');
                el.garageStatus.classList.replace('text-red-400', 'text-orange-400');
                el.garageStatus.classList.replace('text-slate-500', 'text-orange-400');
                el.garageRestoring?.classList.remove('hidden');
            }
            else if (window.state.carDealership.status === 'needs_repair') {
                el.garageStatus.innerText = 'Fault Found';
                el.garageStatus.classList.replace('text-orange-400', 'text-red-400');
                el.garageNeedsRepair?.classList.remove('hidden');
                el.garageNeedsRepair?.classList.add('flex');
            }
            else if (window.state.carDealership.status === 'ready') {
                el.garageStatus.innerText = 'Ready to Sell';
                el.garageStatus.classList.replace('text-orange-400', 'text-emerald-400');
                el.garageReady?.classList.remove('hidden');
                el.garageReady?.classList.add('flex');
            }
        }
        if (window.state.activeTab === 'market') this.renderAuction();
    },

    renderMarket() {
        const el = this.elements;
        if (!el.stockListContainer) return;

        if (el.portfolioValueDisplay) {
            el.portfolioValueDisplay.innerText = 'Port: ' + this.formatMoney(window.logic.getPortfolioValue());
        }

        let html = '';
        if (!window.state.portfolio) window.state.portfolio = {};

        window.MARKET_DATA.forEach(s => {
            const price = window.stockPrices[s.id];
            const hist = window.stockHistory[s.id];
            const port = window.state.portfolio[s.id] || { shares: 0, totalSpent: 0 };

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
                plHtml = `<div class="mt-2 text-[10px] sm:text-xs text-slate-400 border-t border-slate-700/50 pt-2">
                    Avg: ${this.formatMoney(avg)} | 
                    P/L: <span class="font-bold font-mono ${plClass}">${plSign}${this.formatMoney(diff)} (${plSign}${diffPerc.toFixed(1)}%)</span>
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
                            ${icon} ${this.formatMoney(price)}
                        </div>
                        <div class="flex gap-2">
                            <button onclick="window.logic.sellStock('${s.id}')" class="mt-1 px-4 py-1.5 bg-red-900/40 hover:bg-red-800/60 border border-red-800/50 rounded shadow-sm text-xs font-bold text-red-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed" ${port.shares <= 0 ? 'disabled' : ''}>
                                SELL
                            </button>
                            <button onclick="window.logic.buyStock('${s.id}')" class="mt-1 px-4 py-1.5 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded shadow-sm text-xs font-bold text-white transition-all disabled:opacity-50" ${window.state.balance < price ? 'disabled' : ''}>
                                BUY
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

        const cost = l.getStoreCost();
        if (el.storeCostDisplay) el.storeCostDisplay.innerText = this.formatMoney(cost);
        if (el.storeCountDisplay) el.storeCountDisplay.innerText = `${window.state.retailStores} Active`;

        const cVal = l.getClickValue();
        if (el.clickValueDisplay) el.clickValueDisplay.innerText = `+$${cVal}`;
        if (el.efficiencyDisplay) el.efficiencyDisplay.innerText = `Efficiency: Lvl ${cVal}`;

        if (el.buyStoreBtn) el.buyStoreBtn.disabled = window.state.balance < cost;
        if (el.buyLicenseBtn) el.buyLicenseBtn.disabled = window.state.balance < 2500;
        if (el.buyAuctionBtn && window.state.auctionCar) el.buyAuctionBtn.disabled = window.state.balance < window.state.auctionCar.price;
        if (el.payForRepairBtn && window.state.carDealership && window.state.carDealership.status === 'needs_repair') {
            el.payForRepairBtn.disabled = window.state.balance < 300;
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
