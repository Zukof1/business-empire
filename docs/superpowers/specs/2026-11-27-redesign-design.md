# Redesign: mixed style

Approved in chat on 2026-11-27, after mockups of styles B (Tycoon town) and C (Bold and clean).

## Intent
Make every screen feel like a game while keeping figures easy to read on a phone.

## Approach
Replace the Tailwind CDN utility classes with a small stylesheet of our own design tokens and components. Layering
overrides on Tailwind was ruled out (two systems to fight). Behaviour, saves, prices and odds stay as they are.

## Rules
- One blue panel per screen holds the balance in large figures.
- Chunky means tappable: buttons have thick outlines and press down. Information cards stay flat.
- Colour has a job: yellow main action, green upgrade, sell or double, red loss or reset.
- Pale sky by day, deep navy in the casino.
- Baloo 2 for names and buttons, Archivo for figures. Both fall back to system fonts offline.
- Drawn line icons replace most emoji. The roulette tile pictures stay.

## Colours
sky `#e6f4fc`, ink `#14204a`, blue `#2442e0`, yellow `#ffc93c`, green `#35b56a`, red `#ff6b5e`, night `#14123a`.

## New information
Price chart and percentage change per stock, and progress to the next rank.

## Builder's calls
Activity feed shows on the Vault only. Casino games use a compact panel with the back button inside it. The gold
particle background stays. Screen names: Vault, Car lot, Market, Casino, Your empire.

## Constraints
No new script files. Buttons at least 44px. Layout check passes from 360x640 and in landscape. Old saves load.
