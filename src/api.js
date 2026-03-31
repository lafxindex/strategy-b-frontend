import axios from "axios";

const API = axios.create({
  baseURL: "https://api.thelafxindex.co.uk/api",
});

export default API;
