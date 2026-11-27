# Rental Properties: design

Approved in chat on 2026-11-27, from rules tables and a four-screen mockup.

## Intent
A later business that pays more than shops and taxis, with choices to make: who rents, what to charge, when to repair
and when to sell.

Not wanted: new chores while the game is away, or a way to farm Prestige by buying and selling homes.

## Rules
Opens for $150,000. Up to 4 homes.

| Home | Price | Fair rent | Full repair |
|---|---|---|---|
| Studio flat | $40,000 | $60/s | $4,000 |
| Family house | $150,000 | $250/s | $22,500 |
| Villa | $600,000 | $1,100/s | $120,000 |

An empty home earns nothing. The player picks one of 3 applicants, drawn from these 4 types.

| Tenant | Pays | Wear per minute | Catch |
|---|---|---|---|
| Careful | 85% | 2% | Stays twice as long |
| Average | 100% | 4% | None |
| Rich but late | 130% | 4% | Each minute, 1 in 5 chance of no rent |
| Rough | 140% | 10% | Heavy wear |

Rent level can be changed at any time.

| Level | Rent | Chance of leaving per minute | Tenant usually stays | Wait for new applicants |
|---|---|---|---|---|
| Low | 80% | 3% | 33 minutes | 30 seconds |
| Fair | 100% | 8% | 12 minutes | 60 seconds |
| High | 125% | 20% | 5 minutes | 90 seconds |

- Condition drops only while someone lives there. Each 1% of damage takes 0.5% off rent. Repairs can be made at any
  time and cost the damaged share of the full repair price.
- Each minute of play, each home type's price moves up to 5 points, between 80% and 125% of list price.
- Selling pays the current price, less a 10% fee and the repair cost. It asks for confirmation. Sales do not count
  toward Prestige.
- Rent waits to be collected unless a $100,000 agent is hired. The agent only collects.
- Away: rent arrives like shop income (first minute full, then 25%, up to 2 hours). No wear, departures or price
  changes. High rent counts as Fair, and late payers pay their average.
- A new home has applicants ready at once.
- Prestige closes the business. The Prestige income bonus applies to rent.

## Screens
- Start a business gets a Rental Properties card. The Vault gets a summary card that warns about empty homes.
- Rentals: rent ready, agent, your homes, home prices, homes for sale. The top bar says "Rentals" so it fits small
  phones.
- Tenants: the home, its rent level and the three applicants.
- Home photos are borrowed from Lifestyle until the owner makes new ones.

## Approaches
One design was shown, built the same way as the Taxi Company: its own saved state, rules in `logic.js` and its own
screens in the Vault. Reusing the shop's level system was ruled out because homes have tenants, condition and resale
prices.

## Builder's calls
- Amounts use the game's short form (for example $150.0k), not the full figures in the mockup.
- The Vault button's dot also warns when an empty home has applicants waiting.
- The wait for applicants follows the rent level set when the tenant leaves, and runs on the clock, so it can finish
  while the game is away.
- A late payer's 1 in 5 is rolled when they move in and again after each minute of play.
- Condition and repair prices count the whole points shown on screen, so a fresh repair reads 100%.
