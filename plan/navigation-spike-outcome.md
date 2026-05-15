# Navigation spike outcome (PRD #25 / issue #27)

## Options compared

| Criterion (weight: primary) | **React Navigation 6 (current baseline)** | **Expo Router** |
|----------------------------|---------------------------------------------|-----------------|
| Deep links (`expo-linking` prefixes + `LinkingConfiguration`) | Already wired for Home, Customers, Orders, Finance, Auth, NotFound | Rebuild route tree as files; remap all paths |
| Auth-gated navigation | Implemented imperatively today; patterns known | File-based layouts need explicit `(auth)` groups / redirects |
| Push notification taps (future) | Handlers resolve to `navigationRef` or `linkTo` — well-documented RN pattern | Supported; requires adopting Router’s URL model end-to-end |
| Migration cost (secondary) | **Low:** incremental root swap + area migrations | **High:** mechanical move of every screen + param typing shift |

## Recommendation

**Stay on React Navigation 6** for the planned “root swap once, then migrate by area” PRD. The codebase already has **working linking config** and **native stack + tabs**; the main risk called out in the PRD (push / deep link / auth fidelity) is best addressed by **hardening linking + auth guards** in place first.

**Revisit Expo Router** if you later need universal links at scale, web deployment sharing the same route tree, or a greenfield rewrite where migration cost is amortized.

## Follow-ups (not blocking)

- Align `LinkingConfiguration` with actual stack screen names (e.g. `Modal` vs stack).
- When push is added, add one integration test path that opens a cold-start URL and an auth-gated URL.
