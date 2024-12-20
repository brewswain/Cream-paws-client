import { ChowFlavour, FilteredChowFlavour } from "./chow";
import { Customer } from "./customer";

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

export interface ChowDetails {
  brand: string;
  target_group: string;
  flavours: FilteredChowFlavour | ChowFlavour;
  size: number;
  unit: string;
  wholesale_price: number;
  retail_price: number;
  is_paid_for: boolean;
  delivery_cost?: number;
  version: number;
  warehouse_paid: boolean;
  id: string;
  brand_id?: string;
}
export interface OrderWithChowDetails extends Order {
  chow_details: ChowDetails;
}

interface OrderDetails extends OrderWithChowDetails {
  client_name: string;
}

export interface CombinedOrder {
  delivery_date: string;
  delivery_cost: number;
  name?: string;
  client_name?: string;
  customer_id: string;
  orders: {
    chow_id: string;
    quantity: number;
    delivery_cost?: number;
    payment_date: string;
    payment_made: boolean;
    is_delivery: boolean;
    driver_paid: boolean;
    warehouse_paid: boolean;
    customer_id: string;
    chow_details: {
      brand: string;
      target_group: string;
      brand_id?: string;
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

export interface OrderPayload {
  brand_id: number;
  flavour_id: number;
  variety_id: number;
  quantity: number;
  customer_id: number;
  delivery_date: string;
  delivery_cost: number;
  payment_date: number;
  payment_made: boolean;
  is_delivery: boolean;
  driver_paid: boolean;
  warehouse_paid: boolean;
  retail_price: number;
  wholesale_price: number;
}

export interface OrderFromSupabase {
  id: number;
  is_delivery: boolean;
  delivery_date: string;
  delivery_cost: number;
  payment_made: boolean;
  payment_date: string;
  retail_price: number;
  wholesale_price: number;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  customer_id: number;
  flavours: {
    details: {
      flavour_id: number;
      flavour_name: string;
    };
    brand_details: { id: number; name: string };
  };
  variety: {
    id: number;
    size: number;
    unit: "lb" | "kg" | "oz";
    chow_id: number;
    retail_price: number;
    wholesale_price: number;
  };

  customers: { name: string };
}
export interface OrderFromSupabasePayload {
  id: number;
  is_delivery: boolean;
  delivery_date: string;
  delivery_cost: number;
  payment_made: boolean;
  payment_date: string;
  retail_price: number;
  wholesale_price: number;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  customer_id: number;
  flavours: {
    details?: {
      flavour_id: number;
      flavour_name: string;
    };
    brand_details: { id: number; name: string };
  };
  variety?: {
    id: number;
    size: number;
    unit: "lb" | "kg" | "oz";
    chow_id: number;
    retail_price: number;
    wholesale_price: number;
  };

  customers: { name: string };
}

export interface TodaysOrder {
  id: number;
  is_delivery: boolean;
  delivery_date: string;
  delivery_cost: number;
  payment_made: boolean;
  payment_date: string;
  retail_price: number;
  wholesale_price: number;
  quantity: number;
  driver_paid: boolean;
  warehouse_paid: boolean;
  customer_id: number;
  flavours: {
    details: {
      flavour_id: number;
      flavour_name: string;
    };
    brand_details: { id: number; name: string };
  };
  variety: {
    id: number;
    size: number;
    unit: "lb" | "kg" | "oz";
    chow_id: number;
    retail_price: number;
    wholesale_price: number;
  };

  customers: Customer;
}

export interface OrdersByCustomer {
  [key: string]: TodaysOrder[];
}
