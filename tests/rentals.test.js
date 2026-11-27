const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const FULL = ['state.js', 'logic.js', 'ui.js'];
const SAVE = 'businessEmpireState';

function setup(balance = 5_000_000, files) {
    const game = createGame(files ? { files } : {});
    game.window.state.balance = balance;
    const chance = value => game.run(`Math.random = () => ${value}`);
    return { game, chance, state: game.window.state, logic: game.window.logic };
}

// A company with the given homes. At 0.5 nobody leaves, nobody pays late and prices hold still.
function landlord(types = [], balance = 5_000_000, files) {
    const t = setup(5_000_000, files);
    t.chance(0.5);
    t.logic.openRentals();
    types.forEach(type => t.logic.buyHome(type));
    t.state.balance = balance;
    t.homes = () => t.state.rentals.homes;
    // Moves a tenant of the given type into the home
    t.move = (home, type = 'average') => {
        home.applicants = [{ name: 'Pat', type }];
        t.logic.chooseTenant(home.id, 0);
        return home;
    };
    return t;
}

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < 0.01, `${actual} is not ${expected}`);

// ---- Rules ----

test('the rental business opens once for $150,000', () => {
    const { state, logic } = setup(400000);
    logic.openRentals();
    logic.openRentals();
    assert.strictEqual(state.balance, 250000);
    assert.strictEqual(state.rentals.homes.length, 0);
});

test('no business without the money, and no homes without the business', () => {
    const { state, logic } = setup(149999);
    logic.openRentals();
    logic.buyHome('studio');
    assert.strictEqual(state.balance, 149999);
    assert.ok(!state.rentals);
});

test('homes cost $40k, $150k and $600k, and four is the limit', () => {
    const { state, logic, homes } = landlord([]);
    ['studio', 'house', 'villa', 'studio', 'studio'].forEach(type => logic.buyHome(type));
    assert.strictEqual(homes().length, 4);
    assert.strictEqual(state.balance, 5_000_000 - 40000 - 150000 - 600000 - 40000);
    assert.strictEqual(homes()[0].condition, 100);
    assert.strictEqual(homes()[0].rentLevel, 'fair');
    assert.strictEqual(new Set(homes().map(h => h.id)).size, 4);
});

test('the price follows the market', () => {
    const { state, logic } = landlord([], 43200);
    state.rentals.market.studio = 108;
    assert.strictEqual(logic.getHomePrice('studio'), 43200);
    logic.buyHome('studio');
    assert.strictEqual(state.balance, 0);
});

test('a new home has three different applicants ready', () => {
    [0, 0.5, 0.999].forEach(value => {
        const { chance, logic, homes } = landlord([]);
        chance(value);
        logic.buyHome('studio');
        const applicants = homes()[0].applicants;
        assert.strictEqual(applicants.length, 3);
        assert.strictEqual(new Set(applicants.map(a => a.type)).size, 3);
        assert.strictEqual(new Set(applicants.map(a => a.name)).size, 3);
    });
});

test('choosing an applicant moves them in, once', () => {
    const { logic, homes } = landlord(['studio']);
    const home = homes()[0];
    const [first, second] = home.applicants;
    logic.chooseTenant(home.id, 7);
    assert.ok(!home.tenant);
    logic.chooseTenant(home.id, 0);
    logic.chooseTenant(home.id, 1);
    assert.strictEqual(home.tenant.name, first.name);
    assert.notStrictEqual(home.tenant.name, second.name);
    assert.ok(!home.applicants);
});

test('rent depends on the tenant, the rent level and the condition', () => {
    const { state, logic, homes, move } = landlord(['studio']);
    const home = move(homes()[0], 'careful');
    home.condition = 90;
    near(logic.getHomeRate(home), 48.45);

    home.condition = 100;
    near(logic.getHomeRate(home), 51);
    logic.setRentLevel(home.id, 'low');
    near(logic.getHomeRate(home), 40.8);
    logic.setRentLevel(home.id, 'high');
    near(logic.getHomeRate(home), 63.75);
    logic.setRentLevel(home.id, 'silly');
    assert.strictEqual(home.rentLevel, 'high');

    state.prestigeCount = 1;
    near(logic.getHomeRate(home), 70.125);
});

test('the four tenant types pay 85%, 100%, 130% and 140%', () => {
    const { logic, homes, move } = landlord(['house']);
    const rates = ['careful', 'average', 'late', 'rough'].map(type => {
        homes()[0].tenant = null;
        return logic.getHomeRate(move(homes()[0], type));
    });
    [212.5, 250, 325, 350].forEach((expected, i) => near(rates[i], expected));
});

