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
   id?: string;
   version?: number;
}

interface OrderWithChowDetails {
   id: string;
   version: number;
   delivery_date: string;
   payment_made: boolean;
   payment_date: string;
   is_delivery: boolean;
   quantity: number;
   driver_paid: boolean;
   warehouse_paid: boolean;
   customer_id: string;
   chow_id: string;
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
