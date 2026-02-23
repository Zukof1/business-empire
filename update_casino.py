import os

base_dir = r'C:\Users\faizy\.gemini\antigravity\scratch\business-empire'

# --- 1. Update index.html ---
index_path = os.path.join(base_dir, 'index.html')
with open(index_path, 'r', encoding='utf-8') as f:
    index_content = f.read()

nav_old = """                    <button id="navInvest"
                        class="flex flex-col items-center gap-1 group nav-btn opacity-40 hover:opacity-100 transition-opacity flex">
                        <svg class="w-6 h-6 nav-icon text-slate-400 transition-colors" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span
                            class="text-[10px] font-bold text-slate-400 uppercase tracking-wider nav-text transition-colors">Trade</span>
                    </button>"""
nav_new = """                    <button id="navInvest" class="flex flex-col items-center gap-1 group nav-btn opacity-40 hover:opacity-100 transition-opacity">
                        <svg class="w-6 h-6 nav-icon text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                        </svg>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider nav-text transition-colors">Trade</span>
                    </button>
                    <button id="navCasino" class="flex flex-col items-center gap-1 group nav-btn opacity-40 hover:opacity-100 transition-opacity">
                        <svg class="w-6 h-6 nav-icon text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                        </svg>
                        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider nav-text transition-colors">Casino</span>
                        <div id="casinoBadge" class="absolute top-[8px] right-[25%] w-2 h-2 bg-red-500 rounded-full border border-slate-900"></div>
                    </button>"""
index_content = index_content.replace(nav_old, nav_new)
index_content = index_content.replace('<div class="flex gap-6">', '<div class="flex gap-4">')

casino_view = """
        <!-- Main Content (Casino) -->
        <main id="casinoView" class="hidden flex-1 overflow-y-auto px-6 py-2 pb-24 space-y-6 no-scrollbar relative z-10 transition-colors duration-500">
            <!-- Casino Gate -->
            <div id="casinoGate" class="absolute inset-0 z-50 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                <div class="w-20 h-20 bg-violet-900 rounded-full flex items-center justify-center mb-4 border-2 border-violet-500 shadow-[0_0_20px_rgba(139,92,246,0.5)] text-4xl">🎲</div>
                <h2 class="text-2xl font-bold text-white mb-2 tracking-wide drop-shadow-[0_0_8px_rgba(167,139,250,0.8)]">Neon District</h2>
                <p class="text-violet-300 text-sm mb-6 max-w-[250px]">Exclusive high-stakes lounge. High Roller Membership required for entry.</p>
                <div class="bg-violet-950/80 border border-violet-800 p-4 rounded-2xl w-full max-w-[280px] mb-6 shadow-md">
                    <div class="flex justify-between items-center mb-1">
                        <span class="text-violet-400 text-xs font-bold uppercase tracking-widest">Membership</span>
                        <span class="text-fuchsia-400 font-mono font-bold">$10,000.00</span>
                    </div>
                </div>
                <button id="buyCasinoBtn" class="w-full max-w-[280px] py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(192,38,211,0.4)] hover:shadow-[0_0_25px_rgba(192,38,211,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Buy VIP Access
                </button>
            </div>

            <div id="casinoContent" class="hidden space-y-8">
                <!-- Slots -->
                <section>
                    <div class="flex items-center justify-between px-1 mb-2">
                        <h2 class="text-violet-400 text-xs font-bold uppercase tracking-widest">High-Limit Slots</h2>
                    </div>
                    <div class="bg-violet-950/50 border border-violet-800/80 p-5 rounded-2xl shadow-[0_0_15px_rgba(139,92,246,0.15)] flex flex-col items-center">
                        <div class="flex gap-4 mb-4 text-4xl bg-slate-950 p-4 rounded-xl border-y border-violet-500/50 w-full justify-center shadow-inner">
                            <span id="slot1">❓</span>
                            <span id="slot2">❓</span>
                            <span id="slot3">❓</span>
                        </div>
                        <p id="slotResult" class="text-xs font-bold uppercase tracking-widest h-4 mb-4 text-violet-300"></p>
                        <button id="spinSlotsBtn" class="w-full py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_15px_rgba(217,70,239,0.3)] disabled:opacity-50">
                            Spin ($100)
                        </button>
                    </div>
                </section>

                <!-- Roulette -->
                <section>
                    <div class="flex items-center justify-between px-1 mb-2">
                        <h2 class="text-violet-400 text-xs font-bold uppercase tracking-widest">Roulette</h2>
                    </div>
                    <div class="bg-violet-950/50 border border-violet-800/80 p-4 rounded-2xl shadow-[0_0_15px_rgba(139,92,246,0.15)] flex flex-col items-center">
                        <p id="rouletteResult" class="text-xs font-bold uppercase tracking-widest h-4 mb-4 text-slate-300">Place your bet</p>
                        <div class="flex gap-3 w-full">
                            <button id="btnBetRed" class="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_10px_rgba(220,38,38,0.4)] disabled:opacity-50">
                                Red ($500)
                            </button>
                            <button id="btnBetBlack" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white border border-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_10px_rgba(0,0,0,0.5)] disabled:opacity-50">
                                Black ($500)
                            </button>
                        </div>
                    </div>
                </section>

                <!-- Blackjack -->
                <section>
                    <div class="flex items-center justify-between px-1 mb-2">
                        <h2 class="text-violet-400 text-xs font-bold uppercase tracking-widest">VIP Blackjack</h2>
                    </div>
                    <div class="bg-violet-950/50 border border-violet-800/80 p-4 rounded-2xl shadow-[0_0_15px_rgba(139,92,246,0.15)] flex flex-col">
                        
                        <div id="bjTable" class="hidden flex-col gap-4 mb-4">
                            <div class="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                                <span class="text-xs text-slate-400 font-bold uppercase">Dealer: <span id="bjDealerScore" class="text-white">?</span></span>
                                <div id="bjDealerHand" class="flex gap-1 text-lg"></div>
                            </div>
                            <div class="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                                <span class="text-xs text-slate-400 font-bold uppercase">You: <span id="bjPlayerScore" class="text-white">0</span></span>
                                <div id="bjPlayerHand" class="flex gap-1 text-lg"></div>
                            </div>
                        </div>

                        <p id="bjResult" class="text-xs font-bold uppercase tracking-widest h-4 mb-4 text-center text-slate-300">Bet $1,000</p>
                        
                        <div id="bjControlsDeal" class="flex gap-3 w-full">
                            <button id="btnBjDeal" class="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] disabled:opacity-50">
                                Deal ($1,000)
                            </button>
                        </div>
                        <div id="bjControlsPlay" class="hidden flex gap-3 w-full">
                            <button id="btnBjHit" class="flex-1 py-3 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all">
                                Hit
                            </button>
                            <button id="btnBjStand" class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 rounded-xl font-bold uppercase tracking-widest text-xs transition-all">
                                Stand
                            </button>
                        </div>

                    </div>
                </section>
            </div>
        </main>

        <!-- Fixed Footer / Nav -->
"""
index_content = index_content.replace('<!-- Fixed Footer / Nav -->', casino_view, 1) # Only replace the first one before footer

