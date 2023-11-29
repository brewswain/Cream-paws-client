import axios from "axios";

export const axiosInstance = axios.create({
  // baseURL: "http://192.168.101.118:3000/api",
  baseURL: "https://cream-paws-api.vercel.app/api",
});
