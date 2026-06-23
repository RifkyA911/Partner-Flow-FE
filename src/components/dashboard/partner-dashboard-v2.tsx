"use client";

import { Session } from "next-auth";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Lottie from "lottie-react";
import {
	FaUsers,
	FaCheckCircle,
	FaClock,
	FaDollarSign,
	FaTrophy,
	FaChartLine,
	FaShareAlt,
	FaCopy,
	FaQrcode,
	FaFacebook,
	FaTwitter,
	FaLinkedin,
	FaWhatsapp,
	FaEnvelope,
	FaWallet,
	FaArrowRight,
	FaStar,
	FaFire,
	FaRocket,
	FaGem,
	FaCrown,
} from "react-icons/fa";
import { IoMdTrendingUp, IoMdTrendingDown } from "react-icons/io";
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

export function PartnerDashboardV2({
	session,
	stats,
	referralLink,
	referrals,
	isDark,
	onCopy,
	onShare,
}: PartnerDashboardProps) {
	const [showWithdrawModal, setShowWithdrawModal] = useState(false);
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [isWithdrawing, setIsWithdrawing] = useState(false);

	const handleWithdraw = async () => {
		setIsWithdrawing(true);
		try {
			const res = await fetch('/api/withdraw', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount: parseFloat(withdrawAmount) }),
			});
			const data = await res.json();
			if (data.success) {
				// Show success message
				alert('Withdrawal request submitted successfully!');
			} else {
				alert(data.error || 'Withdrawal failed');
			}
		} catch (error) {
			alert('An error occurred during withdrawal');
		} finally {
			setIsWithdrawing(false);
			setShowWithdrawModal(false);
			setWithdrawAmount('');
		}
	};

	const availableBalance = stats.commission_available || 0;
	const totalPaid = stats.commission_paid || 0;
	const pendingBalance = stats.commission_pending || 0;

	return (
		<TooltipProvider>
			<div className="space-y-6 animate-fade-in">
				{/* Welcome Banner */}
				<div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h2 className="text-xl font-semibold mb-1">
								Welcome, {session?.user?.name || "Partner"}
							</h2>
							<p className="text-purple-100 text-sm">
								Partner ID: {session?.user?.partner_code || "N/A"}
							</p>
						</div>
						<div className="text-left sm:text-right">
							<div className="text-sm text-purple-100 mb-1">Total Earnings</div>
							<div className="text-2xl font-semibold">
								Rp {totalPaid.toLocaleString('id-ID')}
							</div>
						</div>
					</div>
				</div>

				{/* Quick Stats Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					<Card className={`${isDark ? "bg-slate-800/50 border-purple-500/20" : "bg-white border-purple-200"} hover:shadow-md transition-shadow`}>
						<CardContent className="p-5">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
										<FaUsers className="w-5 h-5 text-white" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Total Referrals</span>
								</div>
								<IoMdTrendingUp className="w-4 h-4 text-purple-500" />
							</div>
							<div className="text-2xl font-semibold">{stats.total_referrals}</div>
						</CardContent>
					</Card>

					<Card className={`${isDark ? "bg-slate-800/50 border-green-500/20" : "bg-white border-green-200"} hover:shadow-md transition-shadow`}>
						<CardContent className="p-5">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
										<FaCheckCircle className="w-5 h-5 text-white" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Successful Conversions</span>
								</div>
								<IoMdTrendingUp className="w-4 h-4 text-green-500" />
							</div>
							<div className="text-2xl font-semibold">{stats.successful_conversions}</div>
						</CardContent>
					</Card>

					<Card className={`${isDark ? "bg-slate-800/50 border-amber-500/20" : "bg-white border-amber-200"} hover:shadow-md transition-shadow`}>
						<CardContent className="p-5">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
										<FaClock className="w-5 h-5 text-white" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Pending Reviews</span>
								</div>
								<IoMdTrendingUp className="w-4 h-4 text-amber-500" />
							</div>
							<div className="text-2xl font-semibold">{stats.pending_reviews}</div>
						</CardContent>
					</Card>

					<Card className={`${isDark ? "bg-slate-800/50 border-purple-500/20" : "bg-white border-purple-200"} hover:shadow-md transition-shadow`}>
						<CardContent className="p-5">
							<div className="flex items-center justify-between mb-3">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
										<FaDollarSign className="w-5 h-5 text-white" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>This Month</span>
								</div>
								<IoMdTrendingUp className="w-4 h-4 text-purple-500" />
							</div>
							<div className="text-2xl font-semibold">Rp {stats.this_month.toLocaleString('id-ID')}</div>
						</CardContent>
					</Card>
				</div>

				{/* Wallet Section */}
				<Card className={`${isDark ? "bg-slate-800/50 border-purple-500/20" : "bg-white border-purple-200"} hover:shadow-md transition-shadow`}>
					<CardHeader className="p-6">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
									<FaWallet className="w-5 h-5 text-white" />
								</div>
								<CardTitle className={`text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
									Wallet Overview
								</CardTitle>
							</div>
							<Button
								onClick={() => setShowWithdrawModal(true)}
								className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white transition-all duration-300 hover:scale-105"
							>
								<FaArrowRight className="w-4 h-4 mr-2" />
								Withdraw
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-6">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900/50 border-purple-500/20" : "bg-purple-50 border-purple-200"}`}>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
										<FaCheckCircle className="w-4 h-4 text-purple-500" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Available Balance</span>
								</div>
								<div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
									Rp {availableBalance.toLocaleString('id-ID')}
								</div>
								<p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Ready for withdrawal
								</p>
							</div>

							<div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900/50 border-amber-500/20" : "bg-amber-50 border-amber-200"}`}>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
										<FaClock className="w-4 h-4 text-amber-500" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Pending Balance</span>
								</div>
								<div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
									Rp {pendingBalance.toLocaleString('id-ID')}
								</div>
								<p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Awaiting approval
								</p>
							</div>

							<div className={`p-6 rounded-xl border ${isDark ? "bg-slate-900/50 border-purple-500/20" : "bg-purple-50 border-purple-200"}`}>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
										<FaTrophy className="w-4 h-4 text-purple-500" />
									</div>
									<span className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>Total Paid</span>
								</div>
								<div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
									Rp {totalPaid.toLocaleString('id-ID')}
								</div>
								<p className={`text-xs mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Lifetime earnings
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Referral Tools */}
				<ReferralTools
					referralLink={referralLink}
					isDark={isDark}
					onCopy={onCopy}
					onShare={onShare}
				/>

				{/* Referrals Table */}
				<ReferralsTable referrals={referrals} isDark={isDark} />

				{/* Withdraw Modal */}
				{showWithdrawModal && (
					<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
						<Card className={`${isDark ? "bg-slate-900 border-white/10" : "bg-white border-gray-200"} w-full max-w-md`}>
							<CardHeader>
								<CardTitle className={`${isDark ? "text-white" : "text-gray-900"}`}>Withdraw Funds</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<label className={`text-sm font-medium mb-2 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Available Balance
									</label>
									<div className={`p-4 rounded-lg border ${isDark ? "bg-slate-800 border-white/10" : "bg-gray-50 border-gray-200"}`}>
										<div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
											Rp {availableBalance.toLocaleString('id-ID')}
										</div>
									</div>
								</div>
								<div>
									<label className={`text-sm font-medium mb-2 block ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Withdrawal Amount
									</label>
									<input
										type="number"
										value={withdrawAmount}
										onChange={(e) => setWithdrawAmount(e.target.value)}
										placeholder="Enter amount"
										className={`w-full p-3 rounded-lg border ${isDark ? "bg-slate-800 border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-900"}`}
									/>
								</div>
								<div className="flex gap-3">
									<Button
										variant="outline"
										onClick={() => setShowWithdrawModal(false)}
										className={`flex-1 ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
									>
										Cancel
									</Button>
									<Button
										onClick={handleWithdraw}
										disabled={isWithdrawing || !withdrawAmount}
										className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
									>
										{isWithdrawing ? "Processing..." : "Withdraw"}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>
		</TooltipProvider>
	);
}
