# PRD: Cream Paws Client — Chow Removal, HTTP-First Data, Forms, and Expo Upgrade

## Problem Statement

The mobile app still contains **defunct dog chow / stock** functionality end to end, while the **replacement API and database** are already live without chow. That mismatch creates dead code, confusing navigation, and maintenance risk.

The app is **buggy around orders and forms**: edge cases when editing orders lead to **wrong payloads** or inconsistent UI state. **Loading states** are uneven; performance feels **lopsided** in places.

Data access is **split**: some flows read through **direct database client** joins while others use **HTTP**, which encourages **different shapes** for the same entities and makes **type safety** and testing harder.

The team wants a **clean, functional UI**, **consistent forms**, **runtime-validated API contracts**, **optimistic updates with clear success/failure feedback**, and a **safe upgrade** to the **latest Expo** without losing stability. **Authentication is intentionally deprioritized** for a very small trusted userbase but will return later with a specific model.

---

## Solution

Deliver the work in **three ordered milestones**:

1. **Remove chow domain entirely** from the client (navigation, screens, state, local API surface, and types that only exist for chow), aligned with the **chow-free** server contract.

2. **Unify domain data on HTTP** to the singleton server: **TanStack Query** for server state (cache, invalidation, retries), **Zustand** for ephemeral UI state, **Zod (or equivalent) schemas** at the HTTP boundary, **React Hook Form + zodResolver** on touched screens, **optimistic mutations** with **rollback**, **`react-native-toast-message`** for **success and failure**, and **first-class handling of HTTP 409** on order updates (refetch, form reset from server, specific copy).

3. **Upgrade Expo** (and aligned React Native / tooling) **after** the domain and transport layers are stable, so failures are easier to attribute.

During milestone 2, **new and refactored screens** standardize on **Native Base** for layout and inputs. **Authentication UI and gating are commented out or removed from the navigation root** so the app **opens directly into the main experience** for the trusted userbase. **Future authentication** will follow **Supabase Auth in the app + JWT verification on the server** (not in this delivery).

Vertical slices: each migrated area ships **HTTP + boundary schemas + forms + tests** together so payload and UI state do not drift.

---

## User Stories

1. As an **operator**, I want **no Stock or chow-related tabs or screens**, so that I am not confused by defunct product areas.

2. As an **operator**, I want **order and customer flows to match the live API**, so that I never send **chow** fields the server no longer accepts.

3. As an **operator**, I want **customer lists and details to load via the same HTTP API** the server documents, so that **read shapes** match **write/update** shapes.

4. As an **operator**, I want **pets** associated with customers to remain manageable **through the server’s customer/pet model**, so that customer detail and edit flows stay coherent (including create/list/find pet where applicable).

5. As an **operator**, I want **creating an order** to enforce **non-empty `services`** per server rules, so that invalid orders fail fast with a clear message.

6. As an **operator**, I want **editing an order** to always send the **current `version`**, so that **optimistic locking** works and I do not silently overwrite someone else’s change.

7. As an **operator**, when the server returns **409 Conflict** on an order update, I want the **form to reset from fresh server data** and a **clear explanation**, so that I understand the record changed and I am not stuck with a stale draft.

8. As an **operator**, I want **successful saves** to show a **short success toast**, so that I get confirmation without hunting for subtle UI changes.

9. As an **operator**, I want **failed saves** to show a **failure toast** after the UI **rolls back** optimistic changes, so that I know the app state matches the server again.

10. As an **operator**, I want to **retry a failed action** by performing the edit again (no special retry button in v1), so that behavior stays predictable.

11. As an **operator**, I want **consistent loading skeletons or placeholders** on migrated screens, so that the app feels stable rather than flickering empty states.

12. As an **operator**, I want **orders and finance-related lists** to benefit from **query caching**, so that returning to a screen does not always refetch unnecessarily.

13. As an **operator**, I want **mutations to feel instant** where safe (**optimistic updates**), so that routine toggles and edits feel responsive.

14. As an **operator**, I want **Native Base–based** forms on migrated screens, so that controls and spacing feel consistent on new work.

15. As an **operator**, I want **no login wall** in this phase, so that I reach the main app immediately (trusted deployment).

16. As a **developer**, I want **strict TypeScript** and **schema-validated JSON** at the API boundary, so that contract drift is caught early.

17. As a **developer**, I want **automated tests for schemas and mutation/query helpers** per slice, so that regressions in payload mapping are caught in CI.

