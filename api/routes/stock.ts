import {
  Chow,
  ChowFlavour,
  ChowFlavourFromSupabasePayload,
  ChowFromSupabase,
  ChowFromSupabasePayload,
} from "../../models/chow";
import { axiosInstance } from "../api";
import { supabase } from "../../utils/supabase";
import { logNewSupabaseError } from "../error";

const TEST_PAYLOAD: ChowFromSupabasePayload = {
  brand_name: "brand 3",
  flavours: [
    {
      varieties: [
        { size: 1, unit: "lb", wholesale_price: 5, retail_price: 15 },
        { size: 2, unit: "lb", wholesale_price: 10, retail_price: 30 },
      ],
      flavour_name: "brand_3_flavour_1",
    },
    {
      varieties: [
        { size: 50, unit: "kg", wholesale_price: 300, retail_price: 450 },
      ],
      flavour_name: "brand_3_flavour_2",
    },
  ],
};

//TODO: Allow us to add multiple flavours and varieties--should be simple, just remove the index part here or check our promise.all logic to see what the shape of our payload looks like
// export const createChow = async () => {
export const createChow = async (chow: ChowFromSupabasePayload) => {
  // const chow = TEST_PAYLOAD;
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .upsert(
      { brand_name: chow.brand_name },
      { ignoreDuplicates: false, onConflict: "brand_name" }
    )
    .select()
    .single();

  if (brandError) {
    logNewSupabaseError("Error creating brand", brandError);
    throw new Error(brandError.message);
  }

  chow.flavours.map(async (flavour) => {
    const { data: chowsTableData, error: chowsTableError } = await supabase
      .from("chows")
      .insert({
        flavour_name: flavour.flavour_name,
        brand_id: brandData.id,
      })
      .select()
      .single();

    if (chowsTableError) {
      logNewSupabaseError(
        "Error adding data to chows table: ",
        chowsTableError
      );
      throw new Error(chowsTableError.message);
    }

    flavour.varieties.map(async (variety) => {
      const { data: chowVarietyData, error: chowVarietyError } = await supabase
        .from("chow_varieties")
        .insert({
          chow_id: chowsTableData.id,
          size: variety.size,
          unit: variety.unit,
          wholesale_price: variety.wholesale_price,
          retail_price: variety.retail_price,
        })
        .select()
        .single();

      if (chowVarietyError) {
        logNewSupabaseError(
          "Error adding data to chow_varieties table: ",
          chowVarietyError
        );
        throw new Error(chowVarietyError.message);
      }

      const { error: chowIntermediaryError } = await supabase
        .from("chow_intermediary")
        .insert({
          flavour_id: chowsTableData.id,
          variety_id: chowVarietyData.id,
          brand_id: brandData.id,
        })
        .select()
        .single();

      if (chowIntermediaryError) {
        logNewSupabaseError(
          "Error adding data to chow_intermediary table: ",
          chowIntermediaryError
        );
        throw new Error(chowIntermediaryError.message);
      }

      const { error: chowDetailsError } = await supabase
        .from("chow_details")
        .insert({ target_group: "", brand_id: brandData.id });

      if (chowDetailsError) {
        logNewSupabaseError("Error Adding Brand details: ", chowDetailsError);
        throw new Error(chowDetailsError.message);
      }
    });
  });

  console.log("Chow created successfully");
};

// TODO: add this functionality
export const createChowFlavour = async (
  brand_id: number,
  flavours: ChowFlavourFromSupabasePayload[]
) => {
  try {
    const response = await axiosInstance.put(`/stock/flavour/${brand_id}`, {
      flavours,
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteChow = async (id: number) => {
  const chow: ChowFromSupabase = await findChow(id);

  const { error: brandDeleteError } = await supabase
    .from("brands")
    .delete()
    .eq("id", id);

  if (brandDeleteError) {
    logNewSupabaseError("Error trying to delete brand: ", brandDeleteError);
    throw new Error(brandDeleteError.message);
  }

  chow.flavours.map(async (flavour) => {
    flavour.varieties.map(async (variety) => {
      const { error: chowIntermediaryDeleteError } = await supabase
        .from("chow_intermediary")
        .delete()
        .eq("variety_id", variety.id);

      if (chowIntermediaryDeleteError) {
        logNewSupabaseError(
          "Error trying to delete from chow_intermediary table: ",
          chowIntermediaryDeleteError
        );
        throw new Error(chowIntermediaryDeleteError.message);
      }
      const { error: varietyDeleteError } = await supabase
        .from("chow_varieties")
        .delete()
        .eq("id", variety.id);

      if (varietyDeleteError) {
        logNewSupabaseError(
          "Error trying to delete from chow_varieties table: ",
          varietyDeleteError
        );
        throw new Error(varietyDeleteError.message);
      }
    });
    const { error: chowsTableDeleteError } = await supabase
      .from("chows")
      .delete()
      .eq("brand_id", id);

    if (chowsTableDeleteError) {
      logNewSupabaseError(
        "Error trying to delete flavour from chows table: ",
        chowsTableDeleteError
      );
      throw new Error(chowsTableDeleteError.message);
    }

    const { error: chowDetailsDeleteError } = await supabase
      .from("chow_details")
      .delete()
      .eq("brand_id", id);

    if (chowDetailsDeleteError) {
      logNewSupabaseError(
        "Error trying to delete from chow_details table: ",
        chowDetailsDeleteError
      );
    }

    console.log("successfully deleted brand with attached flavours/varieties.");
  });
};

export const deleteChowFlavour = async (flavour_id: number) => {
  try {
    const response = await axiosInstance.delete("/stock/flavour", {
      data: {
        flavour_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const deleteChowVariety = async (variety_id: number) => {
  try {
    const response = await axiosInstance.delete("/stock/flavour/variety", {
      data: {
        variety_id,
      },
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateChow = async (id: number, chow: Chow) => {
  try {
    const response = await axiosInstance.put(`/stock/${id}`, chow);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const updateChowFlavour = async (chowFlavour: ChowFlavour) => {
  try {
    const response = await axiosInstance.put("/stock/flavour", chowFlavour);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllChow = async () => {
  const { data, error } = await supabase
    .from("brands")
    .select(
      `
      id,
      brand_name,
    flavours:chows(flavour_id:id, flavour_name, varieties:chow_varieties(*))  
      `
    )
    .returns<ChowFromSupabase[]>();

  if (error) {
    logNewSupabaseError("Error retrieving brands", error);
    throw new Error(error.message);
  }
  return data;
};

export const findChow = async (id: number) => {
  // needs to find our individual chow based on id
  const { data, error } = await supabase
    .from("brands")
    .select(
      `
    id,
    brand_name,
  flavours:chows(flavour_id:id, flavour_name, varieties:chow_varieties(*))  
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    logNewSupabaseError("Error finding chow: ", error);
    throw new Error(error.message);
  }

  return data as ChowFromSupabase;
};

export const findChowFlavour = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/stock/flavour/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const findChowVariety = async (id: number) => {
  try {
    const response = await axiosInstance.get(`/stock/variety/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
