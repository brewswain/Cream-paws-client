import axios from "axios";
import { axiosInstance } from "../api";

export const signUp = async (email: string, password: string) => {
   try {
      const response = await axiosInstance.post("/users/signup", {
         email,
         password,
      });

      return response;
   } catch (error) {
      alert(error);
   }
};

export const signIn = async (email: string, password: string) => {
   try {
      const response = await axiosInstance.post("/users/signin", {
         email,
         password,
      });

      return response;
   } catch (error) {
      alert(error);
   }
};

export const signOut = async () => {
   try {
      const response = await axiosInstance.post("/users/signout");

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const getCurrentUser = async () => {
   const response = await axiosInstance.get("/users/currentuser");
   return response;
};
