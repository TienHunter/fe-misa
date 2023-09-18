// src/api/axios.js
import axios from "axios";
import VueCookies from "vue-cookies";
// const BASE_URL = "https://cukcuk.manhnv.net/api/v1/";
// const BASE_URL = "https://localhost:7030/api/v1/"; // misa
const BASE_URL = "https://localhost:44318/api/v1/"; // iis
const instance = axios.create({
  baseURL: BASE_URL, // Thay thế bằng URL của API thực tế
  // Các cấu hình khác của Axios
  headers: {
    "Access-Control-Allow-Origin": "*", // Hoặc chỉ định nguồn gốc cụ thể của bạn
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = VueCookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
