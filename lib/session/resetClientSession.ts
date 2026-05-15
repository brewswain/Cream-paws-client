import { queryClient } from "../queryClient";
import { useFinanceStore } from "../../store/financeStore";
import { useOrderStore } from "../../store/orderStore";
import { useTodaysOrdersStore } from "../../store/todaysOrdersStore";

type PersistedClientStore = {
  persist: { clearStorage: () => Promise<void> };
  setState: (partial: Record<string, unknown>) => void;
};

function asPersisted(store: unknown): PersistedClientStore {
  return store as PersistedClientStore;
}

/**
 * Clears TanStack Query cache and client-side persisted UI/session stores after
 * logout (or equivalent hard session end). Call only after server sign-out
 * succeeds if sessions must stay aligned with the backend.
 */
export async function resetClientSession(): Promise<void> {
  queryClient.clear();

  const finance = asPersisted(useFinanceStore);
  const orders = asPersisted(useOrderStore);
  const todays = asPersisted(useTodaysOrdersStore);

  await Promise.all([
    finance.persist.clearStorage(),
    orders.persist.clearStorage(),
    todays.persist.clearStorage(),
  ]);

  finance.setState({ showModal: false, targetIds: [] });
  orders.setState({
    orders: [],
    customerOrders: [],
    outstandingOrders: [],
    completedOrders: [],
    isFetching: false,
    error: null,
    selectedOrderIds: [],
  });
  todays.setState({
    todaysOrders: {},
    outstandingOrders: [],
    completedOrders: [],
    customersCollapsed: true,
    ordersCollapsed: true,
    isFetching: false,
    error: null,
  });
}
