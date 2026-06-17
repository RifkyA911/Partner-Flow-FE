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
		<>
			<Card
				className={`w-full mb-6 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}
			>
				<CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-bold mb-1">
							Admin Operations
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
					className={`mb-4 p-3 rounded-lg text-sm ${isDark ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-800"}`}
				>
					{message}
				</div>
			)}

			<Tabs defaultValue="dashboard" className="space-y-6">
				<TabsList
					className={`grid w-full sm:w-fit grid-cols-2 sm:grid-cols-5 ${isDark ? "bg-white/10" : "bg-gray-100"}`}
				>
					<TabsTrigger value="dashboard">Dashboard</TabsTrigger>
					<TabsTrigger value="referrals">Referrals</TabsTrigger>
					<TabsTrigger value="commissions">Commissions</TabsTrigger>
					<TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
					<TabsTrigger value="partners">Partners</TabsTrigger>
				</TabsList>

				<TabsContent value="dashboard" className="space-y-6">
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
				</TabsContent>

				<TabsContent value="referrals">
					<Card className={isDark ? "bg-white/5 border-white/10" : ""}>
						<CardHeader>
							<CardTitle>Referral workflow</CardTitle>
							<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Registration does not generate commission. Approve → validate
								business → commission generated.
							</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{referrals.map((r) => (
								<div
									key={r.id}
									className={`border rounded-lg p-4 ${isDark ? "border-white/10" : "border-gray-200"}`}
								>
									<div className="flex flex-wrap justify-between gap-2 mb-3">
										<div>
											<p className="font-semibold">{r.referred_name}</p>
											<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												Referrer: {r.partner.company_name} | Attrib:{" "}
												{r.attribution_code ?? r.referral_code}
											</p>
										</div>
										<span className="px-2 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
											{LIFECYCLE_LABEL[r.lifecycle_status] ?? r.lifecycle_status}
										</span>
									</div>
									{canReferral && (
										<div className="flex flex-wrap gap-2">
											{r.lifecycle_status === "pending_verification" && (
												<Button
													size="sm"
													onClick={() =>
														handleReferralAction(r.id, "submit-review")
													}
												>
													Start admin review
												</Button>
											)}
											{r.lifecycle_status === "admin_review" && (
												<Button
													size="sm"
													className="bg-green-600 hover:bg-green-700"
													onClick={() => handleReferralAction(r.id, "approve")}
												>
													<HiOutlineCheckCircle className="w-4 h-4 mr-1" />
													Approve referral
												</Button>
											)}
											{r.lifecycle_status === "business_validation" && (
												<Button
													size="sm"
													className="bg-blue-600 hover:bg-blue-700"
													onClick={() =>
														handleReferralAction(r.id, "validate-business", {
															method: "manual",
														})
													}
												>
													Validate business & generate commission
												</Button>
											)}
											{!["commission_generated", "rejected", "cancelled", "expired"].includes(
												r.lifecycle_status,
											) && (
												<Button
													size="sm"
													variant="outline"
													className="text-red-500 border-red-500"
													onClick={() => handleReferralAction(r.id, "reject")}
												>
													<HiOutlineXCircle className="w-4 h-4 mr-1" />
													Reject
												</Button>
											)}
										</div>
									)}
								</div>
							))}
							{referrals.length === 0 && (
								<p className="text-center text-gray-500 py-8">No referrals</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="commissions">
					<Card className={isDark ? "bg-white/5 border-white/10" : ""}>
						<CardHeader>
							<CardTitle>Generated commissions</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead>
										<tr className={isDark ? "text-gray-400" : "text-gray-600"}>
											<th className="text-left py-2">Partner</th>
											<th className="text-left py-2">Referred</th>
											<th className="text-left py-2">Amount</th>
											<th className="text-left py-2">Status</th>
										</tr>
									</thead>
									<tbody>
										{commissions.map((c) => (
											<tr key={c.id} className="border-t border-white/10">
												<td className="py-2">{c.partner.company_name}</td>
												<td className="py-2">{c.referral.referred_name}</td>
												<td className="py-2">
													Rp {c.amount.toLocaleString("id-ID")}
												</td>
												<td className="py-2">{c.status}</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="withdrawals">
					<Card className={isDark ? "bg-white/5 border-white/10" : ""}>
						<CardHeader>
							<CardTitle>Withdrawal requests (finance)</CardTitle>
							<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Segregation: approver ≠ payout executor (unless superadmin)
							</p>
						</CardHeader>
						<CardContent className="space-y-4">
							{withdrawals.map((w) => (
								<div
									key={w.id}
									className={`border rounded-lg p-4 ${isDark ? "border-white/10" : ""}`}
								>
									<p className="font-medium">
										{w.partner.company_name} — Rp{" "}
										{w.amount.toLocaleString("id-ID")}
									</p>
									<p className="text-xs text-gray-500 mb-2">Status: {w.status}</p>
									{canFinance && w.status === "pending_finance_approval" && (
										<div className="flex gap-2">
											<Button
												size="sm"
												onClick={() =>
													handleWithdrawalAction(w.id, "approve")
												}
											>
												Finance approve
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-red-500"
												onClick={() =>
													handleWithdrawalAction(w.id, "reject")
												}
											>
												Reject
											</Button>
										</div>
									)}
									{canFinance && w.status === "approved" && (
										<Button
											size="sm"
											className="bg-green-600"
											onClick={() => handleWithdrawalAction(w.id, "payout")}
										>
											Execute Xendit payout
										</Button>
									)}
								</div>
							))}
							{withdrawals.length === 0 && (
								<p className="text-center text-gray-500 py-8">No withdrawals</p>
							)}
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="partners">
					<Card className={isDark ? "bg-white/5 border-white/10" : ""}>
						<CardContent className="p-0 overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className={isDark ? "text-gray-400" : "text-gray-600"}>
										<th className="text-left p-4">Company</th>
										<th className="text-left p-4">Code</th>
										<th className="text-left p-4">Status</th>
									</tr>
								</thead>
								<tbody>
									{partners.map((p) => (
										<tr key={p.id} className="border-t border-white/10">
											<td className="p-4">{p.company_name}</td>
											<td className="p-4">
												<span className="inline-flex items-center gap-1 bg-green-600/20 text-green-400 px-2 py-0.5 rounded text-xs">
													{p.partner_code}
													<HiOutlineClipboardCopy className="w-3 h-3" />
												</span>
											</td>
											<td className="p-4">{p.status}</td>
										</tr>
									))}
								</tbody>
							</table>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</>
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
