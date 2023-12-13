export interface ChowVariety {
  size: number;
  unit: string;
  wholesale_price: number;
  retail_price: number;
  chow_id?: string;
}

export interface ChowFlavour {
  flavour_name: string;
  varieties: ChowVariety[];
  flavour_id?: string;
}

export interface FilteredChowFlavour {
  flavour_name: string;
  varieties: ChowVariety;
  flavour_id?: string;
}

export interface Chow {
  brand: string;
  brand_id?: string;
  flavours: ChowFlavour[];
}
