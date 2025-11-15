"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Contact2Icon, MailIcon, UserCheck2 } from "lucide-react";
import { useRegisterUserMutation } from "@/lib/redux/features/auth/authApiSlice";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
	registerUserSchema,
	TRegisterUserSchema,
} from "@/lib/validationSchemas";
import { extractErrorMessage } from "@/utils";
import { toast } from "react-toastify";
import { FormFieldComponent } from "@/components/forms/FormFieldComponent";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/shared/Spinner";

export default function RegisterForm() {
	const [registerUser, { isLoading }] = useRegisterUserMutation();
	const router = useRouter();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<TRegisterUserSchema>({
		resolver: zodResolver(registerUserSchema),
		mode: "all",
		defaultValues: {
			username: "",
			first_name: "",
			last_name: "",
			email: "",
			password: "",
			re_password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof registerUserSchema>) => {
		try {
			await registerUser(values).unwrap();
			toast.success(
				"An activation email has been sent to your email. Please check your email and activate your account.",
			);
			router.push("/login");
			reset();
		} catch (e) {
			const errorMessage = extractErrorMessage(e);
			toast.error(errorMessage || "An error occured");
		}
	};

	return (
		<main>
			<form
				noValidate
				onSubmit={handleSubmit(onSubmit)}
				className="flex w-full max-w-md flex-col gap-4"
			>
				<FormFieldComponent
					label="Username"
					name="username"
					register={register}
					errors={errors}
					placeholder="Username"
					startIcon={<UserCheck2 className="dark:text-babyPowder size-8" />}
				/>

				<FormFieldComponent
					label="First Name"
					name="first_name"
					register={register}
					errors={errors}
					placeholder="First Name"
					startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
				/>

				<FormFieldComponent
					label="Last Name"
					name="last_name"
					register={register}
					errors={errors}
					placeholder="Last Name"
					startIcon={<Contact2Icon className="dark:text-babyPowder size-8" />}
				/>

				<FormFieldComponent
					label="Email Address"
					name="email"
					register={register}
					errors={errors}
					placeholder="Email Address"
					startIcon={<MailIcon className="dark:text-babyPowder size-8" />}
				/>

				<FormFieldComponent
					label="Password"
					name="password"
					register={register}
					errors={errors}
					placeholder="Password"
					isPassword={true}
				/>

				<FormFieldComponent
					label="Confirm Password"
					name="re_password"
					register={register}
					errors={errors}
					placeholder="Confirm Password"
					isPassword={true}
				/>

				<Button
					type="submit"
					className="h4-semibold bg-eerieBlack dark:bg-pumpkin w-full text-white"
					disabled={isLoading}
				>
					{isLoading ? <Spinner size="sm" /> : `Submit`}
				</Button>
			</form>
		</main>
	);
}