18. As a **developer**, I want **RTL tests** for flows that historically broke (especially **order edit**), so that UX regressions are guarded where they hurt most.

19. As a **developer**, I want a **small set of deep modules** (HTTP client, schemas, query hooks, conflict handling, toast side-effects) that are easy to unit test, so that screens stay thin.

20. As a **maintainer**, I want **chow stores, contexts, skeleton varieties, and modals removed** rather than left half-dead, so that grep stays clean.

21. As a **maintainer**, I want **local mock/stock HTTP routes for chow removed**, so that the client does not pretend chow still exists.

22. As an **operator**, I want **customer creation** to remain smooth with validated payloads, so that bad input is caught before a round trip.

23. As an **operator**, I want **customer update** to use the same field naming the server expects, so that partial edits do not corrupt records.

24. As an **operator**, I want **order deletion** flows to invalidate the right queries, so that lists update without ghost rows.

25. As an **operator**, I want **today’s orders / dashboard-style views** (where present) to use **shared query keys**, so that one mutation updates every visible list.

26. As an **operator**, I want **finance-related order queries** migrated to HTTP where they today depend on legacy paths, so that reporting matches the server.

27. As an **operator**, I want **order detail** views to parse **camelCase API DTOs** consistently (per server mappers), so that labels and edits line up.

28. As an **operator**, I want **delivery date and payment fields** on orders to validate with schemas, so that impossible combinations are blocked client-side when possible.

29. As an **operator**, I want **`services` lines** on an order to be modeled consistently in forms, so that add/remove line UX matches the API’s array semantics.

30. As a **developer**, I want **wire format documented per route** (including places where request bodies use different casing conventions than response DTOs), so that Zod schemas encode the truth.

31. As a **developer**, I want **centralized error mapping** from HTTP status codes to user-facing messages, so that toasts stay consistent.

32. As an **operator**, I want **no references to “chow”** in user-visible copy on migrated surfaces, so that the product language matches reality.

33. As an **operator**, I want **itemized lists and cards** that referenced chow details to show **order/service-appropriate** summaries instead, so that order history remains readable.

34. As a **maintainer**, I want **navigation types** updated when routes are removed, so that deep links and params stay type-safe.

35. As a **maintainer**, I want **linking configuration** updated when screens disappear, so that cold starts do not route to dead paths.

36. As an **operator**, I want **edit customer** pet rows to remain usable under Native Base after refactor, so that multi-pet households keep working.

37. As a **developer**, I want **Expo upgrade** to happen only after HTTP migration stabilizes, so that native upgrade issues are isolated.

38. As a **developer**, I want **EAS / OTA scripts** revalidated post-upgrade, so that release channels keep working.

39. As an **operator**, I want **performance-sensitive lists** to avoid redundant work (memoization, stable keys, query stale times tuned per entity), so that scrolling stays smooth after the refactor.

40. As a **developer**, I want **jest** to cover pure functions (schema fixtures, conflict handler, query key helpers), so that tests run fast.

41. As a **developer**, I want **toast side-effects injectable or mockable** in tests, so that mutation helpers do not spam real toasts under test.

42. As an **operator**, I want **modals for create/edit order** to reset dirty state when closed or on successful save, so that stale drafts do not leak into the next open.

43. As an **operator**, I want **driver/warehouse paid toggles** (or equivalents) to map cleanly to API booleans, so that financial flags stay trustworthy.

44. As a **maintainer**, I want **deprecated UI libraries** not expanded on touched screens, so that Native Base becomes the default without forcing an immediate repo-wide delete of other providers.

45. As a **future operator**, when **auth returns**, I want a **clear place** to reintroduce gating behind **Supabase session + server JWT checks**, so that security work is incremental.

46. As a **developer**, I want **environment-based base URLs** for the API client, so that dev/staging/prod are explicit.

47. As an **operator**, I want **network errors** to still toasts with rollback for optimistic mutations, so that offline or flaky connectivity is honest.

48. As a **developer**, I want **409 handling** covered by unit tests (simulate mutation error with status 409), so that invalidate/refetch/reset orchestration does not regress.

49. As a **maintainer**, I want **Supabase client** narrowed to **non-domain concerns** (or removed if unused) after migration, so that “HTTP-only domain” is real, not aspirational.

50. As a **developer**, I want **order create/update schemas** to include **`version` rules** exactly as the server enforces, so that type errors reflect API errors.

51. As an **operator**, I want **consistent empty states** on migrated lists, so that zero rows does not look like a crash.

