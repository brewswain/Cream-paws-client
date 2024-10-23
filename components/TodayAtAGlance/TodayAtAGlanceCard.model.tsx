import { Customer } from "../../models/customer";
import { CombinedOrder, OrderWithChowDetails } from "../../models/order";

export interface ChowInfo {
  quantity: number;
  details: {
    brand: string;
    flavour: string;
    size: number;
    unit: string;
    order_id: number;
  };
}

export type CollapsibleTargets =
  | "unpaidOrders"
  | "unpaidStock"
  | "completedOrders"
  | "completedStock";

export type OrdersMap = {
  unpaidOrders: OrderWithChowDetails[] | CombinedOrder[];
  completedOrders: OrderWithChowDetails[] | CombinedOrder[];
};

export type CustomersMap = {
  outstandingCustomers: Customer[];
  completedCustomers: Customer[];
};

export type ChowMap = {
  outstandingChow: ChowInfo[];
  completedChow: ChowInfo[];
};

export type TodaysOrderState = {
  collapsed: {
    title: string;
    isCollapsed: boolean;
  }[];
  orders: OrdersMap;
  customers: CustomersMap;
  chow: ChowMap;
};

export type TodaysOrderDispatch =
  | {
      type: "collapsed";
      target: CollapsibleTargets;
    }
  | {
      type: "orders";
      orders: OrderWithChowDetails | CombinedOrder;
      target: keyof OrdersMap;
    }
  | {
      type: "customers";
      customers: Customer;
      target: keyof CustomersMap;
    }
  | {
      type: "chow";
      chow: ChowInfo;
      target: keyof ChowMap;
    };
