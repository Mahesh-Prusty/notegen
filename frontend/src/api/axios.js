import axios from "axios";

const api = axios.create({
  baseURL: "https://notegen-qmgo.onrender.com/api",
});

export default api;