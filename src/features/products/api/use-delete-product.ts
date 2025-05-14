import { axiosInstance } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";

interface UseDeleteProductProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const UseDeleteProduct = ({
  onError,
  onSuccess,
}: UseDeleteProductProps = {}) => {
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axiosInstance.delete(`/products/${id}`);
      return data.data;
    },
    onError,
    onSuccess,
  });
};
