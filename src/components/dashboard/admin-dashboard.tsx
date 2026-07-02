"use client";



import { useState, useEffect, useCallback } from "react";

import type { Session } from "next-auth";

import {

	Users,

	TrendingUp,

	CheckCircle,

	DollarSign,

	UserPlus,

	RefreshCw,

} from "lucide-react";

import {

	HiOutlineCheckCircle,

	HiOutlineXCircle,

	HiOutlineClipboardCopy,

} from "react-icons/hi";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { baseUrl } from "@/config";

import {

	LineChart,

	Line,

	BarChart,

	Bar,

	PieChart,

	Pie,

	Cell,

	XAxis,

	YAxis,

	CartesianGrid,

	Tooltip,

	Legend,

	ResponsiveContainer,

} from "recharts";



type LifecycleStatus =

	| "created"

	| "pending_verification"

	| "admin_review"

	| "business_validation"

	| "commission_generated"

	| "rejected"

	| "cancelled"

	| "expired";



interface Referral {

	id: string;

	referred_name: string;

	referred_phone: string;

	commission: number;

	lifecycle_status: LifecycleStatus;

	status: string;

	referral_code: string;

	attribution_code?: string;

	commission_status?: string;

	created_at: string;

	partner: { company_name: string };

	referred_partner?: { partner_code: string; company_name: string } | null;

}



interface Commission {

	id: string;

	amount: number;

	status: string;

	generated_at: string;

	partner: { company_name: string; partner_code: string };

	referral: { referred_name: string; lifecycle_status: string };

}



interface Withdrawal {

	id: string;

	amount: number;

	status: string;

	partner: { company_name: string; partner_code: string };

	requested_at: string;

}



const LIFECYCLE_LABEL: Record<string, string> = {

	created: "Created",

	pending_verification: "Pending verification",

	admin_review: "Admin review",

	business_validation: "Business validation",

	commission_generated: "Commission generated",

	rejected: "Rejected",

	cancelled: "Cancelled",

	expired: "Expired",

};



interface AdminDashboardProps {

	session: Session;

	isDark: boolean;

}



