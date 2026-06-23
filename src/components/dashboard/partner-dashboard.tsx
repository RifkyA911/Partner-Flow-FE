"use client";

import { Session } from "next-auth";
import {
	HiOutlineUsers,
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineCurrencyDollar,
} from "react-icons/hi";
import { StatsCard } from "./stats-card";
import { ReferralTools } from "./referral-tools";
import { ReferralsTable } from "./referrals-table";

export interface PartnerStats {
	total_referrals: number;
	successful_conversions: number;
	pending_reviews: number;
	this_month: number;
	commission_paid?: number;
	commission_pending?: number;
	commission_awaiting_approval?: number;
	commission_available?: number;
	commission_locked?: number;
	in_pipeline?: number;
	referred_partners?: number;
}

interface PartnerDashboardProps {
	session: Session | null;
	stats: PartnerStats;
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
	onShare,
}: PartnerDashboardProps) {
	return (
		<div className="space-y-6 animate-fade-in">
			<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white transition-all duration-300 hover:shadow-lg">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div>
						<h2 className="text-xl sm:text-2xl font-bold mb-2">
							Welcome back, {session?.user?.name || "Partner"}
						</h2>
						<p className="text-blue-100 text-sm sm:text-base">
							Partner ID: {session?.user?.partner_code || "N/A"}
						</p>
					</div>
					<div className="text-left sm:text-right">
						<p className="text-blue-100 text-sm mb-1">Total paid earnings</p>
						<p className="text-2xl sm:text-3xl font-bold">
							Rp {(stats.commission_paid ?? 0).toLocaleString("id-ID")}
						</p>
					</div>
				</div>
			</div>

			<div
				className={`rounded-lg p-4 mb-6 text-sm ${isDark ? "bg-white/5 border border-white/10" : "bg-blue-50 border border-blue-100"
					}`}
			>
				<p className={`font-medium mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
					Enterprise referral pipeline
				</p>
				<ol className={`space-y-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
					<li>1. <strong>Registration</strong> — attribution recorded (no commission yet)</li>
					<li>2. <strong>Admin review</strong> — {stats.in_pipeline ?? 0} in validation pipeline</li>
					<li>3. <strong>Business validation</strong> — store activation / first order / RM approval</li>
					<li>4. <strong>Commission generated</strong> — Rp {(stats.commission_available ?? 0).toLocaleString("id-ID")} available</li>
					<li>5. <strong>Withdrawal</strong> — finance approval → Xendit payout</li>
				</ol>
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 sm:mb-8">
				<StatsCard
					icon={<HiOutlineUsers />}
					title="Referrals"
					value={stats.total_referrals}
					subtitle={`${stats.referred_partners ?? 0} partners joined`}
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCheckCircle />}
					title="Commissions"
					value={stats.successful_conversions}
					subtitle="Business-validated"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineClock />}
					title="In pipeline"
					value={`Rp ${(stats.commission_awaiting_approval ?? 0).toLocaleString("id-ID")}`}
					subtitle="Not yet generated"
					isDark={isDark}
				/>
				<StatsCard
					icon={<HiOutlineCurrencyDollar />}
					title="Available"
					value={`Rp ${(stats.commission_available ?? 0).toLocaleString("id-ID")}`}
					subtitle="Ready to withdraw"
					isDark={isDark}
				/>
			</div>

			<ReferralTools
				referralLink={referralLink}
				isDark={isDark}
				onCopy={onCopy}
				onShare={onShare}
			/>

			<ReferralsTable referrals={referrals} isDark={isDark} />
		</div>
	);
}
