"use client";

import { useState, useEffect } from "react";
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

export default function AdminDashboard() {
	const [showPasswords, setShowPasswords] = useState(false);
	//   const [showWelcomeToast, setShowWelcomeToast] = useState(true)

	//   useEffect(() => {
	//     if (showWelcomeToast) {
	//       toast({
	//         title: "Login Successful",
	//         description: "Welcome to the admin dashboard!",
	//         duration: 5000,
	//       })
	//       setShowWelcomeToast(false)
	//     }
	//   }, [showWelcomeToast, toast])

	const activityItems = [
		{
			type: "signup",
			icon: UserPlus,
			title: "New Signup",
			description: "artha from artha",
			timestamp: "21 Jun 2025 at 03:17 PM",
			color: "blue",
		},
		{
			type: "conversion",
			icon: CheckCircle,
			title: "Conversion",
			description: "VINCENT from VINCENT - Auto-promoted to partner!",
			timestamp: "21 Jun 2025 at 02:36 PM",
			color: "green",
		},
		{
			type: "conversion",
			icon: CheckCircle,
			title: "Conversion",
			description:
				"Testing User from Test Ahadmart Referral - Auto-promoted to partner!",
			timestamp: "21 Jun 2025 at 02:34 PM",
			color: "green",
		},
		{
			type: "signup",
			icon: UserPlus,
			title: "New Signup",
			description: "Sarah Wilson from Second Level Company",
			timestamp: "",
			color: "blue",
		},
	];

	const partnersData = [
		{
			company: "TK. FITRI - CIPUTAT",
			email: "sales02.17504907777@imported.partner",
			contactName: "TK. FITRI - CIPUTAT",
			phone: "085891378060",
			referralCode: "PRT-2025-932621",
			password: "••••••••",
			created: "Jun 21, 2025",
		},
		{
			company: "indra",
			email: "indra@gmail.com",
			contactName: "indra",
			phone: "0891123123",
			referralCode: "PRT-2025-887867",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "Wilson Trading Co.",
			email: "robert.w@gmail.com",
			contactName: "Robert Wilson",
			phone: "+1 (555) 555-6666",
			referralCode: "PRT-2025-498546",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. ADITIA - LENGKONG (D)",
			email: "sales07.17504907777@imported.partner",
			contactName: "TK. ADITIA - LENGKONG (D)",
			phone: "085758595309",
			referralCode: "PRT-2025-971502",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. AGUS - CILENGGANG (D)",
			email: "sales09.17504907777@imported.partner",
			contactName: "TK. AGUS - CILENGGANG (D)",
			phone: "02129004759",
			referralCode: "PRT-2025-737767",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. AHADMART - PD. KACANG",
			email: "sales04.17504907777@imported.partner",
			contactName: "TK. AHADMART - PD. KACANG",
			phone: "081299755571",
			referralCode: "PRT-2025-611948",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. ALMA - CIPUTAT (D)",
			email: "sales11.17504907777@imported.partner",
			contactName: "TK. ALMA - CIPUTAT (D)",
			phone: "081285315213",
			referralCode: "PRT-2025-765839",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. AMADI - PAKULONAN",
			email: "sales12.17504907777@imported.partner",
			contactName: "TK. AMADI - PAKULONAN",
			phone: "081213605837",
			referralCode: "PRT-2025-725382",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. AMRIZAL NST - CIPUTAT",
			email: "sales17.17504907777@imported.partner",
			contactName: "TK. AMRIZAL NST - CIPUTAT",
			phone: "087808762915",
			referralCode: "PRT-2025-683992",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. BANG UCOK - MUNCUL",
			email: "sales03.17504907777@imported.partner",
			contactName: "TK. BANG UCOK - MUNCUL",
			phone: "082166512962",
			referralCode: "PRT-2025-617156",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. BAWOR - PAMULANG (D)",
			email: "sales15.17504907777@imported.partner",
			contactName: "TK. BAWOR - PAMULANG (D)",
			phone: "082299553374",
			referralCode: "PRT-2025-825933",
			password: null,
			created: "Jun 21, 2025",
		},
		{
			company: "TK. DAHLAN - PAMULANG",
			email: "sales16.17504907777@imported.partner",
			contactName: "TK. DAHLAN - PAMULANG",
			phone: "081217768837",
			referralCode: "PRT-2025-841371",
			password: null,
			created: "Jun 21, 2025",
		},
	];

	return (
		<>
			{/* Main Content */}
			<main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-7xl mx-auto">
				{/* Page Header */}
				<Card className="w-full mb-6 sm:mb-8">
					<CardContent className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div>
								<h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
									Admin Dashboard
								</h2>
								<p className="text-sm sm:text-base text-gray-600">
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
					<TabsList className="grid w-full sm:w-fit grid-cols-3 bg-gray-100">
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
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium text-gray-600">
										Total Partners
									</CardTitle>
									<Users className="w-4 h-4 text-blue-600" />
								</CardHeader>
								<CardContent>
									<div className="text-xl sm:text-2xl font-bold text-gray-900">
										28
									</div>
									<p className="text-xs text-green-600 mt-1">
										+45 new this month
									</p>
								</CardContent>
							</Card>

							{/* Active Referrals */}
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium text-gray-600">
										Active Referrals
									</CardTitle>
									<TrendingUp className="w-4 h-4 text-orange-600" />
								</CardHeader>
								<CardContent>
									<div className="text-xl sm:text-2xl font-bold text-gray-900">
										14
									</div>
									<p className="text-xs text-green-600 mt-1">
										+12% vs last month
									</p>
								</CardContent>
							</Card>

							{/* Total Conversions */}
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium text-gray-600">
										Total Conversions
									</CardTitle>
									<CheckCircle className="w-4 h-4 text-green-600" />
								</CardHeader>
								<CardContent>
									<div className="text-xl sm:text-2xl font-bold text-gray-900">
										10
									</div>
									<p className="text-xs text-green-600 mt-1">
										+8% vs last month
									</p>
								</CardContent>
							</Card>

							{/* Total Payouts */}
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium text-gray-600">
										Total Payouts
									</CardTitle>
									<DollarSign className="w-4 h-4 text-blue-600" />
								</CardHeader>
								<CardContent>
									<div className="text-xs text-gray-500 mb-1">
										IDR
									</div>
									<div className="text-lg sm:text-2xl font-bold text-gray-900">
										Rp 950,100.00
									</div>
									<p className="text-xs text-green-600 mt-1">
										+23% vs last month
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Recent Activity */}
						<Card>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className="text-base sm:text-lg font-semibold text-gray-900">
											Recent Activity
										</CardTitle>
										<p className="text-sm text-gray-600 mt-1">
											Latest signups, conversions, and
											partner promotions
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-transparent w-fit"
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
												className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
											>
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center ${
														item.color === "blue"
															? "bg-blue-100"
															: "bg-green-100"
													}`}
												>
													<IconComponent
														className={`w-4 h-4 ${
															item.color ===
															"blue"
																? "text-blue-600"
																: "text-green-600"
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
														<span className="font-medium text-gray-900 text-sm">
															{item.title}
														</span>
													</div>
													<p className="text-xs sm:text-sm text-gray-600 mb-1">
														{item.description}
													</p>
													{item.timestamp && (
														<p className="text-xs text-gray-500">
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
						<Card>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
											Partners Management
										</CardTitle>
										<p className="text-sm text-gray-600 mt-1">
											View all partners and their login
											credentials
										</p>
									</div>
									<Button
										variant="outline"
										size="sm"
										className="gap-2 bg-transparent w-fit"
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
											<tr className="border-b border-gray-200">
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">
													Company
												</th>
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
													Contact
												</th>
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">
													Referral Code
												</th>
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">
													Password
												</th>
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden md:table-cell">
													Status
												</th>
												<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">
													Created
												</th>
											</tr>
										</thead>
										<tbody>
											{partnersData.map(
												(partner, index) => (
													<tr
														key={index}
														className="border-b border-gray-100 hover:bg-gray-50"
													>
														<td className="py-3 sm:py-4 px-2 sm:px-4">
															<div>
																<div className="font-medium text-gray-900 text-xs sm:text-sm">
																	{
																		partner.company
																	}
																</div>
																<div className="text-xs text-gray-600 hidden sm:block">
																	{
																		partner.email
																	}
																</div>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
															<div>
																<div className="font-medium text-gray-900 text-xs sm:text-sm">
																	{
																		partner.contactName
																	}
																</div>
																<div className="text-xs text-gray-600">
																	{
																		partner.phone
																	}
																</div>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4">
															<div className="flex items-center gap-2">
																<span className="bg-green-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
																	{
																		partner.referralCode
																	}
																</span>
																<button className="text-gray-400 hover:text-gray-600">
																	<HiOutlineClipboardCopy className="w-4 h-4" />
																</button>
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
															<div className="flex items-center gap-2">
																{partner.password ? (
																	<>
																		<span className="font-mono text-gray-900 text-xs sm:text-sm">
																			{showPasswords
																				? partner.password
																				: "••••••••"}
																		</span>
																		<button className="text-gray-400 hover:text-gray-600">
																			<HiOutlineEye className="w-4 h-4" />
																		</button>
																		<button className="text-gray-400 hover:text-gray-600">
																			<HiOutlineClipboardCopy className="w-4 h-4" />
																		</button>
																	</>
																) : (
																	<span className="text-gray-500 text-xs sm:text-sm">
																		Not Set
																	</span>
																)}
															</div>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
															<span className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
																Active
															</span>
														</td>
														<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
															<span className="text-gray-600 text-xs sm:text-sm">
																{
																	partner.created
																}
															</span>
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="referrals">
						<Card>
							<CardHeader className="p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
									<div>
										<CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
											Referral Management
										</CardTitle>
										<p className="text-sm text-gray-600 mt-1">
											Review and approve pending referrals
										</p>
									</div>
									<div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium w-fit">
										3 pending
									</div>
								</div>
							</CardHeader>
							<CardContent className="p-4 sm:p-6">
								<div className="space-y-4 sm:space-y-6">
									{/* Jane Doe Referral */}
									<div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
													JD
												</div>
												<div>
													<h3 className="font-semibold text-gray-900 text-sm sm:text-base">
														Jane Doe
													</h3>
													<p className="text-xs sm:text-sm text-gray-600">
														New Prospect Company
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
												<span className="text-xs sm:text-sm text-gray-600">
													Pending
												</span>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Email:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													jane@newprospect.com
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Phone:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													+1 (555) 777-6666
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Industry:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													retail
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Expected Volume:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													5000-10000
												</p>
											</div>
										</div>

										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<p className="text-xs sm:text-sm text-gray-600">
												Referred by:{" "}
												<span className="font-medium">
													David Brown
												</span>{" "}
												on Jun 21, 2025
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
									</div>

									{/* Sarah Wilson Referral */}
									<div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
													SW
												</div>
												<div>
													<h3 className="font-semibold text-gray-900 text-sm sm:text-base">
														Sarah Wilson
													</h3>
													<p className="text-xs sm:text-sm text-gray-600">
														Second Level Company
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
												<span className="text-xs sm:text-sm text-gray-600">
													Pending
												</span>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Email:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													sarah.wilson@secondlevel.com
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Phone:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													+62987654321
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Industry:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													wholesale
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Expected Volume:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													5000-10000
												</p>
											</div>
										</div>

										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<p className="text-xs sm:text-sm text-gray-600">
												Referred by:{" "}
												<span className="font-medium">
													John Test
												</span>{" "}
												on Jun 21, 2025
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
									</div>

									{/* artha Referral */}
									<div className="border border-gray-200 rounded-lg p-4 sm:p-6 bg-white">
										<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
											<div className="flex items-center gap-3">
												<div className="w-10 h-10 bg-gray-600 text-white rounded-full flex items-center justify-center font-semibold">
													A
												</div>
												<div>
													<h3 className="font-semibold text-gray-900 text-sm sm:text-base">
														artha
													</h3>
													<p className="text-xs sm:text-sm text-gray-600">
														artha
													</p>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<div className="w-2 h-2 bg-orange-500 rounded-full"></div>
												<span className="text-xs sm:text-sm text-gray-600">
													Pending
												</span>
											</div>
										</div>

										<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Email:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													artha@gmail.com
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Phone:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													+62815566263
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Industry:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													wholesale
												</p>
											</div>
											<div>
												<p className="text-xs sm:text-sm text-gray-500">
													Expected Volume:
												</p>
												<p className="text-xs sm:text-sm text-gray-900">
													1000-5000
												</p>
											</div>
										</div>

										<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
											<p className="text-xs sm:text-sm text-gray-600">
												Referred by:{" "}
												<span className="font-medium">
													VINCENT
												</span>{" "}
												on Jun 21, 2025
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
									</div>
								</div>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</main>
		</>
	);
}
