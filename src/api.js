import axios from "axios";

const API = axios.create({
  baseURL: "http://161.35.45.169:5000/api",
});

export default API;
