import { http } from "@/api/http";

export const ProductService = {
  getAll() {
    return http.get("/products");
  },
  getById(id: string) {
    return http.get(`/products/${id}`);
  },
};
