import axios from "axios";
import { baseUrl } from "../api";

export const signUp = async (email: string, password: string) => {
   axios.post(`${baseUrl}/users/signup`, { body: { email, password } });
};

export const signIn = async (email: string, password: string) => {
   axios.post(`${baseUrl}/users/signin`, { body: { email, password } });
};

export const signOut = async () => {
   axios.post(`${baseUrl}/users/signout`);
};

export const getCurrentUser = async () => {
   axios.get(`${baseUrl}/users/currentuser`);
};
