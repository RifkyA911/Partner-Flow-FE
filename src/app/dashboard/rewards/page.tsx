"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FaTrophy, FaMedal, FaStar, FaAward, FaGift, FaFire } from "react-icons/fa";

interface Reward {
	id: string;
	title: string;
	description: string;
	icon: string;
	points: number;
	achieved: boolean;
	achieved_at?: string;
	category: string;
}

export default function RewardsPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [rewards, setRewards] = useState<Reward[]>([]);
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchRewards = useCallback(async () => {
		setLoading(true);
		try {
			// TODO: Replace with actual API call
			// const res = await fetch(`${baseUrl}/api/rewards`);
			// const data = await res.json();
			// if (data.success) {
			// 	setRewards(data.data.rewards);
			// }

			// Mock data for now
			setRewards([
				{
					id: "1",
					title: "First Referral",
					description: "Complete your first successful referral",
					icon: "star",
					points: 100,
					achieved: true,
					achieved_at: "2024-01-15",
					category: "milestone",
				},
				{
					id: "2",
					title: "Rising Star",
					description: "Refer 5 partners successfully",
					icon: "medal",
					points: 500,
					achieved: true,
					achieved_at: "2024-02-20",
					category: "milestone",
				},
				{
					id: "3",
					title: "Top Performer",
					description: "Refer 10 partners successfully",
					icon: "trophy",
					points: 1000,
					achieved: false,
					category: "milestone",
				},
				{
					id: "4",
					title: "Commission King",
					description: "Earn Rp 10,000,000 in total commissions",
					icon: "award",
					points: 2000,
					achieved: false,
					category: "commission",
				},
				{
					id: "5",
					title: "Streak Master",
					description: "Maintain 30-day referral streak",
					icon: "fire",
					points: 750,
					achieved: false,
					category: "streak",
				},
				{
					id: "6",
					title: "Early Bird",
					description: "Join the program in the first month",
					icon: "gift",
					points: 300,
					achieved: true,
					achieved_at: "2024-01-01",
					category: "special",
				},
			]);
		} catch {
			console.error("Failed to load rewards");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchRewards();
	}, [fetchRewards]);

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "star":
				return <FaStar className="w-6 h-6" />;
			case "medal":
				return <FaMedal className="w-6 h-6" />;
			case "trophy":
				return <FaTrophy className="w-6 h-6" />;
			case "award":
				return <FaAward className="w-6 h-6" />;
			case "fire":
				return <FaFire className="w-6 h-6" />;
			case "gift":
				return <FaGift className="w-6 h-6" />;
			default:
				return <FaTrophy className="w-6 h-6" />;
		}
	};

	const getCategoryColor = (category: string) => {
		switch (category) {
			case "milestone":
				return "from-blue-500 to-cyan-500";
			case "commission":
				return "from-green-500 to-emerald-500";
			case "streak":
				return "from-orange-500 to-red-500";
			case "special":
				return "from-purple-500 to-pink-500";
			default:
				return "from-gray-500 to-gray-600";
		}
	};

	const achievedRewards = rewards.filter((r) => r.achieved);
	const totalPoints = achievedRewards.reduce((sum, r) => sum + r.points, 0);

	if (session?.user?.role !== "partner") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-500">Access denied. Partners only.</p>
			</div>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header Stats */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg`}>
						<CardHeader className="p-4 sm:p-6">
							<div className="flex items-center gap-3">
								<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-yellow-500 to-orange-500" : "bg-gradient-to-br from-yellow-600 to-orange-600"}`}>
									<FaTrophy className="w-6 h-6 text-white" />
								</div>
								<div>
									<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										{achievedRewards.length}
									</CardTitle>
									<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										Rewards Earned
									</p>
								</div>
							</div>
						</CardHeader>
					</Card>
					<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg`}>
						<CardHeader className="p-4 sm:p-6">
							<div className="flex items-center gap-3">
								<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-purple-500 to-pink-500" : "bg-gradient-to-br from-purple-600 to-pink-600"}`}>
									<FaStar className="w-6 h-6 text-white" />
								</div>
								<div>
									<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										{totalPoints}
									</CardTitle>
									<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										Total Points
									</p>
								</div>
							</div>
						</CardHeader>
					</Card>
					<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg`}>
						<CardHeader className="p-4 sm:p-6">
							<div className="flex items-center gap-3">
								<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-green-500 to-emerald-500" : "bg-gradient-to-br from-green-600 to-emerald-600"}`}>
									<FaMedal className="w-6 h-6 text-white" />
								</div>
								<div>
									<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										{rewards.length - achievedRewards.length}
									</CardTitle>
									<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										Pending Rewards
									</p>
								</div>
							</div>
						</CardHeader>
					</Card>
				</div>

				{/* Rewards Grid */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div>
							<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Achievements & Rewards
							</CardTitle>
							<CardDescription className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Complete challenges to earn rewards and boost your partner status
							</CardDescription>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6">
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
							{rewards.map((reward) => (
								<div
									key={reward.id}
									className={`relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-lg ${reward.achieved
											? isDark
												? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30"
												: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
											: isDark
												? "bg-white/5 border-white/10 opacity-60"
												: "bg-gray-50 border-gray-200 opacity-60"
										}`}
								>
									<div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(reward.category)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
									<div className="relative p-4 sm:p-6">
										<div className="flex items-start justify-between mb-4">
											<div className={`w-12 h-12 rounded-xl flex items-center justify-center ${reward.achieved
													? `bg-gradient-to-br ${getCategoryColor(reward.category)}`
													: isDark
														? "bg-white/10"
														: "bg-gray-200"
												}`}>
												<span className={reward.achieved ? "text-white" : isDark ? "text-gray-400" : "text-gray-500"}>
													{getIcon(reward.icon)}
												</span>
											</div>
											{reward.achieved && (
												<span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
													ACHIEVED
												</span>
											)}
										</div>
										<h3 className={`font-semibold text-base mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
											{reward.title}
										</h3>
										<p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{reward.description}
										</p>
										<div className="flex items-center justify-between">
											<div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
												{reward.points} points
											</div>
											{reward.achieved && reward.achieved_at && (
												<div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
													{new Date(reward.achieved_at).toLocaleDateString()}
												</div>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
						{rewards.length === 0 && (
							<div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
								<FaTrophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
								<p>No rewards available yet</p>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</DashboardLayout>
	);
}
