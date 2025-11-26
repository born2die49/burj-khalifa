import { AuthFormHeader } from "@/components/forms/auth";


export default function EditProfilePage() {
	return (
    <div>
      <AuthFormHeader title="Update Profile"/>
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadows sm:rounded-lg sm:px-12 md:rounded-3xl">
          <h1 className="dark:text-babyPowder text-6xl"></h1>
        </div>
      </div>
    </div>
  )
}
