# PRD: Post-migration stability, API errors, and driver UI

## Problem Statement

The Cream Paws mobile client has been upgraded to a modern Expo SDK, but several foundations still behave like an older app: React state and effects can misbehave (including suspected render/update loops around finance breakdowns), API failures surface as vague or unhelpful messages while debugging information is scattered, and the UI stacks multiple component paradigms that are hard to evolve toward a clean, driver-friendly experience. The primary user is a **driver** (and related operational roles): they need reliable money and order flows, trustworthy error feedback, and forms that make required fields and multi-step data entry obvious—without sacrificing maintainability for future customization.

## Solution

Deliver work in **three ordered phases**: (1) stabilize React and client-side state patterns, with a **risk-based audit** (full attention on **money, authentication, and forms**; lighter pass elsewhere) and fixes that align server data with **TanStack Query**, UI session and drafts with a **small Zustand** surface, and elimination of render-depth / effect feedback issues; (2) harden the **shared HTTP layer** so failures produce **categorized user-facing copy** (preferring structured server messages when safe) while **centralizing structured logging** in one place; (3) **replace the root navigation implementation once**, migrate **by functional area in small increments**, and modernize UI—especially **forms**—using **react-hook-form** and **Zod**, optimized for **large tap targets** and simple navigation. A **short navigation spike** decides between **Expo Router** and **React Navigation–centric** setups based primarily on **push notification taps, deep links, and auth redirects**, secondarily on migration cost. **Logout and hard session end** clear **both** TanStack Query cache and Zustand state. **Production log redaction** is explicitly deferred. Testing follows a **pragmatic mix**: unit tests around error mapping and tricky data hooks, plus a **minimal E2E smoke** suite for authentication, one money-critical path, and one multi-step form path (tooling chosen during implementation).

## User Stories

