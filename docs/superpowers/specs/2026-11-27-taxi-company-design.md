# Business dashboard, capped Retail Shop and Taxi Company: design

Approved in chat on 2026-11-27.

## Intent
Give each business its own limits and chores, so owning several makes sense and there is more to do than collect money.

## Dashboard
The Vault lists what you own, one card per business, with its earning rate and anything needing attention. A card opens
that business's own screen with a back button. "Start a business" lists the types on offer.

## Retail Shop
Up to 3 shops, each up to level 10, earning $2 a second per level. An upgrade costs $100 times the current level.
The manager and away earnings work as before.

## Taxi Company
Opens for $10,000. Earns only while the game is being played.

| Car | Price | Earns | Scrapped at | Breakdown odds per minute |
|---|---|---|---|---|
| Cheap hatchback | $4,000 | $15/s | 100,000 km | 20% |
| Reliable sedan | $20,000 | $40/s | 300,000 km | 5% |
| Luxury saloon | $80,000 | $200/s | 150,000 km | 10% |

- Cars drive 12,500 km a minute and are scrapped at their limit.
- A broken car neither earns nor wears until repaired for 10% of its price.
- 3 fleet spaces, expandable to 6 at $25,000 each.
- A $25,000 dispatcher collects fares automatically.
- Selling early returns half the price, scaled by the kilometres left. Builder's call: asks for confirmation.

## Older businesses
Tech Startup, Real Estate Firm and Mega Corporation cannot be started until rebuilt. Builder's call: ones already in
a local save keep working, so nothing is destroyed. Shops above level 10 are capped at 10.
