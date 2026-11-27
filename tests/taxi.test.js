const test = require('node:test');
const assert = require('node:assert');
const { createGame, fakeElement } = require('./harness');

const MINUTE = 60 * 1000;
const FULL = ['state.js', 'logic.js', 'ui.js'];
const SAVE = 'businessEmpireState';

function setup(balance = 1_000_000, files) {
    const game = createGame(files ? { files } : {});
    game.window.state.balance = balance;
    return { game, state: game.window.state, logic: game.window.logic };
}

// A company with the given cars, and no breakdowns unless a test asks for them
function fleet(types, balance = 1_000_000) {
    const t = setup();
    t.logic.openTaxiCompany();
    types.forEach(type => t.logic.buyTaxi(type));
    t.state.balance = balance;
    t.game.run('Math.random = () => 0.999');
    return t;
}

// ---- Retail Shop ----

test('the shop has a simple name and the older businesses cannot be started', () => {
    const { game, state, logic } = setup();
    assert.strictEqual(game.window.BUSINESS_DATA.find(b => b.id === 'retail').name, 'Retail Shop');
    ['startup', 'estate', 'corp'].forEach(id => logic.buyBusiness(id));
    assert.strictEqual(state.businesses.length, 0);
});

test('a shop earns $2 a second per level and upgrades cost $100 per level', () => {
    const { logic } = setup();
    assert.strictEqual(logic.getBusinessIncome({ id: 'retail', level: 4 }), 8 * 3600);
    assert.strictEqual(logic.getBusinessUpgradeCost({ id: 'retail', level: 4 }), 400);
});

test('shops stop at level 10 and three shops, for $60 a second', () => {
    const { state, logic } = setup();
    for (let i = 0; i < 5; i++) logic.buyBusiness('retail');
    assert.strictEqual(state.businesses.length, 3);
    for (let i = 0; i < 30; i++) logic.upgradeBusiness(0), logic.upgradeBusiness(1), logic.upgradeBusiness(2);
    assert.deepStrictEqual(Array.from(state.businesses, b => b.level), [10, 10, 10]);
    assert.strictEqual(logic.getPassiveIncome(), 60);
    const before = state.balance;
    logic.upgradeBusiness(0);
    assert.strictEqual(state.balance, before);
});

test('an over-levelled shop in a save loads at level 10', () => {
    const old = { businesses: [{ id: 'retail', level: 17, incomePerHour: 1e9, lastPayout: Date.now() }] };
    const game = createGame({ storage: new Map([[SAVE, JSON.stringify(old)]]) });
    game.window.loadGame();
    assert.strictEqual(game.window.state.businesses[0].level, 10);
    assert.strictEqual(game.window.state.businesses[0].incomePerHour, 20 * 3600);
});

test('an older business already owned keeps working', () => {
    const old = { businesses: [{ id: 'startup', level: 1, incomePerHour: 216000, lastPayout: Date.now() }] };
    const game = createGame({ storage: new Map([[SAVE, JSON.stringify(old)]]) });
    game.window.loadGame();
    assert.strictEqual(game.window.logic.getPassiveIncome(), 60);
});

// ---- Taxi Company ----

test('the taxi company opens once for $10,000', () => {
    const { state, logic } = setup(25000);
    logic.openTaxiCompany();
    logic.openTaxiCompany();
    assert.strictEqual(state.balance, 15000);
    assert.strictEqual(state.taxi.cars.length, 0);
});

test('no company without the money, and no cars without a company', () => {
    const { state, logic } = setup(9999);
    logic.openTaxiCompany();
    logic.buyTaxi('hatchback');
    assert.strictEqual(state.balance, 9999);
    assert.ok(!state.taxi);
});

test('buying cars charges the price and stops at the fleet limit', () => {
    const { state, logic } = fleet([]);
    ['hatchback', 'sedan', 'luxury', 'hatchback'].forEach(type => logic.buyTaxi(type));
    assert.strictEqual(state.taxi.cars.length, 3);
    assert.strictEqual(state.balance, 1_000_000 - 4000 - 20000 - 80000);
    assert.strictEqual(state.taxi.cars[0].km, 0);
});

