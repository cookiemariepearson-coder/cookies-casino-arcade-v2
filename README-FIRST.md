# Cookie's Casino Arcade V2 — Build 1

This is the clean modular rebuild.

## Structure
- `index.html` contains only the application shells and modal shells.
- `styles/app.css` controls the visual system.
- `js/` contains login, routing, wallet, audio, and app coordination.
- `games/` contains one independent file per game.
- `api/` and `lib/` contain Vercel/Supabase secure backend functions.

## Deploy
1. Create a brand-new empty GitHub repository named `cookies-casino-arcade-v2`.
2. Extract this ZIP.
3. Upload every file and folder inside the extracted folder to the repository root.
4. Import the repository into Vercel with Framework Preset **Other**.
5. Add the three Supabase environment variables shown in `.env.example`.
6. Run `supabase_setup.sql` in the same Supabase project.
7. Redeploy.

## Build 1 scope
This build establishes the stable architecture and includes playable foundation versions of all eight games.
Build 2 will polish each game's rules, animation, voice, and Stripe Coin Store.


## Build 2
Preserves the V2 layout and upgrades sign-in flow, audio, the 4x2 lobby, game animations, timers, turn visibility, and coin rewards.
