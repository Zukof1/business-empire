const test = require('node:test');
const assert = require('node:assert');
const { createGame, fakeElement } = require('./harness');

function table() {
    const game = createGame({ files: ['state.js', 'logic.js', 'ui.js'] });
    const el = {};
    ['bjDealerHand', 'bjDealerScore', 'bjPlayerHand', 'bjPlayerScore', 'bjResult', 'bjControlsDeal']
        .forEach(name => { el[name] = fakeElement(); });
    el.bjTable = fakeElement('hidden');
    el.bjControlsPlay = fakeElement('hidden');
    el.bjBetContainer = fakeElement();
    game.window.ui.elements = el;
    game.window.state.balance = 10000;
    const deal = (...values) => {
        const queue = values.map(value => ({ value, suit: '♠' }));
        game.window.logic.getCard = () => queue.shift();
    };
    return { game, el, deal, logic: game.window.logic };
}

test('a new hand does not show the previous result', () => {
    const { el, deal, logic } = table();
    deal('10', '6', '10', '9');
    logic.bjDeal(1000);
    logic.bjStand(); // dealer 19 beats 16
    assert.match(el.bjResult.innerText, /Dealer Wins/);

    deal('5', '4', '9');
    logic.bjDeal(1000);
    assert.strictEqual(el.bjResult.innerText, 'Hit or stand');
});

test('the bet box is hidden during a hand and returns afterwards', () => {
    const { el, deal, logic } = table();
    deal('10', '6', '10', '9');
    logic.bjDeal(1000);
    assert.ok(el.bjBetContainer.classList.contains('hidden'));

    logic.bjStand();
    assert.ok(!el.bjBetContainer.classList.contains('hidden'));
});

test('the empty table does not claim a fixed bet amount', () => {
    const { el, logic } = table();
    logic.bjReset();
    assert.strictEqual(el.bjResult.innerText, 'Place your bet');
});

test('a hand in progress is restored after a reload', () => {
    const { game, deal, logic } = table();
    deal('5', '4', '9');
    logic.bjDeal(1000);
    game.window.saveGame();

    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.state.blackjack.active, true);
    assert.strictEqual(next.window.state.blackjack.playerHand.length, 2);
});