test('a minute of driving earns fares and adds 12,500 km', () => {
    const { state, logic } = fleet(['hatchback']);
    logic.processTaxi(MINUTE);
    assert.strictEqual(Math.round(state.taxi.fares), 900);
    assert.strictEqual(Math.round(state.taxi.cars[0].km), 12500);
});

test('a car is scrapped at its limit and earns nothing beyond it', () => {
    const { state, logic } = fleet(['hatchback', 'sedan']);
    for (let i = 0; i < 20; i++) logic.processTaxi(MINUTE);
    assert.deepStrictEqual(Array.from(state.taxi.cars, c => c.type), ['sedan']);
    assert.strictEqual(Math.round(state.taxi.fares), 15 * 480 + 40 * 1200);
    assert.ok(state.logs.length > 0);
});

test('breakdown odds are per minute of driving', () => {
    const unlucky = fleet(['hatchback']);
    unlucky.game.run('Math.random = () => 0.19');
    unlucky.logic.processTaxi(MINUTE);
    assert.strictEqual(unlucky.state.taxi.cars[0].broken, true);

    const lucky = fleet(['hatchback']);
    lucky.game.run('Math.random = () => 0.21');
    lucky.logic.processTaxi(MINUTE);
    assert.strictEqual(lucky.state.taxi.cars[0].broken, false);
});

test('a broken car waits, and repairs cost 10% of its price once', () => {
    const { state, logic } = fleet(['sedan']);
    const car = state.taxi.cars[0];
    car.broken = true;
    logic.processTaxi(MINUTE);
    assert.strictEqual(car.km, 0);
    assert.strictEqual(state.taxi.fares, 0);

    state.balance = 1999;
    logic.repairTaxi(car.id);
    assert.strictEqual(car.broken, true);
    state.balance = 5000;
    logic.repairTaxi(car.id);
    logic.repairTaxi(car.id);
    assert.strictEqual(car.broken, false);
    assert.strictEqual(state.balance, 3000);
});

test('selling early pays half the price for the kilometres left', () => {
    const { game, state, logic } = fleet(['hatchback'], 0);
    state.balance = 4000;
    state.taxi.cars = [{ id: 9, type: 'hatchback', km: 50000, broken: false }];
    assert.strictEqual(logic.getTaxiSellValue(state.taxi.cars[0]), 1000);

    game.window.confirm = () => false;
    logic.sellTaxi(9);
    assert.strictEqual(state.taxi.cars.length, 1);
    game.window.confirm = () => true;
    logic.sellTaxi(9);
    logic.sellTaxi(9);
    assert.strictEqual(state.balance, 5000);
    assert.strictEqual(state.taxi.cars.length, 0);
});

test('fleet spaces cost $25,000 each, up to six', () => {
    const { state, logic } = fleet([]);
    for (let i = 0; i < 6; i++) logic.expandTaxiFleet();
    assert.strictEqual(state.taxi.spaces, 6);
    assert.strictEqual(state.balance, 1_000_000 - 75000);
});

test('fares are collected once, and by Collect all', () => {
    const { state, logic } = fleet(['hatchback'], 0);
    state.taxi.fares = 500;
    logic.collectFares();
    logic.collectFares();
    assert.strictEqual(state.balance, 500);
    state.taxi.fares = 70;
    logic.collectAllIncome();
    assert.strictEqual(state.balance, 570);
});

test('a dispatcher costs $25,000 and sends fares straight to the balance', () => {
    const { state, logic } = fleet(['hatchback'], 25000);
    state.taxi.fares = 100;
    logic.hireDispatcher();
    logic.hireDispatcher();
    assert.strictEqual(state.balance, 100);
    logic.processTaxi(MINUTE);
    assert.strictEqual(Math.round(state.balance), 1000);
    assert.strictEqual(state.taxi.fares, 0);
});

