import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";
import { SelectedOrder } from "../screens/CustomerDetailsScreen";
import { OrderWithChowDetails } from "../models/order";

interface CustomerDetailsOrders {
  outstandingOrders: OrderWithChowDetails[];
  completedOrders: OrderWithChowDetails[];
}

interface CustomerDetailsContextInterface {
  orders: CustomerDetailsOrders;
  setOrders: Dispatch<SetStateAction<CustomerDetailsOrders>>;
  selectedOrders: SelectedOrder[];
  setSelectedOrders: Dispatch<SetStateAction<SelectedOrder[]>>;
}

export const CustomerDetailsContext =
  createContext<CustomerDetailsContextInterface>({
    orders: {
      outstandingOrders: [],
      completedOrders: [],
    },
    setOrders: () => {},
    selectedOrders: [],
    setSelectedOrders: () => {},
  });

export const CustomerDetailsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [orders, setOrders] = useState<CustomerDetailsOrders>({
    outstandingOrders: [],
    completedOrders: [],
  });
  const [selectedOrders, setSelectedOrders] = useState<SelectedOrder[]>([
    {
      index: 0,
      selected: false,
    },
  ]);

  return (
    <CustomerDetailsContext.Provider
      value={{ orders, setOrders, selectedOrders, setSelectedOrders }}
    >
      {children}
    </CustomerDetailsContext.Provider>
  );
};
