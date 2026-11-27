# Four Game Improvements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox syntax.

**Goal:** Add idle earnings, managers and milestones, a deeper dealership and a fairer casino.

**Architecture:** Rules live in `logic.js`, drawing in `ui.js`, saved fields on the single `window.state` object.
Timed things use wall-clock timestamps so a reload cannot reroll or skip them.

**Tech Stack:** Plain JavaScript, Tailwind CDN, `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-27-four-improvements-design.md`

## Global Constraints
- No new dependencies or script files. `window.state` stays the same object as `state`.
- Old saves must load. Buttons are at least 44px. Layout check passes from 360x640.
- No commits unless the user asks (overrides the per-task commit step).

## Review Focus
- An old save with cars or businesses lacking the new fields: loads and plays.
- Reloading repeatedly: cannot reroll demand, auctions or away earnings.
- Double taps on Collect, Hire, Double or Spin: charged or paid once.
- Balance too low for inspect, haggle purchase, repair, manager or double: nothing changes.
- Clock moved backwards: no negative earnings.

### Task 1: Idle earnings (`logic.js`, `ui.js`, `index.html`; `tests/idle.test.js`)
**Produces:** `logic.processBusinessIncome(now = Date.now())`, `logic.collectAway()`, `state.away = {amount, ms} | null`.
- [x] Tests: 1h gap on $2/s pays 60*2 + 3540*2*0.25 = $1,890 into `away`; 10h gap equals the 2h result ($3,690);
  30s gap pays $60 to the vault and no `away`; collect pays once; survives reload; negative gap pays 0;
  a huge frame gap pays at most one dividend.
- [x] Run, see them fail. Implement; clamp the loop's `deltaTime` to 1000 ms. Add `#awayModal`. Run, pass.

### Task 2: Managers and milestones (`logic.js`, `ui.js`, `state.js`; `tests/managers.test.js`)
**Produces:** `logic.getMilestone(level) -> {multiplier, next, progress}`, `logic.getManagerCost(id)`,
`logic.buyManager(id)`, `logic.refreshBusinessIncome()` (called on load), `state.managers = {id: true}`.
- [x] Tests: multiplier 1 at level 4, 2 at 5, 16 at 20; next is null at 20; manager costs $1,000 for retail; refused
  without a business, funds or twice; hiring sweeps the vault; managed income reaches balance; old saves are
  recalculated; away earnings of a managed business go to `away`.
- [x] Run, fail. Implement; manager row and milestone bar in `renderBusinesses`. Run, pass.

### Task 3: Dealership (`logic.js`, `ui.js`, `index.html`; `tests/dealership.test.js`)
**Produces:** `window.CAR_TIERS`, `logic.inspectCar(i)`, `logic.haggleCar(i)`, `logic.updateCarDemand(now)`,
`logic.getSalePrice(car)`, `logic.getRepairCost(car)`, car fields `{tier, value, price, inspected, haggled,
hasHiddenFault}`, `state.carDemand`, `state.demandNextAt`, `state.nextAuctionAt`.
- [x] Tests: tier picked by roll; prices inside tier range; second auction inside 30s refused, also after reload;
  inspect charges 5% once; haggle success 10% off once, failure removes the car; sale price = value*(1+markup)*demand;
  demand within 0.8 to 1.3 and unchanged until due; repair 20%; legacy car sells as Common.
- [x] Run, fail. Implement; fix dealer badge and live button states. Run, pass.

### Task 4: Casino (`logic.js`, `ui.js`, `index.html`, `styles.css`; `tests/casino.test.js`)
**Produces:** `logic.spinning = {slots, roulette}`, `logic.bjDouble()`, `ui.renderBetChips()`.
- [x] Tests: exact slot return over all 64 results is 0.9375; green pays 14x; second spin while spinning charges
  nothing; unlock after payout; double takes one card, doubles stake and payout; refused after a hit or without funds.
- [x] Update the old slot expectations in `tests/save.test.js` (jackpot is now $3,000).
- [x] Run, fail. Implement; chips share the bet row so casino screens do not grow. Run, pass.

### Task 5: Verify
- [x] Extend `tests/layout-check.js` for the new controls, bump script versions to `?v=10`.
- [x] `node --test tests/*.test.js`; layout check at 360x640, 375x812, 812x375, 1280x650; click through in browser.
