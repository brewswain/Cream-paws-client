import { getParsedCommandLineOfConfigFile } from "typescript";
import { axiosInstance } from "../api";
import { Chow, ChowFlavour } from "../../models/chow";

export const createChow = async (chow: Chow) => {
  try {
    const response = await axiosInstance.post("/stock", chow);

    return response.data;
  } catch (error) {
    console.error(error);
  }
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
    const response = await axiosInstance.put(`/stock/flavour`, chowFlavour);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getAllChow = async () => {
  try {
    const response = await axiosInstance.get("/stock");

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const findChow = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/stock/${id}`);

    return response.data;
  } catch (error) {
    console.error(error);
  }
};
