"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
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

export default function ReferralsPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const [isDark, setIsDark] = useState(true);

	const adminId = session?.user?.id;
	const adminRole = (session?.user as { admin_role?: string })?.admin_role ?? "admin";
	const canReferral = ["superadmin", "referral_admin", "admin"].includes(adminRole);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchReferrals = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/referrals?limit=50`);
			const data = await res.json();
			if (data.success) {
				setReferrals(data.data.referrals);
			} else {
				setMessage("Failed to load referrals");
			}
		} catch {
			setMessage("Failed to load referrals");
		} finally {
			setLoading(false);
		}
	}, []);

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
		await fetchReferrals();
		return true;
	};

	const handleReferralAction = async (
		referralId: string,
		action: string,
		extra?: Record<string, unknown>,
	) => {
		if (!adminId) return;

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

	useEffect(() => {
		fetchReferrals();
	}, [fetchReferrals]);

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
							<CardTitle>Referral Workflow</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Registration does not generate commission. Approve → validate business → commission generated.
							</p>
						</div>
						<Button
							onClick={fetchReferrals}
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
					{referrals.map((r) => (
						<div
							key={r.id}
							className={`border rounded-lg p-4 ${isDark ? "border-white/10" : "border-gray-200"}`}
						>
							<div className="flex items-start justify-between gap-4 mb-3">
								<div className="flex-1 min-w-0">
									<p className="font-semibold text-base mb-1">{r.referred_name}</p>
									<div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
										<span className={isDark ? "text-gray-400" : "text-gray-600"}>
											<span className="font-medium">Referrer:</span> {r.partner.company_name}
										</span>
										<span className={isDark ? "text-gray-400" : "text-gray-600"}>
											<span className="font-medium">Attrib:</span> {r.attribution_code ?? r.referral_code}
										</span>
									</div>
								</div>
								{getLifecycleStatusBadge(r.lifecycle_status)}
							</div>
							{canReferral && (
								<div className="space-y-3">
									<div className={`text-xs p-2 rounded ${isDark ? "bg-white/5 text-gray-400" : "bg-gray-100 text-gray-600"}`}>
										<span className="font-medium">Next step:</span>{" "}
										{r.lifecycle_status === "pending_verification" && "Start admin review to verify referral details"}
										{r.lifecycle_status === "admin_review" && "Approve to proceed to business validation"}
										{r.lifecycle_status === "business_validation" && "Validate business to generate commission"}
										{["commission_generated", "rejected", "cancelled", "expired"].includes(r.lifecycle_status) && "No further actions available"}
									</div>
									<div className="flex flex-wrap gap-2">
										{r.lifecycle_status === "pending_verification" && (
											<Button
												size="sm"
												onClick={() => handleReferralAction(r.id, "submit-review")}
												className="bg-blue-600 hover:bg-blue-700"
											>
												<HiOutlineCheckCircle className="w-4 h-4 mr-1" />
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
												className="bg-purple-600 hover:bg-purple-700"
												onClick={() =>
													handleReferralAction(r.id, "validate-business", {
														method: "manual",
													})
												}
											>
												<HiOutlineCheckCircle className="w-4 h-4 mr-1" />
												Validate business & generate commission
											</Button>
										)}
										{!["commission_generated", "rejected", "cancelled", "expired"].includes(
											r.lifecycle_status,
										) && (
											<Button
												size="sm"
												variant="outline"
												className="text-red-500 border-red-500 hover:bg-red-50"
												onClick={() => handleReferralAction(r.id, "reject")}
											>
												<HiOutlineXCircle className="w-4 h-4 mr-1" />
												Reject
											</Button>
										)}
									</div>
								</div>
							)}
						</div>
					))}
					{referrals.length === 0 && (
						<p className="text-center text-gray-500 py-8">No referrals found</p>
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
