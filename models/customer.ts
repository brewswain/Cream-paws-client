import { OrderWithChowDetails } from "./order";

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
  orders?: OrderWithChowDetails[];
}

export interface CustomerPayload {
  name: string;
  pets?: any[];
  city?: string;
  contactNumber?: string;
  location?: string;
}