export function AdminDashboard({ session, isDark }: AdminDashboardProps) {

	const [loading, setLoading] = useState(false);

	const [message, setMessage] = useState("");



	const adminId = session?.user?.id;

	const adminRole = (session?.user as { admin_role?: string })?.admin_role ?? "admin";

	const canReferral =

		["superadmin", "referral_admin", "admin"].includes(adminRole);

	const canFinance =

		["superadmin", "finance_admin", "admin"].includes(adminRole);



	const [stats, setStats] = useState({

		total_partners: 0,

		pending_verification: 0,

		in_admin_review: 0,

		in_business_validation: 0,

		pending_withdrawals: 0,

		total_payouts: 0,

		recent_audit: [] as { action: string; description?: string; created_at: string }[],

	});



	const [referralTrendData, setReferralTrendData] = useState<any[]>([]);

	const [partnerStatusData, setPartnerStatusData] = useState<any[]>([]);

	const [commissionData, setCommissionData] = useState<any[]>([]);



	const refreshAll = useCallback(async () => {

		setLoading(true);

		try {

			const [statsRes, referralTrendsRes, partnerStatusRes, commissionRes] = await Promise.all([

				fetch(`${baseUrl}/api/admin/stats`),

				fetch(`${baseUrl}/api/admin/referral-trends`),

				fetch(`${baseUrl}/api/admin/partner-status`),

				fetch(`${baseUrl}/api/admin/commission-overview`),

			]);

			const [statsData, referralTrendsData, partnerStatusData, commissionData] = await Promise.all([

				statsRes.json(),

				referralTrendsRes.json(),

				partnerStatusRes.json(),

				commissionRes.json(),

			]);

			if (statsData.success) setStats(statsData.data);

			if (referralTrendsData.success) setReferralTrendData(referralTrendsData.data);

			if (partnerStatusData.success) setPartnerStatusData(partnerStatusData.data);

			if (commissionData.success) setCommissionData(commissionData.data);

		} catch (e) {

			console.error(e);

			setMessage("Failed to load admin data");

		} finally {

			setLoading(false);

		}

	}, []);



	useEffect(() => {

		refreshAll();

	}, [refreshAll]);



	return (

		<div className="space-y-6">

			<Card

				className={`w-full ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}

			>

				<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

					<div>

						<h2 className="text-xl sm:text-2xl font-bold mb-1">

							Admin Overview

						</h2>

						<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>

							Role: {adminRole} — referral scope:{" "}

							{canReferral ? "yes" : "no"} | finance scope:{" "}

							{canFinance ? "yes" : "no"}

						</p>

					</div>

					<Button

						onClick={refreshAll}

						disabled={loading}

						variant="outline"

						className="gap-2"

					>

						<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />

						Refresh

					</Button>

				</CardContent>

			</Card>



			{message && (

				<div

					className={`p-3 rounded-lg text-sm ${isDark ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-800"}`}

				>

					{message}

				</div>

			)}



			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

				<StatCard

					title="Partners"

					value={stats.total_partners}

					icon={<Users className="w-4 h-4 text-blue-600" />}

					isDark={isDark}

				/>

				<StatCard

					title="Pending verification"

					value={stats.pending_verification}

					icon={<TrendingUp className="w-4 h-4 text-amber-600" />}

					isDark={isDark}

				/>

				<StatCard

					title="Business validation"

					value={stats.in_business_validation}

					icon={<CheckCircle className="w-4 h-4 text-green-600" />}

					isDark={isDark}

				/>

				<StatCard

					title="Total paid"

					value={`Rp ${(stats.total_payouts ?? 0).toLocaleString("id-ID")}`}

					icon={<DollarSign className="w-4 h-4 text-blue-600" />}

					isDark={isDark}

				/>

			</div>



			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

				<Card className={isDark ? "bg-white/5 border-white/10" : ""}>

					<CardHeader>

						<CardTitle className="text-lg">Referral Trends</CardTitle>

					</CardHeader>

					<CardContent>

						<ResponsiveContainer width="100%" height={300}>

							<LineChart data={referralTrendData}>

								<CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} />

								<XAxis dataKey="month" stroke={isDark ? "#888" : "#666"} />

								<YAxis stroke={isDark ? "#888" : "#666"} />

								<Tooltip

									contentStyle={{

										backgroundColor: isDark ? "#1e293b" : "#fff",

										borderColor: isDark ? "#333" : "#e5e7eb",

										color: isDark ? "#fff" : "#000",

									}}

								/>

								<Legend />

								<Line type="monotone" dataKey="referrals" stroke="#8b5cf6" strokeWidth={2} name="Total Referrals" />

								<Line type="monotone" dataKey="approved" stroke="#22c55e" strokeWidth={2} name="Approved" />

							</LineChart>

						</ResponsiveContainer>

					</CardContent>

				</Card>



				<Card className={isDark ? "bg-white/5 border-white/10" : ""}>

					<CardHeader>

						<CardTitle className="text-lg">Partner Status Distribution</CardTitle>

					</CardHeader>

					<CardContent>

						<ResponsiveContainer width="100%" height={300}>

							<PieChart>

								<Pie

									data={partnerStatusData}

									cx="50%"

									cy="50%"

									labelLine={false}

									label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}

									outerRadius={80}

									fill="#8884d8"

									dataKey="value"

								>

									{partnerStatusData.map((entry, index) => (

										<Cell key={`cell-${index}`} fill={entry.color} />

									))}

								</Pie>

								<Tooltip

									contentStyle={{

										backgroundColor: isDark ? "#1e293b" : "#fff",

										borderColor: isDark ? "#333" : "#e5e7eb",

										color: isDark ? "#fff" : "#000",

									}}

								/>

							</PieChart>

						</ResponsiveContainer>

					</CardContent>

				</Card>

			</div>



			<Card className={isDark ? "bg-white/5 border-white/10" : ""}>

				<CardHeader>

					<CardTitle className="text-lg">Commission Overview</CardTitle>

				</CardHeader>

				<CardContent>

					<ResponsiveContainer width="100%" height={300}>

						<BarChart data={commissionData}>

							<CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#e5e7eb"} />

							<XAxis dataKey="month" stroke={isDark ? "#888" : "#666"} />

							<YAxis stroke={isDark ? "#888" : "#666"} />

							<Tooltip

								contentStyle={{

									backgroundColor: isDark ? "#1e293b" : "#fff",

									borderColor: isDark ? "#333" : "#e5e7eb",

									color: isDark ? "#fff" : "#000",

								}}

								formatter={(value: number) => `Rp ${value.toLocaleString("id-ID")}`}

							/>

							<Legend />

							<Bar dataKey="amount" fill="#8b5cf6" name="Commission Amount" />

						</BarChart>

					</ResponsiveContainer>

				</CardContent>

			</Card>



			<Card className={isDark ? "bg-white/5 border-white/10" : ""}>

				<CardHeader>

					<div className="flex items-center justify-between">

						<CardTitle className="text-lg">Recent Activity</CardTitle>

						<span className={`text-xs px-2 py-1 rounded ${isDark ? "bg-purple-500/20 text-purple-300" : "bg-purple-100 text-purple-700"}`}>

							Last 5 entries

						</span>

					</div>

				</CardHeader>

				<CardContent className="space-y-2">

					{(stats.recent_audit ?? []).slice(0, 5).map((a, i) => (

						<div

							key={i}

							className={`text-xs p-2 rounded border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}

						>

							<div className="flex items-start justify-between gap-2">

								<span className="font-medium truncate flex-1">{a.action}</span>

								<span className={`text-xs whitespace-nowrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>

									{new Date(a.created_at).toLocaleDateString()}

								</span>

							</div>

						</div>

					))}

					{!stats.recent_audit?.length && (

						<p className="text-gray-500 text-xs text-center py-4">No recent activity</p>

					)}

				</CardContent>

			</Card>

		</div>

	);

}



function StatCard({

	title,

	value,

	icon,

	isDark,

}: {

	title: string;

	value: string | number;

	icon: React.ReactNode;

	isDark: boolean;

}) {

	return (

		<Card className={isDark ? "bg-white/5 border-white/10" : ""}>

			<CardContent className="p-4">

				<div className="flex justify-between items-start mb-2">

					<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>

						{title}

					</p>

					{icon}

				</div>

				<p className="text-xl font-bold">{value}</p>

			</CardContent>

		</Card>

	);

}

