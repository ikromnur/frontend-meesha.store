import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { ProductSchema } from "../form/product";

interface UseCreateProductProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const UseCreateProduct = ({
  onError,
  onSuccess,
}: UseCreateProductProps = {}) => {
  return useMutation({
    mutationFn: async (product: ProductSchema) => {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("price", String(product.price));
      formData.append("stock", String(product.stock));
      formData.append("description", product.description);

      if (product.imageUrl instanceof File) {
        formData.append("imageUrl", product.imageUrl);
      }

      formData.append("size", product.size);

      formData.append("variant", JSON.stringify(product.variant));

      formData.append("category", JSON.stringify(product.category));
      formData.append("type", JSON.stringify(product.type));
      formData.append("objective", JSON.stringify(product.objective));
      formData.append("color", JSON.stringify(product.color));


      const { data } = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return data.data;
    },
    onError,
    onSuccess,
  });
};
