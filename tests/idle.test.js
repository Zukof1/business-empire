const test = require('node:test');
const assert = require('node:assert');
const { createGame } = require('./harness');

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;

// One retail business ($2/s) last paid `gap` ms before `now`
function awayFor(gap, extra = {}) {
    const game = createGame();
    const now = 1_000_000_000_000;
    game.window.state.businesses = [{ id: 'retail', level: 1, incomePerHour: 7200, lastPayout: now - gap }];
    Object.assign(game.window.state, extra);
    game.window.logic.processBusinessIncome(now);
    return { game, now, state: game.window.state, logic: game.window.logic };
}

test('an hour away pays one full minute, then quarter speed', () => {
    const { state } = awayFor(HOUR);
    assert.strictEqual(state.away.amount, 60 * 2 + 3540 * 2 * 0.25);
    assert.strictEqual(state.away.ms, HOUR);
    assert.ok(!state.businesses[0].accumulated);
    assert.strictEqual(state.balance, 0);
});

test('away earnings stop at two hours', () => {
    const { state } = awayFor(10 * HOUR);
    assert.strictEqual(state.away.amount, 60 * 2 + (7200 - 60) * 2 * 0.25);
    assert.strictEqual(state.away.ms, 10 * HOUR);
});

test('a short interruption pays full speed into the vault with no welcome screen', () => {
    const { state } = awayFor(30 * 1000);
    assert.strictEqual(state.businesses[0].accumulated, 60);
    assert.ok(!state.away);
});

test('a clock moved backwards never takes money away', () => {
    const { state, now } = awayFor(-HOUR);
    assert.ok(!state.businesses[0].accumulated);
    assert.ok(!state.away);
    assert.strictEqual(state.businesses[0].lastPayout, now);
});

test('collecting away earnings pays exactly once', () => {
    const { state, logic } = awayFor(HOUR);
    logic.collectAway();
    logic.collectAway();
    assert.strictEqual(state.balance, 1890);
    assert.strictEqual(state.lifetimeEarnings, 1890);
    assert.strictEqual(state.away, null);
});

test('uncollected away earnings survive a reload without being paid again', () => {
    const { game, now } = awayFor(HOUR);
    game.window.saveGame();
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    next.window.logic.processBusinessIncome(now);
    assert.strictEqual(next.window.state.away.amount, 1890);
});

test('prestige multiplier applies to away earnings', () => {
    const { state } = awayFor(HOUR, { prestigeCount: 10 });
    assert.strictEqual(state.away.amount, 3780);
});

test('returning after a long time does not pay a pile of missed dividends', () => {
    const game = createGame({ files: ['state.js', 'logic.js'] });
    const frames = [];
    game.window.performance = { now: () => 0 };
    game.window.requestAnimationFrame = fn => frames.push(fn);
    game.window.state.portfolio = { GOL: { shares: 100, totalSpent: 10000 } };
    game.window.logic.startGameLoop();
    let time = 3600 * 1000; // one hour frozen
    for (let i = 0; i < 100; i++) {
        frames.shift()(time);
        time += 16;
    }
    assert.strictEqual(game.window.state.balance, 0);
});