test('a wrecked home earns half rent', () => {
    const { logic, homes, move } = landlord(['villa']);
    const home = move(homes()[0]);
    home.condition = 0;
    near(logic.getHomeRate(home), 550);
});

test('empty homes earn nothing, and the earning rate adds up the rest', () => {
    const { logic, homes, move } = landlord(['studio', 'house']);
    assert.strictEqual(logic.getPassiveIncome(), 0);
    move(homes()[0]);
    near(logic.getPassiveIncome(), 60);
    move(homes()[1]);
    near(logic.getPassiveIncome(), 310);
});

test('condition drops only while someone lives there, faster for rough tenants', () => {
    const { logic, homes, move } = landlord(['studio', 'studio', 'studio', 'studio']);
    ['careful', 'average', 'rough'].forEach((type, i) => move(homes()[i], type));
    logic.processRentals(MINUTE);
    assert.deepStrictEqual(Array.from(homes(), h => Math.round(h.condition)), [98, 96, 90, 100]);
    for (let i = 0; i < 40; i++) logic.processRentals(MINUTE);
    assert.strictEqual(homes()[2].condition, 0);
});

test('the chance of leaving each minute is 3%, 8% or 20%, halved for careful tenants', () => {
    const cases = [
        ['average', 'low', 0.03], ['average', 'fair', 0.08], ['average', 'high', 0.20], ['careful', 'high', 0.10]
    ];
    cases.forEach(([type, level, odds]) => {
        [[odds - 0.001, true], [odds + 0.001, false]].forEach(([roll, leaves]) => {
            const { chance, logic, homes, move } = landlord(['studio']);
            const home = move(homes()[0], type);
            logic.setRentLevel(home.id, level);
            chance(roll);
            logic.processRentals(MINUTE);
            assert.strictEqual(!home.tenant, leaves, `${type} ${level} at ${roll}`);
        });
    });
});

test('new applicants arrive 30, 60 or 90 seconds after a tenant leaves', () => {
    [['low', 30], ['fair', 60], ['high', 90]].forEach(([level, seconds]) => {
        const { chance, logic, homes, move } = landlord(['studio']);
        const home = move(homes()[0]);
        logic.setRentLevel(home.id, level);
        chance(0);
        logic.processRentals(SECOND, 1_000_000);
        chance(0.5);
        assert.ok(!home.tenant && !home.applicants);
        assert.strictEqual(logic.getApplicantWait(home, 1_000_000), seconds * SECOND);

        logic.processRentals(SECOND, 1_000_000 + seconds * SECOND - 1);
        assert.ok(!home.applicants);
        logic.processRentals(SECOND, 1_000_000 + seconds * SECOND);
        assert.strictEqual(home.applicants.length, 3);
    });
});

test('a late payer misses the rent for about one minute in five', () => {
    const { chance, logic, homes, move } = landlord(['studio']);
    chance(0.19);
    const home = move(homes()[0], 'late');
    assert.strictEqual(logic.getHomeRate(home), 0);
    chance(0.21);
    logic.processRentals(MINUTE - 1);
    assert.strictEqual(logic.getHomeRate(home), 0);
    logic.processRentals(1);
    near(logic.getHomeRate(home), 60 * 1.3 * logic.getConditionFactor(home));
    chance(0.19);
    logic.processRentals(MINUTE);
    assert.strictEqual(logic.getHomeRate(home), 0);
});

test('prices move once a minute, by up to 5 points, between 80% and 125%', () => {
    const { state, chance, logic } = landlord([]);
    const market = () => state.rentals.market;
    chance(0.999);
    logic.processRentals(MINUTE - 1);
    assert.strictEqual(market().studio, 100);
    logic.processRentals(1);
    assert.deepStrictEqual([market().studio, market().house, market().villa], [105, 105, 105]);
    assert.strictEqual(state.rentals.change.villa, 5);
    for (let i = 0; i < 10; i++) logic.processRentals(MINUTE);
    assert.strictEqual(market().villa, 125);
    assert.strictEqual(state.rentals.change.villa, 0);
    chance(0);
    for (let i = 0; i < 20; i++) logic.processRentals(MINUTE);
    assert.strictEqual(market().villa, 80);
});

