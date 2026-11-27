const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const ROOT = path.join(__dirname, '..');
const KEY = 'businessEmpireState';
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const loaded = save => {
    const game = createGame({ storage: new Map([[KEY, JSON.stringify(save)]]) });
    game.window.loadGame();
    return game;
};

test('no casino is left on the page, in the screens or in the styles', () => {
    ['index.html', 'ui.js', 'styles.css'].forEach(file => {
        assert.doesNotMatch(read(file), /casino|roulette|blackjack/i, file);
    });
    assert.deepStrictEqual(fs.readdirSync(path.join(ROOT, 'Assets')).filter(f => /roulette/.test(f)), []);
});

test('no betting rules are left', () => {
    const { logic } = createGame().window;
    ['buyCasinoMembership', 'spinSlots', 'playRoulette', 'bjDeal', 'bjHit', 'bjStand', 'bjDouble', 'bjReset']
        .forEach(name => assert.strictEqual(logic[name], undefined, name));
});

test('the bar at the bottom has four buttons', () => {
    const buttons = [...read('index.html').matchAll(/<button id="(nav\w+)"/g)].map(m => m[1]);
    assert.deepStrictEqual(buttons, ['navVault', 'navLifestyle', 'navInvest', 'navProfile']);
});

test('a save left on the casino screen opens the Vault', () => {
    const game = createGame({ files: ['state.js', 'logic.js', 'ui.js'] });
    game.window.ui.elements = { headerTitle: fakeElement() };
    game.window.ui.switchTab('casino');
    assert.strictEqual(game.window.state.activeTab, 'vault');
    assert.strictEqual(game.window.ui.elements.headerTitle.innerText, 'Vault');
});

test('leaving a business screen by the bottom bar restores the big top panel', () => {
    const game = createGame({ files: ['state.js', 'logic.js', 'ui.js'] });
    const el = { app: fakeElement(), btnHeaderBack: fakeElement('hidden'), headerTitle: fakeElement() };
    el.app.dataset = {};
    game.window.ui.elements = el;
    game.window.ui.showBusiness('retail');
    assert.ok(el.app.classList.contains('playing'));
    game.window.ui.switchTab('profile');
    assert.ok(!el.app.classList.contains('playing'));
    assert.ok(el.btnHeaderBack.classList.contains('hidden'));
});

test('winnings still on their way are paid, once', () => {
    const first = loaded({ balance: 100, lifetimeEarnings: 100, pendingPayout: 3000 });
    assert.strictEqual(first.window.state.balance, 3100);
    assert.strictEqual(first.window.state.lifetimeEarnings, 3100);
    first.window.saveGame();

    const second = createGame({ storage: first.storage });
    second.window.loadGame();
    assert.strictEqual(second.window.state.balance, 3100);
});

test('the bet on an unfinished card hand comes back, once, and not as earnings', () => {
    const first = loaded({ balance: 100, lifetimeEarnings: 100, blackjack: { active: true, bet: 1000 } });
    assert.strictEqual(first.window.state.balance, 1100);
    assert.strictEqual(first.window.state.lifetimeEarnings, 100);
    first.window.saveGame();

    const second = createGame({ storage: first.storage });
    second.window.loadGame();
    assert.strictEqual(second.window.state.balance, 1100);
});

test('a finished hand returns nothing', () => {
    assert.strictEqual(loaded({ balance: 100, blackjack: { active: false, bet: 1000 } }).window.state.balance, 100);
});
