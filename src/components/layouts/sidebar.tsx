"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
	FaHome,
	FaUsers,
	FaChartBar,
	FaWallet,
	FaShareAlt,
	FaCog,
	FaShieldAlt,
	FaChevronLeft,
	FaChevronRight,
	FaTrophy,
	FaHistory,
	FaFileAlt,
} from "react-icons/fa";

interface SidebarProps {
	isDark: boolean;
	isCollapsed?: boolean;
	onToggle?: () => void;
}

interface MenuItem {
	icon: React.ReactNode;
	label: string;
	path: string;
	roles: string[];
	description: string;
	badge?: string;
}

export function Sidebar({ isDark, isCollapsed = false, onToggle }: SidebarProps) {
	const { data: session } = useSession();
	const pathname = usePathname();
	const userRole = session?.user?.role || "partner";

	const menuItems: MenuItem[] = [
		{
			icon: <FaHome className="w-5 h-5" />,
			label: "Dashboard",
			path: "/dashboard",
			roles: ["partner", "admin"],
			description: "Overview of your referral performance and earnings",
		},
		{
			icon: <FaShareAlt className="w-5 h-5" />,
			label: "Referrals",
			path: "/dashboard/referrals",
			roles: ["partner", "admin"],
			description: "Manage and track all your referrals",
		},
		{
			icon: <FaWallet className="w-5 h-5" />,
			label: "Wallet",
			path: "/dashboard/wallet",
			roles: ["partner"],
			description: "View your earnings and request withdrawals",
			badge: "New",
		},
		{
			icon: <FaTrophy className="w-5 h-5" />,
			label: "Rewards",
			path: "/dashboard/rewards",
			roles: ["partner"],
			description: "View your achievements and rewards",
		},
		{
			icon: <FaHistory className="w-5 h-5" />,
			label: "History",
			path: "/dashboard/history",
			roles: ["partner"],
			description: "View your transaction and referral history",
		},
		{
			icon: <FaUsers className="w-5 h-5" />,
			label: "Partners",
			path: "/dashboard/partners",
			roles: ["admin"],
			description: "Manage all registered partners",
		},
		{
			icon: <FaChartBar className="w-5 h-5" />,
			label: "Analytics",
			path: "/dashboard/analytics",
			roles: ["admin"],
			description: "View detailed analytics and reports",
		},
		{
			icon: <FaShieldAlt className="w-5 h-5" />,
			label: "Approvals",
			path: "/dashboard/approvals",
			roles: ["admin"],
			description: "Approve referrals and withdrawals",
			badge: "Pending",
		},
		{
			icon: <FaFileAlt className="w-5 h-5" />,
			label: "Reports",
			path: "/dashboard/reports",
			roles: ["admin"],
			description: "Generate and view reports",
		},
		{
			icon: <FaCog className="w-5 h-5" />,
			label: "Settings",
			path: "/dashboard/settings",
			roles: ["partner", "admin"],
			description: "Manage your account settings",
		},
	];

	const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole));

	return (
		<TooltipProvider>
			<aside
				className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-all duration-300 ease-in-out ${
					isCollapsed ? "w-20" : "w-64"
				} ${isDark ? "bg-slate-900 border-r border-white/10" : "bg-white border-r border-gray-200"}`}
			>
				{/* Header */}
				<div className="p-4 border-b border-white/10 flex-shrink-0 flex items-center justify-between">
					{!isCollapsed && (
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<FaHome className="w-4 h-4 text-white" />
							</div>
							<span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
								Partner Flow
							</span>
						</div>
					)}
					<Button
						variant="ghost"
						size="sm"
						onClick={onToggle}
						className={`${isDark ? "text-gray-300 hover:bg-white/10" : "text-gray-700 hover:bg-gray-100"}`}
					>
						{isCollapsed ? <FaChevronRight className="w-4 h-4" /> : <FaChevronLeft className="w-4 h-4" />}
					</Button>
				</div>

				{/* Menu Items */}
				<nav className="flex-1 overflow-y-auto p-4 space-y-2">
					{filteredMenuItems.map((item) => {
						const isActive = pathname === item.path;
						return (
							<Tooltip key={item.path}>
								<TooltipTrigger asChild>
									<Link
										href={item.path}
										className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
											isActive
												? isDark
													? "bg-blue-600 text-white"
													: "bg-blue-600 text-white"
												: isDark
												? "text-gray-300 hover:bg-white/10"
												: "text-gray-700 hover:bg-gray-100"
										} ${isCollapsed ? "justify-center" : ""}`}
									>
										<span className="flex-shrink-0">{item.icon}</span>
										{!isCollapsed && (
											<div className="flex-1 flex items-center justify-between">
												<span className="text-sm font-medium">{item.label}</span>
												{item.badge && (
													<Badge variant="secondary" className="text-xs">
														{item.badge}
													</Badge>
												)}
											</div>
										)}
									</Link>
								</TooltipTrigger>
								<TooltipContent side="right" className={isDark ? "bg-slate-800 text-white" : "bg-gray-900 text-white"}>
									<p className="font-medium">{item.label}</p>
									<p className="text-xs opacity-80">{item.description}</p>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</nav>

				{/* User Info */}
				{!isCollapsed && session?.user && (
					<div className="p-4 border-t border-white/10 flex-shrink-0">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
								{session.user.name?.charAt(0).toUpperCase() || "U"}
							</div>
							<div className="flex-1 min-w-0">
								<p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-gray-900"}`}>
									{session.user.name || "User"}
								</p>
								<p className={`text-xs truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									{session.user.email}
								</p>
							</div>
						</div>
					</div>
				)}
			</aside>
		</TooltipProvider>
	);
}

function Badge({ children, variant, className }: { children: React.ReactNode; variant?: string; className?: string }) {
	return (
		<span
			className={`px-2 py-0.5 rounded-full text-xs font-medium ${
				variant === "secondary"
					? "bg-blue-500/20 text-blue-400"
					: "bg-green-500/20 text-green-400"
			} ${className}`}
		>
			{children}
		</span>
	);
}
