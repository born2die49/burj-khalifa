import type { Metadata } from "next";
import Image from "next/image";
import buildings from "@/../public/assets/images/burjkhalifa.jpg"
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

export const metadata:Metadata = {
  title: "Home | Burj Khalifa",
  description: "Burj Khalifa Homepage. Create an account to get started." 
}

export default function HomePage() {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0 z-0">
        <Image 
          src={buildings} 
          alt="Apartments" 
          fill 
          style={{objectFit:"cover", objectPosition: "center"}}
          priority
          />
      </div>
      <main className="flex-center relative z-10 h-full bg-black/50">
        <div className="text-center">
          <h1 className="font-robotoSlab mb-4 text-4xl font-semibold text-cyan-400 antialiased sm:text-6xl md:text-8xl">
            Welcome to Burj Khalifa
          </h1>
          <p className="my-8 text-2xl text-teal-300 sm:text-4xl">
            Are you a Tenant? Or existing Tenant?
          </p>
          <Link href="/register" prefetch={false}>
            <button className="bg-asparagus rounded-3xl px-4 py-2 text-lg font-semibold text-white hover:lime-700 sm:px-6 sm:text-2xl  hover:bg-asparagusDark transition">
              <span className="inline-flex items-center">
                Create your account
                <ArrowRightIcon className="ml-2 size-6"/>
              </span>
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