test('rent waits to be collected, once, also by Collect all', () => {
    const { state, logic, homes, move } = landlord(['studio'], 0);
    move(homes()[0]);
    const start = state.rentals.lastPayout;
    const earnedBefore = state.lifetimeEarnings;
    logic.processBusinessIncome(start + 10 * SECOND);
    near(state.rentals.rent, 600);
    assert.strictEqual(state.balance, 0);
    assert.strictEqual(state.lifetimeEarnings, earnedBefore);

    logic.collectRent();
    logic.collectRent();
    near(state.balance, 600);
    near(state.lifetimeEarnings, earnedBefore + 600);

    logic.processBusinessIncome(start + 11 * SECOND);
    logic.collectAllIncome();
    near(state.balance, 660);
});

test('an agent costs $100,000 and sends rent straight to the balance', () => {
    const { state, logic, homes, move } = landlord(['studio'], 100000);
    move(homes()[0]);
    state.rentals.rent = 500;
    logic.hireAgent();
    logic.hireAgent();
    near(state.balance, 500);
    logic.processBusinessIncome(state.rentals.lastPayout + 10 * SECOND);
    near(state.balance, 1100);
    assert.strictEqual(state.rentals.rent, 0);
});

test('repairs cost the damaged share of the full price', () => {
    const { state, logic, homes } = landlord(['house'], 8099);
    const home = homes()[0];
    assert.strictEqual(logic.getHomeRepairCost(home), 0);
    home.condition = 64;
    assert.strictEqual(logic.getHomeRepairCost(home), 8100);
    logic.repairHome(home.id);
    assert.strictEqual(home.condition, 64);
    state.balance = 10000;
    logic.repairHome(home.id);
    logic.repairHome(home.id);
    assert.strictEqual(home.condition, 100);
    assert.strictEqual(state.balance, 1900);
    home.condition = 0;
    assert.deepStrictEqual(
        ['studio', 'house', 'villa'].map(type => logic.getHomeRepairCost({ type, condition: 0 })),
        [4000, 22500, 120000]);
});

test('condition is counted in the whole points shown, so a fresh repair stays repaired', () => {
    const { logic, homes } = landlord(['studio']);
    const home = homes()[0];
    home.condition = 99.98; // a moment after repairing, with a tenant still wearing it
    assert.strictEqual(logic.getConditionPercent(home), 100);
    assert.strictEqual(logic.getHomeRepairCost(home), 0);
    home.condition = 89.2;
    assert.strictEqual(logic.getConditionPercent(home), 90);
    assert.strictEqual(logic.getHomeRepairCost(home), 400);
});

test('selling pays the current price less a 10% fee and the repairs', () => {
    const { state, logic, homes } = landlord(['studio', 'house']);
    const [studio, house] = homes();
    state.rentals.market.studio = 108;
    state.rentals.market.house = 92;
    studio.condition = 90;
    house.condition = 64;
    assert.strictEqual(logic.getHomeSellValue(studio), 38480);
    assert.strictEqual(logic.getHomeSellValue(house), 116100);
});

test('a home is sold only after agreeing, once, and not toward Prestige', () => {
    const { game, state, logic, homes } = landlord(['studio'], 0);
    const id = homes()[0].id;
    const earnedBefore = state.lifetimeEarnings;
    game.window.confirm = () => false;
    logic.sellHome(id);
    assert.strictEqual(homes().length, 1);
    game.window.confirm = () => true;
    logic.sellHome(id);
    logic.sellHome(id);
    assert.strictEqual(homes().length, 0);
    assert.strictEqual(state.balance, 36000);
    assert.strictEqual(state.lifetimeEarnings, earnedBefore);
});

test('a home sold after the price moved pays the price at that moment', () => {
    const { game, state, logic, homes, move } = landlord(['studio'], 0, FULL);
    const ui = game.window.ui;
    ui.elements = Object.fromEntries(
        ['confirmTitle', 'confirmMessage', 'confirmYes', 'confirmNo', 'confirmModal'].map(n => [n, fakeElement()]));
    const home = move(homes()[0]);
    logic.sellHome(home.id);
    assert.match(ui.elements.confirmMessage.innerText, /about \$36,000.*tenant/i);

    state.rentals.market.studio = 110;
    home.tenant = null; // left while the question was open
    ui.answer(true);
    assert.strictEqual(state.balance, 39600);

    logic.sellHome(home.id);
    ui.answer(true);
    assert.strictEqual(state.balance, 39600);
});