# Optional theme transition support on App Container
index_content = index_content.replace('bg-slate-900 min-h-[85vh]', 'bg-slate-900 min-h-[85vh] transition-colors duration-500')

with open(index_path, 'w', encoding='utf-8') as f:
    f.write(index_content)


# --- 2. Update state.js ---
state_path = os.path.join(base_dir, 'state.js')
with open(state_path, 'r', encoding='utf-8') as f:
    state_content = f.read()

state_old = """    hasDealerLicense: false,
    logs: [],
    portfolio: {}"""
state_new = """    hasDealerLicense: false,
    hasCasinoMembership: false,
    logs: [],
    portfolio: {},
    blackjack: { active: false, playerHand: [], dealerHand: [], status: '' }"""
state_content = state_content.replace(state_old, state_new)

with open(state_path, 'w', encoding='utf-8') as f:
    f.write(state_content)


# --- 3. Update logic.js ---
logic_path = os.path.join(base_dir, 'logic.js')
with open(logic_path, 'r', encoding='utf-8') as f:
    logic_content = f.read()

casino_logic = """
    buyCasinoMembership() {
        if (window.state.balance >= 10000) {
            window.state.balance -= 10000;
            window.state.hasCasinoMembership = true;
            this.logEvent(`Purchased High Roller Membership ($10,000)`, "text-fuchsia-400");
            if (window.ui) {
                window.ui.updateUI();
                window.ui.switchTab('casino');
            }
        }
    },

    spinSlots() {
        if (window.state.balance >= 100) {
            window.state.balance -= 100;
            const symbols = ['🎰', '💎', '🍒', '7️⃣'];
            const r1 = symbols[Math.floor(Math.random() * symbols.length)];
            const r2 = symbols[Math.floor(Math.random() * symbols.length)];
            const r3 = symbols[Math.floor(Math.random() * symbols.length)];
            
            let winText = "No luck.";
            let color = "text-slate-400";
            
            if (r1 === r2 && r2 === r3) {
                if (r1 === '7️⃣') {
                    window.state.balance += 5000;
                    winText = "JACKPOT! +$5,000";
                    color = "text-fuchsia-400";
                    this.logEvent(`Casino Jackpot! +$5,000`, "text-fuchsia-400");
                    if(window.ui) window.ui.triggerBalancePulse('green');
                } else {
                    window.state.balance += 1000;
                    winText = "WINNER! +$1,000";
                    color = "text-emerald-400";
                    this.logEvent(`Casino slots win! +$1,000`, "text-emerald-400");
                    if(window.ui) window.ui.triggerBalancePulse('green');
                }
            } else {
                if(window.ui) window.ui.triggerBalancePulse('red');
            }

            if (window.ui) {
                window.ui.renderSlotsResult(r1, r2, r3, winText, color);
                window.ui.updateUI();
            }
        }
    },

    playRoulette(color) {
        if (window.state.balance >= 500) {
            window.state.balance -= 500;
            // 48% chance to win
            const win = Math.random() < 0.48;
            let msg = '';
            let tColor = '';
            
            if (win) {
                window.state.balance += 1000; // 2x payout on 500
                msg = `Won! +$1,000 (${color})`;
                tColor = "text-emerald-400";
                this.logEvent(`Roulette Win: +$1,000`, "text-emerald-400");
                if(window.ui) window.ui.triggerBalancePulse('green');
            } else {
                msg = `Lost $500 (${color})`;
                tColor = "text-red-400";
                this.logEvent(`Roulette Loss: -$500`, "text-red-400");
                if(window.ui) window.ui.triggerBalancePulse('red');
            }
            
            if (window.ui) {
                window.ui.renderRouletteResult(msg, tColor);
                window.ui.updateUI();
            }
        }
    },

    // Simplified Blackjack
    getCard() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        const v = values[Math.floor(Math.random() * values.length)];
        const s = suits[Math.floor(Math.random() * suits.length)];
        return { value: v, suit: s };
    },
    
    calcHand(hand) {
        let sum = 0;
        let aces = 0;
        hand.forEach(c => {
            if (['J','Q','K'].includes(c.value)) sum += 10;
            else if (c.value === 'A') { sum += 11; aces += 1; }
            else sum += parseInt(c.value);
        });
        while (sum > 21 && aces > 0) {
            sum -= 10;
            aces -= 1;
        }
        return sum;
    },

    bjDeal() {
        if (window.state.balance >= 1000 && !window.state.blackjack.active) {
            window.state.balance -= 1000;
            if(window.ui) window.ui.triggerBalancePulse('red');
            window.state.blackjack = {
                active: true,
                playerHand: [this.getCard(), this.getCard()],
                dealerHand: [this.getCard()],
                status: 'Playing'
            };
            
            if (this.calcHand(window.state.blackjack.playerHand) === 21) {
                window.state.blackjack.active = false;
                window.state.balance += 2500; // Blackjack 2.5x payout ($1k -> $2.5k)
                window.state.blackjack.status = 'BLACKJACK! +$2,500';
                this.logEvent(`Blackjack dealt! +$2,500`, "text-fuchsia-400");
                if(window.ui) window.ui.triggerBalancePulse('green');
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
                window.state.blackjack.status = 'Bust! Lost $1,000';
                this.logEvent(`Blackjack Bust! -$1,000`, "text-red-400");
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
            while(this.calcHand(dHand) < 17) {
                dHand.push(this.getCard());
            }
            
            const pScore = this.calcHand(window.state.blackjack.playerHand);
            const dScore = this.calcHand(dHand);
            
            window.state.blackjack.active = false;
            if (dScore > 21 || pScore > dScore) {
                window.state.balance += 2000;
                window.state.blackjack.status = 'You Win! +$2,000';
                this.logEvent(`Blackjack Win! +$2,000`, "text-emerald-400");
                if(window.ui) window.ui.triggerBalancePulse('green');
            } else if (pScore === dScore) {
                window.state.balance += 1000;
                window.state.blackjack.status = 'Push. Refunded $1,000';
            } else {
                window.state.blackjack.status = 'Dealer Wins. Lost $1,000';
                this.logEvent(`Blackjack Loss! -$1,000`, "text-red-400");
            }
            
            if (window.ui) {
                window.ui.renderBlackjack();
                window.ui.updateUI();
            }
        }
    },
"""
logic_content = logic_content.replace('buyAuction() {', casino_logic + '\n    buyAuction() {')
with open(logic_path, 'w', encoding='utf-8') as f:
    f.write(logic_content)


