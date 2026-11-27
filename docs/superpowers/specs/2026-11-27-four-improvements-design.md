# Four game improvements: design

Approved in chat on 2026-11-27.

## Why
The game has little to come back for and little to decide. Businesses need constant manual collecting, the car
dealership is a fixed 25% markup, and the casino pays out more than it takes. Business income repays its cost in
under a minute, so rewards for being away must stay modest.

## Approach
Extend the existing plain HTML and JavaScript. No new libraries, no build step, no new script files (the bundle
script lists them by name). Existing saves must keep loading. A rewrite or a framework was ruled out because the
game is small and works.

## 1. Idle earnings
- Away time earns at **25% speed** for up to **2 hours**.
- A "Welcome back, you earned $X" screen holds it until the player collects. It survives a reload.
- Applies to a reload and to a phone app or tab left in the background.
- Builder's call: the first minute of any gap pays at full speed, so a short interruption costs nothing.
- Builder's call: tax, dividends and market timers only run while the game is active.

## 2. Managers and milestones
- One manager per business type, costing **10 times the base price**. Needs at least one of that business.
- A managed business pays straight into the balance. Away earnings still go through the welcome screen.
- Income **doubles at levels 5, 10, 15 and 20**. Each owned business shows progress to the next one.

## 3. Dealership
| Car | How often | Price | Sale markup | Fault chance |
|---|---|---|---|---|
| Common | 70% | $500 to $1,200 | 30% | 15% |
| Rare | 25% | $3,000 to $8,000 | 45% | 25% |
| Classic | 5% | $20,000 to $50,000 | 70% | 35% |

- Inspect: 5% of the asking price, reveals whether there is a fault.
- Haggle: one try per car, even odds of 10% off. On failure the seller leaves.
- Demand: a multiplier from 80% to 130% per car class, changing every minute. Survives a reload.
- Sale price: listed value, plus markup, times demand. A haggled discount adds to profit.
- Repair: 20% of the listed price. New auctions have a 30 second wait.

## 4. Casino
- Slots: triple sevens pay 30 times the bet, other triples 10 times (returns about 94%).
- Roulette: green pays 14 times the bet.
- Bet chips: $100, $500, $1k and Max.
- Blackjack double down: on the first two cards, double the bet, take exactly one card, then stand.
- Spin buttons, bet boxes and chips are locked while a game is spinning.

## Not included
Prestige button, `run.bat`, roulette image sizes, the red balance colour, the `$$` log text and the Blackjack
"Reset Failsafe" button.
