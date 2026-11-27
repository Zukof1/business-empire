const test = require('node:test');
const assert = require('node:assert');
const { createGame, fakeElement } = require('./harness');

function casino(balance = 10000, files) {
    const game = createGame(files ? { files } : {});
    game.window.state.balance = balance;
    return { game, state: game.window.state, logic: game.window.logic };
}

function stack(logic, ...values) {
    const queue = values.map(value => ({ value, suit: '♠' }));
    logic.getCard = () => queue.shift();
}

test('slots return 93.75% of the bet across every possible result', () => {
    const { game, state, logic } = casino();
    let returned = 0;
    for (let i = 0; i < 64; i++) {
        const rolls = [i % 4, Math.floor(i / 4) % 4, Math.floor(i / 16)].map(n => (n + 0.5) / 4);
        game.window.rolls = rolls;
        game.run('Math.random = () => rolls.shift()');
        state.balance = 100;
        logic.spinSlots(100);
        game.flushTimeouts();
        returned += state.balance;
    }
    assert.strictEqual(returned / (64 * 100), 0.9375);
});

test('green roulette pays 14 times the bet', () => {
    const { game, state, logic } = casino(100);
    game.run('Math.random = () => 0.999'); // last pocket is green
    logic.playRoulette('Green', 100);
    game.flushTimeouts();
    assert.strictEqual(state.balance, 1400);
});

test('a second spin is ignored while the reels are turning', () => {
    const { game, state, logic } = casino(1000);
    game.run('Math.random = () => 0.99');
    logic.spinSlots(100);
    logic.spinSlots(100);
    assert.strictEqual(state.balance, 900);
    game.flushTimeouts();
    logic.spinSlots(100);
    assert.strictEqual(state.balance, 900 + 3000 - 100);
});

test('a second bet is ignored while the roulette wheel is turning', () => {
    const { game, state, logic } = casino(1000);
    game.run('Math.random = () => 0');
    logic.playRoulette('Black', 100);
    logic.playRoulette('Black', 100);
    assert.strictEqual(state.balance, 900);
    game.flushTimeouts();
    logic.playRoulette('Black', 100);
    assert.strictEqual(state.balance, 800);
});

test('double down takes one card, doubles the stake and pays double', () => {
    const { state, logic } = casino();
    stack(logic, '5', '6', '10', '9', '8'); // player 20, dealer 18
    logic.bjDeal(1000);
    logic.bjDouble();
    logic.bjDouble();
    assert.strictEqual(state.blackjack.playerHand.length, 3);
    assert.strictEqual(state.blackjack.bet, 2000);
    assert.strictEqual(state.blackjack.active, false);
    assert.strictEqual(state.balance, 12000);
    assert.strictEqual(state.casinoProfitLoss, 2000);
});

test('a bust after doubling loses both stakes', () => {
    const { state, logic } = casino();
    stack(logic, '10', '6', '10', '9');
    logic.bjDeal(1000);
    logic.bjDouble();
    assert.strictEqual(state.balance, 8000);
    assert.match(state.blackjack.status, /Bust! Lost \$2,000/);
});

test('no double down after taking a card', () => {
    const { state, logic } = casino();
    stack(logic, '2', '3', '10', '4', '5');
    logic.bjDeal(1000);
    logic.bjHit();
    logic.bjDouble();
    assert.strictEqual(state.blackjack.bet, 1000);
    assert.strictEqual(state.balance, 9000);
});

test('no double down without enough money', () => {
    const { state, logic } = casino(1500);
    stack(logic, '5', '6', '10');
    logic.bjDeal(1000);
    logic.bjDouble();
    assert.strictEqual(state.balance, 500);
    assert.strictEqual(state.blackjack.playerHand.length, 2);
});

test('spin controls are locked while spinning', () => {
    const { game, logic } = casino(10000, ['state.js', 'logic.js', 'ui.js']);
    const el = { spinSlotsBtn: fakeElement(), slotsBetInput: fakeElement(), btnBetRed: fakeElement(), rouletteBetInput: fakeElement() };
    game.window.ui.elements = el;
    logic.spinning.slots = true;
    game.window.ui.syncVisualsSilently();
    assert.strictEqual(el.spinSlotsBtn.disabled, true);
    assert.strictEqual(el.slotsBetInput.disabled, true);
    assert.strictEqual(el.btnBetRed.disabled, false);
});
