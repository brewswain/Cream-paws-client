interface Customer {
   name: string;
   id: string;
   pets?: [
      {
         name: string;
         breed: string;
      }
   ];
   orders?: [
      {
         delivery_date: string;
         payment_made: boolean;
         payment_date: string;
         is_delivery: boolean;
         driver_paid: boolean;
         quantity: number;
         warehouse_paid: boolean;
         version: number;
         customer_id: string;
         chow_details: {
            id: string;
            brand: string;
            target_group: string;
            flavour: string;
            size: number;
            unit: string;
            wholesale_price: number;
            retail_price: number;
            is_paid_for: boolean;
            version: number;
         };
      }
   ];
}
