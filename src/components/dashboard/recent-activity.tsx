"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Clock, CheckCircle, AlertCircle, UserPlus, DollarSign, Shield, Settings } from "lucide-react";

interface ActivityItem {
	action: string;
	description?: string;
	created_at: string;
}

interface RecentActivityProps {
	activities: ActivityItem[];
	isDark: boolean;
}

export function RecentActivity({ activities, isDark }: RecentActivityProps) {
	const formatActionName = (action: string) => {
		return action
			.replace(/_/g, " ")
			.split(" ")
			.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

	const getActionIcon = (action: string) => {
		const actionLower = action.toLowerCase();
		if (actionLower.includes("create") || actionLower.includes("register") || actionLower.includes("signup")) {
			return <UserPlus className="w-6 h-6 text-white" />;
		}
		if (actionLower.includes("approve") || actionLower.includes("accept")) {
			return <CheckCircle className="w-6 h-6 text-white" />;
		}
		if (actionLower.includes("reject") || actionLower.includes("decline") || actionLower.includes("deny")) {
			return <AlertCircle className="w-6 h-6 text-white" />;
		}
		if (actionLower.includes("payment") || actionLower.includes("withdraw") || actionLower.includes("payout")) {
			return <DollarSign className="w-6 h-6 text-white" />;
		}
		if (actionLower.includes("admin") || actionLower.includes("permission") || actionLower.includes("role")) {
			return <Shield className="w-6 h-6 text-white" />;
		}
		if (actionLower.includes("update") || actionLower.includes("edit") || actionLower.includes("modify")) {
			return <Settings className="w-6 h-6 text-white" />;
		}
		return <Clock className="w-6 h-6 text-white" />;
	};

	const getActionGradient = (action: string) => {
		const actionLower = action.toLowerCase();
		if (actionLower.includes("create") || actionLower.includes("register")) {
			return "from-blue-500 to-cyan-500";
		}
		if (actionLower.includes("approve")) {
			return "from-green-500 to-emerald-500";
		}
		if (actionLower.includes("reject")) {
			return "from-red-500 to-rose-500";
		}
		if (actionLower.includes("payment") || actionLower.includes("withdraw")) {
			return "from-amber-500 to-orange-500";
		}
		if (actionLower.includes("admin")) {
			return "from-purple-500 to-pink-500";
		}
		return "from-gray-500 to-slate-500";
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
		return date.toLocaleDateString();
	};

	return (
		<Card className={`${isDark ? "bg-slate-800/50 border-indigo-500/20" : "bg-white border-indigo-200"} shadow-lg hover:shadow-xl transition-all duration-300`}>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg font-bold flex items-center gap-2">
						<div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
							<Zap className="w-5 h-5 text-white" />
						</div>
						Recent Activity
					</CardTitle>
					<span className={`text-xs px-3 py-1 rounded-full font-medium ${isDark ? "bg-indigo-500/20 text-indigo-300" : "bg-indigo-100 text-indigo-700"}`}>
						Last 5 entries
					</span>
				</div>
			</CardHeader>
			<CardContent className="space-y-3">
				{activities.slice(0, 5).map((activity, index) => (
					<div
						key={index}
						className={`group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${isDark ? "bg-slate-900/50 border-white/10" : "bg-gray-50 border-gray-200"}`}
					>
						<div className={`absolute inset-0 bg-gradient-to-r ${getActionGradient(activity.action)} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
						<div className="relative p-4">
							<div className="flex items-start gap-4">
								<div className={`w-14 h-14 bg-gradient-to-br ${getActionGradient(activity.action)} rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0 ring-4 ring-offset-2 ${isDark ? "ring-white/10 ring-offset-slate-900" : "ring-gray-100 ring-offset-white"}`}>
									{getActionIcon(activity.action)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-start justify-between gap-2 mb-1">
										<h4 className={`font-bold text-base truncate ${isDark ? "text-white" : "text-gray-900"}`}>
											{formatActionName(activity.action)}
										</h4>
										<span className={`text-xs font-bold px-2 py-1 rounded-full whitespace-nowrap ${isDark ? "bg-white/10 text-gray-400" : "bg-gray-200 text-gray-600"}`}>
											{formatDate(activity.created_at)}
										</span>
									</div>
									{activity.description && (
										<p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{activity.description}
										</p>
									)}
								</div>
							</div>
						</div>
					</div>
				))}
				{!activities.length && (
					<div className={`text-center py-12 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
						<Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
						<p className="text-sm font-medium">No recent activity</p>
						<p className="text-xs mt-1">Activity will appear here as actions are performed</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
