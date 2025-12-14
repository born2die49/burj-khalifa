import { Reply } from "@/types";
import { useTheme } from "next-themes";
import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { formatDistanceToNow, parseISO } from "date-fns";

interface ReplyProps {
	reply: Reply;
}

export default function RepliesList({ reply }: ReplyProps) {
	const { theme } = useTheme();
	return (
		<div className="flex items-center space-x-3">
			<Avatar>
				<AvatarImage
					src={
						reply.avatar ??
						(theme === "dark"
							? "/assets/icons/user-profile-circle.svg"
							: "/assets/icons/user-profile-light-circle.svg")
					}
					alt="Author Avatar"
					className="border-electricIndigo dark:border-pumpkin rounded-full border-2"
					width={35}
					height={35}
				/>
			</Avatar>

			<div>
				<p className="flex items-center space-x-2">
					<span className="dark:text-pumpkin font-semibold">
						@{reply.author_username}
					</span>
					<span className="text-electricIndigo text-lg ">
						<p className="dark:text-platinum text-lg">{reply.body}</p>
					</span>
				</p>
				<p className="dark:text-lime-500 text-sm">
					{formatDistanceToNow(parseISO(reply.created_at), {
						addSuffix: true,
					})}
				</p>
			</div>
		</div>
	);
}
