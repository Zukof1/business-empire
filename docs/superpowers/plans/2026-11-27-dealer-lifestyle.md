# Dealership move and Lifestyle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** Run the dealership from the Vault and add a Lifestyle tab for spending.

**Architecture:** The existing dealership markup moves inside the Vault view and shows when `ui.businessScreen` is
`'dealer'`. Lifestyle rules live in `logic.js` on `state.lifestyle = {itemId: count}`.

**Spec:** `docs/superpowers/specs/2026-11-27-dealer-lifestyle-design.md`

## Global Constraints
- Values exactly as in the spec. Element ids of the dealership stay. Buttons at least 44px. No commits unless asked.

## Review Focus
- A save whose open tab was the old dealer tab.
- Buying the license or a one-off item twice.
- Cars restoring while the dealership screen is closed.
- A scrapped taxi or car event re-rendering the wrong Vault screen.
- Prestige while owning items.

### Task 1: Dealership (`index.html`, `ui.js`, `logic.js`; `tests/lifestyle.test.js`)
**Produces:** `ui.isDealerOpen()`, `ui.showBusiness('dealer')`.
### Task 2: Lifestyle
**Produces:** `window.LIFESTYLE_ITEMS`, `logic.buyLifestyle(id)`, `logic.getLifestyleLevel()`, `ui.renderLifestyle()`.
### Task 3: Verify
Update tests and the layout check for the moved screen; check at 320x568, 360x640, 375x812, 812x375.
