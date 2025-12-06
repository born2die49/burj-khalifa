import * as z from "zod";

export const apartmentCreateSchema = z.object({
	unit_number: z.string().trim().min(1, "An apartment unit number is required"),
	building: z.string().trim().min(1, "An building name is required"),
	floor: z
		.number()
		.nonnegative({ message: "The building floor can't ne negative" })
		.max(100, { message: "The Floor in the building can't be more than 100" }),
});

export type TApartmentCreateSchema = z.infer<typeof apartmentCreateSchema>