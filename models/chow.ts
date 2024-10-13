export interface ChowVariety {
  size: number;
  unit: string;
  wholesale_price: number;
  retail_price: number;
  chow_id?: string;
  id?: number;
}

export interface ChowFlavour {
  details: {
    flavour_name: string;
    varieties: ChowVariety[];
    flavour_id?: string;
  };
}

export interface FilteredChowFlavour {
  flavour_name: string;
  varieties: ChowVariety;
  flavour_id?: string;
}

export interface Chow {
  id?: string;
  brand_name: string;
  brand_id?: string;
  flavours: ChowFlavour[];
}

export interface ChowFromSupabase {
  id: number;
  brand_name: string;
  flavours: [
    {
      details: {
        varieties: [
          {
            id?: number;
            size: number;
            unit: "lb" | "kg" | "oz";
            chow_id: number;
            retail_price: number;
            wholesale_price: number;
          }
        ];
        flavour_id: number;
        flavour_name: string;
      };
    }
  ];
}

export interface ChowFlavourFromSupabase {
  details: {
    varieties: [
      {
        id?: number;
        size: number;
        unit: "lb" | "kg" | "oz";
        chow_id: number;
        retail_price: number;
        wholesale_price: number;
      }
    ];
    flavour_id: number;
    flavour_name: string;
  };
}