test('the earning rate counts working taxis only', () => {
    const { state, logic } = fleet(['hatchback', 'sedan']);
    assert.strictEqual(logic.getPassiveIncome(), 55);
    state.taxi.cars[1].broken = true;
    assert.strictEqual(logic.getPassiveIncome(), 15);
});

test('taxis do not drive while the game is away', () => {
    const { game, state, logic } = fleet(['hatchback']);
    const frames = [];
    game.window.performance = { now: () => 0 };
    game.window.requestAnimationFrame = fn => frames.push(fn);
    logic.startGameLoop();
    frames.shift()(3600 * 1000);
    assert.ok(state.taxi.cars[0].km <= 12500 / 60 + 1, `${state.taxi.cars[0].km} km`);
    assert.ok(state.taxi.cars[0].km > 0);
});

test('the fleet survives a reload', () => {
    const { game, logic } = fleet(['luxury']);
    logic.processTaxi(MINUTE);
    game.window.saveGame();
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.state.taxi.cars[0].type, 'luxury');
    assert.strictEqual(Math.round(next.window.state.taxi.cars[0].km), 12500);
});

test('prestige closes the taxi company', () => {
    const { state, logic } = fleet(['hatchback']);
    state.lifetimeEarnings = 1_000_000;
    logic.prestige();
    assert.ok(!state.taxi);
});

// ---- Screens ----

function screens() {
    const t = setup(1_000_000, FULL);
    const el = {};
    ['app', 'headerTitle', 'btnHeaderBack', 'vaultHome', 'businessDetail', 'businessesList', 'storeCountDisplay']
        .forEach(name => { el[name] = fakeElement(); });
    el.app.dataset = {};
    el.businessDetail = fakeElement('hidden');
    el.btnHeaderBack = fakeElement('hidden');
    t.game.window.ui.elements = el;
    return { ...t, el, ui: t.game.window.ui };
}

test('the dashboard shows one card per business you own', () => {
    const { el, ui, logic } = screens();
    ui.renderBusinesses();
    assert.match(el.businessesList.innerHTML, /do not own a business yet/);

    logic.buyBusiness('retail');
    logic.buyBusiness('retail');
    logic.openTaxiCompany();
    ui.renderBusinesses();
    assert.strictEqual((el.businessesList.innerHTML.match(/class="[^"]*summary/g) || []).length, 2);
    assert.match(el.businessesList.innerHTML, /2 shops/);
    assert.strictEqual(el.storeCountDisplay.innerText, '2 Active');
});

test('Start a business offers only the shop and the taxi company', () => {
    const { el, ui } = screens();
    ui.showBusiness('start');
    const html = el.businessDetail.innerHTML;
    assert.match(html, /Retail Shop/);
    assert.match(html, /Taxi Company/);
    assert.doesNotMatch(html, /Tech Startup|Real Estate|Mega Corporation/);
    assert.strictEqual(el.headerTitle.innerText, 'Start a business');
});

test('the taxi screen shows each car with its photo and kilometres', () => {
    const { el, ui, state, logic } = screens();
    logic.openTaxiCompany();
    logic.buyTaxi('hatchback');
    state.taxi.cars[0].km = 62000;
    ui.showBusiness('taxi');
    assert.match(el.businessDetail.innerHTML, /Assets\/cars-web\/taxi-hatchback\.jpg/);
    assert.match(el.businessDetail.innerHTML, /62,000 \/ 100,000 km/);
});

test('back returns from a business to the dashboard', () => {
    const { el, ui } = screens();
    ui.showBusiness('retail');
    assert.ok(el.vaultHome.classList.contains('hidden'));
    assert.ok(!el.btnHeaderBack.classList.contains('hidden'));
    ui.goBack();
    assert.ok(!el.vaultHome.classList.contains('hidden'));
    assert.ok(el.btnHeaderBack.classList.contains('hidden'));
    assert.strictEqual(el.headerTitle.innerText, 'Vault');
});
