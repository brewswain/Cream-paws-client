interface Order {
   delivery_cost: number;
   delivery_date: Date;
   driver_paid: boolean;
   payment_made: boolean;
   // Maybe put payment_date and delivery_date in separate object
   payment_date: Date;
   quantity: number;
   warehouse_paid: boolean;
}
