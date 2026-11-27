const test = require('node:test');
const assert = require('node:assert');
const { createGame } = require('./harness');

const NOW = 1_000_000_000_000;

function owner(balance = 100000) {
    const game = createGame();
    game.window.state.balance = balance;
    game.window.state.businesses = [{ id: 'retail', level: 1, incomePerHour: 7200, lastPayout: NOW, accumulated: 50 }];
    return { game, state: game.window.state, logic: game.window.logic };
}

test('income doubles at levels 5, 10, 15 and 20', () => {
    const { logic } = owner();
    assert.deepStrictEqual(
        [1, 4, 5, 9, 10, 15, 20, 30].map(level => logic.getMilestone(level).multiplier),
        [1, 1, 2, 2, 4, 8, 16, 16]
    );
    // Shops have their own ceiling now; the other business types keep milestones
    assert.strictEqual(logic.getBusinessIncome({ id: 'startup', level: 5 }), 216000 * Math.pow(1.6, 4) * 2);
});

test('milestone progress counts from the previous milestone to the next', () => {
    const { logic } = owner();
    assert.strictEqual(logic.getMilestone(1).next, 5);
    assert.strictEqual(logic.getMilestone(5).next, 10);
    assert.strictEqual(logic.getMilestone(5).progress, 0);
    assert.strictEqual(logic.getMilestone(8).progress, 0.6);
    assert.strictEqual(logic.getMilestone(20).next, null);
    assert.strictEqual(logic.getMilestone(20).progress, 1);
});

test('a manager costs ten times the base price', () => {
    const { logic } = owner();
    assert.strictEqual(logic.getManagerCost('retail'), 1000);
    assert.strictEqual(logic.getManagerCost('corp'), 10000000);
});

test('hiring a manager charges once and collects what was waiting', () => {
    const { state, logic } = owner(1500);
    logic.buyManager('retail');
    logic.buyManager('retail');
    assert.strictEqual(state.managers.retail, true);
    assert.strictEqual(state.balance, 550);
    assert.strictEqual(state.businesses[0].accumulated, 0);
});

test('no manager without the money', () => {
    const { state, logic } = owner(999);
    logic.buyManager('retail');
    assert.strictEqual(state.balance, 999);
    assert.ok(!state.managers?.retail);
});

test('no manager for a business you do not own', () => {
    const { state, logic } = owner(10_000_000);
    logic.buyManager('startup');
    assert.strictEqual(state.balance, 10_000_000);
});

test('a managed business pays straight into the balance', () => {
    const { state, logic } = owner(0);
    state.managers = { retail: true };
    state.businesses[0].accumulated = 0;
    logic.processBusinessIncome(NOW + 10000);
    assert.strictEqual(state.balance, 20);
    assert.strictEqual(state.lifetimeEarnings, 20);
    assert.strictEqual(state.businesses[0].accumulated, 0);
});

test('a managed business still reports time away on the welcome screen', () => {
    const { state, logic } = owner(0);
    state.managers = { retail: true };
    state.businesses[0].accumulated = 0;
    logic.processBusinessIncome(NOW + 3600 * 1000);
    assert.strictEqual(state.balance, 0);
    assert.strictEqual(state.away.amount, 1890);
});

test('old saves get their milestone bonus when loaded', () => {
    const old = { businesses: [{ id: 'startup', level: 6, incomePerHour: 1, lastPayout: NOW }] };
    const game = createGame({ storage: new Map([['businessEmpireState', JSON.stringify(old)]]) });
    game.window.loadGame();
    assert.strictEqual(game.window.state.businesses[0].incomePerHour, 216000 * Math.pow(1.6, 5) * 2);
});
