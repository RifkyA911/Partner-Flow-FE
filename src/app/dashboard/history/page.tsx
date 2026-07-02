"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/layouts/dashboard-layout";
import { FaHistory, FaFilter, FaChevronLeft, FaChevronRight, FaArrowDown, FaArrowUp, FaWallet, FaUserPlus } from "react-icons/fa";

interface HistoryItem {
	id: string;
	type: "referral" | "commission" | "withdrawal" | "bonus";
	title: string;
	description: string;
	amount?: number;
	status: string;
	created_at: string;
	icon: string;
}

export default function HistoryPage() {
	const { data: session } = useSession();
	const [loading, setLoading] = useState(false);
	const [history, setHistory] = useState<HistoryItem[]>([]);
	const [isDark, setIsDark] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();
		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
		return () => observer.disconnect();
	}, []);

	const fetchHistory = useCallback(async () => {
		setLoading(true);
		try {
			// TODO: Replace with actual API call
			// const res = await fetch(`${baseUrl}/api/history`);
			// const data = await res.json();
			// if (data.success) {
			// 	setHistory(data.data.history);
			// }

			// Mock data for now
			setHistory([
				{
					id: "1",
					type: "commission",
					title: "Commission Earned",
					description: "Commission from referral John Doe",
					amount: 500000,
					status: "completed",
					created_at: "2024-03-15T10:30:00Z",
					icon: "arrow-down",
				},
				{
					id: "2",
					type: "referral",
					title: "New Referral",
					description: "Referred Jane Smith",
					status: "pending",
					created_at: "2024-03-14T14:20:00Z",
					icon: "user-plus",
				},
				{
					id: "3",
					type: "withdrawal",
					title: "Withdrawal Request",
					description: "Withdraw Rp 2,000,000 to bank account",
					amount: 2000000,
					status: "processing",
					created_at: "2024-03-13T09:15:00Z",
					icon: "wallet",
				},
				{
					id: "4",
					type: "bonus",
					title: "Performance Bonus",
					description: "Monthly performance bonus",
					amount: 1000000,
					status: "completed",
					created_at: "2024-03-01T00:00:00Z",
					icon: "arrow-down",
				},
				{
					id: "5",
					type: "commission",
					title: "Commission Earned",
					description: "Commission from referral Bob Wilson",
					amount: 750000,
					status: "completed",
					created_at: "2024-02-28T16:45:00Z",
					icon: "arrow-down",
				},
				{
					id: "6",
					type: "referral",
					title: "New Referral",
					description: "Referred Alice Johnson",
					status: "converted",
					created_at: "2024-02-25T11:30:00Z",
					icon: "user-plus",
				},
				{
					id: "7",
					type: "withdrawal",
					title: "Withdrawal Request",
					description: "Withdraw Rp 1,500,000 to bank account",
					amount: 1500000,
					status: "completed",
					created_at: "2024-02-20T08:00:00Z",
					icon: "wallet",
				},
			]);
		} catch {
			console.error("Failed to load history");
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchHistory();
	}, [fetchHistory]);

	const getIcon = (iconName: string) => {
		switch (iconName) {
			case "arrow-down":
				return <FaArrowDown className="w-5 h-5" />;
			case "arrow-up":
				return <FaArrowUp className="w-5 h-5" />;
			case "wallet":
				return <FaWallet className="w-5 h-5" />;
			case "user-plus":
				return <FaUserPlus className="w-5 h-5" />;
			default:
				return <FaHistory className="w-5 h-5" />;
		}
	};

	const getTypeColor = (type: string) => {
		switch (type) {
			case "commission":
				return "from-green-500 to-emerald-500";
			case "referral":
				return "from-blue-500 to-cyan-500";
			case "withdrawal":
				return "from-orange-500 to-red-500";
			case "bonus":
				return "from-purple-500 to-pink-500";
			default:
				return "from-gray-500 to-gray-600";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/20 text-green-400";
			case "processing":
				return "bg-blue-500/20 text-blue-400";
			case "pending":
				return "bg-yellow-500/20 text-yellow-400";
			case "converted":
				return "bg-purple-500/20 text-purple-400";
			case "failed":
				return "bg-red-500/20 text-red-400";
			default:
				return "bg-gray-500/20 text-gray-400";
		}
	};

	const filteredHistory = history.filter((item) => {
		const matchesSearch =
			item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
			item.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = typeFilter === "all" || item.type === typeFilter;
		return matchesSearch && matchesType;
	});

	const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
	const paginatedHistory = filteredHistory.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "Just now";
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
	};

	if (session?.user?.role !== "partner") {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<p className="text-gray-500">Access denied. Partners only.</p>
			</div>
		);
	}

	return (
		<DashboardLayout>
			<div className="space-y-6">
				{/* Header */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<div className="flex items-center gap-3">
								<div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? "bg-gradient-to-br from-blue-500 to-purple-600" : "bg-gradient-to-br from-blue-600 to-purple-700"}`}>
									<FaHistory className="w-5 h-5 text-white" />
								</div>
								<div>
									<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										Transaction History
									</CardTitle>
									<CardDescription className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										View all your referrals, commissions, and withdrawals
									</CardDescription>
								</div>
							</div>
							<Button
								onClick={fetchHistory}
								disabled={loading}
								variant="outline"
								className={`gap-2 ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
							>
								Refresh
							</Button>
						</div>
					</CardHeader>
				</Card>

				{/* Filters */}
				<div className="flex flex-col sm:flex-row gap-3">
					<div className="relative flex-1">
						<Input
							placeholder="Search history..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
							className={`pl-10 ${isDark ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500" : "bg-gray-50 border-gray-200"}`}
						/>
						<FaFilter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
					</div>
					<Select
						value={typeFilter}
						onValueChange={(value) => {
							setTypeFilter(value);
							setCurrentPage(1);
						}}
					>
						<SelectTrigger className={`w-full sm:w-[180px] ${isDark ? "bg-white/5 border-white/10 text-white" : "bg-gray-50 border-gray-200"}`}>
							<SelectValue placeholder="Filter by type" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Types</SelectItem>
							<SelectItem value="referral">Referrals</SelectItem>
							<SelectItem value="commission">Commissions</SelectItem>
							<SelectItem value="withdrawal">Withdrawals</SelectItem>
							<SelectItem value="bonus">Bonuses</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* History List */}
				<Card className={`${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardContent className="p-0">
						<div className="divide-y divide-white/10">
							{paginatedHistory.map((item) => (
								<div
									key={item.id}
									className={`p-4 sm:p-6 transition-colors ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
								>
									<div className="flex items-start gap-4">
										<div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${getTypeColor(item.type)}`}>
											<span className="text-white">{getIcon(item.icon)}</span>
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-start justify-between gap-2 mb-1">
												<h3 className={`font-semibold text-base ${isDark ? "text-white" : "text-gray-900"}`}>
													{item.title}
												</h3>
												{item.amount && (
													<span className={`font-bold ${item.type === "withdrawal" ? "text-red-500" : "text-green-500"}`}>
														{item.type === "withdrawal" ? "-" : "+"}Rp {item.amount.toLocaleString("id-ID")}
													</span>
												)}
											</div>
											<p className={`text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												{item.description}
											</p>
											<div className="flex items-center gap-2">
												<span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
													{item.status.charAt(0).toUpperCase() + item.status.slice(1)}
												</span>
												<span className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>
													{formatDate(item.created_at)}
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
							{paginatedHistory.length === 0 && (
								<div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
									<FaHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
									<p>No history found</p>
								</div>
							)}
						</div>
					</CardContent>
				</Card>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex items-center justify-between">
						<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
							Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredHistory.length)} of {filteredHistory.length} results
						</div>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(currentPage - 1)}
								disabled={currentPage === 1}
								className={`gap-2 ${isDark ? "border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-50" : "border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50"}`}
							>
								<FaChevronLeft className="w-4 h-4" />
								Previous
							</Button>
							{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
								<Button
									key={page}
									variant={currentPage === page ? "default" : "outline"}
									size="sm"
									onClick={() => handlePageChange(page)}
									className={`w-8 h-8 ${currentPage === page ? "bg-blue-600 hover:bg-blue-700 text-white" : isDark ? "border-white/10 text-gray-300 hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-100"}`}
								>
									{page}
								</Button>
							))}
							<Button
								variant="outline"
								size="sm"
								onClick={() => handlePageChange(currentPage + 1)}
								disabled={currentPage === totalPages}
								className={`gap-2 ${isDark ? "border-white/10 text-gray-300 hover:bg-white/10 disabled:opacity-50" : "border-gray-200 text-gray-700 hover:bg-gray-100 disabled:opacity-50"}`}
							>
								Next
								<FaChevronRight className="w-4 h-4" />
							</Button>
						</div>
					</div>
				)}
			</div>
		</DashboardLayout>
	);
}
