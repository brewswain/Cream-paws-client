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
