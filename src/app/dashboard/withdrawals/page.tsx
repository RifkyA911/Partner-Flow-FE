"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { baseUrl } from "@/config";

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

interface Withdrawal {
	id: string;
	amount: number;
	status: string;
	partner: { company_name: string; partner_code: string };
	requested_at: string;
}

export default function WithdrawalsPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
	const [isDark, setIsDark] = useState(true);

	const adminId = session?.user?.id;
	const adminRole = (session?.user as { admin_role?: string })?.admin_role ?? "admin";
	const canFinance = ["superadmin", "finance_admin", "admin"].includes(adminRole);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchWithdrawals = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/withdrawals`);
			const data = await res.json();
			if (data.success) {
				setWithdrawals(data.data.withdrawals ?? []);
			} else {
				setMessage("Failed to load withdrawals");
			}
		} catch {
			setMessage("Failed to load withdrawals");
		} finally {
			setLoading(false);
		}
	}, []);

	const handleWithdrawalAction = async (
		withdrawalId: string,
		action: "approve" | "reject" | "payout",
	) => {
		if (!adminId) return;

		const confirmMessages: Record<string, string> = {
			approve: "Approve this withdrawal request?",
			reject: "Reject this withdrawal request? This action cannot be undone.",
			payout: "Execute Xendit payout for this withdrawal?",
		};

		const message = confirmMessages[action];
		if (message && !window.confirm(message)) {
			return;
		}

		setMessage("");
		const url = `${baseUrl}/api/withdrawals/${withdrawalId}/${action}`;
		const body: Record<string, unknown> = { admin_id: adminId };
		if (action === "reject") body.reason = "Rejected by finance";

		try {
			const res = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			});
			const data = await res.json();
			if (!data.success) {
				setMessage(data.error ?? "Action failed");
			} else {
				setMessage("Action completed");
				await fetchWithdrawals();
			}
		} catch {
			setMessage("Action failed");
		}
	};

	useEffect(() => {
		fetchWithdrawals();
	}, [fetchWithdrawals]);

	if (session?.user?.role !== "admin") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-500">Access denied. Admin only.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Withdrawal Requests</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Approve and process withdrawal requests. Segregation: approver ≠ payout executor (unless superadmin).
							</p>
						</div>
						<Button
							onClick={fetchWithdrawals}
							disabled={loading}
							variant="outline"
							className="gap-2"
						>
							<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					{withdrawals.map((w) => (
						<div
							key={w.id}
							className={`border rounded-lg p-4 ${isDark ? "border-white/10" : ""}`}
						>
							<div className="flex items-start justify-between gap-4 mb-2">
								<div>
									<p className="font-medium">
										{w.partner.company_name} — Rp{" "}
										{w.amount.toLocaleString("id-ID")}
									</p>
									<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										Requested: {new Date(w.requested_at).toLocaleDateString()}
									</p>
								</div>
								{getWithdrawalStatusBadge(w.status)}
							</div>
							{canFinance && w.status === "pending_finance_approval" && (
								<div className="flex gap-2">
									<Button
										size="sm"
										onClick={() => handleWithdrawalAction(w.id, "approve")}
									>
										Finance approve
									</Button>
									<Button
										size="sm"
										variant="outline"
										className="text-red-500"
										onClick={() => handleWithdrawalAction(w.id, "reject")}
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
						<div className="text-center py-8 text-gray-500">No withdrawals found</div>
					)}
				</CardContent>
			</Card>

			{message && (
				<div
					className={`p-3 rounded-lg text-sm ${isDark ? "bg-blue-500/20 text-blue-200" : "bg-blue-50 text-blue-800"}`}
				>
					{message}
				</div>
			)}
		</div>
	);
}