1. As a **driver**, I want the **Finance** views to load and refresh **without runaway re-renders or update-depth errors**, so that I can trust balances and fee breakdowns on the road.
2. As a **driver**, I want **courier fee** and **warehouse payment** breakdowns to stay **in sync with the order list** from the server, so that I never pay against stale rows.
3. As a **driver**, I want **checkbox selection** for mass actions to reset predictably when the underlying order set changes, so that I do not submit the wrong IDs.
4. As a **driver**, I want a **clear blocking state** when finance data cannot load at all, so that I do not think a zero balance is “everything paid.”
5. As a **driver**, I want **non-blocking toasts** for recoverable finance refresh issues, so that I can retry without a wall of technical text.
6. As a **driver**, I want a **blocking modal** only when I truly cannot continue without refetched data, so that I am not interrupted for minor glitches.
7. As a **warehouse or ops user**, I want **warehouse totals** (subtotal, VAT, total) to remain readable and consistent with line items, so that reconciliation is straightforward.
8. As a **driver**, I want **mass payment confirmation** to reflect exactly the orders I selected, so that I have confidence before committing money movement.
9. As a **driver**, I want **Home** and **Today at a glance** style summaries to reflect the same canonical customer/order data as detail screens, so that I do not chase contradictions.
10. As a **driver**, I want **customer list** loading to be stable when switching tabs or returning from background, so that the app feels solid during a shift.
11. As a **driver**, I want **customer details** to open quickly and show the same pets and orders I expect from the list, so that I can answer customer questions on site.
12. As a **driver**, I want **editing a customer** to preserve in-progress edits when I navigate within the flow, so that I do not lose partial work.
13. As a **driver**, I want **required fields** on customer and pet forms to be visually obvious, so that I complete intake the first time.
14. As a **driver**, I want to **add multiple pets** to a new customer without awkward workarounds, so that household reality matches the record.
15. As a **driver**, I want **validation errors from the server** mapped to the correct fields when possible, so that I fix problems directly where they occur.
16. As a **driver**, I want a **short summary of validation issues** at the top of long forms, so that I can scan what is wrong before scrolling.
17. As a **driver**, I want a **toast** when a form submission fails for a generic reason, so that I know the save did not go through even if fields are unclear.
18. As a **driver**, I want **orders list** interactions (view, update status where applicable) to avoid redundant refetches that cause flicker or loops, so that the experience feels calm.
19. As a **driver**, I want **order details** to show stable monetary formatting, so that I can communicate amounts accurately.
20. As a **driver**, I want **authentication** (sign in, sign up, sign out) to leave no stale customer or order data behind, so that the next session starts clean.
21. As a **driver**, I want **session expiry** to behave like a controlled logout from my perspective, so that I am not staring at a broken half-authenticated UI.
22. As a **driver**, I want **deep links** (and future push notification taps) to land on the correct screen with correct parameters after auth, so that operational links actually save time.
23. As a **driver**, I want **back navigation** to make sense after completing payment or saving a customer, so that I do not get trapped in stacks.
24. As a **driver**, I want **large, thumb-friendly controls** on primary actions (pay, save, submit, sign in), so that gloves or motion do not cause mis-taps.
25. As a **driver**, I want **consistent spacing and typography** after the UI phase, so that scanning dense operational data is easier.
26. As a **maintainer**, I want a **single HTTP client configuration** that all API modules use, so that retries, timeouts, and headers stay consistent.
27. As a **maintainer**, I want **Axios errors normalized** into a small internal shape (status, code, category, safe user text, correlation fields), so that screens do not each re-parse errors differently.
28. As a **maintainer**, I want **one canonical log emission** on failed requests with stable fields (method, path, status, response snippet, request id if present), so that debugging stays uniform without removing existing observability habits.
29. As a **maintainer**, I want **user-visible API messages** to pass through a **plain-text sanitizer** (strip tags-like content, collapse whitespace, enforce max length), so that we never accidentally render unsafe or huge blobs.
30. As a **maintainer**, I want **category fallbacks** (offline, unauthorized, server, validation, unknown) when the server does not provide a trustworthy string, so that UX stays calm and consistent.
31. As a **maintainer**, I want **TanStack Query** to own cached server entities, so that Zustand does not silently fork “truth.”
32. As a **maintainer**, I want **Zustand** limited to **UI session state** and **unsubmitted multi-step drafts**, so that mental models stay simple.
33. As a **maintainer**, I want **logout** to clear **both** query cache and Zustand stores that can contain session-linked UI or drafts, so that privacy and correctness hold.
34. As a **maintainer**, I want **query defaults** tuned for React Native (no surprise refetch on resume unless explicitly desired per query), so that backgrounding does not hammer the API.
35. As a **maintainer**, I want **mutation flows** to invalidate or update the correct query keys after customer/order changes, so that lists and finance totals converge automatically.
36. As a **maintainer**, I want **finance selection state** derived or keyed in a way that avoids render feedback loops between effects, queries, and child lists, so that “maximum update depth” class bugs do not return.
37. As a **maintainer**, I want **navigation structure** documented after the spike (chosen baseline, auth gate pattern, modal strategy), so that future screens land consistently.
38. As a **maintainer**, I want **root navigation replaced once** and then **migrated by area** in reviewable steps, so that we avoid an unmergeable long branch even though user traffic is currently low.
39. As a **maintainer**, I want **UI kit consolidation** planned as part of the UI phase (rather than incremental mixing without strategy), so that theming and accessibility fixes pay down debt instead of adding it.
40. As a **maintainer**, I want **jest tests** around the error normalizer and any non-trivial query/mutation hooks, so that refactors do not regress messaging or cache behavior silently.
41. As a **maintainer**, I want a **tiny E2E smoke suite** runnable in CI for auth, one finance/payment path, and one multi-pet customer creation path, so that broad integration stays guarded as navigation changes.
42. As a **maintainer**, I want **React Query Devtools** (or equivalent) gated appropriately for development builds only, so that production stays lean.
43. As a **product owner**, I want a **signed-off risk map** listing screens in the **full pass** bucket versus **shorter pass** before deep fixes spread, so that audit scope matches business risk.
44. As a **product owner**, I want **P0 issues** from the audit (data loss, money miscalculation risk, auth bypass, silent failures) fixed before heavy UI restyling, so that we do not polish broken flows.
45. As a **driver**, I want **accessible contrast** on finance and order totals after the UI refresh, so that outdoor glare does not hide critical numbers.
46. As a **driver**, I want **empty states** that explain what to do next (e.g., no unpaid courier fees), so that blank screens are not ambiguous.
47. As a **driver**, I want **loading skeletons or clear spinners** that do not layout-shift violently, so that the UI feels modern and controlled.
48. As a **driver**, I want **errors on read-only lists** to offer **retry**, so that transient network issues are one tap to recover from.
49. As a **driver**, I want **order conflict** or business-rule errors (where the app already distinguishes them) to surface with actionable wording, so that I can change selection or timing instead of guessing.
50. As a **maintainer**, I want **API base URL misconfiguration** (empty or unreachable host) to produce a specific category message, so that environment mistakes are obvious in the field.
51. As a **maintainer**, I want **timeouts** configured deliberately (or explicitly defaulted with documented behavior), so that hung requests do not feel like infinite loading.
52. As a **driver**, I want **customer search or filtering** (if present in the flow) to remain responsive after state refactors, so that high-volume days stay manageable.
53. As a **maintainer**, I want **context providers** audited so that high-frequency updates do not force entire navigators to re-render unnecessarily, so that performance stays predictable.
54. As a **maintainer**, I want **version label** behavior preserved or improved during navigation changes, so that beta testers always know what build they are on.
55. As a **driver**, I want **sign up and sign in** forms to show the same modern validation style as customer forms after the UI phase, so that the product feels cohesive.
56. As a **maintainer**, I want **Supabase** usage (if overlapping REST calls) to remain coherent with session boundaries, so that we do not duplicate auth truth in conflicting places.
57. As a **maintainer**, I want **patch-package** maintenance called out when upgrades touch patched dependencies, so that upgrades do not silently drop fixes.
58. As a **driver**, I want **finance mode switching** (courier vs warehouse) to keep selections sane, so that I do not carry irrelevant checked rows across modes.
59. As a **maintainer**, I want **telemetry hooks** (even if minimal initially) considered without breaking the logging centralization decision, so that future observability has a clear insertion point.
60. As a **maintainer**, I want **documentation** updated only where it materially helps onboarding (navigation decisions, error taxonomy, session reset), so that knowledge matches the new baseline without unnecessary prose.