// ---- Time away ----

const away = (type, level, gap = 60 * MINUTE) => {
    const t = landlord(['studio'], 0);
    const home = t.move(t.homes()[0], type);
    t.logic.setRentLevel(home.id, level);
    t.logic.processBusinessIncome(t.state.rentals.lastPayout + gap);
    return t;
};

test('away rent is full for a minute, then 25%, for up to two hours', () => {
    near(away('average', 'fair').state.away.amount, 60 * (60 + 3540 * 0.25));
    near(away('average', 'fair', 10 * 60 * MINUTE).state.away.amount, 60 * (60 + 7140 * 0.25));
});

test('while away, high rent counts as fair and late payers pay their average', () => {
    const seconds = 60 + 3540 * 0.25;
    near(away('average', 'high').state.away.amount, 60 * seconds);
    near(away('average', 'low').state.away.amount, 48 * seconds);
    near(away('late', 'fair').state.away.amount, 60 * 1.3 * 0.8 * seconds);
});

test('away rent waits for the welcome back screen, even with an agent', () => {
    const t = landlord(['studio'], 100000);
    t.move(t.homes()[0]);
    t.logic.hireAgent();
    t.logic.processBusinessIncome(t.state.rentals.lastPayout + 60 * MINUTE);
    assert.strictEqual(t.state.balance, 0);
    assert.strictEqual(t.state.rentals.rent, 0);
    t.logic.collectAway();
    near(t.state.balance, 56700);
});

test('shops and rentals share one welcome back total and count the time once', () => {
    const t = landlord(['studio']);
    t.move(t.homes()[0]);
    t.logic.buyBusiness('retail');
    const now = Date.now();
    t.state.rentals.lastPayout = now;
    t.state.businesses[0].lastPayout = now;
    t.logic.processBusinessIncome(now + 60 * MINUTE);
    near(t.state.away.amount, (60 + 2) * (60 + 3540 * 0.25));
    assert.strictEqual(t.state.away.ms, 60 * MINUTE);
});

test('no wear, departures or price changes while away', () => {
    const { game, state, chance, logic, homes, move } = landlord(['studio']);
    const home = move(homes()[0]);
    chance(0.01); // an hour counted in full would send the tenant away
    const frames = [];
    game.window.performance = { now: () => 0 };
    game.window.requestAnimationFrame = fn => frames.push(fn);
    state.rentals.lastPayout = Date.now() - 60 * MINUTE;
    logic.startGameLoop();
    frames.shift()(3600 * SECOND);
    assert.ok(home.condition > 99.8 && home.condition < 100, `${home.condition}`);
    assert.strictEqual(state.rentals.market.studio, 100);
    assert.ok(state.away.amount > 0);
});

test('a clock moved backwards costs nothing and does not leave a home waiting', () => {
    const { logic, state, homes } = landlord(['studio'], 0);
    const home = homes()[0];
    home.applicants = null;
    home.waitUntil = 10_000_000;
    logic.processBusinessIncome(state.rentals.lastPayout - 60 * MINUTE);
    assert.strictEqual(state.rentals.rent, 0);
    assert.ok(!state.away);
    logic.processRentals(SECOND, 1000);
    assert.strictEqual(home.applicants.length, 3);
});

// ---- Saving and starting again ----

test('homes and applicants survive a reload', () => {
    const { game, homes } = landlord(['villa']);
    const applicants = JSON.stringify(homes()[0].applicants);
    game.window.saveGame();
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.state.rentals.homes[0].type, 'villa');
    assert.strictEqual(JSON.stringify(next.window.state.rentals.homes[0].applicants), applicants);
});

test('a save from before rentals still loads and runs', () => {
    const game = createGame({ storage: new Map([[SAVE, JSON.stringify({ balance: 5 })]]) });
    game.window.loadGame();
    game.window.logic.processRentals(SECOND);
    game.window.logic.processBusinessIncome();
    game.window.logic.collectAllIncome();
    assert.strictEqual(game.window.logic.getPassiveIncome(), 0);
    assert.ok(!game.window.state.rentals);
});

test('prestige closes the rental business', () => {
    const { state, logic } = landlord(['studio']);
    state.lifetimeEarnings = 1_000_000;
    logic.prestige();
    assert.ok(!state.rentals);
});

// ---- Screens ----

