import TechnicianCard from "@/components/cards/TechnicianCard";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Burj Khalifa | Technicians",
	description:
		"Tenants can see a list of technicians, what they specialize on, and their rating ",
};

export default function TechniciansPage() {
	return (
		<>
			<TechnicianCard />
		</>
	);
}
