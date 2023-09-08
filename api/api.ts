import axios from "axios";

// TODO: replace this with hosted api route when deployed
export const axiosInstance = axios.create({
  // baseURL: "http://192.168.101.118:3000/api",
  baseURL: "https://cream-paws-server.onrender.com/api",
});
