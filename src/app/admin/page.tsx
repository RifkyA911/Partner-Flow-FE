"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
	Network,
	Plus,
	Download,
	Eye,
	LogOut,
	RefreshCw,
	Users,
	TrendingUp,
	CheckCircle,
	DollarSign,
	UserPlus,
} from "lucide-react";
import {
	HiOutlineUsers,
	HiOutlinePlus,
	HiOutlineDownload,
	HiOutlineEye,
	HiOutlineLogout,
	HiOutlineRefresh,
	HiOutlineTrendingUp,
	HiOutlineCheckCircle,
	HiOutlineEyeOff,
	HiOutlineClipboardCopy,
	HiOutlineXCircle,
} from "react-icons/hi";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { baseUrl } from "@/config";

export default function AdminDashboard() {
	const router = useRouter();
	const { data: session, status } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [showPasswords, setShowPasswords] = useState(false);
	interface ActivityItem {
		type: string;
		icon: any;
		title: string;
		description: string;
		timestamp: string;
		color: string;
	}

	interface Partner {
		id: string;
		partner_code: string;
		company_name: string;
		contact_person: string;
		email: string;
		phone: string;
		status: string;
		created_at: string;
	}

	interface Referral {
		id: string;
		referred_name: string;
		referred_phone: string;
		commission: number;
		status: string;
		referral_code: string;
		created_at: string;
		partner: {
			company_name: string;
		};
	}

	const [stats, setStats] = useState({
		total_partners: 0,
		active_referrals: 0,
		total_conversions: 0,
		total_payouts: 0,
		recent_activities: [] as ActivityItem[],
	});
	const [partners, setPartners] = useState<Partner[]>([]);
	const [referrals, setReferrals] = useState<Referral[]>([]);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login");
			return;
		}

		if (session?.user?.role !== "admin") {
			router.push("/partners");
			return;
		}

		// Fetch data
		fetchStats();
		fetchPartners();
		fetchReferrals();
	}, [session, status, router]);

	const fetchStats = async () => {
		try {
			const res = await fetch(`${baseUrl}/api/admin/stats`);
			const data = await res.json();
			if (data.success) {
				setStats(data.data);
			}
		} catch (error) {
			console.error("Failed to fetch stats:", error);
		}
	};

	const fetchPartners = async () => {
		try {
			const res = await fetch(`${baseUrl}/api/partners`);
			const data = await res.json();
			if (data.success) {
				setPartners(data.data.partners);
			}
		} catch (error) {
			console.error("Failed to fetch partners:", error);
		}
	};

	const fetchReferrals = async () => {
		try {
			const res = await fetch(`${baseUrl}/api/referrals`);
			const data = await res.json();
			if (data.success) {
				setReferrals(data.data.referrals);
			}
		} catch (error) {
			console.error("Failed to fetch referrals:", error);
		}
	};

	const activityItems = stats.recent_activities || [
		{
			type: "signup",
			icon: UserPlus,
			title: "New Signup",
			description: "artha from artha",
			timestamp: "21 Jun 2025 at 03:17 PM",
			color: "blue",
		},
	];


	return (
		<>
			{/* Main Content */}
			<main className={`px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
				{/* Page Header */}
				<Card className={`w-full mb-6 sm:mb-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardContent className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h2 className={`text-xl sm:text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
									Admin Dashboard
								</h2>
								<p className={`text-sm sm:text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Manage referral system and monitor
									performance
								</p>
							</div>

							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
								<Button className="bg-blue-600 hover:bg-blue-700 gap-2 text-sm">
									<Download className="w-4 h-4" />
									<span className="hidden sm:inline">
										Download Reports
									</span>
									<span className="sm:hidden">Download</span>
								</Button>
								<Button className="bg-green-600 hover:bg-green-700 gap-2 text-sm">
									<Plus className="w-4 h-4" />
									<span className="hidden sm:inline">
										Import Partners
									</span>
									<span className="sm:hidden">Import</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Tabs */}
				<Tabs
					defaultValue="dashboard"
					className="space-y-4 sm:space-y-6 w-full"
				>
					<TabsList className={`grid w-full sm:w-fit grid-cols-3 ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
						<TabsTrigger
							value="dashboard"
							className="px-3 sm:px-6 text-sm"
						>
							Dashboard
						</TabsTrigger>
						<TabsTrigger
							value="partners"
							className="px-3 sm:px-6 text-sm"
						>
							Partners
						</TabsTrigger>
						<TabsTrigger
							value="referrals"
							className="px-3 sm:px-6 text-sm"
						>
							Referrals
						</TabsTrigger>
					</TabsList>

					<TabsContent
						value="dashboard"
						className="space-y-4 sm:space-y-6"
					>
						{/* Stats Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
							{/* Total Partners */}
							<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
										Total Partners
									</CardTitle>
									<Users className="w-4 h-4 text-blue-600" />
								</CardHeader>
								<CardContent>
									<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
										{stats.total_partners}
									</div>
									<p className="text-xs text-green-600 mt-1">
										+45 new this month
									</p>
								</CardContent>
							</Card>

							{/* Active Referrals */}
							<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
										Active Referrals
									</CardTitle>
									<TrendingUp className="w-4 h-4 text-orange-600" />
								</CardHeader>
								<CardContent>
									<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
										{stats.active_referrals}
									</div>
									<p className="text-xs text-green-600 mt-1">
										+12% vs last month
									</p>
								</CardContent>
							</Card>

							{/* Total Conversions */}
							<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
										Total Conversions
									</CardTitle>
									<CheckCircle className="w-4 h-4 text-green-600" />
								</CardHeader>
								<CardContent>
									<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
										{stats.total_conversions}
									</div>
									<p className="text-xs text-green-600 mt-1">
										+8% vs last month
									</p>
								</CardContent>
							</Card>

							{/* Total Payouts */}
							<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
										Total Payouts
									</CardTitle>
									<DollarSign className="w-4 h-4 text-blue-600" />
								</CardHeader>
								<CardContent>
									<div className={`text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										IDR
									</div>
									<div className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
										Rp {stats.total_payouts.toLocaleString('id-ID')}
									</div>
									<p className="text-xs text-green-600 mt-1">
										+23% vs last month
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Recent Activity */}
						<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className={`text-base sm:text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
											Recent Activity
										</CardTitle>
										<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											Latest signups, conversions, and
											partner promotions
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className={`gap-2 bg-transparent w-fit ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
									>
										<RefreshCw className="w-4 h-4" />
										Refresh
									</Button>
								</div>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<div className="space-y-3 sm:space-y-4">
									{activityItems.map((item, index) => {
										const IconComponent = item.icon;
										return (
											<div
												key={index}
												className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
											>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color === "blue"
														? "bg-blue-500/20"
														: "bg-green-500/20"
														}`}
												>
													<IconComponent
														className={`w-4 h-4 ${item.color ===
															"blue"
															? "text-blue-400"
															: "text-green-400"
															}`}
													/>
												</div>
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														{item.type ===
															"conversion" && (
																<CheckCircle className="w-4 h-4 text-green-600" />
															)}
														{item.type ===
															"signup" && (
																<UserPlus className="w-4 h-4 text-blue-600" />
															)}
														<span className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
															{item.title}
														</span>
													</div>
													<p className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
														{item.description}
													</p>
													{item.timestamp && (
														<p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
															{item.timestamp}
														</p>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="partners">
						<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
											Partners Management
										</CardTitle>
										<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											View all partners and their login
											credentials
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className={`gap-2 bg-transparent w-fit ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
										onClick={() =>
											setShowPasswords(!showPasswords)
										}
									>
										{showPasswords ? (
											<HiOutlineEyeOff className="w-4 h-4" />
										) : (
											<HiOutlineEye className="w-4 h-4" />
										)}
										Show Passwords
									</Button>
								</div>
							</CardHeader>
							<CardContent className="p-0 sm:p-6">
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Company
												</th>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Contact
												</th>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Referral Code
												</th>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Password
												</th>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Status
												</th>
												<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
													Created
												</th>
											</tr>
										</thead>
										<tbody>
											{partners.map(
												(partner: Partner, index: number) => (
													<tr
														key={index}
														className={`border-b ${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`}
													>
														<td className="py-3 sm:py-4 px-2 sm:px-4">
															<div>
																<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
																	{partner.company_name}
																</div>
																<div className={`text-xs hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
																	{partner.email}
																</div>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
															<div>
																<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
																	{partner.contact_person}
																</div>
																<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
																	{partner.phone}
																</div>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4">
															<div className="flex items-center gap-2">
																<span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
																	{partner.partner_code}
																</span>
																<button className={`${isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>
																	<HiOutlineClipboardCopy className="w-4 h-4" />
																</button>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
															<div className="flex items-center gap-2">
																<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
																	••••••••
																</span>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
															<span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
																{partner.status}
															</span>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
															<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
																{new Date(partner.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
															</span>
														</td>
													</tr>
												)
											)}
											{partners.length === 0 && (
												<tr>
													<td colSpan={6} className={`py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
														No partners yet
													</td>
												</tr>
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="referrals">
						<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
											Referral Management
										</CardTitle>
										<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											Review and approve pending referrals
										</p>
									</div>
									<div className={`${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-700"} px-3 py-1 rounded-full text-sm font-medium w-fit`}>
										{referrals.filter((r: Referral) => r.status === 'pending').length} pending
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<div className="space-y-4 sm:space-y-6">
									{referrals.map((referral: Referral) => (
										<div key={referral.id} className={`border rounded-lg p-4 sm:p-6 ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
											<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
												<div className="flex items-center gap-3">
													<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
														{referral.referred_name.charAt(0).toUpperCase()}
													</div>
													<div>
														<h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
															{referral.referred_name}
														</h3>
														<p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
															{referral.partner.company_name}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-2">
													<div className={`w-2 h-2 rounded-full ${referral.status === 'pending' ? 'bg-orange-500' :
														referral.status === 'approved' ? 'bg-green-500' :
															referral.status === 'converted' ? 'bg-purple-500' :
																'bg-red-500'
														}`}></div>
													<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
														{referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
													</span>
												</div>
											</div>

											<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
												<div>
													<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
														Phone:
													</p>
													<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
														{referral.referred_phone}
													</p>
												</div>
												<div>
													<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
														Commission:
													</p>
													<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
														Rp {referral.commission.toLocaleString('id-ID')}
													</p>
												</div>
												<div>
													<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
														Created:
													</p>
													<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
														{new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
													</p>
												</div>
												<div>
													<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
														Referral Code:
													</p>
													<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
														{referral.referral_code}
													</p>
												</div>
											</div>

											{referral.status === 'pending' && (
												<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
													<p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
														Referred by:{" "}
														<span className="font-medium">
															{referral.partner.company_name}
														</span>
													</p>
													<div className="flex flex-col sm:flex-row gap-2">
														<Button className="bg-green-600 hover:bg-green-700 text-white gap-2 text-xs sm:text-sm">
															<HiOutlineCheckCircle className="w-4 h-4" />
															Convert to Partner
														</Button>
														<Button
															variant="outline"
															className="text-red-600 border-red-600 hover:bg-red-50 gap-2 bg-transparent text-xs sm:text-sm"
														>
															<HiOutlineXCircle className="w-4 h-4" />
															Decline
														</Button>
													</div>
												</div>
											)}
										</div>
									))}
									{referrals.length === 0 && (
										<div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
											No referrals yet
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</>
	);
}
