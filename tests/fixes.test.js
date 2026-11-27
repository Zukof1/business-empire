const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const read = file => fs.readFileSync(path.join(__dirname, '..', file));
const html = read('index.html').toString('utf8');
const FULL = ['state.js', 'logic.js', 'ui.js'];

function profile(lifetimeEarnings, prestigeCount = 0) {
    const game = createGame({ files: FULL });
    Object.assign(game.window.state, { lifetimeEarnings, prestigeCount });
    const el = {
        statRank: fakeElement(), statTotalEarnings: fakeElement(), statTotalClicks: fakeElement(),
        prestigeBtn: fakeElement(), prestigeInfo: fakeElement()
    };
    game.window.ui.elements = el;
    game.window.ui.renderProfile();
    return { game, el };
}

test('the Stats screen has a prestige button', () => {
    assert.match(html, /id="prestigeBtn"/);
    assert.match(html, /id="prestigeInfo"/);
    assert.match(read('ui.js').toString('utf8'), /prestigeBtn[^\n]*addEventListener\('click', \(\) => l\.prestige\(\)\)/);
});

test('prestige is locked below $1M and says how far there is to go', () => {
    const { el } = profile(250000);
    assert.strictEqual(el.prestigeBtn.disabled, true);
    assert.match(el.prestigeInfo.innerText, /\$750\.0k more/);
});

test('prestige unlocks at $1M and shows the next bonus', () => {
    const { el } = profile(1000000, 2);
    assert.strictEqual(el.prestigeBtn.disabled, false);
    assert.match(el.prestigeInfo.innerText, /\+30%/);
});

test('prestige also clears a Blackjack hand in progress', () => {
    const game = createGame();
    Object.assign(game.window.state, {
        lifetimeEarnings: 1000000,
        balance: 5000,
        blackjack: { active: true, playerHand: [{ value: '10' }], dealerHand: [{ value: '9' }], status: 'Playing', bet: 1000000 },
        rouletteHistory: ['Red']
    });
    game.window.logic.prestige();
    const saved = game.saved();
    assert.strictEqual(saved.prestigeCount, 1);
    assert.strictEqual(saved.balance, 0);
    assert.strictEqual(saved.blackjack.active, false);
    assert.strictEqual(saved.blackjack.playerHand.length, 0);
    assert.strictEqual(saved.rouletteHistory.length, 0);
});

test('the click value stays tidy after prestiging', () => {
    const game = createGame({ files: FULL });
    game.window.state.prestigeCount = 2;
    const el = { clickValueDisplay: fakeElement(), efficiencyDisplay: fakeElement() };
    game.window.ui.elements = el;
    game.window.ui.syncVisualsSilently();
    assert.strictEqual(el.clickValueDisplay.innerText, '+$1.20');
    assert.strictEqual(el.efficiencyDisplay.innerText, 'Efficiency: Lvl 1');
});

test('log lines and warnings show a single dollar sign', () => {
    const game = createGame({ files: FULL });
    const { logic, state, ui } = game.window;
    const messages = [];
    ui.elements = {};
    ui.showToast = msg => messages.push(msg);
    ui.renderBusinesses = () => {};
    ui.renderLogs = () => messages.push(state.logs[0].msg);

    logic.buyBusiness('retail'); // cannot afford: toast
    state.balance = 100000;
    logic.buyBusiness('retail');
    state.businesses[0].accumulated = 50;
    logic.collectIncomeByIndex(0);
    state.businesses[0].accumulated = 50;
    logic.collectIncome('retail');
    state.businesses[0].accumulated = 50;
    logic.collectAllIncome();
    state.balance = 0;
    logic.upgradeBusiness(0); // cannot afford: toast

    assert.strictEqual(messages.length, 6);
    messages.forEach(msg => {
        assert.ok(!msg.includes('$$'), msg);
        assert.ok(msg.includes('$'), msg);
    });
});

test('the balance colour flash does not stick', () => {
    const css = read('styles.css').toString('utf8');
    const flashes = [...css.matchAll(/\.flash-(?:good|bad) \{\s*animation: ([^;]+);/g)].map(m => m[1])
        .filter(animation => animation !== 'none'); // reduced-motion override
    assert.strictEqual(flashes.length, 2);
    flashes.forEach(animation => assert.ok(!animation.includes('forwards'), animation));
});

function midHand(answer) {
    const game = createGame();
    const asked = [];
    game.window.confirm = msg => { asked.push(msg); return answer; };
    game.window.state.blackjack = { active: true, playerHand: [{ value: '5' }], dealerHand: [{ value: '9' }], status: 'Playing', bet: 1000 };
    game.window.logic.bjReset();
    return { game, asked, hand: game.window.state.blackjack };
}

test('Reset Failsafe asks before giving up a live bet', () => {
    const { asked, hand } = midHand(false);
    assert.strictEqual(asked.length, 1);
    assert.match(asked[0], /\$1,000/);
    assert.strictEqual(hand.active, true);
});

test('Reset Failsafe resets once confirmed', () => {
    assert.strictEqual(midHand(true).hand.active, false);
});

test('Reset Failsafe does not ask when no bet is at stake', () => {
    const game = createGame();
    let asked = 0;
    game.window.confirm = () => { asked++; return false; };
    game.window.logic.bjReset();
    assert.strictEqual(asked, 0);
    assert.strictEqual(game.window.state.blackjack.status, 'Ready to play');
});

test('roulette images are small enough for a phone', () => {
    for (const colour of ['red', 'black', 'green']) {
        const png = read(`Assets/roulette_${colour}.png`);
        assert.ok(png.readUInt32BE(16) <= 256, `${colour} width ${png.readUInt32BE(16)}`);
        assert.ok(png.length < 120 * 1024, `${colour} is ${Math.round(png.length / 1024)}KB`);
    }
});

// Already fixed with the dealership upgrade; this keeps it that way
test('auction buttons wake up as soon as you can afford them', () => {
    const game = createGame({ files: FULL });
    const buttons = { 'auctionBuy-0': fakeElement(), 'auctionInspect-0': fakeElement() };
    game.window.document.getElementById = id => buttons[id] || null;
    game.window.ui.elements = {};
    Object.assign(game.window.state, {
        activeTab: 'vault', balance: 0, dealerCars: [], auctionCars: [{ tier: 'common', price: 600, value: 600 }]
    });
    game.window.ui.businessScreen = 'dealer';
    game.window.ui.syncVisualsSilently();
    assert.strictEqual(buttons['auctionBuy-0'].disabled, true);
    game.window.state.balance = 600;
    game.window.ui.syncVisualsSilently();
    assert.strictEqual(buttons['auctionBuy-0'].disabled, false);
});

// Already fixed with idle earnings; this keeps it that way
test('returning after a long time moves the market only once per frame step', () => {
    const game = createGame();
    const frames = [];
    let updates = 0;
    game.window.performance = { now: () => 0 };
    game.window.requestAnimationFrame = fn => frames.push(fn);
    game.window.logic.updateMarketPrices = () => { updates++; };
    game.window.logic.startGameLoop();
    let time = 3600 * 1000;
    for (let i = 0; i < 100; i++) {
        frames.shift()(time);
        time += 16;
    }
    assert.ok(updates <= 1, `${updates} updates`);
});
