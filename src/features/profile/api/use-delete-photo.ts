import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type UseDeletePhotoProps = {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
};

export const useDeletePhoto = ({
  onSuccess,
  onError,
}: UseDeletePhotoProps = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Send to Next.js Proxy /api/profile/photo
      // Use baseURL: "" to prevent prepending /api/v1
      const { data } = await axiosInstance.delete("/api/profile/photo", {
        baseURL: "",
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      if (onSuccess) onSuccess();
    },
    onError,
  });
};