## Implementation Decisions

- **Phased delivery:** Phase 1 React/state stability → Phase 2 HTTP error surfacing and logging → Phase 3 navigation and UI modernization. No phase reordering without explicit replanning.
- **Risk-based audit (Phase 1):** Produce a **signed-off map** classifying flows into **full review** (money, authentication, forms, and anything that performs mutating API operations combined with naming heuristics) versus **shorter review** elsewhere. Complete shallow findings before broad deep fixes outside P0 hotspots.
- **State architecture:** Use **TanStack Query** as the sole cache for **server-backed entities** (customers, orders, combined list queries, etc.). Use **Zustand** for **ephemeral UI session** and **unsubmitted multi-step drafts** only—not as a mirror of API entities.
- **Finance stability:** Rework finance breakdown **selection and list synchronization** so order identity drives rendering; avoid patterns where child checkbox updates and parent effects mutually trigger unbounded updates. Prefer **derived keys** or **stable memoized structures** over blind `useEffect` resets where they fight user input or query churn.
- **HTTP layer:** Extend the shared Axios instance with **interceptors** (or equivalent centralized wrapper) that: attach consistent metadata logging on errors; normalize failures into an internal discriminated result; and optionally attach auth headers if not already centralized.
- **User-facing error policy:** Prefer **server-provided user strings** when present in a known JSON shape; otherwise map to **small stable categories** (offline/unreachable, unauthorized, validation, server, unknown). Never render HTML/markdown from errors. Apply **plain-text sanitation** and **maximum length** before display.
- **Surfacing policy:** Non-form failures use **toast** for soft issues and **blocking modal** when the screen cannot function without data. Form failures use **top summary**, **per-field** mapping when reliable, and **toast** for generic submission failure.
- **Logging policy:** Emit structured failure logs from **one canonical place** in the HTTP stack; screens may add contextual breadcrumbs but must not be the only failure observability path. **Production redaction** of sensitive payloads is explicitly **out of scope for the first HTTP delivery** and scheduled later.
- **Session reset:** On logout and on hard session invalidation paths, **clear TanStack Query cache** and **reset Zustand stores** that may hold drafts or session UI, then navigate to authentication as appropriate.
- **Navigation:** Run a **time-boxed spike** comparing **Expo Router** vs **React Navigation–first** architecture using **push/deep-link/auth redirect fidelity** as the primary decision criterion and **migration cost** as secondary. After choice, perform **single root navigator replacement**, then migrate stacks/tabs **by functional area** in incremental merges.
- **Forms modernization:** Standardize on **react-hook-form** with **Zod** resolvers for new or rewritten forms; unify compulsory-field affordances and multi-pet customer creation UX while preserving existing business rules.
- **UI consolidation:** Phase 3 may **replace component library choices** and simplify the current mix of UI paradigms, prioritizing **driver ergonomics** (tap targets, spacing rhythm, readable finance tables) and **code-level customization** (tokens/themes rather than one-off styles).
- **Deep modules to privilege:**
  - **HTTP error normalizer** — single exported function or small module translating Axios failures into `{ category, userMessage, logDetails }` with pure, testable logic.
  - **Canonical request logger** — one function invoked from interceptors so log field names stay stable over time.
  - **Session reset orchestrator** — one entry point used by logout and auth failure handlers to clear caches and client stores in the right order.
