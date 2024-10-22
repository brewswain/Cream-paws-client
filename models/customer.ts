import { OrderFromSupabase } from "./order";

export interface Customer {
  id: number;
  pets?: [
    {
      name: string;
      breed: string;
    }
  ];
  contactNumber?: string;
  location?: string;
  name?: string;
  city?: string;
  orders?: OrderFromSupabase[];
}

export interface CustomerPayload {
  name: string;
  pets?: any[];
  city?: string;
  contactNumber?: string;
  location?: string;
}
