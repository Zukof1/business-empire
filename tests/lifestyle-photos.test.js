const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const ROOT = path.join(__dirname, '..');
const FULL = ['state.js', 'logic.js', 'ui.js'];

test('every Lifestyle item has a real JPEG small enough for a phone', () => {
    const game = createGame({ files: FULL });
    for (const item of game.window.LIFESTYLE_ITEMS) {
        const photo = fs.readFileSync(path.join(ROOT, game.window.ui.getLifestylePhoto(item)));
        assert.strictEqual(photo.readUInt16BE(0), 0xffd8, `${item.id} is not a JPEG`);
        assert.ok(photo.length < 100 * 1024, `${item.id} is ${Math.round(photo.length / 1024)}KB`);
    }
});

function screen() {
    const game = createGame({ files: FULL });
    const el = { lifestyleContent: fakeElement() };
    game.window.ui.elements = el;
    return { game, el, ui: game.window.ui };
}

test('each item card shows its photo, loaded only when needed', () => {
    const { el, ui } = screen();
    ui.renderLifestyle();
    const html = el.lifestyleContent.innerHTML;
    assert.strictEqual((html.match(/class="item-photo"/g) || []).length, 12);
    assert.match(html, /<img[^>]+src="Assets\/lifestyle-web\/yacht\.jpg"[^>]+alt="Yacht"[^>]+loading="lazy"/);
});

test('things you own show their photo in the collection', () => {
    const { game, el, ui } = screen();
    game.window.state.lifestyle = { yacht: 1 };
    ui.renderLifestyle();
    assert.match(el.lifestyleContent.innerHTML, /class="owned"[^>]*>\s*<img[^>]+lifestyle-web\/yacht\.jpg/);
});
