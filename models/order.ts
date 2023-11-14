interface Order {
  delivery_date: string;
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
  version?: number;
}

type firstTimeOrder = Omit<Order, "id">;

interface OrderWithChowDetails extends Order {
  chow_details: {
    brand: string;
    target_group: string;
    flavour: string;
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
