// src/api/axios.js
import axios from "axios";
const BASE_URL = "https://cukcuk.manhnv.net/api/v1/";
// const BASE_URL = " http://localhost:3000/";
const instance = axios.create({
  baseURL: BASE_URL, // Thay thế bằng URL của API thực tế
  // Các cấu hình khác của Axios
  headers: {
    "Access-Control-Allow-Origin": "*", // Hoặc chỉ định nguồn gốc cụ thể của bạn
  },
});

export default instance;