52. As a **developer**, I want **React Query Devtools** optional in dev builds only, so that cache inspection helps without shipping to production.

53. As an **operator**, I want **date fields** to display in a consistent locale-aware format on migrated screens, so that scheduling stays readable (without mandating a full i18n framework in this PRD).

54. As a **maintainer**, I want **dead test files** removed or replaced when features go away, so that `npm test` stays meaningful.

55. As a **developer**, I want **shared query invalidation lists** per entity (customer, order), so that optimistic updates do not miss a dependent screen.

56. As an **operator**, I want **customer detail** to refetch after order mutations that affect aggregates shown there, so that counts and summaries stay fresh where designed.

57. As a **developer**, I want **migration slices ordered** by risk (e.g. orders after customers, or the inverse if dependency graph demands), so that each PR stays reviewable.

58. As a **maintainer**, I want **package bloat reviewed** after Expo upgrade (duplicate UI libs noted as long-term debt), so that install size trends improve over time.

59. As an **operator**, I want **no half-implemented Suspense** in the first slices unless stable with the chosen data library, so that loading UX stays predictable (Suspense can follow once patterns are proven).

60. As a **stakeholder**, I want a **single document** (this PRD) to align engineers on **milestones, testing bar, and out-of-scope auth**, so that agents and humans implement the same plan.

---

## Implementation Decisions

### Milestones and sequencing

- **Milestone 1 — Chow removal:** Remove chow/stock user journeys, related navigation entries, modals, cards, skeleton varieties, client-side stock HTTP surface, and chow-specific types. Remove providers that only exist to feed chow data at the app root when nothing else needs them.

- **Milestone 2 — HTTP-first domain + forms + server state:** Move **customers, orders, pets, and finance-facing reads** that today use **direct table access** onto **HTTP** against the singleton server. Introduce **TanStack Query** for reads and mutations with **cache keys**, **invalidation**, and **optimistic updates** where appropriate. Keep **Zustand** for **ephemeral UI** (sheet open, draft UI flags) but not as the primary source of server truth.

- **Milestone 3 — Expo upgrade:** Upgrade the Expo SDK and aligned dependencies using official upgrade guidance; revalidate dev client, native builds, and OTA scripts.

### Deep modules (encapsulate complexity; stable interfaces)

1. **HTTP client module** — Base URL from environment, JSON handling, timeout policy, and normalized errors `{ status, code, body, message }` for upper layers.

2. **Resource schemas module (Zod)** — One schema per **response DTO** and per **request body** shape, matching the **actual wire format** per route (not assumed camelCase if a route expects snake_case fields). Export **inferred types** from schemas to avoid duplicate manual interfaces.

3. **Repository functions** — Thin async functions that call the HTTP client and return **parsed** data (`parse` / `safeParse` policy decided per environment; at minimum **parse in development** and **strict handling in production** for mutations).

4. **Query layer** — `QueryClient` setup, **query key factories** (`orders.detail(id)`, `customers.list()`, etc.), and **hooks** (`useOrder`, `useOrders`, `useUpdateOrder`, …) colocated so screens do not compose URLs inline.

5. **Mutation orchestration** — Shared helpers for **optimistic cache updates**, **rollback on error**, and **toast emission** (success on settle, error on failure). Toast adapter should be **swappable** for tests.

6. **Conflict coordinator (orders)** — On **HTTP 409** from order update: **cancel optimistic state**, **invalidate** affected queries, **await refetch** of the canonical order, **push fresh values into the form** (integration point with RHF `reset`), and emit the **specific toast** (“stale / changed elsewhere”).

7. **Forms kit on touched screens** — **React Hook Form** + **`zodResolver`** using the **same** Zod shapes as mutation bodies where possible (single source of truth). **Native Base** components for inputs on those screens.

8. **Navigation shell** — After chow removal and auth deferral, **root route** goes to the **main app** without an auth gate. Types for stacks/tabs updated accordingly.

### API contract alignment

- Treat the server as **greenfield**: **no chow-related fields** anywhere in payloads.

- **Order updates require `version`**; **409** means **stale version** — client must run the **conflict coordinator** flow (not a generic toast-only path).

- **Order create** requires **`services` as a non-empty array** per server validation.

- **Customer and pet** shapes follow server mappers (camelCase in typical API projections); **request bodies** follow each route’s documented shape — schemas must be generated or maintained against **live** route behavior, including any **snake_case request** vs **camelCase response** differences.

### Authentication

- **Current delivery:** Remove or comment out **auth flows and gating**; app **boots into main UI**.

