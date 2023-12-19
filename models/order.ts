import { ChowFlavour, FilteredChowFlavour } from "./chow";

interface Order {
  delivery_date: string;
  delivery_cost: number;
  payment_made: boolean;
  payment_date: string;
  is_delivery: boolean;
  driver_paid: boolean;
  quantity: number;
  warehouse_paid: boolean;
  customer_id: string;
  chow_id: string;
  id: string;
  _id?: string;
  order_id?: string;
  flavour_name?: string;
  version?: number;
}

type firstTimeOrder = Omit<Order, "id">;

export interface OrderWithChowDetails extends Order {
  chow_details: {
    brand: string;
    target_group: string;
    flavours: FilteredChowFlavour;
    size: number;
    unit: string;
    wholesale_price: number;
    retail_price: number;
    is_paid_for: boolean;
    version: number;
    warehouse_paid: boolean;
    id: string;
  };
}

interface OrderDetails extends OrderWithChowDetails {
  client_name: string;
}

export interface CombinedOrder {
  delivery_date: string;
  delivery_cost: number;
  orders: {
    chow_id: string;
    quantity: number;
    payment_date: string;
    payment_made: boolean;
    is_delivery: boolean;
    driver_paid: boolean;
    warehouse_paid: boolean;
    customer_id: string;
    chow_details: {
      brand: string;
      target_group: string;
      flavours: FilteredChowFlavour;
      size: number;
      unit: string;
      wholesale_price: number;
      retail_price: number;
      is_paid_for: boolean;
      version: number;
      warehouse_paid: boolean;
      id: string;
    };
    id: string;
    _id?: string;
    order_id?: string;
    flavour_name?: string;
    version?: number;
  }[];
}
