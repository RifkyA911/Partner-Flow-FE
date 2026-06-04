"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HiOutlineUsers, HiOutlineDownload } from "react-icons/hi";

interface Referral {
	id: string;
	referred_name: string;
	referred_phone: string;
	commission: number;
	status: string;
	created_at: string;
}

interface ReferralsTableProps {
	referrals: Referral[];
	isDark: boolean;
}

export function ReferralsTable({ referrals, isDark }: ReferralsTableProps) {
	return (
		<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
			<CardHeader className="p-4 sm:p-6">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<HiOutlineUsers className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
						<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
							Recent Referrals
						</CardTitle>
					</div>
					<Button
						size="sm"
						className={`gap-2 text-xs sm:text-sm ${isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
					>
						<HiOutlineDownload className="w-4 h-4" />
						Export
					</Button>
				</div>
			</CardHeader>
			<CardContent className="p-0 sm:p-6">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Name
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Status
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Commission
								</th>
								<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									Date
								</th>
							</tr>
						</thead>
						<tbody>
							{referrals.map((referral) => (
								<tr key={referral.id} className={`border-b ${isDark ? "border-white/5 hover:bg-white/5" : "border-gray-100 hover:bg-gray-50"}`}>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<div className="flex items-center gap-3">
											<div className={`w-8 h-8 text-white rounded-full flex items-center justify-center font-semibold text-sm ${isDark ? "bg-blue-600" : "bg-gray-600"}`}>
												{referral.referred_name.charAt(0).toUpperCase()}
											</div>
											<div>
												<div className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
													{referral.referred_name}
												</div>
												<div className={`text-xs hidden sm:block ${isDark ? "text-gray-400" : "text-gray-600"}`}>
													{referral.referred_phone}
												</div>
											</div>
										</div>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${referral.status === 'pending' ? 'bg-blue-500/20 text-blue-400' :
											referral.status === 'approved' ? 'bg-green-500/20 text-green-400' :
												referral.status === 'converted' ? 'bg-purple-500/20 text-purple-400' :
													'bg-red-500/20 text-red-400'
											}`}>
											{referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
										</span>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4">
										<span className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
											Rp {referral.commission.toLocaleString('id-ID')}
										</span>
									</td>
									<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
										<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
										</span>
									</td>
								</tr>
							))}
							{referrals.length === 0 && (
								<tr>
									<td colSpan={4} className={`py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										No referrals yet
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</CardContent>
		</Card>
	);
}
