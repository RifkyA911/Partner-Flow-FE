"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HiOutlineRefresh, HiOutlineUsers, HiOutlineTrendingUp, HiOutlineCheckCircle, HiOutlineCurrencyDollar } from "react-icons/hi";
import { StatsCard } from "./stats-card";
import { PartnersTable } from "./partners-table";
import { ReferralManagement } from "./referral-management";

interface ActivityItem {
	type: string;
	icon: any;
	title: string;
	description: string;
	timestamp: string;
	color: string;
}

interface AdminDashboardProps {
	stats: {
		total_partners: number;
		active_referrals: number;
		total_conversions: number;
		total_payouts: number;
		recent_activities: ActivityItem[];
	};
	partners: any[];
	referrals: any[];
	isDark: boolean;
	showPasswords: boolean;
	onTogglePasswords: () => void;
}

export function AdminDashboard({
	stats,
	partners,
	referrals,
	isDark,
	showPasswords,
	onTogglePasswords
}: AdminDashboardProps) {
	return (
		<>
			{/* Page Header */}
			<Card className={`w-full mb-6 sm:mb-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
				<CardHeader className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
								Admin Dashboard
							</h2>
							<p className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Overview of all partners and referrals
							</p>
						</div>
						<Button
							className={`gap-2 bg-transparent w-fit ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						>
							<HiOutlineRefresh className="w-4 h-4" />
							Refresh
						</Button>
					</div>
				</CardHeader>
			</Card>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
				<StatsCard
					icon={<HiOutlineUsers />}
					title="Total Partners"
					value={stats.total_partners}
					subtitle="Active users"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineTrendingUp />}
					title="Active Referrals"
					value={stats.active_referrals}
					subtitle="In progress"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCheckCircle />}
					title="Total Conversions"
					value={stats.total_conversions}
					subtitle="Successful"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCurrencyDollar />}
					title="Total Payouts"
					value={`Rp ${stats.total_payouts.toLocaleString('id-ID')}`}
					subtitle="Processed"
					isDark={isDark}
				/>
			</div>

			{/* Tabs for Partners and Referrals */}
			<Tabs defaultValue="partners" className="w-full">
				<TabsList className={`grid w-full sm:w-fit grid-cols-3 ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
					<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
					<TabsTrigger value="partners">Partners</TabsTrigger>
					<TabsTrigger value="referrals">Referrals</TabsTrigger>
				</TabsList>

				<TabsContent value="dashboard">
					<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
						<CardHeader className="p-4 sm:p-6">
							<CardTitle className={`text-base sm:text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Recent Activity
							</CardTitle>
							<CardDescription className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Latest actions across the platform
							</CardDescription>
						</CardHeader>
						<CardContent className="p-4 sm:p-6">
							<div className="space-y-4">
								{stats.recent_activities.length > 0 ? stats.recent_activities.map((activity, index) => (
									<div key={index} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}>
										<div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color === "blue" ? "bg-blue-500/20" : "bg-green-500/20"}`}>
											<activity.icon className={`w-4 h-4 ${activity.color === "blue" ? "text-blue-400" : "text-green-400"}`} />
										</div>
										<div className="flex-1">
											<span className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
												{activity.title}
											</span>
											<p className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												{activity.description}
											</p>
											<p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
												{activity.timestamp}
											</p>
										</div>
									</div>
								)) : (
									<p className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										No recent activity
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="partners">
					<PartnersTable
						partners={partners}
						isDark={isDark}
						showPasswords={showPasswords}
						onTogglePasswords={onTogglePasswords}
					/>
				</TabsContent>

				<TabsContent value="referrals">
					<ReferralManagement
						referrals={referrals}
						isDark={isDark}
					/>
				</TabsContent>
			</Tabs>
		</>
	);
}
