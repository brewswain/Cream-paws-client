interface Customer {
   name: string;
   id: string;
   pets?: [
      {
         name: string;
         breed: string;
      }
   ];
   orders?: OrderWithChowDetails[];
}
