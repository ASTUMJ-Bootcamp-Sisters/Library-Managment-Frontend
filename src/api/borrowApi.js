import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

// attach JWT token
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// For student (my borrowed books)
export const getMyBorrows = () => API.get("/borrow/my-borrows");

// For admin (all borrowed books)
export const getAllBorrows = () => API.get("/borrow/all-borrows");
