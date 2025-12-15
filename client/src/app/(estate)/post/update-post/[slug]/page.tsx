import { AuthFormHeader } from "@/components/forms/auth";
import UpdatePostForm from "@/components/forms/update-post/UpdatePostForm";

interface UpdatePostProps {
  params: {
    slug: string;
  }
}

export default function UpdatePostPage({params}: UpdatePostProps) {
  return (
    <div>
      <AuthFormHeader title="Update Post" staticText="Want to go back?" linkHref="/welcome" linkText="Back to Posts"/>
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-lightGrey dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
          <UpdatePostForm params={params}/>
        </div>
      </div>
    </div>
  )
}
