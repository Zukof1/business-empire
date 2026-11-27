# Rental Properties Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.
> Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the Rental Properties business.

**Architecture:** Follows the Taxi Company: saved state in `state.rentals`, rules in `logic.js`, screens in `ui.js`
inside the Vault. Play-time effects (wear, departures, prices) use the capped frame time; rent uses wall-clock
timestamps, settled together with shop income.

**Tech Stack:** Plain HTML, CSS and JavaScript; `node --test`.

**Spec:** `docs/superpowers/specs/2026-11-27-rental-properties-design.md`

## Global Constraints
- All numbers come from the spec tables and sit as constants at the top of `logic.js`.
- No new script files. Bump `?v=` on the four script tags to 18.
- Ask before selling with `logic.ask`, and re-check inside the action.
- Tapped things are `.btn`, at least 44px. Reuse existing classes. Keep each file's line endings.
- No commits unless the owner asks.

## Review Focus
- Shops and rentals both earning while away: one welcome-back total, and the time away is not counted twice.
- A home sold, or its tenant gone, while the sell question is open: pays the current value, once.
- Reload: applicants are not re-rolled, and an old save without rentals still loads.
- Clock moved backwards: no negative rent and no endless wait for applicants.
- Tenant screen open for a home that has been sold or let: shows the Rentals screen.

## Task 1: Rules

**Files:** Modify `logic.js`. Create `tests/rentals.test.js`.

**Interfaces produced:**
- Data: `HOME_TYPES`, `TENANT_TYPES`, `RENT_LEVELS` (also on `window`).
- State: `rentals = {rent, agent, homes, nextId, lastPayout, market, change, marketMs}`;
  home `{id, type, condition, rentLevel, tenant: {name, type} | null, late, minuteMs, applicants, waitUntil}`.
- `openRentals()`, `buyHome(typeId)`, `getHomePrice(typeId)`, `chooseTenant(homeId, index)`,
  `setRentLevel(homeId, levelId)`, `getRentFor(home, tenantTypeId)`, `getHomeRate(home)`, `getRentRate()`,
  `processRentals(ms, now)`, `settleRent(now) -> {managed, away, gap}`, `collectRent()`, `hireAgent()`,
  `getHomeRepairCost(home)`, `repairHome(id)`, `getHomeSellValue(home)`, `sellHome(id)`, `getApplicantWait(home, now)`,
  plus `getHomeType`, `getHome`, `getTenantType`, `getRentLevel`.

- [ ] Write the tests in `tests/rentals.test.js` (rules section) covering every spec rule and Review Focus lines 1-4
- [ ] Run `node --test tests/rentals.test.js`; expect failures because the functions do not exist
- [ ] Implement, hooking into `processBusinessIncome`, `getPassiveIncome`, `collectAllIncome`, `prestige`, game loop
- [ ] Run `node --test tests/*.test.js`; expect all to pass

## Task 2: Screens

**Files:** Modify `ui.js`, `index.html` (version only), `tests/layout-check.js`; extend `tests/rentals.test.js`.

**Interfaces consumed:** Task 1. **Produced:** `ui.showTenants(homeId)`, screens `'rentals'` and `'tenants'`,
`ui.getHomePhoto(type)`.

- [ ] Write screen tests: start card, dashboard card and warning, home cards in all three states, tenants screen,
      back button, live sync, Vault dot, Review Focus line 5
- [ ] Run them; expect failures
- [ ] Implement the screens to match the approved mockup
- [ ] Run `node --test tests/*.test.js`; expect all to pass
- [ ] Add rentals and tenants to the layout check

## Task 3: Check and hand over

- [ ] Browser check at 320×568, 360×640, 375×812, 812×375 and 1280×800: layout check reports no problems; play
      through open, buy, choose, collect, repair, sell
- [ ] Review the diff against the spec; update `HANDOFF.md` with the rules and the Gemini photo prompts
