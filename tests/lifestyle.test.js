const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const FULL = ['state.js', 'logic.js', 'ui.js'];
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function setup(balance = 100_000_000, files) {
    const game = createGame(files ? { files } : {});
    game.window.state.balance = balance;
    return { game, state: game.window.state, logic: game.window.logic };
}

// ---- Lifestyle ----

test('there are twelve things to spend on, in four types', () => {
    const { game } = setup();
    const items = game.window.LIFESTYLE_ITEMS;
    assert.strictEqual(items.length, 12);
    assert.deepStrictEqual(
        [...new Set(Array.from(items, i => i.type))],
        ['Style', 'Homes', 'Toys', 'Experiences']
    );
});

test('a possession is bought once', () => {
    const { state, logic } = setup(100000);
    logic.buyLifestyle('watch');
    logic.buyLifestyle('watch');
    assert.strictEqual(state.balance, 75000);
    assert.strictEqual(state.lifestyle.watch, 1);
    assert.strictEqual(state.lifetimeEarnings, 0);
});

test('an experience can be repeated', () => {
    const { state, logic } = setup(25000);
    logic.buyLifestyle('getaway');
    logic.buyLifestyle('getaway');
    assert.strictEqual(state.lifestyle.getaway, 2);
    assert.strictEqual(state.balance, 5000);
});

test('purchases ask first, and need the money', () => {
    const { game, state, logic } = setup(5000);
    logic.buyLifestyle('watch');
    assert.strictEqual(state.balance, 5000);
    game.window.confirm = () => false;
    logic.buyLifestyle('wardrobe');
    assert.strictEqual(state.balance, 5000);
    assert.ok(!state.lifestyle?.wardrobe);
});

test('the lifestyle level follows the total spent', () => {
    const { state, logic } = setup();
    assert.strictEqual(logic.getLifestyleLevel().name, 'Getting by');
    assert.strictEqual(logic.getLifestyleLevel().next, 'Comfortable');
    state.lifestyle = { wardrobe: 1, 'sports-car': 1 };
    const level = logic.getLifestyleLevel();
    assert.strictEqual(level.name, 'Comfortable');
    assert.strictEqual(level.remaining, 45000);
    assert.strictEqual(level.progress, 0.5);
    state.lifestyle = { jet: 1 };
    assert.strictEqual(logic.getLifestyleLevel().name, 'Living legend');
    assert.strictEqual(logic.getLifestyleLevel().next, null);
});

test('the collection survives a reload and a prestige', () => {
    const first = setup();
    first.logic.buyLifestyle('mansion');
    first.state.lifetimeEarnings = 1_000_000;
    first.logic.prestige();

    const next = createGame({ storage: first.game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.state.lifestyle.mansion, 1);
    assert.strictEqual(next.window.state.balance, 0);
});

function screens(balance) {
    const t = setup(balance, FULL);
    const el = {};
    ['app', 'headerTitle', 'vaultHome', 'businessesList', 'storeCountDisplay', 'lifestyleContent']
        .forEach(name => { el[name] = fakeElement(); });
    el.app.dataset = {};
    el.businessDetail = fakeElement('hidden');
    el.marketContent = fakeElement('hidden');
    el.btnHeaderBack = fakeElement('hidden');
    el.dealerBadge = fakeElement('hidden');
    t.game.window.ui.elements = el;
    return { ...t, el, ui: t.game.window.ui };
}

test('the Lifestyle screen lists everything and shows what you own', () => {
    const { el, ui, logic } = screens();
    ui.renderLifestyle();
    assert.strictEqual((el.lifestyleContent.innerHTML.match(/id="lifeBuy-/g) || []).length, 12);
    assert.match(el.lifestyleContent.innerHTML, /Nothing in your collection yet/);

    ['confirmTitle', 'confirmMessage', 'confirmYes', 'confirmNo', 'confirmModal']
        .forEach(name => { el[name] = fakeElement(); });
    logic.buyLifestyle('yacht');
    ui.answer(true);
    ui.renderLifestyle();
    assert.match(el.lifestyleContent.innerHTML, /class="owned"[\s\S]*Yacht/);
    assert.ok(!el.lifestyleContent.innerHTML.includes('id="lifeBuy-yacht"'));
});

// ---- The dealership as a business ----

test('the navigation has Lifestyle where the dealer tab was', () => {
    assert.match(html, /id="navLifestyle"/);
    assert.ok(!html.includes('id="navMarket"'));
    const vaultButton = html.slice(html.indexOf('id="navVault"'), html.indexOf('id="navLifestyle"'));
    assert.match(vaultButton, /id="dealerBadge"/);
});

test('the license is bought once and opens the dealership', () => {
    const { el, ui, state, logic } = screens(10000);
    logic.buyLicense();
    logic.buyLicense();
    assert.strictEqual(state.balance, 7500);
    assert.strictEqual(ui.businessScreen, 'dealer');
    assert.ok(!el.marketContent.classList.contains('hidden'));
    assert.strictEqual(el.headerTitle.innerText, 'Car Dealership');
    assert.ok(ui.isDealerOpen());

    ui.goBack();
    assert.ok(el.marketContent.classList.contains('hidden'));
    assert.ok(!ui.isDealerOpen());
});

test('without a license the dealership screen offers to get one', () => {
    const { el, ui } = screens();
    ui.showBusiness('dealer');
    assert.match(el.businessDetail.innerHTML, /Car Dealership/);
    assert.match(el.businessDetail.innerHTML, /Open for \$2,500\.00/);
    assert.ok(el.marketContent.classList.contains('hidden'));
});

test('the dashboard shows the dealership and cars waiting to be sold', () => {
    const { el, ui, state } = screens();
    state.hasDealerLicense = true;
    state.dealerCars = [{ tier: 'common', name: '2005 Truck', value: 900, buyPrice: 900, status: 'ready' }];
    ui.renderBusinesses();
    assert.match(el.businessesList.innerHTML, /Car Dealership/);
    assert.match(el.businessesList.innerHTML, /1 ready to sell/);
});

test('the Vault dot warns about a broken taxi', () => {
    const { el, ui, state } = screens();
    state.taxi = { fares: 0, spaces: 3, cars: [{ id: 1, type: 'sedan', km: 0, broken: true }] };
    ui.updateDealerBadge();
    assert.match(el.dealerBadge.className, /badge-alert/);
});

test('a save that was on the old dealer tab opens on the Vault', () => {
    const { ui, state } = screens();
    ui.switchTab('market');
    assert.strictEqual(state.activeTab, 'vault');
});
