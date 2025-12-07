import { AuthFormHeader } from "@/components/forms/auth";
import CreateIssueForm from "@/components/forms/report-issue/CreateIssueForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Burj Khalifa | Report Issue",
	description:
		"Tenants can report any issues to the apartment regards to their apartments",
};

export default function ReportIssue() {
	return (
		<div>
			<AuthFormHeader title="Report an Issue with your apartment" />
			<div className="mt-7 sm:mx-auto sm:w-full sm:max-w-[480px]">
				<div className="bg-slate-100 dark:bg-deepBlueGrey rounded-xl px-6 py-12 shadow sm:rounded-lg sm:px-12 md:rounded-3xl">
					<p className="dark:text-pumpkin text-2xl">
						<CreateIssueForm />
					</p>
				</div>
			</div>
		</div>
	);
}
