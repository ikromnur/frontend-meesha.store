import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

export type ProfileData = {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  photo_profile: string | null;
  role: string;
};

export const UseGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      // Use baseURL: "" to force using Next.js Proxy instead of direct Backend URL
      const { data } = await axiosInstance.get("/api/profile", { baseURL: "" });
      return data.data as ProfileData;
    },
  });
};
