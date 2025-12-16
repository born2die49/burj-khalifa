import BookmarkedPostCard from "@/components/cards/BookmarkedPostCard";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Bookmarks",
	description: "Authenticated users can see their bookmarked posts",
};

export default function BookmarkedPostsPage() {
  return (
    <>
      <BookmarkedPostCard />
    </>
  )
}
