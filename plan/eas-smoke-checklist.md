# EAS / native smoke checklist (post–Expo SDK bump)

Use this after upgrading Expo / native deps on a branch (e.g. `chore/expo-sdk-upgrade`). Record **pass/fail** and short notes per row.

## Preconditions

- [ ] `EXPO_PUBLIC_API_URL` (or equivalent) points at a **known-good** API for the build profile you are testing.
- [ ] EAS logged in: `eas whoami`.
- [ ] No uncommitted native changes you did not intend (or `expo prebuild` clean run documented).

## Install & static checks (local)

- [ ] `npm ci` or `yarn install` (match lockfile in CI).
- [ ] `npx tsc --noEmit`
- [ ] `npx jest --watchAll=false`
- [ ] `npx expo-doctor` — note any **required** fixes before shipping.

## Dev client / Metro (quick)

- [ ] `npx expo start` — app loads, no redbox on cold start.
- [ ] Navigate: **Home → Customers → Orders → Finance** — no crash.
- [ ] **Create customer** modal — save, list refreshes, success toast.
- [ ] **Order details** — edit quantity/price, **Update**; if API returns **409**, form resets and stale toast appears.
- [ ] **Create order** — save, orders/customers lists refresh.

## Android (preview / dev build)

- [ ] `eas build -p android --profile preview` (or team profile) **succeeds**.
- [ ] Install artifact; cold start OK.
- [ ] Same navigation smoke as above.
- [ ] Date picker on **order detail** / modals opens and confirms.
- [ ] Back gesture / hardware back does not leave blank routes.

## iOS (if applicable)

- [ ] `eas build -p ios --profile preview` **succeeds** (certs/profiles valid).
- [ ] Install via TestFlight or ad hoc; cold start OK.
- [ ] Same navigation + order edit smoke as Android.

## OTA / update channel (if used)

- [ ] `eas update --branch <branch> --message "smoke"` (or project script) **succeeds**.
- [ ] Client on that channel receives update; restart shows new JS bundle.
- [ ] Rollback path documented (previous channel / republish).

## Regression spot-checks (HTTP + cache)

- [ ] Customer list + detail show **consistent** orders after order create/update/pay flows.
- [ ] Finance **courier / warehouse** toggles still refetch after bulk pay (no stuck checkboxes after refresh).
- [ ] No stray **Supabase** calls for **orders/customers** in dev tools / network (only allowed auth/non-domain if any).

## Sign-off

- [ ] Build links (EAS) attached to release note or PR.
- [ ] Failures: link to logs + **blocking** vs **follow-up** decision recorded.
