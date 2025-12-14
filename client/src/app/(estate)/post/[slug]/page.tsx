import PostDetails from "@/components/post/PostDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Post Details",
	description: "Authenticated users can the details of a post",
};

interface ParamsProps {
	params: {
		slug: string;
	};
}

export default function PostDetailPage({ params }: ParamsProps) {
	return (
		<>
			<PostDetails params={params} />
		</>
	);
}
