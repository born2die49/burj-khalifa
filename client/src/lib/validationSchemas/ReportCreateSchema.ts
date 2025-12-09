import * as z from "zod";

export const reportCreateSchema = z.object({
	title: z.string().trim().min(1, "Add your Report title"),
	description: z.string().min(1, "Description of what happened"),
	reported_user_username: z
		.string()
		.min(1, "The Tenant's username is required to identify them"),
});

export type TReportCreateSchema = z.infer<typeof reportCreateSchema>; 