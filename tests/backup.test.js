const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createGame, fakeElement } = require('./harness');

const ROOT = path.join(__dirname, '..');
const KEY = 'businessEmpireState';
const HOUR = 60 * 60 * 1000;
const read = file => fs.readFileSync(path.join(ROOT, file), 'utf8');
const encode = save => 'BE1:' + Buffer.from(JSON.stringify(save)).toString('base64');

// A game with something of everything in it
function played() {
    const game = createGame();
    const { state, logic } = { state: game.window.state, logic: game.window.logic };
    state.balance = 5_000_000;
    logic.buyBusiness('retail');
    logic.openTaxiCompany();
    logic.buyTaxi('sedan');
    logic.openRentals();
    logic.buyHome('villa');
    logic.chooseTenant(state.rentals.homes[0].id, 0);
    logic.buyLicense();
    logic.browseAuctions();
    logic.buyStock('GOL', 3);
    state.balance = 214500;
    logic.logEvent('Saved · a symbol that is not plain text ♠', '');
    return game;
}

// ---- The code ----

test('a backup code holds the whole game', () => {
    const game = played();
    const code = game.window.makeBackupCode();
    assert.match(code, /^BE1:[A-Za-z0-9+/=]+$/);
    const save = game.window.readBackupCode(code);
    assert.strictEqual(save.balance, 214500);
    assert.strictEqual(save.rentals.homes[0].type, 'villa');
    assert.strictEqual(save.taxi.cars[0].type, 'sedan');
    assert.strictEqual(save.portfolio.GOL.shares, 3);
    assert.strictEqual(save.logs[0].msg, 'Saved · a symbol that is not plain text ♠');
    assert.ok(save.stockPrices.GOL > 0);
});

test('spaces and line breaks added by a notes app are ignored', () => {
    const game = played();
    const code = game.window.makeBackupCode();
    const messy = '  \n' + code.replace(/(.{40})/g, '$1\n ') + '\n';
    assert.strictEqual(game.window.readBackupCode(messy).balance, 214500);
});

test('anything that is not a whole backup code is refused', () => {
    const game = played();
    const code = game.window.makeBackupCode();
    const good = { balance: 5, businesses: [], logs: [], portfolio: {} };
    const bad = ['', '   ', 'hello', code.slice(0, code.length / 2), code.slice(4), 'BE1:', 'BE1:!!!!',
        encode(null), encode([1]), encode({}), encode({ ...good, balance: 'lots' }),
        encode({ ...good, businesses: {} }), encode({ ...good, logs: null }), encode({ ...good, portfolio: [] }),
        undefined];
    bad.forEach(text => assert.strictEqual(game.window.readBackupCode(text), null, String(text).slice(0, 30)));
    assert.ok(game.window.readBackupCode(encode(good)));
});

test('a code carrying page markup is refused', () => {
    const game = createGame();
    const good = { balance: 5, businesses: [], logs: [], portfolio: {} };
    ['<img src=x>', 'a" onerror="x', 'a`b', 'a>b'].forEach(name => {
        assert.strictEqual(game.window.readBackupCode(encode({ ...good, dealerCars: [{ name }] })), null, name);
    });
});

// ---- Saying what is wrong ----

