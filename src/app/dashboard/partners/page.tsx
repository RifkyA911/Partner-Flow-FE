"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { baseUrl } from "@/config";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";

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

export default function PartnersPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [partners, setPartners] = useState<any[]>([]);
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchPartners = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/partners`);
			const data = await res.json();
			if (data.success) {
				setPartners(data.data.partners);
			} else {
				setMessage("Failed to load partners");
			}
		} catch {
			setMessage("Failed to load partners");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchPartners();
	}, [fetchPartners]);

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
							<CardTitle>Partner Management</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								View and manage all registered partners. Monitor partner status and referral codes.
							</p>
						</div>
						<Button
							onClick={fetchPartners}
							disabled={loading}
							variant="outline"
							className="gap-2"
						>
							<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				</CardHeader>
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
									<td className="px-4 py-2">{p.company_name}</td>
									<td className="px-4 py-2">
										<span className="inline-flex items-center gap-1 bg-green-500/20 text-green-500 font-medium px-2 py-1 rounded text-xs">
											{p.partner_code}
											<HiOutlineClipboardCopy className="w-3 h-3" />
										</span>
									</td>
									<td className="px-4 py-2">{getPartnerStatusBadge(p.status)}</td>
								</tr>
							))}
						</tbody>
					</table>
					{partners.length === 0 && (
						<div className="text-center py-8 text-gray-500">No partners found</div>
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
