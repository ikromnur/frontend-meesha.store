import { useMutation } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type UpdateProfilePayload = {
  username?: string;
  name?: string;
  email?: string;
  phone?: string;
  photo_profile?: File | null;
};

type UseUpdateProfileProps = {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
};

export const UseUpdateProfile = ({
  onSuccess,
  onError,
}: UseUpdateProfileProps) => {
  return useMutation({
    mutationFn: async (payload: UpdateProfilePayload) => {
      // 1. Update Text Data (if any)
      const textData: Record<string, any> = {};
      if (payload.username) textData.username = payload.username;
      if (payload.name) textData.name = payload.name;
      if (payload.email) textData.email = payload.email;
      if (payload.phone) textData.phone = payload.phone;

      let responseData;

      if (Object.keys(textData).length > 0) {
        // Send JSON to /api/profile (Next.js API -> Backend PATCH)
        // Use baseURL: "" to force using Next.js Proxy
        const { data } = await axiosInstance.put("/api/profile", textData, {
          baseURL: "",
        });
        responseData = data.data;
      }

      // 2. Update Photo (if exists)
      if (payload.photo_profile) {
        const formData = new FormData();
        // Backend expects 'photo' field in /api/users/profile/photo
        formData.append("photo", payload.photo_profile);

        // Send FormData to new Next.js API endpoint /api/profile/photo
        // Use baseURL: "" to force using Next.js Proxy
        const { data: photoResponse } = await axiosInstance.post(
          "/api/profile/photo",
          formData,
          {
            baseURL: "",
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        // Use photo response if available (contains updated user with photo)
        if (photoResponse.success) {
          responseData = photoResponse.data;
        }
      }

      return responseData;
    },
    onSuccess,
    onError,
  });
};
