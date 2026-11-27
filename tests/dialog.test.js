const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const read = file => fs.readFileSync(path.join(__dirname, '..', file), 'utf8');
const KEY = 'businessEmpireState';

// The whole game with its dialog on the page, in a browser that refuses native pop-ups
function game() {
    const g = createGame({ files: ['state.js', 'logic.js', 'ui.js'] });
    g.window.confirm = () => { throw new Error('native confirm used'); };
    const el = {};
    ['confirmTitle', 'confirmMessage', 'confirmYes', 'confirmNo'].forEach(name => { el[name] = fakeElement(); });
    el.confirmModal = fakeElement('hidden');
    g.window.ui.elements = el;
    const open = () => !el.confirmModal.classList.contains('hidden');
    return { g, el, open, ui: g.window.ui, logic: g.window.logic, state: g.window.state };
}

test('asking shows the question and waits', () => {
    const { el, ui, open } = game();
    let ran = 0;
    ui.ask({ title: 'Sell this taxi?', message: 'For about $760.', yes: 'Sell' }, () => ran++);
    assert.ok(open());
    assert.strictEqual(el.confirmTitle.innerText, 'Sell this taxi?');
    assert.strictEqual(el.confirmMessage.innerText, 'For about $760.');
    assert.strictEqual(el.confirmYes.innerText, 'Sell');
    assert.strictEqual(ran, 0);
});

test('agreeing runs the action once, even with a double tap', () => {
    const { ui, open } = game();
    let ran = 0;
    ui.ask({ title: 't', message: 'm', yes: 'Go' }, () => ran++);
    ui.answer(true);
    ui.answer(true);
    assert.strictEqual(ran, 1);
    assert.ok(!open());
});

test('cancelling does nothing', () => {
    const { ui, open } = game();
    let ran = 0;
    ui.ask({ title: 't', message: 'm', yes: 'Go' }, () => ran++);
    ui.answer(false);
    ui.answer(true);
    assert.strictEqual(ran, 0);
    assert.ok(!open());
});

test('risky actions get a red button', () => {
    const { el, ui } = game();
    ui.ask({ title: 't', message: 'm', yes: 'Reset', danger: true }, () => {});
    assert.match(el.confirmYes.className, /btn-red/);
    ui.ask({ title: 't', message: 'm', yes: 'Buy' }, () => {});
    assert.match(el.confirmYes.className, /btn-yellow/);
});

function taxiOwner() {
    const t = game();
    t.state.balance = 0;
    t.state.taxi = { fares: 0, spaces: 3, nextId: 2, cars: [{ id: 1, type: 'hatchback', km: 50000, broken: false }] };
    return t;
}

test('a taxi is sold only after agreeing, at its value then', () => {
    const { state, logic, ui, open, el } = taxiOwner();
    logic.sellTaxi(1);
    assert.ok(open());
    assert.match(el.confirmMessage.innerText, /about \$1,000/);
    assert.strictEqual(state.taxi.cars.length, 1);

    state.taxi.cars[0].km = 75000; // it kept driving while the question was open
    ui.answer(true);
    assert.strictEqual(state.balance, 500);
    assert.strictEqual(state.taxi.cars.length, 0);
});

test('a taxi scrapped while the question is open pays nothing', () => {
    const { state, logic, ui } = taxiOwner();
    logic.sellTaxi(1);
    state.taxi.cars = [];
    ui.answer(true);
    assert.strictEqual(state.balance, 0);
});

test('a Lifestyle purchase happens only after agreeing, if the money is still there', () => {
    const { state, logic, ui, open } = game();
    state.balance = 30000;
    logic.buyLifestyle('watch');
    assert.ok(open());
    assert.strictEqual(state.balance, 30000);
    state.balance = 100;
    ui.answer(true);
    assert.strictEqual(state.balance, 100);
    assert.ok(!state.lifestyle?.watch);

    state.balance = 30000;
    logic.buyLifestyle('watch');
    ui.answer(true);
    assert.strictEqual(state.balance, 5000);
    assert.strictEqual(state.lifestyle.watch, 1);
});

test('prestige waits for the answer', () => {
    const { state, logic, ui, open } = game();
    Object.assign(state, { lifetimeEarnings: 1_000_000, balance: 50 });
    logic.prestige();
    assert.ok(open());
    assert.strictEqual(state.balance, 50);
    ui.answer(true);
    assert.strictEqual(state.prestigeCount, 1);
});

test('reset all progress waits for the answer', () => {
    const { g, state, ui, open } = game();
    state.balance = 9;
    g.window.saveGame();
    g.window.hardReset();
    assert.ok(open());
    assert.ok(g.storage.has(KEY));
    ui.answer(true);
    assert.ok(!g.storage.has(KEY));
});

test('the page has the confirm box, announced as an alert dialog', () => {
    const html = read('index.html');
    assert.match(html, /id="confirmModal"/);
    assert.match(html, /role="alertdialog"/);
});

test('the only native pop-up left is the fallback for a missing dialog', () => {
    const calls = ['state.js', 'logic.js', 'ui.js']
        .flatMap(file => [...read(file).matchAll(/\bconfirm\(/g)].map(() => file));
    assert.deepStrictEqual(calls, ['logic.js']);
});