- **Repository facts informing scope:** The app already ships **TanStack Query**, **Zustand**, **react-hook-form**, and **Zod** dependencies; navigation today is **React Navigation 6** with a **linking configuration** module; finance combines **query data**, **local checkbox state**, **focus refetch**, and **persisted finance UI store**—a convergence hotspot for the audit.

## Testing Decisions

- **Good tests** assert **observable outcomes** (normalized error category and message, cache cleared after session reset, query invalidation causing refetch) rather than private hook implementations—though hook tests are acceptable when they simulate the query client and MSW-style HTTP fakes.
- **Modules prioritized for automated tests:** HTTP error normalizer; session reset orchestrator; customer/order mutation hooks that encode invalidation rules; finance selection helpers if extracted as pure functions.
- **Prior art:** Jest with **jest-expo** preset already exists; follow patterns from existing HTTP and customer tests that mock the shared Axios instance.
- **E2E:** No Maestro/Detox scaffolding is present yet; add **one** tool during implementation and cover **authentication**, **one finance/payment-related path**, and **one multi-step customer/pet form path** as smoke only—defer broad E2E coverage.

## Out of Scope

- **Production log PII redaction** and advanced security hardening of log payloads (explicitly later).
- **Backend API contract changes** except coordinated ones discovered as strictly necessary (prefer client adaptation first).
- **Full design-system production** (marketing site, brand refresh) beyond mobile UI needs.
- **Complete migration of every screen to new visual components in one release**—incremental area migration is expected after root navigation swap.
- **Analytics/telemetry productization** beyond leaving clean insertion points.
- **Offline-first sync architecture** and local database caching of server entities in Zustand.

## Further Notes

- No `CONTEXT.md` or `docs/adr` directory was found in this repository; domain language is taken from existing screens and modules (customers, orders, courier/warehouse finance, Cream Paws beta labeling).
- Current HTTP bootstrap is minimal (base URL only); most error UX improvement will come from **new cross-cutting behavior** rather than scattered string edits.
- GitHub issue **#25** carries this PRD as the implementation tracking artifact and should retain the **`ready-for-agent`** label for downstream automation.
