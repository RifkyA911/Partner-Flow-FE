"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Sidebar } from "@/components/layouts/sidebar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
	children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
	const { data: session } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	return (
		<div className="flex min-h-screen">
			<Sidebar isDark={isDark} isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
			<main
				className={`flex-1 px-4 sm:px-6 lg:px-8 py-8 ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}
				style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }}
			>
				{children}
			</main>
		</div>
	);
}
