import axios from "axios";
import { env } from "../env/client.mjs";
const BASE_URL = "https://api.printful.com";

const printfulApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    mode: "no-cors",
    Authorization: `Bearer ${env.NEXT_PUBLIC_PRINTFUL_API_TOKEN}`,
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: false,
});

export default printfulApi;
