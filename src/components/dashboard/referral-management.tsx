"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";

interface Referral {
	id: string;
	referred_name: string;
	referred_phone: string;
	commission: number;
	status: string;
	created_at: string;
	referral_code?: string;
	partner?: {
		company_name: string;
	};
}

interface ReferralManagementProps {
	referrals: Referral[];
	isDark: boolean;
}

export function ReferralManagement({ referrals, isDark }: ReferralManagementProps) {
	const [convertDialogOpen, setConvertDialogOpen] = useState(false);
	const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
	const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

	const pendingCount = referrals.filter((r) => r.status === 'pending').length;

	const handleConvert = (referral: Referral) => {
		setSelectedReferral(referral);
		setConvertDialogOpen(true);
	};

	const handleDecline = (referral: Referral) => {
		setSelectedReferral(referral);
		setDeclineDialogOpen(true);
	};

	const confirmConvert = () => {
		// TODO: Call API to convert referral to partner
		console.log("Converting referral:", selectedReferral?.id);
		setConvertDialogOpen(false);
		setSelectedReferral(null);
	};

	const confirmDecline = () => {
		// TODO: Call API to decline referral
		console.log("Declining referral:", selectedReferral?.id);
		setDeclineDialogOpen(false);
		setSelectedReferral(null);
	};

	return (
		<>
			<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
				<CardHeader className="p-4 sm:p-6">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Referral Management
							</CardTitle>
							<p className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Review and approve pending referrals
							</p>
						</div>
						<div className={`${isDark ? "bg-white/10 text-gray-300" : "bg-gray-100 text-gray-700"} px-3 py-1 rounded-full text-sm font-medium w-fit`}>
							{pendingCount} pending
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-4 sm:p-6">
					<div className="space-y-4 sm:space-y-6">
						{referrals.map((referral) => (
							<div key={referral.id} className={`border rounded-lg p-4 sm:p-6 ${isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-white"}`}>
								<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
											{referral.referred_name.charAt(0).toUpperCase()}
										</div>
										<div>
											<h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
												{referral.referred_name}
											</h3>
											<p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
												{referral.partner?.company_name}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<div className={`w-2 h-2 rounded-full ${referral.status === 'pending' ? 'bg-orange-500' :
											referral.status === 'approved' ? 'bg-green-500' :
												referral.status === 'converted' ? 'bg-purple-500' :
													'bg-red-500'
											}`}></div>
										<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											{referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
										</span>
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
									<div>
										<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
											Phone:
										</p>
										<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
											{referral.referred_phone}
										</p>
									</div>
									<div>
										<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
											Commission:
										</p>
										<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
											Rp {referral.commission.toLocaleString('id-ID')}
										</p>
									</div>
									<div>
										<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
											Created:
										</p>
										<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
											{new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
										</p>
									</div>
									<div>
										<p className={`text-xs sm:text-sm ${isDark ? "text-gray-500" : "text-gray-500"}`}>
											Referral Code:
										</p>
										<p className={`text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
											{referral.referral_code}
										</p>
									</div>
								</div>

								{referral.status === 'pending' && (
									<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
										<p className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
											Referred by:{" "}
											<span className="font-medium">
												{referral.partner?.company_name}
											</span>
										</p>
										<div className="flex flex-col sm:flex-row gap-2">
											<Button
												onClick={() => handleConvert(referral)}
												className="bg-green-600 hover:bg-green-700 text-white gap-2 text-xs sm:text-sm"
											>
												<HiOutlineCheckCircle className="w-4 h-4" />
												Convert to Partner
											</Button>
											<Button
												onClick={() => handleDecline(referral)}
												variant="outline"
												className="text-red-600 border-red-600 hover:bg-red-50 gap-2 bg-transparent text-xs sm:text-sm"
											>
												<HiOutlineXCircle className="w-4 h-4" />
												Decline
											</Button>
										</div>
									</div>
								)}
							</div>
						))}
						{referrals.length === 0 && (
							<div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
								No referrals yet
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Convert Dialog */}
			<Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
				<DialogContent className={isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-200"}>
					<DialogHeader>
						<DialogTitle>Convert to Partner</DialogTitle>
						<DialogDescription className={isDark ? "text-gray-400" : "text-gray-600"}>
							Are you sure you want to convert {selectedReferral?.referred_name} to a partner? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setConvertDialogOpen(false)}
							className={isDark ? "border-white/10 text-gray-300 hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-100"}
						>
							Cancel
						</Button>
						<Button onClick={confirmConvert} className="bg-green-600 hover:bg-green-700 text-white">
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Decline Dialog */}
			<Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
				<DialogContent className={isDark ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-200"}>
					<DialogHeader>
						<DialogTitle>Decline Referral</DialogTitle>
						<DialogDescription className={isDark ? "text-gray-400" : "text-gray-600"}>
							Are you sure you want to decline {selectedReferral?.referred_name}'s referral? This action cannot be undone.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeclineDialogOpen(false)}
							className={isDark ? "border-white/10 text-gray-300 hover:bg-white/10" : "border-gray-200 text-gray-700 hover:bg-gray-100"}
						>
							Cancel
						</Button>
						<Button onClick={confirmDecline} className="bg-red-600 hover:bg-red-700 text-white">
							Decline
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
