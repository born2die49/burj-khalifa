import * as z from "zod";

export const ratingCreateSchema = z.object({
	rated_user_username: z.string().trim(),
	rating: z
		.number()
		.nonnegative({ message: "Rating can not be negative" })
		.min(1)
		.max(5),
	comment: z.string().min(1, "Give us more context about your experience"),
});

export type TRatingCreateSchema = z.infer<typeof ratingCreateSchema>;
