import axios from "axios";

export const axiosInstance = axios.create({
   baseURL: "http://ticketing.dev/api",
});
