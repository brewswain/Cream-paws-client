interface Customer {
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

interface CustomerPayload {
  name: string;
  pets?: any[];
  contactNumber?: string;
  location?: string;
}
