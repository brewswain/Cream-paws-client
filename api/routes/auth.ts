import axios from "axios";
import { baseUrl } from "../api";

export const signUp = async (email: string, password: string) => {
   try {
      const response = await axios.post(
         "http://ticketing.dev/api/users/signup",
         {
            email,
            password,
         }
      );

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const signIn = async (email: string, password: string) => {
   try {
      const response = await axios.post(
         `http://ticketing.dev/api/users/signin`,
         {
            email,
            password,
         }
      );

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const signOut = async () => {
   try {
      const response = await axios.post(
         `http://ticketing.dev/api/users/signout`
      );

      return response.data;
   } catch (error) {
      alert(error);
   }
};

export const getCurrentUser = async () => {
   const response = await axios.get(
      `http://ticketing.dev/api/users/currentuser`
   );
   return response.data;
};
// http://192.168.100.193:3000/api/users/currentuser