# --- 4. Update ui.js ---
ui_path = os.path.join(base_dir, 'ui.js')
with open(ui_path, 'r', encoding='utf-8') as f:
    ui_content = f.read()

ui_cache_old = """            stockListContainer: document.getElementById('stockListContainer'),
            portfolioValueDisplay: document.getElementById('portfolioValueDisplay'),
            toastContainer: document.getElementById('toastContainer')"""
ui_cache_new = """            stockListContainer: document.getElementById('stockListContainer'),
            portfolioValueDisplay: document.getElementById('portfolioValueDisplay'),
            toastContainer: document.getElementById('toastContainer'),
            
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
            
            rouletteResult: document.getElementById('rouletteResult'),
            btnBetRed: document.getElementById('btnBetRed'),
            btnBetBlack: document.getElementById('btnBetBlack'),
            
            bjTable: document.getElementById('bjTable'),
            bjDealerScore: document.getElementById('bjDealerScore'),
            bjDealerHand: document.getElementById('bjDealerHand'),
            bjPlayerScore: document.getElementById('bjPlayerScore'),
            bjPlayerHand: document.getElementById('bjPlayerHand'),
            bjResult: document.getElementById('bjResult'),
            bjControlsDeal: document.getElementById('bjControlsDeal'),
            bjControlsPlay: document.getElementById('bjControlsPlay'),
            btnBjDeal: document.getElementById('btnBjDeal'),
            btnBjHit: document.getElementById('btnBjHit'),
            btnBjStand: document.getElementById('btnBjStand')"""
