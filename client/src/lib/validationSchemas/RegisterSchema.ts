import * as z from "zod"

const usernameRegx = /^[a-zA-Z0-9_@+._]/;

export const registerUserSchema = z.object({
  username: z
    .string()
    .regex(usernameRegx, {
    message: "Usernames can only contain uppercase, lowercase letters, digits, @, -, _, +, and .",
  }),
  first_name: z
    .string()
    .trim()
    .min(2, {message: "First name must be at least 2 characters long"}).max(50, {message: "First name must be maximum 50 characters long"}),
  last_name: z
    .string()
    .trim()
    .min(2, {message: "Last name must be at least 2 characters long"}).max(50, {message: "Last name must be maximum 50 characters long"}),
  email: z
    .string()
    .trim()
    .email({message: "Enter a valid email address"}),
  password: z
    .string()
    .min(8, {message: "Password must be at least 8 characters long"}),
  re_password: z
    .string()
    .min(8, {message: "Confirm password must be at least 8 characters long"}),
  }).refine((data) => data.password === data.re_password, {
    message: "Passwords do not match",
    path: ["re_password"]
  });

export type TRegisterUserSchema = z.infer<typeof registerUserSchema>;