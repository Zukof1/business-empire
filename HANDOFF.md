# Business Empire: handoff

Written 27 November 2026, at the end of a long session. Check anything important against the code.

## Start here

- **Project:** `C:\Users\faizy\.gemini\antigravity\scratch\business-empire`, a phone-first idle business game in plain HTML, CSS and JavaScript.
- **Repo:** `https://github.com/Zukof1/business-empire.git`, branch `main`, level with `origin/main` at `ef58893`.
- **Live site:** `https://business-empire-ashy.vercel.app/` still serves the **old** game. It never saves progress and has no Blackjack Hit button.
- **Nothing from the last session is committed or pushed.** All of it is only in the working tree. Do not commit or push unless the owner asks; suggesting a commit early is sensible.
- **Tests:** `node --test tests/*.test.js` gave **135 passing** (Node 24).
- **Not done:** nothing has been tried on a real phone, and pacing has not been played through.

## What was built (all uncommitted)

1. **Bug fixes:** saving and loading (it never worked before), Blackjack, phone layout, Prestige button, balance colour, `$$` text, roulette image sizes.
2. **Idle earnings, managers, milestones, a deeper dealership and a fairer casino.**
3. **Full redesign:** our own stylesheet replaced Tailwind. Price charts and rank progress added.
4. **Vault dashboard** with per-business screens and **Start a business**.
5. **Capped Retail Shop** and a **Taxi Company**.
6. **Car Dealership** moved from a tab into the Vault; a **Lifestyle** tab took its place.
7. **Photos** for dealer cars, taxis and all Lifestyle items.
8. **In-game confirm box** replacing browser pop-ups.

Designs and plans for items 2, 3, 5 and 6 are in `docs/superpowers/specs/` and `docs/superpowers/plans/`. Where an older document disagrees with a newer one or with the code, the code is current.

## Files

| File | Holds |
|---|---|
| `index.html` | All screens, the inline SVG icon sprite, modals, script tags |
| `styles.css` | Design tokens and components |
| `state.js` | Game state, save, load, autosave, hard reset |
| `logic.js` | Rules and constants (constants are at the top) |
| `ui.js` | Rendering, navigation, confirm box |
| `threeRender.js` | Gold particle background |
| `tests/harness.js` | Loads the game scripts into a Node `vm` context with a small browser stand-in |
| `tests/layout-check.js` | Browser layout check |
| `Assets/cars`, `Assets/lifestyle` | Large originals, **not loaded by the game** |
| `Assets/cars-web`, `Assets/lifestyle-web` | Small copies the game loads |

## Rules of the code

- `window.state` and the `state` variable in `state.js` must stay **the same object**. Load with `Object.assign`, never by replacing it.
- Do not add script files without updating `buildBundle.js`, which lists them by name.
- Bump the `?v=` number on the four script tags when scripts change (currently `v=17`).
- Ask before risky actions with `logic.ask({title, message, yes, danger}, action)`. Never call `confirm()` directly. Re-check conditions inside the action, because the game keeps running while the box is open.
- Time rules: wall-clock timestamps for auctions, demand and shop earnings; taxis use the frame time, capped at 1 second, so they never run while the game is away.
- Element ids are used by tests and by per-frame updates. Rename with care.
- Tapped things are "chunky" buttons, at least 44px. Yellow is the main action, green upgrade or sell, red loss or reset. One blue balance panel per screen. Light blue by day, navy in the casino. Fonts are Baloo 2 and Archivo.
- Files mix line endings and Git warns about CRLF. Keep each file's existing endings when editing by script.

## Current game rules

