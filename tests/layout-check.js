// Browser layout check. Serve the project, resize to a phone size, then run in the page:
//   eval(await (await fetch('/tests/layout-check.js')).text())
// It plays with a throwaway balance and returns a list of problems (empty means pass).
(() => {
    const S = window.state, L = window.logic, U = window.ui;
    const problems = [];
    const box = el => el.getBoundingClientRect();
    const visible = el => el && box(el).height > 0;

    S.balance = 5000000;
    S.hasDealerLicense = true;
    S.hasCasinoMembership = true;
    // A current player has at most the shop, the taxi company and rental homes
    S.businesses = [];
    L.buyBusiness('retail');
    S.taxi = { fares: 123456.7, spaces: 3, dispatcher: false, nextId: 3, cars: [
        { id: 1, type: 'luxury', km: 140000, broken: false },
        { id: 2, type: 'hatchback', km: 62000, broken: true }
    ] };
    const home = (id, type, extra) => ({ id, type, condition: 64, rentLevel: 'fair', tenant: null, late: false,
        minuteMs: 0, applicants: null, waitUntil: null, ...extra });
    const applicants = [{ name: 'Jordan', type: 'careful' }, { name: 'Sam', type: 'late' }, { name: 'Alex', type: 'rough' }];
    S.rentals = { rent: 123456789, agent: false, nextId: 5, lastPayout: Date.now(), marketMs: 0,
        market: { studio: 125, house: 100, villa: 80 }, change: { studio: 5, house: 0, villa: -5 }, homes: [
            home(1, 'villa', { tenant: { name: 'Priya', type: 'rough' } }),
            home(2, 'house', { tenant: { name: 'Maria', type: 'late' }, late: true }),
            home(3, 'studio', { applicants }),
            home(4, 'villa', { waitUntil: Date.now() + 60000 })
        ] };
    S.blackjack = { active: false, playerHand: [], dealerHand: [], status: '', bet: 0 };
    S.away = null;
    S.managers = {};
    S.garageSlots = 3;
    S.dealerCars = [
        { tier: 'classic', name: '1955 Roadster', icon: '🚘', value: 48000, buyPrice: 43200, status: 'ready' },
        { tier: 'rare', name: '2015 Sports Car', icon: '🏎️', value: 7900, buyPrice: 7900, status: 'needs_repair' }
    ];
    S.nextAuctionAt = 0;
    L.browseAuctions();
    L.spinning.slots = L.spinning.roulette = false;

    const footer = document.querySelector('footer');
    const header = document.querySelector('header');

    function checkScreen(name, view, mustSee = []) {
        view.scrollTop = 0;
        [['header', header], ['nav bar', footer]].forEach(([label, el]) => {
            const r = box(el);
            if (r.top < -1 || r.bottom > innerHeight + 1) problems.push(`${name}: ${label} is off screen`);
        });
        mustSee.forEach(id => {
            const el = document.getElementById(id);
            if (!visible(el)) return problems.push(`${name}: ${id} is not shown`);
            const r = box(el), v = box(view), f = box(footer);
            const floor = Math.min(v.bottom, innerHeight, f.left < r.right && f.right > r.left ? f.top : innerHeight);
            if (r.bottom > floor + 1 || r.top < v.top - 1) problems.push(`${name}: ${id} needs scrolling`);
        });
        document.querySelectorAll('#app button').forEach(b => {
            if (!visible(b)) return;
            const r = box(b);
            if (r.height < 43.5 || r.width < 43.5) {
                problems.push(`${name}: small button "${b.innerText.trim().replace(/\s+/g, ' ')}" ${Math.round(r.width)}x${Math.round(r.height)}`);
            }
        });
        if (view.scrollWidth > view.clientWidth + 1) problems.push(`${name}: scrolls sideways`);
        document.querySelectorAll('#app .card, #app .btn, #app .nav-btn, #app .hero').forEach(box_ => {
            if (visible(box_) && box_.scrollWidth > box_.clientWidth + 1) {
                problems.push(`${name}: content spills out of "${box_.innerText.trim().replace(/\s+/g, ' ').slice(0, 30)}"`);
            }
        });
    }

    const view = id => document.getElementById(id + 'View');
    const click = id => document.getElementById(id).click();

    S.away = { amount: 1234567890, ms: 26 * 3600 * 1000 };
    U.switchTab('vault'); U.updateUI();
    checkScreen('welcome back', document.getElementById('awayModal'), ['awayCollectBtn']);
    S.away = null; U.updateUI();
    checkScreen('vault', view('vault'), ['workBtn', 'startBusinessBtn']);
    ['start', 'retail', 'taxi', 'rentals'].forEach(name => {
        U.showBusiness(name);
        checkScreen(`${name} business`, view('vault'));
        if (!document.getElementById('businessDetail').innerText.trim()) problems.push(`${name} business: nothing shown`);
    });
    U.showTenants(3);
    checkScreen('tenants business', view('vault'));
    if (!document.getElementById('businessDetail').innerText.includes('Choose Sam')) problems.push('tenants: no applicants shown');
    U.goBack(); U.goBack();
    U.showBusiness('dealer'); checkScreen('dealership', view('vault'));
    if (!document.getElementById('marketContent').innerText.trim()) problems.push('dealership: nothing shown');
    U.goBack();
    U.switchTab('lifestyle'); checkScreen('lifestyle', view('lifestyle'));
    U.switchTab('invest'); checkScreen('trade', view('invest'));
    U.switchTab('profile'); checkScreen('stats', view('profile'));
    U.switchTab('casino'); checkScreen('casino lobby', view('casino'));

    const casino = view('casino');
    const short = innerHeight < 500;
    click('btnOpenSlots'); checkScreen('slots', casino, short ? [] : ['spinSlotsBtn']);
    U.showCasinoLobby(); click('btnOpenRoulette'); checkScreen('roulette', casino, short ? [] : ['btnBetRed', 'btnBetBlack', 'btnBetGreen']);
    U.showCasinoLobby(); click('btnOpenBlackjack');
    const realGetCard = L.getCard;
    L.getCard = () => ({ value: '3', suit: '♠' });
    L.bjDeal(1000);
    L.bjHit(); L.bjHit();
    checkScreen('blackjack hand', casino, short ? [] : ['btnBjHit', 'btnBjStand', 'btnBjDouble']);
    const tableDisplay = getComputedStyle(document.getElementById('bjTable')).display;
    if (tableDisplay !== 'flex') problems.push(`blackjack: table rows have no spacing (display ${tableDisplay})`);
    L.getCard = realGetCard;
    L.bjReset(); // asks before giving up a live bet
    checkScreen('confirm box', document.getElementById('confirmModal'), ['confirmYes', 'confirmNo']);
    U.answer(true);
    S.dealerCars = [];
    S.auctionCars = [];
    U.switchTab('vault');

    const usable = Math.round(box(view('vault')).height);
    if (usable < Math.min(innerHeight * 0.55, 450)) problems.push(`vault: only ${usable}px of ${innerHeight}px left for content`);

    return { size: `${innerWidth}x${innerHeight}`, contentHeight: usable, problems: [...new Set(problems)] };
})();
