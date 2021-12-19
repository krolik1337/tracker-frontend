import axios from "axios";
export default axios.create({
  baseURL: "http://localhost:2137",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});