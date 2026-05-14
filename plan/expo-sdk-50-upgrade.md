# Expo SDK 50 upgrade (branch `chore/expo-sdk-upgrade`)

## Done in this branch

- Bumped **Expo** to **~50** and aligned native modules via `npx expo install --fix` (resolved peer issues with Yarn; local `npm install --legacy-peer-deps` also used where npm peer resolution failed).
- **React Native** → **0.73.6** (SDK 50 matrix).
- **jest-expo** → **~50.0.4** (devDependency).
- **expo-linking** v6: `Linking.makeUrl` → **`Linking.createURL`** in `navigation/LinkingConfiguration.ts`.
- **expo-build-properties**: iOS **`deploymentTarget`** raised to **13.4** in `app.json` (required by plugin after upgrade).

## Follow-up before merging

- [ ] Run **`npx expo-doctor`** and fix any **required** items.
- [ ] **`npx expo start`** — cold start, tab navigation, deep link smoke.
- [ ] **Android**: `npx expo run:android` or EAS preview build (see `plan/eas-smoke-checklist.md`).
- [ ] **iOS** (if applicable): same with Xcode 15+ / deployment target 13.4+.
- [ ] Reconcile **lockfiles**: this machine mixed **yarn** (from `expo install --fix`) and **npm** (`--legacy-peer-deps`). Pick one package manager, regenerate a single lockfile, and CI-install from it.
- [ ] **@rneui/themed** vs **@rneui/base** peer mismatch — align versions or keep `legacy-peer-deps` documented for installs.

## References

- [Expo SDK 50 changelog](https://expo.dev/changelog/2024-01-18-sdk-50)
- [Upgrade walkthrough](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)
