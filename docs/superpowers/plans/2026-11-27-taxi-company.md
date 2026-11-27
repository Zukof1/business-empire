# Dashboard, Retail Shop and Taxi Company Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** Capped shops, a taxi business with wearing cars, and a Vault dashboard that opens each business.

**Architecture:** Rules in `logic.js` on `state.taxi = {fares, spaces, dispatcher, cars, nextId}`. The game loop passes its
capped frame time to `processTaxi`, so time away never counts. `ui.js` holds which business screen is open.

**Spec:** `docs/superpowers/specs/2026-11-27-taxi-company-design.md`

## Global Constraints
- Values exactly as in the spec. No new script files. Buttons at least 44px. No commits unless asked.

## Review Focus
- A car reaching its limit mid-tick earns only up to the limit.
- Double taps on Buy, Repair, Sell, Hire: charged or paid once.
- A car vanishing (scrapped) while its screen is open.
- A save with no taxi data, or with older businesses.
- Opening a business screen, switching tabs, and coming back.

### Task 1: Rules (`logic.js`; `tests/taxi.test.js`)
**Produces:** `window.TAXI_CARS`, `logic.openTaxiCompany()`, `buyTaxi(type)`, `processTaxi(ms)`, `repairTaxi(id)`,
`sellTaxi(id)`, `getTaxiSellValue(car)`, `getTaxiRepairCost(car)`, `expandTaxiFleet()`, `hireDispatcher()`,
`collectFares()`, `getTaxiRate()`.
- [ ] Failing tests, implement, pass.

### Task 2: Screens (`index.html`, `ui.js`, `styles.css`)
**Produces:** `ui.showBusiness(screen | null)`, `ui.goBack()`.
- [ ] Failing tests, implement, pass.

### Task 3: Verify
- [ ] Update older tests that assumed unlimited shops; extend the layout check; check at 360x640, 375x812, 812x375.
