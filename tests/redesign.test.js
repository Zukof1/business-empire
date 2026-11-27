const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const FULL = ['state.js', 'logic.js', 'ui.js'];

test('each price update is added to the stock history, keeping the last 24', () => {
    const game = createGame();
    for (let i = 0; i < 40; i++) game.window.logic.updateMarketPrices();
    const trail = game.window.stockTrails.GOL;
    assert.strictEqual(trail.length, 24);
    assert.strictEqual(trail[23], game.window.stockPrices.GOL);
});

test('percentage change compares the last two prices', () => {
    const game = createGame();
    assert.strictEqual(game.window.logic.getPriceChange('GOL'), 0);
    game.window.stockTrails.GOL = [100, 80, 100];
    assert.strictEqual(game.window.logic.getPriceChange('GOL'), 25);
});

test('price history survives a reload', () => {
    const first = createGame();
    first.window.logic.updateMarketPrices();
    first.window.saveGame();
    const next = createGame({ storage: first.storage });
    next.window.loadGame();
    assert.strictEqual(JSON.stringify(next.window.stockTrails.GOL), JSON.stringify(first.window.stockTrails.GOL));
});

test('a save without price history starts from the saved price', () => {
    const old = { stockPrices: { GOL: 42 } };
    const game = createGame({ storage: new Map([['businessEmpireState', JSON.stringify(old)]]) });
    game.window.loadGame();
    assert.strictEqual(JSON.stringify(game.window.stockTrails.GOL), '[42]');
    assert.strictEqual(game.window.logic.getPriceChange('GOL'), 0);
});

test('rank progress measures the way from this rank to the next', () => {
    const game = createGame();
    game.window.state.lifetimeEarnings = 30000;
    const progress = game.window.logic.getRankProgress();
    assert.strictEqual(progress.next, 'Regional Manager');
    assert.strictEqual(progress.remaining, 20000);
    assert.strictEqual(progress.progress, 0.5);
});

test('the top rank has nothing left to reach', () => {
    const game = createGame();
    game.window.state.lifetimeEarnings = 5_000_000;
    const progress = game.window.logic.getRankProgress();
    assert.strictEqual(progress.next, null);
    assert.strictEqual(progress.progress, 1);
});

test('the Stats screen shows rank progress', () => {
    const game = createGame({ files: FULL });
    game.window.state.lifetimeEarnings = 30000;
    const el = {
        statRank: fakeElement(), statTotalEarnings: fakeElement(), statTotalClicks: fakeElement(),
        rankProgressBar: { style: {} }, rankProgressText: fakeElement()
    };
    game.window.ui.elements = el;
    game.window.ui.renderProfile();
    assert.strictEqual(el.rankProgressBar.style.width, '50%');
    assert.strictEqual(el.rankProgressText.innerText, '$20.0k to Regional Manager');
});

test('every icon the screens ask for exists in the icon set', () => {
    const html = read('index.html');
    const defined = new Set([...html.matchAll(/<symbol id="i-([a-z]+)"/g)].map(m => m[1]));
    const used = [
        ...[...(html + read('ui.js')).matchAll(/href="#i-([a-z]+)"/g)].map(m => m[1]),
        ...[...read('ui.js').matchAll(/this\.icon\('([a-z]+)'/g)].map(m => m[1])
    ];
    assert.ok(defined.size >= 20, `${defined.size} icons`);
    assert.deepStrictEqual(used.filter(name => !defined.has(name)), []);
});

test('the page no longer depends on Tailwind', () => {
    assert.ok(!read('index.html').includes('tailwind'));
});
