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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { baseUrl } from "@/config";

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

const LIFECYCLE_STATUS_CONFIG: Record<string, { bgColor: string; textColor: string }> = {
	created: { bgColor: "bg-gray-500/20", textColor: "text-gray-500" },
	pending_verification: { bgColor: "bg-amber-500/20", textColor: "text-amber-500" },
	admin_review: { bgColor: "bg-blue-500/20", textColor: "text-blue-500" },
	business_validation: { bgColor: "bg-purple-500/20", textColor: "text-purple-500" },
	commission_generated: { bgColor: "bg-green-500/20", textColor: "text-green-500" },
	rejected: { bgColor: "bg-red-500/20", textColor: "text-red-500" },
	cancelled: { bgColor: "bg-gray-500/20", textColor: "text-gray-500" },
	expired: { bgColor: "bg-gray-500/20", textColor: "text-gray-500" },
};

const getLifecycleStatusBadge = (status: string) => {
	const config = LIFECYCLE_STATUS_CONFIG[status] || {
		bgColor: "bg-purple-500/20",
		textColor: "text-purple-500",
	};
	return (
		<span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${config.bgColor} ${config.textColor}`}>
			{LIFECYCLE_LABEL[status] ?? status}
		</span>
	);
};

const PARTNER_STATUS_CONFIG: Record<string, { label: string; bgColor: string; textColor: string }> = {
	active: { label: "Active", bgColor: "bg-green-500/20", textColor: "text-green-500" },
	pending: { label: "Pending", bgColor: "bg-amber-500/20", textColor: "text-amber-500" },
	suspended: { label: "Suspended", bgColor: "bg-red-500/20", textColor: "text-red-500" },
	inactive: { label: "Inactive", bgColor: "bg-gray-500/20", textColor: "text-gray-500" },
};

const getPartnerStatusBadge = (status: string) => {
	const config = PARTNER_STATUS_CONFIG[status.toLowerCase()] || {
		label: status,
		bgColor: "bg-purple-500/20",
		textColor: "text-purple-500",
	};
	return (
		<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
			{config.label}
		</span>
	);
};

const COMMISSION_STATUS_CONFIG: Record<string, { bgColor: string; textColor: string }> = {
	available: { bgColor: "bg-green-500/20", textColor: "text-green-500" },
	pending: { bgColor: "bg-amber-500/20", textColor: "text-amber-500" },
	locked: { bgColor: "bg-red-500/20", textColor: "text-red-500" },
	paid: { bgColor: "bg-blue-500/20", textColor: "text-blue-500" },
};

const getCommissionStatusBadge = (status: string) => {
	const config = COMMISSION_STATUS_CONFIG[status.toLowerCase()] || {
		bgColor: "bg-purple-500/20",
		textColor: "text-purple-500",
	};
	return (
		<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
			{status}
		</span>
	);
};

const WITHDRAWAL_STATUS_CONFIG: Record<string, { bgColor: string; textColor: string }> = {
	pending_finance_approval: { bgColor: "bg-amber-500/20", textColor: "text-amber-500" },
	approved: { bgColor: "bg-blue-500/20", textColor: "text-blue-500" },
	completed: { bgColor: "bg-green-500/20", textColor: "text-green-500" },
	rejected: { bgColor: "bg-red-500/20", textColor: "text-red-500" },
	failed: { bgColor: "bg-red-500/20", textColor: "text-red-500" },
};

const getWithdrawalStatusBadge = (status: string) => {
	const config = WITHDRAWAL_STATUS_CONFIG[status.toLowerCase()] || {
		bgColor: "bg-purple-500/20",
		textColor: "text-purple-500",
	};
	return (
		<span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
			{status}
		</span>
	);
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
	const [partners, setPartners] = useState<any[]>([]);
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const [commissions, setCommissions] = useState<Commission[]>([]);
	const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);

	const refreshAll = useCallback(async () => {
		setLoading(true);
		try {
			const [statsRes, partnersRes, referralsRes, commissionsRes, withdrawalsRes] =
				await Promise.all([
					fetch(`${baseUrl}/api/admin/stats`),
					fetch(`${baseUrl}/api/partners`),
					fetch(`${baseUrl}/api/referrals?limit=50`),
					fetch(`${baseUrl}/api/commissions`),
					fetch(`${baseUrl}/api/withdrawals`),
				]);
			const [statsData, partnersData, referralsData, commissionsData, withdrawalsData] =
				await Promise.all([
					statsRes.json(),
					partnersRes.json(),
					referralsRes.json(),
					commissionsRes.json(),
					withdrawalsRes.json(),
				]);
			if (statsData.success) setStats(statsData.data);
			if (partnersData.success) setPartners(partnersData.data.partners);
			if (referralsData.success) setReferrals(referralsData.data.referrals);
			if (commissionsData.success)
				setCommissions(commissionsData.data.commissions ?? []);
			if (withdrawalsData.success)
				setWithdrawals(withdrawalsData.data.withdrawals ?? []);
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

	const postAction = async (url: string, body: Record<string, unknown>) => {
		setMessage("");
		const res = await fetch(url, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(body),
		});
		const data = await res.json();
		if (!data.success) {
			setMessage(data.error ?? "Action failed");
			return false;
		}
		setMessage("Action completed");
		await refreshAll();
		return true;
	};

	const handleReferralAction = async (
		referralId: string,
		action: string,
		extra?: Record<string, unknown>,
	) => {
		if (!adminId) return;

		// Confirmation messages for each action
		const confirmMessages: Record<string, string> = {
			"submit-review": "Start admin review for this referral? This will move it from pending verification to admin review.",
			"approve": "Approve this referral? This will move it to business validation for commission generation.",
			"validate-business": "Validate business and generate commission? This will create a commission for the referrer.",
			reject: "Reject this referral? This action cannot be undone.",
		};

		const message = confirmMessages[action];
		if (message && !window.confirm(message)) {
			return;
		}

		const base = `${baseUrl}/api/referrals/${referralId}`;
		const map: Record<string, string> = {
			"submit-review": `${base}/submit-review`,
			approve: `${base}/approve`,
			"validate-business": `${base}/validate-business`,
			reject: `${base}/reject`,
		};
		await postAction(map[action], {
			admin_id: adminId,
			method: "manual",
			reason: "Rejected by admin",
			...extra,
		});
	};

	const handleWithdrawalAction = async (
		withdrawalId: string,
		action: "approve" | "reject" | "payout",
	) => {
		if (!adminId) return;
		const url = `${baseUrl}/api/withdrawals/${withdrawalId}/${action}`;
		const body: Record<string, unknown> = { admin_id: adminId };
		if (action === "reject") body.reason = "Rejected by finance";
		await postAction(url, body);
	};

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

			<Card className={isDark ? "bg-white/5 border-white/10" : ""}>
				<CardHeader>
					<CardTitle>Audit trail (recent)</CardTitle>
				</CardHeader>
				<CardContent className="space-y-2">
					{(stats.recent_audit ?? []).map((a, i) => (
						<div
							key={i}
							className={`text-sm p-2 rounded ${isDark ? "bg-white/5" : "bg-gray-50"}`}
						>
							<span className="font-medium">{a.action}</span>
							{a.description && (
								<span className={isDark ? "text-gray-400" : "text-gray-600"}>
									{" "}
									— {a.description}
								</span>
							)}
							<p className="text-xs text-gray-500 mt-1">
								{new Date(a.created_at).toLocaleString()}
							</p>
						</div>
					))}
					{!stats.recent_audit?.length && (
						<p className="text-gray-500 text-sm">No audit entries yet</p>
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
