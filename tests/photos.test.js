const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const ROOT = path.join(__dirname, '..');
const FULL = ['state.js', 'logic.js', 'ui.js'];
const photoPath = name => path.join(ROOT, 'Assets', 'cars-web', `${name}.jpg`);

// Width of a JPEG, read from its frame header
function jpegWidth(buffer) {
    let i = 2;
    while (i < buffer.length) {
        const marker = buffer[i + 1];
        if (marker >= 0xc0 && marker <= 0xc3) return buffer.readUInt16BE(i + 7);
        i += 2 + buffer.readUInt16BE(i + 2);
    }
    return null;
}

test('every dealer car has its own photo', () => {
    const game = createGame({ files: FULL });
    const names = game.window.CAR_TIERS.flatMap(tier => tier.models.map(([name]) => name));
    const photos = names.map(name => game.window.ui.getCarPhoto({ name }));
    assert.strictEqual(new Set(photos).size, names.length);
    photos.forEach(src => assert.ok(src && fs.existsSync(path.join(ROOT, src)), src));
});

test('car photos are small enough for a phone, including the taxis', () => {
    const files = fs.readdirSync(path.join(ROOT, 'Assets', 'cars-web'));
    assert.strictEqual(files.length, 11);
    ['taxi-hatchback', 'taxi-sedan', 'taxi-luxury'].forEach(name => assert.ok(fs.existsSync(photoPath(name)), name));
    files.forEach(file => {
        const image = fs.readFileSync(path.join(ROOT, 'Assets', 'cars-web', file));
        assert.ok(image.length < 80 * 1024, `${file} is ${Math.round(image.length / 1024)}KB`);
        assert.ok(jpegWidth(image) <= 720, `${file} is ${jpegWidth(image)}px wide`);
    });
});

function dealer(state) {
    const game = createGame({ files: FULL });
    const el = { auctionResultsList: fakeElement(), garageSlotsContainer: fakeElement() };
    game.window.ui.elements = el;
    Object.assign(game.window.state, { balance: 100000, garageSlots: 1, auctionCars: [], dealerCars: [] }, state);
    return { game, el };
}

const car = { tier: 'common', name: '2005 Truck', value: 900, price: 900, buyPrice: 900, status: 'ready' };

test('auction listings show the car photo, described for screen readers', () => {
    const { game, el } = dealer({ auctionCars: [{ ...car }] });
    game.window.ui.renderAuction();
    assert.match(el.auctionResultsList.innerHTML, /<img[^>]+src="Assets\/cars-web\/truck-2005\.jpg"[^>]+alt="2005 Truck"/);
});

test('cars in the garage show their photo', () => {
    const { game, el } = dealer({ dealerCars: [{ ...car }] });
    game.window.ui.renderGarage();
    assert.match(el.garageSlotsContainer.innerHTML, /Assets\/cars-web\/truck-2005\.jpg/);
});

test('a car without a photo still shows an icon', () => {
    const { game, el } = dealer({ auctionCars: [{ ...car, name: 'Old Banger' }] });
    game.window.ui.renderAuction();
    assert.ok(!el.auctionResultsList.innerHTML.includes('<img'));
    assert.match(el.auctionResultsList.innerHTML, /#i-car/);
});
