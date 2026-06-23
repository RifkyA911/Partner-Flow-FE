"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaNetworkWired, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { IoQrCodeOutline } from "react-icons/io5";
import { FaRegCopy } from "react-icons/fa";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ReferralToolsProps {
	referralLink: string;
	isDark: boolean;
	onCopy: (text: string) => void;
	onShare: (platform: string) => void;
}

export function ReferralTools({ referralLink, isDark, onCopy, onShare }: ReferralToolsProps) {
	return (
		<TooltipProvider>
			<Card className={`mb-6 sm:mb-8 ${isDark ? "bg-white/5 border-white/10" : "bg-white border-gray-200"} transition-all duration-300 hover:shadow-lg`}>
				<CardHeader className="p-4 sm:p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
								<FaNetworkWired className="w-5 h-5 text-white" />
							</div>
							<div>
								<CardTitle className={`text-lg sm:text-xl font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
									Referral Tools
								</CardTitle>
								<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Share and grow your network
								</p>
							</div>
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-4 sm:p-6 space-y-6">
					{/* Referral Link */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
								Your Unique Referral Link
							</h3>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 text-xs cursor-help">
										?
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-xs max-w-xs">
										Share this link with others. When they register using your link, you'll earn commissions on their successful conversions.
									</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<div className={`flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg border transition-all duration-300 ${isDark ? "bg-slate-900 border-white/10 hover:border-white/20" : "bg-gray-50 border-gray-200 hover:border-gray-300"}`}>
						<input
							type="text"
							readOnly
							value={referralLink}
							className={`flex-1 bg-transparent text-xs sm:text-sm outline-none ${isDark ? "text-gray-300" : "text-gray-700"}`}
						/>
						<div className="flex gap-2">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 ${isDark ? "border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:scale-105" : "border-blue-300 text-blue-600 hover:bg-blue-50 hover:scale-105"}`}
										onClick={() => onCopy(referralLink)}
									>
										<FaRegCopy className="w-4 h-4" />
										Copy
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Copy link to clipboard</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 ${isDark ? "border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:scale-105" : "border-purple-300 text-purple-600 hover:bg-purple-50 hover:scale-105"}`}
									>
										<IoQrCodeOutline className="w-4 h-4" />
										QR
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Generate QR code (coming soon)</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					{/* Social Sharing */}
					<div>
						<div className="flex items-center gap-2 mb-3">
							<h3 className={`font-semibold text-sm sm:text-base ${isDark ? "text-white" : "text-gray-900"}`}>
								Share on Social Media
							</h3>
							<Tooltip>
								<TooltipTrigger asChild>
									<span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-green-500/20 text-green-400 text-xs cursor-help">
										?
									</span>
								</TooltipTrigger>
								<TooltipContent>
									<p className="text-xs max-w-xs">
										Share your referral link on social platforms to reach more potential partners and increase your earnings.
									</p>
								</TooltipContent>
							</Tooltip>
						</div>
						<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 flex flex-col h-auto py-3 ${isDark
											? "border-blue-600/30 text-blue-400 hover:bg-blue-600/10 hover:scale-105"
											: "border-blue-300 text-blue-600 hover:bg-blue-50 hover:scale-105"
											}`}
										onClick={() => onShare("facebook")}
									>
										<FaFacebook className="w-5 h-5" />
										<span className="text-xs">Facebook</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share on Facebook</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 flex flex-col h-auto py-3 ${isDark
											? "border-sky-500/30 text-sky-400 hover:bg-sky-500/10 hover:scale-105"
											: "border-sky-300 text-sky-600 hover:bg-sky-50 hover:scale-105"
											}`}
										onClick={() => onShare("twitter")}
									>
										<FaTwitter className="w-5 h-5" />
										<span className="text-xs">Twitter</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share on Twitter</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 flex flex-col h-auto py-3 ${isDark
											? "border-blue-700/30 text-blue-500 hover:bg-blue-700/10 hover:scale-105"
											: "border-blue-700 text-blue-700 hover:bg-blue-50 hover:scale-105"
											}`}
										onClick={() => onShare("linkedin")}
									>
										<FaLinkedin className="w-5 h-5" />
										<span className="text-xs">LinkedIn</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share on LinkedIn</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 flex flex-col h-auto py-3 ${isDark
											? "border-green-600/30 text-green-400 hover:bg-green-600/10 hover:scale-105"
											: "border-green-300 text-green-600 hover:bg-green-50 hover:scale-105"
											}`}
										onClick={() => onShare("whatsapp")}
									>
										<FaWhatsapp className="w-5 h-5" />
										<span className="text-xs">WhatsApp</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share on WhatsApp</p>
								</TooltipContent>
							</Tooltip>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										size="sm"
										className={`gap-2 bg-transparent text-xs sm:text-sm transition-all duration-300 flex flex-col h-auto py-3 ${isDark
											? "border-gray-500/30 text-gray-400 hover:bg-gray-500/10 hover:scale-105"
											: "border-gray-300 text-gray-600 hover:bg-gray-50 hover:scale-105"
											}`}
										onClick={() => onShare("email")}
									>
										<FaEnvelope className="w-5 h-5" />
										<span className="text-xs">Email</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Share via Email</p>
								</TooltipContent>
							</Tooltip>
						</div>
					</div>

					{/* Info Box */}
					<div className={`p-4 rounded-xl border ${isDark
						? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20"
						: "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
						}`}>
						<div className="flex items-start gap-3">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
								<FaNetworkWired className="w-4 h-4 text-white" />
							</div>
							<div>
								<h4 className={`font-semibold text-sm mb-1 ${isDark ? "text-white" : "text-gray-900"}`}>
									How Referrals Work
								</h4>
								<p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
									Share your unique referral link with friends, family, or on social media. When someone registers using your link and becomes an active partner, you'll earn commissions on their successful referrals. The more you share, the more you earn!
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</TooltipProvider >
	);
}