function screens(types = []) {
    const t = landlord(types, 5_000_000, FULL);
    const el = {};
    ['app', 'headerTitle', 'btnHeaderBack', 'vaultHome', 'businessDetail', 'businessesList', 'storeCountDisplay',
        'dealerBadge'].forEach(name => { el[name] = fakeElement(); });
    el.app.dataset = {};
    el.businessDetail = fakeElement('hidden');
    el.btnHeaderBack = fakeElement('hidden');
    el.dealerBadge = fakeElement('hidden');
    t.ui = t.game.window.ui;
    t.ui.elements = el;
    t.el = el;
    t.html = () => el.businessDetail.innerHTML;
    return t;
}

test('Start a business offers Rental Properties, and opening it shows the Rentals screen', () => {
    const t = setup(1_000_000, FULL);
    const el = { businessDetail: fakeElement(), businessesList: fakeElement(), headerTitle: fakeElement() };
    t.game.window.ui.elements = el;
    t.game.window.ui.showBusiness('start');
    assert.match(el.businessDetail.innerHTML, /Rental Properties/);
    assert.match(el.businessDetail.innerHTML, /Open for \$150\.0k/);

    t.game.window.ui.startBusiness('rentals');
    assert.ok(t.state.rentals);
    assert.strictEqual(el.headerTitle.innerText, 'Rentals');
    assert.match(el.businessDetail.innerHTML, /No homes yet/);

    t.game.window.ui.showBusiness('start');
    assert.match(el.businessDetail.innerHTML, /Manage your homes/);
});

