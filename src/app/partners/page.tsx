"use client";

import { useState } from "react";
import {
	HiOutlineUsers,
	HiOutlineCheckCircle,
	HiOutlineClock,
	HiOutlineCurrencyDollar,
	HiOutlineClipboardCopy,
	HiOutlineDownload,
	HiOutlineEye,
} from "react-icons/hi";
import { IoQrCodeOutline } from "react-icons/io5";
import {
	FaNetworkWired,
	FaFacebook,
	FaTwitter,
	FaLinkedin,
	FaWhatsapp,
	FaEnvelope,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PartnersDashboard() {
	const [referralLink] = useState(
		"https://partner-referral-hub.vercel.app/register?ref=PRT-2025-594589"
	);

	const shareOnSocialMedia = (platform: string) => {
		const text = "Check out this amazing partner referral program!";
		const url = referralLink;

		let shareUrl = "";

		switch (platform) {
			case "facebook":
				shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
					url
				)}&quote=${encodeURIComponent(text)}`;
				break;
			case "twitter":
				shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
					text
				)}&url=${encodeURIComponent(url)}`;
				break;
			case "linkedin":
				shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
					url
				)}`;
				break;
			case "whatsapp":
				shareUrl = `https://wa.me/?text=${encodeURIComponent(
					`${text} ${url}`
				)}`;
				break;
			case "email":
				shareUrl = `mailto:?subject=${encodeURIComponent(
					"Partner Referral Program"
				)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`;
				break;
		}

		if (shareUrl) {
			window.open(shareUrl, "_blank");
		}
	};

	return (
		<>
			{/* Main Content */}
			<main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 w-full max-w-7xl mx-auto">
				{/* Welcome Banner */}
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 text-white">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h2 className="text-xl sm:text-2xl font-bold mb-2">
								Welcome back, VINCENT
							</h2>
							<p className="text-blue-100 text-sm sm:text-base">
								Partner ID: PRT-2025-594589
							</p>
						</div>
						<div className="text-left sm:text-right">
							<p className="text-blue-100 text-sm mb-1">
								Total Earnings
							</p>
							<p className="text-2xl sm:text-3xl font-bold">
								Rp 0,00
							</p>
						</div>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
					{/* Total Referrals */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Total Referrals
							</CardTitle>
							<HiOutlineUsers className="w-4 h-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-gray-900">
								1
							</div>
							<p className="text-xs text-green-600 mt-1">
								+12% from last month
							</p>
						</CardContent>
					</Card>

					{/* Successful Conversions */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Successful Conversions
							</CardTitle>
							<HiOutlineCheckCircle className="w-4 h-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-gray-900">
								0
							</div>
							<p className="text-xs text-gray-500 mt-1">
								0% conversion rate
							</p>
						</CardContent>
					</Card>

					{/* Pending Reviews */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								Pending Reviews
							</CardTitle>
							<HiOutlineClock className="w-4 h-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className="text-xl sm:text-2xl font-bold text-gray-900">
								0
							</div>
							<p className="text-xs text-gray-500 mt-1">
								In progress
							</p>
						</CardContent>
					</Card>

					{/* This Month */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium text-gray-600">
								This Month
							</CardTitle>
							<HiOutlineCurrencyDollar className="w-4 h-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className="text-lg sm:text-2xl font-bold text-gray-900">
								Rp 0,00
							</div>
							<p className="text-xs text-green-600 mt-1">
								+28% vs last month
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Your Referral Tools */}
				<Card className="mb-6 sm:mb-8">
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-2">
							<FaNetworkWired className="w-5 h-5 text-gray-700" />
							<CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
								Your Referral Tools
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
						{/* Unique Referral Link */}
						<div>
							<h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
								Your Unique Referral Link
							</h3>
							<div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 rounded-lg border">
								<input
									type="text"
									value={referralLink}
									readOnly
									className="flex-1 bg-transparent text-xs sm:text-sm text-gray-700 outline-none"
								/>
								<Button
									size="sm"
									//   onClick={() => copyToClipboard(referralLink)}
									className="gap-2 bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 text-xs sm:text-sm"
									variant="ghost"
								>
									<HiOutlineClipboardCopy className="w-4 h-4" />
									<span className="hidden sm:inline">
										Copy Link
									</span>
									<span className="sm:hidden">Copy</span>
								</Button>
							</div>
						</div>

						{/* QR Code */}
						<div>
							<h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
								QR Code for Easy Sharing
							</h3>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
								<Button
									variant="outline"
									size="sm"
									className="gap-2 bg-transparent text-xs sm:text-sm"
								>
									<IoQrCodeOutline className="w-4 h-4" />
									<span className="hidden sm:inline">
										View QR Code
									</span>
									<span className="sm:hidden">View QR</span>
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="gap-2 bg-transparent text-xs sm:text-sm"
								>
									<HiOutlineDownload className="w-4 h-4" />
									<span className="hidden sm:inline">
										Download QR Code
									</span>
									<span className="sm:hidden">Download</span>
								</Button>
							</div>
							<p className="text-xs sm:text-sm text-gray-600 mt-2">
								Share this QR code to make it easy for prospects
								to sign up with your referral
							</p>
						</div>

						{/* Share on Social Media */}
						<div>
							<h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
								Share on Social Media
							</h3>
							<div className="mb-3">
								<p className="text-xs sm:text-sm text-gray-600 mb-2">
									Your Referral Link
								</p>
								<div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 rounded-lg border">
									<input
										type="text"
										value={referralLink}
										readOnly
										className="flex-1 bg-transparent text-xs sm:text-sm text-gray-700 outline-none"
									/>
									<Button
										size="sm"
										//   onClick={() => copyToClipboard(referralLink)}
										className="gap-2 text-xs sm:text-sm"
									>
										<HiOutlineClipboardCopy className="w-4 h-4" />
										Copy
									</Button>
								</div>
							</div>

							<div className="flex gap-2 sm:gap-3 flex-wrap">
								<Button
									onClick={() =>
										shareOnSocialMedia("facebook")
									}
									className="bg-blue-600 hover:bg-blue-700 gap-2 text-xs sm:text-sm"
									size="sm"
								>
									<FaFacebook className="w-4 h-4" />
									<span className="hidden sm:inline">
										Facebook
									</span>
									<span className="sm:hidden">FB</span>
								</Button>
								<Button
									onClick={() =>
										shareOnSocialMedia("twitter")
									}
									className="bg-sky-500 hover:bg-sky-600 gap-2 text-xs sm:text-sm"
									size="sm"
								>
									<FaTwitter className="w-4 h-4" />
									<span className="hidden sm:inline">
										Twitter
									</span>
									<span className="sm:hidden">X</span>
								</Button>
								<Button
									onClick={() =>
										shareOnSocialMedia("linkedin")
									}
									className="bg-blue-700 hover:bg-blue-800 gap-2 text-xs sm:text-sm"
									size="sm"
								>
									<FaLinkedin className="w-4 h-4" />
									<span className="hidden sm:inline">
										LinkedIn
									</span>
									<span className="sm:hidden">LI</span>
								</Button>
								<Button
									onClick={() =>
										shareOnSocialMedia("whatsapp")
									}
									className="bg-green-600 hover:bg-green-700 gap-2 text-xs sm:text-sm"
									size="sm"
								>
									<FaWhatsapp className="w-4 h-4" />
									<span className="hidden sm:inline">
										WhatsApp
									</span>
									<span className="sm:hidden">WA</span>
								</Button>
								<Button
									onClick={() => shareOnSocialMedia("email")}
									className="bg-gray-600 hover:bg-gray-700 gap-2 text-xs sm:text-sm"
									size="sm"
								>
									<FaEnvelope className="w-4 h-4" />
									<span className="hidden sm:inline">
										Email
									</span>
									<span className="sm:hidden">Mail</span>
								</Button>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Recent Referrals */}
				<Card>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
								Recent Referrals
							</CardTitle>
							<Button
								variant="link"
								className="text-blue-600 hover:text-blue-700 p-0 text-sm sm:text-base"
							>
								View All
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0 sm:p-6">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b border-gray-200">
										<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">
											CUSTOMER
										</th>
										<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden sm:table-cell">
											DATE REFERRED
										</th>
										<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm">
											STATUS
										</th>
										<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden lg:table-cell">
											POTENTIAL EARNING
										</th>
										<th className="text-left py-3 px-2 sm:px-4 font-medium text-gray-700 text-xs sm:text-sm hidden md:table-cell">
											ACTION
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="border-b border-gray-100 hover:bg-gray-50">
										<td className="py-3 sm:py-4 px-2 sm:px-4">
											<div className="flex items-center gap-3">
												<div className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
													A
												</div>
												<div>
													<div className="font-medium text-gray-900 text-xs sm:text-sm">
														artha
													</div>
													<div className="text-xs text-gray-600 hidden sm:block">
														artha@gmail.com
													</div>
												</div>
											</div>
										</td>
										<td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
											<span className="text-gray-600 text-xs sm:text-sm">
												Jun 21, 2025
											</span>
										</td>
										<td className="py-3 sm:py-4 px-2 sm:px-4">
											<span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs font-medium">
												Registered
											</span>
										</td>
										<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
											<span className="text-gray-900 font-medium text-xs sm:text-sm">
												Rp 50,000.00
											</span>
										</td>
										<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
											<Button
												variant="link"
												className="text-blue-600 hover:text-blue-700 p-0 gap-1 text-xs sm:text-sm"
											>
												<HiOutlineEye className="w-4 h-4" />
												<span className="hidden sm:inline">
													View Details
												</span>
												<span className="sm:hidden">
													View
												</span>
											</Button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</main>
		</>
	);
}
