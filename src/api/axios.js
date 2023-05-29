// src/api/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://cukcuk.manhnv.net/api/v1/", // Thay thế bằng URL của API thực tế
  // Các cấu hình khác của Axios
  headers: {
    "Access-Control-Allow-Origin": "*", // Hoặc chỉ định nguồn gốc cụ thể của bạn
  },
});

export default instance;
