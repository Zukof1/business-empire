// Loads the real game scripts into an isolated context with a minimal browser stand-in.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.join(__dirname, '..');

function fakeElement(...initialClasses) {
    const classes = new Set(initialClasses);
    return {
        innerText: '',
        innerHTML: '',
        textContent: '',
        disabled: false,
        classList: {
            add: (...c) => c.forEach(x => classes.add(x)),
            remove: (...c) => c.forEach(x => classes.delete(x)),
            contains: c => classes.has(c),
            replace: (a, b) => { if (classes.delete(a)) classes.add(b); }
        }
    };
}

function createGame({ storage = new Map(), files = ['state.js', 'logic.js'] } = {}) {
    const timeouts = [];
    const intervals = [];
    const listeners = {};
    const on = (type, fn) => (listeners[type] ||= []).push(fn);

    const context = {
        console: { log() {}, warn() {}, error() {} },
        localStorage: {
            getItem: k => (storage.has(k) ? storage.get(k) : null),
            setItem: (k, v) => storage.set(k, String(v)),
            removeItem: k => storage.delete(k)
        },
        confirm: () => true,
        location: { reload() {} },
        btoa,
        atob,
        setTimeout: fn => timeouts.push(fn),
        clearTimeout() {},
        setInterval: fn => intervals.push(fn),
        addEventListener: on,
        document: { visibilityState: 'visible', addEventListener: on, getElementById: () => null }
    };
    context.window = context;
    vm.createContext(context);
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(ROOT, file), 'utf8'), context, { filename: file });
    }

    return {
        window: context,
        storage,
        run: code => vm.runInContext(code, context),
        saved: () => JSON.parse(storage.get('businessEmpireState') || 'null'),
        flushTimeouts: () => timeouts.splice(0).forEach(fn => fn()),
        tickIntervals: () => intervals.forEach(fn => fn()),
        emit: type => (listeners[type] || []).forEach(fn => fn())
    };
}

module.exports = { createGame, fakeElement };