ui_content = ui_content.replace(ui_cache_old, ui_cache_new)

ui_bind_old = """        el.buyAuctionBtn?.addEventListener('click', () => l.buyAuction());
        el.payForRepairBtn?.addEventListener('click', () => l.payForRepair());
        el.sellCarBtn?.addEventListener('click', () => l.sellCar());"""
ui_bind_new = """        el.buyAuctionBtn?.addEventListener('click', () => l.buyAuction());
        el.payForRepairBtn?.addEventListener('click', () => l.payForRepair());
        el.sellCarBtn?.addEventListener('click', () => l.sellCar());

        el.navCasino?.addEventListener('click', () => this.switchTab('casino'));
        el.buyCasinoBtn?.addEventListener('click', () => l.buyCasinoMembership());
        el.spinSlotsBtn?.addEventListener('click', () => l.spinSlots());
        el.btnBetRed?.addEventListener('click', () => l.playRoulette('Red'));
        el.btnBetBlack?.addEventListener('click', () => l.playRoulette('Black'));
        el.btnBjDeal?.addEventListener('click', () => l.bjDeal());
        el.btnBjHit?.addEventListener('click', () => l.bjHit());
        el.btnBjStand?.addEventListener('click', () => l.bjStand());"""
ui_content = ui_content.replace(ui_bind_old, ui_bind_new)

ui_tab_old = """        [el.navVault, el.navMarket, el.navInvest].forEach(btn => {
            if(!btn) return;
            btn.classList.remove('active', 'opacity-100');
            btn.classList.add('opacity-40');
            btn.querySelector('.nav-icon')?.classList.replace('text-white', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-white', 'text-slate-400');
        });

        if(el.vaultView) el.vaultView.classList.add('hidden');
        if(el.marketView) el.marketView.classList.add('hidden');
        if(el.investView) el.investView.classList.add('hidden');"""
ui_tab_new = """        [el.navVault, el.navMarket, el.navInvest, el.navCasino].forEach(btn => {
            if(!btn) return;
            btn.classList.remove('active', 'opacity-100');
            btn.classList.add('opacity-40');
            btn.querySelector('.nav-icon')?.classList.replace('text-white', 'text-slate-400');
            btn.querySelector('.nav-icon')?.classList.replace('text-fuchsia-400', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-white', 'text-slate-400');
            btn.querySelector('.nav-text')?.classList.replace('text-fuchsia-400', 'text-slate-400');
        });

        if(el.vaultView) el.vaultView.classList.add('hidden');
        if(el.marketView) el.marketView.classList.add('hidden');
        if(el.investView) el.investView.classList.add('hidden');
        if(el.casinoView) el.casinoView.classList.add('hidden');
        
        // Reset app bg
        const appContainer = document.querySelector('.bg-slate-900, .bg-violet-950');
        if(appContainer) {
            if(tabId === 'casino') {
                appContainer.classList.add('bg-violet-950');
                appContainer.classList.remove('bg-slate-900');
            } else {
                appContainer.classList.add('bg-slate-900');
                appContainer.classList.remove('bg-violet-950');
            }
        }"""
ui_content = ui_content.replace(ui_tab_old, ui_tab_new)

