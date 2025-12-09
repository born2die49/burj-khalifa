import IssueDetails from "@/components/issue/IssueDetails";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Alpha Apartments | Issue Details",
	description:
		"Authenticated users can get the details of the issue they have raised. They can also delete the issue",
};

interface ParamsProps {
	params: {
		id: string;
	};
}

export default function IssueDetailsPage({params}: ParamsProps) {
	return (
    <div>
      <IssueDetails params={params}/>
    </div>
  );
}
