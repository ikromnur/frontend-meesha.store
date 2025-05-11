"use client";

import UnauthorizePage from "../unauthorize";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profileSchema,
  ProfileFormValues,
} from "@/features/profile/form/profile";
import ProfileForm from "@/features/profile/components/profile-form";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data: session } = useSession();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: session ? session?.user.username : "",
      name: session ? session?.user?.name : "",
      email: session ? session.user?.email : "",
      nohp: session ? session.user?.nohp : "",
      photo_profile: null,
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form Data:", data);
  };

  if (!session) {
    return <UnauthorizePage />;
  }

  return (
    <FormProvider {...form}>
      <ProfileForm onSubmit={onSubmit} />
    </FormProvider>
  );
};

export default ProfilePage;
