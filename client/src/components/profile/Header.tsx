"use client";

import { useGetUserProfileQuery } from "@/lib/redux/features/users/usersApiSlice";
import { useTheme } from "next-themes";
import Image from "next/image";
import ProtectedRoute from "../shared/ProtectedRoutes";

function HeaderContent() {
	const { data } = useGetUserProfileQuery();
	const { theme } = useTheme();
  const profile = data?.profile;

  return (
    <div className="flex flex-col gap-2">
      <div className="border-pumpkin mx-auto size-32 overflow-hidden rounded-full border-4 object-cover">
        <Image 
          src={
            profile?.avatar || (theme === "dark" ? "/assets/icons/user-profile-circle.svg" : "/assets/icons/user-profile-light-circle.svg" )
          }
          alt="Profile image"
          width={128}
          height={128}
        />
      </div>
      <div className="flex flex-col items-center justify-center space-y-3">
        <h1 className="font-robotoSlab dark:text-platinum text-5xl">
          {profile?.full_name}
        </h1>
        <p className="dark:text-lime-500">@{profile?.username}</p>
      </div>
    </div>
  );
}

export default function Header() {
	return (
    <ProtectedRoute>
      <HeaderContent />
    </ProtectedRoute>
  );
}
