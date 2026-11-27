const test = require('node:test');
const assert = require('node:assert');
const { createGame, fakeElement } = require('./harness');

const NOW = 1_000_000_000_000;

function dealer({ balance = 100000, auction = [], garage = [], files } = {}) {
    const game = createGame(files ? { files } : {});
    Object.assign(game.window.state, {
        balance, hasDealerLicense: true, auctionCars: auction, dealerCars: garage, garageSlots: 3
    });
    return { game, state: game.window.state, logic: game.window.logic };
}

const lot = (extra = {}) => ({
    id: 1, tier: 'common', name: 'Sedan', icon: 'c', value: 1000, price: 1000,
    inspected: false, haggled: false, hasHiddenFault: false, ...extra
});

test('car class follows the 70 / 25 / 5 odds', () => {
    const { logic } = dealer();
    assert.deepStrictEqual(
        [0, 0.699, 0.701, 0.949, 0.951, 0.999].map(roll => logic.pickCarTier(roll).id),
        ['common', 'common', 'rare', 'rare', 'classic', 'classic']
    );
});

test('auction prices stay inside the range of their class', () => {
    const { state, logic } = dealer();
    const ranges = { common: [500, 1200], rare: [3000, 8000], classic: [20000, 50000] };
    for (let i = 0; i < 300; i++) {
        logic.browseAuctions(NOW + i * 30000);
        for (const car of state.auctionCars) {
            const [min, max] = ranges[car.tier];
            assert.ok(car.price >= min && car.price <= max, `${car.tier} ${car.price}`);
            assert.strictEqual(car.value, car.price);
        }
    }
});

test('a new auction has a 30 second wait, even after a reload', () => {
    const { game, state, logic } = dealer();
    logic.browseAuctions(NOW);
    const first = JSON.stringify(state.auctionCars);
    logic.browseAuctions(NOW + 29999);
    assert.strictEqual(JSON.stringify(state.auctionCars), first);

    game.window.saveGame();
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    next.window.logic.browseAuctions(NOW + 29999);
    assert.strictEqual(JSON.stringify(next.window.state.auctionCars), first);
    next.window.logic.browseAuctions(NOW + 30000);
    assert.notStrictEqual(JSON.stringify(next.window.state.auctionCars), first);
});

test('inspecting costs 5% of the price once', () => {
    const { state, logic } = dealer({ auction: [lot()] });
    logic.inspectCar(0);
    logic.inspectCar(0);
    assert.strictEqual(state.balance, 99950);
    assert.strictEqual(state.auctionCars[0].inspected, true);
});

test('a successful haggle takes 10% off, only once', () => {
    const { game, state, logic } = dealer({ auction: [lot()] });
    game.run('Math.random = () => 0.1');
    logic.haggleCar(0);
    logic.haggleCar(0);
    assert.strictEqual(state.auctionCars[0].price, 900);
    assert.strictEqual(state.auctionCars[0].value, 1000);
});

test('a failed haggle makes the seller leave', () => {
    const { game, state, logic } = dealer({ auction: [lot()] });
    game.run('Math.random = () => 0.9');
    logic.haggleCar(0);
    assert.strictEqual(state.auctionCars.length, 0);
    assert.strictEqual(state.balance, 100000);
});

test('buying keeps the listed value but charges the haggled price', () => {
    const { state, logic } = dealer({ auction: [lot({ price: 900 })] });
    logic.buyAuction(0);
    assert.strictEqual(state.balance, 99100);
    assert.strictEqual(state.dealerCars[0].value, 1000);
    assert.strictEqual(state.dealerCars[0].buyPrice, 900);
    assert.strictEqual(state.dealerCars[0].tier, 'common');
});

test('sale price is value plus class markup, times demand', () => {
    const car = { tier: 'rare', value: 4000, buyPrice: 4000, status: 'ready' };
    const { state, logic } = dealer({ balance: 0, garage: [car] });
    state.carDemand = { common: 1, rare: 1.2, classic: 1 };
    assert.strictEqual(logic.getSalePrice(car), 6960);
    logic.sellCar(0);
    assert.strictEqual(state.balance, 6960);
});

test('demand stays between 80% and 130% and changes once a minute', () => {
    const { game, state, logic } = dealer();
    game.run('Math.random = () => 0');
    assert.strictEqual(logic.updateCarDemand(NOW), true);
    assert.strictEqual(state.carDemand.common, 0.8);
    game.run('Math.random = () => 0.999999');
    assert.strictEqual(logic.updateCarDemand(NOW + 59999), false);
    assert.strictEqual(state.carDemand.common, 0.8);
    assert.strictEqual(logic.updateCarDemand(NOW + 60000), true);
    assert.strictEqual(state.carDemand.classic, 1.3);
});

test('repairs cost 20% of the listed value', () => {
    const car = { tier: 'rare', value: 4000, buyPrice: 3600, status: 'needs_repair', hasHiddenFault: true };
    const { state, logic } = dealer({ balance: 799, garage: [car] });
    logic.payForRepair(0);
    assert.strictEqual(state.dealerCars[0].status, 'needs_repair');
    state.balance = 800;
    logic.payForRepair(0);
    assert.strictEqual(state.balance, 0);
    assert.strictEqual(state.dealerCars[0].status, 'restoring');
});

test('cars from an old save sell as common cars', () => {
    const { logic } = dealer();
    assert.strictEqual(logic.getSalePrice({ buyPrice: 1000, sellPrice: 1250, status: 'ready' }), 1300);
});

test('old auction listings are cleared on load', () => {
    const old = { auctionCars: [{ id: 5, name: 'Old', price: 700 }] };
    const game = createGame({ storage: new Map([['businessEmpireState', JSON.stringify(old)]]) });
    game.window.loadGame();
    assert.strictEqual(game.window.state.auctionCars.length, 0);
});

test('the dealer alert dot shows when a car is ready', () => {
    const { game } = dealer({ garage: [{ status: 'ready', buyPrice: 500 }], files: ['state.js', 'logic.js', 'ui.js'] });
    const badge = fakeElement('hidden');
    game.window.ui.elements = { dealerBadge: badge };
    game.window.ui.updateDealerBadge();
    assert.match(badge.className, /badge-good/);
    assert.ok(!badge.classList.contains('hidden'));
});