| Area | Rules |
|---|---|
| Retail Shop | Up to 3, level 10 maximum, $2 a second per level, upgrade costs $100 × level. Manager costs 10 × base price |
| Hidden businesses | Tech Startup, Real Estate Firm and Mega Corporation cannot be started. Ones already in a save keep working, with milestones at levels 5, 10, 15, 20 |
| Time away | First minute at full speed, then 25%, counted up to 2 hours. Shops and older businesses, not taxis. Shown on a welcome-back screen |
| Taxi Company | $10,000. Hatchback $4k, $15/s, 100k km; sedan $20k, $40/s, 300k km; luxury $80k, $200/s, 150k km. 12,500 km a minute. Breakdown odds per minute 20%, 5%, 10%. Repair 10% of price. 3 spaces up to 6 at $25k. Dispatcher $25k |
| Car Dealership | $2,500 license. Common, Rare and Classic cars, inspect 5%, one 50/50 haggle for 10% off, demand 80% to 130% each minute, repair 20%, 30 second auction wait |
| Lifestyle | 12 items in Style, Homes, Toys, Experiences; experiences repeat; kept through prestige; earns nothing |
| Casino | Slots: triple 7s 30×, other triples 10×. Green roulette 14×. Blackjack has double down |
| Prestige | Needs $1M lifetime earnings, adds +10% income |

Exact values are the constants at the top of `logic.js`.

## Checking in the browser

1. Create `.claude/launch.json` with a server named `game`: `python -m http.server 8765 --bind 127.0.0.1`. Start it with the preview tool and **delete the file afterwards**.
2. The browser caches files. Re-fetch changed files with `{cache: 'reload'}` and reload.
3. At each size run `eval(await (await fetch('/tests/layout-check.js',{cache:'no-store'})).text())`. An empty `problems` list passes. Sizes used: 320×568, 360×640, 375×812, 812×375, 1280×800.
4. The check changes game state. Clear `localStorage` afterwards.
5. Screenshots can catch animations mid-way; confirm colours and highlights from the DOM if one looks wrong.

## Photos

The owner makes them in Gemini from prompts we write and saves them under the names we give. Check them for logos, lettering and sparkle marks. Then make 640px-wide JPEG copies (quality 78, optimised, progressive) in the matching `-web` folder with Pillow, leaving originals untouched. The resize script was temporary and may be gone. The roadster copy also has the blue number-plate strip painted out, so keep that copy if regenerating the others. Some Lifestyle originals are WebP data with a `.jpg` name. Photo names: car map in `ui.js` (`CAR_PHOTOS`), `taxi-<type>.jpg`, `<lifestyle id>.jpg`.

## Next work

**Rental Properties**, then **App Studio**. The owner chose these. Rental Properties has only a sketch, which still needs approval before building:

- Opens for $150,000.
- Studio flat $40k, fair rent $60/s, cheap repairs; family house $150k, $250/s, medium; villa $600k, $1,100/s, costly.
- Pick a tenant from three applicants (for example pays more but late, or steady but pays less).
- Rent Low, Fair or High: higher earns more, tenants leave sooner. Empty homes earn nothing.
- Condition wears and lowers rent until repaired. Values rise and fall, so selling can be timed.
- While away, rent arrives at the same reduced rate as shops, with no new problems.

App Studio idea: choose projects, hire developers, gamble on launches.

## Open issues

- A dealership car with no fault always sells at a profit, even at the lowest demand. Lowering minimum demand to 60% was suggested and not answered.
- The Prestige card on Stats says you lose "money, businesses, stocks and cars"; it leaves out taxis and more. The confirm box lists them correctly.
- The green roulette picture has a grey checkerboard baked in.
- `run.bat` opens a missing `expo-app` folder. The owner chose to leave it. `hustler-empire` next door is a separate app.
- `buildBundle.js` embeds only the PNGs at the top of `Assets/`, so car and Lifestyle photos would be missing from a bundle.
- Several generated pictures closely resemble real products (cars, watches). Matters if the game is sold.
- No `.gitignore`, and `node_modules` is committed. Decide whether the large photo originals belong in a commit.
- `README.md`, `test_biz.js` and `test_biz2.js` are out of date.
- The page needs the internet for Three.js and fonts.

## GitHub access

A token was stored in the remote URL. It was removed from the URL, and the only active classic token on the account was deleted. GitHub does not show token values, so it could not be matched for certain. The first push should ask the owner to sign in.

## Working with the owner

- Show options or mockups for look-and-feel choices, and agree rules and prices before building a feature.
- Explain in plain language and keep it short.
- The owner likes to see things on screen, and said "build it" once a short design looked right.
