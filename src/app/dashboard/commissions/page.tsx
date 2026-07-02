"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { baseUrl } from "@/config";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

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

interface Commission {
	id: string;
	amount: number;
	status: string;
	generated_at: string;
	partner: { company_name: string; partner_code: string };
	referral: { referred_name: string; lifecycle_status: string };
}

export default function CommissionsPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [commissions, setCommissions] = useState<Commission[]>([]);
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchCommissions = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/commissions`);
			const data = await res.json();
			if (data.success) {
				setCommissions(data.data.commissions ?? []);
			} else {
				setMessage("Failed to load commissions");
			}
		} catch {
			setMessage("Failed to load commissions");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchCommissions();
	}, [fetchCommissions]);

	if (session?.user?.role !== "admin") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-500">Access denied. Admin only.</p>
			</div>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
				<CardHeader>
					<div className="flex items-center justify-between">
						<div>
							<CardTitle>Generated Commissions</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Commissions generated after business validation. Track payout status and partner earnings.
							</p>
						</div>
						<Button
							onClick={fetchCommissions}
							disabled={loading}
							variant="outline"
							className="gap-2"
						>
							<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
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
									<th className="text-left py-2">Generated</th>
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
										<td className="py-2">{getCommissionStatusBadge(c.status)}</td>
										<td className="py-2">
											{new Date(c.generated_at).toLocaleDateString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					{commissions.length === 0 && (
						<div className="text-center py-8 text-gray-500">No commissions found</div>
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
		</DashboardLayout>
	);
}