- **Future delivery (explicit intent):** **Supabase Auth** in the client and **JWT verification** on the server for protected routes — **out of scope** for this PRD’s primary milestones except **coordination items** called out in Further Notes.

### UI

- **Native Base** is the **default** for **new and touched** screens. **Do not introduce new patterns** from other UI kits on those screens. **Removing** other global providers entirely is **not required** in milestone 2 if it risks churn; **containment** is acceptable until a later consolidation epic.

### Observability and UX polish

- Use **`react-native-toast-message`** globally for mutation success/failure notifications.

- **Skeletons:** Reuse or simplify existing skeleton utilities on migrated screens; align **loading** UX with **query pending/fetching** states. Full **Suspense-for-data** is **optional** and should only land where proven stable with React Native + the data library.

### Expo

- Defer until milestone 2 complete; follow Expo’s upgrade checklist and reconcile **native modules** (Reanimated, Screens, Safe Area, etc.) per the target SDK matrix.

### Modules to modify (high level, no paths)

- Navigation and linking, app root providers, customer and order screens and modals, order/finance/customer stores, shared order utilities, customer detail context, skeleton generators, type definitions for navigation params, and API entrypoints that today re-export chow or mixed transports.

### Schema snippet (decision-rich; from server behavior)

Order update rejects missing version:

```text
IF body.version is null/undefined → 400 "version is required for optimistic locking"
UPDATE ... WHERE id = :id AND version = :clientVersion
IF no row updated → 409 "Conflict: order was modified or version is stale"
ELSE → 200 with updated order DTO (camelCase projection)
```

Order create rejects invalid services:

```text
IF services missing or empty array → 400 "services must be a non-empty array of service lines"
```

---

## Testing Decisions

### What makes a good test

- Prefer tests that pin **observable contracts**: **HTTP status handling**, **parsed DTOs**, **mutation cache behavior**, and **form reset after conflict** — not snapshot tests of entire screens unless high value.

- Avoid asserting **implementation details** (private hook internals) when **public helpers** or **query/mutation** wrappers can be tested directly.

### Modules to test (minimum per vertical slice)

- **Zod schemas** with **valid and invalid fixtures** per resource (customer, order, pet payloads, list responses).

- **Mutation helpers** and **conflict coordinator**: simulate **409**, assert **invalidate + refetch + reset payload** contract (using mocked query client).

- **Order edit flows** (and any historically buggy flow): **React Native Testing Library** acceptance tests where regression risk is high.

### Prior art

- The repo currently has **minimal** automated UI coverage; one **styled text** smoke-style test exists. New tests should follow **Jest** + **jest-expo** preset already configured in the project.

---

## Out of Scope

- **Full authentication** implementation (**Supabase Auth + server JWT middleware**) in this PRD’s primary delivery — planned as a **follow-on**.

- **Offline mutation queue** and **automatic retry UI** beyond **manual user retry** after toast + rollback.

- **OpenAPI codegen** or a **shared npm package** for types between repos — optional future improvement unless the team adopts a monorepo.

- **Repo-wide removal** of **UI Kitten** or other legacy UI providers in one go — **containment** on touched screens is enough for this phase.

- **Global Suspense** data loading as a mandatory standard before patterns are validated.

- **Internationalization framework** rollout — only **consistent formatting choices** on migrated screens unless explicitly added later.

---

## Further Notes

- **Publishing:** This PRD is stored in-repo under `plan/prd.md`. If the team uses GitHub Issues, create an issue from this document and apply the label **`ready-for-agent`** when that label exists in the repository.

- **Server coordination:** The singleton server currently applies **`currentUserMiddleware`** from a shared package. With **auth disabled on the client**, the **server** may still require a valid user context for some routes — align with the server owner on a **temporary dev/staging behavior** (e.g. stub user, relaxed middleware, or public read-only mode) so HTTP migration is not blocked.

- **Wire casing:** Some order routes accept **snake_case** fields in JSON bodies while list/detail projections may use **camelCase** per mappers — the **schema module** is the canonical place to encode that, not tribal knowledge in screens.

- **Module boundary check-in:** Owners should confirm the **deep modules** list (HTTP client, schemas, query hooks, conflict coordinator, toast adapter) matches how they want the codebase split; adjust names/folders to team conventions without changing the responsibilities.

---

## Issue tracker

**Label:** `ready-for-agent` (apply when creating the tracking issue).

**Note:** No project-specific triage vocabulary file was present in the repository; labels must match those configured on GitHub.
