import { getParsedCommandLineOfConfigFile } from "typescript";
import { Chow, ChowFlavour } from "../../models/chow";
import { axiosInstance } from "../api";
import { supabase } from "../../utils/supabase";

export const createChow = async (chow: Chow) => {
  const { data: brandData, error: brandError } = await supabase
    .from("brands")
    .upsert(
      { brand_name: chow.brand },
      { ignoreDuplicates: false, onConflict: "brand_name" }
    )
    .select()
    .single();

  if (brandError) {
    console.error("Error creating brand", brandError);
    throw new Error(brandError.message);
  }

  const { data: chowsTableData, error: chowsTableError } = await supabase
    .from("chows")
    .insert({
      flavour_name: chow.flavours[0].flavour_name,
    })
    .select()
    .single();

  if (chowsTableError) {
    console.error("Error adding data to chows table: ", chowsTableError);
    throw new Error(chowsTableError.message);
  }

  const { data: chowVarietyData, error: chowVarietyError } = await supabase
    .from("chow_varieties")
    .insert({
      chow_id: chowsTableData.id,
      size: chow.flavours[0].varieties[0].size,
      unit: chow.flavours[0].varieties[0].unit,
      wholesale_price: chow.flavours[0].varieties[0].wholesale_price,
      retail_price: chow.flavours[0].varieties[0].retail_price,
    })
    .select()
    .single();

  if (chowVarietyError) {
    console.error(
      "Error adding data to chow_varieties table: ",
      chowVarietyError
    );
    throw new Error(chowVarietyError.message);
  }
  console.log({
    flavour_id: chowsTableData.id,
    variety_id: chowVarietyData.id,
  });

  const { error: chowFlavourVarietiesError } = await supabase
    .from("chow_flavour_varieties")
    .insert({
      flavour_id: chowsTableData.id,
      variety_id: chowVarietyData.id,
    })
    .select()
    .single();

  if (chowFlavourVarietiesError) {
    console.error(
      "Error adding data to chow_flavour_varieties table: ",
      chowVarietyError
    );
    throw new Error(chowFlavourVarietiesError.message);
  }

  const { error: chowDetailsError } = await supabase
    .from("chow_details")
    .insert({ target_group: "", brand_id: brandData.id });

  console.log("Chow created successfully");
};

export const createChowFlavour = async (
  brand_id: string,
  flavours: ChowFlavour[]
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

export const deleteChow = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/stock/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const deleteChowFlavour = async (flavour_id: string) => {
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

export const updateChow = async (id: string, chow: Chow) => {
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
  const { data, error } = await supabase.from("brands").select(
    `
      id,
      brand_name,
    flavours:chow_flavour_varieties (details:chows(flavour_id:id, flavour_name, varieties:chow_varieties(*))  )
      `
  );

  if (error) {
    console.error("Error retrieving brands", error);
    throw new Error(error.message);
  }
  return data;
};

// export const getAllChow = async () => {
//   // Retrieve brands data
//   const { data: brandData, error: brandError } = await supabase
//     .from("brands")
//     .select(
//       `id,
//       brand_name
//       `
//     )
//     .order("brand_name");

//   if (brandError) {
//     console.error("Error retrieving brand", brandError);
//     throw new Error(brandError.message);
//   }

//   // Retrieve chows data with corresponding flavor IDs and variety IDs
//   const { data: chowsData, error: chowsError } = await supabase
//     .from("chows")
//     .select(
//       `
//       id,
//       flavour_name`
//     )
//     .order("flavour_name");

//   if (chowsError) {
//     console.error("Error retrieving chows", chowsError);
//     throw new Error(chowsError.message);
//   }

//   const { data: chowVarietyData, error: chowVarietyError } = await supabase
//     .from("chow_varieties")
//     .select(
//       `      id,
//       size,
//       unit,
//       wholesale_price,
//       retail_price,
//       chow_id`
//     )
//     .order("size");

//   if (chowVarietyError) {
//     console.error("Error retrieving chow Varieties", chowVarietyError);
//     throw new Error(chowVarietyError.message);
//   }

//   const { data: brandChowDetailData, error: brandChowDetailError } =
//     await supabase
//       .from("chow_details")
//       .select(`id, target_group, brand_id`)
//       .order("brand_id");

//   if (brandChowDetailError) {
//     console.error("Error retrieving chow details", brandChowDetailError);
//     throw new Error(brandChowDetailError.message);
//   }

//   const { data: chowFlavourVarietyData, error: chowFlavourVarietyError } =
//     await supabase
//       .from("chow_flavour_varieties")
//       .select(`id, flavour_id, variety_id`)
//       .order("flavour_id");

//   if (chowFlavourVarietyError) {
//     console.error("Error retrieving chow Varieties", chowFlavourVarietyError);
//     throw new Error(chowFlavourVarietyError.message);
//   }

//   // Create an array of complete Chow objects
//   const chows = chowsData.map((chow) => ({
//     id: chow.id,
//     brand_id: null, // Set to null for now
//     flavours: [
//       {
//         flavour_name: chow.flavour_name,
//         flavour_id: chow.id,
//         varieties: chowVarietyData
//           .filter((variety) => variety.chow_id === chow.id)
//           .map((variety) => ({
//             id: variety.id,
//             size: variety.size,
//             unit: variety.unit,
//             wholesale_price: variety.wholesale_price,
//             retail_price: variety.retail_price,
//           })),
//       },
//     ],
//   }));

//   // // Add brand ID and target group details to each Chow object
//   const mergedChows = chows.map((chow) => {
//     const brandDetail = brandChowDetailData.find(
//       (detail) => detail.brand_id === brandData[0].id
//     );
//     return {
//       ...chow,
//       flavour_id: brandDetail ? brandDetail.id : null,
//     };
//   });

//   // // Add chow variety IDs to each Chow object
//   const updatedChows = mergedChows.map((chow) => ({
//     ...chow,
//     flavours: [
//       {
//         flavour_id: chow.flavours[0].flavour_id,
//         flavour_name: chow.flavours[0].flavour_name,
//         varieties: [
//           chowVarietyData.find((variety) => variety.chow_id === chow.id),
//         ],
//       },
//     ],
//   }));

//   // // Add brand ID to each Chow object
//   const finalChows = updatedChows.map((chow) => ({
//     ...chow,
//     brand: brandData[0].brand_name,
//     brand_id: brandData[0].id,
//   }));

//   return finalChows;
// };

export const findChow = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/stock/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const findChowFlavour = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/stock/flavour/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const findChowVariety = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/stock/variety/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
