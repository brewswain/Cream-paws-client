import axios from "axios";

// TODO: replace this with hosted api route when deployed
export const axiosInstance = axios.create({
  baseURL: "https://server-singleton-production.up.railway.app/api",
});
