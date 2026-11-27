const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const FULL = ['state.js', 'logic.js', 'ui.js'];
const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

// A running game that can be played forward a second at a time
function running(options) {
    const game = createGame(options);
    const frames = [];
    let time = 0;
    game.window.performance = { now: () => 0 };
    game.window.requestAnimationFrame = fn => frames.push(fn);
    game.window.state.balance = 1000;
    game.window.logic.startGameLoop();
    const play = seconds => {
        for (let i = 0; i < seconds; i++) frames.shift()(time += 1000);
    };
    return { game, play, state: game.window.state, logic: game.window.logic };
}

test('taxes are on to begin with and take 0.5% every minute', () => {
    const { logic, state, play } = running();
    assert.strictEqual(logic.taxesOn(), true);
    play(59);
    assert.strictEqual(state.balance, 1000);
    play(1);
    assert.strictEqual(state.balance, 995);
});

test('with taxes switched off nothing is taken', () => {
    const { logic, state, play } = running();
    logic.toggleTaxes();
    assert.strictEqual(logic.taxesOn(), false);
    play(180);
    assert.strictEqual(state.balance, 1000);
});

test('switching taxes back on starts a fresh minute', () => {
    const { logic, state, play } = running();
    play(59);
    logic.toggleTaxes();
    play(30);
    logic.toggleTaxes();
    play(59);
    assert.strictEqual(state.balance, 1000);
    play(1);
    assert.strictEqual(state.balance, 995);
});

test('the choice is saved at once and survives a reload', () => {
    const { game, logic } = running();
    logic.toggleTaxes();
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.logic.taxesOn(), false);
});

test('prestige keeps the choice', () => {
    const { logic, state } = running();
    logic.toggleTaxes();
    state.lifetimeEarnings = 1_000_000;
    logic.prestige();
    assert.strictEqual(logic.taxesOn(), false);
});

test('the Stats switch shows whether taxes are on', () => {
    const game = createGame({ files: FULL });
    const el = { statRank: fakeElement(), statTotalEarnings: fakeElement(), statTotalClicks: fakeElement(), taxBtn: fakeElement() };
    const attributes = {};
    el.taxBtn.setAttribute = (name, value) => { attributes[name] = String(value); };
    game.window.ui.elements = el;

    game.window.ui.renderProfile();
    assert.strictEqual(el.taxBtn.innerText, 'On');
    assert.ok(el.taxBtn.classList.contains('btn-yellow'));
    assert.strictEqual(attributes['aria-pressed'], 'true');

    game.window.logic.toggleTaxes();
    assert.strictEqual(el.taxBtn.innerText, 'Off');
    assert.ok(!el.taxBtn.classList.contains('btn-yellow'));
    assert.strictEqual(attributes['aria-pressed'], 'false');
});

test('the Stats screen has the tax switch, wired up', () => {
    assert.match(read('index.html'), /<button id="taxBtn"/);
    assert.match(read('ui.js'), /taxBtn[^\n]*addEventListener\('click', \(\) => l\.toggleTaxes\(\)\)/);
});
