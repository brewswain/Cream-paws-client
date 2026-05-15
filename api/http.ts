import axios from "axios";

import { attachAxiosErrorInterceptor } from "../lib/api/normalizedHttpError";

export const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "",
  timeout: 60_000,
});

attachAxiosErrorInterceptor(axiosInstance);
