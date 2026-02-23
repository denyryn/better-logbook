import axios from "axios";
import { config } from "./config";

export const api = axios.create({
  baseURL: "/",
  headers: {
    "Content-Type": "application/json",
    origin: config.app.url,
  },
});
