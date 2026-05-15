# Risk-tier screen map (PRD #25 / issue #26)

## Full-pass bucket (money, auth, forms, mutations)

| Flow | Rationale |
|------|-----------|
| **Finance** (`FinanceScreen`, itemized breakdown, mass pay modal) | Money movement, courier/warehouse selection, TanStack Query + local selection state |
| **Auth** (`AuthScreen`, sign-in/up/out, current user) | Session boundaries; sign-out must clear client caches |
| **Customers** (list, cards, create modal) | PII + mutations; `useCustomersWithOrdersQuery` drives finance/home |
| **Customer details & edit** | Orders, payments, selection context |
| **Orders** (list, details, create modal) | Money + delivery dates; mutations |
| **Home / Today** (anything using `useCustomersWithOrdersQuery` or order summaries) | Must match canonical customer/order data |

## Shorter-pass bucket

| Flow | Rationale |
|------|-----------|
| **NotFound** | Rare; no money |
| **TabTwo** | Audit for obvious effect loops only unless it gains mutations |

## P0 register (pre–heavy UI work)

| ID | Risk | Status / note |
|----|------|----------------|
| P0-1 | **Unstable empty array** from `useQuery` destructuring (`data: customers = []`) churning `useMemo` deps → possible **maximum update depth** on Finance / Customers / Orders | **Mitigated:** `resolveCustomersQueryData` + `EMPTY_CUSTOMER_LIST` |
| P0-2 | **Linking config** referenced a `Modal` route not present in the stack navigator | **Mitigated:** linking aligned to stack + tabs (see #33) |
| P0-3 | **CustomerDetailsContext** holds selection state; not cleared on logout (Query + Zustand cleared) | **Open / lower:** revisit when auth shell hardens |

## Sign-off

Product owner: add a short **ack comment** on GitHub issue #26 when this map is accepted or amended.
