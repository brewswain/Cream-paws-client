export interface ChowVariety {
  size: number;
  unit: "lb" | "kg";
  wholesale_price: number;
  retail_price: number;
  chow_id?: string;
  target_group: string;
}

export interface ChowFlavour {
  flavour_name: string;
  varieties: ChowVariety[];
  flavour_id?: string;
}

export interface Chow {
  brand: string;
  target_group: string;
  brand_id: string;
  flavours: ChowFlavour[];
}