test('a refused code says what is wrong with it', () => {
    const game = played();
    const code = game.window.makeBackupCode();
    const good = { balance: 5, businesses: [], logs: [], portfolio: {} };
    const problem = text => game.window.inspectBackupCode(text).problem;

    assert.strictEqual(problem(code), null);
    assert.match(problem('  '), /Nothing was pasted/);
    assert.match(problem('Backup ' + code), /doesn't start with BE1:.*Backup/);
    assert.match(problem(code.slice(0, 2000) + '​' + code.slice(2000)), /U\+200B at position 2001 of /);
    assert.ok(code.length > 2000, `${code.length}`); // long enough to be cut in these places
    assert.match(problem(code.slice(0, 1500)), /cut off.*1,500 characters.*ending/);
    assert.ok(problem(code.slice(0, 1500)).includes(code.slice(1494, 1500)));
    assert.match(problem(encode({ ...good, balance: null })), /not a game save.*balance/);
    assert.match(problem(encode({ ...good, logs: 3 })), /not a game save.*logs/);
    assert.match(problem(encode({ ...good, dealerCars: [{ name: '<b>' }] })), /won't accept.*name/);
});

test('the length given in a problem matches the length given when copying', () => {
    const game = played();
    const code = game.window.makeBackupCode();
    assert.match(game.window.inspectBackupCode(code.slice(0, -40)).problem,
        new RegExp(`${(code.length - 40).toLocaleString('en-US')} characters`));
});

// ---- Restoring ----

test('restoring replaces the game, and closing the page cannot undo it', () => {
    const code = played().window.makeBackupCode();
    const game = createGame();
    let reloads = 0;
    game.window.location.reload = () => reloads++;
    game.window.state.balance = 7;
    game.window.startAutosave();

    assert.strictEqual(game.window.restoreGame(game.window.readBackupCode(code)), true);
    game.tickIntervals();
    game.emit('pagehide');
    assert.strictEqual(reloads, 1);

    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    assert.strictEqual(next.window.state.balance, 214500);
    assert.strictEqual(next.window.state.rentals.homes.length, 1);
});

test('restoring pays nothing for the time since the backup', () => {
    const source = played();
    const save = source.window.readBackupCode(source.window.makeBackupCode());
    save.businesses[0].lastPayout -= HOUR;
    save.rentals.lastPayout -= HOUR;
    save.away = { amount: 50, ms: 1000 };

    const game = createGame();
    game.window.restoreGame(save);
    const next = createGame({ storage: game.storage });
    next.window.loadGame();
    next.window.logic.processBusinessIncome();
    assert.strictEqual(next.window.state.away.amount, 50);
});

test('if the phone cannot save, the current game is kept', () => {
    const game = createGame();
    game.window.state.balance = 7;
    game.window.saveGame();
    const store = game.window.localStorage.setItem;
    let reloads = 0;
    game.window.location.reload = () => reloads++;
    game.window.localStorage.setItem = () => { throw new Error('full'); };

    assert.strictEqual(game.window.restoreGame({ balance: 99, businesses: [], logs: [], portfolio: {} }), false);
    assert.strictEqual(reloads, 0);
    game.window.localStorage.setItem = store;
    game.window.saveGame(); // saving must still work afterwards
    assert.strictEqual(game.saved().balance, 7);
});

// ---- Protected storage ----

test('the game asks the browser to keep its data, and copes if it cannot', async () => {
    let asked = 0;
    const game = createGame();
    game.window.navigator = { storage: { persist: () => { asked++; return Promise.reject(new Error('no')); } } };
    game.window.startAutosave();
    assert.strictEqual(asked, 1);
    await new Promise(resolve => setImmediate(resolve));

    const old = createGame();
    old.window.startAutosave(); // no such feature at all
});

// ---- Screens ----

function screen({ clipboard } = {}) {
    const game = played();
    ['ui.js'].forEach(file => game.run(read(file)));
    const el = {};
    ['backupTitle', 'backupHint', 'backupCode', 'backupError', 'backupCancel', 'backupNext',
        'confirmTitle', 'confirmMessage', 'confirmYes', 'confirmNo'].forEach(name => { el[name] = fakeElement(); });
    el.backupModal = fakeElement('hidden');
    el.confirmModal = fakeElement('hidden');
    el.backupCode.value = '';
    el.backupCode.select = () => { el.backupCode.selected = true; };
    const toasts = [];
    const ui = game.window.ui;
    ui.elements = el;
    ui.showToast = message => toasts.push(message);
    if (clipboard) game.window.navigator = { clipboard };
    const open = name => !el[name].classList.contains('hidden');
    return { game, ui, el, toasts, open };
}

test('Copy puts the code on the clipboard', async () => {
    let copied = '';
    const t = screen({ clipboard: { writeText: text => { copied = text; return Promise.resolve(); } } });
    await t.ui.copyBackup();
    assert.strictEqual(t.game.window.readBackupCode(copied).balance, 214500);
    assert.match(t.toasts[0], /copied/i);
    assert.ok(t.toasts[0].includes(`${copied.length.toLocaleString('en-US')} characters`), t.toasts[0]);
    assert.ok(!t.open('backupModal'));
});

test('if the phone will not copy, the code is shown to copy by hand', async () => {
    for (const clipboard of [{ writeText: () => Promise.reject(new Error('denied')) }, undefined]) {
        const t = screen({ clipboard });
        await t.ui.copyBackup();
        assert.ok(t.open('backupModal'));
        assert.match(t.el.backupCode.value, /^BE1:/);
        assert.strictEqual(t.el.backupCode.readOnly, true);
        assert.ok(t.el.backupCode.selected);
        assert.ok(t.el.backupHint.innerText.includes(`${t.el.backupCode.value.length.toLocaleString('en-US')} characters`));
        assert.ok(!t.open('backupNext'));
        assert.strictEqual(t.el.backupCancel.innerText, 'Done');
        assert.ok(t.el.backupCancel.classList.contains('span-all'), 'the lone button fills the row');
        t.ui.openBackup('restore');
        assert.ok(!t.el.backupCancel.classList.contains('span-all'));
    }
});

test('a bad code is explained and nothing is asked', () => {
    const t = screen();
    t.ui.openBackup('restore');
    t.el.backupCode.value = 'oops';
    t.ui.submitBackup();
    assert.ok(t.open('backupModal'));
    assert.ok(t.open('backupError'));
    assert.match(t.el.backupError.innerText, /doesn't look right.*doesn't start with BE1:.*oops/);
    assert.ok(!t.open('confirmModal'));

    t.ui.openBackup('restore'); // opening again starts clean
    assert.ok(!t.open('backupError'));
    assert.strictEqual(t.el.backupCode.value, '');
    assert.strictEqual(t.el.backupCode.readOnly, false);
    assert.ok(t.open('backupNext'));
});

test('a good code asks before replacing the game', () => {
    const t = screen();
    t.ui.openBackup('restore');
    t.el.backupCode.value = encode({ balance: 214500, businesses: [], logs: [], portfolio: {} });
    t.ui.submitBackup();
    assert.ok(!t.open('backupModal'));
    assert.ok(t.open('confirmModal'));
    assert.match(t.el.confirmMessage.innerText, /\$214\.5k/);
    assert.match(t.el.confirmYes.className, /btn-red/);

    t.ui.answer(false);
    assert.strictEqual(t.game.window.state.balance, 214500);
    assert.strictEqual(t.game.saved(), null);

    t.ui.openBackup('restore');
    t.el.backupCode.value = encode({ balance: 3, businesses: [], logs: [], portfolio: {} });
    t.ui.submitBackup();
    t.ui.answer(true);
    assert.strictEqual(t.game.saved().balance, 3);
});

test('the Stats screen has the backup buttons, wired up', () => {
    const html = read('index.html');
    ['backupCopyBtn', 'backupRestoreBtn', 'backupModal', 'backupCode'].forEach(id => assert.match(html, new RegExp(`id="${id}"`)));
    assert.ok(html.indexOf('id="taxBtn"') < html.indexOf('id="backupCopyBtn"'));
    assert.ok(html.indexOf('id="backupCopyBtn"') < html.indexOf('id="prestigeBtn"'));
    const ui = read('ui.js');
    assert.match(ui, /backupCopyBtn[^\n]*copyBackup\(\)/);
    assert.match(ui, /backupRestoreBtn[^\n]*openBackup\('restore'\)/);
    assert.match(ui, /backupNext[^\n]*submitBackup\(\)/);
    assert.match(ui, /backupCancel[^\n]*closeBackup\(\)/);
});

test('the code box can be selected and pasted into, and does not zoom on iPhone', () => {
    const rule = read('styles.css').match(/\.code-box \{[^}]*\}/)[0];
    assert.match(rule, /-webkit-user-select: text/);
    assert.match(rule, /user-select: text/);
    assert.match(rule, /font(-size)?:[^;]*16px/);
});

// ---- Home Screen ----

const pngSize = file => {
    const png = fs.readFileSync(path.join(ROOT, file));
    return [png.readUInt32BE(16), png.readUInt32BE(20)];
};

test('the Home Screen app is called Empire, opens full screen and has its icons', () => {
    const html = read('index.html');
    assert.match(html, /<link rel="manifest" href="manifest\.webmanifest">/);
    assert.match(html, /<link rel="apple-touch-icon" href="Assets\/icons\/icon-180\.png">/);
    assert.match(html, /<meta name="apple-mobile-web-app-title" content="Empire">/);

    const manifest = JSON.parse(read('manifest.webmanifest'));
    assert.strictEqual(manifest.short_name, 'Empire');
    assert.strictEqual(manifest.display, 'standalone');
    assert.deepStrictEqual(manifest.icons.map(i => i.sizes), ['192x192', '512x512']);
    [180, 192, 512].forEach(size => assert.deepStrictEqual(pngSize(`Assets/icons/icon-${size}.png`), [size, size]));
});
