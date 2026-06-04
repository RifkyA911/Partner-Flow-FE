"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaNetworkWired, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoQrCodeOutline } from "react-icons/io5";
import { HiOutlineClipboardCopy } from "react-icons/hi";

interface ReferralToolsProps {
	referralLink: string;
	isDark: boolean;
	onCopy: (text: string) => void;
	onShare: (platform: string) => void;
}

export function ReferralTools({ referralLink, isDark, onCopy, onShare }: ReferralToolsProps) {
	return (
		<Card className={`mb-6 sm:mb-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"}`}>
			<CardHeader className="p-4 sm:p-6">
				<div className="flex items-center gap-3">
					<FaNetworkWired className={`w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-700"}`} />
					<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
						Referral Tools
					</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="p-4 sm:p-6">
				{/* Referral Link */}
				<h3 className={`font-medium mb-3 text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
					Your Referral Link
				</h3>
				<div className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border ${isDark ? "bg-slate-900 border-white/10" : "bg-gray-50 border-gray-200"}`}>
					<input
						type="text"
						readOnly
						value={referralLink}
						className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${isDark ? "text-gray-300" : "text-gray-700"}`}
					/>
					<div className="flex gap-2">
						<Button
							size="sm"
							className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
							onClick={() => onCopy(referralLink)}
						>
							<HiOutlineClipboardCopy className="w-4 h-4" />
							Copy
						</Button>
						<Button
							size="sm"
							className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						>
							<IoQrCodeOutline className="w-4 h-4" />
							QR
						</Button>
					</div>
				</div>

				{/* Social Sharing */}
				<h3 className={`font-medium mb-3 text-sm sm:text-base mt-6 ${isDark ? "text-white" : "text-gray-900"}`}>
					Share on Social Media
				</h3>
				<div className="flex flex-wrap gap-2">
					<Button
						size="sm"
						className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onShare("facebook")}
					>
						<FaFacebook className="w-4 h-4" />
						Facebook
					</Button>
					<Button
						size="sm"
						className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onShare("twitter")}
					>
						<FaTwitter className="w-4 h-4" />
						Twitter
					</Button>
					<Button
						size="sm"
						className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onShare("linkedin")}
					>
						<FaLinkedin className="w-4 h-4" />
						LinkedIn
					</Button>
					<Button
						size="sm"
						className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onShare("whatsapp")}
					>
						<FaWhatsapp className="w-4 h-4" />
						WhatsApp
					</Button>
					<Button
						size="sm"
						className={`gap-2 bg-transparent text-xs sm:text-sm ${isDark ? "border-white/20 text-gray-300 hover:bg-white/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"}`}
						onClick={() => onShare("email")}
					>
						<FaEnvelope className="w-4 h-4" />
						Email
					</Button>
				</div>

				<p className={`text-xs sm:text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
					Share your unique referral link and earn commissions for every successful referral.
				</p>
			</CardContent>
		</Card>
	);
}
