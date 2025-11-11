import * as z from "zod"

export const passwordResetRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .email({message: "Enter an email address"})
    .toLowerCase(),
  });

export type TPasswordResetRequestSchema = z.infer<typeof passwordResetRequestSchema>;