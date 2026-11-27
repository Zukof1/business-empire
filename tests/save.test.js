const test = require('node:test');
const assert = require('node:assert');
const { createGame, fakeElement } = require('./harness');

const KEY = 'businessEmpireState';

test('loading a save updates the state the game actually plays with', () => {
    const game = createGame({ storage: new Map([[KEY, JSON.stringify({ balance: 1234 })]]) });
    game.window.loadGame();
    assert.strictEqual(game.window.state.balance, 1234);

    game.window.logic.addMoney(1);
    game.window.saveGame();
    assert.strictEqual(game.saved().balance, 1235);
});

test('purchases survive a reload', () => {
    const first = createGame();
    first.window.state.balance = 500;
    first.window.logic.buyBusiness('retail');
    first.window.saveGame();

    const second = createGame({ storage: first.storage });
    second.window.loadGame();
    assert.strictEqual(second.window.state.businesses.length, 1);
    assert.strictEqual(second.window.state.balance, 400);
});

test('the game saves on a timer', () => {
    const game = createGame();
    game.window.startAutosave();
    game.window.state.balance = 42;
    game.tickIntervals();
    assert.strictEqual(game.saved().balance, 42);
});

test('the game saves when the phone app is sent to the background', () => {
    const game = createGame();
    game.window.startAutosave();
    game.window.state.balance = 7;
    game.window.document.visibilityState = 'hidden';
    game.emit('visibilitychange');
    assert.strictEqual(game.saved().balance, 7);
});

test('the game saves when the page is closed', () => {
    const game = createGame();
    game.window.startAutosave();
    game.window.state.balance = 8;
    game.emit('pagehide');
    assert.strictEqual(game.saved().balance, 8);
});

test('hard reset stays reset even though the page saves while closing', () => {
    const game = createGame();
    game.window.startAutosave();
    game.window.state.balance = 999;
    game.window.saveGame();
    game.window.hardReset();
    game.emit('pagehide');
    game.tickIntervals();
    assert.strictEqual(game.saved(), null);
});

test('stock prices survive a reload', () => {
    const first = createGame();
    first.window.stockPrices.GOL = 12.5;
    first.window.saveGame();

    const second = createGame({ storage: first.storage });
    second.window.loadGame();
    assert.strictEqual(second.window.stockPrices.GOL, 12.5);
});

test('an unreadable save is backed up instead of being overwritten', () => {
    const game = createGame({ storage: new Map([[KEY, '{not json']]) });
    game.window.loadGame();
    game.window.saveGame();
    assert.strictEqual(game.storage.get(KEY + '.backup'), '{not json');
});

test('a full or blocked storage does not crash the game', () => {
    const game = createGame();
    game.window.localStorage.setItem = () => { throw new Error('QuotaExceededError'); };
    assert.doesNotThrow(() => game.window.saveGame());
});

test('the save indicator writes its text into the label', () => {
    const game = createGame({ files: ['state.js', 'logic.js', 'ui.js'] });
    const label = fakeElement();
    game.window.ui.elements = {
        saveIndicator: fakeElement(),
        saveDot: fakeElement(),
        saveLabel: label
    };
    game.window.saveGame();
    assert.strictEqual(label.textContent, 'Saved');
});
