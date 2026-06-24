"use client";

import { usePathname } from "next/navigation";
import { NavbarMenu } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";

export function LayoutContent({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const isDashboardRoute = pathname?.startsWith("/dashboard");

	return (
		<>
			{!isDashboardRoute && <NavbarMenu />}
			<div className={`${isDashboardRoute ? "" : "min-h-screen"}`}>
				{children}
			</div>
			{!isDashboardRoute && <Footer />}
		</>
	);
}