test('the Vault card counts homes and warns about empty ones', () => {
    const { ui, el, homes, move } = screens(['studio', 'house']);
    ui.renderBusinesses();
    assert.match(el.businessesList.innerHTML, /Rental Properties/);
    assert.match(el.businessesList.innerHTML, /2 homes/);
    assert.match(el.businessesList.innerHTML, /text-red-400">2 homes empty/);
    move(homes()[0]);
    ui.renderBusinesses();
    assert.match(el.businessesList.innerHTML, /1 home empty/);
    move(homes()[1]);
    ui.renderBusinesses();
    assert.match(el.businessesList.innerHTML, /in rent/);
    assert.doesNotMatch(el.businessesList.innerHTML, /home empty|homes empty/);
});

test('a rented home shows its tenant, condition, rent level, repair and sale price', () => {
    const { ui, html, homes, move, logic } = screens(['studio']);
    const home = move(homes()[0], 'careful');
    home.condition = 90;
    logic.setRentLevel(home.id, 'high');
    ui.showBusiness('rentals');
    assert.match(html(), /Studio flat/);
    assert.match(html(), />Rented</);
    assert.match(html(), /Pat · Careful/);
    assert.match(html(), />90%</);
    assert.match(html(), /aria-pressed="true"[^>]*>High</);
    assert.match(html(), /Repair for \$400\.00/);
    assert.match(html(), /Sell for \$35\.6k/);
    assert.match(html(), /1\/4 Homes/);
    assert.doesNotMatch(html(), /Choose a tenant/);
});

test('an undamaged home hides its repair button', () => {
    const { ui, html, homes } = screens(['studio']);
    ui.showBusiness('rentals');
    assert.match(html(), new RegExp(`id="repairHome-${homes()[0].id}" class="[^"]*hidden`));
});

test('a late payer is flagged on the card', () => {
    const { ui, html, homes, move } = screens(['studio']);
    move(homes()[0], 'late').late = true;
    ui.showBusiness('rentals');
    assert.match(html(), /Rent late this minute/);
});

test('an empty home offers a tenant, or counts down to the next applicants', () => {
    const { ui, html, homes } = screens(['studio']);
    const home = homes()[0];
    ui.showBusiness('rentals');
    assert.match(html(), /Earns nothing/);
    assert.match(html(), new RegExp(`showTenants\\(${home.id}\\)[^>]*>Choose a tenant`));

    home.applicants = null;
    home.waitUntil = Date.now() + 41500;
    ui.renderBusinesses();
    assert.match(html(), /New applicants in 42s/);
    assert.doesNotMatch(html(), /Choose a tenant/);
});

test('homes are listed for sale at today\'s prices, with their photos', () => {
    const { ui, html, state } = screens([]);
    state.rentals.market = { studio: 108, house: 92, villa: 115 };
    state.rentals.change = { studio: 3, house: -4, villa: 0 };
    ui.showBusiness('rentals');
    assert.match(html(), />108%</);
    assert.match(html(), /Up 3/);
    assert.match(html(), /Down 4/);
    assert.match(html(), /Steady/);
    ['Buy for $43.2k', 'Buy for $138.0k', 'Buy for $690.0k'].forEach(label => assert.ok(html().includes(label), label));
    ['studio', 'house', 'villa'].forEach(id => {
        const src = ui.getHomePhoto({ id });
        assert.ok(fs.existsSync(path.join(__dirname, '..', src)), src);
        assert.ok(html().includes(src));
    });
});

test('a full list of homes stops buying', () => {
    const { ui, html } = screens(['studio', 'studio', 'studio', 'studio']);
    ui.showBusiness('rentals');
    assert.match(html(), /id="buyHome-villa"[^>]*disabled>No room</);
});

test('the Tenants screen compares three applicants, and choosing one returns to Rentals', () => {
    const { ui, el, html, homes, logic } = screens(['house']);
    const home = homes()[0];
    home.condition = 64;
    home.applicants = [{ name: 'Jordan', type: 'careful' }, { name: 'Sam', type: 'late' }, { name: 'Alex', type: 'rough' }];
    ui.showTenants(home.id);
    assert.strictEqual(el.headerTitle.innerText, 'Tenants');
    ['$174.25', '$266.50', '$287.00', 'Choose Jordan', 'Choose Sam', 'Choose Alex', 'Pays nothing 1 minute in 5']
        .forEach(text => assert.ok(html().includes(text), text));

    logic.setRentLevel(home.id, 'high');
    assert.ok(html().includes('$217.81'), 'pay follows the rent level');

    logic.chooseTenant(home.id, 1);
    assert.strictEqual(el.headerTitle.innerText, 'Rentals');
    assert.match(html(), /Sam · Rich but late/);
});

test('back goes from Tenants to Rentals, then to the Vault', () => {
    const { ui, el, homes } = screens(['studio']);
    ui.showTenants(homes()[0].id);
    ui.goBack();
    assert.strictEqual(el.headerTitle.innerText, 'Rentals');
    ui.goBack();
    assert.strictEqual(el.headerTitle.innerText, 'Vault');
});

test('the Tenants screen of a home that is gone shows Rentals instead', () => {
    const { ui, el, html, state, homes } = screens(['studio']);
    ui.showTenants(homes()[0].id);
    state.rentals.homes = [];
    ui.renderBusinesses();
    assert.strictEqual(el.headerTitle.innerText, 'Rentals');
    assert.match(html(), /No homes yet/);
});

test('figures on the Rentals screen stay live', () => {
    const { game, ui, state, homes, move } = screens(['studio']);
    const home = move(homes()[0]);
    ui.showBusiness('rentals');
    const nodes = {};
    game.window.document.getElementById = id => (nodes[id] ||= Object.assign(fakeElement(), { style: {} }));
    state.rentals.rent = 1240;
    state.rentals.marketMs = 18000;
    state.balance = 100;
    home.condition = 90;
    ui.syncBusinessScreen();
    assert.strictEqual(nodes.rentPot.innerText, '$1,240.00');
    assert.strictEqual(nodes.btnCollectRent.disabled, false);
    assert.strictEqual(nodes.btnAgent.disabled, true);
    assert.strictEqual(nodes[`homeCondition-${home.id}`].innerText, '90%');
    assert.strictEqual(nodes[`homeBar-${home.id}`].style.width, '90%');
    assert.match(nodes[`homeRate-${home.id}`].innerHTML, /\$57\.00/);
    assert.strictEqual(nodes[`repairHome-${home.id}`].innerText, 'Repair for $400.00');
    assert.strictEqual(nodes[`repairHome-${home.id}`].disabled, true);
    assert.ok(!nodes[`repairHome-${home.id}`].classList.contains('hidden'));
    assert.strictEqual(nodes[`sellHome-${home.id}`].innerText, 'Sell for $35.6k');
    assert.strictEqual(nodes.homePriceTimer.innerText, 'New prices in 0:42');
    assert.strictEqual(nodes['buyHome-studio'].disabled, true);
});

test('the Vault dot warns when an empty home has applicants waiting', () => {
    const { ui, el, homes, move } = screens(['studio']);
    ui.updateDealerBadge();
    assert.ok(!el.dealerBadge.classList.contains('hidden'));
    assert.match(el.dealerBadge.className, /badge-alert/);
    move(homes()[0]);
    ui.updateDealerBadge();
    assert.ok(el.dealerBadge.classList.contains('hidden'));
});
