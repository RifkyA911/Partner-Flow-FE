"use client";

import { Session } from "next-auth";
import { HiOutlineUsers, HiOutlineCheckCircle, HiOutlineClock, HiOutlineCurrencyDollar } from "react-icons/hi";
import { StatsCard } from "./stats-card";
import { ReferralTools } from "./referral-tools";
import { ReferralsTable } from "./referrals-table";

interface PartnerDashboardProps {
	session: Session | null;
	stats: {
		total_referrals: number;
		successful_conversions: number;
		pending_reviews: number;
		this_month: number;
	};
	referralLink: string;
	referrals: any[];
	isDark: boolean;
	onCopy: (text: string) => void;
	onShare: (platform: string) => void;
}

export function PartnerDashboard({
	session,
	stats,
	referralLink,
	referrals,
	isDark,
	onCopy,
	onShare
}: PartnerDashboardProps) {
	return (
		<>
			{/* Welcome Banner */}
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-bold mb-2">
							Welcome back, {session?.user?.name || 'Partner'}
						</h2>
						<p className="text-blue-100 text-sm sm:text-base">
							Partner ID: {session?.user?.partner_code || 'N/A'}
						</p>
					</div>
					<div className="text-left sm:text-right">
						<p className="text-blue-100 text-sm mb-1">
							Total Earnings
						</p>
						<p className="text-2xl sm:text-3xl font-bold">
							Rp {stats.this_month.toLocaleString('id-ID')}
						</p>
					</div>
				</div>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
				<StatsCard
					icon={<HiOutlineUsers />}
					title="Total Referrals"
					value={stats.total_referrals}
					subtitle="All time"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCheckCircle />}
					title="Converted"
					value={stats.successful_conversions}
					subtitle="Successful"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineClock />}
					title="Pending"
					value={stats.pending_reviews}
					subtitle="Awaiting review"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCurrencyDollar />}
					title="This Month"
					value={`Rp ${stats.this_month.toLocaleString('id-ID')}`}
					subtitle="Earnings"
					isDark={isDark}
				/>
			</div>

			{/* Referral Tools */}
			<ReferralTools
				referralLink={referralLink}
				isDark={isDark}
				onCopy={onCopy}
				onShare={onShare}
			/>

			{/* Recent Referrals */}
			<ReferralsTable
				referrals={referrals}
				isDark={isDark}
			/>
		</>
	);
}
