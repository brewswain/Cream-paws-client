import { OrderWithChowDetails } from "./order";

export interface Customer {
  id: string;
  pets?: [
    {
      name: string;
      breed: string;
    }
  ];
  contactNumber?: string;
  location?: string;
  name?: string;
  orders?: OrderWithChowDetails[];
}

export interface CustomerPayload {
  name: string;
  pets?: any[];
  city?: string;
  contactNumber?: string;
  location?: string;
}
