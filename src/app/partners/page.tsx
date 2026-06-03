"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
	interface Referral {
		id: string;
		referred_name: string;
		referred_phone: string;
		commission: number;
		status: string;
		created_at: string;
	}

	const router = useRouter();
	const { data: session, status } = useSession();
	const [isDark, setIsDark] = useState(true);
	const [referralLink, setReferralLink] = useState("");
	const [referrals, setReferrals] = useState<Referral[]>([]);
	const [stats, setStats] = useState({
		total_referrals: 0,
		successful_conversions: 0,
		pending_reviews: 0,
		this_month: 0,
	});

	useEffect(() => {
		const checkTheme = () => setIsDark(document.documentElement.classList.contains("dark"));
		checkTheme();

		const observer = new MutationObserver(checkTheme);
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/login");
			return;
		}

		if (session?.user) {
			// Set referral link
			const link = `https://partner-referral-hub.vercel.app/register?ref=${session.user.partner_code}`;
			setReferralLink(link);

			// Fetch referrals
			fetchReferrals(session.user.id);
		}
	}, [session, status, router]);

	const fetchReferrals = async (partnerId: string) => {
		try {
			const res = await fetch(`/api/referrals?partner_id=${partnerId}`);
			const data = await res.json();
			if (data.success) {
				setReferrals(data.data.referrals);
				setStats({
					total_referrals: data.data.referrals.length,
					successful_conversions: data.data.referrals.filter((r: Referral) => r.status === 'converted').length,
					pending_reviews: data.data.referrals.filter((r: Referral) => r.status === 'pending').length,
					this_month: data.data.referrals.filter((r: Referral) => r.status === 'converted').length * 50000,
				});
			}
		} catch (error) {
			console.error("Failed to fetch referrals:", error);
		}
	};

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
			<main className={`px-4 sm:px-6 lg:px-8 rounded-md lg:py-8 my-8 sm:py-6 w-full max-w-7xl mx-auto ${isDark ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>
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
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
					{/* Total Referrals */}
					<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
								Total Referrals
							</CardTitle>
							<HiOutlineUsers className="w-4 h-4 text-blue-600" />
						</CardHeader>
						<CardContent>
							<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
								{stats.total_referrals}
							</div>
							<p className="text-xs text-green-600 mt-1">
								+12% from last month
							</p>
						</CardContent>
					</Card>

					{/* Successful Conversions */}
					<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
								Successful Conversions
							</CardTitle>
							<HiOutlineCheckCircle className="w-4 h-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
								{stats.successful_conversions}
							</div>
							<p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
								{stats.total_referrals > 0 ? Math.round((stats.successful_conversions / stats.total_referrals) * 100) : 0}% conversion rate
							</p>
						</CardContent>
					</Card>

					{/* Pending Reviews */}
					<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
								Pending Reviews
							</CardTitle>
							<HiOutlineClock className="w-4 h-4 text-orange-600" />
						</CardHeader>
						<CardContent>
							<div className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
								{stats.pending_reviews}
							</div>
							<p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
								In progress
							</p>
						</CardContent>
					</Card>

					{/* This Month */}
					<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-600"}`}>
								This Month
							</CardTitle>
							<HiOutlineCurrencyDollar className="w-4 h-4 text-green-600" />
						</CardHeader>
						<CardContent>
							<div className={`text-lg sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
								Rp {stats.this_month.toLocaleString('id-ID')}
							</div>
							<p className="text-xs text-green-600 mt-1">
								+28% vs last month
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Your Referral Tools */}
				<Card className={`mb-6 sm:mb-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex items-center gap-2">
							<FaNetworkWired className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
							<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Your Referral Tools
							</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
						{/* Unique Referral Link */}
						<div>
							<h3 className={`font-medium mb-3 text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
								Your Unique Referral Link
							</h3>
							<div className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border ${isDark ? "bg-slate-900 border-white/10" : "bg-gray-50 border-gray-200"}`}>
								<input
									type="text"
									value={referralLink}
									readOnly
									className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${isDark ? "text-gray-300" : "text-gray-700"}`}
								/>
								<Button
									size="sm"
									className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"}`}
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
							<h3 className={`font-medium mb-3 text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
								QR Code for Easy Sharing
							</h3>
							<div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
								<Button
									variant="outline"
									size="sm"
									className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
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
									className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
								>
									<HiOutlineDownload className="w-4 h-4" />
									<span className="hidden sm:inline">
										Download QR Code
									</span>
									<span className="sm:hidden">Download</span>
								</Button>
							</div>
							<p className={`text-xs sm:text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								Share this QR code to make it easy for prospects
								to sign up with your referral
							</p>
						</div>

						{/* Share on Social Media */}
						<div>
							<h3 className={`font-medium mb-3 text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
								Share on Social Media
							</h3>
							<div className="mb-3">
								<p className={`text-xs sm:text-sm mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Your Referral Link
								</p>
								<div className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border ${isDark ? "bg-slate-900 border-white/10" : "bg-gray-50 border-gray-200"}`}>
									<input
										type="text"
										value={referralLink}
										readOnly
										className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${isDark ? "text-gray-300" : "text-gray-700"}`}
									/>
									<Button
										size="sm"
										className={`gap-2 text-xs sm:text-sm ${isDark ? "bg-white/10 text-gray-300 hover:bg-white/20" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
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
				<Card className={isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}>
					<CardHeader className="p-4 sm:p-6">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Recent Referrals
							</CardTitle>
							<Button
								variant="link"
								className="text-blue-400 hover:text-blue-300 p-0 text-sm sm:text-base"
							>
								View All
							</Button>
						</div>
					</CardHeader>
					<CardContent className="p-0 sm:p-6">
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className={`border-b ${isDark ? "border-white/10" : "border-gray-200"}`}>
										<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
											CUSTOMER
										</th>
										<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden sm:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
											DATE REFERRED
										</th>
										<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
											STATUS
										</th>
										<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden lg:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
											POTENTIAL EARNING
										</th>
										<th className={`text-left py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm hidden md:table-cell ${isDark ? "text-gray-300" : "text-gray-700"}`}>
											ACTION
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
											<td className="py-3 sm:py-4 px-2 sm:px-4 hidden sm:table-cell">
												<span className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
													{new Date(referral.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
												</span>
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
											<td className="py-3 sm:py-4 px-2 sm:px-4 hidden lg:table-cell">
												<span className={`font-medium text-xs sm:text-sm ${isDark ? "text-white" : "text-gray-900"}`}>
													Rp {referral.commission.toLocaleString('id-ID')}
												</span>
											</td>
											<td className="py-3 sm:py-4 px-2 sm:px-4 hidden md:table-cell">
												<Button
													variant="link"
													className="text-blue-400 hover:text-blue-300 p-0 gap-1 text-xs sm:text-sm"
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
									))}
									{referrals.length === 0 && (
										<tr>
											<td colSpan={5} className={`py-8 text-center ${isDark ? "text-gray-400" : "text-gray-500"}`}>
												No referrals yet. Start sharing your referral link!
											</td>
										</tr>
									)}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			</main>
		</>
	);
}
