"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { baseUrl } from "@/config";

interface AuditEntry {
	action: string;
	description?: string;
	created_at: string;
}

export default function AuditPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [auditLog, setAuditLog] = useState<AuditEntry[]>([]);
	const [isDark, setIsDark] = useState(true);

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchAuditLog = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch(`${baseUrl}/api/admin/stats`);
			const data = await res.json();
			if (data.success) {
				setAuditLog(data.data.recent_audit ?? []);
			} else {
				setMessage("Failed to load audit log");
			}
		} catch {
			setMessage("Failed to load audit log");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchAuditLog();
	}, [fetchAuditLog]);

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
							<CardTitle>Audit Log</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								View system audit trail and recent admin actions.
							</p>
						</div>
						<Button
							onClick={fetchAuditLog}
							disabled={loading}
							variant="outline"
							className="gap-2"
						>
							<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
							Refresh
						</Button>
					</div>
				</CardHeader>
				<CardContent className="space-y-2">
					{auditLog.map((a, i) => (
						<div
							key={i}
							className={`text-sm p-3 rounded border ${isDark ? "bg-white/5 border-white/10" : "bg-gray-50 border-gray-200"}`}
						>
							<div className="flex items-start justify-between gap-4">
								<div className="flex-1">
									<span className="font-medium">{a.action}</span>
									{a.description && (
										<span className={isDark ? "text-gray-400" : "text-gray-600"}>
											{" "}
											— {a.description}
										</span>
									)}
								</div>
								<span className={`text-xs whitespace-nowrap ${isDark ? "text-gray-500" : "text-gray-400"}`}>
									{new Date(a.created_at).toLocaleString()}
								</span>
							</div>
						</div>
					))}
					{auditLog.length === 0 && (
						<div className="text-center py-8 text-gray-500">No audit entries found</div>
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
