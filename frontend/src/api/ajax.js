import axios from "axios";
import { getConfig } from "../config/config";
const { apiOrigin, audience, scope } = getConfig();

const request = axios.create({

    baseURL: 'https://mineral-catwalk-368610.de.r.appspot.com',

    timeout: 4000,
});

request.interceptors.request.use((config) => {

  let token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

request.interceptors.response.use(
  (res) => {

    return res.data;
  },
  (err) => {

    return err.response.data;
  }
);

export default request;
