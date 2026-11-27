const BUSINESS_ICONS = { retail: 'store', startup: 'laptop', estate: 'building', corp: 'globe' };
const SCREEN_TITLES = { vault: 'Vault', lifestyle: 'Lifestyle', invest: 'Stocks', profile: 'Your empire' };
// Borrowed from Lifestyle until the homes have their own photos
const HOME_PHOTOS = {
    studio: 'lifestyle-web/apartment',
    house: 'lifestyle-web/beach-house',
    villa: 'lifestyle-web/mansion'
};
const CAR_PHOTOS = {
    '2018 Sedan': 'sedan-2018',
    '2012 Hatchback': 'hatchback-2012',
    '2005 Truck': 'truck-2005',
    '2020 SUV': 'suv-2020',
    '1994 Coupe': 'coupe-1994',
    '2015 Sports Car': 'sports-2015',
    '1967 Fastback': 'fastback-1967',
    '1955 Roadster': 'roadster-1955'
};

const ui = {
    elements: {},
    businessScreen: null, // which Vault screen is open; null is the dashboard
    tenantHomeId: null, // the home whose applicants are on show

    init() {
        this.cacheElements();
        this.bindEvents();
        this.updateUI();
        this.renderLogs();
        this.switchTab(window.state.activeTab);
    },

    cacheElements() {
        const ids = [
            'app', 'headerTitle', 'btnHeaderBack', 'balanceDisplay', 'passiveIncomeDisplay', 'activityLogList',
            'saveIndicator', 'saveDot', 'saveLabel', 'toastContainer',
            'awayModal', 'awayAmount', 'awayDuration', 'awayCollectBtn',
            'confirmModal', 'confirmTitle', 'confirmMessage', 'confirmYes', 'confirmNo',
            'navVault', 'navLifestyle', 'navInvest', 'navProfile', 'dealerBadge',
            'vaultView', 'lifestyleView', 'investView', 'profileView', 'lifestyleContent',
            'workBtn', 'clickValueDisplay', 'efficiencyDisplay', 'businessesList', 'storeCountDisplay',
            'vaultHome', 'businessDetail', 'startBusinessBtn',
            'marketContent', 'carDemandList', 'demandTimer',
            'garageStatus', 'buyGarageBtn', 'garageSlotsContainer',
            'auctionSection', 'browseAuctionsBtn', 'browseAuctionsLabel', 'auctionResultsList',
            'stockListContainer', 'portfolioValueDisplay',
            'statRank', 'statTotalEarnings', 'statTotalClicks',
            'rankProgressBar', 'rankProgressText', 'prestigeBtn', 'prestigeInfo', 'hardResetBtn', 'taxBtn',
            'backupCopyBtn', 'backupRestoreBtn', 'backupModal', 'backupTitle', 'backupHint', 'backupCode',
            'backupError', 'backupCancel', 'backupNext'
        ];
        this.elements = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
        this.elements.behindDialog = document.querySelectorAll('#app > header, #app > main, #app > footer, #awayModal');
    },

    bindEvents() {
        const el = this.elements;
        const l = window.logic;

        el.workBtn?.addEventListener('click', (e) => l.doWork(e));

        el.navVault?.addEventListener('click', () => this.switchTab('vault'));
        el.navLifestyle?.addEventListener('click', () => this.switchTab('lifestyle'));
        el.navInvest?.addEventListener('click', () => this.switchTab('invest'));
        el.navProfile?.addEventListener('click', () => this.switchTab('profile'));

        el.browseAuctionsBtn?.addEventListener('click', () => l.browseAuctions());

        el.hardResetBtn?.addEventListener('click', () => window.hardReset());
        el.awayCollectBtn?.addEventListener('click', () => l.collectAway());
        el.confirmYes?.addEventListener('click', () => this.answer(true));
        el.confirmNo?.addEventListener('click', () => this.answer(false));
        el.confirmModal?.addEventListener('click', e => { if (e.target === el.confirmModal) this.answer(false); });
        document.addEventListener?.('keydown', e => {
            if (e.key !== 'Escape') return;
            this.answer(false);
            this.closeBackup();
        });
        el.backupCopyBtn?.addEventListener('click', () => this.copyBackup());
        el.backupRestoreBtn?.addEventListener('click', () => this.openBackup('restore'));
        el.backupNext?.addEventListener('click', () => this.submitBackup());
        el.backupCancel?.addEventListener('click', () => this.closeBackup());
        el.prestigeBtn?.addEventListener('click', () => l.prestige());
        el.taxBtn?.addEventListener('click', () => l.toggleTaxes());

        el.btnHeaderBack?.addEventListener('click', () => this.goBack());
        el.startBusinessBtn?.addEventListener('click', () => this.showBusiness('start'));
    },

    icon(name, extraClass = '') {
        return `<svg class="icon ${extraClass}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
    },

    formatMoney(amount) {
        if (amount >= 1000000000000) return '$' + (amount / 1000000000000).toFixed(2) + 'T';
        if (amount >= 1000000000) return '$' + (amount / 1000000000).toFixed(2) + 'B';
        if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(2) + 'M';
        if (amount >= 10000) return '$' + (amount / 1000).toFixed(1) + 'k';
        return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    switchTab(tabId) {
        if (!SCREEN_TITLES[tabId]) tabId = 'vault'; // saves can point at a tab that has moved
        window.state.activeTab = tabId;
        const el = this.elements;
        const screens = {
            vault: [el.navVault, el.vaultView],
            lifestyle: [el.navLifestyle, el.lifestyleView],
            invest: [el.navInvest, el.investView],
            profile: [el.navProfile, el.profileView]
        };

        Object.entries(screens).forEach(([name, [nav, view]]) => {
            nav?.classList[name === tabId ? 'add' : 'remove']('active');
            view?.classList[name === tabId ? 'remove' : 'add']('hidden');
        });

        if (el.app) el.app.dataset.tab = tabId;
        // A business screen shrinks the top panel; other tabs get the full one back
        el.app?.classList.remove('playing');
        el.btnHeaderBack?.classList.add('hidden');
        if (el.headerTitle) el.headerTitle.innerText = SCREEN_TITLES[tabId] || SCREEN_TITLES.vault;

        this.updateDealerBadge();

        if (tabId === 'vault') {
            this.showBusiness(null);
        } else if (tabId === 'lifestyle') {
            this.renderLifestyle();
        } else if (tabId === 'invest') {
            this.renderMarket();
        } else if (tabId === 'profile') {
            this.renderProfile();
        }

        this.syncVisualsSilently();
    },

    updateDealerBadge() {
        const badge = this.elements.dealerBadge;
        if (!badge) return;

        // The dot sits on the Vault button and covers every business that needs attention
        const cars = window.state.hasDealerLicense ? window.state.dealerCars || [] : [];
        const brokenTaxi = (window.state.taxi?.cars || []).some(c => c.broken);
        const needsTenant = (window.state.rentals?.homes || []).some(h => h.applicants);
        let tone = null;
        if (brokenTaxi || needsTenant || cars.some(c => c.status === 'needs_repair')) {
            tone = 'alert';
        } else if (cars.some(c => c.status === 'ready')) {
            tone = 'good';
        }

        if (tone) {
            badge.className = `badge badge-${tone}`;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    },

    getCarPhoto(car) {
        return CAR_PHOTOS[car.name] ? `Assets/cars-web/${CAR_PHOTOS[car.name]}.jpg` : null;
    },

    renderCarPhoto(car) {
        const src = this.getCarPhoto(car);
        return src ? `<img class="car-photo" src="${src}" alt="${car.name}" width="640" height="429">` : '';
    },

    // Stands in for the photo when a car has none
    carTile(car) {
        if (this.getCarPhoto(car)) return '';
        const tier = window.logic.getCarTier(car);
        const icon = car.name.includes('Truck') ? 'truck' : 'car';
        return `<span class="tile ${tier.id}">${this.icon(icon)}</span>`;
    },

    renderTierBadge(car) {
        const tier = window.logic.getCarTier(car);
        return `<span class="tag ${tier.id}">${tier.label}</span>`;
    },

    renderCarDemand() {
        const el = this.elements;
        if (!el.carDemandList) return;
        el.carDemandList.innerHTML = window.CAR_TIERS.map(tier => {
            const percent = Math.round(window.logic.getDemand({ tier: tier.id }) * 100);
            const tone = percent >= 100 ? 'text-emerald-400' : 'text-red-400';
            return `<div class="card demand">
                <span class="muted">${tier.label}</span>
                <strong class="${tone}">${percent >= 100 ? '▲' : '▼'} ${percent}%</strong>
            </div>`;
        }).join('');
    },

    renderAuction() {
        const el = this.elements;
        if (!el.auctionResultsList) return;

        if (window.state.carDealership) { // one-time move from the old single-car save
            window.state.dealerCars = [...(window.state.dealerCars || []), window.state.carDealership];
            window.state.carDealership = null;
        }

        const garageFull = (window.state.dealerCars || []).length >= window.logic.getGarageSlots();

        el.auctionResultsList.innerHTML = (window.state.auctionCars || []).map((car, index) => {
            const inspectCost = window.logic.getInspectCost(car);
            const cannotInspect = car.inspected || window.state.balance < inspectCost;
            const cannotBuy = garageFull || window.state.balance < car.price;
            let condition = '<span class="muted">Condition unknown</span>';
            if (car.inspected) {
                condition = car.hasHiddenFault
                    ? `<strong class="text-red-400">Engine fault: ${this.formatMoney(window.logic.getRepairCost(car))} to repair</strong>`
                    : '<strong class="text-emerald-400">No faults found</strong>';
            }

            return `
            <article class="card car">
                ${this.renderCarPhoto(car)}
                <div class="row">
                    ${this.carTile(car)}
                    <div class="grow"><h3>${car.name}</h3>${this.renderTierBadge(car)}</div>
                    <span class="figure">${car.haggled ? `<s>${this.formatMoney(car.value)}</s>` : ''}${this.formatMoney(car.price)}</span>
                </div>
                <p class="row between"><span class="muted">Sells for today</span>
                    <strong class="text-emerald-400">about ${this.formatMoney(window.logic.getSalePrice(car))}</strong></p>
                <p>${condition}</p>
                <div class="trio">
                    <button id="auctionInspect-${index}" class="btn btn-sky" onclick="window.logic.inspectCar(${index})" ${cannotInspect ? 'disabled' : ''}>
                        ${car.inspected ? 'Inspected' : `Inspect<small>${this.formatMoney(inspectCost)}</small>`}</button>
                    <button class="btn btn-sky" onclick="window.logic.haggleCar(${index})" ${car.haggled ? 'disabled' : ''}>
                        ${car.haggled ? '10% off' : 'Haggle<small>50/50</small>'}</button>
                    <button id="auctionBuy-${index}" class="btn btn-yellow" onclick="window.logic.buyAuction(${index})" ${cannotBuy ? 'disabled' : ''}>
                        ${garageFull ? 'Garage full' : 'Buy'}</button>
                </div>
            </article>`;
        }).join('');
    },

    renderCarStatus(car, index) {
        if (car.status === 'restoring') {
            return `
                <p class="row between"><span class="muted">Restoring</span>
                    <strong id="carRestoreTimer-${index}">...</strong></p>
                <div class="meter"><div id="carRestoreBar-${index}" style="width: 0%"></div></div>`;
        }
        if (car.status === 'needs_repair') {
            const cost = window.logic.getRepairCost(car);
            return `
                <p class="row text-red-400">${this.icon('alert')}<strong>Hidden engine fault. Repairs add 15 seconds.</strong></p>
                <button id="repairBtn-${index}" class="btn btn-red wide" onclick="window.logic.payForRepair(${index})" ${window.state.balance < cost ? 'disabled' : ''}>
                    Pay ${this.formatMoney(cost)} for repairs</button>`;
        }
        const salePrice = window.logic.getSalePrice(car);
        const profit = salePrice - car.buyPrice - (car.repairPaid || 0);
        return `
            <p class="row between"><span class="muted">Profit if sold now</span>
                <strong class="${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}">${profit >= 0 ? '+' : '-'}${this.formatMoney(Math.abs(profit))}</strong></p>
            <button class="btn btn-green btn-big wide" onclick="window.logic.sellCar(${index})">Sell for ${this.formatMoney(salePrice)}</button>`;
    },

    renderGarage() {
        const el = this.elements;
        if (!el.garageSlotsContainer) return;

        if (!window.state.dealerCars) window.state.dealerCars = [];
        this.renderCarDemand();

        const totalSlots = window.logic.getGarageSlots();
        const expansionCost = window.logic.getGarageExpansionCost();

        if (el.garageStatus) el.garageStatus.innerText = `${window.state.dealerCars.length}/${totalSlots} Slots`;
        if (el.buyGarageBtn) {
            el.buyGarageBtn.innerText = `Expand (${this.formatMoney(expansionCost)})`;
            el.buyGarageBtn.disabled = window.state.balance < expansionCost;
        }

        let html = '';
        for (let i = 0; i < totalSlots; i++) {
            const car = window.state.dealerCars[i];
            html += car
                ? `<article class="card car">
                        ${this.renderCarPhoto(car)}
                        <div class="row">
                            ${this.carTile(car)}
                            <div class="grow"><h3>${car.name}</h3>${this.renderTierBadge(car)}</div>
                            <div class="quote"><span class="muted">Paid</span><strong>${this.formatMoney(car.buyPrice)}</strong></div>
                        </div>
                        ${this.renderCarStatus(car, i)}
                    </article>`
                : `<div class="empty">${this.icon('car')}<strong>Empty slot</strong><span>Buy a car at the auction</span></div>`;
        }

        el.garageSlotsContainer.innerHTML = html;
        if (this.isDealerOpen()) this.renderAuction();
    },

    updateCarProgressBar(index, timerText, progressPercent) {
        const timerEl = document.getElementById(`carRestoreTimer-${index}`);
        const barEl = document.getElementById(`carRestoreBar-${index}`);
        if (timerEl) timerEl.innerText = timerText + 's';
        if (barEl) barEl.style.width = `${progressPercent}%`;
    },

    sparkline(values, tone) {
        const low = Math.min(...values);
        const range = Math.max(...values) - low;
        const points = (values.length > 1 ? values : [values[0], values[0]]).map((value, i, all) => {
            const x = 2 + (i / (all.length - 1)) * 56;
            const y = range ? 23 - ((value - low) / range) * 20 : 13;
            return `${x.toFixed(1)},${y.toFixed(1)}`;
        }).join(' ');
        return `<svg class="spark ${tone}" viewBox="0 0 60 26" aria-hidden="true"><polyline points="${points}"/></svg>`;
    },

    renderMarket() {
        const el = this.elements;
        if (!el.stockListContainer) return;

        if (el.portfolioValueDisplay) {
            el.portfolioValueDisplay.innerText = this.formatMoney(window.logic.getPortfolioValue());
        }
        if (!window.state.portfolio) window.state.portfolio = {};

        const isMax = window.stockMultiplier === 'max';
        // Only the option that is not selected switches, so tapping the current one does nothing
        const volume = (label, selected) => `<button class="btn ${selected ? 'btn-yellow' : ''}"
            aria-pressed="${selected}" ${selected ? '' : 'onclick="window.logic.toggleStockMultiplier()"'}>${label}</button>`;
        let html = `<div class="duo">${volume('Trade 1', !isMax)}${volume('Trade max', isMax)}</div>`;

        window.MARKET_DATA.forEach(s => {
            const price = window.stockPrices[s.id];
            const change = window.logic.getPriceChange(s.id);
            const direction = change > 0 ? 'up' : (change < 0 ? 'down' : '');
            const tone = change > 0 ? 'text-emerald-400' : (change < 0 ? 'text-red-400' : 'muted');
            const arrow = change > 0 ? '▲' : (change < 0 ? '▼' : '');
            const port = window.state.portfolio[s.id] || { shares: 0, totalSpent: 0 };
            const amount = isMax ? "'max'" : '1';

            let profitRow = '';
            if (port.shares > 0) {
                const diff = port.shares * price - port.totalSpent;
                const sign = diff >= 0 ? '+' : '-';
                profitRow = `<p class="row between pl">
                    <span class="muted">Average ${this.formatMoney(port.totalSpent / port.shares)}</span>
                    <strong class="${diff >= 0 ? 'text-emerald-400' : 'text-red-400'}">${sign}${this.formatMoney(Math.abs(diff))} (${sign}${Math.abs(diff / port.totalSpent * 100).toFixed(1)}%)</strong>
                </p>`;
            }

            html += `
            <article class="card stack">
                <div class="row">
                    <div class="grow"><h3>${s.name}</h3><span class="muted">${port.shares} owned</span></div>
                    ${this.sparkline(window.stockTrails[s.id], direction)}
                    <div class="quote"><strong>${this.formatMoney(price)}</strong>
                        <span class="${tone}">${arrow} ${Math.abs(change).toFixed(1)}%</span></div>
                </div>
                <div class="duo">
                    <button class="btn btn-green" onclick="window.logic.sellStock('${s.id}', ${amount})" ${port.shares <= 0 ? 'disabled' : ''}>${isMax ? 'Sell all' : 'Sell'}</button>
                    <button class="btn btn-yellow" onclick="window.logic.buyStock('${s.id}', ${amount})" ${window.state.balance < price ? 'disabled' : ''}>${isMax ? 'Buy max' : 'Buy'}</button>
                </div>
                ${profitRow}
            </article>`;
        });
        el.stockListContainer.innerHTML = html;
    },

    renderLogs() {
        const el = this.elements;
        if (!el.activityLogList) return;
        el.activityLogList.innerHTML = '';
        window.state.logs.forEach(log => {
            const row = document.createElement('div');
            row.className = `log ${log.colorClass}`;
            const message = document.createElement('span');
            message.textContent = log.msg;
            const time = document.createElement('time');
            time.textContent = log.time;
            row.append(message, time);
            el.activityLogList.appendChild(row);
        });
    },

    renderOwnedBusiness(b, biz, idx) {
        const level = biz.level || 1;
        const upgradeCost = window.logic.getBusinessUpgradeCost(biz);
        const canUpgrade = window.state.balance >= upgradeCost;
        const milestone = window.logic.getMilestone(level);
        const progress = b.maxLevel ? level / b.maxLevel : milestone.progress;
        const goal = b.maxLevel
            ? `<span>Level ${level} of ${b.maxLevel}</span><strong></strong>`
            : `<span>${milestone.next ? `Double income at level ${milestone.next}` : 'All income bonuses unlocked'}</span>
                <strong>${milestone.multiplier > 1 ? `x${milestone.multiplier} bonus` : ''}</strong>`;
        const upgrade = window.logic.isMaxLevel(biz)
            ? '<p class="maxed">Fully upgraded</p>'
            : `<button id="bizUpgradeBtn-${idx}" class="btn btn-green wide ${canUpgrade ? '' : 'is-short'}"
                    onclick="window.logic.upgradeBusiness(${idx})">Upgrade for ${this.formatMoney(upgradeCost)}</button>`;
        const perSecond = (biz.incomePerHour / 3600) * window.logic.getPrestigeMultiplier();
        const collectRow = window.logic.hasManager(b.id)
            ? `<p class="muted">Your manager collects this for you</p>`
            : `<div class="row between">
                    <div><span class="muted">Ready to collect</span>
                        <strong id="bizAccumulatedIdx-${idx}" class="stat-figure text-emerald-400">${this.formatMoney(biz.accumulated || 0)}</strong></div>
                    <button id="bizCollectBtnIdx-${idx}" class="btn btn-yellow" ${(biz.accumulated || 0) <= 0 ? 'disabled' : ''}
                        onclick="window.logic.collectIncomeByIndex(${idx}); window.threeEffects && window.threeEffects.triggerClickPulse(event.clientX, event.clientY);">Collect</button>
                </div>`;

        return `
        <article id="bizOwned-${idx}" class="card biz">
            <div class="row">
                <span class="tile">${this.icon(BUSINESS_ICONS[b.id])}</span>
                <div class="grow"><h3>${b.name}</h3><span class="muted">Level ${biz.level || 1}</span></div>
                <span class="figure" id="bizRateIdx-${idx}">+${this.formatMoney(perSecond)}<small>/s</small></span>
            </div>
            <div class="meter"><div style="width: ${progress * 100}%"></div></div>
            <p class="row between muted">${goal}</p>
            ${upgrade}
            ${collectRow}
        </article>`;
    },

    renderManagerOffer(b) {
        const cost = window.logic.getManagerCost(b.id);
        return `
        <div class="card row">
            <span class="tile">${this.icon('user')}</span>
            <div class="grow"><h3>Hire a manager</h3><span class="muted">Collects ${b.name} income for you</span></div>
            <button id="managerBtn-${b.id}" class="btn btn-yellow" onclick="window.logic.buyManager('${b.id}')"
                ${window.state.balance < cost ? 'disabled' : ''}>${this.formatMoney(cost)}</button>
        </div>`;
    },

    renderBusinessPlan(b, count) {
        const cost = window.logic.getBusinessCost(b.id);
        return `
        <article id="bizBtn-${b.id}" class="card biz biz-plan">
            <div class="row">
                <span class="tile">${this.icon(BUSINESS_ICONS[b.id])}</span>
                <div class="grow"><h3>${b.name}</h3>
                    <span class="muted">Earns ${this.formatMoney(b.income)} a second</span>
                    <span class="muted">You own ${count} of ${b.maxOwn}</span></div>
                <button id="bizBuyBtn-${b.id}" class="btn btn-yellow ${window.state.balance >= cost ? '' : 'is-short'}"
                    onclick="window.logic.buyBusiness('${b.id}')">Buy<small>${this.formatMoney(cost)}</small></button>
            </div>
        </article>`;
    },

    // ---- Vault: dashboard and business screens ----

    // ---- The game's own confirm box ----

    ask({ title, message, yes, danger = false }, action) {
        const el = this.elements;
        this.pendingAction = action;
        el.confirmTitle.innerText = title;
        el.confirmMessage.innerText = message;
        el.confirmYes.innerText = yes;
        el.confirmYes.className = `btn btn-big ${danger ? 'btn-red' : 'btn-yellow'}`;
        el.confirmModal.classList.remove('hidden');
        // Nothing behind the box can be reached while it is open
        el.behindDialog?.forEach(part => { part.inert = true; });
        el.confirmNo.focus?.(); // the safe choice
    },

    answer(agreed) {
        const el = this.elements;
        const action = this.pendingAction;
        if (!action) return;
        this.pendingAction = null; // cleared first, so a double tap cannot run it twice
        el.confirmModal.classList.add('hidden');
        el.behindDialog?.forEach(part => { part.inert = false; });
        if (agreed) action();
    },

    // ---- Backup ----

    copyBackup() {
        const code = window.makeBackupCode();
        // The length lets the player check that nothing was cut off on the way
        const size = code.length.toLocaleString('en-US');
        const byHand = () => this.openBackup('copy', code);
        const clipboard = window.navigator?.clipboard;
        if (!clipboard) return Promise.resolve(byHand());
        // Called straight from the tap, as iPhone requires
        return clipboard.writeText(code).then(
            () => this.showToast(`Backup code copied (${size} characters). Paste it into Notes to keep it safe.`, 'good'),
            byHand
        );
    },

    // One box for both jobs: 'copy' shows a code to copy by hand, 'restore' takes one
    openBackup(mode, code = '') {
        const el = this.elements;
        const copying = mode === 'copy';
        el.backupTitle.innerText = copying ? 'Your backup code' : 'Restore your game';
        el.backupHint.innerText = copying
            ? `Select all ${code.length.toLocaleString('en-US')} characters, copy them, and keep them somewhere safe.`
            : 'Paste your backup code below.';
        el.backupCode.value = code;
        el.backupCode.readOnly = copying;
        el.backupError.classList.add('hidden');
        el.backupNext.classList[copying ? 'add' : 'remove']('hidden');
        el.backupCancel.innerText = copying ? 'Done' : 'Cancel';
        el.backupCancel.classList[copying ? 'add' : 'remove']('span-all');
        el.backupModal.classList.remove('hidden');
        el.behindDialog?.forEach(part => { part.inert = true; });
        if (copying) {
            el.backupCode.select();
            el.backupCode.setSelectionRange?.(0, code.length); // iPhone can ignore select() on its own
        }
    },

    closeBackup() {
        const el = this.elements;
        if (!el.backupModal || el.backupModal.classList.contains('hidden')) return;
        el.backupModal.classList.add('hidden');
        el.behindDialog?.forEach(part => { part.inert = false; });
    },

    submitBackup() {
        const el = this.elements;
        const { save, problem } = window.inspectBackupCode(el.backupCode.value);
        if (!save) {
            el.backupError.innerText = `That code doesn't look right. ${problem}`;
            el.backupError.classList.remove('hidden');
            return;
        }
        this.closeBackup();
        this.ask({
            title: 'Replace this game?',
            message: `The saved game has ${this.formatMoney(save.balance)}. Your current progress will be overwritten.`,
            yes: 'Replace',
            danger: true
        }, () => {
            if (!window.restoreGame(save)) this.showToast('Could not save that game on this phone.');
        });
    },

    isDealerOpen() {
        return window.state.activeTab === 'vault' && this.businessScreen === 'dealer';
    },

    showBusiness(screen) {
        const el = this.elements;
        // Without a license the dealership is still something to start
        if (screen === 'dealer' && !window.state.hasDealerLicense) screen = 'start';
        if (screen === 'dealer') window.logic.updateCarDemand();
        this.businessScreen = screen;
        el.app?.classList[screen ? 'add' : 'remove']('playing');
        el.btnHeaderBack?.classList[screen ? 'remove' : 'add']('hidden');
        if (el.headerTitle) el.headerTitle.innerText = this.getBusinessTitle(screen);
        this.renderBusinesses();
        if (el.vaultView) el.vaultView.scrollTop = 0;
    },

    goBack() {
        this.showBusiness(this.businessScreen === 'tenants' ? 'rentals' : null);
    },

    getBusinessTitle(screen) {
        if (!screen) return SCREEN_TITLES.vault;
        if (screen === 'start') return 'Start a business';
        if (screen === 'taxi') return 'Taxi Company';
        if (screen === 'dealer') return 'Car Dealership';
        if (screen === 'rentals') return 'Rentals'; // short enough for a small phone
        if (screen === 'tenants') return 'Tenants';
        return window.BUSINESS_DATA.find(b => b.id === screen).name;
    },

    getOwned(id) {
        const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
        return businesses.map((biz, idx) => ({ biz, idx })).filter(o => o.biz.id === id);
    },

    // What each dashboard card says about its business
    getBusinessSummaries() {
        const l = window.logic;
        const summaries = window.BUSINESS_DATA.filter(b => this.getOwned(b.id).length).map(b => {
            const owned = this.getOwned(b.id);
            const ready = owned.reduce((sum, o) => sum + (o.biz.accumulated || 0), 0);
            let status = ready > 0 ? `${this.formatMoney(ready)} ready to collect` : 'Earning';
            if (l.hasManager(b.id)) status = 'Manager collecting';
            const noun = b.id === 'retail' ? 'shop' : 'owned';
            const plural = b.id === 'retail' && owned.length > 1 ? 's' : '';
            return {
                id: b.id,
                name: b.name,
                icon: BUSINESS_ICONS[b.id],
                count: `${owned.length} ${noun}${plural}`,
                rate: owned.reduce((sum, o) => sum + o.biz.incomePerHour / 3600, 0) * l.getPrestigeMultiplier(),
                status,
                alert: false
            };
        });

        const taxi = window.state.taxi;
        if (taxi) {
            const broken = taxi.cars.filter(c => c.broken).length;
            let status = taxi.dispatcher ? 'Dispatcher collecting' : `${this.formatMoney(taxi.fares)} in fares`;
            if (!taxi.cars.length && !(taxi.fares > 0)) status = 'Buy a car to start earning';
            if (broken) status = `${broken} broken down`;
            summaries.push({
                id: 'taxi',
                name: 'Taxi Company',
                icon: 'car',
                count: `${taxi.cars.length} car${taxi.cars.length === 1 ? '' : 's'}`,
                rate: l.getTaxiRate(),
                status,
                alert: broken > 0
            });
        }

        const rentals = window.state.rentals;
        if (rentals) {
            const homes = rentals.homes.length;
            const empty = rentals.homes.filter(h => !h.tenant).length;
            let status = rentals.agent ? 'Agent collecting' : `${this.formatMoney(rentals.rent)} in rent`;
            if (!homes && !(rentals.rent > 0)) status = 'Buy a home to start earning';
            if (empty) status = `${this.plural(empty, 'home')} empty`;
            summaries.push({
                id: 'rentals',
                name: 'Rental Properties',
                icon: 'key',
                count: this.plural(homes, 'home'),
                rate: l.getRentRate(),
                status,
                alert: empty > 0
            });
        }

        if (window.state.hasDealerLicense) {
            const cars = window.state.dealerCars || [];
            const count = status => cars.filter(c => c.status === status).length;
            let status = 'Visit the auction';
            if (count('restoring')) status = `${count('restoring')} restoring`;
            if (count('ready')) status = `${count('ready')} ready to sell`;
            if (count('needs_repair')) status = `${count('needs_repair')} need repair`;
            summaries.push({
                id: 'dealer',
                name: 'Car Dealership',
                icon: 'truck',
                count: 'Auctions and garage',
                figure: `${cars.length}<small>/${l.getGarageSlots()} cars</small>`,
                status,
                alert: count('needs_repair') > 0
            });
        }
        return summaries;
    },

    // Dashboard cards show earnings per second, or their own figure
    getSummaryFigure(summary) {
        return summary.figure || `+${this.formatMoney(summary.rate)}<small>/s</small>`;
    },

    renderDashboard(summaries) {
        if (!summaries.length) {
            return `<div class="empty">${this.icon('store')}<strong>You do not own a business yet</strong><span>Use Start a business to open one</span></div>`;
        }
        return summaries.map(s => `
            <button class="btn summary" onclick="window.ui.showBusiness('${s.id}')">
                <span class="tile">${this.icon(s.icon)}</span>
                <span class="grow"><strong>${s.name}</strong>
                    <small>${s.count}</small>
                    <small id="sumStatus-${s.id}" class="${s.alert ? 'text-red-400' : ''}">${s.status}</small></span>
                <span class="figure" id="sumRate-${s.id}">${this.getSummaryFigure(s)}</span>
                ${this.icon('chevron')}
            </button>`).join('');
    },

    renderBusinesses() {
        const el = this.elements;
        if (!el.businessesList) return;
        // The home may have been let or sold since its Tenants screen opened
        if (this.businessScreen === 'tenants' && !window.logic.getHome(this.tenantHomeId)?.applicants) {
            this.showBusiness('rentals');
            return;
        }
        const screen = this.businessScreen;

        const dealer = screen === 'dealer';
        el.vaultHome?.classList[screen ? 'add' : 'remove']('hidden');
        el.businessDetail?.classList[screen && !dealer ? 'remove' : 'add']('hidden');
        el.marketContent?.classList[dealer ? 'remove' : 'add']('hidden');

        const summaries = this.getBusinessSummaries();
        el.businessesList.innerHTML = this.renderDashboard(summaries);
        if (el.storeCountDisplay) el.storeCountDisplay.innerText = `${summaries.length} Active`;

        if (dealer) {
            this.renderGarage();
            this.renderAuction();
            return;
        }
        if (!screen || !el.businessDetail) return;
        if (screen === 'start') el.businessDetail.innerHTML = this.renderStartScreen();
        else if (screen === 'taxi') el.businessDetail.innerHTML = this.renderTaxiScreen();
        else if (screen === 'rentals') el.businessDetail.innerHTML = this.renderRentalScreen();
        else if (screen === 'tenants') el.businessDetail.innerHTML = this.renderTenantScreen();
        else el.businessDetail.innerHTML = this.renderBusinessScreen(screen);
    },

    renderBusinessScreen(id) {
        const b = window.BUSINESS_DATA.find(x => x.id === id);
        const owned = this.getOwned(id);
        let html = owned.map(({ biz, idx }) => this.renderOwnedBusiness(b, biz, idx)).join('');
        if (owned.length && !window.logic.hasManager(id)) html += this.renderManagerOffer(b);
        if (!b.hidden && owned.length < b.maxOwn) html += this.renderBusinessPlan(b, owned.length);
        return html;
    },

    // Buying from the start screen takes you to the new business
    startBusiness(id) {
        if (id === 'dealer') {
            window.logic.buyLicense(); // opens the dealership when it succeeds
            return;
        }
        if (id === 'taxi') {
            window.logic.openTaxiCompany();
            if (window.state.taxi) this.showBusiness('taxi');
            return;
        }
        if (id === 'rentals') {
            window.logic.openRentals();
            if (window.state.rentals) this.showBusiness('rentals');
            return;
        }
        const before = this.getOwned(id).length;
        window.logic.buyBusiness(id);
        if (this.getOwned(id).length > before) this.showBusiness(id);
    },

    renderStartScreen() {
        const l = window.logic;
        const shop = window.BUSINESS_DATA.find(b => b.id === 'retail');
        const shops = this.getOwned('retail').length;
        const shopCost = l.getBusinessCost('retail');
        const button = (id, short, action, label) =>
            `<button id="${id}" class="btn btn-yellow btn-big wide ${short ? 'is-short' : ''}" onclick="${action}">${label}</button>`;

        const shopButton = shops < shop.maxOwn
            ? button('startRetail', window.state.balance < shopCost, "window.ui.startBusiness('retail')", `Open a shop for ${this.formatMoney(shopCost)}`)
            : button('startRetail', false, "window.ui.showBusiness('retail')", 'Manage your shops');
        const taxiButton = window.state.taxi
            ? button('startTaxi', false, "window.ui.showBusiness('taxi')", 'Manage your taxis')
            : button('startTaxi', window.state.balance < l.getTaxiOpenCost(), "window.ui.startBusiness('taxi')", `Open for ${this.formatMoney(l.getTaxiOpenCost())}`);

        const dealerButton = window.state.hasDealerLicense
            ? button('startDealer', false, "window.ui.showBusiness('dealer')", 'Manage your dealership')
            : button('startDealer', window.state.balance < l.getLicenseCost(), "window.ui.startBusiness('dealer')", `Open for ${this.formatMoney(l.getLicenseCost())}`);

        const rentalButton = window.state.rentals
            ? button('startRentals', false, "window.ui.showBusiness('rentals')", 'Manage your homes')
            : button('startRentals', window.state.balance < l.getRentalOpenCost(), "window.ui.startBusiness('rentals')", `Open for ${this.formatMoney(l.getRentalOpenCost())}`);

        return `
        <article class="card stack">
            <div class="row"><span class="tile">${this.icon('store')}</span>
                <div class="grow"><h3>${shop.name}</h3><span class="muted">A steady start. You own ${shops} of ${shop.maxOwn}.</span></div></div>
            <p>Each shop earns up to ${this.formatMoney(shop.income * shop.maxLevel)} a second at level ${shop.maxLevel}.</p>
            ${shopButton}
        </article>
        <article class="card stack">
            <img class="car-photo" src="Assets/cars-web/coupe-1994.jpg" alt="A burgundy coupe" width="640" height="429">
            <div class="row"><span class="tile">${this.icon('truck')}</span>
                <div class="grow"><h3>Car Dealership</h3><span class="muted">${window.state.hasDealerLicense ? 'Open' : 'Trade cars for profit'}</span></div></div>
            <p>Buy cars at auction, restore them and sell when demand is high.</p>
            ${dealerButton}
        </article>
        <article class="card stack">
            <img class="car-photo" src="Assets/cars-web/taxi-sedan.jpg" alt="A silver taxi sedan" width="640" height="429">
            <div class="row"><span class="tile">${this.icon('car')}</span>
                <div class="grow"><h3>Taxi Company</h3><span class="muted">${window.state.taxi ? 'Open' : 'Hands-on, with bigger earnings'}</span></div></div>
            <p>Buy cars and keep them running. They wear out, break down and need replacing.</p>
            ${taxiButton}
        </article>
        <article class="card stack">
            <img class="car-photo" src="${this.getHomePhoto({ id: 'studio' })}" alt="A city flat" width="640" height="429">
            <div class="row"><span class="tile">${this.icon('key')}</span>
                <div class="grow"><h3>Rental Properties</h3><span class="muted">${window.state.rentals ? 'Open' : 'Homes that pay you rent'}</span></div></div>
            <p>Buy homes, pick tenants, keep them in good shape and sell when prices are up.</p>
            ${rentalButton}
        </article>`;
    },

    plural(count, noun) {
        return `${count} ${noun}${count === 1 ? '' : 's'}`;
    },

    // ---- Rental Properties ----

    showTenants(homeId) {
        this.tenantHomeId = homeId;
        this.showBusiness('tenants');
    },

    getHomePhoto(type) {
        return `Assets/${HOME_PHOTOS[type.id]}.jpg`;
    },

    renderHomePhoto(type) {
        return `<img class="car-photo" src="${this.getHomePhoto(type)}" alt="${type.name}" width="640" height="429">`;
    },

    renderCondition(home) {
        const percent = window.logic.getConditionPercent(home);
        return `<p class="row between"><span class="muted">Condition</span><strong id="homeCondition-${home.id}">${percent}%</strong></p>
            <div class="meter wear ${percent < 40 ? 'worn' : ''}"><div id="homeBar-${home.id}" style="width: ${percent}%"></div></div>`;
    },

    renderRentPick(home) {
        const buttons = window.RENT_LEVELS.map(level => {
            const chosen = home.rentLevel === level.id;
            return `<button class="btn ${chosen ? 'btn-yellow' : ''}" aria-pressed="${chosen}"
                onclick="window.logic.setRentLevel(${home.id}, '${level.id}')">${level.label}</button>`;
        }).join('');
        return `<div><span class="muted">Rent</span><div class="trio">${buttons}</div></div>`;
    },

    getHomeFigure(home) {
        return `+${this.formatMoney(window.logic.getHomeRate(home))}<small>/s</small>`;
    },

    getRepairLabel(home) {
        return `Repair for ${this.formatMoney(window.logic.getHomeRepairCost(home))}`;
    },

    getSellLabel(home) {
        return `Sell for ${this.formatMoney(window.logic.getHomeSellValue(home))}`;
    },

    getApplicantLabel(home) {
        return `New applicants in ${Math.ceil(window.logic.getApplicantWait(home) / 1000)}s`;
    },

    getPriceTimerLabel() {
        const seconds = Math.ceil((60000 - window.state.rentals.marketMs) / 1000);
        return `New prices in ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
    },

    renderHome(home) {
        const l = window.logic;
        const type = l.getHomeType(home.type);
        const tenant = home.tenant && l.getTenantType(home.tenant.type);
        const repairCost = l.getHomeRepairCost(home);

        let earning = '<strong class="text-red-400">Earns nothing</strong>';
        if (tenant) {
            earning = home.late
                ? '<strong class="text-amber-400">Rent late this minute</strong>'
                : `<span id="homeRate-${home.id}" class="figure">${this.getHomeFigure(home)}</span>`;
        }
        let vacancy = '';
        if (!tenant) {
            vacancy = home.applicants
                ? `<button class="btn btn-yellow btn-big wide" onclick="window.ui.showTenants(${home.id})">Choose a tenant</button>`
                : `<button id="applicantWait-${home.id}" class="btn wide" disabled>${this.getApplicantLabel(home)}</button>`;
        }

        return `
        <article class="card car">
            ${this.renderHomePhoto(type)}
            <div class="row">
                <div class="grow"><h3>${type.name}</h3><span class="tag">${tenant ? 'Rented' : 'Empty'}</span></div>
                ${earning}
            </div>
            ${tenant ? `<p class="row between"><span class="muted">Tenant</span><strong>${home.tenant.name} · ${tenant.label}</strong></p>` : ''}
            ${this.renderCondition(home)}
            ${tenant ? this.renderRentPick(home) : ''}
            ${vacancy}
            <button id="repairHome-${home.id}" class="btn btn-green wide ${repairCost ? '' : 'hidden'}" onclick="window.logic.repairHome(${home.id})"
                ${window.state.balance < repairCost ? 'disabled' : ''}>${this.getRepairLabel(home)}</button>
            <button id="sellHome-${home.id}" class="btn wide" onclick="window.logic.sellHome(${home.id})">${this.getSellLabel(home)}</button>
        </article>`;
    },

    renderHomeMarket() {
        const rentals = window.state.rentals;
        return window.HOME_TYPES.map(type => {
            const change = rentals.change[type.id];
            let move = '<small>Steady</small>';
            if (change > 0) move = `<small class="text-emerald-400">Up ${change}</small>`;
            if (change < 0) move = `<small class="text-red-400">Down ${-change}</small>`;
            return `<div class="card demand">
                <span class="muted">${type.short}</span>
                <strong>${rentals.market[type.id]}%</strong>
                ${move}
            </div>`;
        }).join('');
    },

    renderRentalScreen() {
        const l = window.logic;
        const rentals = window.state.rentals;
        if (!rentals) return this.renderStartScreen();
        const full = rentals.homes.length >= l.getMaxHomes();

        const rent = rentals.agent
            ? '<div class="card"><p class="muted">Your agent collects rent for you</p></div>'
            : `<div class="card row between">
                    <div><span class="muted">Rent ready</span><strong id="rentPot" class="stat-figure text-emerald-400">${this.formatMoney(rentals.rent)}</strong></div>
                    <button id="btnCollectRent" class="btn btn-yellow" onclick="window.logic.collectRent()" ${rentals.rent > 0 ? '' : 'disabled'}>Collect</button>
                </div>
                <div class="card row">
                    <span class="tile">${this.icon('user')}</span>
                    <div class="grow"><h3>Hire an agent</h3><span class="muted">Collects rent for you</span></div>
                    <button id="btnAgent" class="btn btn-yellow" onclick="window.logic.hireAgent()"
                        ${window.state.balance < l.getAgentCost() ? 'disabled' : ''}>${this.formatMoney(l.getAgentCost())}</button>
                </div>`;

        const homes = rentals.homes.length
            ? rentals.homes.map(home => this.renderHome(home)).join('')
            : `<div class="empty">${this.icon('key')}<strong>No homes yet</strong><span>Buy one below to start earning</span></div>`;

        const forSale = window.HOME_TYPES.map(type => {
            const price = l.getHomePrice(type.id);
            return `
            <article class="card car">
                ${this.renderHomePhoto(type)}
                <div class="row">
                    <div class="grow"><h3>${type.name}</h3></div>
                    <span class="figure">+${this.formatMoney(type.rent * l.getPrestigeMultiplier())}<small>/s</small></span>
                </div>
                <p class="row between"><span class="muted">Repairs</span><strong>${type.repairs}</strong></p>
                <button id="buyHome-${type.id}" class="btn btn-yellow btn-big wide" onclick="window.logic.buyHome('${type.id}')"
                    ${full || window.state.balance < price ? 'disabled' : ''}>${full ? 'No room' : `Buy for ${this.formatMoney(price)}`}</button>
            </article>`;
        }).join('');

        return `
            ${rent}
            <div class="section-head">
                <h2>Your homes</h2>
                <span class="pill">${rentals.homes.length}/${l.getMaxHomes()} Homes</span>
            </div>
            ${homes}
            <div class="section-head">
                <h2>Home prices</h2>
                <span id="homePriceTimer" class="note">${this.getPriceTimerLabel()}</span>
            </div>
            <div class="trio">${this.renderHomeMarket()}</div>
            <div class="section-head"><h2>Buy a home</h2></div>
            ${forSale}`;
    },

    renderTenantScreen() {
        const l = window.logic;
        const home = l.getHome(this.tenantHomeId);
        const applicants = home.applicants.map((applicant, i) => {
            const type = l.getTenantType(applicant.type);
            return `
            <article class="card stack">
                <div class="row"><span class="tile">${this.icon('user')}</span>
                    <div class="grow"><h3>${applicant.name}</h3><span class="tag">${type.label}</span></div>
                    <span class="figure">+${this.formatMoney(l.getRentFor(home, type.id))}<small>/s</small></span></div>
                <p>${type.note}</p>
                <button class="btn btn-yellow wide" onclick="window.logic.chooseTenant(${home.id}, ${i})">Choose ${applicant.name}</button>
            </article>`;
        }).join('');

        return `
            <div class="card stack">
                <h3>${l.getHomeType(home.type).name}</h3>
                ${this.renderCondition(home)}
                ${this.renderRentPick(home)}
            </div>
            ${applicants}`;
    },

    formatKm(km) {
        return Math.floor(km).toLocaleString('en-US');
    },

    getTaxiPhoto(type) {
        return `Assets/cars-web/taxi-${type.id}.jpg`;
    },

    renderTaxiCar(car) {
        const l = window.logic;
        const type = l.getTaxiType(car.type);
        const worn = car.km / type.maxKm;
        return `
        <article class="card car">
            <img class="car-photo" src="${this.getTaxiPhoto(type)}" alt="${type.name}" width="640" height="429">
            <div class="row">
                <div class="grow"><h3>${type.name}</h3><span class="tag">${type.label}</span></div>
                ${car.broken
                    ? '<strong class="text-red-400">Broken down</strong>'
                    : `<span class="figure">+${this.formatMoney(type.perSecond * l.getPrestigeMultiplier())}<small>/s</small></span>`}
            </div>
            <div class="meter wear ${worn > 0.85 ? 'worn' : ''}"><div id="taxiBar-${car.id}" style="width: ${worn * 100}%"></div></div>
            <p class="row between"><span class="muted">Driven</span>
                <strong id="taxiKm-${car.id}">${this.formatKm(car.km)} / ${this.formatKm(type.maxKm)} km</strong></p>
            ${car.broken
                ? `<button id="repairTaxi-${car.id}" class="btn btn-red wide" onclick="window.logic.repairTaxi(${car.id})"
                        ${window.state.balance < l.getTaxiRepairCost(car) ? 'disabled' : ''}>Repair for ${this.formatMoney(l.getTaxiRepairCost(car))}</button>`
                : ''}
            <button id="sellTaxi-${car.id}" class="btn wide" onclick="window.logic.sellTaxi(${car.id})">Sell for ${this.formatMoney(l.getTaxiSellValue(car))}</button>
        </article>`;
    },

    renderTaxiScreen() {
        const l = window.logic;
        const taxi = window.state.taxi;
        if (!taxi) return this.renderStartScreen();
        const full = taxi.cars.length >= taxi.spaces;

        const fares = taxi.dispatcher
            ? '<div class="card"><p class="muted">Your dispatcher collects fares for you</p></div>'
            : `<div class="card row between">
                    <div><span class="muted">Fares ready</span><strong id="taxiFares" class="stat-figure text-emerald-400">${this.formatMoney(taxi.fares)}</strong></div>
                    <button id="btnCollectFares" class="btn btn-yellow" onclick="window.logic.collectFares()" ${taxi.fares > 0 ? '' : 'disabled'}>Collect</button>
                </div>
                <div class="card row">
                    <span class="tile">${this.icon('user')}</span>
                    <div class="grow"><h3>Hire a dispatcher</h3><span class="muted">Collects fares for you</span></div>
                    <button id="btnDispatcher" class="btn btn-yellow" onclick="window.logic.hireDispatcher()"
                        ${window.state.balance < l.getDispatcherCost() ? 'disabled' : ''}>${this.formatMoney(l.getDispatcherCost())}</button>
                </div>`;

        const cars = taxi.cars.length
            ? taxi.cars.map(car => this.renderTaxiCar(car)).join('')
            : `<div class="empty">${this.icon('car')}<strong>No cars yet</strong><span>Buy one below to start earning</span></div>`;

        const showroom = window.TAXI_CARS.map(type => `
            <article class="card car">
                <img class="car-photo" src="${this.getTaxiPhoto(type)}" alt="${type.name}" width="640" height="429">
                <div class="row">
                    <div class="grow"><h3>${type.name}</h3><span class="tag">${type.label}</span></div>
                    <span class="figure">+${this.formatMoney(type.perSecond * l.getPrestigeMultiplier())}<small>/s</small></span>
                </div>
                <p class="row between"><span class="muted">Scrapped at</span><strong>${this.formatKm(type.maxKm)} km</strong></p>
                <p class="row between"><span class="muted">Lasts about</span><strong>${Math.round(type.maxKm / 12500)} minutes of play</strong></p>
                <p class="row between"><span class="muted">Breakdowns</span><strong>${type.breakdowns}</strong></p>
                <button id="buyTaxi-${type.id}" class="btn btn-yellow btn-big wide" onclick="window.logic.buyTaxi('${type.id}')"
                    ${full || window.state.balance < type.price ? 'disabled' : ''}>${full ? 'Fleet full' : `Buy for ${this.formatMoney(type.price)}`}</button>
            </article>`).join('');

        return `
            <div class="section-head">
                <h2>Your fleet</h2>
                <span class="pill">${taxi.cars.length}/${taxi.spaces} Spaces</span>
                ${l.canExpandFleet()
                    ? `<button id="btnExpandFleet" class="btn btn-small" onclick="window.logic.expandTaxiFleet()"
                            ${window.state.balance < l.getTaxiSpaceCost() ? 'disabled' : ''}>Add space (${this.formatMoney(l.getTaxiSpaceCost())})</button>`
                    : ''}
            </div>
            ${fares}
            ${cars}
            <div class="section-head"><h2>Buy a taxi</h2></div>
            ${showroom}`;
    },

    // Live figures on whichever Vault screen is open
    syncBusinessScreen() {
        const l = window.logic;
        const byId = id => document.getElementById(id);
        const setText = (id, text) => { const node = byId(id); if (node) node.innerText = text; };
        const setDisabled = (id, disabled) => { const node = byId(id); if (node) node.disabled = disabled; };
        const balance = window.state.balance;

        if (!this.businessScreen) {
            this.getBusinessSummaries().forEach(s => {
                setText(`sumStatus-${s.id}`, s.status);
                const rate = byId(`sumRate-${s.id}`);
                if (rate) rate.innerHTML = this.getSummaryFigure(s);
            });
            return;
        }

        if (this.businessScreen === 'rentals') {
            this.syncRentalScreen(setText, setDisabled);
            return;
        }

        const taxi = window.state.taxi;
        if (this.businessScreen !== 'taxi' || !taxi) return;
        setText('taxiFares', this.formatMoney(taxi.fares));
        setDisabled('btnCollectFares', !(taxi.fares > 0));
        setDisabled('btnDispatcher', balance < l.getDispatcherCost());
        setDisabled('btnExpandFleet', balance < l.getTaxiSpaceCost());
        window.TAXI_CARS.forEach(type => setDisabled(`buyTaxi-${type.id}`, taxi.cars.length >= taxi.spaces || balance < type.price));
        taxi.cars.forEach(car => {
            const type = l.getTaxiType(car.type);
            setText(`taxiKm-${car.id}`, `${this.formatKm(car.km)} / ${this.formatKm(type.maxKm)} km`);
            const bar = byId(`taxiBar-${car.id}`);
            if (bar) {
                bar.style.width = `${car.km / type.maxKm * 100}%`;
                bar.parentElement.classList[car.km / type.maxKm > 0.85 ? 'add' : 'remove']('worn');
            }
            setDisabled(`repairTaxi-${car.id}`, balance < l.getTaxiRepairCost(car));
            setText(`sellTaxi-${car.id}`, `Sell for ${this.formatMoney(l.getTaxiSellValue(car))}`);
        });
    },

    syncRentalScreen(setText, setDisabled) {
        const l = window.logic;
        const rentals = window.state.rentals;
        if (!rentals) return;
        const byId = id => document.getElementById(id);
        const balance = window.state.balance;

        setText('rentPot', this.formatMoney(rentals.rent));
        setDisabled('btnCollectRent', !(rentals.rent > 0));
        setDisabled('btnAgent', balance < l.getAgentCost());
        setText('homePriceTimer', this.getPriceTimerLabel());
        const full = rentals.homes.length >= l.getMaxHomes();
        window.HOME_TYPES.forEach(type => setDisabled(`buyHome-${type.id}`, full || balance < l.getHomePrice(type.id)));

        rentals.homes.forEach(home => {
            const percent = l.getConditionPercent(home);
            setText(`homeCondition-${home.id}`, `${percent}%`);
            const bar = byId(`homeBar-${home.id}`);
            if (bar) {
                bar.style.width = `${percent}%`;
                bar.parentElement?.classList[percent < 40 ? 'add' : 'remove']('worn');
            }
            const rate = byId(`homeRate-${home.id}`);
            if (rate) rate.innerHTML = this.getHomeFigure(home);
            const cost = l.getHomeRepairCost(home);
            byId(`repairHome-${home.id}`)?.classList[cost ? 'remove' : 'add']('hidden');
            setText(`repairHome-${home.id}`, this.getRepairLabel(home));
            setDisabled(`repairHome-${home.id}`, balance < cost);
            setText(`sellHome-${home.id}`, this.getSellLabel(home));
            setText(`applicantWait-${home.id}`, this.getApplicantLabel(home));
        });
    },

    getLifestylePhoto(item) {
        return `Assets/lifestyle-web/${item.id}.jpg`;
    },

    renderLifestylePhoto(item, className = '') {
        return `<img ${className ? `class="${className}"` : ''} src="${this.getLifestylePhoto(item)}" alt="${item.name}" width="640" height="429" loading="lazy" decoding="async">`;
    },

    renderLifestyle() {
        const el = this.elements;
        if (!el.lifestyleContent) return;

        const owned = window.state.lifestyle || {};
        const level = window.logic.getLifestyleLevel();
        const collection = window.LIFESTYLE_ITEMS.filter(item => owned[item.id]);

        const shop = [...new Set(window.LIFESTYLE_ITEMS.map(item => item.type))].map(type => `
            <section class="stack">
                <div class="section-head"><h2>${type}</h2></div>
                ${window.LIFESTYLE_ITEMS.filter(item => item.type === type).map(item => {
                    const have = owned[item.id] || 0;
                    const action = have && !item.repeatable
                        ? '<span class="pill pill-owned">Owned</span>'
                        : `<button id="lifeBuy-${item.id}" class="btn btn-yellow ${window.state.balance < item.price ? 'is-short' : ''}"
                                onclick="window.logic.buyLifestyle('${item.id}')">${have ? 'Again' : 'Buy'}<small>${this.formatMoney(item.price)}</small></button>`;
                    return `<article class="card car">
                        ${this.renderLifestylePhoto(item, 'item-photo')}
                        <div class="row">
                            <div class="grow"><h3>${item.name}</h3></div>
                            ${action}
                        </div>
                    </article>`;
                }).join('')}
            </section>`).join('');

        el.lifestyleContent.innerHTML = `
            <div class="card rank-card">
                <span class="badge-icon badge-yellow">${this.icon('gem')}</span>
                <h2>${level.name}</h2>
                <div class="meter"><div style="width: ${Math.round(level.progress * 100)}%"></div></div>
                <p class="note">${level.next ? `Spend ${this.formatMoney(level.remaining)} more to reach ${level.next}` : 'You have reached the top'}</p>
            </div>
            <section class="stack">
                <div class="section-head"><h2>Your life</h2></div>
                ${collection.length
                    ? `<div class="collection">${collection.map(item => `
                            <div class="owned">${this.renderLifestylePhoto(item)}<strong>${item.name}</strong>${owned[item.id] > 1 ? `<small>${owned[item.id]} times</small>` : ''}</div>`).join('')}</div>`
                    : `<div class="empty">${this.icon('gem')}<strong>Nothing in your collection yet</strong><span>Treat yourself below</span></div>`}
            </section>
            ${shop}`;
    },

    renderProfile() {
        const el = this.elements;
        if (!el.statRank) return;

        const prestige = window.state.prestigeCount || 0;
        const rank = window.state.rank || 'Novice Hustler';
        el.statRank.innerText = prestige > 0 ? `[Prestige ${prestige}] ${rank}` : rank;
        el.statRank.classList[prestige > 0 ? 'add' : 'remove']('prestiged');
        el.statTotalEarnings.innerText = this.formatMoney(window.state.lifetimeEarnings || 0);
        el.statTotalClicks.innerText = window.state.totalClicks || 0;

        if (el.rankProgressBar) {
            const { next, remaining, progress } = window.logic.getRankProgress();
            el.rankProgressBar.style.width = `${Math.round(progress * 100)}%`;
            el.rankProgressText.innerText = next ? `${this.formatMoney(remaining)} to ${next}` : 'Top rank reached';
        }

        if (el.taxBtn) {
            const on = window.logic.taxesOn();
            el.taxBtn.innerText = on ? 'On' : 'Off';
            el.taxBtn.classList[on ? 'add' : 'remove']('btn-yellow');
            el.taxBtn.setAttribute('aria-pressed', on);
        }

        if (el.prestigeBtn) {
            const remaining = window.logic.getPrestigeRemaining();
            const bonus = (prestige + 1) * 10;
            el.prestigeBtn.disabled = remaining > 0;
            el.prestigeInfo.innerText = remaining > 0
                ? `Earn ${this.formatMoney(remaining)} more to unlock a restart with a permanent +${bonus}% income bonus.`
                : `Restart with a permanent +${bonus}% income bonus. You lose your money, businesses, stocks and cars.`;
        }
    },

    updateUI() {
        this.syncVisualsSilently();
        if (window.state.activeTab === 'invest') this.renderMarket();
    },

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const hours = Math.floor(minutes / 60);
        return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
    },

    renderAwayModal() {
        const el = this.elements;
        if (!el.awayModal) return;
        const away = window.state.away;
        if (!away) {
            el.awayModal.classList.add('hidden');
            return;
        }
        el.awayAmount.innerText = this.formatMoney(away.amount);
        el.awayDuration.innerText = this.formatDuration(away.ms);
        el.awayModal.classList.remove('hidden');
    },

    // Runs every frame: updates figures and button states without rebuilding anything
    syncVisualsSilently() {
        const el = this.elements;
        const l = window.logic;
        const byId = id => document.getElementById(id);
        const markShort = (button, short) => button?.classList[short ? 'add' : 'remove']('is-short');

        this.renderAwayModal();

        if (el.balanceDisplay) el.balanceDisplay.innerText = this.formatMoney(window.state.balance);
        if (el.passiveIncomeDisplay) el.passiveIncomeDisplay.innerText = `+${this.formatMoney(l.getPassiveIncome())} per second`;

        if (window.state.activeTab === 'vault') {
            const businesses = Array.isArray(window.state.businesses) ? window.state.businesses : [];
            businesses.forEach((biz, idx) => {
                markShort(byId(`bizUpgradeBtn-${idx}`), window.state.balance < l.getBusinessUpgradeCost(biz));

                const accumulated = byId(`bizAccumulatedIdx-${idx}`);
                const collect = byId(`bizCollectBtnIdx-${idx}`);
                if (accumulated && collect) {
                    accumulated.innerText = this.formatMoney(biz.accumulated || 0);
                    collect.disabled = (biz.accumulated || 0) <= 0;
                }
            });
            window.BUSINESS_DATA.forEach(b => {
                const manager = byId(`managerBtn-${b.id}`);
                if (manager) manager.disabled = window.state.balance < l.getManagerCost(b.id);
                const buy = byId(`bizBuyBtn-${b.id}`);
                if (buy) markShort(buy, window.state.balance < l.getBusinessCost(b.id));
            });
            markShort(byId('startRetail'), window.state.balance < l.getBusinessCost('retail') && this.getOwned('retail').length < 3);
            markShort(byId('startTaxi'), !window.state.taxi && window.state.balance < l.getTaxiOpenCost());
            markShort(byId('startDealer'), !window.state.hasDealerLicense && window.state.balance < l.getLicenseCost());
            markShort(byId('startRentals'), !window.state.rentals && window.state.balance < l.getRentalOpenCost());
            this.syncBusinessScreen();
        }

        if (window.state.activeTab === 'lifestyle') {
            window.LIFESTYLE_ITEMS.forEach(item => markShort(byId(`lifeBuy-${item.id}`), window.state.balance < item.price));
        }

        if (this.isDealerOpen()) {
            if (el.buyGarageBtn) el.buyGarageBtn.disabled = window.state.balance < l.getGarageExpansionCost();

            (window.state.dealerCars || []).forEach((car, i) => {
                const repair = byId(`repairBtn-${i}`);
                if (repair) repair.disabled = window.state.balance < l.getRepairCost(car);
            });
            const garageFull = (window.state.dealerCars || []).length >= l.getGarageSlots();
            (window.state.auctionCars || []).forEach((car, i) => {
                const buy = byId(`auctionBuy-${i}`);
                if (buy) buy.disabled = garageFull || window.state.balance < car.price;
                const inspect = byId(`auctionInspect-${i}`);
                if (inspect) inspect.disabled = car.inspected || window.state.balance < l.getInspectCost(car);
            });

            const auctionWait = l.getWaitLeft(window.state.nextAuctionAt, 30000);
            if (el.browseAuctionsBtn) el.browseAuctionsBtn.disabled = auctionWait > 0;
            if (el.browseAuctionsLabel) {
                el.browseAuctionsLabel.innerText = auctionWait > 0
                    ? `New auction in ${Math.ceil(auctionWait / 1000)}s`
                    : 'Browse Auctions';
            }
            if (el.demandTimer) {
                const demandWait = l.getWaitLeft(window.state.demandNextAt, 60000);
                el.demandTimer.innerText = `changes in ${Math.ceil(demandWait / 1000)}s`;
            }
        }

        // Earnings can arrive while the Stats screen is open
        if (window.state.activeTab === 'profile') this.renderProfile();

        const clickValue = l.getClickValue();
        if (el.clickValueDisplay) el.clickValueDisplay.innerText = `+${this.formatMoney(clickValue)}`;
        if (el.efficiencyDisplay) el.efficiencyDisplay.innerText = `Efficiency: Lvl ${Math.round(clickValue / l.getPrestigeMultiplier())}`;

        this.updateDealerBadge();
    },

    showSaveIndicator(saved = true) {
        const el = this.elements;
        if (!el.saveIndicator || !el.saveDot || !el.saveLabel) return;

        clearTimeout(this.saveIndicatorTimer);
        el.saveLabel.textContent = saved ? 'Saved' : 'Not saved';
        el.saveDot.classList.remove('ok', 'fail');
        el.saveDot.classList.add(saved ? 'ok' : 'fail');

        if (!saved) return; // leave the warning up until a save succeeds
        this.saveIndicatorTimer = setTimeout(() => el.saveDot.classList.remove('ok'), 1500);
    },

    triggerBalancePulse(color) {
        const balance = this.elements.balanceDisplay;
        if (!balance) return;
        balance.classList.remove('flash-good', 'flash-bad');
        void balance.offsetWidth;
        balance.classList.add(color === 'green' ? 'flash-good' : 'flash-bad');
    },

    showToast(message, tone = 'bad') {
        const container = this.elements.toastContainer;
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = `toast toast-${tone}`;
        toast.innerHTML = this.icon(tone === 'good' ? 'check' : 'alert');
        const text = document.createElement('span');
        text.textContent = message;
        toast.appendChild(text);
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    },

    createParticle(e, text) {
        if (!this.particleContainer) {
            this.particleContainer = document.createElement('div');
            this.particleContainer.className = 'particle-layer';
            document.body.appendChild(this.particleContainer);
        }

        // Keyboard presses report 0,0, so use the middle of the button
        let x = e.clientX;
        let y = e.clientY;
        if (x === 0 && y === 0 && e.target) {
            const rect = e.target.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 2;
        }

        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerText = text;
        // A little scatter so quick taps do not stack
        particle.style.left = `${x - 30 + (Math.random() - 0.5) * 40}px`;
        particle.style.top = `${y - 30 + (Math.random() - 0.5) * 20}px`;

        this.particleContainer.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
    }
};

window.ui = ui;
