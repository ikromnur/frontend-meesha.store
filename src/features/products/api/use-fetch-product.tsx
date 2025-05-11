import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

interface UseFetchProductProps {
  id: string;
  onError?: (e: Error) => void;
}

export const UseFetchProduct = ({ id, onError }: UseFetchProductProps) => {
  return useQuery({
    queryKey: ["productId", id],
    queryFn: async () => {
      try {
        const { data } = await axiosInstance.get(`/products/${id}`);
        return data.data;
      } catch (error) {
        if (onError && error instanceof Error) {
          onError(error);
        }
        console.error(error);
        throw error;
      }
    },
    enabled: !!id,
  });
};