ui_tab2_old = """            if(el.headerTitle) el.headerTitle.innerText = "Equities Portfolio";
            this.renderMarket();
        }"""
ui_tab2_new = """            if(el.headerTitle) el.headerTitle.innerText = "Equities Portfolio";
            this.renderMarket();
        } else if (tabId === 'casino') {
            el.navCasino?.classList.add('active', 'opacity-100');
            el.navCasino?.classList.remove('opacity-40');
            el.navCasino?.querySelector('.nav-icon')?.classList.replace('text-slate-400', 'text-fuchsia-400');
            el.navCasino?.querySelector('.nav-text')?.classList.replace('text-slate-400', 'text-fuchsia-400');
            el.casinoView?.classList.remove('hidden');
            if(el.headerTitle) el.headerTitle.innerText = "The Casino";
            
            if (window.state.hasCasinoMembership) {
                el.casinoBadge?.classList.add('hidden');
                el.casinoGate?.classList.add('hidden');
                el.casinoContent?.classList.remove('hidden');
                this.renderBlackjack();
            } else {
                el.casinoBadge?.classList.remove('hidden');
                el.casinoGate?.classList.remove('hidden');
                el.casinoContent?.classList.add('hidden');
            }
        }"""
ui_content = ui_content.replace(ui_tab2_old, ui_tab2_new)

ui_methods_old = """    updateUI() {"""
ui_methods_new = """    renderSlotsResult(r1, r2, r3, msg, color) {
        const el = this.elements;
        if(el.slot1) el.slot1.innerText = r1;
        if(el.slot2) el.slot2.innerText = r2;
        if(el.slot3) el.slot3.innerText = r3;
        if(el.slotResult) {
            el.slotResult.innerText = msg;
            el.slotResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 ${color}`;
        }
    },
    
    renderRouletteResult(msg, color) {
        if(this.elements.rouletteResult) {
            this.elements.rouletteResult.innerText = msg;
            this.elements.rouletteResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 ${color}`;
        }
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
            
            el.bjDealerHand.innerHTML = `<span>${bj.dealerHand[0].value} ${bj.dealerHand[0].suit}</span><span>?</span>`;
            el.bjDealerScore.innerText = '?';
        } else {
            el.bjControlsDeal.classList.remove('hidden');
            el.bjControlsPlay.classList.add('hidden');
            
            el.bjDealerHand.innerHTML = bj.dealerHand.map(c => `<span>${c.value} ${c.suit}</span>`).join('');
            el.bjDealerScore.innerText = window.logic.calcHand(bj.dealerHand);
            
            el.bjResult.innerText = bj.status;
            let resColor = 'text-slate-300';
            if (bj.status.includes('Win') || bj.status.includes('BLACKJACK')) resColor = 'text-emerald-400';
            if (bj.status.includes('Lost') || bj.status.includes('Bust')) resColor = 'text-red-400';
            if (bj.status.includes('Push')) resColor = 'text-amber-400';
            el.bjResult.className = `text-xs font-bold uppercase tracking-widest h-4 mb-4 text-center ${resColor}`;
        }
        
        el.bjPlayerHand.innerHTML = bj.playerHand.map(c => `<span>${c.value} ${c.suit}</span>`).join('');
        el.bjPlayerScore.innerText = window.logic.calcHand(bj.playerHand);
    },

    updateUI() {"""
ui_content = ui_content.replace(ui_methods_old, ui_methods_new)

ui_sync_old = """        if (el.payForRepairBtn && window.state.carDealership && window.state.carDealership.status === 'needs_repair') {
            el.payForRepairBtn.disabled = window.state.balance < 300;
        }
    },"""
ui_sync_new = """        if (el.payForRepairBtn && window.state.carDealership && window.state.carDealership.status === 'needs_repair') {
            el.payForRepairBtn.disabled = window.state.balance < 300;
        }

        if (el.buyCasinoBtn) el.buyCasinoBtn.disabled = window.state.balance < 10000;
        if (el.spinSlotsBtn) el.spinSlotsBtn.disabled = window.state.balance < 100;
        if (el.btnBetRed) el.btnBetRed.disabled = window.state.balance < 500;
        if (el.btnBetBlack) el.btnBetBlack.disabled = window.state.balance < 500;
        if (el.btnBjDeal && (!window.state.blackjack || !window.state.blackjack.active)) el.btnBjDeal.disabled = window.state.balance < 1000;
    },"""
ui_content = ui_content.replace(ui_sync_old, ui_sync_new)

with open(ui_path, 'w', encoding='utf-8') as f:
    f.write(ui_content)

print("Patch applied successfully.")
